# Book Payload Hydration Completeness Blocker

## 1. Executive Result

Book payload hydration/completeness validation passed locally; real remote Cloudflare validation still requires served base URL.

## 2. Owner-Observed Failures

- The Call of Cthulhu appeared live but showed unavailable text.
- Some pages appeared to render only starter/default text instead of full Cloudflare/export content.
- Some pages appeared to expose only Chapter 1 or partial section pickers.
- The desired behavior is immediate starter preview followed by full served export payload hydration.

## 3. Local Served Export Setup

- Export directory: `app/client/assets/books/cloudflare-export`
- Local served base URL used by route validation: `Local route validation starts a static server for app/client/assets/books/cloudflare-export.`
- The export directory remains ignored/untracked; the app must fetch it over HTTP, not import it.

## 4. Full Payload Hydration Result

- Result: pass
- Generated live books: 519
- Export payloads: 519
- Missing export payloads: 0
- Extra export payloads: 0
- Starter-only payloads: 0

## 5. Starter Preview Fallback Result

- Result: pass
- Startup previews: 519
- Missing preview slugs: 0
- Every live generated slug must keep readable startup preview data so failed full hydration cannot collapse into a dead page.

## 6. Book Text Unavailable State Result

- Result: pass
- Live slugs that would route unavailable: 0
- Live generated books with startup preview and export payload coverage should not route to the full unavailable state.

## 7. Section Picker Hydration Result

- Result: pass
- Section mismatches: 0
- Section picker data should hydrate from the full export payload and match generated section counts.

## 8. Suspicious Truncation / Chapter 1-Only Audit Result

- Result: warning
- Suspicious books: 36
- Warnings are reported for manual review; no generated content was changed by this audit.

## 9. Specific Slug Results

| Slug | Live | Preview | Export Sections | Export Words | Route Unavailable? | Notes |
| --- | --- | --- | ---: | ---: | --- | --- |
| the-call-of-cthulhu | yes | yes | 3 | 11809 | no | Live generated book with starter preview and full export payload; unavailable state is not expected after deployment. |
| five-little-friends | yes | yes | 2 | 11574 | no |  |
| the-leavenworth-case | yes | yes | 39 | 110828 | no |  |
| walden | yes | yes | 18 | 107126 | no |  |
| the-bottle-imp | yes | yes | 1 | 12211 | no |  |
| middlemarch | yes | yes | 88 | 318237 | no |  |
| the-happy-prince | yes | yes | 1 | 3491 | no |  |
| the-masque-of-the-red-death | yes | yes | 1 | 2422 | no |  |
| the-jungle-book | yes | yes | 14 | 51118 | no |  |
| the-adventures-of-roderick-random | yes | yes | 69 | 188889 | no | Owner-observed Chapter 1 label belongs to this live book; export has 69 sections, so a one-section picker would indicate hydration/display failure. |

## 10. Fixes Made

- Production book full-payload URLs now default to https://assets.morsewords.com without requiring a Netlify env var.
- Local dev keeps the /morse-book-content fallback unless a content base URL override is explicitly provided.
- Post-upload validation now validates the known assets.morsewords.com export host by default.
- Existing book-page request assertions now accept any configured /books/<slug>.json content base instead of only the dev fallback route.
- Book translator source building now treats export-section display text as the Morse source fallback when public export sections do not include a separate morseSourceText field.

## 11. Remaining Blockers

- None for local served-export hydration and completeness validation.

## 12. Whether Netlify Env Var Is Required

- Required: no
- No Netlify env var is required for the default production book content host; VITE_MORSE_BOOK_CONTENT_BASE_URL/PUBLIC_MORSE_BOOK_CONTENT_BASE_URL remain optional local overrides.

## 13. Whether Real Remote Cloudflare Validation Is Still Blocked

- Status: not-claimed
- This branch does not claim a separate owner-provided R2 base URL validation. The app default is the observed assets.morsewords.com URL pattern.

## 14. Later Content-Quality Checkpoints Preserved

- Sources page trust-copy update
- About page E-E-A-T sentence
- Repeated helper-copy reduction

## 15. Deferred Final Stages Preserved

- Non-book sitemap page implementation
- URL/indexability audit
- GSC/meta review
- Image alt text audit
- Broad mobile optimization
