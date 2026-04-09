# 🎓 Learning Path — Full-Stack Agentic Testing

> **READ THIS FIRST.** This is your step-by-step guide. Do **not** skip ahead.
> Each step builds on the previous one. You learn a concept, then you implement it.

---

## 🖥 How to Open This Project in VS Code

> **Start here — before touching any code.**

1. Install **VS Code**: https://code.visualstudio.com/download
2. Install **Node.js 22+**: https://nodejs.org (choose "LTS")
3. Open VS Code. Click **File → Open Workspace from File…**
4. Navigate to this repo folder and select **`idea-journal.code-workspace`**
5. VS Code will ask _"Install recommended extensions?"_ — click **Install All**

You should now see 5 folders in the Explorer panel:

- 📚 Full-Stack Agentic Testing
- 🖥 Backend
- 🎨 Frontend
- 🧪 Tests
- 📖 Docs

---

## ✅ Your Learning Checklist

Work through each step **in order**. Check off each item as you complete it.

---

### 🟦 Step 0 — Prerequisites (Do this once)

- [ ] **Read:** Understand what this project is about → [`README.md`](./README.md)
- [ ] **Install:** Node.js 22+ from https://nodejs.org
- [ ] **Install:** Git from https://git-scm.com
- [ ] **Install:** VS Code from https://code.visualstudio.com
- [ ] **Verify your Node version** — open a terminal in VS Code (`Ctrl+`` ` ```) and type:
  ```bash
  node --version
  # Must show v22.x.x or higher
  ```
- [ ] **Copy the environment file:**
  ```bash
  cp .env.example .env
  ```

---

### 🟩 Step 1 — Understand the Project & TypeScript Foundations

> **Read the doc FIRST, then do the exercise.**

- [ ] **Read:** [`docs/STEP_01_PROJECT_SETUP.md`](./docs/STEP_01_PROJECT_SETUP.md)
  - Learn what TypeScript is and why we use it
  - Learn what a monorepo is
  - Understand the project folder structure

- [ ] **Exercise 1a — Verify TypeScript catches errors:**
  1. Open `backend/src/types.ts` in VS Code
  2. Change `title: string` to `title: number` on line 10
  3. Hover over any usage of `.title` — see the red underline errors appear!
  4. VS Code is warning you about a type mismatch **before you even run the code**
  5. Undo the change (`Ctrl+Z`)

- [ ] **Exercise 1b — Explore the TypeScript config:**
  1. Open `backend/tsconfig.json`
  2. Notice `"strict": true` — this enables the strictest type checking
  3. Notice `"target": "ES2022"` — TypeScript compiles DOWN to this JS version

---

### 🟩 Step 2 — Build the Backend API

> **Read the doc FIRST, then implement.**
>
> ⚠️ **All backend files are stubs.** Only `GET /health` works out of the box.
> `/api/ideas` will return `Cannot POST` until you complete all 4 tasks.
> The full implementation code is in `docs/STEP_02_BACKEND_API.md`.

- [ ] **Read:** [`docs/STEP_02_BACKEND_API.md`](./docs/STEP_02_BACKEND_API.md) — the doc now has complete implementation code for each task

- [ ] **Install backend dependencies** (if you haven't already):

  ```bash
  cd backend && npm install
  ```

- [ ] **Task 1 — `backend/src/types.ts`** — add the 5 interfaces (`Idea`, `CreateIdeaInput`, `UpdateIdeaInput`, `ApiSuccess<T>`, `ApiError`). Remove the `export {}` placeholder line.

- [ ] **Task 2 — `backend/src/db/database.ts`** — add the 3 `db.exec()` calls (WAL pragma, foreign keys pragma, CREATE TABLE)

- [ ] **Task 3 — `backend/src/routes/ideas.ts`** — implement all 5 endpoints with Zod validation

- [ ] **Task 4 — `backend/src/app.ts`** — add the import and `app.use("/api/ideas", ideasRouter)` line

- [ ] **Verify the backend is fully working:**

  ```bash
  curl http://localhost:3001/api/ideas
  # Expected: {"data":[]}
  curl -X POST http://localhost:3001/api/ideas \
    -H "Content-Type: application/json" \
    -d '{"title": "My first idea", "category": "backend"}'
  # Expected: {"data":{"id":1,"title":"My first idea",...}}
  ```

  curl http://localhost:3001/health
  curl http://localhost:3001/api/ideas
  curl -X POST http://localhost:3001/api/ideas \
   -H "Content-Type: application/json" \
   -d '{"title": "My first idea!", "category": "general"}'
  curl http://localhost:3001/api/ideas

  ```

  ```

- [ ] **Exercise 2a — Trigger validation errors:**

  ```bash
  # No title → 400
  curl -X POST http://localhost:3001/api/ideas \
    -H "Content-Type: application/json" \
    -d '{"description": "I forgot the title"}'
  ```

- [ ] **Exercise 2b — Non-existent route → 404:**
  ```bash
  curl http://localhost:3001/api/nonexistent
  ```

---

### 🟩 Step 3 — Build the Frontend UI

> ⚠️ **All 3 frontend files are stubs.** The page loads but shows a placeholder.
> Nothing renders until you complete all 3 tasks.
> The full implementation code is in `docs/STEP_03_FRONTEND_UI.md`.

- [ ] **Read:** [`docs/STEP_03_FRONTEND_UI.md`](./docs/STEP_03_FRONTEND_UI.md)

- [ ] **Make sure the backend is still running** in another terminal.

- [ ] **Install frontend dependencies:**

  ```bash
  cd frontend && npm install
  ```

- [ ] **Task 1 — `frontend/index.html`** — replace the placeholder `<p class="hint">` with the real `<form>` HTML (see the doc for the exact HTML to copy in)

- [ ] **Task 2 — `frontend/src/api.ts`** — implement `apiFetch`, `getIdeas`, `createIdea`, `deleteIdea`

- [ ] **Task 3 — `frontend/src/app.ts`** — implement `loadIdeas`, the form submit handler, and the delete event listener

- [ ] **Start the frontend:**

  ```bash
  cd frontend && npm run dev
  # Open http://localhost:5173
  ```

- [ ] **Verify:** Fill in the form, click "Add Idea", see it appear in the list below.

---

### 🟩 Step 4 — Write Playwright API Tests

> **Read the doc FIRST, then install and run.**

- [ ] **Read:** [`docs/STEP_04_PLAYWRIGHT_TESTS.md`](./docs/STEP_04_PLAYWRIGHT_TESTS.md)
  - Learn the testing pyramid
  - Learn how Playwright tests REST APIs (no browser needed)
  - Learn why test independence matters

- [ ] **Install test dependencies:**

  ```bash
  cd tests
  npm install
  ```

- [ ] **Study the API test file:**
      Open `tests/api/ideas.api.spec.ts` and read **every comment**

- [ ] **Run the API tests** (backend must be running!):

  ```bash
  npm run test:api
  # All tests should be green ✅
  ```

- [ ] **Exercise 4a — Watch a test fail:**
  1. Open `backend/src/routes/ideas.ts`
  2. Change `res.status(201)` to `res.status(200)` in the POST handler
  3. Run `npm run test:api` again
  4. See the "creates an idea and returns 201" test FAIL with a clear message
  5. Undo the change and verify tests pass again

- [ ] **Exercise 4b — Add your own test:**
      Add this test to `tests/api/ideas.api.spec.ts`:
  ```typescript
  test("returns 400 when title is over 200 characters", async ({ request }) => {
    const longTitle = "A".repeat(201);
    const response = await request.post(`${API_BASE}/api/ideas`, {
      data: { title: longTitle },
    });
    expect(response.status()).toBe(400);
  });
  ```
  Run the tests — does it pass?

---

### 🟩 Step 5 — Write Playwright E2E Browser Tests

> ⚠️ **E2E stub has only 1 working test.** Running `npm run test:e2e` before adding tests will show 1 passing (page load).
> The full test code is in `docs/STEP_04_PLAYWRIGHT_TESTS.md` (Task 4).
> Both backend (port 3001) AND frontend (port 5173) must be running.

- [ ] **Task 1 — Verify the pre-built test passes:**

  ```bash
  # Terminal 1: cd backend && npm run dev
  # Terminal 2: cd frontend && npm run dev
  # Terminal 3:
  cd tests && npm run test:e2e
  # Expect: 1 test passing (page load heading)
  ```

- [ ] **Task 2 — Add user journey tests to `tests/e2e/ideas.e2e.spec.ts`** — follow `docs/STEP_04_PLAYWRIGHT_TESTS.md`

- [ ] **Verify all E2E tests pass:**
  ```bash
  npm run test:e2e
  # Or watch the browser: npx playwright test --headed
  ```

---

### 🟩 Step 6 — Write BDD Tests (Gherkin + Cucumber)

> ⚠️ **Feature file has only 1 working scenario.** Running `npm run test:bdd` before adding scenarios will show 1 passing (health check).
> The full scenarios and step definitions code is in `docs/STEP_05_BDD_GHERKIN.md`.

- [ ] **Read:** [`docs/STEP_05_BDD_GHERKIN.md`](./docs/STEP_05_BDD_GHERKIN.md)

- [ ] **Task 1 — Verify the pre-built test passes** (backend must be running):

  ```bash
  cd tests && npm run test:bdd
  # Expect: 1 scenario passing (health check)
  ```

- [ ] **Task 2 — Add CRUD scenarios to `tests/bdd/features/ideas.feature`** — follow the doc

- [ ] **Task 3 — Add step definitions to `tests/bdd/steps/ideas.steps.ts`** — follow the doc

- [ ] **Verify all scenarios pass:**
  ```bash
  npm run test:bdd
  ```

---

### 🟩 Step 7 — GitHub Actions & AI PR Review

> ⚠️ The CI workflow runs automatically on push. The AI PR review needs **one setup step** (adding your OpenAI API key as a GitHub Secret).

- [ ] **Read:** [`docs/STEP_06_GITHUB_ACTIONS_AI.md`](./docs/STEP_06_GITHUB_ACTIONS_AI.md)

- [ ] **Task 1 — Push your branch and open a PR** — watch the Checks tab go green

- [ ] **Task 2 — Set up AI PR review:**
      GitHub repo → Settings → Secrets → Actions → Add `OPENAI_API_KEY`

- [ ] **Task 3 — Read `.github/workflows/ci.yml`** line by line and understand every section

---

### 🟥 Bonus — Intentionally Break Things (Advanced Learning)

The best way to understand QA is to break things and watch tests catch the errors.

- [ ] **Break 1 — SQL Injection test:**
      In `routes/ideas.ts`, change:

  ```typescript
  db.prepare("SELECT * FROM ideas WHERE id = ?").get(id);
  ```

  to:

  ```typescript
  // UNSAFE — never do this in production!
  db.exec(`SELECT * FROM ideas WHERE id = ${id}`);
  ```

  Now send `GET /api/ideas/1; DROP TABLE ideas` — what happens?
  Undo and run the API tests to confirm they still pass.

- [ ] **Break 2 — XSS test:**
      In `frontend/src/app.ts`, remove `escapeHtml()` from a `innerHTML` assignment.
      Enter `<script>alert('XSS')</script>` as an idea title. What happens?
      Restore `escapeHtml()`.

- [ ] **Break 3 — Missing validation:**
      Comment out the Zod validation in `routes/ideas.ts`.
      Run the API tests — which ones fail and why?

---

## 🏆 You Did It!

By completing this path, you have learned:

- ✅ TypeScript (strict mode, interfaces, generics)
- ✅ Node.js + Express REST API design
- ✅ SQLite database design and SQL queries
- ✅ Frontend TypeScript with Vite
- ✅ Playwright API testing
- ✅ Playwright E2E browser testing
- ✅ BDD with Gherkin and Cucumber.js
- ✅ GitHub Actions CI/CD pipelines
- ✅ AI-powered PR review automation
- ✅ Security concepts: XSS prevention, SQL injection prevention, input validation
- ✅ SRE concepts: automation, reliability, observability

---

💡 **Next challenge:** Add a completely new feature end-to-end:

1. Add a `priority` field to the database (High / Medium / Low)
2. Show it in the UI with color coding
3. Add API tests for the new field
4. Add BDD scenarios for priority filtering
5. Open a PR and let the AI review your work!
