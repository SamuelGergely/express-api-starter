// Pizza/config/database.js
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

// Initialize Pizza table if not exists
const initPizzaSql = `
CREATE TABLE IF NOT EXISTS pizzas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  imageUrl TEXT,
  price REAL NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
`;

// Initialize Ingredients table if not exists
const initIngredientsSql = `
CREATE TABLE IF NOT EXISTS ingredients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  price REAL NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
`;

db.serialize(() => {
    db.run(initPizzaSql, (err) => {
        if (err) {
            console.error('Failed to initialize Pizza database', err);
            process.exit(1);
        }
    });

    db.run(initIngredientsSql, (err) => {
        if (err) {
            console.error('Failed to initialize Ingredients database', err);
            process.exit(1);
        }
    })
});

module.exports = db;
