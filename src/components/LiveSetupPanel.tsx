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
    <div className="max-w-4xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">Midnight Live Setup</h2>
        <p className="text-sm text-mist-500 mt-2">
          Evidence-backed setup only. Holder/admin secrets stay session-only in this browser tab. Never paste an issuer private key or wallet seed here.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card title="1 · Contract">
          <div className="text-xs text-mist-600 mb-3">Current contract</div>
          <div className="font-mono text-xs break-all text-mist-300 mb-4">{snapshot.contractAddress ?? "Not joined"}</div>
          <button
            className="btn-primary w-full mb-3"
            disabled={busy}
            onClick={() => void run(async () => {
              const address = await deployMidnightContract();
              setContractInput(address);
              setMessage(`Contract deployed: ${address}`);
            })}
          >
            Deploy new ShieldRate contract
          </button>
          <input
            className="w-full bg-night-950 border border-night-700 rounded-lg px-3 py-2 text-sm mb-2"
            placeholder="Existing contract address"
            value={contractInput}
            onChange={(event) => setContractInput(event.target.value.trim())}
          />
          <button
            className="btn-secondary w-full"
            disabled={busy || !contractInput}
            onClick={() => void run(async () => {
              await joinMidnightContract(contractInput);
              setMessage(`Joined contract: ${contractInput}`);
            })}
          >
            Join existing contract
          </button>
        </Card>

        <Card title="2 · Holder binding">
          <p className="text-xs text-mist-500 mb-3">
            Send this field to the credential issuer. It binds the credential to this browser-held secret without revealing that secret.
          </p>
          <div className="bg-night-950 border border-night-700 rounded-lg p-3 font-mono text-xs break-all text-mist-300 min-h-[82px]">
            {attestation?.holderBindingField ?? "Connect Midnight Lace to initialize the holder state."}
          </div>
        </Card>

        <Card title="3 · Register issuer public key">
          <p className="text-xs text-mist-500 mb-3">Admin-only transaction. Register only the provider ID and Jubjub public key.</p>
          <div className="grid grid-cols-3 gap-2 mb-2">
            <input className="bg-night-950 border border-night-700 rounded-lg px-3 py-2 text-sm" value={providerId} onChange={(e) => setProviderId(e.target.value)} placeholder="Provider ID" />
            <input className="col-span-2 bg-night-950 border border-night-700 rounded-lg px-3 py-2 text-sm" value={providerX} onChange={(e) => setProviderX(e.target.value)} placeholder="Public key X" />
          </div>
          <input className="w-full bg-night-950 border border-night-700 rounded-lg px-3 py-2 text-sm mb-2" value={providerY} onChange={(e) => setProviderY(e.target.value)} placeholder="Public key Y" />
          <button
            className="btn-primary w-full"
            disabled={busy || !providerId || !providerX || !providerY}
            onClick={() => void run(async () => {
              const tx = await registerMidnightProvider(BigInt(providerId), { x: BigInt(providerX), y: BigInt(providerY) });
              setMessage(`Provider registered in tx ${tx.txId} at block ${tx.blockHeight}.`);
            })}
          >
            Register provider on-chain
          </button>
        </Card>

        <Card title="4 · Import signed credential">
          <p className="text-xs text-mist-500 mb-3">
            Paste only the signed credential payload: provider ID, private claim values and Schnorr signature. The issuer secret never belongs here.
          </p>
          <textarea
            className="w-full h-36 bg-night-950 border border-night-700 rounded-lg px-3 py-2 text-xs font-mono mb-2"
            value={credentialJson}
            onChange={(event) => setCredentialJson(event.target.value)}
            placeholder='{"providerId":1,"credential":{...},"signature":{...}}'
          />
          <button
            className="btn-primary w-full"
            disabled={busy || !credentialJson}
            onClick={() => void run(async () => {
              const payload = JSON.parse(credentialJson) as AttestedCredentialPayload;
              await importAttestedCredential(payload);
              setMessage("Issuer-attested credential loaded into session-private state.");
            })}
          >
            Import attested credential
          </button>
        </Card>
      </div>

      <div className="mt-5 rounded-xl border border-night-700 bg-night-800/50 p-4 text-xs">
        <div className="flex justify-between"><span className="text-mist-600">Lace</span><span>{snapshot.connected ? "Connected" : "Not connected"}</span></div>
        <div className="flex justify-between mt-2"><span className="text-mist-600">Network</span><span>{snapshot.wallet?.networkId ?? "—"}</span></div>
        <div className="flex justify-between mt-2"><span className="text-mist-600">Credential</span><span>{snapshot.hasAttestedCredential ? "Loaded" : "Not loaded"}</span></div>
      </div>

      {message && <div className="mt-4 rounded-xl border border-rate-500/20 bg-rate-900/20 p-4 text-sm text-rate-300 break-all">{message}</div>}
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="card p-5">
      <h3 className="text-sm font-semibold text-white mb-4">{title}</h3>
      {children}
    </section>
  );
}
