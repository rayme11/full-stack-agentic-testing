/**
 * Step 6 – Cucumber Step Definitions (Starter)
 * ==============================================
 * WHY: Step definitions are the TypeScript code that Cucumber runs when
 * it executes each Given / When / Then line in the .feature file.
 *
 * This file contains only the steps needed for the starter health-check
 * scenario. After reading docs/STEP_05_BDD_GHERKIN.md, you will add:
 *  - Steps for POST /api/ideas (create an idea)
 *  - Steps for GET /api/ideas (retrieve all ideas)
 *  - Steps for GET /api/ideas/:id (retrieve a single idea)
 *  - Steps for PUT /api/ideas/:id (update an idea)
 *  - Steps for DELETE /api/ideas/:id (delete an idea)
 *  - Assertion steps (status code, response body, error messages)
 *
 * HOW IT WORKS:
 *   The string in Given/When/Then matches the text in the .feature file.
 *   {string} and {int} are placeholders that Cucumber extracts and passes
 *   as function arguments.
 */

import { Given, When, Then, Before, setDefaultTimeout } from "@cucumber/cucumber";
import assert from "assert";

// Each step can take up to 10 seconds before timing out
setDefaultTimeout(10_000);

const API_BASE = process.env.API_BASE_URL ?? "http://localhost:3001";

// ── Cucumber "World" — shared state within one scenario ───────────────────────
// WHY: Steps in the same scenario share state through `this` (the World object).
// Each scenario starts with a fresh World, so scenarios are independent.
declare module "@cucumber/cucumber" {
  interface World {
    apiBase: string;
    lastResponse: Response | null;
    lastBody: unknown;
  }
}

Before(function (this: { apiBase: string; lastResponse: Response | null; lastBody: unknown }) {
  this.apiBase = API_BASE;
  this.lastResponse = null;
  this.lastBody = null;
});

// ════════════════════════════════════════════════════════════════════════════
// Starter Steps — supports the health-check scenario
// ════════════════════════════════════════════════════════════════════════════

Given(
  "the API is running at {string}",
  async function (this: { apiBase: string }, url: string) {
    this.apiBase = url;
    const res = await fetch(`${url}/health`);
    assert.strictEqual(res.status, 200, `API health check failed at ${url}/health`);
  }
);

When(
  "I send a GET request to {string}",
  async function (
    this: { apiBase: string; lastResponse: Response | null; lastBody: unknown },
    path: string
  ) {
    this.lastResponse = await fetch(`${this.apiBase}${path}`);
    this.lastBody = await this.lastResponse.json();
  }
);

Then(
  "the response status should be {int}",
  function (this: { lastResponse: Response | null }, expectedStatus: number) {
    assert.ok(this.lastResponse, "No response was recorded — did you call a When step?");
    assert.strictEqual(
      this.lastResponse.status,
      expectedStatus,
      `Expected HTTP ${expectedStatus} but got ${this.lastResponse.status}`
    );
  }
);

// ════════════════════════════════════════════════════════════════════════════
// TODO (Step 6): Add more steps here as you expand the .feature file
// ════════════════════════════════════════════════════════════════════════════

// TODO: When("I send a POST request to {string} with:", async function(path, dataTable) { ... });
// TODO: Then("the response should contain an idea with title {string}", function(title) { ... });
// TODO: Then("the response should contain an array of ideas", function() { ... });
// TODO: Then("the response should contain an error mentioning {string}", function(keyword) { ... });
// TODO: Given("an idea exists with title {string}", async function(title) { ... });
// TODO: When("I delete the idea by its ID", async function() { ... });
// TODO: Then("the idea should no longer exist in the API", async function() { ... });
