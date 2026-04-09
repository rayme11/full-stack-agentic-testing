/**
 * Step 2 – TypeScript Type Definitions
 * ======================================
 * WHY: Before writing any database or API code, we define the SHAPE of our
 * data. TypeScript uses these interfaces to catch bugs at compile time.
 *
 * STUDENT TASK — add the interfaces below following docs/STEP_02_BACKEND_API.md
 *
 * Hints:
 *   - An "Idea" stored in the database has these columns:
 *       id (number), title (string), description (string),
 *       category (string), created_at (string), updated_at (string)
 *
 *   - "CreateIdeaInput" is what the POST /api/ideas endpoint expects:
 *       title (required), description (optional), category (optional)
 *
 *   - "UpdateIdeaInput" is what PUT /api/ideas/:id expects — all fields optional
 *
 *   - Use `readonly` for fields the database sets automatically (id, created_at)
 */

// The shape of a row in the ideas database table
export interface Idea {
  readonly id: number; // Set by the database — never by us
  title: string;
  description: string;
  category: string;
  readonly created_at: string; // Set by SQLite DEFAULT — never by us
  updated_at: string;
}

// What the POST /api/ideas endpoint accepts from the client
export interface CreateIdeaInput {
  title: string; // Required
  description?: string; // Optional — defaults to ''
  category?: string; // Optional — defaults to 'general'
}

// What the PUT /api/ideas/:id endpoint accepts — all fields optional
export interface UpdateIdeaInput {
  title?: string;
  description?: string;
  category?: string;
}

// The shape of every successful JSON response: { data: T }
export interface ApiSuccess<T> {
  data: T;
}

// The shape of every error JSON response: { error: "some message" }
export interface ApiError {
  error: string;
} 