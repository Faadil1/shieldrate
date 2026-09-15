import * as crypto from "node:crypto";
import { ecMulGenerator } from "@midnight-ntwrk/midnight-js-protocol/compact-runtime";
import { pureCircuits } from "../.compact-build/shieldrate/contract/index.js";

const JUBJUB_ORDER = 6554484396890773809930967563523245729705921265872317281365359162392183254199n;
const TWO_248 = 452312848583266388373324160190187140051835877600158453279131187530910662656n;

const required = (name) => {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required.`);
  return value;
};

const scalar = () => BigInt(`0x${crypto.randomBytes(32).toString("hex")}`) % JUBJUB_ORDER;
const bigintEnv = (name, fallback) => BigInt(process.env[name] ?? fallback);

const holderBindingField = BigInt(required("SHIELDRATE_HOLDER_BINDING_FIELD"));
const providerId = bigintEnv("SHIELDRATE_PROVIDER_ID", "1");
const providerEpoch = bigintEnv("SHIELDRATE_PROVIDER_EPOCH", "0");
const income = bigintEnv("SHIELDRATE_INCOME", "68000");
const ratingX100 = bigintEnv("SHIELDRATE_RATING_X100", "487");
const completedJobs = bigintEnv("SHIELDRATE_COMPLETED_JOBS", "120");
const now = BigInt(Date.now());
const issuedAtEpoch = bigintEnv("SHIELDRATE_ISSUED_AT_EPOCH", now.toString());
const expiresAtEpoch = bigintEnv("SHIELDRATE_EXPIRES_AT_EPOCH", (now + 60n * 60n * 24n * 30n * 1000n).toString());

if (expiresAtEpoch <= issuedAtEpoch) throw new Error("Credential expiry must be after issuance.");

// Optional fixed secret supports repeatable dev/testnet issuance. Never commit it.
const providerSecret = process.env.SHIELDRATE_ISSUER_SECRET
  ? BigInt(process.env.SHIELDRATE_ISSUER_SECRET) % JUBJUB_ORDER
  : scalar();
if (providerSecret === 0n) throw new Error("Issuer secret must be non-zero.");

const providerPk = ecMulGenerator(providerSecret);
const nonce = scalar();
const announcement = ecMulGenerator(nonce);

const challengeFull = pureCircuits.deriveIssuerChallenge(
  announcement.x,
  announcement.y,
  providerPk.x,
  providerPk.y,
  income,
  ratingX100,
  completedJobs,
  issuedAtEpoch,
  expiresAtEpoch,
  providerEpoch,
  holderBindingField,
);
const challenge = challengeFull % TWO_248;
const response = ((nonce + challenge * providerSecret) % JUBJUB_ORDER + JUBJUB_ORDER) % JUBJUB_ORDER;

const output = {
  provider: {
    providerId: providerId.toString(),
    publicKey: {
      x: providerPk.x.toString(),
      y: providerPk.y.toString(),
    },
  },
  credentialPayload: {
    providerId: providerId.toString(),
    credential: {
      income: income.toString(),
      ratingX100: ratingX100.toString(),
      completedJobs: completedJobs.toString(),
      issuedAtEpoch: issuedAtEpoch.toString(),
      expiresAtEpoch: expiresAtEpoch.toString(),
      providerEpoch: providerEpoch.toString(),
    },
    signature: {
      announcement: {
        x: announcement.x.toString(),
        y: announcement.y.toString(),
      },
      response: response.toString(),
    },
  },
};

console.log(JSON.stringify(output, null, 2));
console.error("\nIssuer secret was not printed. Keep SHIELDRATE_ISSUER_SECRET outside GitHub if you need repeatable issuance/revocation testing.");
