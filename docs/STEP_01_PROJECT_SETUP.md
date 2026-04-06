# Step 01 – Project Setup & TypeScript Foundations

## 🎯 What You Will Learn
- How to set up a **TypeScript monorepo** from scratch
- Why TypeScript is preferred over plain JavaScript in professional teams
- How VS Code helps you write better TypeScript code
- What a **monorepo** is and why we use one

---

## 📚 Concept: Why TypeScript?

> **TypeScript** is a *superset* of JavaScript that adds **static type checking**.

```
JavaScript:             TypeScript:
let name = "Alice"      let name: string = "Alice"
name = 42               name = 42  ← ❌ ERROR caught at compile time!
                                       (not when users run the app)
```

**Why does this matter for QA and engineering jobs?**

| Feature | JavaScript | TypeScript |
|---------|-----------|-----------|
| Catch errors | At runtime (user sees them) | At compile time (developer sees them) |
| IDE autocomplete | Basic | Rich (knows all properties/methods) |
| Refactoring | Dangerous (can miss things) | Safe (compiler checks everything) |
| Team collaboration | Hard (no type contracts) | Easy (types are the documentation) |

In every modern company — Google, Microsoft, Stripe, etc. — TypeScript is the standard.

---

## 📁 Project Structure

```
full-stack-agentic-testing/
├── .github/               ← GitHub Actions CI/CD + Copilot instructions
│   ├── workflows/
│   │   ├── ci.yml         ← Automated tests on every push
│   │   └── ai-pr-review.yml ← AI-powered PR review
│   ├── copilot-instructions.md ← Guides GitHub Copilot
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── ISSUE_TEMPLATE/
├── backend/               ← Node.js + Express + TypeScript API server
├── frontend/              ← HTML + CSS + TypeScript UI (built with Vite)
├── tests/                 ← Playwright E2E, API tests, and Cucumber BDD
├── docs/                  ← Step-by-step learning documentation
├── scripts/               ← Python AI helper scripts
├── tsconfig.json          ← Root TypeScript config (references sub-projects)
├── package.json           ← Root npm workspace definition
├── requirements.txt       ← Python dependencies (for AI scripts)
├── .env.example           ← Template for local environment variables
└── .gitignore
```

**This is called a monorepo** — multiple packages (`backend`, `frontend`, `tests`) live in ONE Git repository. Benefits:
- Shared version control history
- Easier to keep versions in sync
- One `git clone` gives you everything

---

## 🛠 Prerequisites — Install These First

| Tool | Why? | Install |
|------|------|---------|
| **Node.js 20+** | Runs TypeScript/JavaScript | https://nodejs.org |
| **npm 9+** | Package manager (comes with Node) | Included with Node |
| **Git** | Version control | https://git-scm.com |
| **VS Code** | Editor with TypeScript intelligence | https://code.visualstudio.com |
| **Python 3.11+** | For AI helper scripts | https://python.org |

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/rayme11/full-stack-agentic-testing.git
cd full-stack-agentic-testing
```

### 2. Install VS Code extensions
Open VS Code, press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac), type:
```
Extensions: Show Recommended Extensions
```
Install all recommended extensions (they are in `.vscode/extensions.json`).

**Key extensions explained:**
- **ESLint** – Warns you about code style problems while you type
- **Prettier** – Auto-formats your code on save (no more arguing about tabs vs spaces)
- **Playwright Test for VS Code** – Run Playwright tests from the sidebar
- **Cucumber (Gherkin) Full Support** – Syntax highlighting for `.feature` files
- **GitHub Copilot** – AI code completion

### 3. Set up environment variables
```bash
cp .env.example .env
```
Open `.env` and set your values. For local development, the defaults work fine.

### 4. Install all dependencies
```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install

# Tests
cd ../tests && npm install

# Back to root
cd ..
```

### 5. Install Python dependencies (for AI scripts)
```bash
pip install -r requirements.txt
```

---

## 🔑 Key TypeScript Concepts You Will Use

### Interfaces — describe the *shape* of data
```typescript
// WHY: An interface is a "contract" — anything using this interface
// MUST have these exact properties with these exact types.
interface Idea {
  id: number;        // must be a number
  title: string;     // must be a string
  category: string;  // must be a string
  created_at: string;
}

// TypeScript will ERROR if you try to access a property that doesn't exist:
const idea: Idea = fetchIdea();
console.log(idea.nme); // ❌ Error: Property 'nme' does not exist on type 'Idea'
console.log(idea.name); // ❌ Error: Did you mean 'title'?
```

### async/await — for operations that take time
```typescript
// WHY: Fetching data from a database or network is ASYNCHRONOUS.
// async/await makes it look like regular synchronous code.

// ❌ Old way (callback hell):
fetchIdeas(function(ideas) {
  processIdeas(ideas, function(result) {
    displayResult(result);
  });
});

// ✅ Modern way (async/await):
const ideas = await fetchIdeas();
const result = await processIdeas(ideas);
displayResult(result);
```

### Strict mode — enabled by default in this project
```typescript
// With "strict": true in tsconfig.json, TypeScript is extra careful.
// Example: it won't let you use a value that might be null.

const element = document.getElementById("my-input");
element.value = "hello"; // ❌ Error: element might be null!

// Fix — check for null first:
const element = document.getElementById("my-input") as HTMLInputElement;
element.value = "hello"; // ✅ OK — we've told TypeScript the exact type
```

---

## ✅ Verify Your Setup

After installing dependencies, check everything compiles:
```bash
# In the backend directory:
cd backend && npx tsc --noEmit
# Should print nothing (no errors)

# In the frontend directory:
cd ../frontend && npx tsc --noEmit
# Should print nothing (no errors)

# In the tests directory:
cd ../tests && npx tsc --noEmit
# Should print nothing (no errors)
```

**If you see TypeScript errors** — that's great! It means TypeScript is working and catching problems before you run the code.

---

## 📝 What to Try Next

1. Open `backend/src/types.ts` — this is where all shared TypeScript types are defined
2. Try changing `title: string` to `title: number` — see what errors appear in VS Code!
3. Change it back and open `backend/src/routes/ideas.ts` to see how types are used in a real API

---

➡️ **Next Step:** [Step 02 – Backend API](./STEP_02_BACKEND_API.md)
