# pride-and-prejudice

- Source: `app/client/assets/temp-books/Pride and Prejudice.txt`
- Title: Pride and Prejudice
- Author: Jane Austen
- Raw words: 131539
- Detected convention: chapter-based roman numerals
- Confidence: high (0.95)
- Recommended handling: safe for normal processing
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 61 | 61 | 0 | yes |  |
| all-caps-title | 21 | 13 | 8 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 272 | 178 | 94 | no | weaker than selected strategy chapter-roman |
| roman-numbered-title | 1 | 1 | 0 | no | weaker than selected strategy chapter-roman |

## Body Heading Examples

- L656: Chapter I.]
- L789: CHAPTER II.
- L906: CHAPTER III.
- L1093: CHAPTER IV.
- L1211: CHAPTER V.
- L1334: CHAPTER VI.
- L1613: CHAPTER VII.
- L1865: CHAPTER VIII.

## Rejected TOC-like Examples

- L4: PUBLISHER
- L6: 156 CHARING CROSS ROAD
- L7: LONDON
- L9: RUSKIN HOUSE
- L18: PRIDE.
- L20: PREJUDICE
- L40: CHISWICK PRESS:--CHARLES WHITTINGHAM AND CO.
- L41: TOOKS COURT, CHANCERY LANE, LONDON.
- L1: [Illustration:
- L12: [Illustration:

## Section Size Sanity

- Sections: 61
- Min/median/max words: 684/1846/5236
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- Manifest: `app/client/assets/books/generated/pride-and-prejudice/manifest.json`
- Sections: 62
- Included sections: 61
- Rights have not been reviewed; generated book is not publish-ready.
- Rights basis "unknown" is not publish-ready.
- Rights gate status is needs_manual_review; generated book is not publish-ready.
- Rights gate did not allow processed public story output.
- Owner-reviewed website approval is missing.
- Website publication is not allowed by the active approval path.

## Red Flags

- None.
