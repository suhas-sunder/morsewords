export type NavigationBook = { label: string; href: string; description: string; searchKeywords: string };
let cached: NavigationBook[] | null = null;
let pending: Promise<NavigationBook[]> | null = null;

export function parseNavigationBooks(value: unknown): NavigationBook[] {
  if (!value || typeof value !== "object" || !("schemaVersion" in value) || value.schemaVersion !== 1 || !("books" in value) || !Array.isArray(value.books)) throw new Error("Invalid book search index");
  const seen = new Set<string>();
  return value.books.map((row: unknown) => {
    if (!Array.isArray(row) || row.length !== 4 || !row.every(item => typeof item === "string") || !/^[a-z0-9-]+$/.test(row[0]) || !row[1] || seen.has(row[0])) throw new Error("Invalid book search entry");
    seen.add(row[0]);
    return { href: `/morse-code-books/${row[0]}`, label: row[1], description: row[2], searchKeywords: row[3] };
  });
}

/** No network at import/render time. One shared request on first menu use. */
export function loadNavigationBooks(): Promise<NavigationBook[]> {
  if (cached) return Promise.resolve(cached);
  if (pending) return pending;
  pending = (async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);
    try {
      const response = await fetch("/navigation-books.json", { signal: controller.signal, cache: "no-cache" });
      if (!response.ok) throw new Error("Book search unavailable");
      cached = parseNavigationBooks(await response.json());
      return cached;
    } finally { clearTimeout(timeout); pending = null; }
  })();
  return pending;
}
