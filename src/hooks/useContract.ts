import { useCallback, useRef, useState } from "react";
import type { ProofRequest, ProofResult } from "../types";
import { deviceProof } from "../utils/proofGenerator";

interface UseContractReturn {
  busy: boolean;
  lastResult: ProofResult | null;
  generateProof: (req: ProofRequest, walletAddr: string) => Promise<ProofResult>;
  verifyOnChain: (proofId: string) => Promise<boolean>;
  submitVerification: (result: ProofResult) => Promise<boolean>;
}

/**
 * Proof Integrity v1 adapter.
 *
 * Default mode is DEMO_ATTESTED: issuer registration, request binding,
 * anti-replay nullifier, scoped pseudonym, freshness and pass-only publication
 * are enforced locally and surfaced honestly as LOCAL ONLY.
 *
 * MIDNIGHT_LIVE is fail-closed until the real MidnightJS/Lace adapter is wired.
 */
export function useContract(): UseContractReturn {
  const [busy, setBusy] = useState(false);
  const [lastResult, setLastResult] = useState<ProofResult | null>(null);
  const usedNullifiers = useRef(new Set<string>());

  const generateProof = useCallback(
    async (req: ProofRequest, _walletAddr: string): Promise<ProofResult> => {
      setBusy(true);
      setLastResult(null);
      try {
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
    [],
  );

  const verifyOnChain = useCallback(async (_proofId: string) => false, []);

  const submitVerification = useCallback(async (_result: ProofResult) => false, []);

  return { busy, lastResult, generateProof, verifyOnChain, submitVerification };
}
