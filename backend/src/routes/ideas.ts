/**
 * Step 2 – Ideas Router (REST API)
 * ==================================
 * WHY: We put route handlers in their own file so app.ts stays clean.
 * Each function here handles one HTTP verb + path combination.
 *
 * REST endpoints you will implement:
 *   GET    /api/ideas         → return all ideas
 *   GET    /api/ideas/:id     → return one idea (or 404)
 *   POST   /api/ideas         → create a new idea (or 400 if invalid)
 *   PUT    /api/ideas/:id     → update an idea (or 404)
 *   DELETE /api/ideas/:id     → delete an idea (or 404) — return 204
 *
 * STUDENT TASK — implement each endpoint following docs/STEP_02_BACKEND_API.md
 * Remember: validate all inputs with Zod before touching the database!
 */

import { Router, Request, Response } from "express";
import { z } from "zod";
import db from "../db/database";
import type { Idea } from "../types";

const router = Router();

// ── Zod validation schemas ────────────────────────────────────────────────────
// WHY ZOD: Express gives us req.body as "any". Zod transforms it into a typed,
// validated object — and gives us a useful error message if something is wrong.

const createSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().default(""),
  category: z.string().optional().default("general"),
});

// For updates, every field is optional — the user may only want to change one thing.
const updateSchema = z.object({
  title: z.string().min(1, "Title cannot be empty").optional(),
  description: z.string().optional(),
  category: z.string().optional(),
});

// ── GET /api/ideas ────────────────────────────────────────────────────────────
// Returns all ideas, newest first.
// `as unknown as Idea[]` is needed because node:sqlite returns generic objects.
router.get("/", (_req: Request, res: Response): void => {
  const ideas = db
    .prepare("SELECT * FROM ideas ORDER BY created_at DESC")
    .all() as unknown as Idea[];
  res.json({ data: ideas });
});

// ── GET /api/ideas/:id ────────────────────────────────────────────────────────
// Returns one idea by id, or 404 if it does not exist.
router.get("/:id", (req: Request, res: Response): void => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "id must be a number" });
    return;
  }

  const idea = db
    .prepare("SELECT * FROM ideas WHERE id = ?")
    .get(id) as unknown as Idea | undefined;

  if (!idea) {
    res.status(404).json({ error: "Idea not found" });
    return;
  }

  res.json({ data: idea });
});

// ── POST /api/ideas ───────────────────────────────────────────────────────────
// Creates a new idea. Validates the body with Zod first.
// Returns 201 Created with the full new row (including the id assigned by SQLite).
router.post("/", (req: Request, res: Response): void => {
  const result = createSchema.safeParse(req.body);
  if (!result.success) {
    // result.error.errors[0].message gives the first human-readable Zod message
    res.status(400).json({ error: result.error.errors[0].message });
    return;
  }

  const { title, description, category } = result.data;

  // Parameterized query — ? placeholders, never string concatenation (prevents SQL injection)
  const info = db
    .prepare(
      "INSERT INTO ideas (title, description, category) VALUES (?, ?, ?)",
    )
    .run(title, description, category);

  // Fetch the row SQLite just created so we can return it (includes id, created_at, etc.)
  const newIdea = db
    .prepare("SELECT * FROM ideas WHERE id = ?")
    .get(Number(info.lastInsertRowid)) as unknown as Idea;

  res.status(201).json({ data: newIdea });
});

// ── PUT /api/ideas/:id ────────────────────────────────────────────────────────
// Updates one or more fields of an existing idea. Returns the updated row.
router.put("/:id", (req: Request, res: Response): void => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "id must be a number" });
    return;
  }

  // Check the idea exists before trying to update it
  const existing = db
    .prepare("SELECT * FROM ideas WHERE id = ?")
    .get(id) as unknown as Idea | undefined;

  if (!existing) {
    res.status(404).json({ error: "Idea not found" });
    return;
  }

  const result = updateSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.errors[0].message });
    return;
  }

  const { title, description, category } = result.data;

  // COALESCE(?, column) means: use the new value if provided, otherwise keep the old value.
  // This lets the client update just one field without affecting the others.
  db.prepare(
    `
    UPDATE ideas
    SET
      title       = COALESCE(?, title),
      description = COALESCE(?, description),
      category    = COALESCE(?, category),
      updated_at  = datetime('now')
    WHERE id = ?
  `,
  ).run(title ?? null, description ?? null, category ?? null, id);

  const updated = db
    .prepare("SELECT * FROM ideas WHERE id = ?")
    .get(id) as unknown as Idea;

  res.json({ data: updated });
});

// ── DELETE /api/ideas/:id ─────────────────────────────────────────────────────
// Deletes an idea. Returns 204 No Content (success with no body).
router.delete("/:id", (req: Request, res: Response): void => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "id must be a number" });
    return;
  }

  const existing = db
    .prepare("SELECT * FROM ideas WHERE id = ?")
    .get(id) as unknown as Idea | undefined;

  if (!existing) {
    res.status(404).json({ error: "Idea not found" });
    return;
  }

  db.prepare("DELETE FROM ideas WHERE id = ?").run(id);

  // 204 = "I did it, there's nothing to send back"
  res.status(204).send();
});

export default router;
