/**
 * Playwright Configuration
 * ========================
 * WHY: The playwright.config.ts file controls how Playwright runs tests.
 * Key concepts:
 *  - baseURL: The root URL for all tests (so you can write relative paths like "/")
 *  - reporter: How test results are displayed (list = simple console output)
 *  - projects: Which browsers to run tests in (we start with Chromium only)
 *  - timeout: Maximum time a single test can run before it fails
 */

import { defineConfig, devices } from "@playwright/test";

const BASE_URL    = process.env.BASE_URL    ?? "http://localhost:5173";
const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:3001";

export default defineConfig({
  // Directory where test files live
  testDir: ".",

  // Maximum time per test (30 seconds)
  timeout: 30_000,

  // Run tests in parallel (faster CI)
  fullyParallel: true,

  // Fail the build if any test.only() was accidentally committed
  forbidOnly: !!process.env.CI,

  // Retry failed tests on CI (flaky test tolerance)
  retries: process.env.CI ? 2 : 0,

  // Number of parallel workers
  workers: process.env.CI ? 1 : undefined,

  // Reporter: 'list' in CI, 'html' locally
  reporter: process.env.CI ? "list" : [["list"], ["html", { outputFolder: "playwright-report" }]],

  use: {
    // Base URL for all page.goto("/") calls
    baseURL: BASE_URL,

    // Capture screenshot on test failure
    screenshot: "only-on-failure",

    // Capture trace on retry (helps debug flaky tests)
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});

// Export so test files can reference the API URL
export { API_BASE_URL };
