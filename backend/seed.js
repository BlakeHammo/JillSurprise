/**
 * Seed script — creates 3 beautiful placeholder PNG entries so the site
 * looks good immediately without needing real photos.
 *
 * Run: npm run seed
 */
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const { deflateSync } = require('zlib');
const db = require('./database');

// ── Minimal pure-Node PNG generator ──────────────────────────────────────────
const crcTable = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function u32(n) {
  const b = Buffer.allocUnsafe(4);
  b.writeUInt32BE(n, 0);
  return b;
}

function pngChunk(type, data) {
  const t = Buffer.from(type, 'ascii');
  return Buffer.concat([u32(data.length), t, data, u32(crc32(Buffer.concat([t, data])))]);
}

/**
 * colorFn(x, y, width, height) → [r, g, b]  (0–255 each)
 */
function makePNG(width, height, colorFn) {
  const SIG = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const IHDR = pngChunk('IHDR', Buffer.concat([u32(width), u32(height), Buffer.from([8, 2, 0, 0, 0])]));

  // Build raw scanlines (filter byte 0 = None, then RGB pixels)
  const scanlines = Buffer.alloc(height * (1 + width * 3));
  for (let y = 0; y < height; y++) {
    scanlines[y * (1 + width * 3)] = 0; // filter: None
    for (let x = 0; x < width; x++) {
      const [r, g, b] = colorFn(x, y, width, height);
      const i = y * (1 + width * 3) + 1 + x * 3;
      scanlines[i] = Math.min(255, Math.max(0, Math.round(r)));
      scanlines[i + 1] = Math.min(255, Math.max(0, Math.round(g)));
      scanlines[i + 2] = Math.min(255, Math.max(0, Math.round(b)));
    }
  }

  const IDAT = pngChunk('IDAT', deflateSync(scanlines, { level: 6 }));
  const IEND = pngChunk('IEND', Buffer.alloc(0));
  return Buffer.concat([SIG, IHDR, IDAT, IEND]);
}

// ── Colour functions for each placeholder ────────────────────────────────────

// 1. Aquarium — deep ocean blues
function aquariumColor(x, y, w, h) {
  const t = y / h;
  const s = x / w;
  const wave = Math.sin(s * Math.PI * 6 + t * 4) * 12;
  return [
    80 + t * 40 + wave * 0.3,
    150 + s * 30 - t * 20 + wave,
    220 - t * 30 + wave * 0.5,
  ];
}

// 2. Street Food — warm peachy pinks
function foodColor(x, y, w, h) {
  const t = y / h;
  const s = x / w;
  const noise = Math.sin(x * 0.04) * Math.cos(y * 0.04) * 10;
  return [
    248 - t * 25 + noise,
    160 + s * 40 - t * 30 + noise,
    140 - s * 40 + t * 20 + noise,
  ];
}

// 3. Cape Manzamo — lavender to golden sunset
function sunsetColor(x, y, w, h) {
  const t = y / h;
  const s = x / w;
  const glow = Math.sin(s * Math.PI) * 20;
  return [
    190 + s * 55 + glow * t,
    155 + s * 60 - t * 25 + glow * 0.5,
    230 - s * 80 + t * 30,
  ];
}

// ── Main ─────────────────────────────────────────────────────────────────────
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Skip if already seeded
const { n } = db.prepare('SELECT COUNT(*) AS n FROM entries').get();
if (n > 0) {
  console.log('✓ Database already has entries — skipping seed.');
  process.exit(0);
}

const W = 600, H = 400;

const seeds = [
  {
    filename: 'seed-aquarium.png',
    colorFn: aquariumColor,
    caption: 'The magnificent Churaumi Aquarium — one of the largest in the world! The whale sharks were absolutely breathtaking. 🐋',
    location_name: 'Churaumi Aquarium, Motobu',
    latitude: 26.6938,
    longitude: 127.8777,
    category: 'scenery',
    date: '2026-02-24',
  },
  {
    filename: 'seed-food.png',
    colorFn: foodColor,
    caption: 'Kokusai-dori Street — the colours, the smells, the energy! Found the most amazing Okinawan soba tucked inside a tiny side alley. 🍜',
    location_name: 'Kokusai-dori Street, Naha',
    latitude: 26.2124,
    longitude: 127.6809,
    category: 'food',
    date: '2026-02-25',
  },
  {
    filename: 'seed-sunset.png',
    colorFn: sunsetColor,
    caption: 'Cape Manzamo at golden hour — the elephant-trunk rock against a pastel sky. Some views make your heart just stop. 🌅',
    location_name: 'Cape Manzamo, Onna',
    latitude: 26.5052,
    longitude: 127.8748,
    category: 'moments',
    date: '2026-02-26',
  },
];

const insert = db.prepare(`
  INSERT INTO entries (filename, media_type, caption, location_name, latitude, longitude, category, date)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

for (const s of seeds) {
  const png = makePNG(W, H, s.colorFn);
  fs.writeFileSync(path.join(uploadsDir, s.filename), png);
  insert.run(s.filename, 'photo', s.caption, s.location_name, s.latitude, s.longitude, s.category, s.date);
  console.log(`✓ Created ${s.filename}`);
}

console.log('\n🌸 Seed complete! 3 entries added.');
