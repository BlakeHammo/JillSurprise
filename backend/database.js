const Database = require('better-sqlite3');
const path = require('path');

// DATABASE_PATH can be set to a persistent volume path in production.
// e.g. on Railway: attach a volume at /data and set DATABASE_PATH=/data/okinawa.db
const dbPath = process.env.DATABASE_PATH || path.join(__dirname, 'okinawa.db');
const db = new Database(dbPath);

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

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
  );

  CREATE TABLE IF NOT EXISTS entry_media (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    entry_id   INTEGER NOT NULL,
    filename   TEXT    NOT NULL,
    media_type TEXT    NOT NULL DEFAULT 'photo',
    sort_order INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (entry_id) REFERENCES entries(id) ON DELETE CASCADE
  );
`);

module.exports = db;
