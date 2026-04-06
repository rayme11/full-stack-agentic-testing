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
5. VS Code will ask *"Install recommended extensions?"* — click **Install All**

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
> The backend `src/` files exist but they are STUBS — the student adds the real code.

- [ ] **Read:** [`docs/STEP_02_BACKEND_API.md`](./docs/STEP_02_BACKEND_API.md)
  - Learn what a REST API is (GET / POST / PUT / DELETE)
  - Learn how Express routes work
  - Learn how SQLite stores data in a file
  - Learn how Zod validates request inputs

- [ ] **Install backend dependencies:**
  ```bash
  cd backend
  npm install
  ```

- [ ] **Open `backend/src/types.ts`** — define the TypeScript interfaces:
  ```typescript
  export interface Idea {
    readonly id: number;
    title: string;
    description: string;
    category: string;
    readonly created_at: string;
    updated_at: string;
  }
  export interface CreateIdeaInput { title: string; description: string; category?: string; }
  export interface UpdateIdeaInput { title?: string; description?: string; category?: string; }
  export interface ApiSuccess<T> { data: T; }
  export interface ApiError { error: string; }
  ```

- [ ] **Open `backend/src/db/database.ts`** — complete the two TODOs (WAL pragma + CREATE TABLE)

- [ ] **Open `backend/src/routes/ideas.ts`** — implement all 5 endpoints

- [ ] **Open `backend/src/app.ts`** — uncomment the router import and `app.use("/api/ideas", ...)` lines

- [ ] **Start the backend:**
  ```bash
  npm run dev
  # You should see: ✅ Server running on http://localhost:3001
  ```

- [ ] **Test your endpoints manually** (open a NEW terminal tab):
  ```bash
  curl http://localhost:3001/health
  curl http://localhost:3001/api/ideas
  curl -X POST http://localhost:3001/api/ideas \
    -H "Content-Type: application/json" \
    -d '{"title": "My first idea!", "category": "general"}'
  curl http://localhost:3001/api/ideas
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

> **Read the doc FIRST, then build the UI piece by piece.**
> The files exist but are stubs — you write the real code.

- [ ] **Read:** [`docs/STEP_03_FRONTEND_UI.md`](./docs/STEP_03_FRONTEND_UI.md)
  - Learn what Vite does and why we use it
  - Learn the MVC pattern (Model / View / Controller)
  - Learn about XSS and why we must escape HTML
  - Learn about event delegation

- [ ] **Make sure the backend is still running** in one terminal tab.

- [ ] **Install frontend dependencies** (new terminal tab):
  ```bash
  cd frontend
  npm install
  ```

- [ ] **Step 3a — Open `frontend/index.html`** and add the form:
  - Add `<form data-testid="idea-form">` with inputs for title, description, category
  - Give each input its `data-testid` attribute (see comments inside the file)

- [ ] **Step 3b — Open `frontend/src/api.ts`** and implement the API functions:
  - `getIdeas()` → GET /api/ideas
  - `createIdea(input)` → POST /api/ideas
  - `deleteIdea(id)` → DELETE /api/ideas/:id

- [ ] **Step 3c — Open `frontend/src/app.ts`** and connect the form to the API:
  - Import and call `getIdeas()` inside `loadIdeas()` to render ideas
  - Add a `submit` listener on the form that calls `createIdea()`
  - Add a delete click handler using event delegation

- [ ] **Start the frontend:**
  ```bash
  npm run dev
  # Open http://localhost:5173
  ```

- [ ] **Open Chrome DevTools** (F12 → Network tab) and watch the API calls appear

- [ ] **Exercise 3a — Security: try XSS:**
  Enter `<b>Bold title</b>` as an idea title. Is it bold or escaped as text?
  (If you used `escapeHtml()` correctly, it appears as plain text — safe!)

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

- [ ] **Study the E2E test file:** Open `tests/e2e/ideas.e2e.spec.ts`

- [ ] **Install Playwright's Chromium browser** (first time only):
  ```bash
  cd tests
  npx playwright install chromium
  ```

- [ ] **Make sure BOTH backend AND frontend are running:**
  ```bash
  # Terminal 1: cd backend && npm run dev
  # Terminal 2: cd frontend && npm run dev
  ```

- [ ] **Run E2E tests:**
  ```bash
  npm run test:e2e
  ```

- [ ] **Run tests in headed mode** (watch the browser!):
  ```bash
  npx playwright test tests/e2e/ --headed
  ```

- [ ] **Open Playwright UI mode** (interactive test runner):
  ```bash
  npx playwright test --ui
  ```

- [ ] **Exercise 5a — Add a `data-testid` to a new element:**
  1. Add a "total ideas count" paragraph to `frontend/index.html`
  2. Give it `data-testid="ideas-count"`
  3. Update `frontend/src/app.ts` to update the count after each load
  4. Write a new E2E test that verifies the count is correct

---

### 🟩 Step 6 — Write BDD Tests (Gherkin + Cucumber)

> **Read the doc FIRST, then run and write.**

- [ ] **Read:** [`docs/STEP_05_BDD_GHERKIN.md`](./docs/STEP_05_BDD_GHERKIN.md)
  - Learn what BDD is and why it matters
  - Learn Gherkin syntax (Given / When / Then)
  - Learn how Cucumber connects Gherkin to TypeScript

- [ ] **Study both BDD files:**
  1. `tests/bdd/features/ideas.feature` → Plain English scenarios
  2. `tests/bdd/steps/ideas.steps.ts` → TypeScript step implementations

- [ ] **Run BDD tests** (backend must be running):
  ```bash
  npm run test:bdd
  ```

- [ ] **Exercise 6a — Write a new Gherkin scenario:**
  Add to `ideas.feature`:
  ```gherkin
  Scenario: Update an idea's description
    Given an idea exists with title "Update description test"
    When I update the idea's description to "A better description"
    Then the response status should be 200
  ```
  Then add the missing step to `ideas.steps.ts` and run the tests.

---

### 🟩 Step 7 — Understand GitHub Actions & AI

- [ ] **Read:** [`docs/STEP_06_GITHUB_ACTIONS_AI.md`](./docs/STEP_06_GITHUB_ACTIONS_AI.md)
  - Learn what CI/CD is
  - Understand the GitHub Actions YAML syntax
  - Learn how AI (GPT-4o) can be integrated into a PR review workflow

- [ ] **Explore the workflow files:**
  1. Open `.github/workflows/ci.yml` — trace each job
  2. Open `.github/workflows/ai-pr-review.yml` — understand the AI flow
  3. Open `.github/copilot-instructions.md` — see how GitHub Copilot is guided

- [ ] **Exercise 7a — Open a Pull Request:**
  1. Create a new branch: `git checkout -b feature/my-first-feature`
  2. Make a small change (e.g., add a comment to `backend/src/app.ts`)
  3. Commit and push: `git add . && git commit -m "feat: my first commit" && git push -u origin feature/my-first-feature`
  4. Open a Pull Request on GitHub
  5. Watch the CI jobs run in the "Checks" tab
  6. If you have an `OPENAI_API_KEY` secret set up, watch the AI review appear!

---

### 🟥 Bonus — Intentionally Break Things (Advanced Learning)

The best way to understand QA is to break things and watch tests catch the errors.

- [ ] **Break 1 — SQL Injection test:**
  In `routes/ideas.ts`, change:
  ```typescript
  db.prepare("SELECT * FROM ideas WHERE id = ?").get(id)
  ```
  to:
  ```typescript
  // UNSAFE — never do this in production!
  db.exec(`SELECT * FROM ideas WHERE id = ${id}`)
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
