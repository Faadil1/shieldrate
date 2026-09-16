import { Buffer } from "buffer";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./enterprise.css";

// MidnightJS 4.x utilities still reference the Node `Buffer` global (for
// example in hex conversion helpers). Vite 8 targets the browser and does not
// inject Node globals, so install the browser Buffer implementation before any
// lazy Midnight runtime module can execute.
const browserGlobal = globalThis as typeof globalThis & { Buffer?: typeof Buffer };
browserGlobal.Buffer ??= Buffer;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);