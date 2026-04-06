/**
 * Step 3 – API Client Module
 * ===========================
 * WHY: All fetch() calls live here so that app.ts stays focused on UI only.
 * If the API URL ever changes, you fix it in ONE place.
 *
 * CONCEPT: This is the "Service Layer" pattern.
 *   api.ts   → fetches data  (the Model)
 *   app.ts   → updates the UI (the Controller)
 *   index.html + style.css → what the user sees (the View)
 *
 * STUDENT TASK — implement the functions below following docs/STEP_03_FRONTEND_UI.md
 */

// ── Shared types (mirrors the backend) ───────────────────────────────────────
// WHY: We redefine them here instead of sharing files because frontend and
// backend may diverge. For a bigger project you'd use a shared package.
export interface Idea {
  id: number;
  title: string;
  description: string;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface CreateIdeaInput {
  title: string;
  description: string;
  category: string;
}

// Vite exposes env vars prefixed with VITE_ via import.meta.env
const API_BASE = import.meta.env.VITE_API_BASE ?? "/api";

// ── Internal helper ───────────────────────────────────────────────────────────
// TODO: Implement a generic apiFetch<T> helper that:
//   1. Calls fetch() with the correct headers
//   2. Parses the JSON response
//   3. Throws an Error if res.ok is false (using the error field from the body)
//   4. Returns response.data

// ── Public API functions ──────────────────────────────────────────────────────

// TODO: export async function getIdeas(): Promise<Idea[]>
// Hint: GET /ideas

// TODO: export async function createIdea(input: CreateIdeaInput): Promise<Idea>
// Hint: POST /ideas with JSON body

// TODO: export async function deleteIdea(id: number): Promise<void>
// Hint: DELETE /ideas/:id  — no response body on success (204)
