/**
 * Step 5 – E2E Tests (Starter)
 * ==============================
 * WHY: E2E (End-to-End) tests drive a real browser to verify the full user
 * journey — frontend + backend + database all working together.
 *
 * This file starts with ONE test: verifying the page title loads correctly.
 * After reading docs/STEP_04_PLAYWRIGHT_TESTS.md, you will add tests for:
 *  - Filling in the form and submitting a new idea
 *  - Seeing the idea appear in the list
 *  - Filtering by category
 *  - Deleting an idea
 *
 * RUN: npm run test:e2e   (backend AND frontend must both be running)
 */

import { test, expect } from "@playwright/test";

// ════════════════════════════════════════════════════════════════════════════
// Starter Test – Page Load
// WHY: The simplest possible E2E test — does the page load at all?
// ════════════════════════════════════════════════════════════════════════════
test.describe("Page Load", () => {
  test("shows the Idea Journal heading", async ({ page }) => {
    await page.goto("/");

    // Verify the browser tab title
    await expect(page).toHaveTitle(/Idea Journal/);

    // Verify the main heading is visible
    await expect(page.getByRole("heading", { name: /Idea Journal/ })).toBeVisible();
  });
});

// ════════════════════════════════════════════════════════════════════════════
// TODO (Step 5): Add E2E tests for user journeys
// ════════════════════════════════════════════════════════════════════════════

// TODO: test("user can add a new idea", async ({ page }) => {
//   await page.goto("/");
//   await page.getByTestId("input-title").fill("My idea");
//   await page.getByTestId("btn-submit").click();
//   await expect(page.getByTestId("idea-item").first()).toBeVisible();
// });

// TODO: test("shows validation error when title is empty", ...);
// TODO: test("user can delete an idea", ...);
// TODO: test("user can filter by category", ...);
