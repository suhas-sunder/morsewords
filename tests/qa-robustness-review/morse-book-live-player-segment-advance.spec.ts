import { expect, test, type Page } from "@playwright/test";

import { blockExternalNetwork, gotoRoute } from "./helpers";

const THE_CALL_OF_CTHULHU_BOOK_ROUTE =
  "/morse-code-books/the-call-of-cthulhu";
const THE_CALL_OF_CTHULHU_AUDIOBOOK_ROUTE =
  "/morse-code-audiobooks/the-call-of-cthulhu";
const RODERICK_RANDOM_BOOK_ROUTE =
  "/morse-code-books/the-adventures-of-roderick-random";
const BOOK_WORKSPACE_TIMEOUT_MS = 90_000;

type LivePlaybackCompletionToken = {
  sessionId: number;
  sectionId: string;
  segmentIndex: number;
  durationMs: number;
};

type LivePlayerState = {
  bookSlug: string;
  sectionId: string;
  sectionIndex: number;
  sectionCount: number;
  segmentIndex: number;
  segmentCount: number;
  sessionId: number;
  completedSessionId: number | null;
  playing: boolean;
  progressRestored: boolean;
};

type BookLivePlayerTestHook = {
  getState: () => LivePlayerState;
  captureCompletion: () => LivePlaybackCompletionToken;
  completeCapturedSegment: (token: LivePlaybackCompletionToken) => boolean;
  completeCurrentSegment: () => boolean;
  completeCurrentSegmentTwice: () => { first: boolean; second: boolean };
  selectSegment: (segmentIndex: number) => void;
  nextSection: () => void;
};

test.setTimeout(90_000);

test("The Call of Cthulhu live player advances 1 -> 2 -> 3 without skipping", async ({
  page,
}) => {
  await openBookRoute(page, THE_CALL_OF_CTHULHU_BOOK_ROUTE);
  const initialState = await getLivePlayerState(page);
  expect(initialState.segmentIndex).toBe(0);
  expect(initialState.segmentCount).toBeGreaterThan(3);

  await expectSingleSegmentAdvance(page, 1);
  await expectSingleSegmentAdvance(page, 2);
});

test("another long book live player advances exactly one segment", async ({
  page,
}) => {
  await openBookRoute(page, RODERICK_RANDOM_BOOK_ROUTE);
  const initialState = await getLivePlayerState(page);
  expect(initialState.segmentIndex).toBe(0);
  expect(initialState.segmentCount).toBeGreaterThan(1);

  await expectSingleSegmentAdvance(page, 1);
});

test("stale segment completion is ignored after the user changes segments", async ({
  page,
}) => {
  await openBookRoute(page, THE_CALL_OF_CTHULHU_BOOK_ROUTE);
  const staleCompletion = await captureCompletion(page);

  await selectLiveSegment(page, 1);
  await expectSegmentIndex(page, 1);
  await expect(completeCapturedSegment(page, staleCompletion)).resolves.toBe(false);
  await expectSegmentIndex(page, 1);

  await expectSingleSegmentAdvance(page, 2);
});

test("manual audiobook next section is not followed by stale auto-advance", async ({
  page,
}) => {
  await openBookRoute(page, THE_CALL_OF_CTHULHU_AUDIOBOOK_ROUTE);
  const initialState = await getLivePlayerState(page);
  expect(initialState.sectionIndex).toBe(0);
  expect(initialState.sectionCount).toBeGreaterThan(1);

  const staleCompletion = await captureCompletion(page);
  await nextLiveSection(page);
  await expectSectionIndex(page, 1);

  await expect(completeCapturedSegment(page, staleCompletion)).resolves.toBe(false);
  await expectSectionIndex(page, 1);
  await expectSegmentIndex(page, 0);
});

async function openBookRoute(page: Page, route: string) {
  await blockExternalNetwork(page);
  const response = await gotoRoute(page, route);
  expect(response?.ok()).toBe(true);
  const pageRoot = page.locator("[data-mw-morse-book-page]");
  await expect(pageRoot).toHaveAttribute(
    "data-mw-morse-book-full-loading",
    "false",
    { timeout: BOOK_WORKSPACE_TIMEOUT_MS },
  );
  await expect(pageRoot).toHaveAttribute(
    "data-mw-morse-book-settings-restored",
    "true",
    { timeout: BOOK_WORKSPACE_TIMEOUT_MS },
  );
  await page.waitForFunction(
    () =>
      Boolean(
        (
          window as typeof window & {
            __MORSEWORDS_BOOK_LIVE_PLAYER_TEST__?: BookLivePlayerTestHook;
          }
        ).__MORSEWORDS_BOOK_LIVE_PLAYER_TEST__,
      ),
    undefined,
    { timeout: 30_000 },
  );
  await expect
    .poll(async () => (await getLivePlayerState(page)).progressRestored)
    .toBe(true);
  await expect(page.getByTestId("morse-book-live-player")).toBeVisible();
}

async function expectSingleSegmentAdvance(page: Page, expectedSegmentIndex: number) {
  await expect(completeCurrentSegmentTwice(page)).resolves.toEqual({
    first: true,
    second: false,
  });
  await expectSegmentIndex(page, expectedSegmentIndex);
}

async function getLivePlayerState(page: Page) {
  return page.evaluate(() => {
    const hook = (
      window as typeof window & {
        __MORSEWORDS_BOOK_LIVE_PLAYER_TEST__?: BookLivePlayerTestHook;
      }
    ).__MORSEWORDS_BOOK_LIVE_PLAYER_TEST__;
    if (!hook) throw new Error("Book live player test hook is unavailable.");
    return hook.getState();
  });
}

async function captureCompletion(page: Page) {
  return page.evaluate(() => {
    const hook = (
      window as typeof window & {
        __MORSEWORDS_BOOK_LIVE_PLAYER_TEST__?: BookLivePlayerTestHook;
      }
    ).__MORSEWORDS_BOOK_LIVE_PLAYER_TEST__;
    if (!hook) throw new Error("Book live player test hook is unavailable.");
    return hook.captureCompletion();
  });
}

async function completeCapturedSegment(
  page: Page,
  completion: LivePlaybackCompletionToken,
) {
  return page.evaluate((token) => {
    const hook = (
      window as typeof window & {
        __MORSEWORDS_BOOK_LIVE_PLAYER_TEST__?: BookLivePlayerTestHook;
      }
    ).__MORSEWORDS_BOOK_LIVE_PLAYER_TEST__;
    if (!hook) throw new Error("Book live player test hook is unavailable.");
    return hook.completeCapturedSegment(token);
  }, completion);
}

async function completeCurrentSegmentTwice(page: Page) {
  return page.evaluate(() => {
    const hook = (
      window as typeof window & {
        __MORSEWORDS_BOOK_LIVE_PLAYER_TEST__?: BookLivePlayerTestHook;
      }
    ).__MORSEWORDS_BOOK_LIVE_PLAYER_TEST__;
    if (!hook) throw new Error("Book live player test hook is unavailable.");
    return hook.completeCurrentSegmentTwice();
  });
}

async function selectLiveSegment(page: Page, segmentIndex: number) {
  await page.evaluate((index) => {
    const hook = (
      window as typeof window & {
        __MORSEWORDS_BOOK_LIVE_PLAYER_TEST__?: BookLivePlayerTestHook;
      }
    ).__MORSEWORDS_BOOK_LIVE_PLAYER_TEST__;
    if (!hook) throw new Error("Book live player test hook is unavailable.");
    hook.selectSegment(index);
  }, segmentIndex);
}

async function nextLiveSection(page: Page) {
  await page.evaluate(() => {
    const hook = (
      window as typeof window & {
        __MORSEWORDS_BOOK_LIVE_PLAYER_TEST__?: BookLivePlayerTestHook;
      }
    ).__MORSEWORDS_BOOK_LIVE_PLAYER_TEST__;
    if (!hook) throw new Error("Book live player test hook is unavailable.");
    hook.nextSection();
  });
}

async function expectSegmentIndex(page: Page, expectedSegmentIndex: number) {
  await expect
    .poll(async () => (await getLivePlayerState(page)).segmentIndex)
    .toBe(expectedSegmentIndex);
}

async function expectSectionIndex(page: Page, expectedSectionIndex: number) {
  await expect
    .poll(async () => (await getLivePlayerState(page)).sectionIndex)
    .toBe(expectedSectionIndex);
}
