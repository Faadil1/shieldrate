import { deployContract, findDeployedContract } from "@midnight-ntwrk/midnight-js-contracts";
import type { ContractAddress, JubjubPoint } from "@midnight-ntwrk/midnight-js-protocol/compact-runtime";
import type { FinalizedTxData } from "@midnight-ntwrk/midnight-js-types";
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

export interface LiveWorkPolicyRequest {
  employerScope: Uint8Array;
  jobScope: Uint8Array;
  policyCode: bigint;
  challenge: Uint8Array;
  requestExpiresAtEpoch: bigint;
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
}

type ShieldRateCallTx = {
  registerProvider(providerId: bigint, providerPk: JubjubPoint): Promise<{ public: FinalizedTxData }>;
  rotateProviderEpoch(providerId: bigint): Promise<{ public: FinalizedTxData }>;
  removeProvider(providerId: bigint): Promise<{ public: FinalizedTxData }>;
  verifyClaim(
    employerScope: Uint8Array,
    jobScope: Uint8Array,
    claimCode: bigint,
    threshold: bigint,
    challenge: Uint8Array,
    requestExpiresAtEpoch: bigint,
  ): Promise<{ public: FinalizedTxData }>;
  verifyWorkPolicy(
    employerScope: Uint8Array,
    jobScope: Uint8Array,
    policyCode: bigint,
    challenge: Uint8Array,
    requestExpiresAtEpoch: bigint,
  ): Promise<{ public: FinalizedTxData }>;
};

export class ShieldRateAPI {
  private constructor(
    readonly deployedContract: DeployedShieldRateContract,
    readonly providers: ShieldRateProviders,
  ) {
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

  static async join(
    providers: ShieldRateProviders,
    contractAddress: ContractAddress,
    privateState: ShieldRatePrivateState,
  ): Promise<ShieldRateAPI> {
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

  async registerProvider(providerId: bigint, providerPk: JubjubPoint): Promise<FinalizedTxData> {
    const tx = await this.callTx.registerProvider(providerId, providerPk);
    return tx.public;
  }

  async rotateProviderEpoch(providerId: bigint): Promise<FinalizedTxData> {
    const tx = await this.callTx.rotateProviderEpoch(providerId);
    return tx.public;
  }

  async removeProvider(providerId: bigint): Promise<FinalizedTxData> {
    const tx = await this.callTx.removeProvider(providerId);
    return tx.public;
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
    const scopedSubject = ShieldRateContract.pureCircuits.deriveScopedSubject(
      state.holderSecret,
      request.employerScope,
      request.jobScope,
    );
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

    const exists = await this.receiptExists(verificationId);
    if (!exists) throw new Error("Midnight transaction finalized but ShieldRate receipt was not found in the indexed ledger state.");

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

  // Flagship V4 path: one employer policy, one all-or-nothing private proof,
  // one indexed QUALIFIED receipt. No component result reaches the ledger.
  async verifyWorkPolicy(
    request: LiveWorkPolicyRequest,
    state: ShieldRatePrivateState,
  ): Promise<LiveWorkQualificationReceipt> {
    await this.setPrivateState(state);

    const requestHash = ShieldRateContract.pureCircuits.deriveWorkPolicyRequestHash(
      request.employerScope,
      request.jobScope,
      request.policyCode,
      request.challenge,
      request.requestExpiresAtEpoch,
    );
    const scopedSubject = ShieldRateContract.pureCircuits.deriveScopedSubject(
      state.holderSecret,
      request.employerScope,
      request.jobScope,
    );
    const nullifier = ShieldRateContract.pureCircuits.deriveWorkPolicyNullifier(
      state.holderSecret,
      request.employerScope,
      request.jobScope,
      request.policyCode,
    );
    const verificationId = ShieldRateContract.pureCircuits.deriveWorkPolicyVerificationId(
      requestHash,
      scopedSubject,
      nullifier,
    );

    const tx = await this.callTx.verifyWorkPolicy(
      request.employerScope,
      request.jobScope,
      request.policyCode,
      request.challenge,
      request.requestExpiresAtEpoch,
    );

    const exists = await this.workReceiptExists(verificationId);
    if (!exists) {
      throw new Error("Midnight transaction finalized but the ShieldRate work-qualification receipt was not found in indexed ledger state.");
    }

    return {
      verificationId,
      requestHash,
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
    if (!state) return false;
    return ShieldRateContract.ledger(state.data).receipts.member(verificationId);
  }

  async workReceiptExists(verificationId: Uint8Array): Promise<boolean> {
    const state = await this.providers.publicDataProvider.queryContractState(this.contractAddress);
    if (!state) return false;
    return ShieldRateContract.ledger(state.data).workReceipts.member(verificationId);
  }
}
