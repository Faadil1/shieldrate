import { randomBytes } from "node:crypto";
import { ecMulGenerator } from "@midnight-ntwrk/midnight-js-protocol/compact-runtime";
import * as ShieldRateGenerated from "../contracts/managed/shieldrate/contract/index.js";

export const JUBJUB_ORDER =
  6554484396890773809930967563523245729705921265872317281365359162392183254199n;
export const TWO_248 =
  452312848583266388373324160190187140051835877600158453279131187530910662656n;

const normalizeScalar = (value) =>
  ((value % JUBJUB_ORDER) + JUBJUB_ORDER) % JUBJUB_ORDER;

const randomScalar = () => {
  const bytes = randomBytes(32);
  return BigInt(`0x${bytes.toString("hex")}`) % JUBJUB_ORDER;
};

export const getPublicKey = (secretKey) =>
  ecMulGenerator(normalizeScalar(secretKey));

export function signShieldRateCredential(secretKey, message) {
  if (!Array.isArray(message) || message.length !== 7) {
    throw new Error("ShieldRate issuer signatures require exactly seven fields.");
  }

  const sk = normalizeScalar(secretKey);
  if (sk === 0n) throw new Error("Provider secret key must be non-zero.");

  const publicKey = ecMulGenerator(sk);
  const nonce = randomScalar();
  const announcement = ecMulGenerator(nonce);
  const challengeFull = ShieldRateGenerated.pureCircuits.schnorrChallenge7(
    announcement.x,
    announcement.y,
    publicKey.x,
    publicKey.y,
    message,
  );
  const challenge = challengeFull % TWO_248;
  const response = normalizeScalar(nonce + challenge * sk);

  return { announcement, response };
}
