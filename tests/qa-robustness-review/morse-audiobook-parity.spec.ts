import { expect, test, type Page } from "@playwright/test";

import { blockExternalNetwork, waitForRouteReady } from "./helpers";

const AUDIOBOOK_PATH = "/morse-code-audiobooks/alices-adventures-in-wonderland";

async function openAudiobook(page: Page) {
  await blockExternalNetwork(page);
  const response = await page.goto(AUDIOBOOK_PATH, {
    waitUntil: "domcontentloaded",
  });
  await waitForAudiobookReady(page);
  expect(response?.ok()).toBe(true);
}

async function waitForAudiobookReady(page: Page) {
  await waitForRouteReady(page);

  const workspace = page.locator("[data-mw-morse-book-page]");
  await expect(workspace).toHaveAttribute(
    "data-mw-morse-book-page-mode",
    "audiobook",
  );
  await expect(workspace).toHaveAttribute(
    "data-mw-morse-book-full-loading",
    "false",
    { timeout: 90_000 },
  );
  await expect(workspace).toHaveAttribute(
    "data-mw-morse-book-settings-restored",
    "true",
  );
  await expect(page.locator("[data-mw-morse-book-loading-sections]")).toHaveCount(
    0,
    { timeout: 90_000 },
  );
}

function selectedSectionIds(value: string | null) {
  return (value ?? "").split(",").filter(Boolean);
}

test.describe("audiobook detail parity", () => {
  test("uses readable-section selection with audio-only playback controls", async ({
    page,
  }) => {
    await openAudiobook(page);

    const selectionChooser = page.getByTestId("morse-audiobook-section-chooser");
    const source = page.locator(
      "[data-mw-morse-book-translator-source-sections]",
    );
    const readableDefaults = page.locator(
      "[data-mw-morse-book-select-all-default]",
    );

    await expect(selectionChooser).toBeVisible();
    await expect(selectionChooser.getByText("Chapters and sections")).toBeVisible();
    await expect(readableDefaults).toBeChecked();

    const initialSelection = await source.getAttribute(
      "data-mw-morse-book-translator-source-sections",
    );
    expect(selectedSectionIds(initialSelection).length).toBeGreaterThan(1);

    const audioPlayer = page.getByTestId("morse-book-live-player");
    await expect(audioPlayer).toBeVisible();
    await expect(
      audioPlayer.getByRole("button", { name: "Play selection" }),
    ).toBeVisible();
    await expect(
      audioPlayer.getByTestId("book-video-preview-workflow"),
    ).not.toBeVisible();
    await expect(
      audioPlayer.getByTestId("morse-book-live-section-select"),
    ).not.toBeVisible();

    await selectionChooser.getByRole("button", { name: "Clear selection" }).click();
    await expect(source).toHaveAttribute(
      "data-mw-morse-book-translator-source-sections",
      "",
    );
    await expect(
      page.getByTestId("morse-audiobook-export-plan").getByRole("button", {
        name: /Download MP3|Download MP3 parts|Download ZIP/,
      }),
    ).toBeDisabled();

    await readableDefaults.check();
    await expect(source).toHaveAttribute(
      "data-mw-morse-book-translator-source-sections",
      initialSelection ?? "",
    );

    await selectionChooser.getByRole("button", { name: "Select all" }).click();
    await expect
      .poll(async () =>
        selectedSectionIds(
          await source.getAttribute(
            "data-mw-morse-book-translator-source-sections",
          ),
        ).length,
      )
      .toBeGreaterThan(selectedSectionIds(initialSelection).length);
  });

  test("provides local audio actions and the existing multipart export controls", async ({
    page,
  }) => {
    await openAudiobook(page);

    await expect(
      page.getByTestId("morse-audiobook-play-selection-link"),
    ).toHaveAttribute("href", "#morse-audiobook-player");
    await expect(
      page.getByTestId("morse-audiobook-download-audio-link"),
    ).toHaveAttribute("href", "#book-mp3-download");
    await expect(
      page.getByTestId("morse-audiobook-equivalent-book-link"),
    ).toHaveAttribute("href", "/morse-code-books/alices-adventures-in-wonderland");
    await expect(page.getByTestId("morse-book-mp3-download-link")).toHaveAttribute(
      "href",
      "#book-mp3-download",
    );
    await expect(page.getByTestId("morse-book-rights-basis")).toHaveText(
      "Rights basis recorded in this book manifest: public domain in the United States.",
    );
    const exportPlan = page.getByTestId("morse-audiobook-export-plan");
    await expect(exportPlan).toBeVisible();
    await expect(exportPlan.getByText("Download audio", { exact: true })).toBeVisible();
    await expect(exportPlan.getByText("Export plan", { exact: true })).toBeVisible();
    await expect(exportPlan.getByText("Selection duration", { exact: true })).toBeVisible();
    await expect(exportPlan.getByText("Audio settings", { exact: true })).toBeVisible();
    await expect(
      exportPlan.getByRole("button", {
        name: /Download MP3|Download MP3 parts|Download ZIP/,
      }),
    ).toBeEnabled();

    await expect(page.getByText("Download MP4", { exact: true })).toHaveCount(0);
    await expect(page.getByText("Download WebM", { exact: true })).toHaveCount(0);
  });

  test("migrates legacy single-section audiobook scopes without losing current custom scopes", async ({
    page,
  }) => {
    await openAudiobook(page);

    const source = page.locator(
      "[data-mw-morse-book-translator-source-sections]",
    );
    const defaultIds = selectedSectionIds(
      await source.getAttribute("data-mw-morse-book-translator-source-sections"),
    );
    expect(defaultIds.length).toBeGreaterThan(1);

    await expect
      .poll(async () =>
        page.evaluate(() => {
          const key = Object.keys(localStorage).find((storageKey) =>
            storageKey.startsWith(
              "morsewords:book-runtime:settings:v1:alices-adventures-in-wonderland:",
            ),
          );
          const raw = key ? localStorage.getItem(key) : null;
          return key && raw ? { key, value: JSON.parse(raw) } : null;
        }),
      )
      .not.toBeNull();

    const legacyRuntimeSettings = await page.evaluate(() => {
      const key = Object.keys(localStorage).find((storageKey) =>
        storageKey.startsWith(
          "morsewords:book-runtime:settings:v1:alices-adventures-in-wonderland:",
        ),
      );
      if (!key) return null;
      const raw = localStorage.getItem(key);
      return raw ? { key, value: JSON.parse(raw) } : null;
    });
    expect(legacyRuntimeSettings).not.toBeNull();

    await page.evaluate(
      ({ defaultSectionId, runtime }) => {
        if (!runtime) return;
        const legacy = runtime.value as Record<string, unknown>;
        legacy.selectionMode = "custom";
        delete legacy.selectionScopeVersion;
        legacy.selectedSectionIds = [defaultSectionId];
        localStorage.setItem(runtime.key, JSON.stringify(legacy));
      },
      {
        defaultSectionId: defaultIds[0],
        runtime: legacyRuntimeSettings,
      },
    );

    await page.reload({ waitUntil: "domcontentloaded" });
    await waitForAudiobookReady(page);
    await expect(source).toHaveAttribute(
      "data-mw-morse-book-translator-source-sections",
      defaultIds.join(","),
    );

    const customSectionId = defaultIds[1];
    await page.evaluate(
      ({ customSectionId }) => {
        const key = Object.keys(localStorage).find((storageKey) =>
          storageKey.startsWith(
            "morsewords:book-runtime:settings:v1:alices-adventures-in-wonderland:",
          ),
        );
        if (!key) return;
        const raw = localStorage.getItem(key);
        if (!raw) return;
        const current = JSON.parse(raw) as Record<string, unknown>;
        current.selectionMode = "custom";
        current.selectionScopeVersion = 2;
        current.selectedSectionIds = [customSectionId];
        localStorage.setItem(key, JSON.stringify(current));
      },
      { customSectionId },
    );

    await page.reload({ waitUntil: "domcontentloaded" });
    await waitForAudiobookReady(page);
    await expect(source).toHaveAttribute(
      "data-mw-morse-book-translator-source-sections",
      customSectionId,
    );
  });
});
