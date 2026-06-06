# Morse book approval intake

These files are owner-editable approval inputs for the Morse book rights gate.
They do not approve any real book by default.

Use `people.json` for manually verified people. Do not add death years unless
you have checked them yourself. A person entry is ignored unless
`reviewedByOwner` is `true`, `deathYear` is a verified integer year, and
`canadaLifePlus70Safe` is `true`.

Use `book-approvals.json` for per-book website and narration approval. A book
entry must have `ownerReviewed: true`, `approvedForWebsite: true`, a verified
`originalPublicationYear`, and approved regions that include both `US` and
`CA` before it can help a book pass the public processing gate.

Use `duplicate-resolutions.json` only when duplicate Project Gutenberg IDs have
been checked. The safe default is to leave duplicate groups unresolved.

Run this workflow after editing approval files:

1. `npm run books:apply-review`
2. `npm run books:rights-report`
3. `npm run books:review-queue`
4. `npm run books:build`

The command generates owner-input CSV/JSON files under
`app/client/assets/books/generated/review/owner-input/` so review work can be
done without opening full story text.
