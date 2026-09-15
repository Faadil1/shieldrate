import { createServer } from "node:http";
import { getPublicKey, signShieldRateCredential } from "./signing.mjs";

const requiredBigInt = (name) => {
  const raw = process.env[name]?.trim();
  if (!raw) throw new Error(`${name} is required.`);
  return BigInt(raw);
};

const envBigInt = (name, fallback) => {
  const raw = process.env[name]?.trim();
  return raw ? BigInt(raw) : fallback;
};

const envNumber = (name, fallback) => {
  const raw = process.env[name]?.trim();
  const value = raw ? Number(raw) : fallback;
  if (!Number.isFinite(value)) throw new Error(`${name} must be a finite number.`);
  return value;
};

const config = {
  port: envNumber("PORT", 8787),
  providerSecret: requiredBigInt("SHIELDRATE_PROVIDER_SECRET"),
  providerId: envBigInt("SHIELDRATE_PROVIDER_ID", 1n),
  providerEpoch: envBigInt("SHIELDRATE_PROVIDER_EPOCH", 0n),
  allowedOrigin: process.env.SHIELDRATE_ALLOWED_ORIGIN?.trim() || "*",
  credentialTtlSeconds: envNumber("SHIELDRATE_CREDENTIAL_TTL_SECONDS", 30 * 24 * 60 * 60),
  profile: {
    income: envBigInt("SHIELDRATE_DEMO_INCOME", 68000n),
    ratingX100: envBigInt("SHIELDRATE_DEMO_RATING_X100", 487n),
    completedJobs: envBigInt("SHIELDRATE_DEMO_COMPLETED_JOBS", 120n),
  },
};

const publicKey = getPublicKey(config.providerSecret);

const json = (res, status, body) => {
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "access-control-allow-origin": config.allowedOrigin,
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "content-type",
    "cache-control": "no-store",
  });
  res.end(JSON.stringify(body));
};

const readJson = async (req) => {
  const chunks = [];
  let bytes = 0;
  for await (const chunk of req) {
    bytes += chunk.length;
    if (bytes > 16_384) throw new Error("Request body too large.");
    chunks.push(chunk);
  }
  if (chunks.length === 0) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
};

const serializeSignature = (signature) => ({
  announcement: {
    x: signature.announcement.x.toString(),
    y: signature.announcement.y.toString(),
  },
  response: signature.response.toString(),
});

const makeAttestation = (holderBindingField) => {
  if (holderBindingField < 0n) throw new Error("holderBindingField must be non-negative.");

  const issuedAtEpoch = BigInt(Math.floor(Date.now() / 1000));
  const expiresAtEpoch = issuedAtEpoch + BigInt(config.credentialTtlSeconds);
  const credential = {
    income: config.profile.income,
    ratingX100: config.profile.ratingX100,
    completedJobs: config.profile.completedJobs,
    issuedAtEpoch,
    expiresAtEpoch,
    providerEpoch: config.providerEpoch,
  };

  const message = [
    credential.income,
    credential.ratingX100,
    credential.completedJobs,
    credential.issuedAtEpoch,
    credential.expiresAtEpoch,
    credential.providerEpoch,
    holderBindingField,
  ];

  const signature = signShieldRateCredential(config.providerSecret, message);
  return { credential, signature };
};

const server = createServer(async (req, res) => {
  try {
    if (req.method === "OPTIONS") {
      json(res, 204, {});
      return;
    }

    const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);

    if (req.method === "GET" && url.pathname === "/health") {
      json(res, 200, {
        status: "ok",
        mode: "demo-issuer",
        providerId: config.providerId.toString(),
      });
      return;
    }

    if (req.method === "GET" && url.pathname === "/provider-info") {
      json(res, 200, {
        providerId: config.providerId.toString(),
        providerEpoch: config.providerEpoch.toString(),
        publicKey: { x: publicKey.x.toString(), y: publicKey.y.toString() },
        credentialSource: "server-owned demo profile",
      });
      return;
    }

    if (req.method === "POST" && url.pathname === "/attest") {
      const body = await readJson(req);
      if (body.holderBindingField === undefined || body.holderBindingField === null) {
        json(res, 400, { error: "holderBindingField is required." });
        return;
      }

      const holderBindingField = BigInt(String(body.holderBindingField));
      const { credential, signature } = makeAttestation(holderBindingField);
      json(res, 200, {
        providerId: config.providerId.toString(),
        credential: Object.fromEntries(
          Object.entries(credential).map(([key, value]) => [key, value.toString()]),
        ),
        signature: serializeSignature(signature),
        disclosure: {
          receivedFromHolder: ["holderBindingField"],
          rawCredentialReceivedFromHolder: false,
        },
      });
      return;
    }

    json(res, 404, { error: "Not found." });
  } catch (error) {
    json(res, 400, {
      error: error instanceof Error ? error.message : "Invalid request.",
    });
  }
});

server.listen(config.port, () => {
  console.log(
    `ShieldRate demo issuer listening on :${config.port} (provider ${config.providerId.toString()})`,
  );
});
