/**
 * Step 3 – UI Controller
 * =======================
 * WHY: This file connects the HTML (what the user sees) to the API (the data).
 * It is the "Controller" in the MVC pattern:
 *   Model      → api.ts  (fetch data from backend)
 *   View       → index.html + style.css (what is rendered)
 *   Controller → app.ts  (respond to user events, update the view)
 *
 * STUDENT TASK — implement the TODOs below following docs/STEP_03_FRONTEND_UI.md
 *
 * Start small: first just load and display ideas. Then add the form.
 * Then add filtering. Then add delete. Build one thing at a time!
 */

// WHY: Cache DOM references at the top so we don't query the DOM repeatedly.
const ideasList   = document.getElementById("ideas-list")  as HTMLUListElement;
const loadingMsg  = document.getElementById("loading")     as HTMLDivElement;
const emptyMsg    = document.getElementById("empty-msg")   as HTMLParagraphElement;

// TODO: Add references for the form elements (Step 3a):
// const form       = document.getElementById("idea-form")        as HTMLFormElement;
// const titleInput = document.getElementById("idea-title")       as HTMLInputElement;
// const descInput  = document.getElementById("idea-description") as HTMLTextAreaElement;
// const catInput   = document.getElementById("idea-category")    as HTMLSelectElement;
// const formStatus = document.getElementById("form-status")      as HTMLParagraphElement;
// const titleError = document.getElementById("title-error")      as HTMLSpanElement;

// ── Step 3a: Load and display ideas ──────────────────────────────────────────
// TODO: Import getIdeas from "./api" and call it here.
// Render each idea as a <li> inside #ideas-list.
// Show #empty-msg when the list is empty.
// Show/hide #loading while the fetch is in progress.
async function loadIdeas(): Promise<void> {
  loadingMsg.style.display = "block";
  ideasList.innerHTML = "";

  // TODO: Call getIdeas() here and render the results
  // Hint: for each idea, create a <li data-testid="idea-item"> element

  loadingMsg.style.display = "none";
  emptyMsg.classList.remove("hidden");  // Remove this when you have real data
}

// ── Step 3b: Handle form submission ──────────────────────────────────────────
// TODO: Listen for the form's "submit" event.
// Validate that the title is not empty (show #title-error if it is).
// Call createIdea() from api.ts, then reload the list.

// ── Step 3c: Handle delete (event delegation) ────────────────────────────────
// TODO: Listen for clicks on #ideas-list.
// If the clicked element has data-testid="btn-delete", call deleteIdea().
// WHY event delegation: attach ONE listener to the parent, not one per button.

// ── Step 3d: Add search and category filtering ───────────────────────────────
// TODO: Listen for input/change events on #search-input and #filter-category.
// Filter the in-memory list without re-fetching from the API.

// ── Bootstrap ─────────────────────────────────────────────────────────────────
loadIdeas();
