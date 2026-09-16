import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import wasm from "vite-plugin-wasm";

const protocolDependencies = resolve(
  process.cwd(),
  "node_modules/@midnight-ntwrk/midnight-js-protocol/node_modules",
);
const protocolOnchainRuntime = resolve(
  protocolDependencies,
  "@midnight-ntwrk/onchain-runtime-v3",
);
const protocolLedger = resolve(
  protocolDependencies,
  "@midnight-ntwrk/ledger-v8",
);

export default defineConfig({
  base: "./",
  cacheDir: "./.vite",
  build: {
    target: "esnext",
    commonjsOptions: {
      transformMixedEsModules: true,
      extensions: [".js", ".cjs"],
      ignoreDynamicRequires: true,
    },
  },
  plugins: [
    react(),
    wasm(),
  ],
  optimizeDeps: {
    esbuildOptions: {
      target: "esnext",
      supported: { "top-level-await": true },
      platform: "browser",
      format: "esm",
      loader: { ".wasm": "binary" },
    },
    include: ["@midnight-ntwrk/compact-runtime"],
    exclude: [
      "@midnight-ntwrk/onchain-runtime-v3",
      "@midnight-ntwrk/onchain-runtime-v3/midnight_onchain_runtime_wasm_bg.wasm",
      "@midnight-ntwrk/onchain-runtime-v3/midnight_onchain_runtime_wasm.js",
    ],
  },
  resolve: {
    // midnight-js-protocol@4.1.1 pins onchain-runtime-v3@3.0.0 and
    // ledger-v8@8.1.0, while the current lockfile also contains newer root
    // copies. In a browser build, loading both WASM/runtime copies breaks
    // wasm-bindgen identity and can surface as missing/undefined exports such
    // as contractstate_deserialize. Resolve every consumer to the protocol
    // copies, then dedupe the full runtime boundary.
    alias: {
      "@midnight-ntwrk/onchain-runtime-v3": protocolOnchainRuntime,
      "@midnight-ntwrk/ledger-v8": protocolLedger,
    },
    dedupe: [
      "@midnight-ntwrk/compact-runtime",
      "@midnight-ntwrk/onchain-runtime-v3",
      "@midnight-ntwrk/ledger-v8",
    ],
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".wasm"],
    mainFields: ["browser", "module", "main"],
  },
  server: {
    port: 5173,
  },
});
