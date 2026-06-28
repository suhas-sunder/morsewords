# Bespoke raw candidate pass 1

## Summary

- Source-risk removal/raw-gap branch merge status: morsewords-source-risk-removal-and-raw-gap-audit-jun-2026 was merged to main and pushed before this branch.
- Previous generated count: 488
- Previous SEO summary count: 488
- Previous preview count: 488
- Accepted/generated candidates: five-little-friends, snow-white-and-rose-red, the-history-of-dwarf-long-nose
- Generated count after branch: 491
- SEO summary count after branch: 491
- Startup preview count after branch: 491
- Missing summary count: 0
- Unknown/unclassified raw count: 0
- Cloudflare export: not run

## Selected Candidates

| file | oldCategory | decision | slug | reason |
| --- | --- | --- | --- | --- |
| Five Little Friends.txt | unsafe-start-end-boundary-risk | accept | five-little-friends | Short, clean Project Gutenberg children's book with two explicit story sections and no nested-book complexity. |
| SNOW-WHITE AND ROSE-RED.txt | unsafe-start-end-boundary-risk | accept | snow-white-and-rose-red | Short standalone story with a clear title heading and an obvious post-story biography block to exclude. |
| THE HISTORY OF DWARF LONG NOSE.txt | unsafe-title-parent-collection-risk | accept | the-history-of-dwarf-long-nose | The current raw file contains only this story after the Project Gutenberg header; the parent collection title was the automation risk. |
| The Little Match Girl.txt | unsafe-title-parent-collection-risk | keep deferred | the-little-match-girl | The current file starts with The Dream of Little Tuk, not The Little Match Girl; generated library already contains the-dream-of-little-tuk. |
| The Happy Prince, and Other Tales.txt | unsafe-start-end-boundary-risk | keep deferred | the-happy-prince-and-other-tales | Collection requires a separate story/section decision pass rather than a quick single-boundary extraction. |
| The Adventures of Sherlock Holmes.txt | unsafe-start-end-boundary-risk | keep deferred | the-adventures-of-sherlock-holmes | Large twelve-story collection should be handled in a dedicated bespoke structural pass. |
| Yellow gentians and blue.txt | unsafe-automation-structure | keep deferred | yellow-gentians-and-blue | Larger poetry/prose structure needs manual section planning beyond this first small pass. |
| Beowulf - An Anglo-Saxon Epic Poem.txt | unsafe-metadata-risk | keep deferred | beowulf-an-anglo-saxon-epic-poem | Epic translation metadata and sectioning need a dedicated source/translator review before generation. |
| THE APPLE.txt | blocked-source-or-rights-risk | keep deferred | the-apple | No Project Gutenberg header or current repo evidence resolves source/provenance risk. |
| THE STORY OF THE LATE MR. ELVESHAM.txt | blocked-source-or-rights-risk | keep deferred | the-story-of-the-late-mr-elvesham | No Project Gutenberg header or current repo evidence resolves source/provenance risk. |

## Remaining Non-Generated Raw Files By Category

| category | count |
| --- | --- |
| generated-live | 485 |
| generated-then-user-approved-removed | 0 |
| already-handled-by-replacement | 0 |
| duplicate-or-near-duplicate | 3 |
| parent-collection-or-aggregate-not-used | 0 |
| unsafe-start-end-boundary-risk | 22 |
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
- Recommended next major phase: bespoke/manual raw candidate pass 2, because recoverable boundary and automation-structure candidates still remain.

Full per-file reconciliation and deferred candidate details are in the JSON report.
