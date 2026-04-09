# Step 06 – GitHub Actions & AI-Powered Testing

> **⚠️ Stub Status — Read This First**
>
> The CI workflow files **already exist** and will run automatically when you push to GitHub. However, some parts require configuration before they work:
>
> | File                                 | Status         | What you need to do                             |
> | ------------------------------------ | -------------- | ----------------------------------------------- |
> | `.github/workflows/ci.yml`           | ✅ Ready       | Just push to GitHub — it runs automatically     |
> | `.github/workflows/ai-pr-review.yml` | ⚙️ Needs setup | Add `OPENAI_API_KEY` secret to your GitHub repo |
> | `scripts/ai_pr_review.py`            | ✅ Ready       | Used by the workflow automatically              |
>
> **Prerequisite:** Steps 2–5 must be complete so the CI tests have something to verify.

---

## 🎯 What You Will Learn

- What **CI/CD** is and why every professional team uses it
- How **GitHub Actions** workflows work (YAML syntax)
- How to use an **LLM (GPT-4o)** for automated PR code review
- **SRE (Site Reliability Engineering)** principles: automation, reliability, observability
- How AI models fit into modern software engineering pipelines

---

## 📚 Concept: What is CI/CD?

**CI** = Continuous Integration  
**CD** = Continuous Delivery / Deployment

```
Developer pushes code
        ↓
   GitHub Actions triggers automatically
        ↓
   ┌─────────────────────────────────┐
   │  Job 1: Build TypeScript        │ ← Catch compile errors early
   │  Job 2: Run API Tests           │ ← Verify endpoints work
   │  Job 3: Run E2E Tests           │ ← Verify full user flow
   │  Job 4: Run BDD Tests           │ ← Verify business requirements
   └─────────────────────────────────┘
        ↓
   All green? ✅ → Code is safe to merge
   Any red?   ❌ → Block the merge, notify the developer
```

**Why it matters:** In a team of 10 developers, CI/CD ensures that code pushed by one person doesn't break another person's feature. It's the safety net of modern software delivery.

---

## 📁 GitHub Actions File Structure

```
.github/
├── workflows/
│   ├── ci.yml              ← Main CI (build + test on every push)
│   └── ai-pr-review.yml   ← AI-powered PR review using GPT-4o
├── ISSUE_TEMPLATE/
│   ├── bug_report.md
│   └── feature_request.md
├── PULL_REQUEST_TEMPLATE.md
└── copilot-instructions.md ← Guides GitHub Copilot's suggestions
```

---

## 📚 Concept: GitHub Actions YAML Anatomy

```yaml
name: CI – Build, Lint & Test # Name shown in GitHub UI

on: # TRIGGERS — when does this run?
  push:
    branches: [main] # On push to main branch
  pull_request:
    branches: [main] # On PRs targeting main

jobs: # JOBS — what to do (run in parallel by default)
  build:
    name: Build TypeScript
    runs-on: ubuntu-latest # Which OS (GitHub provides this for free!)

    steps: # STEPS — sequential commands within a job
      - name: Checkout code
        uses: actions/checkout@v4 # "uses" = a pre-built action from the marketplace

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20" # "with" = parameters for the action

      - name: Install dependencies
        run: npm ci # "run" = a shell command
        working-directory: backend # Where to run it
```

**Key concepts:**

- **`on`**: The trigger (push, PR, schedule, manual)
- **`jobs`**: Run in parallel unless you use `needs:` to create dependencies
- **`steps`**: Run sequentially within a job
- **`uses`**: Reuse pre-built actions (like npm packages, but for CI)
- **`run`**: Execute any shell command

---

## 📚 Concept: Job Dependencies

```yaml
jobs:
  build:        # ← Runs first (no dependencies)
    ...

  api-tests:
    needs: build   # ← Only runs IF build succeeds
    ...

  e2e-tests:
    needs: build   # ← Also runs in parallel with api-tests
    ...
```

This creates a pipeline:

```
build ──→ api-tests ─┐
      └──→ e2e-tests ─┤
          └──→ bdd-tests ┘
```

---

## 📚 Concept: Secrets — Keeping API Keys Safe

```yaml
# In the workflow:
env:
  OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
```

```
Repository Settings → Secrets and variables → Actions → New repository secret
Name: OPENAI_API_KEY
Value: sk-...your-key...
```

**Why secrets?** Never put API keys in code. If they end up in Git history, anyone can find them forever. GitHub Secrets are encrypted and never appear in logs.

---

## 📚 Concept: AI-Powered PR Review

The `ai-pr-review.yml` workflow:

1. Triggers on every new PR or push to a PR
2. Gets the diff of changed files (what changed in this PR)
3. Sends the diff to **GPT-4o** with a system prompt that says "you are a TypeScript expert"
4. GPT-4o returns a structured code review
5. The script posts the review as a comment on the GitHub PR

```python
# scripts/ai_pr_review.py (simplified)
diff = get_git_diff()  # What changed in this PR

review = openai.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": "You are a TypeScript + QA expert. Review this PR diff..."},
        {"role": "user", "content": f"Review:\n{diff}"}
    ]
)

post_github_comment(review.choices[0].message.content)
```

**This is a real pattern used in production** at companies like GitHub (Copilot for PRs), Linear, and many others.

---

## 📚 Concept: SRE (Site Reliability Engineering)

SRE is a discipline that applies software engineering principles to operations. Key concepts:

| SRE Concept        | How This Project Demonstrates It                                                     |
| ------------------ | ------------------------------------------------------------------------------------ |
| **Automation**     | GitHub Actions runs tests automatically — humans don't manually verify each commit   |
| **Reliability**    | Tests catch regressions before they reach users                                      |
| **Observability**  | Health check endpoint (`GET /health`), test reports, CI status badges                |
| **Error Budgets**  | The `retries: 2` in Playwright allows 2 flaky test failures before failing the build |
| **Toil Reduction** | AI PR review reduces manual code review burden                                       |

---

## � Step-by-Step Tasks

---

### ✅ Task 1 — Push Your Branch and Watch CI Run

Push your `feat/step-02-backend-api` branch to GitHub and open a Pull Request against `main`:

```bash
git add .
git commit -m "feat(backend): implement all 5 CRUD endpoints"
git push origin feat/step-02-backend-api
```

Then go to your GitHub repository → **Pull Requests** → **New pull request**.

Once the PR is open, click the **Checks** tab. You'll see the CI workflow begin. Green ✅ means tests passed. Red ❌ means something failed — click the job to see the exact error.

---

### ✅ Task 2 — Set Up the AI PR Review

The `ai-pr-review.yml` workflow uses the OpenAI API to automatically post a code review on your PR. To enable it:

1. Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `OPENAI_API_KEY`
4. Value: your OpenAI API key (`sk-...`)
5. Click **Add secret**

Now push a new commit to your PR branch. The AI review workflow will run and post a comment on your PR with feedback on the code changes.

> **Why secrets?** API keys must never be in code. If they end up in Git history, anyone who clones the repo can use them. GitHub Secrets are encrypted and never appear in logs.

---

### ✅ Task 3 — Read the CI Workflow

Open `.github/workflows/ci.yml` and read through it. Look for:

- Where does it install Node.js and npm dependencies?
- Which jobs depend on which other jobs (`needs:`)?
- How does it start the backend server before running tests?
- Where does it upload the Playwright test report?

---

You can run GitHub Actions workflows locally using [`act`](https://github.com/nektos/act):

```bash
# Install act (macOS)
brew install act

# Run the CI workflow locally
act push

# Run just the build job
act push -j build
```

---

## 🔧 Adding a Status Badge to Your README

Once CI is passing, add this to your README:

```markdown
[![CI](https://github.com/rayme11/full-stack-agentic-testing/actions/workflows/ci.yml/badge.svg)](https://github.com/rayme11/full-stack-agentic-testing/actions/workflows/ci.yml)
```

This shows a green/red badge that anyone can see — instant visibility into the health of the codebase.

---

## 📝 Try This Yourself

### Exercise 1: Add a scheduled workflow

```yaml
on:
  schedule:
    - cron: "0 9 * * 1-5" # Every weekday at 9 AM UTC
```

This runs your tests every morning before your team starts work. Morning failures = something broke overnight.

### Exercise 2: Add a lint step

Add ESLint to the CI pipeline:

```yaml
- name: Lint TypeScript
  run: npm run lint
  working-directory: backend
```

Now any ESLint rule violation blocks the merge.

### Exercise 3: Upload test reports as artifacts

The CI already does this! After a test run, go to the GitHub Actions run page → click "Artifacts" → download the HTML report and open it in your browser.

### Exercise 4: Intentionally break something

1. Change a 201 to a 200 in `routes/ideas.ts`
2. Push to a branch and open a PR
3. Watch GitHub Actions turn red
4. Watch the AI review comment point out the issue
5. Fix it and watch everything go green

This is the full CI/CD feedback loop in action!

---

## 🎯 Career Relevance

These are the exact tools and concepts that appear on QA/SRE/DevOps job descriptions:

- ✅ **GitHub Actions** — CI/CD pipeline automation
- ✅ **Playwright** — modern E2E testing (replaced Selenium in most companies)
- ✅ **BDD / Cucumber** — behaviour-driven testing methodology
- ✅ **TypeScript** — required in virtually all modern frontend/backend roles
- ✅ **LLM integration** — the fastest-growing skill in software engineering (2024-2025)
- ✅ **SRE practices** — automation, reliability, observability

---

➡️ **Congratulations!** You've completed the core learning path.  
📖 Review the full project by starting at [Step 01](./STEP_01_PROJECT_SETUP.md)  
🚀 Next challenge: Add a new feature end-to-end (UI + API + tests + CI)
