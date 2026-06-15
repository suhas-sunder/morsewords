# the-mystery-of-edwin-drood

- Source: `app/client/assets/temp-books/The Mystery of Edwin Drood.txt`
- Title: The Mystery of Edwin Drood
- Author: Charles Dickens
- Raw words: 100385
- Detected convention: chapter-based roman numerals
- Confidence: high (1)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 46 | 23 | 23 | yes |  |
| all-caps-title | 40 | 30 | 10 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 125 | 114 | 9 | no | weaker than selected strategy chapter-roman |
| roman-only | 1 | 1 | 0 | no | weaker than selected strategy chapter-roman |
| arabic-only | 1 | 1 | 0 | no | weaker than selected strategy chapter-roman |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L38: CHAPTER I.
- L177: CHAPTER II.
- L714: CHAPTER III.
- L1275: CHAPTER IV.
- L1690: CHAPTER V.
- L1992: CHAPTER VI.
- L2416: CHAPTER VII.
- L2844: CHAPTER VIII.

## Rejected TOC-like Examples

- L8: CHAPTER I. THE DAWN
- L9: CHAPTER II. A DEAN, AND A CHAPTER ALSO
- L10: CHAPTER III. THE NUNS’ HOUSE
- L11: CHAPTER IV. MR. SAPSEA
- L12: CHAPTER V. MR. DURDLES AND FRIEND
- L13: CHAPTER VI. PHILANTHROPY IN MINOR CANON CORNER
- L14: CHAPTER VII. MORE CONFIDENCES THAN ONE
- L15: CHAPTER VIII. DAGGERS DRAWN

## Section Size Sanity

- Sections: 23
- Min/median/max words: 1271/4012/8102
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
