import type { NetworkId } from "@midnight-ntwrk/midnight-js-network-id";

export interface MidnightLiveConfig {
  networkId: NetworkId;
  contractAddress: string | null;
  attestationUrl: string | null;
  assetBaseUrl: string;
}

const clean = (value: string | undefined): string | null => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

export function getMidnightLiveConfig(): MidnightLiveConfig {
  const env = import.meta.env as Record<string, string | undefined>;
  const networkId = (env.VITE_NETWORK_ID ?? "preprod") as NetworkId;
  const contractAddress = clean(env.VITE_SHIELDRATE_CONTRACT_ADDRESS);
  const attestationUrl = clean(env.VITE_SHIELDRATE_ATTESTATION_URL);
  const assetBaseUrl = new URL(import.meta.env.BASE_URL || "./", window.location.href)
    .toString()
    .replace(/\/$/, "");

  return { networkId, contractAddress, attestationUrl, assetBaseUrl };
}
