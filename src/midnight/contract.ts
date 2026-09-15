import { CompiledContract } from "@midnight-ntwrk/compact-js";
import * as ShieldRateContract from "../../.compact-build/shieldrate/contract/index.js";
import { witnesses } from "./witnesses";

export * as ShieldRateGenerated from "../../.compact-build/shieldrate/contract/index.js";

export const CompiledShieldRateContract = CompiledContract.make(
  "shieldrate",
  ShieldRateContract.Contract,
).pipe(
  CompiledContract.withWitnesses(witnesses),
  CompiledContract.withCompiledFileAssets("./.compact-build/shieldrate"),
);
