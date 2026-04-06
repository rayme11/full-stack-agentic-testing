/**
 * Cucumber Step Definitions – Ideas Feature
 * ==========================================
 * WHY: Step definitions are the glue between Gherkin plain-English steps
 * and actual TypeScript code. Each "Given / When / Then" line in a
 * .feature file maps to one of these functions.
 *
 * CONCEPT: This file implements the test logic that Cucumber calls when
 * it executes each scenario. We use Node's built-in fetch API to call
 * the backend REST API.
 */

import { Given, When, Then, Before, setDefaultTimeout } from "@cucumber/cucumber";
import assert from "assert";

// Give each step up to 10 seconds (default is 5s)
setDefaultTimeout(10_000);

const API_BASE = process.env.API_BASE_URL ?? "http://localhost:3001";

// ── Shared state between steps (scoped to one scenario) ──────────────────────
// WHY: BDD scenarios have multiple steps that share state (e.g., the ID of
// a created idea). We store this in a "world" object on `this`.

interface IdeaResponse {
  id: number;
  title: string;
  description: string;
  category: string;
  created_at: string;
  updated_at: string;
}

// ── Cucumber World ────────────────────────────────────────────────────────────
// Cucumber provides `this` context (the "World") to share state between steps.
// We type-extend it here.
declare module "@cucumber/cucumber" {
  interface World {
    apiBase: string;
    lastResponse: Response | null;
    lastBody: unknown;
    createdIdeaId: number | null;
  }
}

// ── Before each scenario: reset state ────────────────────────────────────────
Before(function (this: { apiBase: string; lastResponse: Response | null; lastBody: unknown; createdIdeaId: number | null }) {
  this.apiBase = API_BASE;
  this.lastResponse = null;
  this.lastBody = null;
  this.createdIdeaId = null;
});

// ════════════════════════════════════════════════════════════════════════════════
// GIVEN steps (preconditions / setup)
// ════════════════════════════════════════════════════════════════════════════════

Given("the API is running at {string}", async function (this: { apiBase: string }, url: string) {
  this.apiBase = url;
  const res = await fetch(`${url}/health`);
  assert.strictEqual(res.status, 200, `API health check failed at ${url}/health`);
});

Given("an idea exists with title {string}", async function (
  this: { apiBase: string; createdIdeaId: number | null },
  title: string
) {
  const res = await fetch(`${this.apiBase}/api/ideas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description: "BDD test idea", category: "testing" }),
  });
  const body = await res.json() as { data: IdeaResponse };
  assert.strictEqual(res.status, 201, `Failed to create prerequisite idea: ${JSON.stringify(body)}`);
  this.createdIdeaId = body.data.id;
});

// ════════════════════════════════════════════════════════════════════════════════
// WHEN steps (actions)
// ════════════════════════════════════════════════════════════════════════════════

When(
  "I send a POST request to {string} with:",
  async function (
    this: { apiBase: string; lastResponse: Response | null; lastBody: unknown; createdIdeaId: number | null },
    path: string,
    dataTable: { rowsHash: () => Record<string, string> }
  ) {
    const data = dataTable.rowsHash();
    this.lastResponse = await fetch(`${this.apiBase}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    this.lastBody = await this.lastResponse.json();

    // If this created an idea, save its ID
    const body = this.lastBody as { data?: IdeaResponse };
    if (body.data?.id) this.createdIdeaId = body.data.id;
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

When(
  "I fetch the idea by its ID",
  async function (
    this: { apiBase: string; lastResponse: Response | null; lastBody: unknown; createdIdeaId: number | null }
  ) {
    const res = await fetch(`${this.apiBase}/api/ideas/${this.createdIdeaId}`);
    this.lastResponse = res;
    this.lastBody = await res.json();
  }
);

When(
  "I update the idea's title to {string}",
  async function (
    this: { apiBase: string; lastResponse: Response | null; lastBody: unknown; createdIdeaId: number | null },
    newTitle: string
  ) {
    this.lastResponse = await fetch(`${this.apiBase}/api/ideas/${this.createdIdeaId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle }),
    });
    this.lastBody = await this.lastResponse.json();
  }
);

When(
  "I delete the idea by its ID",
  async function (
    this: { apiBase: string; lastResponse: Response | null; lastBody: unknown; createdIdeaId: number | null }
  ) {
    this.lastResponse = await fetch(
      `${this.apiBase}/api/ideas/${this.createdIdeaId}`,
      { method: "DELETE" }
    );
    // 204 has no body
    if (this.lastResponse.status !== 204) {
      this.lastBody = await this.lastResponse.json();
    }
  }
);

// ════════════════════════════════════════════════════════════════════════════════
// THEN steps (assertions)
// ════════════════════════════════════════════════════════════════════════════════

Then(
  "the response status should be {int}",
  function (this: { lastResponse: Response | null }, expectedStatus: number) {
    assert.ok(this.lastResponse, "No response received");
    assert.strictEqual(
      this.lastResponse.status,
      expectedStatus,
      `Expected status ${expectedStatus} but got ${this.lastResponse.status}`
    );
  }
);

Then(
  "the response should contain an idea with title {string}",
  function (this: { lastBody: unknown }, expectedTitle: string) {
    const body = this.lastBody as { data: IdeaResponse };
    assert.ok(body.data, "Response body has no 'data' field");
    assert.strictEqual(body.data.title, expectedTitle);
  }
);

Then(
  "the idea should have category {string}",
  function (this: { lastBody: unknown }, expectedCategory: string) {
    const body = this.lastBody as { data: IdeaResponse };
    assert.strictEqual(body.data.category, expectedCategory);
  }
);

Then(
  "the response should contain an error mentioning {string}",
  function (this: { lastBody: unknown }, keyword: string) {
    const body = this.lastBody as { error: string };
    assert.ok(
      body.error?.toLowerCase().includes(keyword.toLowerCase()),
      `Expected error to mention "${keyword}" but got: ${body.error}`
    );
  }
);

Then(
  "the response should contain an array of ideas",
  function (this: { lastBody: unknown }) {
    const body = this.lastBody as { data: unknown[] };
    assert.ok(Array.isArray(body.data), "Expected 'data' to be an array");
  }
);

Then(
  "the response should contain the idea with title {string}",
  function (this: { lastBody: unknown }, expectedTitle: string) {
    const body = this.lastBody as { data: IdeaResponse };
    assert.strictEqual(body.data.title, expectedTitle);
  }
);

Then(
  "the idea should no longer exist in the API",
  async function (this: { apiBase: string; createdIdeaId: number | null }) {
    const res = await fetch(`${this.apiBase}/api/ideas/${this.createdIdeaId}`);
    assert.strictEqual(res.status, 404, "Expected 404 for deleted idea");
  }
);
