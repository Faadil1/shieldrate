import type { ConnectedAPI, InitialAPI } from "@midnight-ntwrk/dapp-connector-api";
import { setNetworkId, type NetworkId } from "@midnight-ntwrk/midnight-js-network-id";
import semver from "semver";

const COMPATIBLE_CONNECTOR_API_VERSION = "4.x";

export interface MidnightWalletSession {
  connectedAPI: ConnectedAPI;
  networkId: NetworkId;
  shieldedAddress: string;
  shieldedCoinPublicKey: string;
  shieldedEncryptionPublicKey: string;
  proverServerUri: string;
  indexerUri: string;
  indexerWsUri: string;
}

let currentSession: MidnightWalletSession | null = null;

const sleep = (milliseconds: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, milliseconds));

const injectedWallets = (): Record<string, InitialAPI> => {
  const candidate = window as Window & { midnight?: Record<string, InitialAPI> };
  return candidate.midnight ?? {};
};

const firstCompatibleWallet = (): InitialAPI | undefined =>
  Object.values(injectedWallets()).find(
    (wallet) =>
      wallet &&
      typeof wallet.apiVersion === "string" &&
      semver.satisfies(wallet.apiVersion, COMPATIBLE_CONNECTOR_API_VERSION),
  );

export async function connectMidnightWallet(
  networkId: NetworkId,
): Promise<MidnightWalletSession> {
  setNetworkId(networkId);

  const deadline = Date.now() + 3_000;
  let wallet = firstCompatibleWallet();
  while (!wallet && Date.now() < deadline) {
    await sleep(100);
    wallet = firstCompatibleWallet();
  }

  if (!wallet) {
    throw new Error(
      "No compatible Midnight wallet found. Install/open Lace with DApp Connector API 4.x.",
    );
  }

  const connectedAPI = await wallet.connect(networkId);
  const configuration = await connectedAPI.getConfiguration();
  const addresses = await connectedAPI.getShieldedAddresses();

  if (!configuration.proverServerUri) {
    throw new Error("The connected wallet did not provide a prover server URI.");
  }
  if (!configuration.indexerUri || !configuration.indexerWsUri) {
    throw new Error("The connected wallet did not provide Midnight indexer endpoints.");
  }

  currentSession = {
    connectedAPI,
    networkId,
    shieldedAddress: addresses.shieldedAddress,
    shieldedCoinPublicKey: addresses.shieldedCoinPublicKey,
    shieldedEncryptionPublicKey: addresses.shieldedEncryptionPublicKey,
    proverServerUri: configuration.proverServerUri,
    indexerUri: configuration.indexerUri,
    indexerWsUri: configuration.indexerWsUri,
  };

  return currentSession;
}

export function getMidnightWalletSession(): MidnightWalletSession {
  if (!currentSession) {
    throw new Error("Midnight wallet is not connected.");
  }
  return currentSession;
}

export function clearMidnightWalletSession(): void {
  currentSession = null;
}
