import { expect, type Page, type TestInfo } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";

export const APP_ROUTES = [
  "/",
  "/audio",
  "/morse-code-audio-decoder",
  "/practice",
  "/typing",
  "/how-to-use",
  "/dictionary",
  "/about",
  "/morse-code-encoder",
  "/morse-code-decoder",
  "/morse-code-reader",
  "/the-quick-brown-fox-morse-code",
  "/morse-code-word-separator",
  "/morse-code-words",
  "/morse-code-chart",
  "/morse-code-alphabet",
  "/morse-code-letters",
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
  "/morse-code-test",
  "/international-morse-code-reference",
  "/morse-code-audio-practice",
  "/morse-code-word-search-builder",
  "/morse-code-visual-practice",
  "/morse-code-audio-quiz",
  "/morse-code-visual-quiz",
  "/morse-code-vidual-quiz",
  "/morse-code-sound-generator",
  "/morse-code-mp3-generator",
  "/morse-code-translator",
  "/morse-code-dictionary",
  "/morse-code-word-game",
  "/morse-code-audio-generator",
  "/text-to-morse-code",
  "/morse-to-text",
  "/audio-to-morse-code",
  "/morse-code-audio-to-text",
  "/morse-code-sound-to-text",
  "/morse-code-from-audio",
  "/translate-morse-code-audio",
  "/real-time-morse-code-decoder",
  "/mp3-morse-code-decoder",
  "/wav-morse-code-decoder",
  "/international-morse-code-chart",
  "/morse-code-chart-a-z-0-9",
  "/morse-code-alphabet-chart",
  "/morse-code-practice-test",
  "/morse-code-listening-test",
  "/morse-code-typing-test",
  "/morse-code-speed-test",
  "/morse-type-test",
  "/morse-code-tests",
  "/morse-code-test-online",
  "/morse-reader",
  "/read-morse-code",
  "/morse-to-english",
  "/morse-code-to-english",
  "/text-to-morse-code-mp3",
  "/morse-to-mp3",
  "/morse-code-to-mp3",
  "/text-to-morse-mp3",
  "/morse-code-translator-audio-mp3",
  "/name-to-morse-code",
  "/morse-code-numbers",
  "/how-to-read-morse-code",
  "/how-to-write-in-morse-code",
  "/how-to-type-in-morse-code",
  "/copy-and-paste-morse-code",
  "/morse-code-without-spaces",
  "/how-to-separate-words-in-morse-code",
  "/i-love-you-in-morse-code",
  "/cq-in-morse-code",
  "/hello-in-morse-code",
  "/hi-in-morse-code",
  "/help-in-morse-code",
  "/help-me-in-morse-code",
  "/yes-in-morse-code",
  "/no-in-morse-code",
  "/ok-in-morse-code",
  "/sorry-in-morse-code",
  "/love-in-morse-code",
  "/hello-world-in-morse-code",
  "/test-in-morse-code",
  "/question-mark-in-morse-code",
  "/at-sign-in-morse-code",
  "/space-in-morse-code",
  "/slash-in-morse-code",
  "/period-in-morse-code",
  "/comma-in-morse-code",
  "/exclamation-mark-in-morse-code",
  "/apostrophe-in-morse-code",
  "/hyphen-in-morse-code",
  "/contact",
  "/a-in-morse-code",
  "/b-in-morse-code",
  "/c-in-morse-code",
  "/d-in-morse-code",
  "/e-in-morse-code",
  "/f-in-morse-code",
  "/g-in-morse-code",
  "/h-in-morse-code",
  "/i-in-morse-code",
  "/j-in-morse-code",
  "/k-in-morse-code",
  "/l-in-morse-code",
  "/m-in-morse-code",
  "/n-in-morse-code",
  "/o-in-morse-code",
  "/p-in-morse-code",
  "/q-in-morse-code",
  "/r-in-morse-code",
  "/s-in-morse-code",
  "/t-in-morse-code",
  "/u-in-morse-code",
  "/v-in-morse-code",
  "/w-in-morse-code",
  "/x-in-morse-code",
  "/y-in-morse-code",
  "/z-in-morse-code",
  "/0-in-morse-code",
  "/1-in-morse-code",
  "/2-in-morse-code",
  "/3-in-morse-code",
  "/4-in-morse-code",
  "/5-in-morse-code",
  "/6-in-morse-code",
  "/7-in-morse-code",
  "/8-in-morse-code",
  "/9-in-morse-code",
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
