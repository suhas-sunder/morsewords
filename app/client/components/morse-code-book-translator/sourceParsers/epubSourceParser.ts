import {
  BookSourceError,
  ensureSourceSize,
  ensureTextLength,
  type BookSourceSection,
  type ParsedBookSource,
} from "../bookSourceTypes";
import { normalizePlainText } from "../textNormalization";

type ZipEntries = Record<string, Uint8Array>;

function normalizeZipPath(path: string) {
  return path.replace(/^\/+/, "").replace(/\\/g, "/");
}

function dirname(path: string) {
  const normalized = normalizeZipPath(path);
  const lastSlash = normalized.lastIndexOf("/");
  return lastSlash >= 0 ? normalized.slice(0, lastSlash) : "";
}

function resolvePath(basePath: string, href: string) {
  const pieces = [...dirname(basePath).split("/"), ...href.split("/")].filter(
    Boolean,
  );
  const resolved: string[] = [];
  for (const piece of pieces) {
    if (piece === ".") continue;
    if (piece === "..") {
      resolved.pop();
      continue;
    }
    resolved.push(piece);
  }
  return resolved.join("/");
}

function readZipText(entries: ZipEntries, path: string, decoder: TextDecoder) {
  const normalized = normalizeZipPath(path);
  const entry =
    entries[normalized] ??
    entries[Object.keys(entries).find((key) => key.toLowerCase() === normalized.toLowerCase()) ?? ""];
  if (!entry) return null;
  return decoder.decode(entry);
}

function parseXml(text: string, label: string) {
  const document = new DOMParser().parseFromString(text, "application/xml");
  if (document.querySelector("parsererror")) {
    throw new BookSourceError(`The EPUB ${label} could not be parsed.`);
  }
  return document;
}

function textByLocalName(document: Document, localName: string) {
  return (
    Array.from(document.getElementsByTagName("*"))
      .find((node) => node.localName.toLowerCase() === localName)
      ?.textContent?.trim() || undefined
  );
}

function extractHtmlText(html: string) {
  const document = new DOMParser().parseFromString(html, "text/html");
  document.querySelectorAll("script, style, nav").forEach((node) => node.remove());
  const body = document.body;
  if (!body) return "";

  const blocks = Array.from(
    body.querySelectorAll("h1,h2,h3,h4,h5,h6,p,li,blockquote,pre"),
  )
    .map((node) => normalizePlainText(node.textContent ?? ""))
    .filter(Boolean);

  if (blocks.length > 0) return blocks.join("\n\n");
  return normalizePlainText(body.textContent ?? "");
}

function extractHtmlTitle(html: string) {
  const document = new DOMParser().parseFromString(html, "text/html");
  return (
    document.querySelector("h1,h2,h3")?.textContent?.trim() ||
    document.querySelector("title")?.textContent?.trim() ||
    undefined
  );
}

export async function parseEpubSource(file: File): Promise<ParsedBookSource> {
  ensureSourceSize(file.size);
  const [{ unzipSync }, bytes] = await Promise.all([
    import("fflate"),
    file.arrayBuffer(),
  ]);
  let entries: ZipEntries;
  try {
    entries = unzipSync(new Uint8Array(bytes));
  } catch {
    throw new BookSourceError("This EPUB could not be opened as a ZIP archive.");
  }

  const decoder = new TextDecoder("utf-8", { fatal: false });
  const warnings = ["EPUB extraction reads XHTML spine text only."];
  const encryption = readZipText(entries, "META-INF/encryption.xml", decoder);
  if (encryption && normalizePlainText(encryption)) {
    throw new BookSourceError(
      "This EPUB appears to be encrypted or DRM-protected, so MorseWords cannot extract it in the browser.",
    );
  }

  const containerText = readZipText(entries, "META-INF/container.xml", decoder);
  if (!containerText) {
    throw new BookSourceError("This EPUB is missing META-INF/container.xml.");
  }
  const container = parseXml(containerText, "container file");
  const opfPath = container.querySelector("rootfile")?.getAttribute("full-path");
  if (!opfPath) {
    throw new BookSourceError("This EPUB does not declare a package OPF file.");
  }

  const opfText = readZipText(entries, opfPath, decoder);
  if (!opfText) {
    throw new BookSourceError("The EPUB package OPF file is missing.");
  }
  const opf = parseXml(opfText, "package file");
  const title = textByLocalName(opf, "title");
  const author = textByLocalName(opf, "creator");

  const manifest = new Map<string, { href: string; mediaType: string }>();
  opf.querySelectorAll("manifest item").forEach((item) => {
    const id = item.getAttribute("id");
    const href = item.getAttribute("href");
    if (!id || !href) return;
    manifest.set(id, {
      href,
      mediaType: item.getAttribute("media-type") ?? "",
    });
  });

  const spineIds = Array.from(opf.querySelectorAll("spine itemref"))
    .map((item) => item.getAttribute("idref"))
    .filter((id): id is string => Boolean(id));
  if (spineIds.length === 0) {
    throw new BookSourceError("This EPUB has no readable spine order.");
  }

  const sections: BookSourceSection[] = [];
  for (const id of spineIds) {
    const manifestItem = manifest.get(id);
    if (!manifestItem) continue;
    const isHtml =
      /html|xhtml/i.test(manifestItem.mediaType) ||
      /\.(xhtml|html?)$/i.test(manifestItem.href);
    if (!isHtml) continue;
    const docPath = resolvePath(opfPath, manifestItem.href);
    const html = readZipText(entries, docPath, decoder);
    if (!html) {
      warnings.push(`Skipped missing EPUB spine document: ${manifestItem.href}`);
      continue;
    }
    const text = extractHtmlText(html);
    if (text) {
      sections.push({
        title: extractHtmlTitle(html),
        rawText: text,
        sourceLabel: manifestItem.href,
      });
    }
  }

  let cursor = 0;
  const sectionTexts: string[] = [];
  const rangedSections = sections.map((section) => {
    const startOffset = cursor;
    sectionTexts.push(section.rawText);
    cursor += section.rawText.length;
    const endOffset = cursor;
    cursor += 2;
    return { ...section, startOffset, endOffset };
  });

  const rawText = normalizePlainText(sectionTexts.join("\n\n"));
  ensureTextLength(rawText);
  if (!rawText) {
    throw new BookSourceError("No readable text was found in the EPUB spine.");
  }

  return {
    sourceType: "epub",
    filename: file.name,
    title,
    author,
    sectionCount: sections.length,
    rawText,
    sections: rangedSections,
    warnings,
  };
}
