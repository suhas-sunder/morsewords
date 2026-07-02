# Book Live-Player Segment Advance Fix

## 1. Executive result

Book live-player segment advance fix passed.

## 2. User-reported bug

When playing Morse books via the live player, a completed segment could skip the next segment. The reported examples were The Call of Cthulhu segment 1 advancing to segment 3 and segment 2 advancing to segment 4.

Expected behavior: segment N advances to segment N+1 exactly once.

## 3. Root cause

The live-player visual timer and audio playback promise could both report completion for the same segment. Both paths called the same advancement logic, so one real completion could be observed twice and increment the segment twice.

## 4. Fix made

- Added a completion token containing playback session id, section id, segment index, and duration.
- Centralized segment completion in `finishVideoPreviewRun`.
- Consumed each playback session completion at most once.
- Rejected completion tokens when the current section or segment no longer matches.
- Removed the unguarded zero-delay advance from timer completion.
- Added a development-only Playwright hook for deterministic completion and stale-token tests.

## 5. Books/routes tested

- `/morse-code-books/the-call-of-cthulhu`
- `/morse-code-audiobooks/the-call-of-cthulhu`
- `/morse-code-books/the-adventures-of-roderick-random`

## 6. Double-advance prevention

The visual timer and audio promise now share one consumed-session guard. A second completion for the same playback session returns false and cannot advance again.

## 7. Stale completion prevention

Manual segment changes, section changes, stops, and restarts invalidate older completions by changing the active playback session and/or the current section/segment token.

## 8. Tests added/updated

Added `tests/qa-robustness-review/morse-book-live-player-segment-advance.spec.ts`.

Coverage:

- The Call of Cthulhu segment 1 advances to segment 2, not 3.
- The Call of Cthulhu segment 2 advances to segment 3, not 4.
- Another long book advances exactly one segment.
- Stale completion after manual segment change is ignored.
- Stale completion after audiobook next-section action is ignored.

## 9. Validation result

- `npm run typecheck`: pass
- `npm run test --if-present`: pass, 23/23
- `npm run build:netlify`: pass with existing large chunk warning
- `npx playwright test tests/qa-robustness-review/morse-book-live-player-segment-advance.spec.ts --project=desktop-chromium --reporter=line`: pass, 4/4
- `npx playwright test tests/qa-robustness-review/morse-book-suitability.spec.ts --project=desktop-chromium --reporter=line`: pass, 5/5
- `npx playwright test tests/qa-robustness-review/morse-mobile-smoke.spec.ts --project=desktop-chromium --reporter=line`: pass, 12/12
- `npm run site:final-production-sanity-check`: pass
- `npm run site:production-deploy-staleness-diagnosis`: pass
- `npm run pages:adsense-contact-readiness-audit`: pass
- `npm run pages:sitemap-count-print-indexability-audit`: pass
- `npm run pages:url-indexability-canonical-audit`: pass
- `npm run site:local-final-validation`: pass
- `npm run books:no-cloudflare-export-app-imports`: pass

## 10. Protected folder status

- `app/client/assets/temp-books`: clean
- `app/client/assets/books/generated`: clean
- `public/book-previews`: clean
- `app/client/assets/books/cloudflare-export`: ignored/untracked; tracked file count 0
- `app/client/assets/books/cloudflare-updated-export`: ignored/untracked; tracked file count 0

## 11. Remaining blockers

None.

## 12. Recommended next step

Manually verify The Call of Cthulhu live player advances 1 -> 2 -> 3 without skipping, then merge to main. After that, create a separate print-page UX branch for individual-page print buttons and full-book whitespace cleanup.
