const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'okinawa.db'));

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
