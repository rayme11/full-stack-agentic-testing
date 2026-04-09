# Step 03 – Frontend UI with HTML + CSS + TypeScript

> **⚠️ Stub Status — Read This First**
>
> Three files are stubs in this step. Nothing renders (except an empty shell page) until you complete all tasks below.
>
> **Files you will implement:**
>
> - `frontend/index.html` — the form section shows a placeholder hint; you add the actual `<form>` HTML
> - `frontend/src/api.ts` — all three API functions are `// TODO` comments
> - `frontend/src/app.ts` — `loadIdeas()` exists but doesn't call the API yet; form/delete handlers are `// TODO`
>
> **Prerequisite:** The backend from Step 2 must be running (`cd backend && npm run dev`). The frontend fetches data from it.

---

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

| Selector                     | Stable? | Problem                                             |
| ---------------------------- | ------- | --------------------------------------------------- |
| `#idea-title`                | ✅      | OK if the ID never changes                          |
| `.btn-primary`               | ❌      | Breaks if CSS class name changes                    |
| `button:nth-child(2)`        | ❌      | Breaks if the DOM order changes                     |
| `[data-testid="btn-submit"]` | ✅      | Only breaks if you intentionally change the test ID |

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
document.querySelectorAll("[data-testid='btn-delete']").forEach((btn) => {
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

## 🔍 Understanding the Code You Just Wrote

1. Open `frontend/src/api.ts` — notice every function has a TypeScript return type (`Promise<Idea[]>`)
2. Open `frontend/src/app.ts` — trace how a form submission flows:
   `form.submit event` → `createIdea()` in api.ts → `fetch POST /api/ideas` → backend → database → response → `loadIdeas()` → DOM update
3. Open `frontend/index.html` — count how many `data-testid` attributes there are — these are what Playwright uses in Step 4

---

## 🛠 Step-by-Step Implementation Tasks

> Work through these **in order**. After Task 2 you'll have live data; after Task 3 you can create ideas from the UI.

---

### ✅ Task 1 — Add the Form HTML (`frontend/index.html`)

Open `frontend/index.html`. Find the `<!-- TODO: Add your form here -->` comment inside `<section class="form-section">`.

Replace the placeholder `<p class="hint">` block and the TODO comment with this form:

```html
<form id="idea-form" data-testid="idea-form" novalidate>
  <div class="form-group">
    <label for="idea-title">Title <span aria-hidden="true">*</span></label>
    <input
      type="text"
      id="idea-title"
      name="title"
      data-testid="input-title"
      placeholder="What do you want to learn?"
      required
      maxlength="200"
    />
    <!-- Shown when title is empty on submit -->
    <span id="title-error" class="field-error" role="alert"></span>
  </div>

  <div class="form-group">
    <label for="idea-description">Description</label>
    <textarea
      id="idea-description"
      name="description"
      data-testid="input-description"
      placeholder="Why is this important? What will you do with it?"
      rows="3"
      maxlength="1000"
    ></textarea>
  </div>

  <div class="form-group">
    <label for="idea-category">Category</label>
    <select id="idea-category" name="category" data-testid="select-category">
      <option value="general">General</option>
      <option value="frontend">Frontend</option>
      <option value="backend">Backend</option>
      <option value="testing">Testing</option>
      <option value="devops">DevOps</option>
      <option value="ai">AI</option>
    </select>
  </div>

  <button type="submit" data-testid="btn-submit">Add Idea</button>
  <!-- Shown after submit success or failure -->
  <p id="form-status" class="form-status" role="status"></p>
</form>
```

**Verify:** Open http://localhost:5173. You should see the form rendered. It won't submit yet — that comes in Task 3.

---

### ✅ Task 2 — Implement the API Functions (`frontend/src/api.ts`)

Open `frontend/src/api.ts`. The types (`Idea`, `CreateIdeaInput`) and the `API_BASE` constant are already there. You need to implement three functions.

Replace the `// TODO` comment blocks at the bottom of the file with:

```typescript
// ── Internal helper ───────────────────────────────────────────────────────────
// WHY: Every fetch() call has the same boilerplate (JSON headers, error handling).
// We extract it once here so every public function stays clean and readable.
async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    // Parse the { error: "..." } body from our backend for a useful message
    const errBody = (await res
      .json()
      .catch(() => ({ error: res.statusText }))) as { error: string };
    throw new Error(errBody.error ?? `HTTP ${res.status}`);
  }

  // 204 No Content (DELETE) has no body — return undefined cast to T
  if (res.status === 204) return undefined as unknown as T;

  const body = (await res.json()) as { data: T };
  return body.data;
}

// ── Public API functions ──────────────────────────────────────────────────────

export async function getIdeas(): Promise<Idea[]> {
  return apiFetch<Idea[]>("/ideas");
}

export async function createIdea(input: CreateIdeaInput): Promise<Idea> {
  return apiFetch<Idea>("/ideas", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function deleteIdea(id: number): Promise<void> {
  return apiFetch<void>(`/ideas/${id}`, { method: "DELETE" });
}
```

**Verify:** Save the file. No TypeScript errors should appear in VS Code.

---

### ✅ Task 3 — Connect the UI (`frontend/src/app.ts`)

Open `frontend/src/app.ts`. Complete it in three sub-tasks:

#### 3a — Load and display ideas

At the top, add the import and uncomment the form element references:

```typescript
import { getIdeas, createIdea, deleteIdea, type Idea } from "./api";

// WHY escapeHtml: NEVER put user content directly into innerHTML.
// If a title contains <script>...</script>, escaping prevents it from executing.
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const form = document.getElementById("idea-form") as HTMLFormElement;
const titleInput = document.getElementById("idea-title") as HTMLInputElement;
const descInput = document.getElementById(
  "idea-description",
) as HTMLTextAreaElement;
const catInput = document.getElementById("idea-category") as HTMLSelectElement;
const formStatus = document.getElementById(
  "form-status",
) as HTMLParagraphElement;
const titleError = document.getElementById("title-error") as HTMLSpanElement;
```

Then implement `loadIdeas()`:

```typescript
async function loadIdeas(): Promise<void> {
  loadingMsg.style.display = "block";
  ideasList.innerHTML = "";
  emptyMsg.classList.add("hidden");

  try {
    const ideas = await getIdeas();
    loadingMsg.style.display = "none";

    if (ideas.length === 0) {
      emptyMsg.classList.remove("hidden");
      return;
    }

    ideas.forEach((idea: Idea) => {
      const li = document.createElement("li");
      li.setAttribute("data-testid", "idea-item");
      li.innerHTML = `
        <div class="idea-content">
          <strong data-testid="idea-title">${escapeHtml(idea.title)}</strong>
          <span class="category-badge" data-testid="idea-category">${escapeHtml(idea.category)}</span>
          ${idea.description ? `<p>${escapeHtml(idea.description)}</p>` : ""}
        </div>
        <button class="btn-delete" data-testid="btn-delete" data-id="${idea.id}"
          aria-label="Delete idea: ${escapeHtml(idea.title)}">
          Delete
        </button>
      `;
      ideasList.appendChild(li);
    });
  } catch (err) {
    loadingMsg.style.display = "none";
    emptyMsg.textContent = "Failed to load ideas. Is the backend running?";
    emptyMsg.classList.remove("hidden");
  }
}
```

**Verify:** Open http://localhost:5173. Ideas you created with `curl` in Step 2 should now appear in the list.

#### 3b — Handle form submission

Add this after `loadIdeas`:

```typescript
form.addEventListener("submit", async (e: Event) => {
  e.preventDefault(); // Stops the browser's default full-page reload
  titleError.textContent = "";
  formStatus.textContent = "";

  const title = titleInput.value.trim();
  if (!title) {
    titleError.textContent = "Title is required";
    titleInput.focus();
    return;
  }

  try {
    await createIdea({
      title,
      description: descInput.value.trim(),
      category: catInput.value,
    });
    form.reset();
    formStatus.textContent = "Idea added!";
    await loadIdeas();
  } catch (err) {
    formStatus.textContent =
      err instanceof Error ? err.message : "Something went wrong";
  }
});
```

**Verify:** Fill in the form and click "Add Idea". The new idea should appear in the list below.

#### 3c — Handle delete (event delegation)

Add this after the form handler:

```typescript
// WHY event delegation: ONE listener on the list handles ALL delete buttons,
// including buttons added dynamically when new ideas are loaded.
ideasList.addEventListener("click", async (e: Event) => {
  const target = e.target as HTMLElement;
  if (!target.matches("[data-testid='btn-delete']")) return;

  const id = parseInt(target.getAttribute("data-id") ?? "0", 10);
  if (!id) return;

  try {
    await deleteIdea(id);
    await loadIdeas();
  } catch (err) {
    alert(err instanceof Error ? err.message : "Failed to delete");
  }
});
```

**Verify:** Click "Delete" on any idea. It should disappear from the list.

---

---

## 📝 Try This Yourself

1. **Add a new field** to the form: Add a `priority` dropdown (Low / Medium / High)
2. **Add color coding**: Give "High priority" ideas a red border using CSS
3. **Break it intentionally**: Remove the `escapeHtml()` call and try entering `<b>Bold</b>` as a title — what happens?

---

➡️ **Next Step:** [Step 04 – Playwright Tests](./STEP_04_PLAYWRIGHT_TESTS.md)
