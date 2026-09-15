import { useCallback, useRef, useState } from "react";
import type { ContractAddress } from "@midnight-ntwrk/midnight-js-protocol/compact-runtime";
import type { ProofRequest, ProofResult } from "../types";
import {
  bindRequest,
  executionMode,
} from "../security/integrity";
import { deviceProof } from "../utils/proofGenerator";
import { getMidnightLiveConfig } from "../midnight/config";
import {
  ShieldRateMidnightAPI,
  initializeShieldRateProviders,
} from "../midnight/api";
import { getMidnightWalletSession } from "../midnight/wallet";

interface UseContractReturn {
  busy: boolean;
  lastResult: ProofResult | null;
  generateProof: (req: ProofRequest, walletAddr: string) => Promise<ProofResult>;
  verifyOnChain: (proofId: string) => Promise<boolean>;
  submitVerification: (result: ProofResult) => Promise<boolean>;
}

const networkReceiptLabel = (
  networkId: string,
): "preprod" | "preview" =>
  networkId.toLowerCase().includes("preview") ? "preview" : "preprod";

const failureResult = (message: string): ProofResult => ({
  passed: false,
  userHash: "not-published",
  proofId: "midnight-live-rejected",
  disclosedValue: "not published",
  generatedAt: new Date().toISOString(),
  verifiedOnChain: false,
  mode: "midnight-live",
  receipt: null,
  failureReason: message,
});

export function useContract(): UseContractReturn {
  const [busy, setBusy] = useState(false);
  const [lastResult, setLastResult] = useState<ProofResult | null>(null);
  const usedNullifiers = useRef(new Set<string>());
  const liveApi = useRef<Promise<ShieldRateMidnightAPI> | null>(null);

  const resolveLiveApi = useCallback(async (): Promise<ShieldRateMidnightAPI> => {
    if (liveApi.current) return liveApi.current;

    const config = getMidnightLiveConfig();
    if (!config.contractAddress) {
      throw new Error(
        "MIDNIGHT_LIVE requires VITE_SHIELDRATE_CONTRACT_ADDRESS.",
      );
    }

    const session = getMidnightWalletSession();
    const providers = initializeShieldRateProviders(session, config.assetBaseUrl);
    liveApi.current = ShieldRateMidnightAPI.join(
      providers,
      config.contractAddress as ContractAddress,
    );

    try {
      return await liveApi.current;
    } catch (error) {
      liveApi.current = null;
      throw error;
    }
  }, []);

  const generateProof = useCallback(
    async (req: ProofRequest, _walletAddr: string): Promise<ProofResult> => {
      setBusy(true);
      setLastResult(null);
      try {
        if (executionMode() === "midnight-live") {
          const config = getMidnightLiveConfig();
          if (!config.attestationUrl) {
            const missing = failureResult(
              "MIDNIGHT_LIVE requires VITE_SHIELDRATE_ATTESTATION_URL.",
            );
            setLastResult(missing);
            return missing;
          }

          const bound = bindRequest(req);
          try {
            const api = await resolveLiveApi();
            const live = await api.verifyClaim(bound, config.attestationUrl);
            const result: ProofResult = {
              passed: true,
              userHash: live.scopedSubject,
              proofId: live.verificationId,
              disclosedValue: bound.thresholdLabel,
              generatedAt: new Date().toISOString(),
              verifiedOnChain: true,
              mode: "midnight-live",
              receipt: {
                verificationId: live.verificationId,
                requestHash: live.requestHash,
                scopedSubject: live.scopedSubject,
                nullifier: live.nullifier,
                issuerId: `provider:${live.providerId.toString()}`,
                employerId: bound.employerId,
                jobId: bound.jobId,
                claim: bound.type,
                thresholdLabel: bound.thresholdLabel,
                generatedAt: new Date().toISOString(),
                requestExpiresAt: bound.requestExpiresAt,
                credentialExpiresAt: new Date(
                  Number(live.credentialExpiresAtEpoch) * 1000,
                ).toISOString(),
                mode: "midnight-live",
                network: networkReceiptLabel(String(config.networkId)),
                ledgerStatus: "confirmed",
                txHash: live.txHash,
                blockHeight: live.blockHeight,
                contractAddress: live.contractAddress,
              },
            };
            setLastResult(result);
            return result;
          } catch (error) {
            const rejected = failureResult(
              error instanceof Error ? error.message : "Midnight proof failed.",
            );
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
    },
    [resolveLiveApi],
  );

  const verifyOnChain = useCallback(
    async (proofId: string): Promise<boolean> => {
      if (executionMode() !== "midnight-live") return false;
      try {
        return await (await resolveLiveApi()).receiptExists(proofId);
      } catch {
        return false;
      }
    },
    [resolveLiveApi],
  );

  const submitVerification = useCallback(async (result: ProofResult) => {
    return result.mode === "midnight-live" && result.verifiedOnChain;
  }, []);

  return { busy, lastResult, generateProof, verifyOnChain, submitVerification };
}
