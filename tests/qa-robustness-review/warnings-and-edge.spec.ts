import { expect, test } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";
import {
  blockExternalNetwork,
  expectNoVisiblePrematureWarning,
  waitForRouteReady,
} from "./helpers";

const fixtureDir = path.join("test-artifacts", "qa-robustness-review", "upload-fixtures");

async function ensureUploadFixtures() {
  await fs.mkdir(fixtureDir, { recursive: true });
  await fs.writeFile(
    path.join(fixtureDir, "inert-logo.svg"),
    `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="80"><title>QA inert SVG</title><desc>&lt;script&gt;QA_CANARY&lt;/script&gt;</desc><rect width="120" height="80" fill="#e0f2fe"/><text x="8" y="45" font-size="16">QA</text></svg>`,
  );
  await fs.writeFile(path.join(fixtureDir, "fake-image.png"), "QA_NOT_AN_IMAGE");
  await fs.writeFile(path.join(fixtureDir, "oversized-logo.svg"), `<svg xmlns="http://www.w3.org/2000/svg" width="4000" height="80"><rect width="4000" height="80" fill="#fff"/></svg>`);
}

test.beforeEach(async ({ page }) => {
  await blockExternalNetwork(page);
});

test("flash/strobe warnings are hidden until the user enables flash", async ({ page }) => {
  await page.goto("/morse-code-audio-practice");
  await waitForRouteReady(page);
  await expectNoVisiblePrematureWarning(page);

  const showAdvanced = page.getByRole("button", { name: "Show advanced settings" });
  const flashButton = page.getByRole("button", { name: "Flash" });
  await expect(async () => {
    if (await showAdvanced.isVisible()) {
      await showAdvanced.click();
    }
    await expectNoVisiblePrematureWarning(page);
    await expect(flashButton).toBeVisible({ timeout: 1_000 });
  }).toPass({ timeout: 15_000 });

  const warning = page
    .getByText("Strobe warning:", { exact: false })
    .filter({ visible: true });
  await expect(async () => {
    if (!(await warning.isVisible())) {
      await flashButton.click();
    }
    await expect(warning).toBeVisible({ timeout: 1_000 });
  }).toPass({ timeout: 15_000 });
});

test("audio practice locks scoring after correct and revealed prompts", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("mw_audio_practice_difficulty", "beginner");
    Math.random = () => 0;
  });

  await page.goto("/morse-code-audio-practice");
  await waitForRouteReady(page);

  const answer = page.getByLabel("Your answer");
  const checkAnswer = page.getByRole("button", { name: "Check answer" });

  await answer.fill("A");
  await checkAnswer.click();
  await expect(page.getByText("Correct. Move to the next hidden prompt when ready.")).toBeVisible();
  await expect(page.getByText(/Streak\s*1/)).toBeVisible();
  await expect(checkAnswer).toBeDisabled();

  await page.getByRole("button", { name: "Next prompt" }).click();
  await page.getByRole("button", { name: "Reveal answer" }).click();
  await answer.fill("B");
  await expect(checkAnswer).toBeDisabled();
});

test("visual practice does not show strobe warning before first flash", async ({ page }) => {
  await page.goto("/morse-code-visual-practice");
  await waitForRouteReady(page);
  await expectNoVisiblePrematureWarning(page);

  await page.getByRole("button", { name: "Flash message" }).click();
  await expect(
    page.getByText("Strobe warning:", { exact: false }).filter({ visible: true }),
  ).toBeVisible();
});

test("printable chart content limits are hidden until content is actually omitted", async ({ page }) => {
  await page.goto("/morse-code-printable-chart");
  await waitForRouteReady(page);
  await expect(page.getByText("Content limits")).toHaveCount(0);

  const customWords = page.getByPlaceholder("RADIO, SIGNAL, CODE, MORSE");
  await expect(async () => {
    await customWords.fill("ALPHA, BRAVO, CHARLIE, DELTA, ECHO, FOXTROT, GOLF, HOTEL, INDIA, JULIET, KILO, LIMA");
    await expect(page.getByText("Content limits")).toBeVisible({
      timeout: 1_000,
    });
  }).toPass({ timeout: 15_000 });
});

test("word search reports oversized words and reveal answer changes preview", async ({ page }) => {
  await page.goto("/morse-code-word-search-builder");
  await waitForRouteReady(page);
  await page.getByLabel("Plain words").fill("MORSE\nSIGNAL\nRADIO\nTHISWORDISTOOLONGFORATENGRID");

  await expect(page.getByText("Some words are too long for the current grid and were left out.")).toBeVisible();
  await expect(page.getByText("Student preview")).toBeVisible();
  await page.getByRole("button", { name: "Reveal answer" }).click();
  await expect(page.getByText("Answered preview")).toBeVisible();
});

test("word search Generate new puzzle changes the grid", async ({ page }) => {
  await page.goto("/morse-code-word-search-builder");
  await waitForRouteReady(page);
  const grid = page.locator('[style*="grid-template-columns"]').first();
  const before = await grid.innerText();
  await page.getByRole("button", { name: "Generate new puzzle" }).click();
  const after = await grid.innerText();
  expect(after).not.toEqual(before);
});

test("printable chart accepts SVG logo upload with no visible size/dimension warning", async ({ page }) => {
  await ensureUploadFixtures();
  await page.goto("/morse-code-printable-chart");
  await waitForRouteReady(page);
  await page.locator('input[type="file"]').setInputFiles({
    name: "inert-logo.svg",
    mimeType: "image/svg+xml",
    buffer: await fs.readFile(path.join(fixtureDir, "inert-logo.svg")),
  });
  await expect(page.getByText("Logo uploaded. Brand name stays editable above.")).toBeVisible();
  await expect(page.getByText("Content limits")).toHaveCount(0);
});
