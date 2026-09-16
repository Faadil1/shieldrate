import { createUnprovenCallTx, deployContract, findDeployedContract, submitTxAsync } from "@midnight-ntwrk/midnight-js-contracts";
import type { ContractAddress, JubjubPoint } from "@midnight-ntwrk/midnight-js-protocol/compact-runtime";
import { SucceedEntirely, type FinalizedTxData } from "@midnight-ntwrk/midnight-js-types";
import * as ShieldRateContract from "../../.compact-build/shieldrate/contract/index.js";
import { CompiledShieldRateContract } from "./contract";
import { shieldRatePrivateStateKey, type DeployedShieldRateContract, type ShieldRateProviders } from "./types";
import type { ShieldRatePrivateState } from "./witnesses";

export interface LiveVerificationRequest {
  employerScope: Uint8Array;
  jobScope: Uint8Array;
  claimCode: bigint;
  threshold: bigint;
  challenge: Uint8Array;
  requestExpiresAtEpoch: bigint;
}

export interface RegisterWorkRequestInput {
  jobScope: Uint8Array;
  policyCode: bigint;
  challenge: Uint8Array;
  requestNonce: Uint8Array;
  requestExpiresAtEpoch: bigint;
}

export interface RegisteredWorkRequestResult {
  workRequestId: Uint8Array;
  txId: string;
  blockHeight: number;
  contractAddress: ContractAddress;
}

export interface ProviderRegistryStatus {
  providerId: bigint;
  exists: boolean;
  publicKey: JubjubPoint | null;
  epoch: bigint | null;
  matchesExpectedKey: boolean | null;
}

export interface LiveVerificationReceipt {
  verificationId: Uint8Array;
  requestHash: Uint8Array;
  scopedSubject: Uint8Array;
  nullifier: Uint8Array;
  providerId: bigint;
  credentialExpiresAtEpoch: bigint;
  txId: string;
  blockHeight: number;
  contractAddress: ContractAddress;
}

export interface LiveWorkQualificationReceipt extends LiveVerificationReceipt {
  policyCode: bigint;
  workRequestId: Uint8Array;
}

type ShieldRateCallTx = {
  registerProvider(providerId: bigint, providerPk: JubjubPoint): Promise<{ public: FinalizedTxData }>;
  rotateProviderEpoch(providerId: bigint): Promise<{ public: FinalizedTxData }>;
  removeProvider(providerId: bigint): Promise<{ public: FinalizedTxData }>;
  registerWorkRequest(
    jobScope: Uint8Array,
    policyCode: bigint,
    challenge: Uint8Array,
    requestNonce: Uint8Array,
    requestExpiresAtEpoch: bigint,
  ): Promise<{ public: FinalizedTxData }>;
  cancelWorkRequest(workRequestId: Uint8Array): Promise<{ public: FinalizedTxData }>;
  verifyClaim(
    employerScope: Uint8Array,
    jobScope: Uint8Array,
    claimCode: bigint,
    threshold: bigint,
    challenge: Uint8Array,
    requestExpiresAtEpoch: bigint,
  ): Promise<{ public: FinalizedTxData }>;
  verifyRegisteredWorkPolicy(workRequestId: Uint8Array): Promise<{ public: FinalizedTxData }>;
};

const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const withTimeout = async <T>(promise: Promise<T>, ms: number, message: string): Promise<T> => {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_resolve, reject) => {
        timer = setTimeout(() => reject(new Error(message)), ms);
      }),
    ]);
  } finally {
    if (timer !== undefined) clearTimeout(timer);
  }
};

const bytesEqual = (a: Uint8Array, b: Uint8Array): boolean =>
  a.length === b.length && a.every((value, index) => value === b[index]);

export class ShieldRateAPI {
  private constructor(readonly deployedContract: DeployedShieldRateContract, readonly providers: ShieldRateProviders) {
    this.contractAddress = deployedContract.deployTxData.public.contractAddress;
    providers.privateStateProvider.setContractAddress(this.contractAddress);
  }

  readonly contractAddress: ContractAddress;

  private get callTx(): ShieldRateCallTx {
    return this.deployedContract.callTx as unknown as ShieldRateCallTx;
  }

  static async deploy(providers: ShieldRateProviders, privateState: ShieldRatePrivateState): Promise<ShieldRateAPI> {
    const deployed = await deployContract(providers as any, {
      compiledContract: CompiledShieldRateContract,
      privateStateId: shieldRatePrivateStateKey,
      initialPrivateState: privateState,
    });
    const api = new ShieldRateAPI(deployed as DeployedShieldRateContract, providers);
    await providers.privateStateProvider.set(shieldRatePrivateStateKey, privateState);
    return api;
  }

  static async join(providers: ShieldRateProviders, contractAddress: ContractAddress, privateState: ShieldRatePrivateState): Promise<ShieldRateAPI> {
    const deployed = await findDeployedContract(providers as any, {
      contractAddress,
      compiledContract: CompiledShieldRateContract,
      privateStateId: shieldRatePrivateStateKey,
      initialPrivateState: privateState,
    });
    const api = new ShieldRateAPI(deployed as DeployedShieldRateContract, providers);
    await providers.privateStateProvider.set(shieldRatePrivateStateKey, privateState);
    return api;
  }

  async setPrivateState(state: ShieldRatePrivateState): Promise<void> {
    await this.providers.privateStateProvider.set(shieldRatePrivateStateKey, state);
  }

  async providerStatus(providerId: bigint, expectedPk?: JubjubPoint): Promise<ProviderRegistryStatus> {
    const state = await this.providers.publicDataProvider.queryContractState(this.contractAddress);
    if (!state) throw new Error("ShieldRate contract state is unavailable.");
    const ledger = ShieldRateContract.ledger(state.data);
    if (!ledger.providers.member(providerId)) {
      return {
        providerId,
        exists: false,
        publicKey: null,
        epoch: ledger.providerEpochs.member(providerId) ? ledger.providerEpochs.lookup(providerId) : null,
        matchesExpectedKey: expectedPk ? false : null,
      };
    }

    const publicKey = ledger.providers.lookup(providerId);
    const epoch = ledger.providerEpochs.member(providerId) ? ledger.providerEpochs.lookup(providerId) : null;
    return {
      providerId,
      exists: true,
      publicKey,
      epoch,
      matchesExpectedKey: expectedPk
        ? publicKey.x === expectedPk.x && publicKey.y === expectedPk.y
        : null,
    };
  }

  async registerProvider(providerId: bigint, providerPk: JubjubPoint): Promise<FinalizedTxData> {
    return (await this.callTx.registerProvider(providerId, providerPk)).public;
  }

  async rotateProviderEpoch(providerId: bigint): Promise<FinalizedTxData> {
    return (await this.callTx.rotateProviderEpoch(providerId)).public;
  }

  async removeProvider(providerId: bigint): Promise<FinalizedTxData> {
    return (await this.callTx.removeProvider(providerId)).public;
  }

  async registerWorkRequest(request: RegisterWorkRequestInput): Promise<RegisteredWorkRequestResult> {
    const workRequestId = ShieldRateContract.pureCircuits.deriveWorkRequestId(
      request.jobScope,
      request.policyCode,
      request.challenge,
      request.requestNonce,
      request.requestExpiresAtEpoch,
    );

    // MidnightJS 4.1.1's callTx wrapper executes through Transaction.scoped().
    // In the browser this path can surface a false duplicate-job assertion even
    // when a fresh queryZSwapAndContractState() snapshot and a direct
    // createUnprovenCallTx() both show the job key as OPEN. Build this one call
    // explicitly, then prove/balance/submit once and reconcile against indexed
    // ledger state. No contract or circuit semantics are changed.
    const unproven = await createUnprovenCallTx(this.providers as any, {
      compiledContract: CompiledShieldRateContract,
      contractAddress: this.contractAddress,
      circuitId: "registerWorkRequest" as any,
      privateStateId: shieldRatePrivateStateKey,
      args: [
        request.jobScope,
        request.policyCode,
        request.challenge,
        request.requestNonce,
        request.requestExpiresAtEpoch,
      ] as any,
    } as any);

    const circuitResult = unproven.private.result as Uint8Array;
    if (!(circuitResult instanceof Uint8Array) || !bytesEqual(circuitResult, workRequestId)) {
      throw new Error("Prepared work-request circuit returned an unexpected work request id. Nothing was submitted.");
    }

    const txId = String(await submitTxAsync(this.providers as any, {
      unprovenTx: unproven.private.unprovenTx,
      circuitId: "registerWorkRequest" as any,
    }));

    let finalized: FinalizedTxData | null = null;
    try {
      finalized = await withTimeout(
        this.providers.publicDataProvider.watchForTxData(txId as any),
        60_000,
        "Work request submission is still waiting for transaction finalization.",
      ) as FinalizedTxData;
    } catch {
      // Reconcile below against indexed contract state before deciding whether a
      // retry is safe. A submitted transaction is never automatically repeated.
    }

    const deadline = Date.now() + 60_000;
    let exists = await this.workRequestExists(workRequestId);
    while (!exists && Date.now() < deadline) {
      await delay(2_000);
      exists = await this.workRequestExists(workRequestId);
    }

    if (!exists) {
      throw new Error(
        `Work request tx ${txId} was submitted but the expected request is not indexed yet. ` +
        `Do not retry. Reconcile this tx/request before creating another commit.`,
      );
    }

    if (!finalized) {
      finalized = await withTimeout(
        this.providers.publicDataProvider.watchForTxData(txId as any),
        15_000,
        `Work request ${workRequestId} is indexed, but tx metadata for ${txId} is not available yet. Do not retry.`,
      ) as FinalizedTxData;
    }

    if (finalized.status !== SucceedEntirely) {
      throw new Error(`Work request tx ${txId} finalized with status ${String(finalized.status)}. Do not retry automatically.`);
    }

    await this.providers.privateStateProvider.set(shieldRatePrivateStateKey, unproven.private.nextPrivateState);

    return {
      workRequestId,
      txId,
      blockHeight: finalized.blockHeight,
      contractAddress: this.contractAddress,
    };
  }

  async cancelWorkRequest(workRequestId: Uint8Array): Promise<FinalizedTxData> {
    return (await this.callTx.cancelWorkRequest(workRequestId)).public;
  }

  async verifyClaim(request: LiveVerificationRequest, state: ShieldRatePrivateState): Promise<LiveVerificationReceipt> {
    await this.setPrivateState(state);
    const requestHash = ShieldRateContract.pureCircuits.deriveRequestHash(
      request.employerScope,
      request.jobScope,
      request.claimCode,
      request.threshold,
      request.challenge,
      request.requestExpiresAtEpoch,
    );
    const scopedSubject = ShieldRateContract.pureCircuits.deriveScopedSubject(state.holderSecret, request.employerScope, request.jobScope);
    const nullifier = ShieldRateContract.pureCircuits.deriveNullifier(state.holderSecret, requestHash);
    const verificationId = ShieldRateContract.pureCircuits.deriveVerificationId(requestHash, scopedSubject, nullifier);

    const tx = await this.callTx.verifyClaim(
      request.employerScope,
      request.jobScope,
      request.claimCode,
      request.threshold,
      request.challenge,
      request.requestExpiresAtEpoch,
    );
    if (!(await this.receiptExists(verificationId))) throw new Error("Midnight transaction finalized but ShieldRate receipt was not found in indexed ledger state.");

    return {
      verificationId,
      requestHash,
      scopedSubject,
      nullifier,
      providerId: state.attestationProviderId,
      credentialExpiresAtEpoch: state.credential.expiresAtEpoch,
      txId: String(tx.public.txId),
      blockHeight: tx.public.blockHeight,
      contractAddress: this.contractAddress,
    };
  }

  async verifyRegisteredWorkPolicy(workRequestId: Uint8Array, state: ShieldRatePrivateState): Promise<LiveWorkQualificationReceipt> {
    await this.setPrivateState(state);
    const chainState = await this.providers.publicDataProvider.queryContractState(this.contractAddress);
    if (!chainState) throw new Error("ShieldRate contract state is unavailable.");
    const ledger = ShieldRateContract.ledger(chainState.data);
    if (!ledger.workRequests.member(workRequestId)) throw new Error("Unknown ShieldRate work request.");
    const request = ledger.workRequests.lookup(workRequestId);

    const scopedSubject = ShieldRateContract.pureCircuits.deriveScopedSubject(
      state.holderSecret,
      request.employerPkh,
      request.jobScope,
    );
    const nullifier = ShieldRateContract.pureCircuits.deriveWorkPolicyNullifier(
      state.holderSecret,
      request.employerPkh,
      request.jobScope,
    );
    const verificationId = ShieldRateContract.pureCircuits.deriveWorkPolicyVerificationId(
      workRequestId,
      scopedSubject,
      nullifier,
    );

    const tx = await this.callTx.verifyRegisteredWorkPolicy(workRequestId);
    if (!(await this.workReceiptExists(verificationId))) {
      throw new Error("Midnight transaction finalized but the ShieldRate qualification receipt was not found in indexed ledger state.");
    }

    return {
      verificationId,
      requestHash: workRequestId,
      workRequestId,
      scopedSubject,
      nullifier,
      providerId: state.attestationProviderId,
      credentialExpiresAtEpoch: state.credential.expiresAtEpoch,
      policyCode: request.policyCode,
      txId: String(tx.public.txId),
      blockHeight: tx.public.blockHeight,
      contractAddress: this.contractAddress,
    };
  }

  async receiptExists(verificationId: Uint8Array): Promise<boolean> {
    const state = await this.providers.publicDataProvider.queryContractState(this.contractAddress);
    return !!state && ShieldRateContract.ledger(state.data).receipts.member(verificationId);
  }

  async workRequestExists(workRequestId: Uint8Array): Promise<boolean> {
    const state = await this.providers.publicDataProvider.queryContractState(this.contractAddress);
    return !!state && ShieldRateContract.ledger(state.data).workRequests.member(workRequestId);
  }

  async workReceiptExists(verificationId: Uint8Array): Promise<boolean> {
    const state = await this.providers.publicDataProvider.queryContractState(this.contractAddress);
    return !!state && ShieldRateContract.ledger(state.data).workReceipts.member(verificationId);
  }
}
