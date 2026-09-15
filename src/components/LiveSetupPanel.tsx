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
    try {
      return createAttestationRequest();
    } catch {
      return null;
    }
  }, [snapshot.contractAddress, snapshot.hasAttestedCredential]);

  const run = async (action: () => Promise<void>) => {
    setBusy(true);
    setMessage("");
    try {
      await action();
      forceRefresh((value) => value + 1);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Midnight live setup failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-[1050px]">
      <header className="mb-7 border-b border-[#171b1d] pb-6">
        <div className="micro-label">Midnight live / controlled activation</div>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h2 className="display-serif text-[40px] leading-none text-[#171b1d]">Runtime setup dossier</h2>
          <span className="mode-badge mode-live">Live path</span>
        </div>
        <p className="mt-3 max-w-[760px] text-[12px] leading-5 text-[#6b706e]">
          Evidence-backed setup only. Holder/admin secrets remain session-only in this browser tab. Never paste an issuer private key or wallet seed into ShieldRate.
        </p>
      </header>

      <section className="mb-6 grid grid-cols-1 border-y border-[#171b1d] bg-[#f8f7f0]/70 md:grid-cols-3">
        <RuntimeStatus label="Lace" value={snapshot.connected ? "Connected" : "Not connected"} good={snapshot.connected} />
        <RuntimeStatus label="Network" value={snapshot.wallet?.networkId ?? "—"} good={Boolean(snapshot.wallet?.networkId)} />
        <RuntimeStatus label="Credential" value={snapshot.hasAttestedCredential ? "Loaded" : "Not loaded"} good={snapshot.hasAttestedCredential} last />
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <SetupCard code="01" title="Contract" subtitle="Deploy or join the canonical ShieldRate contract.">
          <div className="micro-label">Current contract</div>
          <div className="evidence-mono mt-2 min-h-[44px] break-all text-[10px] leading-4 text-[#4d5451]">{snapshot.contractAddress ?? "NOT JOINED"}</div>
          <button
            className="btn-primary mt-4 w-full"
            disabled={busy}
            onClick={() => void run(async () => {
              const address = await deployMidnightContract();
              setContractInput(address);
              setMessage(`Contract deployed: ${address}`);
            })}
          >
            Deploy ShieldRate contract
          </button>
          <div className="mt-4 border-t border-[#c8cac2] pt-4">
            <input
              className="field evidence-mono text-[10px]"
              placeholder="Existing contract address"
              value={contractInput}
              onChange={(event) => setContractInput(event.target.value.trim())}
            />
            <button
              className="btn-secondary mt-2 w-full"
              disabled={busy || !contractInput}
              onClick={() => void run(async () => {
                await joinMidnightContract(contractInput);
                setMessage(`Joined contract: ${contractInput}`);
              })}
            >
              Join existing contract
            </button>
          </div>
        </SetupCard>

        <SetupCard code="02" title="Holder binding" subtitle="Safe value to send to the credential issuer.">
          <p className="text-[11px] leading-5 text-[#6b706e]">
            This field binds the signed credential to browser-held private state without revealing the holder secret itself.
          </p>
          <div className="evidence-mono mt-4 min-h-[118px] break-all border border-[#c8cac2] bg-[#ecece4]/70 p-4 text-[10px] leading-5 text-[#343a3d]">
            {attestation?.holderBindingField ?? "Connect Midnight Lace to initialize holder state."}
          </div>
          <div className="mt-3 text-[9px] font-bold uppercase tracking-[0.12em] text-[#1f6b4d]">Safe to share with issuer · holderSecret remains private</div>
        </SetupCard>

        <SetupCard code="03" title="Register issuer" subtitle="Admin transaction: public key only.">
          <p className="text-[11px] leading-5 text-[#6b706e]">Register only the provider ID and Jubjub public key. The issuer signing secret never enters this interface.</p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <input className="field" value={providerId} onChange={(e) => setProviderId(e.target.value)} placeholder="Provider ID" />
            <input className="field col-span-2 evidence-mono text-[10px]" value={providerX} onChange={(e) => setProviderX(e.target.value)} placeholder="Public key X" />
          </div>
          <input className="field evidence-mono mt-2 text-[10px]" value={providerY} onChange={(e) => setProviderY(e.target.value)} placeholder="Public key Y" />
          <button
            className="btn-primary mt-3 w-full"
            disabled={busy || !providerId || !providerX || !providerY}
            onClick={() => void run(async () => {
              const tx = await registerMidnightProvider(BigInt(providerId), { x: BigInt(providerX), y: BigInt(providerY) });
              setMessage(`Provider registered in tx ${tx.txId} at block ${tx.blockHeight}.`);
            })}
          >
            Register provider on-chain
          </button>
        </SetupCard>

        <SetupCard code="04" title="Import credential" subtitle="Signed credential payload, never issuer secret.">
          <p className="text-[11px] leading-5 text-[#6b706e]">Paste the signed provider payload containing claim fields and the Schnorr signature.</p>
          <textarea
            className="field evidence-mono mt-4 h-40 resize-y text-[10px] leading-4"
            value={credentialJson}
            onChange={(event) => setCredentialJson(event.target.value)}
            placeholder='{"providerId":1,"credential":{...},"signature":{...}}'
          />
          <button
            className="btn-primary mt-3 w-full"
            disabled={busy || !credentialJson}
            onClick={() => void run(async () => {
              const payload = JSON.parse(credentialJson) as AttestedCredentialPayload;
              await importAttestedCredential(payload);
              setMessage("Issuer-attested credential loaded into session-private state.");
            })}
          >
            Import attested credential
          </button>
        </SetupCard>
      </div>

      <section className="mt-6 border-l-2 border-[#1f6b4d] bg-[#dbece2]/60 px-5 py-4">
        <div className="micro-label text-[#1f6b4d]">Live gate rule</div>
        <p className="mt-2 text-[11px] leading-5 text-[#565d5a]">A successful submission is still insufficient by itself. ShieldRate only marks a proof verified after transaction finalization and an independent indexed-ledger lookup confirms the expected receipt.</p>
      </section>

      {message && <div className="evidence-mono mt-4 break-all border border-[#1f6b4d] bg-[#dbece2] p-4 text-[10px] leading-5 text-[#1f6b4d]">{message}</div>}
    </div>
  );
}

function SetupCard({ code, title, subtitle, children }: { code: string; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="border border-[#c8cac2] bg-[#f8f7f0]/80 p-5 md:p-6">
      <div className="flex items-start justify-between gap-4 border-b border-[#c8cac2] pb-4">
        <div>
          <div className="evidence-mono text-[9px] font-black text-[#1f6b4d]">{code}</div>
          <h3 className="display-serif mt-2 text-[25px] leading-none text-[#171b1d]">{title}</h3>
          <p className="mt-2 text-[10px] text-[#8a8f8b]">{subtitle}</p>
        </div>
      </div>
      <div className="pt-5">{children}</div>
    </section>
  );
}

function RuntimeStatus({ label, value, good, last = false }: { label: string; value: string; good: boolean; last?: boolean }) {
  return (
    <div className={`px-5 py-4 ${last ? "" : "border-b border-[#c8cac2] md:border-b-0 md:border-r"}`}>
      <div className="micro-label">{label}</div>
      <div className={`mt-2 text-[12px] font-black ${good ? "text-[#1f6b4d]" : "text-[#9a5b1e]"}`}>{value}</div>
    </div>
  );
}
