# Book SEO Summary Pilot Verification

Generated: 2026-06-21T17:25:25.2167157-04:00

## Executive summary

The post-pilot pass verified exactly 20 summary records and found no unrelated
files in the original 11-file pilot commit. One concrete content defect was
found: every otherwise-valid summary contained at least one sentence written
for pilot reviewers rather than book-page readers. Those sentences referred to
internal pilot selection, generated output, substitutions, schema checks,
audits, or rollout plans.

The internal process sentences were replaced with reader-facing literary and
Morse practice guidance. All 20 corrected summaries now pass the expanded
audit, contain 300-310 words, and retain accurate generated title and author
metadata. No all-book summary generation was attempted.

Verification result: **20 pass, 0 warn, 0 fail**.

Pilot merge-ready: **yes**.

Recommended next phase: **merge pilot and scale summaries in controlled
batches**.

## Branch scope

The pilot commit `c3040a8eee9a79ca2edace774b4130976099630c` changed exactly
the 11 intended files:

- `app/client/assets/books/seo-summaries/book-seo-summaries.json`
- `app/client/data/morseBookSeoSummaries.ts`
- `app/client/components/morse-code-books/MorseBookPage.tsx`
- `app/routes/morse-code-books.$slug.tsx`
- `app/routes/morse-code-audiobooks.$slug.tsx`
- `app/routes/morse-code-books.tsx`
- `app/routes/morse-code-audiobooks.tsx`
- `scripts/books/book-seo-summary-audit.ts`
- `package.json`
- `app/client/assets/books/audit-reports/book-seo-summary-pilot/book-seo-summary-pilot.json`
- `app/client/assets/books/audit-reports/book-seo-summary-pilot/book-seo-summary-pilot.md`

No unrelated pilot changes were found.

## Pilot summaries

| Slug | Words | Result |
| --- | ---: | --- |
| the-time-machine | 300 | pass |
| the-war-of-the-worlds | 309 | pass |
| the-country-of-the-blind | 306 | pass |
| the-star | 309 | pass |
| the-strange-high-house-in-the-mist | 310 | pass |
| the-whisperer-in-darkness | 308 | pass |
| the-outsider | 306 | pass |
| alices-adventures-in-wonderland | 304 | pass |
| the-wonderful-wizard-of-oz | 307 | pass |
| anne-of-green-gables | 304 | pass |
| a-christmas-carol | 303 | pass |
| dracula | 307 | pass |
| frankenstein | 307 | pass |
| dr-jekyll-and-mr-hyde | 300 | pass |
| the-legend-of-sleepy-hollow | 307 | pass |
| the-masque-of-the-red-death | 303 | pass |
| ashputtel | 306 | pass |
| the-shifty-lad | 306 | pass |
| the-arabian-nights | 308 | pass |
| the-three-crowns | 304 | pass |

No short-work exceptions are needed.

## Substitutions

- `alice-s-adventures-in-wonderland` -> `alices-adventures-in-wonderland`
- `the-strange-case-of-dr-jekyll-and-mr-hyde` -> `dr-jekyll-and-mr-hyde`
- `the-tell-tale-heart` -> `the-masque-of-the-red-death`
- `the-three-little-pigs` -> `the-three-crowns`
- `cinderella` -> `ashputtel`
- `the-odyssey` -> `the-arabian-nights`

## Content verification

- Exact controlled set: pass; 20 records match the 20 pilot slugs.
- Generated slug existence: pass for all 20.
- Generated title and author metadata: pass for all 20.
- Originality: pass; no summary is an exact generated-text passage and no
  18-word summary phrase was found in generated book text.
- Source boilerplate: pass; no prohibited Gutenberg, production, transcriber,
  ebook, license, start/end marker, fallback, or `SOS Help!` text.
- Spoiler risk: pass after manual review and automated ending-label checks.
- Search usefulness: pass after correction; summaries describe genre, tone,
  setting, conflict, reading experience, and Morse practice value.
- Duplicate summaries: pass.
- Raw source paths and internal audit paths: pass; none are exposed.
- Internal process language: pass after correction. The audit now rejects this
  class of user-facing leak.

## Route integration

Summaries remain in the separate static JSON asset and are loaded through a
deterministic module-scope map. Generated books and previews do not store the
summary data. Route loaders do not parse summaries, perform summary network
requests, or require all 465 records.

Pilot book and audiobook routes render the long summary. Detail metadata,
audiobook JSON-LD, and listing descriptions use the short description when a
record exists. For the other 445 generated books, `getMorseBookSeoSummary`
returns `null` and the existing page, listing, metadata, and JSON-LD fallbacks
remain in place. This behavior is deterministic and SSR-compatible.

## UI smoke

Focused Playwright smoke: **1/1 pass**.

- `/morse-code-books` rendered.
- `/morse-code-audiobooks` rendered.
- `/morse-code-books/the-time-machine?preview=unpublished` rendered the Time
  Machine pilot summary.
- `/morse-code-books/anne-of-green-gables` rendered a public pilot summary and
  its summary-backed meta description.
- The book-page link navigated to
  `/morse-code-audiobooks/anne-of-green-gables`, where the summary rendered.
- `/morse-code-books/treasure-island` rendered normally with no pilot summary
  block and retained its existing deterministic metadata fallback.

The in-app browser loaded index content but timed out while establishing the
detail-page CDP state, so the repository Playwright harness was used as the
permitted fallback. The required suite completed **35/36**; its only failure
was the known pre-existing fullscreen-controls visibility assertion at line
1071. The other 35 book, audiobook, index, fallback, and interaction tests
passed.

The unchanged local Cloudflare public manifest currently contains 74 books and
9 of the 20 pilot slugs. The other 11 accepted/generated pilot titles,
including The Time Machine, were verified through the supported development
preview route. No Cloudflare export was generated or modified.

## Corrections made

- Replaced internal pilot/audit/rollout sentences in all 20 summaries with
  book- and practice-focused copy.
- Preserved factual scope, non-spoiler treatment, and the 300-word minimum.
- Extended the audit with a dedicated internal-process-leak check.
- Regenerated the pilot audit reports after the corrections.

## Protected paths

- Raw sources modified: no.
- Generated books modified: no.
- Preview assets modified: no.
- Cloudflare exports modified: no.
- All-book summary generation attempted: no.

## Recommendation

**Merge pilot and scale summaries in controlled batches.** Keep the expanded
audit in every batch so reader-facing summaries cannot regress into internal
processing notes.
