/**
 * API client module
 * =================
 * WHY: Keeping all fetch() calls in one place means:
 *  1. If the backend URL changes, you change it in ONE place.
 *  2. Easier to add auth headers later (just edit this file).
 *  3. Tests can mock this module to avoid real HTTP calls.
 *
 * CONCEPT: This is the "Service Layer" pattern – separating
 * data-fetching logic from presentation/UI logic.
 */

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

// Read the API base URL from Vite environment variables.
// In dev this is proxied via Vite; in production point to the real URL.
const API_BASE = import.meta.env.VITE_API_BASE ?? "/api";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  const json = await res.json() as { data?: T; error?: string };

  if (!res.ok) {
    throw new Error(json.error ?? `HTTP ${res.status}`);
  }

  return json.data as T;
}

/** Fetch all ideas from the API */
export async function getIdeas(): Promise<Idea[]> {
  return apiFetch<Idea[]>("/ideas");
}

/** Fetch a single idea by ID */
export async function getIdea(id: number): Promise<Idea> {
  return apiFetch<Idea>(`/ideas/${id}`);
}

/** Create a new idea */
export async function createIdea(input: CreateIdeaInput): Promise<Idea> {
  return apiFetch<Idea>("/ideas", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

/** Update an existing idea */
export async function updateIdea(id: number, input: Partial<CreateIdeaInput>): Promise<Idea> {
  return apiFetch<Idea>(`/ideas/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

/** Delete an idea */
export async function deleteIdea(id: number): Promise<void> {
  await fetch(`${API_BASE}/ideas/${id}`, { method: "DELETE" });
}
