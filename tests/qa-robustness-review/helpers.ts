import { expect, type Page, type TestInfo } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";

export const APP_ROUTES = [
  "/",
  "/audio",
  "/practice",
  "/typing",
  "/how-to-use",
  "/dictionary",
  "/about",
  "/morse-code-encoder",
  "/morse-code-decoder",
  "/the-quick-brown-fox-morse-code",
  "/morse-code-word-separator",
  "/morse-code-words",
  "/morse-code-alphabet",
  "/morse-code-printable-chart",
  "/morse-code-international-translator",
  "/morse-code-sos",
  "/morse-code-sentence-practice",
  "/learn-morse-code",
  "/morse-code-timing",
  "/farnsworth-timing",
  "/morse-code-word-trainer",
  "/sources",
  "/morse-code-prosigns",
  "/morse-code-q-codes",
  "/morse-code-punctuation",
  "/morse-code-practice-plan",
  "/international-morse-code-reference",
  "/morse-code-audio-practice",
  "/morse-code-word-search-builder",
  "/morse-code-visual-practice",
  "/morse-code-audio-quiz",
  "/morse-code-visual-quiz",
  "/morse-code-vidual-quiz",
  "/morse-code-sound-generator",
  "/morse-code-translator",
  "/morse-code-audio-generator",
  "/name-to-morse-code",
  "/morse-code-numbers",
  "/how-to-read-morse-code",
  "/how-to-write-in-morse-code",
  "/how-to-type-in-morse-code",
  "/copy-and-paste-morse-code",
  "/morse-code-without-spaces",
  "/i-love-you-in-morse-code",
  "/cq-in-morse-code",
  "/question-mark-in-morse-code",
  "/at-sign-in-morse-code",
  "/sitemap",
  "/misc",
  "/misc/cookies-policy",
  "/misc/privacy-policy",
  "/misc/socials",
  "/misc/terms-of-service",
];

export async function blockExternalNetwork(page: Page) {
  await page.route("**/*", (route) => {
    const url = new URL(route.request().url());
    const isLocal =
      url.hostname === "localhost" ||
      url.hostname === "127.0.0.1" ||
      url.hostname === "::1";
    if (!isLocal && (url.protocol === "http:" || url.protocol === "https:")) {
      return route.abort("blockedbyclient");
    }
    return route.continue();
  });
}

export function collectConsoleErrors(page: Page) {
  const entries: Array<{ type: string; text: string; url: string }> = [];
  page.on("console", (message) => {
    if (["error", "warning"].includes(message.type())) {
      entries.push({
        type: message.type(),
        text: message.text(),
        url: page.url(),
      });
    }
  });
  page.on("pageerror", (error) => {
    entries.push({
      type: "pageerror",
      text: error.message,
      url: page.url(),
    });
  });
  return entries;
}

export async function writeArtifact(testInfo: TestInfo, relativeName: string, data: unknown) {
  const parsedName = path.parse(relativeName);
  const projectName = testInfo.project.name.replace(/[^a-z0-9-]+/gi, "-");
  const filePath = path.join(
    "test-artifacts",
    "qa-robustness-review",
    "logs",
    `${parsedName.name}-${projectName}${parsedName.ext}`,
  );
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, typeof data === "string" ? data : JSON.stringify(data, null, 2));
  await testInfo.attach(relativeName, {
    path: filePath,
    contentType: relativeName.endsWith(".json") ? "application/json" : "text/plain",
  });
}

export async function expectNoVisiblePrematureWarning(page: Page) {
  await expect(
    page.getByText("Strobe warning:", { exact: false }).filter({ visible: true }),
  ).toHaveCount(0);
}
