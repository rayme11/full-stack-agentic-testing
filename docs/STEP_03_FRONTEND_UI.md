# Step 03 – Frontend UI with HTML + CSS + TypeScript

## 🎯 What You Will Learn
- Why we use **Vite** as a frontend build tool
- How TypeScript works in the browser (via Vite's transpilation)
- The **MVC pattern** applied to a simple UI
- **XSS (Cross-Site Scripting)** — a real security vulnerability and how to prevent it
- How the **Fetch API** works for calling your backend
- **Accessibility** (a11y) basics — using semantic HTML and ARIA attributes

---

## 📚 Concept: Vite — The Frontend Build Tool

> **Why can't we just write TypeScript in the browser?**

Browsers only understand JavaScript, not TypeScript. We need a tool to:
1. **Transpile** TypeScript → JavaScript
2. **Bundle** multiple files into one for fast loading
3. **Serve** a local dev server with instant hot reload

**Vite** does all of this, and it's blazing fast:

```
Developer writes TypeScript        Browser receives JavaScript
frontend/src/app.ts      → Vite → frontend/dist/assets/app-abc123.js
frontend/src/api.ts      →       (bundled together)
```

---

## 📁 Frontend File Structure

```
frontend/
├── index.html           ← The ONE HTML page (SPA – Single Page Application)
├── vite.config.ts       ← Vite configuration (TypeScript!)
├── tsconfig.json        ← TypeScript compiler settings
├── package.json
└── src/
    ├── app.ts           ← UI logic (the "Controller")
    ├── api.ts           ← API calls (the "Model")
    └── style.css        ← All styles (the "View" styling)
```

### Why separate `api.ts` from `app.ts`?

```typescript
// api.ts — ONLY responsible for fetching data
export async function getIdeas(): Promise<Idea[]> { ... }
export async function createIdea(input): Promise<Idea> { ... }

// app.ts — ONLY responsible for the UI
const ideas = await getIdeas();  // calls api.ts
renderIdeas(ideas);              // updates the DOM
```

If you later switch from REST API to GraphQL, you only change `api.ts`.
If you redesign the UI, you only change `app.ts`.
This is the **Single Responsibility Principle**.

---

## 🚀 Running the Frontend

```bash
# Make sure the backend is already running in another terminal!
cd backend && npm run dev

# Now start the frontend:
cd frontend && npm run dev
```

Open http://localhost:5173 in your browser.

**Hot Reload**: When you save a `.ts` or `.css` file, the browser updates **instantly** without refreshing. This is Vite's killer feature.

---

## 📚 Concept: Semantic HTML

Compare these two snippets — they look the same in a browser but mean very different things:

```html
<!-- ❌ Non-semantic HTML (bad practice) -->
<div class="header">
  <div class="title">Idea Journal</div>
</div>
<div class="content">
  <div class="form">...</div>
</div>

<!-- ✅ Semantic HTML (best practice) -->
<header>
  <h1>Idea Journal</h1>
</header>
<main>
  <form>...</form>
</main>
```

**Why it matters:**
- 🦮 **Screen readers** (used by blind/visually impaired users) understand `<header>`, `<main>`, `<form>` — not generic `<div>`s
- 🔍 **SEO**: Search engines rank semantic pages higher
- 👩‍💻 **Readability**: Other developers understand the structure immediately

---

## 📚 Concept: data-testid — The Testing Contract

Look at the HTML:
```html
<input id="idea-title" data-testid="input-title" ... />
<button data-testid="btn-submit">Add Idea</button>
```

And the Playwright test:
```typescript
await page.getByTestId("input-title").fill("Learn Playwright");
await page.getByTestId("btn-submit").click();
```

`data-testid` attributes are **only for testing** — they don't affect styling or functionality. But they make tests **stable**:

| Selector | Stable? | Problem |
|----------|---------|---------|
| `#idea-title` | ✅ | OK if the ID never changes |
| `.btn-primary` | ❌ | Breaks if CSS class name changes |
| `button:nth-child(2)` | ❌ | Breaks if the DOM order changes |
| `[data-testid="btn-submit"]` | ✅ | Only breaks if you intentionally change the test ID |

---

## 📚 Concept: XSS Prevention (Security!)

> **Cross-Site Scripting (XSS)** is one of the most common web vulnerabilities.

```javascript
// ❌ DANGEROUS — attacker can inject malicious script:
ideasList.innerHTML = `<h3>${idea.title}</h3>`;

// If idea.title = "<script>document.cookie = 'stolen'</script>"
// The browser EXECUTES that script! 💀

// ✅ SAFE — always escape user content before inserting into HTML:
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")    // < becomes &lt; (just text, not a tag)
    .replace(/>/g, "&gt;");
}

ideasList.innerHTML = `<h3>${escapeHtml(idea.title)}</h3>`;
// Now "<script>" becomes "&lt;script&gt;" — harmless text
```

In `frontend/src/app.ts`, every user-provided value is passed through `escapeHtml()` before going into `innerHTML`. This is non-negotiable for any production web app.

---

## 📚 Concept: Event Delegation

Instead of this (bad):
```typescript
// Attaches a new event listener to EVERY delete button
// If you have 100 ideas, you have 100 listeners — wasteful!
document.querySelectorAll("[data-testid='btn-delete']").forEach(btn => {
  btn.addEventListener("click", handleDelete);
});
```

We use **event delegation** (good):
```typescript
// ONE listener on the parent list
// It checks if the clicked element is a delete button
ideasList.addEventListener("click", (e: Event) => {
  const target = e.target as HTMLElement;
  if (!target.matches("[data-testid='btn-delete']")) return;
  // handle delete...
});
```

This is more efficient and works even for elements added **after** the listener was set up.

---

## 🔍 What to Explore in the Code

1. Open `frontend/src/api.ts` — notice every function has a TypeScript return type (`Promise<Idea[]>`)
2. Open `frontend/src/app.ts` — trace how a form submission flows:
   `form.submit event` → `createIdea()` in api.ts → `fetch POST /api/ideas` → backend → database → response → `loadIdeas()` → `renderIdeas()`
3. Open `frontend/index.html` — count how many `data-testid` attributes there are

---

## 📝 Try This Yourself

1. **Add a new field** to the form: Add a `priority` dropdown (Low / Medium / High)
2. **Add color coding**: Give "High priority" ideas a red border using CSS
3. **Break it intentionally**: Remove the `escapeHtml()` call and try entering `<b>Bold</b>` as a title — what happens?

---

➡️ **Next Step:** [Step 04 – Playwright Tests](./STEP_04_PLAYWRIGHT_TESTS.md)
