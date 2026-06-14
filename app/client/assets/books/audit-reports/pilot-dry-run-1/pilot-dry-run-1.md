# Pilot Book Processing Dry Run 1

Generated: 2026-06-14T15:59:40.569Z

This is a review-only dry run for the exact 10-book pilot batch from audit pass 2. It does not write final generated books, raw source books, or Cloudflare exports.

## Pilot Books Processed

- almayer-s-folly-a-story-of-an-eastern-river
- the-house-without-a-key
- the-lerouge-case
- a-dream-of-armageddon
- a-journey-to-the-centre-of-the-earth
- a-journal-of-the-plague-year
- dracula
- a-christmas-carol
- dr-jekyll-and-mr-hyde
- a-catastrophe

## Per-Book Recommendation Table

| Slug | Pass-2 risk | Sections | Kept words | Dry-run recommendation | Preview feasible |
| --- | --- | ---: | ---: | --- | --- |
| almayer-s-folly-a-story-of-an-eastern-river | low | 12 | 62806 | safe to process later | yes |
| the-house-without-a-key | low | 23 | 83178 | safe to process later | yes |
| the-lerouge-case | low | 20 | 124646 | safe to process later | yes |
| a-dream-of-armageddon | medium | 3 | 10186 | process later with warnings | yes |
| a-journey-to-the-centre-of-the-earth | medium | 44 | 85891 | process later with warnings | yes |
| a-journal-of-the-plague-year | medium | 15 | 68606 | process later with warnings | yes |
| dracula | medium | 28 | 162386 | process later with warnings | yes |
| a-christmas-carol | high | 7 | 28607 | needs individual review | yes |
| dr-jekyll-and-mr-hyde | high | 6 | 25881 | needs individual review | yes |
| a-catastrophe | high | 2 | 3189 | needs individual review | yes |

## Safe To Process Later

- almayer-s-folly-a-story-of-an-eastern-river
- the-house-without-a-key
- the-lerouge-case

## Process Later With Warnings

- a-dream-of-armageddon
- a-journey-to-the-centre-of-the-earth
- a-journal-of-the-plague-year
- dracula

## Needs Individual Review

- a-christmas-carol
- dr-jekyll-and-mr-hyde
- a-catastrophe

## Blocked

- None.

## Most Common Cleanup Issues

| Issue | Books | Examples |
| --- | ---: | --- |
| normalize-smart-quotes | 6 | the-lerouge-case<br>a-dream-of-armageddon<br>a-journal-of-the-plague-year<br>dracula<br>dr-jekyll-and-mr-hyde<br>a-catastrophe |
| remove-page-and-decorative-lines | 5 | almayer-s-folly-a-story-of-an-eastern-river<br>a-journey-to-the-centre-of-the-earth<br>a-journal-of-the-plague-year<br>dracula<br>a-catastrophe |
| normalize-em-en-dashes | 4 | a-dream-of-armageddon<br>a-journal-of-the-plague-year<br>dr-jekyll-and-mr-hyde<br>a-catastrophe |
| remove-numbered-reference-markers | 3 | a-journey-to-the-centre-of-the-earth<br>a-journal-of-the-plague-year<br>a-catastrophe |
| suspiciously-short-sections | 3 | a-dream-of-armageddon<br>a-journal-of-the-plague-year<br>a-christmas-carol |
| remove-image-placeholders | 2 | a-journey-to-the-centre-of-the-earth<br>a-journal-of-the-plague-year |

## Most Common Boundary Risks

| Risk | Books | Examples |
| --- | ---: | --- |
| boundary-or-real-content-risk | 7 | a-dream-of-armageddon<br>a-journey-to-the-centre-of-the-earth<br>a-journal-of-the-plague-year<br>dracula<br>a-christmas-carol<br>dr-jekyll-and-mr-hyde<br>a-catastrophe |
| existing-generated-output-warning | 3 | dracula<br>a-christmas-carol<br>dr-jekyll-and-mr-hyde |
| low-confidence-preview-source | 3 | a-christmas-carol<br>dr-jekyll-and-mr-hyde<br>a-catastrophe |
| pass-2-high-risk | 3 | a-christmas-carol<br>dr-jekyll-and-mr-hyde<br>a-catastrophe |

## Existing Generated Output Damage

- dracula: suspiciously short generated sections
- a-christmas-carol: starts too early; generated intro contains real chapter content; no default included sections; suspiciously short generated sections
- dr-jekyll-and-mr-hyde: starts too early; generated intro contains real chapter content; no default included sections

## Processor Safety Assessment

- Seems safe enough for a real pilot write pass: yes
- Reason: The dry run produced reviewable outputs for all 10 pilot books with no blocked sources and enough safe/warning candidates for a controlled write pass.
- Recommended next step: Run a real pilot write pass only for the safe/warning subset first, keeping high-risk books in individual review.

## Protected Folder Confirmation

- `app/client/assets/temp-books` was read but not modified.
- `app/client/assets/books/generated` was read for comparison but not modified.
- `app/client/assets/books/cloudflare-export` was not modified.
- Candidate outputs are review-only and live only under `app/client/assets/books/audit-reports/pilot-dry-run-1`.
