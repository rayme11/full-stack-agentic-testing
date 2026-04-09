# Step 04 – Playwright Tests: E2E and API Testing

> **⚠️ Stub Status — Read This First**
>
> Both test files start as stubs with **only one working test each** — a minimal "does it respond at all" check. All the real CRUD tests are `// TODO` placeholders.
>
> | File                          | Pre-built tests              | Your task                          |
> | ----------------------------- | ---------------------------- | ---------------------------------- |
> | `tests/api/ideas.api.spec.ts` | `GET /health` → 200          | Add tests for all 5 CRUD endpoints |
> | `tests/e2e/ideas.e2e.spec.ts` | Page loads + heading visible | Add full user journey tests        |
>
> **Prerequisite:** Step 2 (backend) must be fully implemented and running before API tests will pass.
> **Prerequisite for E2E:** Both backend (port 3001) AND frontend (port 5173) must be running.

---

## 🎯 What You Will Learn

- What **E2E (End-to-End) testing** is and how it differs from unit tests
- How **Playwright** automates a real Chromium browser in TypeScript
- How to test **REST APIs** with Playwright's `APIRequestContext`
- The **testing pyramid** — why different types of tests have different values
- Best practices: **test independence**, `data-testid`, `beforeEach` hooks

---

## 📚 Concept: The Testing Pyramid

```
          /\
         /  \        ← E2E Tests (few, slow, realistic)
        /    \          Playwright browser tests
       /──────\
      /        \     ← Integration / API Tests (medium)
     /          \       Playwright API tests (no browser)
    /────────────\
   /              \  ← Unit Tests (many, fast, focused)
  /                \   Test a single function in isolation
 /──────────────────\
```

| Type            | Speed     | Realism | Cost      | What fails?    |
| --------------- | --------- | ------- | --------- | -------------- |
| Unit            | ⚡ Fast   | Low     | Cheap     | One function   |
| API/Integration | 🚗 Medium | Medium  | Medium    | Endpoints, DB  |
| E2E             | 🐢 Slow   | High    | Expensive | Full user flow |

**Rule**: Have LOTS of unit tests, SOME API tests, and FEW E2E tests (only for critical user journeys).

---

## 📁 Test File Structure

```
tests/
├── playwright.config.ts    ← Global Playwright configuration
├── cucumber.json           ← Cucumber BDD configuration
├── tsconfig.json           ← TypeScript settings for tests
├── api/
│   └── ideas.api.spec.ts   ← API tests (no browser, very fast)
├── e2e/
│   └── ideas.e2e.spec.ts   ← Browser E2E tests (full user journeys)
└── bdd/
    ├── features/
    │   └── ideas.feature   ← Gherkin plain-English scenarios
    └── steps/
        └── ideas.steps.ts  ← TypeScript step implementations
```

---

## 🚀 Running Tests

### Prerequisites

Make sure the backend (and frontend for E2E) are running:

```bash
# Terminal 1 — backend
cd backend && npm run dev

# Terminal 2 — frontend (only needed for E2E)
cd frontend && npm run dev
```

### Run API tests (fast, no browser)

```bash
cd tests
npm run test:api
```

### Run E2E tests (slower, opens Chromium)

```bash
cd tests
npm run test:e2e
```

### Run in UI mode (interactive, great for debugging)

```bash
cd tests
npx playwright test --ui
```

### Run a specific test file

```bash
cd tests
npx playwright test tests/api/ideas.api.spec.ts
```

### View the HTML report

```bash
cd tests
npm run report
```

---

## 📚 Concept: API Testing with Playwright

Playwright can test REST APIs **without opening a browser**. This is much faster:

```typescript
// tests/api/ideas.api.spec.ts
import { test, expect } from "@playwright/test";

test("creates an idea and returns 201", async ({ request }) => {
  // `request` is Playwright's HTTP client — like `fetch` but with built-in assertions

  const response = await request.post("http://localhost:3001/api/ideas", {
    data: {
      title: "Learn Playwright API testing",
      category: "testing",
    },
  });

  // Assert the HTTP status code
  expect(response.status()).toBe(201);

  // Assert the response body
  const body = await response.json();
  expect(body.data.title).toBe("Learn Playwright API testing");
});
```

API tests are great for:

- Testing every endpoint's **happy path** (correct inputs → correct outputs)
- Testing **validation** (bad inputs → 400 errors)
- Testing **error handling** (missing resources → 404)
- Edge cases like empty strings, very long strings, special characters

---

## 📚 Concept: E2E Testing with Playwright

E2E tests control a **real Chromium browser** and simulate a real user:

```typescript
// tests/e2e/ideas.e2e.spec.ts
import { test, expect } from "@playwright/test";

test("user can add and see an idea", async ({ page }) => {
  // 1. Open the app in the browser
  await page.goto("/");

  // 2. Fill in the form
  await page.getByTestId("input-title").fill("Learn Playwright");
  await page.getByTestId("select-category").selectOption("testing");

  // 3. Submit
  await page.getByTestId("btn-submit").click();

  // 4. Assert the idea appears in the list
  const item = page.getByTestId("idea-item").first();
  await expect(item).toBeVisible({ timeout: 5000 });
  await expect(item.getByTestId("idea-title")).toContainText(
    "Learn Playwright",
  );
});
```

**Playwright Locator Strategies** (prefer in this order):

| Method             | Example                                   | Use When               |
| ------------------ | ----------------------------------------- | ---------------------- |
| `getByTestId()`    | `getByTestId("btn-submit")`               | Always (most stable)   |
| `getByRole()`      | `getByRole("button", { name: "Submit" })` | Good for accessibility |
| `getByLabel()`     | `getByLabel("Title")`                     | For form inputs        |
| `locator("css")`   | `locator(".btn-primary")`                 | Last resort            |
| `locator("xpath")` | `locator("//button[1]")`                  | Avoid! Very brittle    |

---

## 📚 Concept: Test Independence

> Every test must be able to run **alone** and in **any order**.

```typescript
// ❌ BAD — test B depends on test A having run first:
test("A: creates an idea", async ({ request }) => {
  await request.post("/api/ideas", { data: { title: "Shared idea" } });
});

test("B: reads the idea created in A", async ({ request }) => {
  // What if B runs alone? Or before A? This FAILS.
  const res = await request.get("/api/ideas/1");
  expect(res.status()).toBe(200);
});

// ✅ GOOD — each test creates its own data:
test.beforeEach(async ({ request }) => {
  // Delete all ideas before each test → clean slate
  const res = await request.get("/api/ideas");
  for (const idea of res.data) {
    await request.delete(`/api/ideas/${idea.id}`);
  }
});

test("reads an idea it created itself", async ({ request }) => {
  const createRes = await request.post("/api/ideas", {
    data: { title: "My idea" },
  });
  const id = createRes.data.id;

  const res = await request.get(`/api/ideas/${id}`);
  expect(res.status()).toBe(200);
});
```

---

## 📚 Concept: Why TypeScript in Tests?

Without TypeScript in tests:

```javascript
// JavaScript test — no IDE help, errors only at runtime:
const body = await response.json();
console.log(body.datta.id); // Typo: "datta" — test fails mysteriously at runtime
```

With TypeScript in tests:

```typescript
// TypeScript test — IDE catches the typo immediately:
const body = (await response.json()) as { data: { id: number } };
console.log(body.datta.id); // ❌ TypeScript error: 'datta' does not exist
console.log(body.data.id); // ✅ Correct
```

TypeScript applies the same type safety to your tests as to your application code.

---

## � Step-by-Step Implementation Tasks

---

### ✅ Task 1 — Install Playwright Browsers (First time only)

```bash
cd tests
npm install
npx playwright install chromium
```

---

### ✅ Task 2 — Run the Pre-Built Tests (Verify Setup)

Start the backend in one terminal, then in another:

```bash
cd tests
npm run test:api
```

You should see **1 test passing** (the health check). If it fails, the backend isn't running.

For E2E, also start the frontend, then:

```bash
npm run test:e2e
```

You should see **1 test passing** (page load). If it fails, the frontend isn't running.

---

### ✅ Task 3 — Add API Tests (`tests/api/ideas.api.spec.ts`)

Open `tests/api/ideas.api.spec.ts`. After the health check describe block, add the following test suites.

**Key rule:** Each `test.describe` block uses a `beforeEach` that cleans up data so tests don't affect each other.

```typescript
// ════════════════════════════════════════════════════════════════════════════
// Helpers
// ════════════════════════════════════════════════════════════════════════════

// WHY: A helper to create an idea and return its id.
// Avoids repeating POST logic in every test that needs an existing idea.
async function createTestIdea(
  request: any,
  title = "Test idea",
): Promise<number> {
  const res = await request.post(`${API_BASE}/api/ideas`, {
    data: { title, category: "testing" },
  });
  const body = (await res.json()) as { data: { id: number } };
  return body.data.id;
}

// WHY: Delete all ideas before each test for a clean slate.
// If we don't do this, a test that creates idea #5 might find idea #5
// left over from a previous test and get confused.
async function clearIdeas(request: any): Promise<void> {
  const res = await request.get(`${API_BASE}/api/ideas`);
  const body = (await res.json()) as { data: Array<{ id: number }> };
  for (const idea of body.data) {
    await request.delete(`${API_BASE}/api/ideas/${idea.id}`);
  }
}

// ════════════════════════════════════════════════════════════════════════════
// POST /api/ideas
// ════════════════════════════════════════════════════════════════════════════
test.describe("POST /api/ideas", () => {
  test.beforeEach(async ({ request }) => {
    await clearIdeas(request);
  });

  test("creates an idea and returns 201", async ({ request }) => {
    const response = await request.post(`${API_BASE}/api/ideas`, {
      data: { title: "Learn Playwright", category: "testing" },
    });

    expect(response.status()).toBe(201);

    const body = (await response.json()) as {
      data: { title: string; category: string; id: number };
    };
    expect(body.data.title).toBe("Learn Playwright");
    expect(body.data.category).toBe("testing");
    expect(body.data.id).toBeDefined();
  });

  test("returns 400 when title is missing", async ({ request }) => {
    const response = await request.post(`${API_BASE}/api/ideas`, {
      data: { category: "testing" },
    });
    expect(response.status()).toBe(400);
    const body = (await response.json()) as { error: string };
    expect(body.error).toBeTruthy();
  });

  test("returns 400 when title is empty string", async ({ request }) => {
    const response = await request.post(`${API_BASE}/api/ideas`, {
      data: { title: "" },
    });
    expect(response.status()).toBe(400);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// GET /api/ideas
// ════════════════════════════════════════════════════════════════════════════
test.describe("GET /api/ideas", () => {
  test.beforeEach(async ({ request }) => {
    await clearIdeas(request);
  });

  test("returns an array", async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/ideas`);
    expect(response.status()).toBe(200);
    const body = (await response.json()) as { data: unknown[] };
    expect(Array.isArray(body.data)).toBe(true);
  });

  test("returns created ideas", async ({ request }) => {
    await createTestIdea(request, "First idea");
    await createTestIdea(request, "Second idea");

    const response = await request.get(`${API_BASE}/api/ideas`);
    const body = (await response.json()) as { data: Array<{ title: string }> };
    expect(body.data.length).toBeGreaterThanOrEqual(2);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// GET /api/ideas/:id
// ════════════════════════════════════════════════════════════════════════════
test.describe("GET /api/ideas/:id", () => {
  test.beforeEach(async ({ request }) => {
    await clearIdeas(request);
  });

  test("returns the idea by id", async ({ request }) => {
    const id = await createTestIdea(request, "Find me");
    const response = await request.get(`${API_BASE}/api/ideas/${id}`);

    expect(response.status()).toBe(200);
    const body = (await response.json()) as { data: { title: string } };
    expect(body.data.title).toBe("Find me");
  });

  test("returns 404 for a non-existent id", async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/ideas/99999`);
    expect(response.status()).toBe(404);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// DELETE /api/ideas/:id
// ════════════════════════════════════════════════════════════════════════════
test.describe("DELETE /api/ideas/:id", () => {
  test.beforeEach(async ({ request }) => {
    await clearIdeas(request);
  });

  test("deletes the idea and returns 204", async ({ request }) => {
    const id = await createTestIdea(request);
    const response = await request.delete(`${API_BASE}/api/ideas/${id}`);
    expect(response.status()).toBe(204);

    // Confirm it's gone
    const getRes = await request.get(`${API_BASE}/api/ideas/${id}`);
    expect(getRes.status()).toBe(404);
  });

  test("returns 404 when deleting a non-existent id", async ({ request }) => {
    const response = await request.delete(`${API_BASE}/api/ideas/99999`);
    expect(response.status()).toBe(404);
  });
});
```

**Run the tests:**

```bash
cd tests && npm run test:api
# All tests should be green ✅
```

---

### ✅ Task 4 — Add E2E Tests (`tests/e2e/ideas.e2e.spec.ts`)

> E2E tests require **both** the backend and frontend to be running.

Open `tests/e2e/ideas.e2e.spec.ts` and add after the existing "Page Load" block:

```typescript
// ════════════════════════════════════════════════════════════════════════════
// WHY beforeEach: Ensure each test starts with no ideas in the database.
// Otherwise a test might see ideas left over from a previous test run.
// ════════════════════════════════════════════════════════════════════════════
test.beforeEach(async ({ request }) => {
  const API = process.env.API_BASE_URL ?? "http://localhost:3001";
  const res = await request.get(`${API}/api/ideas`);
  const body = (await res.json()) as { data: Array<{ id: number }> };
  for (const idea of body.data) {
    await request.delete(`${API}/api/ideas/${idea.id}`);
  }
});

// ════════════════════════════════════════════════════════════════════════════
// User can add an idea
// ════════════════════════════════════════════════════════════════════════════
test.describe("Adding an idea", () => {
  test("form submission creates a new idea and shows it in the list", async ({
    page,
  }) => {
    await page.goto("/");

    await page.getByTestId("input-title").fill("Learn Playwright E2E");
    await page.getByTestId("select-category").selectOption("testing");
    await page.getByTestId("btn-submit").click();

    // The new idea should appear in the list
    const item = page.getByTestId("idea-item").first();
    await expect(item).toBeVisible({ timeout: 5000 });
    await expect(item.getByTestId("idea-title")).toContainText(
      "Learn Playwright E2E",
    );
  });

  test("shows a validation error when the title is empty", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("btn-submit").click();

    // The error span should become visible
    await expect(page.locator("#title-error")).toBeVisible();
    await expect(page.locator("#title-error")).toContainText("required");
  });
});

// ════════════════════════════════════════════════════════════════════════════
// User can delete an idea
// ════════════════════════════════════════════════════════════════════════════
test.describe("Deleting an idea", () => {
  test("clicking Delete removes the idea from the list", async ({ page }) => {
    await page.goto("/");

    // Add an idea via the form
    await page.getByTestId("input-title").fill("To be deleted");
    await page.getByTestId("btn-submit").click();
    await expect(page.getByTestId("idea-item").first()).toBeVisible({
      timeout: 5000,
    });

    // Delete it
    await page.getByTestId("btn-delete").first().click();

    // The list should be empty (empty message should appear)
    await expect(page.locator("#empty-msg")).toBeVisible({ timeout: 5000 });
  });
});
```

**Run the tests:**

```bash
cd tests && npm run test:e2e
```

---

1. **Remove a `data-testid`** from the HTML. Run the E2E test. See what error message you get.
2. **Return the wrong status code** from the backend (change 201 to 200 in the POST handler). Run the API test. Watch it fail.
3. **Add a validation bug**: In `routes/ideas.ts`, comment out the Zod validation. Run the API validation test — it should fail.

This teaches you what good error messages look like and how to diagnose failures.

---

➡️ **Next Step:** [Step 05 – BDD with Gherkin and Cucumber](./STEP_05_BDD_GHERKIN.md)
