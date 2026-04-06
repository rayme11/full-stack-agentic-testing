/**
 * Database module
 * ===============
 * WHY: We separate database logic from route handlers.
 * This is called the "Separation of Concerns" principle —
 * each module has ONE job and is easy to test independently.
 *
 * CONCEPT: SQLite is a serverless, file-based database.
 * Perfect for learning because it needs zero configuration —
 * just a file path and you're ready to go.
 *
 * STUDENT NOTE: We use Node.js's BUILT-IN sqlite module (node:sqlite),
 * added in Node.js 22. This means NO npm install needed for the database —
 * it comes with Node itself! This is a great example of how the Node.js
 * standard library is growing to include more built-in tools.
 */

import { DatabaseSync } from "node:sqlite";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

// ── Resolve database file path ────────────────────────────────────────────────
const DB_PATH = process.env.DB_PATH ?? "./data/ideas.db";
const resolvedPath = path.resolve(DB_PATH);

// Ensure the data directory exists (SQLite cannot create directories)
const dir = path.dirname(resolvedPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// ── Open / create the database ────────────────────────────────────────────────
// DatabaseSync opens the database file, or creates it if it doesn't exist.
const db = new DatabaseSync(resolvedPath);

// Enable WAL mode for better performance and concurrency.
// WHY WAL: "Write-Ahead Logging" allows reads and writes to happen
// at the same time, which is important in a web server context.
db.exec("PRAGMA journal_mode = WAL");
db.exec("PRAGMA foreign_keys = ON");

// ── Create the ideas table if it does not exist ───────────────────────────────
// WHY "IF NOT EXISTS": This file runs every time the server starts.
// We only want to create the table on the FIRST run — not crash on restarts.
db.exec(`
  CREATE TABLE IF NOT EXISTS ideas (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT    NOT NULL,
    description TEXT    NOT NULL DEFAULT '',
    category    TEXT    NOT NULL DEFAULT 'general',
    created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
  );
`);

export default db;
