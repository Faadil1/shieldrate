import assert from "node:assert/strict";
import {
  ecAdd,
  ecMul,
  ecMulGenerator,
} from "@midnight-ntwrk/midnight-js-protocol/compact-runtime";
import * as ShieldRateGenerated from "../contracts/managed/shieldrate/contract/index.js";
import {
  TWO_248,
  getPublicKey,
  signShieldRateCredential,
} from "./signing.mjs";

const secretKey = 123456789n;
const message = [68000n, 487n, 120n, 1789440000n, 1797216000n, 0n, 42n];
const publicKey = getPublicKey(secretKey);
const signature = signShieldRateCredential(secretKey, message);
const challengeFull = ShieldRateGenerated.pureCircuits.schnorrChallenge7(
  signature.announcement.x,
  signature.announcement.y,
  publicKey.x,
  publicKey.y,
  message,
);
const challenge = challengeFull % TWO_248;
const lhs = ecMulGenerator(signature.response);
const rhs = ecAdd(signature.announcement, ecMul(publicKey, challenge));

assert.equal(lhs.x, rhs.x, "Schnorr x-coordinate mismatch");
assert.equal(lhs.y, rhs.y, "Schnorr y-coordinate mismatch");
console.log("ShieldRate issuer Schnorr self-test passed.");
