import { expect, test, type Page } from "@playwright/test";

import {
  canUseClipboard,
  copyTextToClipboard,
  downloadBlobFile,
  downloadTextFile,
  isBlankOutput,
  openPrintWindow,
  sanitizeDownloadFilename,
} from "../../app/client/components/shared/actionOutputUtils";
import { blockExternalNetwork } from "./helpers";

const globalKeys = ["document", "navigator", "URL", "window"] as const;
const originalGlobals = new Map<
  (typeof globalKeys)[number],
  PropertyDescriptor | undefined
>();

for (const key of globalKeys) {
  originalGlobals.set(key, Object.getOwnPropertyDescriptor(globalThis, key));
}

test.afterEach(() => {
  for (const key of globalKeys) {
    const descriptor = originalGlobals.get(key);
    if (descriptor) {
      Object.defineProperty(globalThis, key, descriptor);
    } else {
      delete (globalThis as Record<string, unknown>)[key];
    }
  }
});

test.describe("action output helpers", () => {
  test("clipboard helper succeeds when the Clipboard API is available", async () => {
    const writes: string[] = [];
    setGlobal("navigator", {
      clipboard: {
        writeText: async (value: string) => {
          writes.push(value);
        },
      },
    });

    const result = await copyTextToClipboard("... --- ...");

    expect(canUseClipboard()).toBe(true);
    expect(result).toEqual({ ok: true, message: "Copied to clipboard." });
    expect(writes).toEqual(["... --- ..."]);
  });

  test("clipboard helper fails gracefully when clipboard access is rejected", async () => {
    setGlobal("navigator", {
      clipboard: {
        writeText: async () => {
          throw new Error("denied");
        },
      },
    });

    const result = await copyTextToClipboard("blocked copy");

    expect(result.ok).toBe(false);
    expect(result.message).toContain("Clipboard access was blocked");
  });

  test("blank output is rejected before clipboard or download work starts", async () => {
    expect(isBlankOutput(" \n\t ")).toBe(true);

    const copy = await copyTextToClipboard("   ");
    const download = downloadTextFile({
      filename: "empty.txt",
      content: " ",
    });

    expect(copy.ok).toBe(false);
    expect(copy.message).toBe("Nothing to copy yet.");
    expect(download.ok).toBe(false);
    expect(download.message).toBe("There is nothing to download yet.");
  });

  test("filename sanitizer removes unsafe path characters and preserves extension", () => {
    const filename = sanitizeDownloadFilename(
      "../unsafe:name?*.txt",
      "fallback.txt",
    );

    expect(filename).not.toMatch(/[<>:"/\\|?*]/);
    expect(filename.startsWith(".")).toBe(false);
    expect(filename.endsWith(".txt")).toBe(true);
  });

  test("text download helper creates and revokes an object URL", () => {
    const harness = installDownloadHarness();

    const result = downloadTextFile({
      filename: "morse result.txt",
      content: "SOS",
    });

    expect(result.ok).toBe(true);
    expect(harness.created).toHaveLength(1);
    expect(harness.revoked).toEqual(["blob:morsewords-test"]);
    expect(harness.anchors.at(-1)?.download).toBe("morse-result.txt");
  });

  test("blob download helper creates and revokes an object URL", () => {
    const harness = installDownloadHarness();

    const result = downloadBlobFile({
      filename: "morse/audio?.wav",
      blob: new Blob(["audio"], { type: "audio/wav" }),
    });

    expect(result.ok).toBe(true);
    expect(harness.created.at(-1)).toBeInstanceOf(Blob);
    expect(harness.revoked).toEqual(["blob:morsewords-test"]);
    expect(harness.anchors.at(-1)?.download.endsWith(".wav")).toBe(true);
  });

  test("print helper handles popup-blocked windows", () => {
    setGlobal("window", {
      open: () => null,
    });

    const result = openPrintWindow({
      title: "MorseWords print",
      html: "<p>Print me</p>",
    });

    expect(result.ok).toBe(false);
    expect(result.message).toContain("blocked");
  });
});

test.describe("action output route smoke", () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalNetwork(page);
  });

  test("word separator copy button shows success status", async ({ page }) => {
    await page.goto("/morse-code-word-separator", {
      waitUntil: "domcontentloaded",
    });
    await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

    await page.getByRole("button", { name: "Copy output" }).click();
    await expect(page.getByText("Copied", { exact: true })).toBeVisible();
  });

  test("MP3 download buttons stay disabled when output is empty", async ({ page }) => {
    await page.goto("/morse-code-mp3-generator", {
      waitUntil: "domcontentloaded",
    });
    await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

    await page.locator("textarea").first().fill("");
    await expect(page.getByRole("button", { name: "Download MP3" }).first()).toBeDisabled();
    await expect(page.getByRole("button", { name: "Download WAV" }).first()).toBeDisabled();
  });
});

function setGlobal(key: (typeof globalKeys)[number], value: unknown) {
  Object.defineProperty(globalThis, key, {
    configurable: true,
    writable: true,
    value,
  });
}

function installDownloadHarness() {
  const anchors: Array<{ download: string; click: () => void; remove: () => void }> = [];
  const created: unknown[] = [];
  const revoked: string[] = [];

  setGlobal("document", {
    body: {
      appendChild(element: { download: string; click: () => void; remove: () => void }) {
        anchors.push(element);
        return element;
      },
    },
    createElement(tagName: string) {
      if (tagName !== "a") {
        throw new Error(`Unexpected element: ${tagName}`);
      }

      return {
        download: "",
        href: "",
        rel: "",
        style: {},
        click() {},
        remove() {},
      };
    },
  });

  setGlobal("URL", {
    createObjectURL(value: unknown) {
      created.push(value);
      return "blob:morsewords-test";
    },
    revokeObjectURL(value: string) {
      revoked.push(value);
    },
  });

  setGlobal("window", {
    setTimeout(callback: () => void) {
      callback();
      return 0;
    },
  });

  return { anchors, created, revoked };
}
