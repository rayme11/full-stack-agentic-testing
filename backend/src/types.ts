/**
 * Idea type definitions
 * =====================
 * WHY: Defining shared types in one place ensures that the database,
 * routes, and tests all agree on the shape of an "Idea" object.
 * This is a key TypeScript best practice.
 */

/** Represents an idea row exactly as stored in the database */
export interface Idea {
  readonly id: number;
  title: string;
  description: string;
  category: string;
  readonly created_at: string;
  updated_at: string;
}

/** Data required to create a new idea */
export interface CreateIdeaInput {
  title: string;
  description: string;
  category?: string;
}

/** Data that can be updated on an existing idea */
export interface UpdateIdeaInput {
  title?: string;
  description?: string;
  category?: string;
}

/** Standard API success response wrapper */
export interface ApiSuccess<T> {
  data: T;
}

/** Standard API error response wrapper */
export interface ApiError {
  error: string;
}
