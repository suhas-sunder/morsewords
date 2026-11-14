import { defineConfig } from "@playwright/test";
import base from "./playwright.config";

// Explicitly invoked review matrix; does not broaden the default smoke suite.
export default defineConfig({
  ...base,
  webServer: process.env.MW_REVIEW_BUILT_ONLY === "1" ? undefined : base.webServer,
  outputDir: "test-artifacts/review-matrix",
  reporter: [["list"], ["json", { outputFile: "test-artifacts/review-matrix-results.json" }]],
  projects: (["chromium", "webkit"] as const).flatMap(browserName =>
    (["light", "dark"] as const).map(colorScheme => ({
      name: `${browserName}-${colorScheme}`,
      use: { browserName, colorScheme, viewport: { width: 1440, height: 844 } },
    }))),
});
