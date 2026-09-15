import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const managed = resolve(root, "contracts/managed/shieldrate");
const publicDir = resolve(root, "public");
const pairs = [
  [resolve(managed, "keys"), resolve(publicDir, "keys")],
  [resolve(managed, "zkir"), resolve(publicDir, "zkir")],
];

for (const [source, target] of pairs) {
  if (!existsSync(source)) {
    throw new Error(`Missing Compact output: ${source}. Run npm run compact first.`);
  }
  rmSync(target, { recursive: true, force: true });
  mkdirSync(target, { recursive: true });
  cpSync(source, target, { recursive: true });
}

console.log("Synced ShieldRate Midnight keys + ZKIR into public/.");
