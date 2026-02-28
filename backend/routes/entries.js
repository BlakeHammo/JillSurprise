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
 */
function getStoredFilename(file) {
  if (isCloudinary) return file.path;
  return file.filename;
}

/**
 * Attach the full media array to an entry row.
 * Index 0 is always the primary (entries.filename).
 * Additional files from entry_media follow in sort_order.
 */
function withMedia(entry) {
  const extras = db
    .prepare('SELECT filename, media_type, sort_order FROM entry_media WHERE entry_id = ? ORDER BY sort_order')
    .all(entry.id);
  const media = [
    { filename: entry.filename, media_type: entry.media_type, sort_order: 0 },
    ...extras,
  ];
  return { ...entry, media };
}

// ── GET /api/entries ─────────────────────────────────────────────────────────
router.get('/', (_req, res) => {
  const entries = db.prepare('SELECT * FROM entries ORDER BY date DESC, id DESC').all();
  res.json(entries.map(withMedia));
});

// ── POST /api/entries ────────────────────────────────────────────────────────
// Accepts up to 20 files under the field name "file"
router.post('/', requireAuth, upload.array('file', 20), (req, res) => {
  const files = req.files;
  if (!files || files.length === 0) return res.status(400).json({ error: 'No file was uploaded.' });

  const videoExts = ['.mp4', '.mov', '.avi', '.webm', '.mkv'];
  const firstExt = path.extname(files[0].originalname).toLowerCase();
  const firstType = videoExts.includes(firstExt) ? 'video' : 'photo';

  const { caption = '', location_name = '', latitude, longitude, category = 'moments', date } = req.body;

  const result = db.prepare(`
    INSERT INTO entries (filename, media_type, caption, location_name, latitude, longitude, category, date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    getStoredFilename(files[0]),
    firstType,
    caption,
    location_name,
    latitude ? parseFloat(latitude) : null,
    longitude ? parseFloat(longitude) : null,
    category,
    date || new Date().toISOString().split('T')[0],
  );

  // Store additional files (index 1+) in entry_media
  if (files.length > 1) {
    const insertMedia = db.prepare(
      'INSERT INTO entry_media (entry_id, filename, media_type, sort_order) VALUES (?, ?, ?, ?)'
    );
    files.slice(1).forEach((file, i) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const type = videoExts.includes(ext) ? 'video' : 'photo';
      insertMedia.run(result.lastInsertRowid, getStoredFilename(file), type, i + 1);
    });
  }

  const entry = db.prepare('SELECT * FROM entries WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(withMedia(entry));
});

// ── PUT /api/entries/:id ─────────────────────────────────────────────────────
router.put('/:id', requireAuth, (req, res) => {
  const existing = db.prepare('SELECT * FROM entries WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Entry not found.' });

  const { caption, location_name, latitude, longitude, category, date } = req.body;

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
  res.json(withMedia(updated));
});

// ── DELETE /api/entries/:id ──────────────────────────────────────────────────
router.delete('/:id', requireAuth, (req, res) => {
  const entry = db.prepare('SELECT * FROM entries WHERE id = ?').get(req.params.id);
  if (!entry) return res.status(404).json({ error: 'Entry not found.' });

  if (!isCloudinary) {
    // Delete primary file
    const filePath = path.join(uploadsDir, entry.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    // Delete additional media files
    const extras = db.prepare('SELECT filename FROM entry_media WHERE entry_id = ?').all(req.params.id);
    extras.forEach((m) => {
      const p = path.join(uploadsDir, m.filename);
      if (fs.existsSync(p)) fs.unlinkSync(p);
    });
  }

  // CASCADE deletes entry_media rows automatically
  db.prepare('DELETE FROM entries WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
