import { useMemo, useState } from "react";
import {
  createAttestationRequest,
  deployMidnightContract,
  getMidnightRuntimeSnapshot,
  importAttestedCredential,
  joinMidnightContract,
  registerMidnightProvider,
  type AttestedCredentialPayload,
} from "../midnight/runtime";
import { BrandMark } from "./BrandMark";

export function LiveSetupPanel() {
  const [contractInput, setContractInput] = useState("");
  const [providerId, setProviderId] = useState("1");
  const [providerX, setProviderX] = useState("");
  const [providerY, setProviderY] = useState("");
  const [credentialJson, setCredentialJson] = useState("");
  const [message, setMessage] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [, forceRefresh] = useState(0);

  const snapshot = getMidnightRuntimeSnapshot();
  const attestation = useMemo(() => {
    try { return createAttestationRequest(); } catch { return null; }
  }, [snapshot.contractAddress, snapshot.hasAttestedCredential]);

  const run = async (action: () => Promise<void>) => {
    setBusy(true);
    setMessage("");
    try { await action(); forceRefresh((value) => value + 1); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Midnight live setup failed."); }
    finally { setBusy(false); }
  };

  return (
    <div className="max-w-[1100px]">
      <header className="mb-7 grid gap-5 border-b border-[var(--ink)] pb-6 md:grid-cols-[1fr_auto] md:items-end">
        <div className="flex items-start gap-4">
          <BrandMark />
          <div>
            <div className="micro-label">Midnight live / controlled activation dossier</div>
            <h2 className="display-serif mt-2 text-[42px] leading-[.94] text-[var(--ink)]">Operator registration bureau</h2>
            <p className="mt-3 max-w-[780px] text-[10px] leading-5 text-[var(--muted)]">Evidence-backed setup only. Holder/admin secrets remain session-only in this browser tab. Never paste an issuer private key or wallet seed into ShieldRate.</p>
          </div>
        </div>
        <span className="mode-badge mode-live">Live path / preprod</span>
      </header>

      <section className="mb-6 grid border-y border-[var(--ink)] md:grid-cols-3">
        <RuntimeStatus tone="mineral" label="Lace" value={snapshot.connected ? "Connected" : "Not connected"} good={snapshot.connected} />
        <RuntimeStatus tone="iris" label="Network" value={snapshot.wallet?.networkId ?? "—"} good={Boolean(snapshot.wallet?.networkId)} />
        <RuntimeStatus tone="verify" label="Credential" value={snapshot.hasAttestedCredential ? "Loaded" : "Not loaded"} good={snapshot.hasAttestedCredential} last />
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <SetupCard code="01" title="Contract registry" subtitle="Deploy or join the canonical ShieldRate contract." tone="mineral">
          <div className="micro-label">Current contract</div>
          <div className="evidence-mono mt-2 min-h-[44px] break-all text-[9px] leading-4 text-[var(--ink-soft)]">{snapshot.contractAddress ?? "NOT JOINED"}</div>
          <button className="btn-primary mt-4 w-full" disabled={busy} onClick={() => void run(async () => { const address = await deployMidnightContract(); setContractInput(address); setMessage(`Contract deployed: ${address}`); })}>Deploy ShieldRate contract</button>
          <div className="mt-4 border-t border-[var(--rule)] pt-4">
            <input className="field evidence-mono text-[9px]" placeholder="Existing contract address" value={contractInput} onChange={(event) => setContractInput(event.target.value.trim())} />
            <button className="btn-secondary mt-2 w-full" disabled={busy || !contractInput} onClick={() => void run(async () => { await joinMidnightContract(contractInput); setMessage(`Joined contract: ${contractInput}`); })}>Join existing contract</button>
          </div>
        </SetupCard>

        <SetupCard code="02" title="Holder binding" subtitle="Safe field to send to the credential issuer." tone="iris">
          <p className="text-[10px] leading-5 text-[var(--muted)]">This field binds the signed credential to browser-held private state without revealing the holder secret.</p>
          <div className="redacted-field evidence-mono mt-4 min-h-[122px] break-all p-4 text-[9px] leading-5 text-[var(--iris)]">{attestation?.holderBindingField ?? "Connect Midnight Lace to initialize holder state."}</div>
          <div className="mt-3 text-[8px] font-black uppercase tracking-[0.13em] text-[var(--iris)]">Safe to share with issuer · holderSecret remains private</div>
        </SetupCard>

        <SetupCard code="03" title="Issuer registration" subtitle="Admin transaction: provider public key only." tone="copper">
          <p className="text-[10px] leading-5 text-[var(--muted)]">Register only provider ID + Jubjub public key. The issuer signing secret never enters this interface.</p>
          <div className="mt-4 grid grid-cols-3 gap-2"><input className="field" value={providerId} onChange={(e) => setProviderId(e.target.value)} placeholder="Provider ID" /><input className="field col-span-2 evidence-mono text-[9px]" value={providerX} onChange={(e) => setProviderX(e.target.value)} placeholder="Public key X" /></div>
          <input className="field evidence-mono mt-2 text-[9px]" value={providerY} onChange={(e) => setProviderY(e.target.value)} placeholder="Public key Y" />
          <button className="btn-primary mt-3 w-full" disabled={busy || !providerId || !providerX || !providerY} onClick={() => void run(async () => { const tx = await registerMidnightProvider(BigInt(providerId), { x: BigInt(providerX), y: BigInt(providerY) }); setMessage(`Provider registered in tx ${tx.txId} at block ${tx.blockHeight}.`); })}>Register provider on-chain</button>
        </SetupCard>

        <SetupCard code="04" title="Credential import" subtitle="Signed payload only — never issuer secret." tone="verify">
          <p className="text-[10px] leading-5 text-[var(--muted)]">Paste the signed provider payload containing claim fields and the Schnorr signature.</p>
          <textarea className="field evidence-mono mt-4 h-40 resize-y text-[9px] leading-4" value={credentialJson} onChange={(event) => setCredentialJson(event.target.value)} placeholder='{"providerId":1,"credential":{...},"signature":{...}}' />
          <button className="btn-primary mt-3 w-full" disabled={busy || !credentialJson} onClick={() => void run(async () => { const payload = JSON.parse(credentialJson) as AttestedCredentialPayload; await importAttestedCredential(payload); setMessage("Issuer-attested credential loaded into session-private state."); })}>Import attested credential</button>
        </SetupCard>
      </div>

      <section className="mt-6 grid grid-cols-[6px_1fr] border border-[rgba(31,114,91,.4)] bg-[var(--verify-bg)]/75">
        <div className="bg-[var(--verify)]" />
        <div className="px-5 py-4"><div className="micro-label !text-[var(--verify)]">Live gate rule</div><p className="mt-2 text-[10px] leading-5 text-[var(--ink-soft)]">Submission is never enough. ShieldRate marks a proof verified only after transaction finalization and independent indexed-ledger confirmation of the expected receipt.</p></div>
      </section>

      {message && <div className="evidence-mono mt-4 break-all border border-[var(--verify)] bg-[var(--verify-bg)] p-4 text-[9px] leading-5 text-[var(--verify)]">{message}</div>}
    </div>
  );
}

function SetupCard({ code, title, subtitle, tone, children }: { code: string; title: string; subtitle: string; tone: "mineral" | "iris" | "copper" | "verify"; children: React.ReactNode }) {
  const toneColor = tone === "mineral" ? "var(--mineral)" : tone === "iris" ? "var(--iris)" : tone === "copper" ? "var(--copper)" : "var(--verify)";
  return (
    <section className="document-frame p-5 md:p-6">
      <div className="flex items-start justify-between gap-4 border-b border-[var(--rule)] pb-4">
        <div><div className="evidence-mono text-[8px] font-black" style={{ color: toneColor }}>{code}</div><h3 className="display-serif mt-2 text-[27px] leading-none text-[var(--ink)]">{title}</h3><p className="mt-2 text-[9px] text-[var(--muted)]">{subtitle}</p></div>
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: toneColor }} />
      </div>
      <div className="pt-5">{children}</div>
    </section>
  );
}

function RuntimeStatus({ label, value, good, tone, last = false }: { label: string; value: string; good: boolean; tone: "mineral" | "iris" | "verify"; last?: boolean }) {
  const toneClass = tone === "mineral" ? "privacy-requested" : tone === "iris" ? "privacy-hidden" : "privacy-proven";
  return <div className={`px-5 py-4 ${last ? "" : "border-b border-[var(--rule)] md:border-b-0 md:border-r"} ${toneClass}`}><div className="micro-label !text-current">{label}</div><div className={`mt-2 text-[11px] font-black ${good ? "" : "opacity-65"}`}>{value}</div></div>;
}
