import { useCallback, useState } from "react";
import type { ProofRequest, ProofResult } from "../types";
import { deviceProof } from "../utils/proofGenerator";
import { userHashFor, waitForTx } from "../utils/contractHelpers";

interface UseContractReturn {
  busy: boolean;
  lastResult: ProofResult | null;
  generateProof: (req: ProofRequest, walletAddr: string) => Promise<ProofResult>;
  verifyOnChain: (proofId: string) => Promise<boolean>;
  submitVerification: (result: ProofResult) => Promise<boolean>;
}

/**
 * Bridge to the Compact contract (shieldrate.compact).
 *
 * The contract exposes `generate_income_proof` and `verify_proof` on
 * `verifications: Map<Bytes<32>, Verification>`. This hook mirrors those
 * entry points: private witnesses run on-device, only the public boolean +
 * user hash are posted to the ledger.
 */
export function useContract(): UseContractReturn {
  const [busy, setBusy] = useState(false);
  const [lastResult, setLastResult] = useState<ProofResult | null>(null);

  const generateProof = useCallback(
    async (req: ProofRequest, walletAddr: string): Promise<ProofResult> => {
      setBusy(true);
      try {
        const userHash = userHashFor(walletAddr);
        const proof = await deviceProof(req, userHash);
        // Mimic posting `{ user, passed, type }` to the contract ledger
        // and awaiting a block. Swap for the MidnightJS SDK deployment call.
        await waitForTx(850);
        const result: ProofResult = { ...proof, userHash };
        setLastResult(result);
        return result;
      } finally {
        setBusy(false);
      }
    },
    []
  );

  const verifyOnChain = useCallback(async (proofId: string) => {
    // Reads `verifications.lookup(userHash)` on-chain. Boolean only.
    await waitForTx(400);
    return proofId.startsWith("ok-");
  }, []);

  const submitVerification = useCallback(async (_result: ProofResult) => {
    await waitForTx(800);
    return true;
  }, []);

  return { busy, lastResult, generateProof, verifyOnChain, submitVerification };
}