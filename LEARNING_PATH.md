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

> **Read the doc FIRST, then install and run.**

- [ ] **Read:** [`docs/STEP_02_BACKEND_API.md`](./docs/STEP_02_BACKEND_API.md)
  - Learn what a REST API is (GET / POST / PUT / DELETE)
  - Learn how Express routes work
  - Learn how SQLite stores data in a file
  - Learn how Zod validates request inputs

- [ ] **Install backend dependencies:**
  ```bash
  # In the VS Code terminal, from the repo root:
  cd backend
  npm install
  ```

- [ ] **Study the code — open each file and read the comments:**
  1. `backend/src/types.ts` → TypeScript interfaces (the data shapes)
  2. `backend/src/db/database.ts` → How the database is opened and schema created
  3. `backend/src/routes/ideas.ts` → The 5 REST endpoints (read top to bottom)
  4. `backend/src/app.ts` → How Express is wired together

- [ ] **Start the backend** (use VS Code Task or terminal):
  ```bash
  npm run dev
  # You should see: ✅ Backend running on http://localhost:3001
  ```

- [ ] **Test the API manually** — open a NEW terminal tab:
  ```bash
  # 1. Check health
  curl http://localhost:3001/health

  # 2. List ideas (empty at first)
  curl http://localhost:3001/api/ideas

  # 3. Create your first idea
  curl -X POST http://localhost:3001/api/ideas \
    -H "Content-Type: application/json" \
    -d '{"title": "My first idea!", "category": "general"}'

  # 4. List ideas again — see your idea!
  curl http://localhost:3001/api/ideas
  ```

- [ ] **Exercise 2a — Break validation intentionally:**
  ```bash
  # Send a POST with NO title — what status code do you get?
  curl -X POST http://localhost:3001/api/ideas \
    -H "Content-Type: application/json" \
    -d '{"description": "I forgot the title"}'
  # Expected: 400 Bad Request with { "error": "Title is required" }
  ```

- [ ] **Exercise 2b — Try a non-existent route:**
  ```bash
  curl http://localhost:3001/api/nonexistent
  # Expected: 404 { "error": "Route not found" }
  ```

---

### 🟩 Step 3 — Build the Frontend UI

> **Read the doc FIRST, then install and run.**

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

- [ ] **Study the code — open each file:**
  1. `frontend/index.html` → Semantic HTML structure with `data-testid` attributes
  2. `frontend/src/api.ts` → How `fetch()` is wrapped into typed functions
  3. `frontend/src/app.ts` → How the UI responds to user events
  4. `frontend/src/style.css` → CSS custom properties and component styles

- [ ] **Start the frontend:**
  ```bash
  npm run dev
  # Open http://localhost:5173 in your browser
  ```

- [ ] **Use the app** — add a few ideas using the form

- [ ] **Exercise 3a — Trace a form submission:**
  1. Open `frontend/src/app.ts`
  2. Add a `console.log("Form submitted!", title)` inside the form submit handler
  3. Open Chrome DevTools (`F12`) → Console tab
  4. Submit the form — see your log message!
  5. Remove the log when done

- [ ] **Exercise 3b — Explore the Network tab:**
  1. Open Chrome DevTools (`F12`) → Network tab
  2. Submit the form
  3. See the `POST /api/ideas` request appear
  4. Click it and examine the Request and Response headers/body

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
