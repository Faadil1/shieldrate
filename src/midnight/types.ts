import type { FoundContract } from "@midnight-ntwrk/midnight-js-contracts";
import type { MidnightProviders } from "@midnight-ntwrk/midnight-js-types";
import type { ShieldRatePrivateState } from "./witnesses";

export const shieldRatePrivateStateKey = "shieldRatePrivateState" as const;
export type ShieldRatePrivateStateId = typeof shieldRatePrivateStateKey;

export type ShieldRateCircuitKeys =
  | "registerProvider"
  | "rotateProviderEpoch"
  | "removeProvider"
  | "verifyClaim"
  | "receiptExists";

export type ShieldRateProviders = MidnightProviders<
  ShieldRateCircuitKeys,
  ShieldRatePrivateStateId,
  ShieldRatePrivateState
>;

export type DeployedShieldRateContract = FoundContract<any>;

export interface MidnightWalletSession {
  networkId: string;
  shieldedAddress: string | null;
  shieldedCoinPublicKey: string;
  shieldedEncryptionPublicKey: string;
}
