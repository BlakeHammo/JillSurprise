const Database = require('better-sqlite3');
const path = require('path');

// DATABASE_PATH can be set to a persistent volume path in production.
// e.g. on Railway: attach a volume at /data and set DATABASE_PATH=/data/okinawa.db
const dbPath = process.env.DATABASE_PATH || path.join(__dirname, 'okinawa.db');
const db = new Database(dbPath);

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS entries (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    filename      TEXT    NOT NULL,
    media_type    TEXT    NOT NULL CHECK(media_type IN ('photo', 'video')),
    caption       TEXT    DEFAULT '',
    location_name TEXT    DEFAULT '',
    latitude      REAL,
    longitude     REAL,
    category      TEXT    DEFAULT 'moments' CHECK(category IN ('food', 'scenery', 'moments')),
    date          TEXT    NOT NULL
  )
`);

module.exports = db;
