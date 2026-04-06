# Step 04 – Playwright Tests: E2E and API Testing

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

| Type | Speed | Realism | Cost | What fails? |
|------|-------|---------|------|-------------|
| Unit | ⚡ Fast | Low | Cheap | One function |
| API/Integration | 🚗 Medium | Medium | Medium | Endpoints, DB |
| E2E | 🐢 Slow | High | Expensive | Full user flow |

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
  await expect(item.getByTestId("idea-title")).toContainText("Learn Playwright");
});
```

**Playwright Locator Strategies** (prefer in this order):

| Method | Example | Use When |
|--------|---------|----------|
| `getByTestId()` | `getByTestId("btn-submit")` | Always (most stable) |
| `getByRole()` | `getByRole("button", { name: "Submit" })` | Good for accessibility |
| `getByLabel()` | `getByLabel("Title")` | For form inputs |
| `locator("css")` | `locator(".btn-primary")` | Last resort |
| `locator("xpath")` | `locator("//button[1]")` | Avoid! Very brittle |

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
  const createRes = await request.post("/api/ideas", { data: { title: "My idea" } });
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
const body = await response.json() as { data: { id: number } };
console.log(body.datta.id); // ❌ TypeScript error: 'datta' does not exist
console.log(body.data.id);  // ✅ Correct
```

TypeScript applies the same type safety to your tests as to your application code.

---

## 📝 Intentionally Break Things (Learning Exercise)

1. **Remove a `data-testid`** from the HTML. Run the E2E test. See what error message you get.
2. **Return the wrong status code** from the backend (change 201 to 200 in the POST handler). Run the API test. Watch it fail.
3. **Add a validation bug**: In `routes/ideas.ts`, comment out the Zod validation. Run the API validation test — it should fail.

This teaches you what good error messages look like and how to diagnose failures.

---

➡️ **Next Step:** [Step 05 – BDD with Gherkin and Cucumber](./STEP_05_BDD_GHERKIN.md)
