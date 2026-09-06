import { describe, expect, it } from "vitest";
import { sha256 } from "../src/utils/crypto";
import { userHashFor } from "../src/utils/contractHelpers";
import { deviceProof } from "../src/utils/proofGenerator";

describe("sha256", () => {
  it("matches the NIST test vector for empty string", () => {
    expect(sha256("")).toBe(
      "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    );
  });

  it("matches the NIST test vector for 'abc'", () => {
    expect(sha256("abc")).toBe(
      "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"
    );
  });
});

describe("userHashFor", () => {
  it("is deterministic for the same wallet", () => {
    const a = userHashFor("0x7a3f8b2c9de14f7a2b8c6e1d5f4a9c3b");
    const b = userHashFor("0x7a3f8b2c9de14f7a2b8c6e1d5f4a9c3b");
    expect(a).toBe(b);
  });

  it("differs across wallets and never reveals the raw address", () => {
    const a = userHashFor("0x7a3f8b2c9de14f7a2b8c6e1d5f4a9c3b");
    const b = userHashFor("0xffffffffffffffffffffffffffffffff");
    expect(a).not.toBe(b);
    expect(a).not.toContain("7a3f8b2c");
  });
});

describe("deviceProof — witness + circuit", () => {
  it("passes income threshold when private income exceeds it", async () => {
    const result = await deviceProof(
      { type: "income", threshold: 50000, thresholdLabel: "Income > $50k/yr" },
      userHashFor("devnet-user")
    );
    expect(result.passed).toBe(true);
    expect(result.disclosedValue).toBe("Income > $50k/yr");
  });

  it("fails when threshold is above private income", async () => {
    const result = await deviceProof(
      { type: "income", threshold: 120000, thresholdLabel: "Income > $120k/yr" },
      userHashFor("devnet-user")
    );
    expect(result.passed).toBe(false);
  });

  it("passes rating >= 4.5 but fails rating > 4.9", async () => {
    const ok = await deviceProof(
      { type: "reputation", threshold: 4.5, thresholdLabel: "Rating > 4.5" },
      userHashFor("devnet-user")
    );
    const no = await deviceProof(
      { type: "reputation", threshold: 4.9, thresholdLabel: "Rating > 4.9" },
      userHashFor("devnet-user")
    );
    expect(ok.passed).toBe(true);
    expect(no.passed).toBe(false);
  });

  it("passes jobs >= 100 but fails at 200", async () => {
    const ok = await deviceProof(
      { type: "skills", threshold: 100, thresholdLabel: "100+ jobs" },
      userHashFor("devnet-user")
    );
    const no = await deviceProof(
      { type: "skills", threshold: 200, thresholdLabel: "200+ jobs" },
      userHashFor("devnet-user")
    );
    expect(ok.passed).toBe(true);
    expect(no.passed).toBe(false);
  });
});