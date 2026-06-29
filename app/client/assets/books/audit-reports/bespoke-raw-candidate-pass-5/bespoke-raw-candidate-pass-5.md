# Bespoke raw candidate pass 5

## Summary

- Pass-4 branch merge status: morsewords-bespoke-raw-candidate-pass-4-jun-2026 was merged to main and pushed before this branch.
- Previous generated count: 511
- Previous SEO summary count: 511
- Previous preview count: 511
- Accepted/generated candidates: an-enquiry-concerning-human-understanding, middlemarch, the-financier
- Generated count after branch: 514
- SEO summary count after branch: 514
- Startup preview count after branch: 514
- Missing summary count: 0
- Unknown/unclassified raw count: 0
- Cloudflare export: not run

## Selected Candidates

| file | oldCategory | decision | slug | reason |
| --- | --- | --- | --- | --- |
| An Enquiry Concerning Human Understanding.txt | unsafe-start-end-boundary-risk | accept | an-enquiry-concerning-human-understanding | Project Gutenberg provenance is explicit, and the main text has twelve clearly bounded SECTION headings after the contents block. |
| Middlemarch.txt | unsafe-automation-structure | accept | middlemarch | Project Gutenberg provenance is explicit, and the novel has a regular PRELUDE, CHAPTER I-LXXXVI, and FINALE structure after the contents block. |
| The Financier.txt | unsafe-automation-structure | accept | the-financier | Project Gutenberg provenance is explicit, and the novel has a clean Chapter I through Chapter LIX body after the contents list. |
| Emma.txt | unsafe-start-end-boundary-risk | keep deferred | emma | The source metadata is clear, but this local file does not expose a standard Gutenberg END marker; defer until a dedicated boundary check can prove the safe terminal cut. |
| Great Expectations.txt | unsafe-start-end-boundary-risk | keep deferred | great-expectations | The source metadata is clear, but this local file does not expose a standard Gutenberg END marker; defer until a dedicated boundary check can prove the safe terminal cut. |
| North and South.txt | unsafe-start-end-boundary-risk | keep deferred | north-and-south | The source metadata is clear, but this local file does not expose a standard Gutenberg END marker; defer until a dedicated boundary check can prove the safe terminal cut. |
| Island Nights' Entertainments.txt | unsafe-start-end-boundary-risk | keep deferred | island-nights-entertainments | The source metadata is clear, but the file is a three-story collection with internal chaptering; defer to a collection/story-unit plan rather than mixing story and chapter boundaries in this pass. |
| Yellow gentians and blue.txt | unsafe-automation-structure | keep deferred | yellow-gentians-and-blue | The file is a mixed collection with poems, prose pieces, plays, and internal title lists; it needs a dedicated section plan rather than a small full-book extraction. |
| Beowulf - An Anglo-Saxon Epic Poem.txt | unsafe-metadata-risk | keep deferred | beowulf-an-anglo-saxon-epic-poem | The file includes prefatory matter, notes, glossary material, and translator-specific metadata; it should wait for a dedicated epic/translation treatment. |
| The Little Match Girl.txt | unsafe-title-parent-collection-risk | keep deferred | the-little-match-girl | The current raw file is an Andersen Fairy Tales extract that starts with The Dream of Little Tuk, which is already generated; it is not The Little Match Girl. |

## Remaining Non-Generated Raw Files By Category

| category | count |
| --- | --- |
| generated-live | 493 |
| generated-then-user-approved-removed | 0 |
| already-handled-by-replacement | 0 |
| duplicate-or-near-duplicate | 3 |
| parent-collection-or-aggregate-not-used | 0 |
| unsafe-start-end-boundary-risk | 19 |
| unsafe-automation-structure | 3 |
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
- Recommended next major phase: bespoke/manual raw candidate pass 6, because several recoverable but larger boundary and automation-structure candidates still remain.

Full per-file reconciliation and deferred candidate details are in the JSON report.
