import { useCallback, useRef, useState } from "react";
import type { MidnightNetwork, ProofRequest, ProofResult } from "../types";
import { bindRequest, executionMode } from "../security/integrity";
import { deviceProof } from "../utils/proofGenerator";

interface UseContractReturn {
  busy: boolean;
  lastResult: ProofResult | null;
  generateProof: (req: ProofRequest, walletAddr: string) => Promise<ProofResult>;
  verifyOnChain: (proofId: string) => Promise<boolean>;
  submitVerification: (result: ProofResult) => Promise<boolean>;
}

const normalizeReceiptNetwork = (network: string | undefined): "preprod" | "preview" | "devnet" => {
  if (network === "preview" || network === "devnet") return network;
  return "preprod";
};

const normalizeWalletNetwork = (network: string | undefined): MidnightNetwork => {
  if (network === "preprod" || network === "preview" || network === "devnet" || network === "undeployed") return network;
  return "none";
};

export function useContract(): UseContractReturn {
  const [busy, setBusy] = useState(false);
  const [lastResult, setLastResult] = useState<ProofResult | null>(null);
  const usedNullifiers = useRef(new Set<string>());

  const generateProof = useCallback(async (req: ProofRequest, _walletAddr: string): Promise<ProofResult> => {
    setBusy(true);
    setLastResult(null);
    try {
      if (executionMode() === "midnight-live") {
        const { bytesToHex, getMidnightRuntimeSnapshot, verifyMidnightProof } = await import("../midnight/runtime");
        const bound = bindRequest(req);
        try {
          const live = await verifyMidnightProof(bound);
          const runtime = getMidnightRuntimeSnapshot();
          const generatedAt = new Date().toISOString();
          const result: ProofResult = {
            passed: true,
            userHash: bytesToHex(live.scopedSubject),
            proofId: bytesToHex(live.verificationId),
            disclosedValue: "policy satisfied",
            generatedAt,
            verifiedOnChain: true,
            mode: "midnight-live",
            receipt: {
              verificationId: bytesToHex(live.verificationId),
              requestHash: bytesToHex(live.requestHash),
              scopedSubject: bytesToHex(live.scopedSubject),
              nullifier: bytesToHex(live.nullifier),
              issuerId: `provider:${live.providerId.toString()}`,
              employerId: bound.employerId,
              jobId: bound.jobId,
              claim: bound.type,
              thresholdLabel: bound.thresholdLabel,
              generatedAt,
              requestExpiresAt: bound.requestExpiresAt,
              credentialExpiresAt: new Date(Number(live.credentialExpiresAtEpoch) * 1000).toISOString(),
              mode: "midnight-live",
              network: normalizeReceiptNetwork(runtime.wallet?.networkId),
              ledgerStatus: "confirmed",
              txHash: live.txId,
              contractAddress: String(live.contractAddress),
              blockHeight: live.blockHeight.toString(),
            },
          };
          setLastResult(result);
          return result;
        } catch (error) {
          const rejected: ProofResult = {
            passed: false,
            userHash: "not-published",
            proofId: "live-proof-rejected",
            disclosedValue: "not published",
            generatedAt: new Date().toISOString(),
            verifiedOnChain: false,
            mode: "midnight-live",
            receipt: null,
            failureReason: error instanceof Error ? error.message : "Midnight proof failed before a verified receipt was produced.",
          };
          setLastResult(rejected);
          return rejected;
        }
      }

      const result = await deviceProof(req);
      const nullifier = result.receipt?.nullifier;
      if (nullifier && usedNullifiers.current.has(nullifier)) {
        const replay: ProofResult = {
          ...result,
          passed: false,
          receipt: null,
          proofId: "local-replay-rejected",
          disclosedValue: "not published",
          failureReason: "replay detected; nullifier already consumed locally",
        };
        setLastResult(replay);
        return replay;
      }
      if (nullifier) usedNullifiers.current.add(nullifier);
      setLastResult(result);
      return result;
    } finally {
      setBusy(false);
    }
  }, []);

  const verifyOnChain = useCallback(async (proofId: string) => {
    if (executionMode() !== "midnight-live") return false;
    try {
      const { verifyLiveReceipt } = await import("../midnight/runtime");
      return await verifyLiveReceipt(proofId);
    } catch {
      return false;
    }
  }, []);

  const submitVerification = useCallback(async (result: ProofResult) => {
    if (result.mode !== "midnight-live" || !result.receipt) return false;
    const { verifyLiveReceipt } = await import("../midnight/runtime");
    return verifyLiveReceipt(result.receipt.verificationId);
  }, []);

  void normalizeWalletNetwork;
  return { busy, lastResult, generateProof, verifyOnChain, submitVerification };
}
