// config/database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const dbFile = process.env.DB_FILE || path.join(__dirname, '..', 'dev.sqlite');

const db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
        console.error('Could not connect to sqlite', err);
        process.exit(1);
    }
    console.log('Connected to sqlite database:', dbFile);
});

// Initialize products table if not exists
const initSql = `
CREATE TABLE IF NOT EXISTS pizzas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  imageUrl TEXT,
  price REAL NOT NULL,
  is_daily BOOLEAN NOT NULL DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
`;

db.serialize(() => {
    db.run(initSql, (err) => {
        if (err) {
            console.error('Failed to initialize database', err);
            process.exit(1);
        }
    });

    db.run(`
    CREATE UNIQUE INDEX IF NOT EXISTS one_daily_pizza
    ON pizzas (is_daily)
    WHERE is_daily = 1`, (err) => {
        if (err) {
            console.error('Failed to create unique index', err);
        }
    });
});

module.exports = db;
