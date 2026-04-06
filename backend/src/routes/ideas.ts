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

import { Router } from "express";
// TODO: import { Request, Response } from "express";
// TODO: import { z } from "zod";
// TODO: import db from "../db/database";
// TODO: import type { Idea } from "../types";

const router = Router();

// TODO: Define your Zod validation schemas here
// const createSchema = z.object({ ... });
// const updateSchema = z.object({ ... });

// ── GET /api/ideas ────────────────────────────────────────────────────────────
// TODO: Query all rows from the ideas table, return { data: ideas }

// ── GET /api/ideas/:id ────────────────────────────────────────────────────────
// TODO: Parse req.params.id, query one row, return 404 if not found

// ── POST /api/ideas ───────────────────────────────────────────────────────────
// TODO: Validate req.body with Zod, INSERT into ideas, return 201 with new row

// ── PUT /api/ideas/:id ────────────────────────────────────────────────────────
// TODO: Validate req.body, UPDATE the row, return updated row

// ── DELETE /api/ideas/:id ─────────────────────────────────────────────────────
// TODO: DELETE the row, return 204 No Content

export default router;
