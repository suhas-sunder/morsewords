# Bespoke raw candidate pass 2

## Summary

- Source-risk removal/raw-gap branch merge status: morsewords-bespoke-raw-candidate-pass-1-jun-2026 was merged to main and pushed before this branch.
- Previous generated count: 491
- Previous SEO summary count: 491
- Previous preview count: 491
- Accepted/generated candidates: the-happy-prince, the-nightingale-and-the-rose, the-selfish-giant, the-devoted-friend, the-remarkable-rocket
- Generated count after branch: 496
- SEO summary count after branch: 496
- Startup preview count after branch: 496
- Missing summary count: 0
- Unknown/unclassified raw count: 0
- Cloudflare export: not run

## Selected Candidates

| file | oldCategory | decision | slug | reason |
| --- | --- | --- | --- | --- |
| The Happy Prince, and Other Tales.txt | unsafe-start-end-boundary-risk | accept | the-happy-prince | Clean individual story from a compact Project Gutenberg collection; boundaries are clear between titled stories. |
| The Happy Prince, and Other Tales.txt | unsafe-start-end-boundary-risk | accept | the-nightingale-and-the-rose | Clean individual story from a compact Project Gutenberg collection; boundaries are clear between titled stories. |
| The Happy Prince, and Other Tales.txt | unsafe-start-end-boundary-risk | accept | the-selfish-giant | Clean individual story from a compact Project Gutenberg collection; boundaries are clear between titled stories. |
| The Happy Prince, and Other Tales.txt | unsafe-start-end-boundary-risk | accept | the-devoted-friend | Clean individual story from a compact Project Gutenberg collection; boundaries are clear between titled stories. |
| The Happy Prince, and Other Tales.txt | unsafe-start-end-boundary-risk | accept | the-remarkable-rocket | Clean final story from a compact Project Gutenberg collection; the end boundary is before printer matter and license text. |
| The Little Match Girl.txt | unsafe-title-parent-collection-risk | keep deferred | the-little-match-girl | The current file starts with The Dream of Little Tuk, not The Little Match Girl; generated library already contains the-dream-of-little-tuk. |
| The Adventures of Sherlock Holmes.txt | unsafe-start-end-boundary-risk | keep deferred | the-adventures-of-sherlock-holmes | Large twelve-story collection is practical but too broad for this five-story pass; defer to a dedicated Sherlock story-split pass. |
| Yellow gentians and blue.txt | unsafe-automation-structure | keep deferred | yellow-gentians-and-blue | Larger mixed poetry/prose structure still needs manual section planning beyond this story-split pass. |
| Beowulf - An Anglo-Saxon Epic Poem.txt | unsafe-metadata-risk | keep deferred | beowulf-an-anglo-saxon-epic-poem | Epic translation metadata and sectioning need a dedicated source/translator review before generation. |
| THE APPLE.txt | blocked-source-or-rights-risk | keep deferred | the-apple | No Project Gutenberg header or current repo evidence resolves source/provenance risk. |
| THE STORY OF THE LATE MR. ELVESHAM.txt | blocked-source-or-rights-risk | keep deferred | the-story-of-the-late-mr-elvesham | No Project Gutenberg header or current repo evidence resolves source/provenance risk. |

## Remaining Non-Generated Raw Files By Category

| category | count |
| --- | --- |
| generated-live | 486 |
| generated-then-user-approved-removed | 0 |
| already-handled-by-replacement | 0 |
| duplicate-or-near-duplicate | 3 |
| parent-collection-or-aggregate-not-used | 0 |
| unsafe-start-end-boundary-risk | 21 |
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
- Recommended next major phase: bespoke/manual raw candidate pass 3, because recoverable boundary and automation-structure candidates still remain.

Full per-file reconciliation and deferred candidate details are in the JSON report.
