/**
 * Step 2 – Database Module (SQLite)
 * ===================================
 * WHY: We keep all database setup in one place so routes stay clean.
 * This is the "Separation of Concerns" principle.
 *
 * WHAT IS node:sqlite?
 *   Node.js 22 ships with a built-in SQLite module — no npm install needed!
 *   DatabaseSync opens (or creates) a database FILE on disk.
 *
 * STUDENT TASK — complete the TODOs below following docs/STEP_02_BACKEND_API.md
 */

import { DatabaseSync } from "node:sqlite";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

// ── 1. Resolve the file path ─────────────────────────────────────────────────
const DB_PATH = process.env.DB_PATH ?? "./data/ideas.db";
const resolvedPath = path.resolve(DB_PATH);

// SQLite cannot create parent directories — we must create them first.
const dir = path.dirname(resolvedPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// ── 2. Open the database ──────────────────────────────────────────────────────
const db = new DatabaseSync(resolvedPath);

// ── 3. Configure pragmas ──────────────────────────────────────────────────────
// TODO: Enable WAL journal mode for better performance
// Hint: db.exec("PRAGMA journal_mode = WAL");

// TODO: Enable foreign key enforcement
// Hint: db.exec("PRAGMA foreign_keys = ON");

// ── 4. Create the ideas table ─────────────────────────────────────────────────
// TODO: Use db.exec() to CREATE TABLE IF NOT EXISTS ideas with columns:
//   id          INTEGER PRIMARY KEY AUTOINCREMENT
//   title       TEXT NOT NULL
//   description TEXT NOT NULL DEFAULT ''
//   category    TEXT NOT NULL DEFAULT 'general'
//   created_at  TEXT NOT NULL DEFAULT (datetime('now'))
//   updated_at  TEXT NOT NULL DEFAULT (datetime('now'))

export default db;
