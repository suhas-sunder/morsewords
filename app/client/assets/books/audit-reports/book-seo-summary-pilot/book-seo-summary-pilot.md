# Book SEO Summary Pilot

Generated: 2026-06-21T20:39:29.353Z

## Executive summary

The pilot adds 20 original, non-spoiler book summary records for 20 accepted generated books. The chosen storage approach is a separate SEO summary JSON asset imported by the book routes and audit tooling, so generated book text, preview assets, raw sources, and Cloudflare export payloads are not modified.

Validation result: pass

## Storage approach

Separate static JSON data asset imported by book routes and validation tooling. Summaries are not embedded in generated book text, preview assets, raw sources, or Cloudflare export payloads.

## Files changed

- app/client/assets/books/seo-summaries/book-seo-summaries.json
- app/client/data/morseBookSeoSummaries.ts
- app/client/components/morse-code-books/MorseBookPage.tsx
- app/routes/morse-code-books.$slug.tsx
- app/routes/morse-code-audiobooks.$slug.tsx
- app/routes/morse-code-books.tsx
- app/routes/morse-code-audiobooks.tsx
- scripts/books/book-seo-summary-audit.ts
- package.json
- app/client/assets/books/audit-reports/book-seo-summary-pilot/book-seo-summary-pilot.json
- app/client/assets/books/audit-reports/book-seo-summary-pilot/book-seo-summary-pilot.md

## Pilot slugs

- the-time-machine
- the-war-of-the-worlds
- the-country-of-the-blind
- the-star
- the-strange-high-house-in-the-mist
- the-whisperer-in-darkness
- the-outsider
- alices-adventures-in-wonderland
- the-wonderful-wizard-of-oz
- anne-of-green-gables
- a-christmas-carol
- dracula
- frankenstein
- dr-jekyll-and-mr-hyde
- the-legend-of-sleepy-hollow
- the-masque-of-the-red-death
- ashputtel
- the-shifty-lad
- the-arabian-nights
- the-three-crowns

## Substitutions

- alice-s-adventures-in-wonderland -> alices-adventures-in-wonderland: The accepted generated slug omits the extra possessive hyphen.
- the-strange-case-of-dr-jekyll-and-mr-hyde -> dr-jekyll-and-mr-hyde: The accepted generated slug is the shorter Dr. Jekyll slug.
- the-tell-tale-heart -> the-masque-of-the-red-death: The suggested Poe title is not currently generated; this accepted Poe short story keeps the horror short-story coverage.
- the-three-little-pigs -> the-three-crowns: The suggested animal tale is not currently generated; this accepted Andrew Lang tale keeps short folk-tale coverage.
- cinderella -> ashputtel: The exact Cinderella slug is not currently generated; Ashputtel is the accepted Grimm Cinderella-variant title.
- the-odyssey -> the-arabian-nights: The Odyssey is not currently generated; The Arabian Nights keeps a long classic story-collection sample in the pilot.

## Summary validation

| Slug | Summary words | Metadata | Spoiler risk | Source boilerplate | Duplicate summary | Status |
| --- | ---: | --- | --- | --- | --- | --- |
| the-time-machine | 300 | pass | pass | pass | pass | pass |
| the-war-of-the-worlds | 304 | pass | pass | pass | pass | pass |
| the-country-of-the-blind | 308 | pass | pass | pass | pass | pass |
| the-star | 302 | pass | pass | pass | pass | pass |
| the-strange-high-house-in-the-mist | 300 | pass | pass | pass | pass | pass |
| the-whisperer-in-darkness | 300 | pass | pass | pass | pass | pass |
| the-outsider | 300 | pass | pass | pass | pass | pass |
| alices-adventures-in-wonderland | 300 | pass | pass | pass | pass | pass |
| the-wonderful-wizard-of-oz | 301 | pass | pass | pass | pass | pass |
| anne-of-green-gables | 300 | pass | pass | pass | pass | pass |
| a-christmas-carol | 300 | pass | pass | pass | pass | pass |
| dracula | 300 | pass | pass | pass | pass | pass |
| frankenstein | 301 | pass | pass | pass | pass | pass |
| dr-jekyll-and-mr-hyde | 301 | pass | pass | pass | pass | pass |
| the-legend-of-sleepy-hollow | 300 | pass | pass | pass | pass | pass |
| the-masque-of-the-red-death | 300 | pass | pass | pass | pass | pass |
| ashputtel | 300 | pass | pass | pass | pass | pass |
| the-shifty-lad | 301 | pass | pass | pass | pass | pass |
| the-arabian-nights | 300 | pass | pass | pass | pass | pass |
| the-three-crowns | 300 | pass | pass | pass | pass | pass |

## Validation categories

- Metadata match: pass
- Word count: pass
- Spoiler-risk result: pass
- Source-boilerplate result: pass
- Duplicate-summary result: pass
- Source-text copy result: pass

## Failures

- None

## Protected paths

- Raw sources: app/client/assets/temp-books
- Generated books: app/client/assets/books/generated
- Preview assets: public/book-previews
- Cloudflare exports: app/client/assets/books/cloudflare-export
- Modified by this audit: no

## Recommended next step

Scale the summary process in reviewable batches, reusing this schema and audit command, before the full site SEO/meta review.
