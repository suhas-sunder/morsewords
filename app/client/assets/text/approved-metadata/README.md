# Approved people metadata

`authors.json` stores manually verified person metadata for the Morse book
rights gate. Despite the file name, entries may now describe authors,
translators, editors, illustrators, and introduction authors.

Do not add a death year, safety flag, or rights conclusion unless it has been
manually verified. The review queue suggests entry shapes with `deathYear:
null` so missing facts stay explicit.

## Entry shape

```json
{
  "person-slug": {
    "name": "Person Name",
    "deathYear": null,
    "canadaLifePlus70Safe": false,
    "roles": ["author"],
    "sources": [],
    "notes": "Fill after manual verification."
  }
}
```

Fields:

- `name`: Display name used for matching generated rights reports.
- `deathYear`: Verified death year, or `null` if not yet verified.
- `canadaLifePlus70Safe`: `true` only after manual verification that the
  project rule is satisfied.
- `roles`: Optional roles seen in the review queue. Allowed values are
  `author`, `translator`, `editor`, `illustrator`, and `introduction_author`.
- `sources`: Optional short source notes or references used during manual
  verification.
- `notes`: Required human notes about scope, caveats, or review decisions.

## Manual workflow

1. Run `npm run books:review-queue`.
2. Review `app/client/assets/books/generated/review/people-review-queue.md`.
3. Add or update `authors.json` only after manual verification.
4. Resolve duplicate Gutenberg ID groups manually.
5. Run `npm run books:rights-report`.
6. Run `npm run books:build`.

Adding approved person metadata alone does not publish a book. Public exposure
still requires the normal reviewed rights metadata and processing gate.
