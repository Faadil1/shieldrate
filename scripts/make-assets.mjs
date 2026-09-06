// Generates ShieldRate brand assets as real PNGs (no image libs required):
//   public/favicon-32.png, public/apple-touch-icon.png (180),
//   public/icon-192.png, public/icon-512.png, assets/og-image.png (1200x630)
import zlib from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/* ---------------- PNG encoder ---------------- */

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([len, typeBuf, data, crc]);
}

function encodePng(width, height, rgba) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0;
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

/* ---------------- geometry helpers (boolean tests, supersampled AA) ---------------- */

function inRoundedRect(px, py, half, r) {
  const qx = Math.abs(px) - (half - r);
  const qy = Math.abs(py) - (half - r);
  if (qx > 0 || qy > 0) {
    const cx = Math.max(qx, 0);
    const cy = Math.max(qy, 0);
    return cx * cx + cy * cy <= r * r;
  }
  return true;
}

function inRingStrokes(d, r, w) {
  return Math.abs(d - r) <= w / 2;
}

function pointInPoly(px, py, pts) {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const xi = pts[i][0];
    const yi = pts[i][1];
    const xj = pts[j][0];
    const yj = pts[j][1];
    if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

function distToSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  const l2 = dx * dx + dy * dy;
  const t = l2 === 0 ? 0 : Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / l2));
  const cx = ax + t * dx;
  const cy = ay + t * dy;
  return Math.hypot(px - cx, py - cy);
}

/* ---------------- ShieldRate mark renderer ---------------- */

function renderMark(width, height) {
  const S = Math.min(width, height) / 600;
  const cx = width / 2;
  const cy = height / 2;

  const rings = [
    { r: 200 * S, w: 10 * S, color: [38, 38, 38, 255] }, // outer (night-700)
    { r: 160 * S, w: 10 * S, color: [20, 83, 45, 255] }, // rate-900
    { r: 120 * S, w: 10 * S, color: [26, 26, 26, 255] }, // night-800
  ];
  const tileHalf = 72 * S;
  const tileRadius = 20 * S;
  const SHIELD = [
    [0, -40], [62, -26], [58, 32], [0, 64], [-58, 32], [-62, -26],
  ].map(([x, y]) => [cx + x * S, cy + y * S]);
  const CHECK = [
    [-22, 8], [0, 30], [34, -16],
  ].map(([x, y]) => [cx + x * S, cy + y * S]);
  const checkW = 13 * S;

  const bg = [17, 17, 17, 255];
  const rgba = Buffer.alloc(width * height * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let rSum = 0;
      let gSum = 0;
      let bSum = 0;
      let aSum = 0;
      const samples = 16;
      for (let sy = 0; sy < 4; sy++) {
        for (let sx = 0; sx < 4; sx++) {
          const px = x + (sx + 0.5) / 4;
          const py = y + (sy + 0.5) / 4;
          const dx = px - cx;
          const dy = py - cy;
          let color = bg;
          for (const ring of rings) {
            if (inRingStrokes(Math.hypot(dx, dy), ring.r, ring.w)) {
              color = ring.color;
              break;
            }
          }
          if (inRoundedRect(dx, dy, tileHalf, tileRadius)) color = [20, 83, 45, 255];
          if (pointInPoly(px, py, SHIELD)) color = [34, 197, 94, 255];
          const dCheck = Math.min(
            distToSegment(px, py, ...CHECK[0], ...CHECK[1]),
            distToSegment(px, py, ...CHECK[1], ...CHECK[2])
          );
          if (dCheck < checkW) color = [17, 17, 17, 255];
          rSum += color[0];
          gSum += color[1];
          bSum += color[2];
          aSum += color[3];
        }
      }
      const i = (y * width + x) * 4;
      rgba[i] = Math.round(rSum / samples);
      rgba[i + 1] = Math.round(gSum / samples);
      rgba[i + 2] = Math.round(bSum / samples);
      rgba[i + 3] = Math.round(aSum / samples);
    }
  }
  return rgba;
}

/* ---------------- write assets ---------------- */

const targets = [
  { out: "public/favicon-32.png", width: 32, height: 32 },
  { out: "public/apple-touch-icon.png", width: 180, height: 180 },
  { out: "public/icon-192.png", width: 192, height: 192 },
  { out: "public/icon-512.png", width: 512, height: 512 },
  { out: "assets/og-image.png", width: 1200, height: 630 },
];

for (const { out, width, height } of targets) {
  const rgba = renderMark(width, height);
  const png = encodePng(width, height, rgba);
  const file = join(root, out);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, png);
  console.log(`✓ ${out} (${width}x${height}) — ${(png.length / 1024).toFixed(1)} KB`);
}

console.log("\nDone.");