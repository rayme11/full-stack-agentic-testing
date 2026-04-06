# 💡 Full-Stack Agentic Testing — Idea Journal

[![CI](https://github.com/rayme11/full-stack-agentic-testing/actions/workflows/ci.yml/badge.svg)](https://github.com/rayme11/full-stack-agentic-testing/actions/workflows/ci.yml)

A **step-by-step, beginner-to-professional learning project** covering full-stack TypeScript development, modern QA engineering, and AI-assisted testing workflows.

> **Topic:** "Idea Journal" — a simple CRUD app where you capture, organize, and retrieve learning ideas. Simple enough to follow, powerful enough to teach every concept.

---

## 🗺 Learning Path

| Step | Topic | What You Build |
|------|-------|---------------|
| [01](./docs/STEP_01_PROJECT_SETUP.md) | Project Setup & TypeScript | Monorepo, VS Code config, TypeScript basics |
| [02](./docs/STEP_02_BACKEND_API.md) | Backend API | Express + TypeScript + SQLite REST API |
| [03](./docs/STEP_03_FRONTEND_UI.md) | Frontend UI | HTML + CSS + TypeScript with Vite |
| [04](./docs/STEP_04_PLAYWRIGHT_TESTS.md) | Playwright Testing | E2E browser tests + API tests |
| [05](./docs/STEP_05_BDD_GHERKIN.md) | BDD with Gherkin | Cucumber.js + feature files |
| [06](./docs/STEP_06_GITHUB_ACTIONS_AI.md) | GitHub Actions & AI | CI/CD pipelines + GPT-4o PR review |

**Start here → [Step 01: Project Setup](./docs/STEP_01_PROJECT_SETUP.md)**

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Browser (User)                       │
│              http://localhost:5173                        │
└─────────────────────┬───────────────────────────────────┘
                       │  HTTP (Vite proxy in dev)
                       ▼
┌─────────────────────────────────────────────────────────┐
│           Frontend (Vite + TypeScript)                   │
│   index.html  ·  src/app.ts  ·  src/api.ts              │
└─────────────────────┬───────────────────────────────────┘
                       │  REST API (JSON)
                       ▼
┌─────────────────────────────────────────────────────────┐
│            Backend (Express + TypeScript)                │
│   src/app.ts  ·  src/routes/ideas.ts  ·  src/db/        │
└─────────────────────┬───────────────────────────────────┘
                       │  SQL
                       ▼
┌─────────────────────────────────────────────────────────┐
│                SQLite Database (file)                    │
│                 backend/data/ideas.db                    │
└─────────────────────────────────────────────────────────┘

Tests:
  tests/api/       → Playwright API tests  (no browser, fast)
  tests/e2e/       → Playwright E2E tests  (real Chromium browser)
  tests/bdd/       → Cucumber BDD tests    (Gherkin feature files)

CI/CD:
  .github/workflows/ci.yml           → Automated test pipeline
  .github/workflows/ai-pr-review.yml → GPT-4o PR review
```

---

## 🚀 START HERE — Open the Project in VS Code

> This project is designed to be worked through **step by step in VS Code**.
> Do not just clone and run — follow the guided learning path below.

```bash
# 1. Clone the repo
git clone https://github.com/rayme11/full-stack-agentic-testing.git
cd full-stack-agentic-testing

# 2. Open the VS Code WORKSPACE file (not just the folder!)
code idea-journal.code-workspace
```

When VS Code opens, **install the recommended extensions** when prompted.

Then open **[`LEARNING_PATH.md`](./LEARNING_PATH.md)** — that is your step-by-step checklist.

---

## ⚡ Quick Start (after VS Code workspace is open)

### Prerequisites
- **Node.js 22+** — https://nodejs.org *(required for built-in SQLite)*
- **npm 9+** — included with Node.js
- **Git** — https://git-scm.com
- **VS Code** — https://code.visualstudio.com

### 1. Clone & Open the Workspace
```bash
git clone https://github.com/rayme11/full-stack-agentic-testing.git
cd full-stack-agentic-testing

# Open the WORKSPACE file (not just the folder!)
code idea-journal.code-workspace
```

### 2. Install Extensions
Accept the prompt to install recommended extensions, or press `Ctrl+Shift+P` → "Extensions: Show Recommended Extensions".

### 3. Follow the Learning Path
Open **[`LEARNING_PATH.md`](./LEARNING_PATH.md)** and work through each step.

### 4. Set Up Environment
```bash
cp .env.example .env
# Defaults work for local development
```

---

## 📁 Project Structure

```
full-stack-agentic-testing/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml               ← CI: build + test pipeline
│   │   └── ai-pr-review.yml     ← AI PR review with GPT-4o
│   ├── ISSUE_TEMPLATE/
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── copilot-instructions.md  ← GitHub Copilot guidance
├── backend/                     ← Express + TypeScript + SQLite
│   └── src/
│       ├── app.ts               ← Express entry point
│       ├── types.ts             ← Shared TypeScript interfaces
│       ├── db/database.ts       ← SQLite connection + schema
│       └── routes/ideas.ts      ← REST API route handlers
├── frontend/                    ← Vite + TypeScript + HTML + CSS
│   ├── index.html
│   └── src/
│       ├── app.ts               ← UI controller
│       ├── api.ts               ← API client (fetch wrapper)
│       └── style.css
├── tests/                       ← All test files (TypeScript throughout)
│   ├── playwright.config.ts     ← Playwright configuration
│   ├── cucumber.json            ← Cucumber BDD configuration
│   ├── api/ideas.api.spec.ts    ← Playwright API tests
│   ├── e2e/ideas.e2e.spec.ts    ← Playwright E2E tests
│   └── bdd/
│       ├── features/ideas.feature ← Gherkin scenarios
│       └── steps/ideas.steps.ts   ← TypeScript step definitions
├── docs/                        ← Step-by-step learning documentation
│   ├── STEP_01_PROJECT_SETUP.md
│   ├── STEP_02_BACKEND_API.md
│   ├── STEP_03_FRONTEND_UI.md
│   ├── STEP_04_PLAYWRIGHT_TESTS.md
│   ├── STEP_05_BDD_GHERKIN.md
│   └── STEP_06_GITHUB_ACTIONS_AI.md
├── scripts/
│   └── ai_pr_review.py          ← GPT-4o PR review script
├── tsconfig.json                ← Root TypeScript project references
├── package.json                 ← npm workspace root
├── requirements.txt             ← Python dependencies (AI scripts)
├── .env.example                 ← Environment variable template
└── .gitignore
```

---

## 🛠 Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Language | **TypeScript** (strict mode) | Type safety, IDE intelligence, industry standard |
| Backend | **Node.js + Express** | Simple, widely used, great for learning REST APIs |
| Database | **SQLite** (Node.js built-in `node:sqlite`) | Zero setup, no native compilation, built into Node 22+ |
| Validation | **Zod** | Runtime type validation that matches TypeScript types |
| Frontend | **HTML + CSS + TypeScript** | Fundamentals first, no framework magic |
| Build tool | **Vite** | Instant hot reload, fast TypeScript transpilation |
| E2E Testing | **Playwright** | Modern browser + API testing (replaced Selenium) |
| BDD | **Cucumber.js** | Gherkin feature files for human-readable tests |
| CI/CD | **GitHub Actions** | Free, built into GitHub, industry standard |
| AI Review | **OpenAI GPT-4o** | Automated PR review and code suggestions |

---

## 📚 API Reference

### Base URL: `http://localhost:3001`

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| `GET` | `/health` | Health check | 200 |
| `GET` | `/api/ideas` | Get all ideas | 200 |
| `GET` | `/api/ideas/:id` | Get idea by ID | 200 / 404 |
| `POST` | `/api/ideas` | Create a new idea | 201 / 400 |
| `PUT` | `/api/ideas/:id` | Update an idea | 200 / 404 |
| `DELETE` | `/api/ideas/:id` | Delete an idea | 204 / 404 |

### Request Body (POST / PUT)
```json
{
  "title": "Learn TypeScript",
  "description": "Study generics and utility types",
  "category": "backend"
}
```

### Categories
`general` · `frontend` · `backend` · `testing` · `devops` · `ai`

---

## 🤝 Contributing

1. Read the [Copilot instructions](.github/copilot-instructions.md) for coding conventions
2. Open an [issue](.github/ISSUE_TEMPLATE/feature_request.md) describing your change
3. Create a feature branch: `git checkout -b feature/my-change`
4. Make your changes with TypeScript and tests
5. Open a Pull Request — the AI review will automatically post feedback

---

## 📄 License

MIT — see [LICENSE](./LICENSE)
