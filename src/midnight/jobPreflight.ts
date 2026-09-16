import {
  createCircuitContext,
  createConstructorContext,
  type ContractAddress,
} from "@midnight-ntwrk/midnight-js-protocol/compact-runtime";
import * as ShieldRateGenerated from "../../.compact-build/shieldrate/contract/index.js";
import { initializeShieldRateProviders } from "./providers";
import { createShieldRatePrivateState, witnesses } from "./witnesses";

const hex = (bytes: Uint8Array): string =>
  Array.from(bytes, (value) => value.toString(16).padStart(2, "0")).join("");

const hash32 = async (value: string): Promise<Uint8Array> => {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return new Uint8Array(digest);
};

const BECH32_CHARSET = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";

const decodeBech32mPayload = (value: string): Uint8Array => {
  const normalized = value.toLowerCase();
  const separator = normalized.lastIndexOf("1");
  if (separator <= 0 || separator + 7 > normalized.length) throw new Error("Malformed Midnight coin public key.");
  const hrp = normalized.slice(0, separator);
  if (!hrp.startsWith("mn_shield-cpk")) throw new Error(`Unexpected Midnight coin public key prefix: ${hrp}`);

  const words = Array.from(normalized.slice(separator + 1), (char) => {
    const index = BECH32_CHARSET.indexOf(char);
    if (index < 0) throw new Error(`Invalid Bech32m character '${char}'.`);
    return index;
  }).slice(0, -6);

  const output: number[] = [];
  let accumulator = 0;
  let bits = 0;
  for (const word of words) {
    accumulator = ((accumulator << 5) | word) & 0xfff;
    bits += 5;
    while (bits >= 8) {
      bits -= 8;
      output.push((accumulator >> bits) & 0xff);
    }
  }

  const decoded = new Uint8Array(output);
  if (decoded.length !== 32) throw new Error(`Expected a 32-byte coin public key, decoded ${decoded.length} bytes.`);
  return decoded;
};

const normalizeCoinPublicKey = (value: string): string => {
  const cleaned = value.replace(/^0x/, "");
  if (/^[0-9a-fA-F]{64}$/.test(cleaned)) return cleaned.toLowerCase();
  if (value.toLowerCase().startsWith("mn_shield-cpk")) return hex(decodeBech32mPayload(value));
  throw new Error("Unsupported Midnight coin public key encoding.");
};

export interface CurrentJobPreflight {
  jobId: string;
  jobScope: string;
  employerPkh: string;
  jobKey: string;
  alreadyFixed: boolean;
  fixedWorkRequestId: string | null;
}

/**
 * Read-only preflight for Card 05. It derives the same employer identity and
 * employer+job key used by registerWorkRequest, then checks indexed state.
 * No proving, balancing, signing, or submission occurs here.
 */
export async function preflightCurrentJobScope(
  contractAddress: string,
  jobId: string,
): Promise<CurrentJobPreflight> {
  const { providers, wallet } = await initializeShieldRateProviders();
  const state = await providers.publicDataProvider.queryContractState(contractAddress as ContractAddress);
  if (!state) throw new Error("ShieldRate contract state is unavailable.");

  const ledger = ShieldRateGenerated.ledger(state.data);
  const privateState = createShieldRatePrivateState();
  const contract = new ShieldRateGenerated.Contract(witnesses);
  const coinPublicKeyHex = normalizeCoinPublicKey(wallet.shieldedCoinPublicKey);
  const initial = contract.initialState(createConstructorContext(privateState, coinPublicKeyHex));
  const context = createCircuitContext(
    contractAddress as ContractAddress,
    initial.currentZswapLocalState,
    state.data,
    privateState,
  );
  const employerPkh = contract.impureCircuits.callerPkh(context).result;
  const jobScope = await hash32(`shieldrate:job:v1|${jobId}`);
  const jobKey = ShieldRateGenerated.pureCircuits.deriveJobKey(employerPkh, jobScope);
  const alreadyFixed = ledger.jobRequests.member(jobKey);

  return {
    jobId,
    jobScope: hex(jobScope),
    employerPkh: hex(employerPkh),
    jobKey: hex(jobKey),
    alreadyFixed,
    fixedWorkRequestId: alreadyFixed ? hex(ledger.jobRequests.lookup(jobKey)) : null,
  };
}
