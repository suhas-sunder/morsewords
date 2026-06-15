# the-arabian-nights

- Source: `app/client/assets/temp-books/the-arabian-nights.txt`
- Title: The Arabian Nights: Their Best-known Tales
- Author: unknown
- Raw words: 118085
- Detected convention: story or titled-section headings
- Confidence: high (0.831)
- Recommended handling: needs manual sectioning review
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| all-caps-title | 56 | 22 | 34 | yes |  |
| isolated-title-case | 22 | 14 | 8 | no | not selected because another strategy better spans the readable body |
| special-front-back | 2 | 1 | 1 | no | weaker than selected strategy all-caps-title |
| roman-only | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L8: ARABIAN NIGHTS
- L210: PRINCE AGIB 194
- L216: PRINCE AGIB 202
- L221: THE CITY OF BRASS 218
- L242: THIRD VOYAGE OF SINBAD 306
- L277: THE TALKING BIRD, THE SINGING TREE, AND THE GOLDEN WATER
- L1763: THE STORY OF THE FISHERMAN AND THE GENIE
- L2242: THE HISTORY OF THE YOUNG KING OF THE BLACK ISLES

## Rejected TOC-like Examples

- L4: THE ARABIAN NIGHTS
- L10: THEIR BEST-KNOWN TALES
- L12: EDITED BY
- L14: KATE DOUGLAS WIGGIN
- L16: NORA A. SMITH
- L18: ILLUSTRATED BY MAXFIELD PARRISH
- L20: NEW YORK
- L21: CHARLES SCRIBNER'S SONS

## Section Size Sanity

- Sections: 22
- Min/median/max words: 21/2662/31436
- Notes: 1 section(s) exceed 18000 words; largest section is much bigger than the median section

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- Manifest: `app/client/assets/books/generated/the-arabian-nights/manifest.json`
- Sections: 23
- Included sections: 0
- No chapter headings were detected; generated fallback parts instead.
- Rights have not been reviewed; generated book is not publish-ready.
- Rights basis "unknown" is not publish-ready.
- Rights gate status is needs_manual_review; generated book is not publish-ready.
- Rights gate did not allow processed public story output.
- Owner-reviewed website approval is missing.
- Website publication is not allowed by the active approval path.

## Red Flags

- long book has huge sections despite detected headings
- TOC/body confusion is likely
