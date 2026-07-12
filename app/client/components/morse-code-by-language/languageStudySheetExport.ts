import { downloadBlobFile } from "~/client/components/shared/actionOutputUtils";

const MIN_EXPORT_WIDTH = 816;
const PREFERRED_PIXEL_RATIO = 2;
const MAX_EXPORT_PIXELS = 24_000_000;
const JPEG_QUALITY = 0.92;

type ImageExtension = "jpg" | "png";

type ImageCandidate = {
  blob: Blob;
  extension: ImageExtension;
};

export function languageStudySheetFilename(slug: string, extension: ImageExtension = "png") {
  return `${slug}-morse-code-language-sheet.${extension}`;
}

export function chooseLanguageStudySheetImageCandidate({
  jpeg,
  png,
}: {
  jpeg: Blob | null;
  png: Blob | null;
}): ImageCandidate {
  if (!png || png.size === 0) {
    if (jpeg && jpeg.size > 0) return { blob: jpeg, extension: "jpg" };
    throw new Error("The sheet image could not be created.");
  }

  if (jpeg && jpeg.size > 0 && jpeg.size < png.size) {
    return { blob: jpeg, extension: "jpg" };
  }

  return { blob: png, extension: "png" };
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
    const options = getLanguageStudySheetExportOptions(exportCopy);
    const [png, jpeg] = await Promise.all([
      toBlob(exportCopy, {
        ...options,
        type: "image/png",
      }),
      toBlob(exportCopy, {
        ...options,
        quality: JPEG_QUALITY,
        type: "image/jpeg",
      }),
    ]);
    const image = chooseLanguageStudySheetImageCandidate({ jpeg, png });

    const result = downloadBlobFile({
      blob: image.blob,
      filename: languageStudySheetFilename(slug, image.extension),
    });
    if (!result.ok) throw new Error(result.message);
  } finally {
    exportCopy.parentElement?.remove();
  }
}

function getLanguageStudySheetExportOptions(exportCopy: HTMLElement) {
  const bounds = exportCopy.getBoundingClientRect();
  const width = Math.ceil(Math.max(exportCopy.scrollWidth, bounds.width));
  const height = Math.ceil(Math.max(exportCopy.scrollHeight, bounds.height));

  return {
    backgroundColor: "#ffffff",
    cacheBust: false,
    height,
    pixelRatio: getLanguageStudySheetPixelRatio(width, height),
    width,
  };
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
  normalizeLanguageStudySheetExportCopy(copy);

  root.append(copy);
  document.body.append(root);
  await waitForLanguageStudySheetReady(copy);

  return copy;
}

function getLanguageStudySheetExportWidth(sheet: HTMLElement) {
  const bounds = sheet.getBoundingClientRect();
  return Math.ceil(Math.max(MIN_EXPORT_WIDTH, sheet.scrollWidth, bounds.width));
}

function normalizeLanguageStudySheetExportCopy(copy: HTMLElement) {
  copy.style.backgroundColor = "#ffffff";
  copy.style.overflow = "visible";

  for (const element of Array.from(copy.querySelectorAll<HTMLElement>("*"))) {
    element.style.setProperty("scrollbar-width", "none");
    if (
      element.classList.contains("overflow-x-auto") ||
      element.classList.contains("mw-language-sheet-scroll")
    ) {
      element.style.overflow = "visible";
      element.style.overflowX = "visible";
      element.style.overflowY = "visible";
    }
  }
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
