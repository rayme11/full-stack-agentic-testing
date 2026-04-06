/**
 * Ideas router
 * ============
 * WHY: By putting route handlers in their own file (router), we keep
 * the main `app.ts` file clean and focused on app-level concerns only.
 *
 * REST API endpoints implemented here:
 *   GET    /api/ideas          – list all ideas
 *   GET    /api/ideas/:id      – get one idea
 *   POST   /api/ideas          – create a new idea
 *   PUT    /api/ideas/:id      – update an existing idea
 *   DELETE /api/ideas/:id      – delete an idea
 */

import { Router, Request, Response } from "express";
import { z } from "zod";
import db from "../db/database";
import type { Idea, CreateIdeaInput, UpdateIdeaInput } from "../types";

const router = Router();

// ── Zod validation schemas ────────────────────────────────────────────────────
// WHY: Never trust user input! Zod validates request bodies at runtime
// so TypeScript type safety extends all the way from the HTTP request.

const createSchema = z.object({
  title: z.string({ required_error: "Title is required" }).min(1, "Title is required").max(200, "Title too long"),
  description: z.string().max(2000, "Description too long").default(""),
  category: z.string().max(50).default("general"),
});

const updateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  category: z.string().max(50).optional(),
});

// ── GET /api/ideas ─────────────────────────────────────────────────────────────
router.get("/", (_req: Request, res: Response): void => {
  const ideas = db.prepare("SELECT * FROM ideas ORDER BY created_at DESC").all() as unknown as Idea[];
  res.json({ data: ideas });
});

// ── GET /api/ideas/:id ─────────────────────────────────────────────────────────
router.get("/:id", (req: Request, res: Response): void => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid idea ID" });
    return;
  }

  const idea = db.prepare("SELECT * FROM ideas WHERE id = ?").get(id) as unknown as Idea | undefined;
  if (!idea) {
    res.status(404).json({ error: "Idea not found" });
    return;
  }

  res.json({ data: idea });
});

// ── POST /api/ideas ────────────────────────────────────────────────────────────
router.post("/", (req: Request, res: Response): void => {
  const result = createSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.errors.map((e) => e.message).join(", ") });
    return;
  }

  const { title, description, category } = result.data as CreateIdeaInput & { category: string };

  const stmt = db.prepare(
    "INSERT INTO ideas (title, description, category) VALUES (?, ?, ?)"
  );
  const info = stmt.run(title, description, category);

  const created = db.prepare("SELECT * FROM ideas WHERE id = ?").get(info.lastInsertRowid) as unknown as Idea;
  res.status(201).json({ data: created });
});

// ── PUT /api/ideas/:id ─────────────────────────────────────────────────────────
router.put("/:id", (req: Request, res: Response): void => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid idea ID" });
    return;
  }

  const existing = db.prepare("SELECT * FROM ideas WHERE id = ?").get(id) as unknown as Idea | undefined;
  if (!existing) {
    res.status(404).json({ error: "Idea not found" });
    return;
  }

  const result = updateSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.errors.map((e) => e.message).join(", ") });
    return;
  }

  const update = result.data as UpdateIdeaInput;
  const title       = update.title       ?? existing.title;
  const description = update.description ?? existing.description;
  const category    = update.category    ?? existing.category;

  db.prepare(
    "UPDATE ideas SET title = ?, description = ?, category = ?, updated_at = datetime('now') WHERE id = ?"
  ).run(title, description, category, id);

  const updated = db.prepare("SELECT * FROM ideas WHERE id = ?").get(id) as unknown as Idea;
  res.json({ data: updated });
});

// ── DELETE /api/ideas/:id ──────────────────────────────────────────────────────
router.delete("/:id", (req: Request, res: Response): void => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid idea ID" });
    return;
  }

  const existing = db.prepare("SELECT * FROM ideas WHERE id = ?").get(id) as unknown as Idea | undefined;
  if (!existing) {
    res.status(404).json({ error: "Idea not found" });
    return;
  }

  db.prepare("DELETE FROM ideas WHERE id = ?").run(id);
  res.status(204).send();
});

export default router;
