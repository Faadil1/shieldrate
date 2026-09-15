import { CompiledContract } from "@midnight-ntwrk/compact-js";
import type { WitnessContext } from "@midnight-ntwrk/midnight-js-protocol/compact-runtime";
import * as ShieldRateGenerated from "../../contracts/managed/shieldrate/contract/index.js";
import type {
  Ledger,
  PrivateCredential,
  Schnorr_SchnorrSignature,
} from "../../contracts/managed/shieldrate/contract/index.js";

export type ShieldRatePrivateState = {
  credential: PrivateCredential;
  attestationSignature: Schnorr_SchnorrSignature;
  attestationProviderId: bigint;
  holderSecret: Uint8Array;
  adminSecret: Uint8Array;
};

const TWO_248 =
  452312848583266388373324160190187140051835877600158453279131187530910662656n;

export const createEmptyPrivateState = (
  holderSecret: Uint8Array,
  adminSecret: Uint8Array,
): ShieldRatePrivateState => ({
  credential: {
    income: 0n,
    ratingX100: 0n,
    completedJobs: 0n,
    issuedAtEpoch: 0n,
    expiresAtEpoch: 0n,
    providerEpoch: 0n,
  },
  attestationSignature: {
    announcement: { x: 0n, y: 1n },
    response: 0n,
  },
  attestationProviderId: 0n,
  holderSecret,
  adminSecret,
});

export const shieldRateWitnesses = {
  getAttestedCredential: ({
    privateState,
  }: WitnessContext<Ledger, ShieldRatePrivateState>): [
    ShieldRatePrivateState,
    [PrivateCredential, Schnorr_SchnorrSignature, bigint],
  ] => [
    privateState,
    [
      privateState.credential,
      privateState.attestationSignature,
      privateState.attestationProviderId,
    ],
  ],

  getHolderSecret: ({
    privateState,
  }: WitnessContext<Ledger, ShieldRatePrivateState>): [ShieldRatePrivateState, Uint8Array] => [
    privateState,
    privateState.holderSecret,
  ],

  getAdminSecret: ({
    privateState,
  }: WitnessContext<Ledger, ShieldRatePrivateState>): [ShieldRatePrivateState, Uint8Array] => [
    privateState,
    privateState.adminSecret,
  ],

  getSchnorrReduction: (
    { privateState }: WitnessContext<Ledger, ShieldRatePrivateState>,
    challengeHash: bigint,
  ): [ShieldRatePrivateState, [bigint, bigint]] => [
    privateState,
    [challengeHash / TWO_248, challengeHash % TWO_248],
  ],
};

export const CompiledShieldRateContract = CompiledContract.make(
  "shieldrate",
  ShieldRateGenerated.Contract,
).pipe(
  CompiledContract.withWitnesses(shieldRateWitnesses),
  CompiledContract.withCompiledFileAssets("./contracts/managed/shieldrate"),
);

export { ShieldRateGenerated };
