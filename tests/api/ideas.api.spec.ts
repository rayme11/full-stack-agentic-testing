/**
 * Step 4 – API Tests (Starter)
 * ==============================
 * WHY: API tests verify each endpoint independently — no browser needed.
 * They are fast and great for testing validation and error handling.
 *
 * This file starts with ONE test: the health check. It passes immediately.
 * After reading docs/STEP_04_PLAYWRIGHT_TESTS.md, you will add tests for
 * each endpoint you built in Step 2 (POST, GET, PUT, DELETE /api/ideas).
 *
 * RUN: npm run test:api   (from the tests/ directory, backend must be running)
 */

import { test, expect } from "@playwright/test";

const API_BASE = process.env.API_BASE_URL ?? "http://localhost:3001";

// ════════════════════════════════════════════════════════════════════════════
// Starter Test – Health Check
// WHY: Always verify the server is alive before testing its features.
// ════════════════════════════════════════════════════════════════════════════
test.describe("Health Check", () => {
  test("GET /health returns 200 with status ok", async ({ request }) => {
    const response = await request.get(`${API_BASE}/health`);

    // Assert the HTTP status code is 200
    expect(response.status()).toBe(200);

    // Assert the response body contains { status: "ok" }
    const body = await response.json() as { status: string };
    expect(body.status).toBe("ok");
  });
});

// ════════════════════════════════════════════════════════════════════════════
// TODO (Step 4): Add tests for each /api/ideas endpoint
// ════════════════════════════════════════════════════════════════════════════

// TODO: test.describe("POST /api/ideas", () => {
//   test("creates an idea and returns 201", async ({ request }) => { ... });
//   test("returns 400 when title is missing", async ({ request }) => { ... });
// });

// TODO: test.describe("GET /api/ideas", () => {
//   test("returns an array of ideas", async ({ request }) => { ... });
// });

// TODO: test.describe("GET /api/ideas/:id", () => {
//   test("returns the correct idea", async ({ request }) => { ... });
//   test("returns 404 for a non-existent id", async ({ request }) => { ... });
// });

// TODO: test.describe("DELETE /api/ideas/:id", () => {
//   test("deletes the idea and returns 204", async ({ request }) => { ... });
// });
