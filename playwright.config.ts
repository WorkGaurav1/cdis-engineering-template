import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end suite: drives the real front-end (built, served via `vite
 * preview` — not the dev server, so this exercises what actually ships)
 * against the real back-end and a real MySQL database.
 *
 * Prerequisite, same as the backend's integration tests: MySQL must
 * already be running (`docker compose up -d mysql` from the repo
 * root) — this config starts the app processes, not the database.
 *
 * Local repeat runs: `reuseExistingServer` keeps the same backend
 * process across runs (fast iteration), which also means its in-memory
 * rate limiter's counters persist — running the suite many times in a
 * short window can trip the global 100-req/15min limit and make login
 * appear to hang. Not a bug; restart the backend (or wait out the
 * window) if that happens. CI always starts fresh, so it never hits this.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  timeout: 30_000,

  use: {
    baseURL: "http://localhost:5173",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: [
    {
      command: "npm run start",
      cwd: "back-end",
      url: "http://localhost:4000/health",
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
    },
    {
      command: "npm run preview -- --port 5173 --strictPort",
      cwd: "front-end",
      url: "http://localhost:5173",
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
    },
  ],
});
