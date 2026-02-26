const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../database');

const router = express.Router();

// ── Multer setup ──────────────────────────────────────────────────────────────
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, unique + path.extname(file.originalname).toLowerCase());
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 200 * 1024 * 1024 }, // 200 MB
  fileFilter: (_req, file, cb) => {
    const allowed = /\.(jpe?g|png|gif|webp|avif|mp4|mov|avi|webm|mkv)$/i;
    if (allowed.test(path.extname(file.originalname))) return cb(null, true);
    cb(new Error('Unsupported file type. Please upload a photo or video.'));
  },
});

// ── Auth middleware ───────────────────────────────────────────────────────────
function requireAuth(req, res, next) {
  const header = req.headers['authorization'] || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : header;
  if (token && token === process.env.ADMIN_PASSWORD) return next();
  res.status(401).json({ error: 'Unauthorized.' });
}

// ── GET /api/entries ─────────────────────────────────────────────────────────
router.get('/', (_req, res) => {
  const entries = db.prepare('SELECT * FROM entries ORDER BY date DESC, id DESC').all();
  res.json(entries);
});

// ── POST /api/entries ────────────────────────────────────────────────────────
router.post('/', requireAuth, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file was uploaded.' });

  const videoExts = ['.mp4', '.mov', '.avi', '.webm', '.mkv'];
  const ext = path.extname(req.file.filename).toLowerCase();
  const media_type = videoExts.includes(ext) ? 'video' : 'photo';

  const { caption = '', location_name = '', latitude, longitude, category = 'moments', date } = req.body;

  const stmt = db.prepare(`
    INSERT INTO entries (filename, media_type, caption, location_name, latitude, longitude, category, date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    req.file.filename,
    media_type,
    caption,
    location_name,
    latitude ? parseFloat(latitude) : null,
    longitude ? parseFloat(longitude) : null,
    category,
    date || new Date().toISOString().split('T')[0],
  );

  const entry = db.prepare('SELECT * FROM entries WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(entry);
});

// ── DELETE /api/entries/:id ──────────────────────────────────────────────────
router.delete('/:id', requireAuth, (req, res) => {
  const entry = db.prepare('SELECT * FROM entries WHERE id = ?').get(req.params.id);
  if (!entry) return res.status(404).json({ error: 'Entry not found.' });

  const filePath = path.join(uploadsDir, entry.filename);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

  db.prepare('DELETE FROM entries WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
