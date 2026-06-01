import {
  BookSourceError,
  detectFileSourceType,
  ensureSourceSize,
  ensureTextLength,
  type ParsedBookSource,
} from "../bookSourceTypes";
import { decodeUtf8, normalizePlainText } from "../textNormalization";

export async function parseTextFileSource(file: File): Promise<ParsedBookSource> {
  ensureSourceSize(file.size);
  const sourceType = detectFileSourceType(file);
  if (sourceType !== "txt" && sourceType !== "md") {
    throw new BookSourceError("This parser only accepts TXT and MD files.");
  }

  const rawText = normalizePlainText(decodeUtf8(await file.arrayBuffer()));
  ensureTextLength(rawText);

  return {
    sourceType,
    filename: file.name,
    rawText,
    warnings: rawText ? [] : ["The uploaded file is empty."],
  };
}

export function parsePastedSource(text: string): ParsedBookSource {
  const rawText = normalizePlainText(text);
  ensureTextLength(rawText);

  return {
    sourceType: "pasted",
    rawText,
    warnings: rawText ? [] : ["Paste or upload text to begin preflight."],
  };
}
