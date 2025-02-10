import { devices } from "@playwright/test";
import { defineConfig } from "@playwright/test";

import { loadEnvConfig } from "@next/env";

const { loadedEnvFiles } = loadEnvConfig(process.cwd());

console.log("Loaded env from", loadedEnvFiles.map((f) => f.path).join(", "));

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ? "line" : "list",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.TEST_BASE_URL,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
    // extraHTTPHeaders: {
    //   // Set this, so Next.js Server Actions don't get a 'null' Origin header
    //   Origin: process.env.TEST_BASE_URL,
    // },
  },

  /* Configure projects for major browsers */
  projects: [
    // {
    //   name: "chromium",
    //   use: { ...devices["Desktop Chrome"] },
    // },
    // {
    //   name: "firefox",
    //   use: { ...devices["Desktop Firefox"] },
    // },
    // {
    //   name: "webkit",
    //   use: { ...devices["Desktop Safari"] },
    // },
    /* Test against mobile viewports. */
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 12"] },
    },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],
  /* Run your local dev server before starting the tests */
  webServer: [
    {
      command: "pnpm yaproxy:staging",
      url: "http://localhost:5010/graphiql/", // this url must return an 20x/30x/<404 status code
      reuseExistingServer: !process.env.CI,
      timeout: 10_000,
      // stdout: "pipe",
    },
    {
      command: "pnpm dev",
      url: "http://localhost:3000/robots.txt", // this url must return an 20x/30x/<404 status code
      reuseExistingServer: !process.env.CI,
      timeout: 15_000,
      // stdout: "pipe",
    },
  ],
});
