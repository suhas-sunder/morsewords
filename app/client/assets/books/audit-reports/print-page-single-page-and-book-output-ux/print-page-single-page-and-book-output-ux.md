# Print Page Single Page And Book Output UX

## 1. Executive result

Print page single-page and full-book output UX passed.

Printable book pages now expose a per-preview-page print action. Full-book print output keeps repeated QR/source/footer chrome limited to the opening printed page while later pages focus on text and Morse.

## 2. User-reported issue

Users could view each print preview page individually, but there was no action to print only that one preview page.

When printing a whole book selection, the same QR code, title context, source, and footer details repeated on every page, adding whitespace and repeated non-reading content.

## 3. Print page architecture inspected

- Route: `app/routes/morse-code-books.$slug.print.tsx`
- Renderer: `app/client/components/morse-code-books/PrintableMorsePages.tsx`
- The route intentionally SSR-loads only a lightweight discoverable book summary.
- `PrintableMorsePages` loads approved book content on the client with `getMorseBookPublicContent`.
- Preview pages are chunked line groups rendered as `PrintablePagePreview` articles.
- `PrintStyles` inside `PrintableMorsePages` controls print media behavior.
- QR, source, title context, and footer chrome were previously rendered inside every preview page.

## 4. Single-page print action

Each preview page now has a `Print this page` action.

The action sets a single-page print mode, records the selected page number, waits until React commits that state, then calls `window.print()`. Print media CSS hides every other preview page while the selected page remains printable. `afterprint` and a short fallback reset return the route to idle mode.

## 5. Full-book print cleanup

Full-book print keeps opening context on page 1 and marks later pages as content-only for repeated chrome.

Print media CSS hides repeated QR/context/footer chrome on later book pages outside single-page print mode. On-screen previews still keep the QR/source/footer details so a user can inspect an individual preview page before printing it.

## 6. Suitability/indexability preservation

Suitability notes remain visible on print routes and visible under print media at least once.

No book text, generated book payloads, public previews, sitemap counts, canonical behavior, indexability behavior, suitability policy, live-player logic, or video export/preview behavior changed.

## 7. Routes tested

- `/morse-code-books/walden/print`
- `/morse-code-books/the-call-of-cthulhu/print`
- `/morse-code-books/the-adventures-of-roderick-random/print`
- `/morse-code-printable-pages`

## 8. Tests added/updated

- Added `tests/qa-robustness-review/morse-book-print-ux.spec.ts`.
- Updated `tests/qa-robustness-review/printable-morse-pages.spec.ts` to wait for the printable component client-ready marker before simulating custom textarea input.

## 9. Validation result

Validation passed.

- `npm run typecheck`
- `npm run test --if-present`
- `npm run build:netlify`
- `npx playwright test tests/qa-robustness-review/morse-book-print-ux.spec.ts --project=desktop-chromium --reporter=line`
- `npx playwright test tests/qa-robustness-review/morse-book-suitability.spec.ts --project=desktop-chromium --reporter=line`
- `npx playwright test tests/qa-robustness-review/morse-mobile-smoke.spec.ts --project=desktop-chromium --reporter=line`
- `npx playwright test tests/qa-robustness-review/printable-morse-pages.spec.ts tests/qa-robustness-review/morse-book-print-ux.spec.ts --project=desktop-chromium --reporter=line`
- `npm run site:final-production-sanity-check`
- `npm run site:production-deploy-staleness-diagnosis`
- `npm run pages:adsense-contact-readiness-audit`
- `npm run pages:sitemap-count-print-indexability-audit`
- `npm run pages:url-indexability-canonical-audit`
- `npm run site:local-final-validation`
- `npm run books:no-cloudflare-export-app-imports`
- `git diff --check`

In-app browser check on `/morse-code-books/walden/print` confirmed route identity, nonblank render, suitability visibility, 236 preview pages, `Print this page` actions, and first-page-only QR chrome flags. Console output contained only expected Vite websocket warnings from the temporary HMR-disabled dev server.

## 10. Protected folder status

- `app/client/assets/temp-books`: clean
- `app/client/assets/books/generated`: clean
- `public/book-previews`: clean
- `app/client/assets/books/cloudflare-export`: ignored or untracked, zero tracked files
- `app/client/assets/books/cloudflare-updated-export`: ignored or untracked, zero tracked files

## 11. Remaining blockers

None.

## 12. Recommended next step

Manually test `/morse-code-books/walden/print`:

- `Print this page` prints one selected page only.
- Full book print output keeps context on the first page and focuses later pages on text/Morse.

Then merge to main if acceptable.
