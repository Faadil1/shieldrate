import type { JubjubPoint } from "@midnight-ntwrk/midnight-js-protocol/compact-runtime";
import type {
  PrivateCredential,
  Schnorr_SchnorrSignature,
} from "../../contracts/managed/shieldrate/contract/index.js";

export interface LiveAttestation {
  providerId: bigint;
  credential: PrivateCredential;
  signature: Schnorr_SchnorrSignature;
}

interface AttestationResponseJson {
  providerId: string | number;
  credential: {
    income: string | number;
    ratingX100: string | number;
    completedJobs: string | number;
    issuedAtEpoch: string | number;
    expiresAtEpoch: string | number;
    providerEpoch: string | number;
  };
  signature: {
    announcement: { x: string | number; y: string | number };
    response: string | number;
  };
}

interface ProviderInfoJson {
  providerId: string | number;
  providerEpoch: string | number;
  publicKey: { x: string | number; y: string | number };
}

export interface IssuerProviderInfo {
  providerId: bigint;
  providerEpoch: bigint;
  publicKey: JubjubPoint;
}

const endpoint = (baseUrl: string, path: string): string =>
  `${baseUrl.replace(/\/$/, "")}${path}`;

const requireOk = async (response: Response): Promise<Response> => {
  if (response.ok) return response;
  const body = await response.text().catch(() => "");
  throw new Error(
    `Issuer service returned ${response.status}${body ? `: ${body.slice(0, 240)}` : ""}`,
  );
};

export async function requestIssuerAttestation(
  baseUrl: string,
  holderBindingField: bigint,
): Promise<LiveAttestation> {
  const response = await requireOk(
    await fetch(endpoint(baseUrl, "/attest"), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ holderBindingField: holderBindingField.toString() }),
    }),
  );
  const data = (await response.json()) as AttestationResponseJson;

  return {
    providerId: BigInt(data.providerId),
    credential: {
      income: BigInt(data.credential.income),
      ratingX100: BigInt(data.credential.ratingX100),
      completedJobs: BigInt(data.credential.completedJobs),
      issuedAtEpoch: BigInt(data.credential.issuedAtEpoch),
      expiresAtEpoch: BigInt(data.credential.expiresAtEpoch),
      providerEpoch: BigInt(data.credential.providerEpoch),
    },
    signature: {
      announcement: {
        x: BigInt(data.signature.announcement.x),
        y: BigInt(data.signature.announcement.y),
      },
      response: BigInt(data.signature.response),
    },
  };
}

export async function fetchIssuerProviderInfo(
  baseUrl: string,
): Promise<IssuerProviderInfo> {
  const response = await requireOk(await fetch(endpoint(baseUrl, "/provider-info")));
  const data = (await response.json()) as ProviderInfoJson;
  return {
    providerId: BigInt(data.providerId),
    providerEpoch: BigInt(data.providerEpoch),
    publicKey: {
      x: BigInt(data.publicKey.x),
      y: BigInt(data.publicKey.y),
    },
  };
}
