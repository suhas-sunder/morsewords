# Bespoke raw candidate pass 7

## Summary

- Pass-6 branch merge status: morsewords-bespoke-raw-candidate-pass-6-jun-2026 was merged to main, validated, and pushed before this branch.
- Previous generated count: 514
- Previous SEO summary count: 514
- Previous preview count: 514
- Accepted/generated candidates: the-beach-of-falesa, the-bottle-imp, the-isle-of-voices
- Island Nights' Entertainments decision: split into standalone story pages; parent collection page deferred
- Generated count after branch: 517
- SEO summary count after branch: 517
- Startup preview count after branch: 517
- Missing summary count: 0
- Unknown/unclassified raw count: 0
- Cloudflare export: not run
- Route/UI check: Pass: The Bottle Imp book and audiobook routes rendered from the starter preview without a full loading shell; summary appeared below Source notes; no Unknown author/source or 0 sections text appeared; /morse-code-books and /morse-code-audiobooks showed 517 items; mobile 390px check had no horizontal overflow. Retained behavior was covered by the 39/39 desktop Playwright book-page suite.

## Accepted Story Pages

| slug | decision | sections | words |
| --- | --- | --- | --- |
| the-beach-of-falesa | accept-generated | 5 | 29148 |
| the-bottle-imp | accept-generated | 1 | 12211 |
| the-isle-of-voices | accept-generated | 1 | 8339 |

## Preview Size Range

- New preview character range: 1048-1158

| slug | chars | bytes |
| --- | --- | --- |
| the-beach-of-falesa | 1154 | 1926 |
| the-bottle-imp | 1048 | 1796 |
| the-isle-of-voices | 1158 | 1906 |

## Selected Candidates

| file | oldCategory | decision | slug | reason |
| --- | --- | --- | --- | --- |
| Island Nights' Entertainments.txt | unsafe-start-end-boundary-risk | accept | the-beach-of-falesa | The Project Gutenberg #329 source has explicit collection metadata, a standard END marker, and a clean THE BEACH OF FALESÁ heading followed by five internal chapters before the next story heading. |
| Island Nights' Entertainments.txt | unsafe-start-end-boundary-risk | accept | the-bottle-imp | The Project Gutenberg #329 source has explicit collection metadata, a standard END marker, and a clean THE BOTTLE IMP heading bounded by the surrounding story headings. |
| Island Nights' Entertainments.txt | unsafe-start-end-boundary-risk | accept | the-isle-of-voices | The Project Gutenberg #329 source has explicit collection metadata, a standard END marker, and a clean THE ISLE OF VOICES heading bounded by the collection END marker. |
| Island Nights' Entertainments.txt | unsafe-start-end-boundary-risk | keep deferred | island-nights-entertainments | The collection itself was not generated because the three standalone story units are cleaner public pages and avoid mixing a parent contents page with story-level routes. |
| Emma.txt | unsafe-start-end-boundary-risk | keep deferred | emma | Pass 6 proved the local file ends mid-sentence in Volume II, Chapter VII; no safe end boundary exists. |
| Great Expectations.txt | unsafe-start-end-boundary-risk | keep deferred | great-expectations | Pass 6 proved the local file ends mid-scene in Chapter XXXIX while the complete work continues through Chapter LIX. |
| North and South.txt | unsafe-start-end-boundary-risk | keep deferred | north-and-south | Pass 6 proved the local file only reaches Chapter VI and ends mid-paragraph. |
| Yellow gentians and blue.txt | unsafe-automation-structure | keep deferred | yellow-gentians-and-blue | The file is a mixed collection with poems, prose pieces, plays, and internal title lists; it needs a dedicated section plan. |
| Beowulf - An Anglo-Saxon Epic Poem.txt | unsafe-metadata-risk | keep deferred | beowulf-an-anglo-saxon-epic-poem | The file includes prefatory matter, notes, glossary material, and translator-specific metadata; it should wait for a dedicated epic/translation treatment. |
| The Little Match Girl.txt | unsafe-title-parent-collection-risk | keep deferred | the-little-match-girl | The current raw file is an Andersen Fairy Tales extract that starts with The Dream of Little Tuk, which is already generated; it is not The Little Match Girl. |

## Remaining Non-Generated Raw Files By Category

| category | count |
| --- | --- |
| generated-live | 494 |
| generated-then-user-approved-removed | 0 |
| already-handled-by-replacement | 0 |
| duplicate-or-near-duplicate | 3 |
| parent-collection-or-aggregate-not-used | 0 |
| unsafe-start-end-boundary-risk | 18 |
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
- Section/content result for new books: Pass: The Beach of Falesá has 5 usable chapters; The Bottle Imp and The Isle of Voices each have 1 usable story section; all accepted pages have readable starter previews and no 0-section output.
- Metadata completeness result for new books: Pass: All accepted story pages have accurate title, Robert Louis Stevenson author metadata, Project Gutenberg source name, source URL https://www.gutenberg.org/ebooks/329, nonzero section counts, word counts, publish-ready rights metadata, and approved/generated route coverage.
- Book-section/content audit checkpoint: New accepted books have readable starter content and nonzero usable sections; broad all-book section/content audit remains before Cloudflare export.
- Metadata/source consistency audit checkpoint: New accepted story metadata and Project Gutenberg #329 source URLs were verified in this pass; full metadata/source consistency audit remains before and after Cloudflare export.
- Post-export chapter/nav/view-window review checkpoint: Final chapter/nav/view-window review was not started and must wait until after Cloudflare export.
- Sources page trust-copy checkpoint: Sources page trust-copy work was not started and remains for the later content-quality stage.
- About/E-E-A-T copy checkpoint: About/E-E-A-T copy improvement was not started and remains for the later GSC/meta/content-quality stage.
- Repeated-helper-copy/content-quality checkpoint: Repeated helper-copy/AI-footprint reduction was not started and remains for the later content-quality stage.
- URL/page/indexability blocker checkpoint: URL/page/indexability and planned non-book sitemap work remains a later final-release blocker.
- Mobile final-stage checkpoint: Broad mobile optimization remains the final stage and was not started.
- Recommended next major phase: bespoke/manual raw candidate pass 8, because several recoverable but larger boundary and automation-structure candidates still remain.

## Validation

| check | result |
| --- | --- |
| typecheck | pass |
| seoSummaryAudit | pass: 517/517 summaries, 0 missing |
| batch12ProseRestore | pass |
| startupPreviewAudit | pass: 517 valid previews |
| titleStartDefaultAudit | pass: 517 generated books audited; unrelated generated/preview churn restored before commit |
| metadataSegmentationAudit | pass: 517 generated books audited, 0 accepted books revoked |
| manualUiDefectFollowup | pass: 8 checked, 8 acceptable |
| independentSecondPassAudit | pass: 517 generated books, 517 previews, 0 fail-needs-fix |
| linkingSitemapAudit | pass: 517 book URLs and 517 audiobook URLs |
| testIfPresent | pass: 23/23 smoke tests |
| buildNetlify | pass |
| playwrightBookPage | pass: 39/39 desktop-chromium |
| gitDiffCheck | pass: no whitespace errors; line-ending notices only |

Full per-file reconciliation and deferred candidate details are in the JSON report.
