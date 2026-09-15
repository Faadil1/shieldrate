import { deployContract, findDeployedContract } from "@midnight-ntwrk/midnight-js-contracts";
import { FetchZkConfigProvider } from "@midnight-ntwrk/midnight-js-fetch-zk-config-provider";
import { httpClientProofProvider } from "@midnight-ntwrk/midnight-js-http-client-proof-provider";
import { indexerPublicDataProvider } from "@midnight-ntwrk/midnight-js-indexer-public-data-provider";
import {
  fromHex,
  toHex,
  type ContractAddress,
} from "@midnight-ntwrk/midnight-js-protocol/compact-runtime";
import {
  Binding,
  Proof,
  SignatureEnabled,
  Transaction,
  type FinalizedTransaction,
  type TransactionId,
} from "@midnight-ntwrk/midnight-js-protocol/ledger";
import type { MidnightProviders, UnboundTransaction } from "@midnight-ntwrk/midnight-js-types";
import { firstValueFrom, take } from "rxjs";
import type { ProofRequest, ProofType } from "../types";
import { sha256 } from "../utils/crypto";
import { requestIssuerAttestation, type IssuerProviderInfo, type LiveAttestation } from "./attestation";
import {
  CompiledShieldRateContract,
  ShieldRateGenerated,
  createEmptyPrivateState,
  type ShieldRatePrivateState,
} from "./contract";
import { inMemoryPrivateStateProvider } from "./in-memory-private-state-provider";
import type { MidnightWalletSession } from "./wallet";

export const shieldRatePrivateStateId = "shieldratePrivateState" as const;
export type ShieldRateCircuitKeys =
  | "registerProvider"
  | "rotateProviderEpoch"
  | "removeProvider"
  | "verifyClaim"
  | "receiptExists";
export type ShieldRateProviders = MidnightProviders<
  ShieldRateCircuitKeys,
  typeof shieldRatePrivateStateId,
  ShieldRatePrivateState
>;

export interface LiveVerificationTx {
  verificationId: string;
  requestHash: string;
  scopedSubject: string;
  nullifier: string;
  txHash: string;
  blockHeight: number;
  contractAddress: string;
  providerId: bigint;
  credentialExpiresAtEpoch: bigint;
}

const secretFromStorage = (key: string): Uint8Array => {
  const stored = localStorage.getItem(key);
  if (stored) {
    return Uint8Array.from(atob(stored), (character) => character.charCodeAt(0));
  }
  const secret = crypto.getRandomValues(new Uint8Array(32));
  localStorage.setItem(key, btoa(String.fromCharCode(...secret)));
  return secret;
};

export const createBrowserPrivateState = (): ShieldRatePrivateState =>
  createEmptyPrivateState(
    secretFromStorage("shieldrate:holder-secret:v1"),
    secretFromStorage("shieldrate:admin-secret:v1"),
  );

export function initializeShieldRateProviders(
  session: MidnightWalletSession,
  assetBaseUrl: string,
): ShieldRateProviders {
  const zkConfigProvider = new FetchZkConfigProvider<ShieldRateCircuitKeys>(
    assetBaseUrl,
    fetch.bind(window),
  );

  return {
    privateStateProvider: inMemoryPrivateStateProvider<
      typeof shieldRatePrivateStateId,
      ShieldRatePrivateState
    >(),
    zkConfigProvider,
    proofProvider: httpClientProofProvider(session.proverServerUri, zkConfigProvider),
    publicDataProvider: indexerPublicDataProvider(session.indexerUri, session.indexerWsUri),
    walletProvider: {
      getCoinPublicKey: () => session.shieldedCoinPublicKey,
      getEncryptionPublicKey: () => session.shieldedEncryptionPublicKey,
      balanceTx: async (tx: UnboundTransaction): Promise<FinalizedTransaction> => {
        const received = await session.connectedAPI.balanceUnsealedTransaction(toHex(tx.serialize()));
        return Transaction.deserialize<SignatureEnabled, Proof, Binding>(
          "signature",
          "proof",
          "binding",
          fromHex(received.tx),
        );
      },
    },
    midnightProvider: {
      submitTx: async (tx: FinalizedTransaction): Promise<TransactionId> => {
        await session.connectedAPI.submitTransaction(toHex(tx.serialize()));
        return tx.identifiers()[0];
      },
    },
  };
}

const claimCode = (type: ProofType): bigint => {
  if (type === "income") return 1n;
  if (type === "reputation") return 2n;
  return 3n;
};

const contractThreshold = (type: ProofType, threshold: number): bigint =>
  type === "reputation" ? BigInt(Math.round(threshold * 100)) : BigInt(threshold);

const scopeBytes = (namespace: "employer" | "job", value: string): Uint8Array =>
  fromHex(sha256(`shieldrate:${namespace}:scope:v1|${value}`));

const challengeBytes = (challenge: string): Uint8Array => {
  if (!/^[0-9a-f]{64}$/i.test(challenge)) {
    throw new Error("Midnight live challenges must be exactly 32 bytes of hex.");
  }
  return fromHex(challenge);
};

export class ShieldRateMidnightAPI {
  private constructor(
    private readonly deployedContract: any,
    private readonly providers: ShieldRateProviders,
  ) {
    this.contractAddress = deployedContract.deployTxData.public.contractAddress as ContractAddress;
    providers.privateStateProvider.setContractAddress(this.contractAddress);
  }

  readonly contractAddress: ContractAddress;

  static async join(
    providers: ShieldRateProviders,
    contractAddress: ContractAddress,
    privateState = createBrowserPrivateState(),
  ): Promise<ShieldRateMidnightAPI> {
    const deployedContract = await findDeployedContract(providers as any, {
      contractAddress,
      compiledContract: CompiledShieldRateContract,
      privateStateId: shieldRatePrivateStateId,
      initialPrivateState: privateState,
    });
    const api = new ShieldRateMidnightAPI(deployedContract, providers);
    await providers.privateStateProvider.set(shieldRatePrivateStateId, privateState);
    return api;
  }

  static async deploy(
    providers: ShieldRateProviders,
    privateState = createBrowserPrivateState(),
  ): Promise<ShieldRateMidnightAPI> {
    const deployedContract = await deployContract(providers as any, {
      compiledContract: CompiledShieldRateContract,
      privateStateId: shieldRatePrivateStateId,
      initialPrivateState: privateState,
    });
    const api = new ShieldRateMidnightAPI(deployedContract, providers);
    await providers.privateStateProvider.set(shieldRatePrivateStateId, privateState);
    return api;
  }

  async holderBindingField(): Promise<bigint> {
    const state = await this.requirePrivateState();
    return ShieldRateGenerated.pureCircuits.deriveHolderBindingField(state.holderSecret);
  }

  async registerProvider(info: IssuerProviderInfo): Promise<{ txHash: string; blockHeight: number }> {
    const txData = await this.deployedContract.callTx.registerProvider(
      info.providerId,
      info.publicKey,
    );
    return {
      txHash: txData.public.txHash,
      blockHeight: Number(txData.public.blockHeight),
    };
  }

  async verifyClaim(
    request: Required<ProofRequest>,
    attestationUrl: string,
  ): Promise<LiveVerificationTx> {
    const state = await this.requirePrivateState();
    const holderBindingField = ShieldRateGenerated.pureCircuits.deriveHolderBindingField(
      state.holderSecret,
    );
    const attestation = await requestIssuerAttestation(attestationUrl, holderBindingField);
    await this.installAttestation(attestation);

    const employerScope = scopeBytes("employer", request.employerId);
    const jobScope = scopeBytes("job", request.jobId);
    const code = claimCode(request.type);
    const threshold = contractThreshold(request.type, request.threshold);
    const challenge = challengeBytes(request.challenge);
    const requestExpiresAtEpoch = BigInt(
      Math.floor(new Date(request.requestExpiresAt).getTime() / 1000),
    );

    const requestHashBytes = ShieldRateGenerated.pureCircuits.deriveRequestHash(
      employerScope,
      jobScope,
      code,
      threshold,
      challenge,
      requestExpiresAtEpoch,
    );
    const scopedSubjectBytes = ShieldRateGenerated.pureCircuits.deriveScopedSubject(
      state.holderSecret,
      employerScope,
      jobScope,
    );
    const nullifierBytes = ShieldRateGenerated.pureCircuits.deriveNullifier(
      state.holderSecret,
      requestHashBytes,
    );
    const expectedVerificationId = ShieldRateGenerated.pureCircuits.deriveVerificationId(
      requestHashBytes,
      scopedSubjectBytes,
      nullifierBytes,
    );

    const txData = await this.deployedContract.callTx.verifyClaim(
      employerScope,
      jobScope,
      code,
      threshold,
      challenge,
      requestExpiresAtEpoch,
    );

    const returnedVerificationId = txData.private.result as Uint8Array;
    if (toHex(returnedVerificationId) !== toHex(expectedVerificationId)) {
      throw new Error("Midnight returned an unexpected verification id.");
    }

    return {
      verificationId: toHex(returnedVerificationId),
      requestHash: toHex(requestHashBytes),
      scopedSubject: toHex(scopedSubjectBytes),
      nullifier: toHex(nullifierBytes),
      txHash: txData.public.txHash,
      blockHeight: Number(txData.public.blockHeight),
      contractAddress: this.contractAddress,
      providerId: attestation.providerId,
      credentialExpiresAtEpoch: attestation.credential.expiresAtEpoch,
    };
  }

  async receiptExists(verificationId: string): Promise<boolean> {
    const contractState = await firstValueFrom(
      this.providers.publicDataProvider
        .contractStateObservable(this.contractAddress, { type: "latest" })
        .pipe(take(1)),
    );
    const ledgerState = ShieldRateGenerated.ledger(contractState.data);
    for (const [key] of ledgerState.receipts) {
      if (toHex(key) === verificationId) return true;
    }
    return false;
  }

  private async requirePrivateState(): Promise<ShieldRatePrivateState> {
    const state = await this.providers.privateStateProvider.get(shieldRatePrivateStateId);
    if (!state) throw new Error("ShieldRate private state is unavailable.");
    return state;
  }

  private async installAttestation(attestation: LiveAttestation): Promise<void> {
    const state = await this.requirePrivateState();
    await this.providers.privateStateProvider.set(shieldRatePrivateStateId, {
      ...state,
      credential: attestation.credential,
      attestationSignature: attestation.signature,
      attestationProviderId: attestation.providerId,
    });
  }
}
