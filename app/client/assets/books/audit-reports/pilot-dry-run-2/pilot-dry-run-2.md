# Pilot Book Processing Dry Run 2

Generated: 2026-06-15T03:43:22.658Z

This is a review-only dry run for the second carefully selected pilot batch. It uses the pass-1, pass-2, pilot dry-run 1, pilot write 1, and pilot write 1 verification reports as inputs. It does not write final generated books, public preview assets, raw source books, or Cloudflare exports.

## Pilot Books Processed

- anne-of-green-gables
- pointed-roofs
- the-lost-world
- the-red-thumb-mark
- violet-fairy-book
- jack-and-jill
- the-wonderful-wizard-of-oz
- the-legend-of-sleepy-hollow
- four-day-planet
- room-13
- the-octopus-a-story-of-california
- the-prince-and-the-pauper
- triplanetary
- the-call-of-the-wild

## Per-Book Recommendation Table

| Slug | Pass-2 risk | Structure | Structure status | Sections | Kept words | Dry-run recommendation | Preview feasible | Why selected |
| --- | --- | --- | --- | ---: | ---: | --- | --- | --- |
| anne-of-green-gables | medium | chapter-based roman numerals | pass | 38 | 106496 | process later with warnings | yes | Medium-risk book with high-confidence boundaries, an isolated TOC, an existing generated output for comparison, and a feasible preview source. |
| pointed-roofs | medium | standalone arabic-numbered sections | warn | 81 | 57428 | process later with warnings | yes | Medium-risk book with high-confidence start/end boundaries and a useful transcriber/printer-note edge case to verify end-matter handling. |
| the-lost-world | medium | chapter-based roman numerals | pass | 17 | 76065 | process later with warnings | yes | Medium-risk prose novel with high-confidence boundaries, isolated TOC handling, no existing generated output, and a feasible preview source. |
| the-red-thumb-mark | medium | chapter-based roman numerals | pass | 18 | 70636 | process later with warnings | yes | Medium-risk mystery with a real preface to preserve, high-confidence boundaries, and manageable TOC cleanup. |
| violet-fairy-book | medium | isolated titled sections | pass | 42 | 103256 | process later with warnings | yes | Medium-risk story collection with a real preface and many sections, selected to check collection-style section splitting without severe artifact risk. |
| jack-and-jill | medium | chapter-based roman numerals | pass | 24 | 92885 | process later with warnings | yes | Medium-risk generated-output comparison case with high-confidence boundaries and isolated TOC cleanup. |
| the-wonderful-wizard-of-oz | medium | chapter-based roman numerals | pass | 24 | 39535 | process later with warnings | yes | Medium-risk generated-output comparison case with image placeholder cleanup and high-confidence readable boundaries. |
| the-legend-of-sleepy-hollow | medium | story or titled-section headings | warn | 5 | 12260 | process later with warnings | yes | Medium-risk short work with a medium-confidence opening epigraph, selected as a controlled boundary review case. |
| four-day-planet | medium | standalone arabic-numbered sections | pass | 21 | 57856 | process later with warnings | yes | Medium-risk science-fiction novel with dedication/TOC/transcriber-note cleanup signals and high-confidence boundaries. |
| room-13 | medium | chapter-based roman numerals | pass | 33 | 61369 | process later with warnings | yes | Medium-risk novel with high-confidence boundaries and an end-note/correction edge case that should remain reviewable before writing. |
| the-octopus-a-story-of-california | medium | chapter-based roman numerals with book divisions | warn | 12 | 196863 | process later with warnings | yes | Medium-risk long novel with clear book/chapter structure, selected to test large but structured processing. |
| the-prince-and-the-pauper | medium | chapter-based roman numerals | pass | 33 | 70180 | process later with warnings | yes | Medium-risk novel with high-confidence boundaries plus footnote/reference cleanup that should be reviewed before writing. |
| triplanetary | medium | chapter-based roman numerals | pass | 13 | 57430 | process later with warnings | yes | Medium-risk science-fiction novel with high-confidence boundaries and illustration placeholder cleanup. |
| the-call-of-the-wild | medium | chapter-based roman numerals | pass | 7 | 32114 | process later with warnings | yes | Medium-risk generated-output comparison case with high-confidence boundaries and a feasible first-hour preview source. |

## Safe To Process Later

- None.

## Process Later With Warnings

- anne-of-green-gables
- pointed-roofs
- the-lost-world
- the-red-thumb-mark
- violet-fairy-book
- jack-and-jill
- the-wonderful-wizard-of-oz
- the-legend-of-sleepy-hollow
- four-day-planet
- room-13
- the-octopus-a-story-of-california
- the-prince-and-the-pauper
- triplanetary
- the-call-of-the-wild

## Needs Individual Review

- None.

## Blocked

- None.

## Most Common Cleanup Issues

| Issue | Books | Examples |
| --- | ---: | --- |
| normalize-smart-quotes | 9 | anne-of-green-gables<br>violet-fairy-book<br>jack-and-jill<br>the-wonderful-wizard-of-oz<br>the-legend-of-sleepy-hollow<br>room-13<br>the-octopus-a-story-of-california<br>the-prince-and-the-pauper |
| remove-page-and-decorative-lines | 5 | jack-and-jill<br>four-day-planet<br>room-13<br>the-octopus-a-story-of-california<br>triplanetary |
| suspiciously-short-sections | 4 | pointed-roofs<br>violet-fairy-book<br>the-wonderful-wizard-of-oz<br>the-legend-of-sleepy-hollow |
| normalize-em-en-dashes | 2 | the-wonderful-wizard-of-oz<br>the-call-of-the-wild |
| remove-image-placeholders | 1 | triplanetary |
| suspiciously-long-sections | 1 | the-octopus-a-story-of-california |

## Most Common Boundary Risks

| Risk | Books | Examples |
| --- | ---: | --- |
| existing-generated-output-warning | 4 | jack-and-jill<br>the-wonderful-wizard-of-oz<br>the-legend-of-sleepy-hollow<br>the-call-of-the-wild |
| boundary-or-real-content-risk | 3 | the-legend-of-sleepy-hollow<br>four-day-planet<br>the-octopus-a-story-of-california |
| structure-warn | 3 | pointed-roofs<br>the-legend-of-sleepy-hollow<br>the-octopus-a-story-of-california |

## Existing Generated Output Damage

- jack-and-jill: suspiciously short generated sections
- the-wonderful-wizard-of-oz: suspiciously short generated sections
- the-legend-of-sleepy-hollow: no default included sections; suspiciously short generated sections
- the-call-of-the-wild: suspiciously short generated sections

## Processor Safety Assessment

- Seems safe enough for a real pilot write pass: yes
- Reason: The dry run produced reviewable outputs for the selected second-batch books with no blocked sources and enough safe/warning candidates for a controlled write pass.
- Recommended next step: Run a real pilot write pass only for the safe/warning subset from dry-run 2, excluding any individual-review or blocked books.

## Exact Recommendation For Next Write Pass

- Write with warning review: anne-of-green-gables
- Write with warning review: pointed-roofs
- Write with warning review: the-lost-world
- Write with warning review: the-red-thumb-mark
- Write with warning review: violet-fairy-book
- Write with warning review: jack-and-jill
- Write with warning review: the-wonderful-wizard-of-oz
- Write with warning review: the-legend-of-sleepy-hollow
- Write with warning review: four-day-planet
- Write with warning review: room-13
- Write with warning review: the-octopus-a-story-of-california
- Write with warning review: the-prince-and-the-pauper
- Write with warning review: triplanetary
- Write with warning review: the-call-of-the-wild

## Protected Folder Confirmation

- `app/client/assets/temp-books` was read but not modified.
- `app/client/assets/books/generated` was read for comparison but not modified.
- `app/client/assets/books/cloudflare-export` was not modified.
- Candidate outputs are review-only and live only under `app/client/assets/books/audit-reports/pilot-dry-run-2`.
