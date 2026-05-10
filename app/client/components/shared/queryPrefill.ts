import { getUnsupportedTextCharacters } from "./morseUtils";

function safeDecodeQueryPart(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return "";
  }
}

export function readQueryPrefillValue(search: string, key: "text" | "morse") {
  const source = search.startsWith("?") ? search.slice(1) : search;
  if (!source) return null;

  for (const part of source.split("&")) {
    if (!part) continue;
    const separatorIndex = part.indexOf("=");
    const rawKey = separatorIndex >= 0 ? part.slice(0, separatorIndex) : part;
    const decodedKey = safeDecodeQueryPart(rawKey);

    if (decodedKey !== key) continue;

    const rawValue = separatorIndex >= 0 ? part.slice(separatorIndex + 1) : "";
    const decodedValue = safeDecodeQueryPart(rawValue).trim();
    if (
      key === "text" &&
      Object.keys(getUnsupportedTextCharacters(decodedValue)).length > 0
    ) {
      return null;
    }

    return decodedValue || null;
  }

  return null;
}

export function encodeToolQueryValue(value: string) {
  return encodeURIComponent(value)
    .replace(/'/g, "%27")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29");
}
