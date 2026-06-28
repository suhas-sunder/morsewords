# Book Starter Preview First Render

Date: 2026-06-28
Branch: `morsewords-book-starter-preview-first-render-jun-2026`

## Counts

- Previous generated count: 497
- Previous SEO summary count: 497
- Generated count after branch: 497
- SEO summary count after branch: 497
- Startup previews after branch: 497

## Root Cause

Valid public book and audiobook routes loaded only summary metadata on the
server. `MorseBookPage` then started in `status=loading` until the small local
`/book-previews/{slug}.preview.json` request resolved on the client. That made
preview-backed pages briefly render the full loading hero and the large
`Loading book text` panel before useful starter content appeared.

## Fix

- Public book and audiobook loaders now fetch the small local startup preview
  asset and pass it as initial preview runtime content when available.
- `MorseBookPage` initializes from that route-provided starter content in
  preview mode, so the real book/audiobook structure renders immediately.
- Full book JSON still loads once in the background when needed.
- If the full payload is unavailable or malformed, the starter preview remains
  visible and the large loading shell does not replace it.
- Local preview/start size policy is unchanged.

## Route Checks

Focused Playwright coverage checks:

- `/morse-code-books/the-jungle-book`
- `/morse-code-books/the-willows`
- `/morse-code-books/a-descent-into-the-maelstrom`
- `/morse-code-books/the-great-gatsby`
- `/morse-code-audiobooks/the-jungle-book`
- `/morse-code-books`
- `/morse-code-audiobooks`

Results:

- Full loading shell removed for preview-backed routes: yes
- Starter preview or audiobook live starter content visible immediately: yes
- Small inline full-text loading status may remain while full JSON hydrates: yes
- Full JSON unavailable state keeps starter preview visible: yes
- Summary remains below Source notes: yes
- Desktop width check: no overflow in focused coverage
- 390px mobile check: no horizontal overflow in focused coverage
- Book and audiobook listing counts: 497

## Checkpoints

- 45 remaining raw candidates remain tracked for a later manual/bespoke pass.
- 8 blocked source/rights-risk generated books remain pending user decision.
- `jabberwocky` remains pending user removal/replacement decision.
- Cloudflare export was not run and was not used as source of truth.
- URL/page/indexability and planned non-book page work were not started.
- Broad mobile optimization was not started.

## Validation

- Typecheck: pass
- SEO summary audit: pass, 497/497 summaries
- Batch-12 prose restore: pass, unrelated generated churn restored
- Startup preview audit: pass, 497 valid
- Title/start/default audit: pass after restoring known unrelated generated and
  preview churn
- Metadata segmentation audit: pass
- Manual UI defect follow-up: pass
- Independent second-pass audit: pass, 0 fail-needs-fix
- Linking/sitemap audit: pass, 497 book URLs and 497 audiobook URLs
- `npm run test --if-present`: pass, 23/23
- Netlify build: pass
- Full Morse book-page Playwright spec: pass, 39/39
- `git diff --check`: pass
- Protected folders: clean for temp-books, generated books, Cloudflare export,
  and public book previews
- Focused Playwright: pass for pending full JSON, failed/malformed full JSON,
  audiobook, and requested route/mobile/count coverage

## Recommended Next Major Phase

User decision checkpoint for the 8 blocked source/rights-risk books and
`jabberwocky` removal/replacement.
