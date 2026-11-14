// Data-free canonical paths and development preview identifiers.
export const MORSE_BOOKS_BASE_PATH = "/morse-code-books";

export const MORSE_AUDIOBOOKS_BASE_PATH = "/morse-code-audiobooks";

export const UNPUBLISHED_BOOK_PREVIEW_PARAM = "preview";

export const UNPUBLISHED_BOOK_PREVIEW_VALUE = "unpublished";

export const TEST_PUBLISHED_BOOK_PREVIEW_VALUE = "test-published";

export const TEST_COLLECTION_BOOK_PREVIEW_VALUE = "test-collection";

export const TEST_PUBLISHED_BOOK_SLUG = "test-published-morse-book";

export function morseBookPath(slug: string) {
  return `${MORSE_BOOKS_BASE_PATH}/${slug}`;
}

export function morseBookPrintPath(slug: string) {
  return `${morseBookPath(slug)}/print`;
}

export function morseAudiobookPath(slug: string) {
  return `${MORSE_AUDIOBOOKS_BASE_PATH}/${slug}`;
}
