import { useEffect, useState } from "react";
import { WORK_POLICIES } from "../security/integrity";
import type { WorkPolicyCode } from "../types";
import type { AttestedCredentialPayload } from "../midnight/runtime";
import { BrandMark } from "./BrandMark";

type Snapshot = {
  connected: boolean;
  wallet: { networkId: string } | null;
  contractAddress: string | null;
  hasAttestedCredential: boolean;
};

const EMPTY_SNAPSHOT: Snapshot = { connected: false, wallet: null, contractAddress: null, hasAttestedCredential: false };

export function LiveSetupPanel() {
  const [snapshot, setSnapshot] = useState<Snapshot>(EMPTY_SNAPSHOT);
  const [holderBinding, setHolderBinding] = useState<string>("");
  const [contractInput, setContractInput] = useState("");
  const [providerId, setProviderId] = useState("1");
  const [providerX, setProviderX] = useState("");
  const [providerY, setProviderY] = useState("");
  const [credentialJson, setCredentialJson] = useState("");
  const [jobId, setJobId] = useState("sr-private-frontend-001");
  const [policyCode, setPolicyCode] = useState<WorkPolicyCode>(2);
  const [workRequestId, setWorkRequestId] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const refresh = async () => {
    const runtime = await import("../midnight/runtime");
    const next = runtime.getMidnightRuntimeSnapshot();
    setSnapshot({
      connected: next.connected,
      wallet: next.wallet ? { networkId: next.wallet.networkId } : null,
      contractAddress: next.contractAddress,
      hasAttestedCredential: next.hasAttestedCredential,
    });
    try {
      setHolderBinding(runtime.createAttestationRequest().holderBindingField);
    } catch {
      setHolderBinding("");
    }
  };

  useEffect(() => { void refresh(); }, []);

  const run = async (action: () => Promise<string | void>) => {
    setBusy(true);
    setMessage("");
    try {
      const result = await action();
      if (result) setMessage(result);
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Midnight live setup failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-[1100px]">
      <header className="mb-7 grid gap-5 border-b border-[var(--ink)] pb-6 md:grid-cols-[1fr_auto] md:items-end">
        <div className="flex items-start gap-4">
          <BrandMark />
          <div>
            <div className="micro-label">Midnight live / V4 operator dossier</div>
            <h2 className="display-serif mt-2 text-[42px] leading-[.94] text-[var(--ink)]">Commit criteria. Then prove privately.</h2>
            <p className="mt-3 max-w-[780px] text-[10px] leading-5 text-[var(--muted)]">Commit-Before-Know fixes the employer's policy before a holder proves anything. Holder/admin secrets remain session-only. Never paste an issuer private key or wallet seed here.</p>
          </div>
        </div>
        <span className="mode-badge mode-live">Live path / V4</span>
      </header>

      <section className="mb-6 grid border-y border-[var(--ink)] md:grid-cols-3">
        <RuntimeStatus tone="mineral" label="Midnight wallet" value={snapshot.connected ? "Connected" : "Not connected"} good={snapshot.connected} />
        <RuntimeStatus tone="iris" label="Network" value={snapshot.wallet?.networkId ?? "—"} good={Boolean(snapshot.wallet?.networkId)} />
        <RuntimeStatus tone="verify" label="Credential" value={snapshot.hasAttestedCredential ? "Loaded" : "Not loaded"} good={snapshot.hasAttestedCredential} last />
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <SetupCard code="01" title="Contract registry" subtitle="Deploy or join the canonical ShieldRate contract." tone="mineral">
          <div className="micro-label">Current contract</div>
          <div className="evidence-mono mt-2 min-h-[44px] break-all text-[9px] leading-4 text-[var(--ink-soft)]">{snapshot.contractAddress ?? "NOT JOINED"}</div>
          <button className="btn-primary mt-4 w-full" disabled={busy} onClick={() => void run(async () => {
            const { deployMidnightContract } = await import("../midnight/runtime");
            const address = await deployMidnightContract(({ stage, detail }) => {
              setMessage(`DEPLOY / ${stage}${detail ? ` · ${detail}` : ""}`);
            });
            setContractInput(address);
            return `READY · Contract deployed and indexed: ${address}`;
          })}>{busy ? "Working…" : "Deploy ShieldRate contract"}</button>
          <p className="mt-2 text-[8px] leading-4 text-[var(--muted)]">One click submits at most once. If Preprod indexing is slow, ShieldRate preserves the submitted contract and recovers it instead of redeploying.</p>
          <div className="mt-4 border-t border-[var(--rule)] pt-4">
            <input className="field evidence-mono text-[9px]" placeholder="Existing contract address" value={contractInput} onChange={(event) => setContractInput(event.target.value.trim())} />
            <button className="btn-secondary mt-2 w-full" disabled={busy || !contractInput} onClick={() => void run(async () => {
              const { joinMidnightContract } = await import("../midnight/runtime");
              await joinMidnightContract(contractInput);
              return `Joined contract: ${contractInput}`;
            })}>Join existing contract</button>
          </div>
        </SetupCard>

        <SetupCard code="02" title="Holder binding" subtitle="Safe field to send to the credential issuer." tone="iris">
          <p className="text-[10px] leading-5 text-[var(--muted)]">This binds the signed credential to browser-held private state without revealing the holder secret.</p>
          <div className="redacted-field evidence-mono mt-4 min-h-[122px] break-all p-4 text-[9px] leading-5 text-[var(--iris)]">{holderBinding || "Connect a Midnight wallet to initialize holder state."}</div>
          <div className="mt-3 text-[8px] font-black uppercase tracking-[0.13em] text-[var(--iris)]">Safe to share with issuer · holderSecret remains private</div>
        </SetupCard>

        <SetupCard code="03" title="Issuer registration" subtitle="Admin transaction: provider public key only." tone="copper">
          <p className="text-[10px] leading-5 text-[var(--muted)]">Provider epochs are monotonic. Removing and re-registering a provider id cannot revive an old credential epoch.</p>
          <div className="mt-4 grid grid-cols-3 gap-2"><input className="field" value={providerId} onChange={(e) => setProviderId(e.target.value)} placeholder="Provider ID" /><input className="field col-span-2 evidence-mono text-[9px]" value={providerX} onChange={(e) => setProviderX(e.target.value)} placeholder="Public key X" /></div>
          <input className="field evidence-mono mt-2 text-[9px]" value={providerY} onChange={(e) => setProviderY(e.target.value)} placeholder="Public key Y" />
          <button className="btn-secondary mt-3 w-full" disabled={busy || !providerId || !snapshot.contractAddress} onClick={() => void run(async () => {
            const { inspectMidnightProvider } = await import("../midnight/runtime");
            const expectedKey = providerX && providerY ? { x: BigInt(providerX), y: BigInt(providerY) } : undefined;
            const status = await inspectMidnightProvider(BigInt(providerId), expectedKey);
            if (!status.exists) return `NOT REGISTERED · Provider ${providerId} is absent from indexed ledger state. No transaction was submitted by this check.`;
            if (status.matchesExpectedKey === false) return `STOP · Provider ${providerId} is indexed with a DIFFERENT public key · epoch ${status.epoch ?? "unknown"}. Do not register again.`;
            return `INDEXED · Provider ${providerId} exists · epoch ${status.epoch ?? "unknown"}${status.matchesExpectedKey ? " · expected key matches" : ""}.`;
          })}>Check provider on-chain</button>
          <button className="btn-primary mt-2 w-full" disabled={busy || !providerId || !providerX || !providerY} onClick={() => void run(async () => {
            const { registerMidnightProvider } = await import("../midnight/runtime");
            const result = await registerMidnightProvider(BigInt(providerId), { x: BigInt(providerX), y: BigInt(providerY) });
            if (result.recovered) {
              return `RECOVERED · Provider ${providerId} is already indexed with the expected key · epoch ${result.status.epoch ?? "unknown"}. No new registration transaction was submitted.`;
            }
            return `Provider registered in tx ${result.txId} at block ${result.blockHeight} · indexed epoch ${result.status.epoch ?? "unknown"}.`;
          })}>Register provider on-chain</button>
          <p className="mt-2 text-[8px] leading-4 text-[var(--muted)]">After any Submit Transaction error or timeout, use Check provider on-chain first. ShieldRate never automatically resubmits an ambiguous provider registration.</p>
        </SetupCard>

        <SetupCard code="04" title="Credential import" subtitle="Signed payload only — never issuer secret." tone="verify">
          <p className="text-[10px] leading-5 text-[var(--muted)]">Paste the signed provider payload containing private claim fields and the Schnorr signature.</p>
          <textarea className="field evidence-mono mt-4 h-40 resize-y text-[9px] leading-4" value={credentialJson} onChange={(event) => setCredentialJson(event.target.value)} placeholder='{"providerId":1,"credential":{...},"signature":{...}}' />
          <button className="btn-primary mt-3 w-full" disabled={busy || !credentialJson} onClick={() => void run(async () => {
            const { importAttestedCredential } = await import("../midnight/runtime");
            await importAttestedCredential(JSON.parse(credentialJson) as AttestedCredentialPayload);
            return "Issuer-attested credential loaded into session-private state.";
          })}>Import attested credential</button>
        </SetupCard>

        <SetupCard code="05" title="Commit employer standard" subtitle="One immutable policy per employer + job scope." tone="copper">
          <p className="text-[10px] leading-5 text-[var(--muted)]">The active wallet becomes the on-chain employer identity through `ownPublicKey()`. Once this job scope is registered, its qualification standard cannot be replaced.</p>
          <input className="field mt-4" value={jobId} onChange={(event) => setJobId(event.target.value)} placeholder="Job scope / requisition id" />
          <select className="field mt-2" value={policyCode} onChange={(event) => setPolicyCode(Number(event.target.value) as WorkPolicyCode)}>
            {(Object.values(WORK_POLICIES)).map((policy) => <option key={policy.code} value={policy.code}>{policy.id} · {policy.label}</option>)}
          </select>
          <button className="btn-primary mt-3 w-full" disabled={busy || !snapshot.connected || !snapshot.contractAddress || !jobId} onClick={() => void run(async () => {
            const { bytesToHex, registerMidnightWorkRequest } = await import("../midnight/runtime");
            const registered = await registerMidnightWorkRequest({ policyCode, jobId });
            const id = bytesToHex(registered.workRequestId);
            setWorkRequestId(id);
            return `Work request fixed on-chain: ${id} · tx ${registered.txId} · block ${registered.blockHeight}`;
          })}>Commit policy before proof</button>
        </SetupCard>

        <SetupCard code="06" title="Prove qualification" subtitle="Holder consents by proving the registered request." tone="verify">
          <p className="text-[10px] leading-5 text-[var(--muted)]">The proof reads employer, job, policy and expiry from the registered request. A successful holder gets one QUALIFIED receipt for this opportunity. Failure creates no public negative receipt.</p>
          <input className="field evidence-mono mt-4 text-[9px]" value={workRequestId} onChange={(event) => setWorkRequestId(event.target.value.trim())} placeholder="64-char work request id" />
          <button className="btn-primary mt-3 w-full" disabled={busy || workRequestId.length !== 64 || !snapshot.hasAttestedCredential} onClick={() => void run(async () => {
            const { bytesToHex, verifyMidnightRegisteredWorkPolicy } = await import("../midnight/runtime");
            const receipt = await verifyMidnightRegisteredWorkPolicy(workRequestId);
            return `QUALIFIED · verification ${bytesToHex(receipt.verificationId)} · tx ${receipt.txId} · block ${receipt.blockHeight}`;
          })}>Run registered private qualification</button>
        </SetupCard>
      </div>

      <section className="mt-6 grid grid-cols-[6px_1fr] border border-[rgba(31,114,91,.4)] bg-[var(--verify-bg)]/75">
        <div className="bg-[var(--verify)]" />
        <div className="px-5 py-4"><div className="micro-label !text-[var(--verify)]">V4 live gate rule</div><p className="mt-2 text-[10px] leading-5 text-[var(--ink-soft)]">A submitted transaction is never enough. ShieldRate marks qualification verified only after finalization and independent indexed-ledger confirmation of the expected `workReceipts` id.</p></div>
      </section>

      {message && <div className="evidence-mono mt-4 break-all border border-[var(--verify)] bg-[var(--verify-bg)] p-4 text-[9px] leading-5 text-[var(--verify)]">{message}</div>}
    </div>
  );
}

function SetupCard({ code, title, subtitle, tone, children }: { code: string; title: string; subtitle: string; tone: "mineral" | "iris" | "copper" | "verify"; children: React.ReactNode }) {
  const toneColor = tone === "mineral" ? "var(--mineral)" : tone === "iris" ? "var(--iris)" : tone === "copper" ? "var(--copper)" : "var(--verify)";
  return <section className="document-frame p-5 md:p-6"><div className="flex items-start justify-between gap-4 border-b border-[var(--rule)] pb-4"><div><div className="evidence-mono text-[8px] font-black" style={{ color: toneColor }}>{code}</div><h3 className="display-serif mt-2 text-[27px] leading-none text-[var(--ink)]">{title}</h3><p className="mt-2 text-[9px] text-[var(--muted)]">{subtitle}</p></div><span className="h-2.5 w-2.5 rounded-full" style={{ background: toneColor }} /></div><div className="pt-5">{children}</div></section>;
}

function RuntimeStatus({ label, value, good, tone, last = false }: { label: string; value: string; good: boolean; tone: "mineral" | "iris" | "verify"; last?: boolean }) {
  const toneClass = tone === "mineral" ? "privacy-requested" : tone === "iris" ? "privacy-hidden" : "privacy-proven";
  return <div className={`px-5 py-4 ${last ? "" : "border-b border-[var(--rule)] md:border-b-0 md:border-r"} ${toneClass}`}><div className="micro-label !text-current">{label}</div><div className={`mt-2 text-[11px] font-black ${good ? "" : "opacity-65"}`}>{value}</div></div>;
}
