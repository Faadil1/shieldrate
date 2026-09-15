import type { ConnectedAPI, InitialAPI } from "@midnight-ntwrk/dapp-connector-api";
import { FetchZkConfigProvider } from "@midnight-ntwrk/midnight-js-fetch-zk-config-provider";
import { httpClientProofProvider } from "@midnight-ntwrk/midnight-js-http-client-proof-provider";
import { indexerPublicDataProvider } from "@midnight-ntwrk/midnight-js-indexer-public-data-provider";
import { setNetworkId, type NetworkId } from "@midnight-ntwrk/midnight-js-network-id";
import { fromHex, toHex } from "@midnight-ntwrk/midnight-js-protocol/compact-runtime";
import {
  Binding,
  type FinalizedTransaction,
  Proof,
  SignatureEnabled,
  Transaction,
  type TransactionId,
} from "@midnight-ntwrk/midnight-js-protocol/ledger";
import { createProofProvider, type UnboundTransaction } from "@midnight-ntwrk/midnight-js-types";
import { catchError, concatMap, filter, firstValueFrom, interval, map, take, throwError, timeout } from "rxjs";
import semver from "semver";
import { inMemoryPrivateStateProvider } from "./privateStateProvider";
import {
  shieldRatePrivateStateKey,
  type MidnightWalletSession,
  type ShieldRateCircuitKeys,
  type ShieldRatePrivateStateId,
  type ShieldRateProviders,
} from "./types";
import type { ShieldRatePrivateState } from "./witnesses";

const CONNECTOR_API_RANGE = "4.x";
const DEFAULT_NETWORK = "preprod";

const getWalletRegistry = (): Record<string, InitialAPI> | undefined =>
  (window as unknown as { midnight?: Record<string, InitialAPI> }).midnight;

const getFirstCompatibleWallet = (): InitialAPI | undefined => {
  const registry = getWalletRegistry();
  if (!registry) return undefined;
  return Object.values(registry).find(
    (wallet): wallet is InitialAPI =>
      !!wallet && typeof wallet === "object" && "apiVersion" in wallet && semver.satisfies(wallet.apiVersion, CONNECTOR_API_RANGE),
  );
};

export const connectToLace = async (networkId = import.meta.env.VITE_MIDNIGHT_NETWORK_ID || DEFAULT_NETWORK): Promise<ConnectedAPI> =>
  firstValueFrom(
    interval(100).pipe(
      map(() => getFirstCompatibleWallet()),
      filter((api): api is InitialAPI => !!api),
      take(1),
      timeout({ first: 5_000, with: () => throwError(() => new Error("Could not find a compatible Midnight wallet (Connector API 4.x).")) }),
      concatMap((api) => api.connect(networkId)),
      timeout({ first: 10_000, with: () => throwError(() => new Error("Midnight wallet did not respond to the connection request.")) }),
      catchError((error) => throwError(() => error instanceof Error ? error : new Error("Midnight wallet authorization failed."))),
    ),
  );

export const initializeShieldRateProviders = async (): Promise<{
  providers: ShieldRateProviders;
  wallet: MidnightWalletSession;
  connectedAPI: ConnectedAPI;
}> => {
  const requestedNetwork = (import.meta.env.VITE_MIDNIGHT_NETWORK_ID || DEFAULT_NETWORK) as NetworkId;
  setNetworkId(requestedNetwork);

  const connectedAPI = await connectToLace(requestedNetwork);
  const status = await connectedAPI.getConnectionStatus();
  if (status.status !== "connected") throw new Error("Midnight wallet connection did not reach connected state.");
  if (status.networkId !== requestedNetwork) {
    throw new Error(`Midnight network mismatch: requested ${requestedNetwork}, wallet connected to ${status.networkId}.`);
  }

  setNetworkId(status.networkId as NetworkId);
  const config = await connectedAPI.getConfiguration();
  if (!config.indexerUri || !config.indexerWsUri) throw new Error("Midnight wallet did not provide complete indexer endpoints.");

  const addresses = await connectedAPI.getShieldedAddresses();
  if (!addresses.shieldedCoinPublicKey || !addresses.shieldedEncryptionPublicKey) {
    throw new Error("Midnight wallet did not provide shielded public keys.");
  }

  const privateStateProvider = inMemoryPrivateStateProvider<ShieldRatePrivateStateId, ShieldRatePrivateState>();
  const zkConfigProvider = new FetchZkConfigProvider<ShieldRateCircuitKeys>(window.location.origin, fetch.bind(window));

  // Connector API v4 lets wallets such as 1AM expose a delegated proving provider.
  // Prefer it because it supports wallet-native / sponsored proving without local DUST.
  // Fall back to the legacy HTTP prover URI for Lace/local proof-server setups.
  const proofProvider = typeof connectedAPI.getProvingProvider === "function"
    ? createProofProvider(await connectedAPI.getProvingProvider(zkConfigProvider))
    : config.proverServerUri
      ? httpClientProofProvider(config.proverServerUri, zkConfigProvider)
      : (() => { throw new Error("No compatible Midnight proof provider is available from the connected wallet."); })();

  const providers: ShieldRateProviders = {
    privateStateProvider,
    zkConfigProvider,
    proofProvider,
    publicDataProvider: indexerPublicDataProvider(config.indexerUri, config.indexerWsUri),
    walletProvider: {
      getCoinPublicKey: () => addresses.shieldedCoinPublicKey,
      getEncryptionPublicKey: () => addresses.shieldedEncryptionPublicKey,
      balanceTx: async (tx: UnboundTransaction): Promise<FinalizedTransaction> => {
        const balanced = await connectedAPI.balanceUnsealedTransaction(toHex(tx.serialize()));
        return Transaction.deserialize<SignatureEnabled, Proof, Binding>("signature", "proof", "binding", fromHex(balanced.tx));
      },
    },
    midnightProvider: {
      submitTx: async (tx: FinalizedTransaction): Promise<TransactionId> => {
        await connectedAPI.submitTransaction(toHex(tx.serialize()));
        return tx.identifiers()[0];
      },
    },
  };

  return {
    providers,
    connectedAPI,
    wallet: {
      networkId: status.networkId,
      shieldedAddress: addresses.shieldedAddress ?? null,
      shieldedCoinPublicKey: addresses.shieldedCoinPublicKey,
      shieldedEncryptionPublicKey: addresses.shieldedEncryptionPublicKey,
    },
  };
};

export { shieldRatePrivateStateKey };
