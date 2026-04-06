/**
 * E2E Tests – Playwright Browser Tests
 * ======================================
 * WHY: End-to-End (E2E) tests simulate a real user interacting with
 * the application in a real browser. They verify that the entire stack
 * (frontend + backend + database) works together correctly.
 *
 * CONCEPT: E2E tests are the most realistic but also the slowest and
 * most brittle. We test the CRITICAL USER JOURNEYS here:
 *  - Can a user add an idea?
 *  - Can they see their idea listed?
 *  - Can they filter ideas?
 *  - Can they delete an idea?
 *
 * WHY data-testid: Using data-testid attributes on HTML elements makes
 * selectors stable — they won't break if someone changes the CSS class
 * or text content. This is a Playwright / QA best practice.
 *
 * RUN: npm run test:e2e (from the tests/ directory)
 */

import { test, expect, type Page } from "@playwright/test";

const API_BASE = process.env.API_BASE_URL ?? "http://localhost:3001";

// ── Before each test: clean slate (delete all ideas via API) ──────────────────
// WHY: Tests must be INDEPENDENT. If test A adds data that test B reads,
// fixing test A might accidentally break test B (a "test dependency" bug).
test.beforeEach(async ({ request }) => {
  const res = await request.get(`${API_BASE}/api/ideas`);
  const body = await res.json() as { data: Array<{ id: number }> };
  for (const idea of body.data) {
    await request.delete(`${API_BASE}/api/ideas/${idea.id}`);
  }
});

// ── Helper: fill and submit the idea form ─────────────────────────────────────
async function addIdea(
  page: Page,
  title: string,
  description = "",
  category = "general"
): Promise<void> {
  await page.getByTestId("input-title").fill(title);
  if (description) await page.getByTestId("input-description").fill(description);
  await page.getByTestId("select-category").selectOption(category);
  await page.getByTestId("btn-submit").click();
}

// ════════════════════════════════════════════════════════════════════════════════
// STEP 1: Page load
// ════════════════════════════════════════════════════════════════════════════════
test.describe("Page Load", () => {
  test("shows the Idea Journal heading", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Idea Journal/);
    await expect(page.getByRole("heading", { name: /Idea Journal/ })).toBeVisible();
  });

  test("shows the 'Add a New Idea' form", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("input-title")).toBeVisible();
    await expect(page.getByTestId("btn-submit")).toBeVisible();
  });

  test("shows empty message when no ideas exist", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("empty-msg")).toBeVisible({ timeout: 5000 });
  });
});

// ════════════════════════════════════════════════════════════════════════════════
// STEP 2: Adding an idea
// ════════════════════════════════════════════════════════════════════════════════
test.describe("Adding an Idea", () => {
  test("adds an idea and shows it in the list", async ({ page }) => {
    await page.goto("/");

    await addIdea(page, "Learn Playwright", "Automate browser tests", "testing");

    // Wait for the idea to appear in the list
    const ideaItem = page.getByTestId("idea-item").first();
    await expect(ideaItem).toBeVisible({ timeout: 5000 });
    await expect(ideaItem.getByTestId("idea-title")).toContainText("Learn Playwright");
    await expect(ideaItem.getByTestId("idea-category")).toContainText("testing");
  });

  test("shows a success message after adding an idea", async ({ page }) => {
    await page.goto("/");
    await addIdea(page, "TypeScript generics");

    // Status message should appear briefly
    await expect(page.locator("#form-status")).toContainText("✅", { timeout: 3000 });
  });

  test("shows validation error when title is empty", async ({ page }) => {
    await page.goto("/");

    // Submit without filling in the title
    await page.getByTestId("btn-submit").click();

    await expect(page.locator("#title-error")).toContainText("required");
    // The form should NOT have submitted (no idea in the list)
    await expect(page.getByTestId("empty-msg")).toBeVisible();
  });

  test("clears the form after successful submission", async ({ page }) => {
    await page.goto("/");
    await addIdea(page, "Test idea cleanup", "Description here");

    // Wait for success then check form is empty
    await page.getByTestId("idea-item").first().waitFor({ timeout: 5000 });
    await expect(page.getByTestId("input-title")).toHaveValue("");
    await expect(page.getByTestId("input-description")).toHaveValue("");
  });
});

// ════════════════════════════════════════════════════════════════════════════════
// STEP 3: Filtering ideas
// ════════════════════════════════════════════════════════════════════════════════
test.describe("Filtering Ideas", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await addIdea(page, "Frontend idea", "React tips", "frontend");
    await page.getByTestId("idea-item").first().waitFor();

    await addIdea(page, "Backend idea", "Node.js tricks", "backend");
    await page.getByTestId("idea-item").nth(0).waitFor();
  });

  test("filters by category", async ({ page }) => {
    await page.getByTestId("filter-category").selectOption("frontend");

    const items = page.getByTestId("idea-item");
    await expect(items).toHaveCount(1);
    await expect(items.first().getByTestId("idea-category")).toContainText("frontend");
  });

  test("searches by title keyword", async ({ page }) => {
    await page.getByTestId("search-input").fill("Frontend");

    const items = page.getByTestId("idea-item");
    await expect(items).toHaveCount(1);
    await expect(items.first().getByTestId("idea-title")).toContainText("Frontend idea");
  });
});

// ════════════════════════════════════════════════════════════════════════════════
// STEP 4: Deleting an idea
// ════════════════════════════════════════════════════════════════════════════════
test.describe("Deleting an Idea", () => {
  test("removes the idea from the list after deletion", async ({ page }) => {
    await page.goto("/");
    await addIdea(page, "Idea to delete");
    await page.getByTestId("idea-item").first().waitFor({ timeout: 5000 });

    // Handle the confirmation dialog
    page.once("dialog", (dialog) => dialog.accept());

    await page.getByTestId("btn-delete").first().click();

    // The list should now be empty
    await expect(page.getByTestId("empty-msg")).toBeVisible({ timeout: 5000 });
  });
});
