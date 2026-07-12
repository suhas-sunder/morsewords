import { downloadBlobFile } from "~/client/components/shared/actionOutputUtils";

const MIN_EXPORT_WIDTH = 816;
const PREFERRED_PIXEL_RATIO = 2;
const MAX_EXPORT_PIXELS = 24_000_000;

export function languageStudySheetFilename(slug: string) {
  return `${slug}-morse-code-language-sheet.png`;
}

export async function saveLanguageStudySheetImage({
  sheet,
  slug,
}: {
  sheet: HTMLElement;
  slug: string;
}) {
  const exportCopy = await createLanguageStudySheetCopy(sheet, "image");

  try {
    const { toBlob } = await import("html-to-image");
    const bounds = exportCopy.getBoundingClientRect();
    const width = Math.ceil(Math.max(exportCopy.scrollWidth, bounds.width));
    const height = Math.ceil(Math.max(exportCopy.scrollHeight, bounds.height));
    const blob = await toBlob(exportCopy, {
      backgroundColor: "#ffffff",
      cacheBust: false,
      height,
      pixelRatio: getLanguageStudySheetPixelRatio(width, height),
      width,
    });

    if (!blob || blob.size === 0) {
      throw new Error("The sheet image could not be created.");
    }

    const result = downloadBlobFile({
      blob,
      filename: languageStudySheetFilename(slug),
    });
    if (!result.ok) throw new Error(result.message);
  } finally {
    exportCopy.parentElement?.remove();
  }
}

export async function createLanguageStudySheetPrintRoot(sheet: HTMLElement) {
  const exportCopy = await createLanguageStudySheetCopy(sheet, "print");
  const root = exportCopy.parentElement;

  if (!root) {
    throw new Error("The sheet could not be prepared for printing.");
  }

  root.classList.add("mw-language-sheet-print-root");
  root.removeAttribute("aria-hidden");
  root.removeAttribute("inert");
  exportCopy.removeAttribute("aria-hidden");

  return () => root.remove();
}

export async function waitForLanguageStudySheetReady(sheet: HTMLElement) {
  if (typeof document === "undefined") return;

  if ("fonts" in document) {
    await document.fonts.ready;
  }

  await waitForImages(sheet);
  await waitForAnimationFrames();
}

export function getLanguageStudySheetPixelRatio(width: number, height: number) {
  if (width <= 0 || height <= 0) return 1;
  return Math.max(
    1,
    Math.min(PREFERRED_PIXEL_RATIO, Math.sqrt(MAX_EXPORT_PIXELS / (width * height))),
  );
}

async function createLanguageStudySheetCopy(
  sheet: HTMLElement,
  kind: "image" | "print",
) {
  await waitForLanguageStudySheetReady(sheet);

  const root = document.createElement("div");
  root.className = `mw-language-sheet-export-root mw-language-sheet-export-root-${kind}`;
  root.setAttribute("aria-hidden", "true");
  root.setAttribute("inert", "");
  root.style.left = "-100000px";
  root.style.pointerEvents = "none";
  root.style.position = "fixed";
  root.style.top = "0";
  root.style.width = `${getLanguageStudySheetExportWidth(sheet)}px`;
  root.style.zIndex = "-1";

  const copy = sheet.cloneNode(true) as HTMLElement;
  copy.classList.add("mw-language-sheet-export-copy");
  copy.removeAttribute("data-testid");
  copy.style.margin = "0";
  copy.style.maxWidth = "none";
  copy.style.width = "100%";

  root.append(copy);
  document.body.append(root);
  await waitForLanguageStudySheetReady(copy);

  return copy;
}

function getLanguageStudySheetExportWidth(sheet: HTMLElement) {
  const bounds = sheet.getBoundingClientRect();
  return Math.ceil(Math.max(MIN_EXPORT_WIDTH, sheet.scrollWidth, bounds.width));
}

async function waitForImages(sheet: HTMLElement) {
  const images = Array.from(sheet.querySelectorAll("img"));

  await Promise.all(
    images.map(async (image) => {
      if (!image.complete) {
        await new Promise<void>((resolve, reject) => {
          image.addEventListener("load", () => resolve(), { once: true });
          image.addEventListener(
            "error",
            () => reject(new Error("A sheet image did not load.")),
            { once: true },
          );
        });
      }

      if (typeof image.decode === "function") {
        await image.decode().catch(() => undefined);
      }
    }),
  );
}

function waitForAnimationFrames() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}
