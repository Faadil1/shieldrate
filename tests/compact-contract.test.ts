import { describe, expect, it } from "vitest";
import {
  createCircuitContext,
  createConstructorContext,
  ecMulGenerator,
  sampleContractAddress,
  type CircuitContext,
} from "@midnight-ntwrk/midnight-js-protocol/compact-runtime";
import {
  Contract,
  ledger,
} from "../.compact-build/shieldrate/contract/index.js";
import {
  createShieldRatePrivateState,
  type ShieldRatePrivateState,
  witnesses,
} from "../src/midnight/witnesses";

const NOW_MS = 1_800_000_000_000;
const EMPLOYER_PK_HEX = "11".repeat(32);
const HOLDER_SECRET = new Uint8Array(32).fill(2);
const ADMIN_SECRET = new Uint8Array(32).fill(3);
const bytes32 = (fill: number) => new Uint8Array(32).fill(fill);

class CompiledShieldRateHarness {
  readonly contract = new Contract<ShieldRatePrivateState>(witnesses);
  context: CircuitContext<ShieldRatePrivateState>;

  constructor(nowMs = NOW_MS) {
    const privateState = createShieldRatePrivateState(HOLDER_SECRET, ADMIN_SECRET);
    const initial = this.contract.initialState(
      createConstructorContext(privateState, EMPLOYER_PK_HEX),
    );
    this.context = createCircuitContext(
      sampleContractAddress(),
      initial.currentZswapLocalState,
      initial.currentContractState,
      initial.currentPrivateState,
      undefined,
      undefined,
      nowMs,
    );
  }

  get state() {
    return ledger(this.context.currentQueryContext.state);
  }

  registerWorkRequest(
    jobScope: Uint8Array,
    policyCode: bigint,
    challenge: Uint8Array,
    requestNonce: Uint8Array,
    expiresAtMs: bigint,
  ) {
    const result = this.contract.impureCircuits.registerWorkRequest(
      this.context,
      jobScope,
      policyCode,
      challenge,
      requestNonce,
      expiresAtMs,
    );
    this.context = result.context;
    return result.result;
  }

  cancelWorkRequest(workRequestId: Uint8Array) {
    const result = this.contract.impureCircuits.cancelWorkRequest(this.context, workRequestId);
    this.context = result.context;
  }

  registerProvider(providerId: bigint) {
    const result = this.contract.impureCircuits.registerProvider(
      this.context,
      providerId,
      ecMulGenerator(7n),
    );
    this.context = result.context;
  }

  removeProvider(providerId: bigint) {
    const result = this.contract.impureCircuits.removeProvider(this.context, providerId);
    this.context = result.context;
  }

  rotateProviderEpoch(providerId: bigint) {
    const result = this.contract.impureCircuits.rotateProviderEpoch(this.context, providerId);
    this.context = result.context;
  }
}

describe("compiled Compact contract — Commit-Before-Know invariants", () => {
  it("accepts a future Unix-millisecond expiry and stores the registered request", () => {
    const h = new CompiledShieldRateHarness();
    const workRequestId = h.registerWorkRequest(
      bytes32(1),
      2n,
      bytes32(2),
      bytes32(3),
      BigInt(NOW_MS + 90_000),
    );

    expect(h.state.workRequests.member(workRequestId)).toBe(true);
    expect(h.state.workRequests.lookup(workRequestId).policyCode).toBe(2n);
    expect(h.state.totalWorkRequests).toBe(1n);
  });

  it("rejects second-based timestamps at the Compact time boundary", () => {
    const h = new CompiledShieldRateHarness();
    const secondsInsteadOfMilliseconds = BigInt(Math.floor((NOW_MS + 90_000) / 1000));

    expect(() => h.registerWorkRequest(
      bytes32(4),
      2n,
      bytes32(5),
      bytes32(6),
      secondsInsteadOfMilliseconds,
    )).toThrow(/expired/i);

    expect(h.state.totalWorkRequests).toBe(0n);
  });

  it("fixes one policy per employer/job and rejects policy probing", () => {
    const h = new CompiledShieldRateHarness();
    h.registerWorkRequest(
      bytes32(7),
      1n,
      bytes32(8),
      bytes32(9),
      BigInt(NOW_MS + 120_000),
    );

    expect(() => h.registerWorkRequest(
      bytes32(7),
      3n,
      bytes32(10),
      bytes32(11),
      BigInt(NOW_MS + 120_000),
    )).toThrow(/standard already fixed/i);

    expect(h.state.totalWorkRequests).toBe(1n);
  });

  it("keeps distinct job scopes independent for the same employer", () => {
    const h = new CompiledShieldRateHarness();
    const firstWorkRequestId = h.registerWorkRequest(
      bytes32(21),
      2n,
      bytes32(22),
      bytes32(23),
      BigInt(NOW_MS + 120_000),
    );
    const secondWorkRequestId = h.registerWorkRequest(
      bytes32(24),
      2n,
      bytes32(25),
      bytes32(26),
      BigInt(NOW_MS + 120_000),
    );

    expect(h.state.workRequests.member(firstWorkRequestId)).toBe(true);
    expect(h.state.workRequests.member(secondWorkRequestId)).toBe(true);
    expect(h.state.totalWorkRequests).toBe(2n);
  });

  it("cancellation closes the request without reopening the employer/job policy slot", () => {
    const h = new CompiledShieldRateHarness();
    const jobScope = bytes32(12);
    const workRequestId = h.registerWorkRequest(
      jobScope,
      2n,
      bytes32(13),
      bytes32(14),
      BigInt(NOW_MS + 120_000),
    );

    h.cancelWorkRequest(workRequestId);
    expect(h.state.cancelledWorkRequests.member(workRequestId)).toBe(true);
    expect(() => h.cancelWorkRequest(workRequestId)).toThrow(/already cancelled/i);
    expect(() => h.registerWorkRequest(
      jobScope,
      1n,
      bytes32(15),
      bytes32(16),
      BigInt(NOW_MS + 120_000),
    )).toThrow(/standard already fixed/i);
  });

  it("keeps provider epochs monotonic across remove and re-register", () => {
    const h = new CompiledShieldRateHarness();
    h.registerProvider(1n);
    expect(h.state.providerEpochs.lookup(1n)).toBe(0n);

    h.removeProvider(1n);
    expect(h.state.providers.member(1n)).toBe(false);
    expect(h.state.providerEpochs.lookup(1n)).toBe(1n);

    h.registerProvider(1n);
    expect(h.state.providerEpochs.lookup(1n)).toBe(1n);

    h.rotateProviderEpoch(1n);
    expect(h.state.providerEpochs.lookup(1n)).toBe(2n);
  });
});
