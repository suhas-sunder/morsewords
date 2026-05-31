export type ActionOutputResult = {
  ok: boolean;
  message: string;
};

const COPY_SUCCESS_MESSAGE = "Copied to clipboard.";
const COPY_EMPTY_MESSAGE = "Nothing to copy yet.";
const COPY_BLOCKED_MESSAGE =
  "Clipboard access was blocked. Select the text and copy it manually.";
const DOWNLOAD_EMPTY_MESSAGE = "There is nothing to download yet.";
const DOWNLOAD_UNAVAILABLE_MESSAGE =
  "Downloads are not available in this browser context.";
const DOWNLOAD_STARTED_MESSAGE = "Download started.";
const PRINT_EMPTY_MESSAGE = "There is nothing to print yet.";
const PRINT_BLOCKED_MESSAGE =
  "The print window was blocked. Allow popups for this page, then try again.";
const PRINT_STARTED_MESSAGE = "Print dialog opened.";

export function canUseClipboard(): boolean {
  return (
    typeof navigator !== "undefined" &&
    typeof navigator.clipboard?.writeText === "function"
  );
}

export function isBlankOutput(value: string | null | undefined): boolean {
  return value === null || value === undefined || value.trim().length === 0;
}

export async function copyTextToClipboard(
  text: string,
): Promise<ActionOutputResult> {
  if (isBlankOutput(text)) {
    return { ok: false, message: COPY_EMPTY_MESSAGE };
  }

  if (canUseClipboard()) {
    try {
      await navigator.clipboard.writeText(text);
      return { ok: true, message: COPY_SUCCESS_MESSAGE };
    } catch {
      // Fall through to the legacy selection fallback.
    }
  }

  if (copyTextWithHiddenTextarea(text)) {
    return { ok: true, message: COPY_SUCCESS_MESSAGE };
  }

  return { ok: false, message: COPY_BLOCKED_MESSAGE };
}

export function downloadTextFile({
  filename,
  content,
  mimeType = "text/plain;charset=utf-8",
}: {
  filename: string;
  content: string;
  mimeType?: string;
}): ActionOutputResult {
  if (isBlankOutput(content)) {
    return { ok: false, message: DOWNLOAD_EMPTY_MESSAGE };
  }

  if (typeof Blob === "undefined") {
    return { ok: false, message: DOWNLOAD_UNAVAILABLE_MESSAGE };
  }

  return downloadBlobFile({
    filename,
    blob: new Blob([content], { type: mimeType }),
  });
}

export function downloadBlobFile({
  filename,
  blob,
}: {
  filename: string;
  blob: Blob;
}): ActionOutputResult {
  if (blob.size === 0) {
    return { ok: false, message: DOWNLOAD_EMPTY_MESSAGE };
  }

  if (
    typeof document === "undefined" ||
    typeof URL === "undefined" ||
    typeof URL.createObjectURL !== "function" ||
    typeof URL.revokeObjectURL !== "function"
  ) {
    return { ok: false, message: DOWNLOAD_UNAVAILABLE_MESSAGE };
  }

  const safeFilename = sanitizeDownloadFilename(filename, "morsewords-download");
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = safeFilename;
  anchor.rel = "noopener";
  anchor.style.display = "none";

  try {
    document.body.appendChild(anchor);
    anchor.click();
    return { ok: true, message: DOWNLOAD_STARTED_MESSAGE };
  } catch {
    return {
      ok: false,
      message: "Download could not start. Try again from the page controls.",
    };
  } finally {
    anchor.remove();
    scheduleObjectUrlRevoke(url);
  }
}

export function openPrintWindow({
  title,
  html,
}: {
  title: string;
  html: string;
}): ActionOutputResult {
  if (isBlankOutput(html)) {
    return { ok: false, message: PRINT_EMPTY_MESSAGE };
  }

  if (typeof window === "undefined") {
    return {
      ok: false,
      message: "Printing is not available in this browser context.",
    };
  }

  const printWindow = window.open("", "_blank", "noopener,noreferrer");
  if (!printWindow) {
    return { ok: false, message: PRINT_BLOCKED_MESSAGE };
  }

  try {
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.document.title = title;
    printWindow.focus();
    printWindow.print();
    return { ok: true, message: PRINT_STARTED_MESSAGE };
  } catch {
    try {
      printWindow.close();
    } catch {
      // Nothing else to recover here.
    }
    return {
      ok: false,
      message: "Print could not start in this browser. Try again from the page controls.",
    };
  }
}

export function sanitizeDownloadFilename(
  filename: string,
  fallback: string,
): string {
  const safeFallback = normalizeFilename(fallback) || "morsewords-download";
  const normalized = normalizeFilename(filename);

  return normalized || safeFallback;
}

function normalizeFilename(filename: string): string {
  return filename
    .trim()
    .replace(/[\u0000-\u001f\u007f]+/g, "")
    .replace(/[<>:"/\\|?*]+/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[.\-\s]+/g, "")
    .replace(/[.\-\s]+$/g, "")
    .slice(0, 120);
}

function copyTextWithHiddenTextarea(value: string): boolean {
  if (
    typeof document === "undefined" ||
    typeof document.execCommand !== "function"
  ) {
    return false;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "0";
  textarea.style.left = "0";
  textarea.style.opacity = "0";

  try {
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    textarea.remove();
  }
}

function scheduleObjectUrlRevoke(url: string) {
  const revoke = () => URL.revokeObjectURL(url);

  if (typeof window !== "undefined" && typeof window.setTimeout === "function") {
    window.setTimeout(revoke, 1000);
    return;
  }

  revoke();
}
