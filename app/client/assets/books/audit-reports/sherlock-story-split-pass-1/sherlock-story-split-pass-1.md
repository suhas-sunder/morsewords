# Sherlock story-split pass 1

## Summary

- Pass-2 branch merge status: morsewords-bespoke-raw-candidate-pass-2-jun-2026 was merged to main and pushed before this branch.
- Raw source file split: app/client/assets/temp-books/The Adventures of Sherlock Holmes.txt
- Previous generated count: 496
- Previous SEO summary count: 496
- Previous preview count: 496
- Accepted/generated story units: a-scandal-in-bohemia, the-red-headed-league, a-case-of-identity, the-boscombe-valley-mystery, the-five-orange-pips, the-man-with-the-twisted-lip
- Collection parent generated: no
- Generated count after branch: 502
- SEO summary count after branch: 502
- Startup preview count after branch: 502
- Missing summary count: 0
- Status of The Adventures of Sherlock Holmes.txt: partially split, more stories remain; first six story pages generated, six clean story units deferred to Sherlock story-split pass 2
- Unknown/unclassified raw count: 0
- Cloudflare export: not run

## Story Units

| file | oldCategory | decision | slug | reason |
| --- | --- | --- | --- | --- |
| The Adventures of Sherlock Holmes.txt | unsafe-start-end-boundary-risk | accept | a-scandal-in-bohemia | Opening Sherlock Holmes story has clear Roman-numeral heading and next-story boundary in the Project Gutenberg file. |
| The Adventures of Sherlock Holmes.txt | unsafe-start-end-boundary-risk | accept | the-red-headed-league | Second Sherlock Holmes story has clear Roman-numeral heading and next-story boundary in the Project Gutenberg file. |
| The Adventures of Sherlock Holmes.txt | unsafe-start-end-boundary-risk | accept | a-case-of-identity | Third Sherlock Holmes story has clear Roman-numeral heading and next-story boundary in the Project Gutenberg file. |
| The Adventures of Sherlock Holmes.txt | unsafe-start-end-boundary-risk | accept | the-boscombe-valley-mystery | Fourth Sherlock Holmes story has clear Roman-numeral heading and next-story boundary in the Project Gutenberg file. |
| The Adventures of Sherlock Holmes.txt | unsafe-start-end-boundary-risk | accept | the-five-orange-pips | Fifth Sherlock Holmes story has clear Roman-numeral heading and next-story boundary in the Project Gutenberg file. |
| The Adventures of Sherlock Holmes.txt | unsafe-start-end-boundary-risk | accept | the-man-with-the-twisted-lip | Sixth Sherlock Holmes story has clear Roman-numeral heading and next-story boundary in the Project Gutenberg file. |
| The Adventures of Sherlock Holmes.txt | unsafe-start-end-boundary-risk | keep deferred | the-adventure-of-the-blue-carbuncle | Clean story boundary exists, but this pass stops after the first six standalone stories; defer to Sherlock story-split pass 2. |
| The Adventures of Sherlock Holmes.txt | unsafe-start-end-boundary-risk | keep deferred | the-adventure-of-the-speckled-band | Clean story boundary exists, but this pass stops after the first six standalone stories; defer to Sherlock story-split pass 2. |
| The Adventures of Sherlock Holmes.txt | unsafe-start-end-boundary-risk | keep deferred | the-adventure-of-the-engineer-s-thumb | Clean story boundary exists, but this pass stops after the first six standalone stories; defer to Sherlock story-split pass 2. |
| The Adventures of Sherlock Holmes.txt | unsafe-start-end-boundary-risk | keep deferred | the-adventure-of-the-noble-bachelor | Clean story boundary exists, but this pass stops after the first six standalone stories; defer to Sherlock story-split pass 2. |
| The Adventures of Sherlock Holmes.txt | unsafe-start-end-boundary-risk | keep deferred | the-adventure-of-the-beryl-coronet | Clean story boundary exists, but this pass stops after the first six standalone stories; defer to Sherlock story-split pass 2. |
| The Adventures of Sherlock Holmes.txt | unsafe-start-end-boundary-risk | keep deferred | the-adventure-of-the-copper-beeches | Clean story boundary exists, but this pass stops after the first six standalone stories; defer to Sherlock story-split pass 2. |

## Remaining Non-Generated Raw Files By Category

| category | count |
| --- | --- |
| generated-live | 487 |
| generated-then-user-approved-removed | 0 |
| already-handled-by-replacement | 0 |
| duplicate-or-near-duplicate | 3 |
| parent-collection-or-aggregate-not-used | 0 |
| unsafe-start-end-boundary-risk | 20 |
| unsafe-automation-structure | 8 |
| unsafe-metadata-risk | 1 |
| unsafe-title-parent-collection-risk | 1 |
| blocked-source-or-rights-risk | 3 |
| future-bespoke-required | 4 |
| manual-review-required | 0 |
| non-book-or-invalid | 0 |
| removed-or-missing-from-current-raw | 0 |
| unknown-unclassified | 0 |

## Checkpoints

- Starter-preview first-render checkpoint: Local starter previews remain small and are available for immediate first render; no full chapter preview was stored.
- URL/page/indexability blocker checkpoint: URL/page/indexability and planned non-book sitemap work remains a later final-release blocker.
- Mobile final-stage checkpoint: Broad mobile optimization remains the final stage and was not started.
- Recommended next major phase: Sherlock story-split pass 2, because six clean Sherlock story units remain in the same raw collection.

Full per-file reconciliation and deferred candidate details are in the JSON report.
