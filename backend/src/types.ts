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

// TODO: Define the Idea interface
// export interface Idea { ... }

// TODO: Define the CreateIdeaInput interface
// export interface CreateIdeaInput { ... }

// TODO: Define the UpdateIdeaInput interface
// export interface UpdateIdeaInput { ... }

// TODO: Define ApiSuccess<T> — a generic wrapper for successful responses
// export interface ApiSuccess<T> { data: T; }

// TODO: Define ApiError — a wrapper for error responses
// export interface ApiError { error: string; }

export {}; // Remove this line once you've added your first export
