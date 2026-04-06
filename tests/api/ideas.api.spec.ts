/**
 * API Tests – Playwright APIRequestContext
 * =========================================
 * WHY: Playwright can also test REST APIs directly (no browser needed).
 * API tests are:
 *  - Much faster than E2E tests
 *  - More stable (no flaky UI rendering issues)
 *  - Great for testing validation, edge cases, and error handling
 *
 * CONCEPT: Test each API endpoint independently — this is called
 * "contract testing" — ensuring the API meets its agreed-upon contract.
 *
 * RUN: npm run test:api (from the tests/ directory)
 */

import { test, expect, type APIRequestContext } from "@playwright/test";

const API_BASE = process.env.API_BASE_URL ?? "http://localhost:3001";

// ── Helper: create a fresh idea for testing ───────────────────────────────────
async function createTestIdea(
  request: APIRequestContext,
  overrides: Record<string, string> = {}
) {
  const response = await request.post(`${API_BASE}/api/ideas`, {
    data: {
      title: "Test Idea",
      description: "A test idea description",
      category: "testing",
      ...overrides,
    },
  });
  const body = await response.json() as { data: { id: number; title: string; description: string; category: string } };
  return body.data;
}

// ════════════════════════════════════════════════════════════════════════════════
// STEP 1: Health Check
// WHY: Always test that the server is running before testing its features.
// ════════════════════════════════════════════════════════════════════════════════
test.describe("Health Check", () => {
  test("GET /health returns 200 with status ok", async ({ request }) => {
    const response = await request.get(`${API_BASE}/health`);
    expect(response.status()).toBe(200);

    const body = await response.json() as { status: string };
    expect(body.status).toBe("ok");
  });
});

// ════════════════════════════════════════════════════════════════════════════════
// STEP 2: Create an Idea (POST /api/ideas)
// ════════════════════════════════════════════════════════════════════════════════
test.describe("POST /api/ideas – Create Idea", () => {
  test("creates an idea with valid data and returns 201", async ({ request }) => {
    const response = await request.post(`${API_BASE}/api/ideas`, {
      data: {
        title: "Learn TypeScript generics",
        description: "Study how generics make code reusable and type-safe",
        category: "backend",
      },
    });

    // Assert the HTTP status code
    expect(response.status()).toBe(201);

    // Assert the response body shape
    const body = await response.json() as { data: { id: number; title: string; category: string } };
    expect(body.data.id).toBeGreaterThan(0);
    expect(body.data.title).toBe("Learn TypeScript generics");
    expect(body.data.category).toBe("backend");
  });

  test("returns 400 when title is missing", async ({ request }) => {
    const response = await request.post(`${API_BASE}/api/ideas`, {
      data: { description: "No title provided" },
    });

    expect(response.status()).toBe(400);
    const body = await response.json() as { error: string };
    expect(body.error).toContain("Title");
  });

  test("returns 400 when title is empty string", async ({ request }) => {
    const response = await request.post(`${API_BASE}/api/ideas`, {
      data: { title: "", description: "Empty title" },
    });

    expect(response.status()).toBe(400);
  });

  test("creates idea with default category 'general' when not specified", async ({ request }) => {
    const response = await request.post(`${API_BASE}/api/ideas`, {
      data: { title: "Default category test" },
    });

    expect(response.status()).toBe(201);
    const body = await response.json() as { data: { category: string } };
    expect(body.data.category).toBe("general");
  });
});

// ════════════════════════════════════════════════════════════════════════════════
// STEP 3: Retrieve Ideas (GET /api/ideas and GET /api/ideas/:id)
// ════════════════════════════════════════════════════════════════════════════════
test.describe("GET /api/ideas – List Ideas", () => {
  test("returns an array of ideas", async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/ideas`);

    expect(response.status()).toBe(200);
    const body = await response.json() as { data: unknown[] };
    expect(Array.isArray(body.data)).toBe(true);
  });
});

test.describe("GET /api/ideas/:id – Get Single Idea", () => {
  test("returns the correct idea by ID", async ({ request }) => {
    // Create an idea first
    const created = await createTestIdea(request, { title: "Fetch by ID test" });

    const response = await request.get(`${API_BASE}/api/ideas/${created.id}`);
    expect(response.status()).toBe(200);

    const body = await response.json() as { data: { id: number; title: string } };
    expect(body.data.id).toBe(created.id);
    expect(body.data.title).toBe("Fetch by ID test");
  });

  test("returns 404 for a non-existent idea", async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/ideas/999999`);
    expect(response.status()).toBe(404);

    const body = await response.json() as { error: string };
    expect(body.error).toContain("not found");
  });

  test("returns 400 for an invalid (non-numeric) ID", async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/ideas/not-a-number`);
    expect(response.status()).toBe(400);
  });
});

// ════════════════════════════════════════════════════════════════════════════════
// STEP 4: Update an Idea (PUT /api/ideas/:id)
// ════════════════════════════════════════════════════════════════════════════════
test.describe("PUT /api/ideas/:id – Update Idea", () => {
  test("updates the title of an existing idea", async ({ request }) => {
    const created = await createTestIdea(request, { title: "Original title" });

    const response = await request.put(`${API_BASE}/api/ideas/${created.id}`, {
      data: { title: "Updated title" },
    });

    expect(response.status()).toBe(200);
    const body = await response.json() as { data: { title: string } };
    expect(body.data.title).toBe("Updated title");
  });

  test("returns 404 when updating a non-existent idea", async ({ request }) => {
    const response = await request.put(`${API_BASE}/api/ideas/999999`, {
      data: { title: "Ghost update" },
    });
    expect(response.status()).toBe(404);
  });
});

// ════════════════════════════════════════════════════════════════════════════════
// STEP 5: Delete an Idea (DELETE /api/ideas/:id)
// ════════════════════════════════════════════════════════════════════════════════
test.describe("DELETE /api/ideas/:id – Delete Idea", () => {
  test("deletes an existing idea and returns 204", async ({ request }) => {
    const created = await createTestIdea(request, { title: "Idea to delete" });

    const deleteResponse = await request.delete(`${API_BASE}/api/ideas/${created.id}`);
    expect(deleteResponse.status()).toBe(204);

    // Verify it no longer exists
    const getResponse = await request.get(`${API_BASE}/api/ideas/${created.id}`);
    expect(getResponse.status()).toBe(404);
  });

  test("returns 404 when deleting a non-existent idea", async ({ request }) => {
    const response = await request.delete(`${API_BASE}/api/ideas/999999`);
    expect(response.status()).toBe(404);
  });
});
