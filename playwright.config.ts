import { defineConfig, devices } from "@playwright/test";

const PORT = process.env.PORT || process.env.PLAYWRIGHT_PORT || "3101";
const baseURL = `http://127.0.0.1:${PORT}`;
const artifactDir = "test-artifacts/qa-robustness-review";
const configuredWorkers = Number.parseInt(process.env.PLAYWRIGHT_WORKERS ?? "2", 10);
const workerCount =
  Number.isFinite(configuredWorkers) && configuredWorkers > 0
    ? configuredWorkers
    : 2;

export default defineConfig({
  testDir: "./tests/qa-robustness-review",
  timeout: 45_000,
  expect: { timeout: 7_500 },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: workerCount,
  reporter: [
    ["list"],
    ["json", { outputFile: `${artifactDir}/logs/playwright-results.json` }],
  ],
  outputDir: `${artifactDir}/playwright-output`,
  use: {
    baseURL,
    actionTimeout: 10_000,
    navigationTimeout: 45_000,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "desktop-chromium",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 1000 } },
    },
    {
      name: "mobile-chromium",
      use: { ...devices["Pixel 7"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: baseURL,
    reuseExistingServer: process.env.PLAYWRIGHT_REUSE_SERVER === "1",
    stdout: "pipe",
    stderr: "pipe",
    timeout: 120_000,
    env: {
      NODE_ENV: "development",
      MORSEWORDS_DISABLE_DEV_HMR: "1",
      PORT,
    },
  },
});
