const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../database');
const { storage, isCloudinary } = require('../cloudinary');

const router = express.Router();

// ── Multer instance (disk or Cloudinary, depending on env) ────────────────────
const uploadsDir = path.join(__dirname, '..', 'uploads');

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

/**
 * Extract a storable "filename" value from the uploaded file.
 * - Disk mode  → local filename  (e.g. "1716000000000-123456789.jpg")
 * - Cloudinary → secure HTTPS URL (e.g. "https://res.cloudinary.com/…")
 *   This means api.mediaUrl() just returns it as-is on the frontend.
 */
function getStoredFilename(file) {
  if (isCloudinary) return file.path; // multer-storage-cloudinary sets file.path = secure_url
  return file.filename;
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
  const ext = path.extname(req.file.originalname).toLowerCase();
  const media_type = videoExts.includes(ext) ? 'video' : 'photo';

  const { caption = '', location_name = '', latitude, longitude, category = 'moments', date } = req.body;

  const stmt = db.prepare(`
    INSERT INTO entries (filename, media_type, caption, location_name, latitude, longitude, category, date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    getStoredFilename(req.file),
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

// ── PUT /api/entries/:id ─────────────────────────────────────────────────────
router.put('/:id', requireAuth, (req, res) => {
  const existing = db.prepare('SELECT * FROM entries WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Entry not found.' });

  const { caption, location_name, latitude, longitude, category, date } = req.body;

  // Only update metadata — filename and media_type are immutable after upload
  db.prepare(`
    UPDATE entries
    SET caption       = ?,
        location_name = ?,
        latitude      = ?,
        longitude     = ?,
        category      = ?,
        date          = ?
    WHERE id = ?
  `).run(
    caption       ?? existing.caption,
    location_name ?? existing.location_name,
    latitude  !== undefined ? (latitude  !== '' ? parseFloat(latitude)  : null) : existing.latitude,
    longitude !== undefined ? (longitude !== '' ? parseFloat(longitude) : null) : existing.longitude,
    category      || existing.category,
    date          || existing.date,
    req.params.id,
  );

  const updated = db.prepare('SELECT * FROM entries WHERE id = ?').get(req.params.id);
  res.json(updated);
});

// ── DELETE /api/entries/:id ──────────────────────────────────────────────────
router.delete('/:id', requireAuth, (req, res) => {
  const entry = db.prepare('SELECT * FROM entries WHERE id = ?').get(req.params.id);
  if (!entry) return res.status(404).json({ error: 'Entry not found.' });

  // Only delete local file — Cloudinary files are managed via Cloudinary dashboard
  if (!isCloudinary) {
    const filePath = path.join(uploadsDir, entry.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }

  db.prepare('DELETE FROM entries WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
