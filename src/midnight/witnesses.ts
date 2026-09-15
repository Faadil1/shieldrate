import type { WitnessContext } from "@midnight-ntwrk/midnight-js-protocol/compact-runtime";
import type {
  Ledger,
  PrivateCredential,
  Schnorr_SchnorrSignature,
} from "../../.compact-build/shieldrate/contract/index.js";

const TWO_248 = 452312848583266388373324160190187140051835877600158453279131187530910662656n;

export interface ShieldRatePrivateState {
  holderSecret: Uint8Array;
  adminSecret: Uint8Array;
  credential: PrivateCredential;
  attestationSignature: Schnorr_SchnorrSignature;
  attestationProviderId: bigint;
}

const zeroCredential = (): PrivateCredential => ({
  income: 0n,
  ratingX100: 0n,
  completedJobs: 0n,
  issuedAtEpoch: 0n,
  expiresAtEpoch: 0n,
  providerEpoch: 0n,
});

const zeroSignature = (): Schnorr_SchnorrSignature => ({
  announcement: { x: 0n, y: 0n },
  response: 0n,
});

export const randomSecret32 = (): Uint8Array => crypto.getRandomValues(new Uint8Array(32));

export const createShieldRatePrivateState = (
  holderSecret: Uint8Array = randomSecret32(),
  adminSecret: Uint8Array = randomSecret32(),
): ShieldRatePrivateState => ({
  holderSecret,
  adminSecret,
  credential: zeroCredential(),
  attestationSignature: zeroSignature(),
  attestationProviderId: 0n,
});

export const withAttestedCredential = (
  state: ShieldRatePrivateState,
  credential: PrivateCredential,
  signature: Schnorr_SchnorrSignature,
  providerId: bigint,
): ShieldRatePrivateState => ({
  ...state,
  credential,
  attestationSignature: signature,
  attestationProviderId: providerId,
});

export const witnesses = {
  getAttestedCredential: ({ privateState }: WitnessContext<Ledger, ShieldRatePrivateState>): [
    ShieldRatePrivateState,
    [PrivateCredential, Schnorr_SchnorrSignature, bigint],
  ] => [
    privateState,
    [privateState.credential, privateState.attestationSignature, privateState.attestationProviderId],
  ],

  getSchnorrReduction: (
    { privateState }: WitnessContext<Ledger, ShieldRatePrivateState>,
    challengeHash: bigint,
  ): [ShieldRatePrivateState, [bigint, bigint]] => [
    privateState,
    [challengeHash / TWO_248, challengeHash % TWO_248],
  ],

  getHolderSecret: ({ privateState }: WitnessContext<Ledger, ShieldRatePrivateState>): [ShieldRatePrivateState, Uint8Array] => {
    if (privateState.holderSecret.length !== 32) throw new Error("holderSecret must be 32 bytes");
    return [privateState, privateState.holderSecret];
  },

  getAdminSecret: ({ privateState }: WitnessContext<Ledger, ShieldRatePrivateState>): [ShieldRatePrivateState, Uint8Array] => {
    if (privateState.adminSecret.length !== 32) throw new Error("adminSecret must be 32 bytes");
    return [privateState, privateState.adminSecret];
  },
};
