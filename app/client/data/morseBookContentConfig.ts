export const MORSE_BOOK_CONTENT_BASE_URL = "https://assets.morsewords.com";

export function normalizeMorseBookContentBaseUrl(value: unknown) {
  return typeof value === "string" && value.trim()
    ? value.trim().replace(/\/+$/, "")
    : "";
}

export function getMorseBookPublicContentUrls(
  bookPath = "books/example.json",
  baseUrl = MORSE_BOOK_CONTENT_BASE_URL,
) {
  const normalizedBaseUrl = normalizeMorseBookContentBaseUrl(baseUrl);
  const normalizedPath = bookPath.replace(/^\/+/, "");
  return {
    publicManifestUrl: normalizedBaseUrl
      ? `${normalizedBaseUrl}/public-manifest.json`
      : "local:app/client/assets/books/cloudflare-export/public-manifest.json",
    bookUrl: normalizedBaseUrl
      ? `${normalizedBaseUrl}/${normalizedPath}`
      : `local:app/client/assets/books/cloudflare-export/${normalizedPath}`,
  };
}
