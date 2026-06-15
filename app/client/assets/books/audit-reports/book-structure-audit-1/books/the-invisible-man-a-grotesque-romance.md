# the-invisible-man-a-grotesque-romance

- Source: `app/client/assets/temp-books/The Invisible Man - A Grotesque Romance.txt`
- Title: The Invisible Man: A Grotesque Romance
- Author: H. G. Wells
- Raw words: 52851
- Detected convention: chapter-based roman numerals
- Confidence: high (0.95)
- Recommended handling: safe for normal processing
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 28 | 28 | 0 | yes |  |
| all-caps-title | 29 | 29 | 0 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 34 | 28 | 5 | no | weaker than selected strategy chapter-roman |
| roman-numbered-title | 29 | 1 | 28 | no | weaker than selected strategy chapter-roman |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L44: CHAPTER I.
- L259: CHAPTER II.
- L467: CHAPTER III.
- L676: CHAPTER IV.
- L904: CHAPTER V.
- L991: CHAPTER VI.
- L1140: CHAPTER VII.
- L1480: CHAPTER VIII.

## Rejected TOC-like Examples

- L41: The Epilogue
- L816: “Well?”
- L844: “Well?”
- L855: “Well?”
- L881: “Well?”
- L13: I. The strange Man’s Arrival
- L14: II. Mr. Teddy Henfrey’s first Impressions
- L15: III. The thousand and one Bottles
- L16: IV. Mr. Cuss interviews the Stranger
- L17: V. The Burglary at the Vicarage

## Section Size Sanity

- Sections: 28
- Min/median/max words: 163/1781/3526
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
