/**
 * Conditional Cloudinary storage for multer.
 *
 * When CLOUDINARY_URL is set (production), files are uploaded directly to
 * Cloudinary and the returned secure_url is stored in the database as `filename`.
 *
 * When CLOUDINARY_URL is NOT set (local dev), multer falls back to disk storage
 * in the /uploads folder — no changes needed to the rest of the app.
 *
 * CLOUDINARY_URL format (Cloudinary provides this automatically):
 *   cloudinary://API_KEY:API_SECRET@CLOUD_NAME
 */
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const CLOUDINARY_URL = process.env.CLOUDINARY_URL;

let storage;

if (CLOUDINARY_URL) {
  // ── Cloudinary mode (production) ────────────────────────────────────────
  // cloudinary package auto-reads CLOUDINARY_URL from the environment
  storage = new CloudinaryStorage({
    cloudinary,
    params: async (_req, file) => {
      const isVideo = /\.(mp4|mov|avi|webm|mkv)$/i.test(file.originalname);
      return {
        folder: 'okinawa-diaries',
        resource_type: isVideo ? 'video' : 'image',
        // Use the original name (slug-ified) for nicer CDN URLs
        public_id: `${Date.now()}-${path.basename(file.originalname, path.extname(file.originalname))}`,
      };
    },
  });
  console.log('📦 Using Cloudinary for file storage.');
} else {
  // ── Disk mode (local development) ────────────────────────────────────────
  const uploadsDir = path.join(__dirname, 'uploads');
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadsDir),
    filename: (_req, file, cb) => {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, unique + path.extname(file.originalname).toLowerCase());
    },
  });
  console.log('📁 Using local disk for file storage (set CLOUDINARY_URL for production).');
}

module.exports = {
  storage,
  isCloudinary: !!CLOUDINARY_URL,
};
