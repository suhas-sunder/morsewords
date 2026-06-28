# Book Source Decision Checkpoint

Generated: 2026-06-28
Branch: `morsewords-book-source-decision-checkpoint-jun-2026`

This is a decision checkpoint only. No blocked books were removed, no sources
were replaced, no SEO summaries or previews were changed, and Cloudflare export
was not run.

## Current Counts

- Generated books: 497
- SEO summaries: 497
- Missing summaries: 0
- Startup previews: 497 valid
- Remaining raw candidates: 45
- Blocked source/rights-risk generated books: 8
- Remove/replacement-recommended books: 1
- Cloudflare export: not run

## Decision Table

| slug | current status | issue | safest next action | needs user decision |
|---|---|---|---|---|
| `a-princess-of-mars` | blocked-source-or-rights-risk | `rights_report` needs manual review; manual-review approval source; illustration/image references | Keep temporarily, replace with safer source, or remove/defer. | yes |
| `doctor-dolittle` | blocked-source-or-rights-risk | `rights_report` reject; later copyright notice; illustration/image references | Keep temporarily, replace with safer source, or remove/defer. | yes |
| `heidi` | blocked-source-or-rights-risk | `rights_report` needs manual review; translation/editorial notes, transcriber notes, illustrations | Keep temporarily, replace with safer source, or remove/defer. | yes |
| `nights-with-uncle-remus` | blocked-source-or-rights-risk | `rights_report` reject; later copyright notice, transcriber notes, illustrations, missing publication metadata, brand-safety risk | Keep temporarily, replace with safer source, or remove/defer. | yes |
| `peter-pan` | blocked-source-or-rights-risk | `rights_report` needs manual review; missing original-publication metadata | Keep temporarily, replace with safer source, or remove/defer. | yes |
| `tarzan-of-the-apes` | blocked-source-or-rights-risk | `rights_report` needs manual review; illustration, trademark/character, and brand-safety risks | Keep temporarily, replace with safer source, or remove/defer. | yes |
| `the-thirty-nine-steps` | blocked-source-or-rights-risk | `rights_report` needs manual review; manual-review approval source; illustration/image references | Keep temporarily, replace with safer source, or remove/defer. | yes |
| `wood-folk-at-school` | blocked-source-or-rights-risk | `rights_report` reject; later copyright notice, transcriber notes, illustrations, missing publication metadata | Keep temporarily, replace with safer source, or remove/defer. | yes |
| `jabberwocky` | remove-recommended | Generated text is an audio-reading/catalog/license page, not the poem text. | Replace with correct safe poem source or remove/defer. | yes |

## Blocked Source/Rights-Risk Books

Each blocked book is currently generated, present in the manifest, covered by an
SEO summary, and has a startup preview. Current repo evidence does not include
an exact `app/client/assets/temp-books` raw source or a known safe replacement
source for any of the 8 blocked books.

### `a-princess-of-mars`

- Title: A princess of Mars
- Author: Edgar Rice Burroughs
- Current generated status: generated and publish-ready in manifest, but
  blocked-source-or-rights-risk in the unresolved-source review.
- Concern: Project Gutenberg ebook 62 is listed, but `rights_report` remains
  `needs_manual_review` with manual-review approval source and illustration/image
  references detected.
- Recommended options:
  1. Keep temporarily and resolve source/rights review later.
  2. Replace with a safer source if approved or provided.
  3. Remove/defer from the generated library.
- Removal/defer effect: generated count, SEO summaries, startup previews,
  listings, and sitemap book/audiobook URLs each decrease by 1 unless replaced.

### `doctor-dolittle`

- Title: The Story of Doctor Dolittle
- Author: Hugh Lofting
- Current generated status: generated and publish-ready in manifest, but
  blocked-source-or-rights-risk in the unresolved-source review.
- Concern: Project Gutenberg ebook 501 is listed, but `rights_report` status is
  `reject` with a later copyright notice and illustration/image references.
- Recommended options:
  1. Keep temporarily and resolve source/rights review later.
  2. Replace with a safer source if approved or provided.
  3. Remove/defer from the generated library.
- Removal/defer effect: generated count, SEO summaries, startup previews,
  listings, and sitemap book/audiobook URLs each decrease by 1 unless replaced.

### `heidi`

- Title: Heidi
- Author: Johanna Spyri
- Current generated status: generated and publish-ready in manifest, but
  blocked-source-or-rights-risk in the unresolved-source review.
- Concern: Project Gutenberg ebook 20781 is listed, but `rights_report` remains
  `needs_manual_review` for translation/editorial material, transcriber notes,
  and illustrations.
- Recommended options:
  1. Keep temporarily and resolve source/rights review later.
  2. Replace with a safer source if approved or provided.
  3. Remove/defer from the generated library.
- Removal/defer effect: generated count, SEO summaries, startup previews,
  listings, and sitemap book/audiobook URLs each decrease by 1 unless replaced.

### `nights-with-uncle-remus`

- Title: Nights With Uncle Remus
- Author: Joel Chandler Harris
- Current generated status: generated and publish-ready in manifest, but
  blocked-source-or-rights-risk in the unresolved-source review.
- Concern: Project Gutenberg ebook 24430 is listed, but `rights_report` status
  is `reject` with later copyright notice, transcriber notes, illustrations,
  missing original-publication metadata, and medium content brand-safety risk.
- Recommended options:
  1. Keep temporarily and resolve source/rights review later.
  2. Replace with a safer source if approved or provided.
  3. Remove/defer from the generated library.
- Removal/defer effect: generated count, SEO summaries, startup previews,
  listings, and sitemap book/audiobook URLs each decrease by 1 unless replaced.

### `peter-pan`

- Title: Peter Pan [Peter and Wendy]
- Author: J. M. Barrie
- Current generated status: generated and publish-ready in manifest, but
  blocked-source-or-rights-risk in the unresolved-source review.
- Concern: Project Gutenberg ebook 16 is listed and chapter content is readable,
  but `rights_report` remains `needs_manual_review` because original-publication
  metadata is missing in the report.
- Recommended options:
  1. Keep temporarily and resolve source/rights review later.
  2. Replace with a safer source if approved or provided.
  3. Remove/defer from the generated library.
- Removal/defer effect: generated count, SEO summaries, startup previews,
  listings, and sitemap book/audiobook URLs each decrease by 1 unless replaced.

### `tarzan-of-the-apes`

- Title: Tarzan of the Apes
- Author: Edgar Rice Burroughs
- Current generated status: generated and publish-ready in manifest, but
  blocked-source-or-rights-risk in the unresolved-source review.
- Concern: Project Gutenberg ebook 78 is listed and chapter content is readable,
  but `rights_report` remains `needs_manual_review` with illustration,
  trademark/character, and content brand-safety risks.
- Recommended options:
  1. Keep temporarily and resolve source/rights review later.
  2. Replace with a safer source if approved or provided.
  3. Remove/defer from the generated library.
- Removal/defer effect: generated count, SEO summaries, startup previews,
  listings, and sitemap book/audiobook URLs each decrease by 1 unless replaced.

### `the-thirty-nine-steps`

- Title: The Thirty-Nine Steps
- Author: John Buchan
- Current generated status: generated and publish-ready in manifest, but
  blocked-source-or-rights-risk in the unresolved-source review.
- Concern: Project Gutenberg ebook 558 is listed and chapter content is readable,
  but `rights_report` remains `needs_manual_review` with manual-review approval
  source and illustration/image references detected.
- Recommended options:
  1. Keep temporarily and resolve source/rights review later.
  2. Replace with a safer source if approved or provided.
  3. Remove/defer from the generated library.
- Removal/defer effect: generated count, SEO summaries, startup previews,
  listings, and sitemap book/audiobook URLs each decrease by 1 unless replaced.

### `wood-folk-at-school`

- Title: Wood folk at school
- Author: William J. Long
- Current generated status: generated and publish-ready in manifest, but
  blocked-source-or-rights-risk in the unresolved-source review.
- Concern: Project Gutenberg ebook 22101 is listed, but `rights_report` status
  is `reject` with later copyright notice, transcriber notes, illustration/image
  references, and missing original-publication metadata.
- Recommended options:
  1. Keep temporarily and resolve source/rights review later.
  2. Replace with a safer source if approved or provided.
  3. Remove/defer from the generated library.
- Removal/defer effect: generated count, SEO summaries, startup previews,
  listings, and sitemap book/audiobook URLs each decrease by 1 unless replaced.

## Remove/Replacement-Recommended Book

### `jabberwocky`

- Title: Jabberwocky
- Author: Lewis Carroll
- Current generated status: generated and publish-ready in manifest, but
  remove-recommended in the unresolved-source review.
- Exact problem: current generated text is not the poem text. It is an
  audio-reading/catalog/license page with reader names, format listings, and
  LibriVox certification rather than the poem.
- Current safe replacement source in repo evidence: none known.
- Recommended options:
  1. Replace with correct poem text if a safe source exists or is provided.
  2. Remove/defer until a safe source is provided.
- Removal/defer effect: generated count, SEO summaries, startup previews,
  listings, and sitemap book/audiobook URLs each decrease by 1 unless replaced.

## Count Scenarios

- If all 8 blocked books are kept temporarily and `jabberwocky` is replaced:
  generated count likely remains 497.
- If all 8 blocked books are kept temporarily and `jabberwocky` is
  removed/deferred: generated count likely becomes 496.
- If all 8 blocked books and `jabberwocky` are removed/deferred: generated
  count likely becomes 488.
- If any blocked books are replaced with safer sources: generated count likely
  stays the same for those replaced slugs.

These are planning scenarios only. This branch does not make the decision.

## Validation

- Typecheck: pass
- SEO summary audit: pass, 497/497 summaries
- Startup preview audit: pass, 497 valid
- Independent second-pass audit: pass, 0 fail-needs-fix
- Linking/sitemap audit: pass, 497 book URLs and 497 audiobook URLs
- `npm run test --if-present`: pass, 23/23
- Netlify build: pass
- Full Morse book-page Playwright spec: pass, 39/39
- `git diff --check`: pass
- Protected folders: clean. No `temp-books`, generated books, SEO summaries,
  public previews, or Cloudflare export files were modified.

Route/UI note: the full book-page Playwright spec includes the durable
starter-preview first-render checks for no full loading shell, visible starter
content, summary placement, listing count 497, and 390px mobile overflow. A
separate ad hoc route-check wrapper was attempted, but it timed out before
returning output, so the durable Playwright coverage is the verification source.

## Recommended Next Major Phase

User decision needed before the next book-library branch.
