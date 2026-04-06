/**
 * Main application script
 * ========================
 * WHY: This TypeScript file contains all the UI logic — it fetches data
 * from the API, renders it to the DOM, and responds to user events.
 *
 * CONCEPT: The "MVC" pattern (Model-View-Controller) separates:
 *   Model      → api.ts  (data fetching)
 *   View       → index.html + style.css (presentation)
 *   Controller → app.ts  (user interactions, this file)
 */

import { getIdeas, createIdea, deleteIdea, type Idea } from "./api";

// ── DOM element references ────────────────────────────────────────────────────
// WHY: Cache DOM references to avoid repeatedly querying the DOM,
// which is a slow operation.
const form          = document.getElementById("idea-form")     as HTMLFormElement;
const titleInput    = document.getElementById("idea-title")    as HTMLInputElement;
const descInput     = document.getElementById("idea-description") as HTMLTextAreaElement;
const categoryInput = document.getElementById("idea-category") as HTMLSelectElement;
const formStatus    = document.getElementById("form-status")   as HTMLParagraphElement;
const titleError    = document.getElementById("title-error")   as HTMLSpanElement;
const ideasList     = document.getElementById("ideas-list")    as HTMLUListElement;
const loadingMsg    = document.getElementById("loading")       as HTMLDivElement;
const emptyMsg      = document.getElementById("empty-msg")     as HTMLParagraphElement;
const searchInput   = document.getElementById("search-input")  as HTMLInputElement;
const filterCat     = document.getElementById("filter-category") as HTMLSelectElement;

// ── Application state ─────────────────────────────────────────────────────────
let allIdeas: Idea[] = [];

// ── Render ideas to the DOM ───────────────────────────────────────────────────
function renderIdeas(ideas: Idea[]): void {
  ideasList.innerHTML = "";

  if (ideas.length === 0) {
    emptyMsg.classList.remove("hidden");
    return;
  }
  emptyMsg.classList.add("hidden");

  ideas.forEach((idea) => {
    const li = document.createElement("li");
    li.className = "idea-card";
    li.setAttribute("data-testid", "idea-item");
    li.setAttribute("data-id", String(idea.id));
    li.innerHTML = `
      <div class="idea-header">
        <h3 class="idea-title" data-testid="idea-title">${escapeHtml(idea.title)}</h3>
        <span class="badge badge-${idea.category}" data-testid="idea-category">${idea.category}</span>
      </div>
      ${idea.description
        ? `<p class="idea-desc" data-testid="idea-description">${escapeHtml(idea.description)}</p>`
        : ""}
      <div class="idea-footer">
        <time class="idea-date">${formatDate(idea.created_at)}</time>
        <button
          class="btn btn-danger btn-sm"
          data-testid="btn-delete"
          data-id="${idea.id}"
          aria-label="Delete idea: ${escapeHtml(idea.title)}"
        >🗑 Delete</button>
      </div>
    `;
    ideasList.appendChild(li);
  });
}

// ── Load ideas from the API ───────────────────────────────────────────────────
async function loadIdeas(): Promise<void> {
  loadingMsg.style.display = "block";
  try {
    allIdeas = await getIdeas();
    applyFilters();
  } catch (err) {
    showStatus(`Error loading ideas: ${(err as Error).message}`, "error");
  } finally {
    loadingMsg.style.display = "none";
  }
}

// ── Apply search and category filters ────────────────────────────────────────
function applyFilters(): void {
  const query = searchInput.value.toLowerCase().trim();
  const cat   = filterCat.value;

  const filtered = allIdeas.filter((idea) => {
    const matchesSearch =
      !query ||
      idea.title.toLowerCase().includes(query) ||
      idea.description.toLowerCase().includes(query);
    const matchesCategory = !cat || idea.category === cat;
    return matchesSearch && matchesCategory;
  });

  renderIdeas(filtered);
}

// ── Handle form submission ────────────────────────────────────────────────────
form.addEventListener("submit", async (e: Event) => {
  e.preventDefault();
  clearErrors();

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
      category: categoryInput.value,
    });
    form.reset();
    showStatus("✅ Idea added successfully!", "success");
    await loadIdeas();
  } catch (err) {
    showStatus(`Error: ${(err as Error).message}`, "error");
  }
});

// ── Handle delete button clicks (event delegation) ───────────────────────────
// WHY: Instead of attaching a listener to every delete button, we attach ONE
// listener to the parent list and check if the clicked element is a delete button.
// This is called "event delegation" and is more efficient.
ideasList.addEventListener("click", async (e: Event) => {
  const target = e.target as HTMLElement;
  if (!target.matches("[data-testid='btn-delete']")) return;

  const id = parseInt(target.getAttribute("data-id") ?? "", 10);
  if (isNaN(id)) return;

  if (!confirm("Are you sure you want to delete this idea?")) return;

  try {
    await deleteIdea(id);
    await loadIdeas();
  } catch (err) {
    showStatus(`Error deleting idea: ${(err as Error).message}`, "error");
  }
});

// ── Listen for filter changes ─────────────────────────────────────────────────
searchInput.addEventListener("input", applyFilters);
filterCat.addEventListener("change", applyFilters);

// ── Utility functions ─────────────────────────────────────────────────────────

/** Show a status message below the form */
function showStatus(message: string, type: "success" | "error"): void {
  formStatus.textContent = message;
  formStatus.className = `status-msg status-${type}`;
  setTimeout(() => {
    formStatus.textContent = "";
    formStatus.className = "status-msg";
  }, 4000);
}

/** Clear validation error messages */
function clearErrors(): void {
  titleError.textContent = "";
}

/**
 * Escape HTML special characters to prevent XSS attacks.
 * WHY SECURITY: Never insert user-provided text directly into innerHTML!
 * Always escape it first to prevent Cross-Site Scripting (XSS).
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/** Format an ISO date string into a readable local date */
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ── Bootstrap the app ─────────────────────────────────────────────────────────
loadIdeas();
