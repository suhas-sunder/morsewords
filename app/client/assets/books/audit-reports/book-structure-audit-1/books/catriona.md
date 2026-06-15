# catriona

- Source: `app/client/assets/temp-books/Catriona.txt`
- Title: Catriona
- Author: Robert Louis Stevenson
- Raw words: 105506
- Detected convention: chapter-based roman numerals with part divisions
- Confidence: high (1)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 60 | 30 | 30 | yes |  |
| all-caps-title | 36 | 34 | 1 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 36 | 34 | 1 | no | weaker than selected strategy chapter-roman |
| part-division | 4 | 2 | 2 | no | weaker than selected strategy chapter-roman |
| roman-only | 5 | 4 | 1 | no | weaker than selected strategy chapter-roman |
| roman-numbered-title | 2 | 2 | 0 | no | weaker than selected strategy chapter-roman |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L89: CHAPTER I.
- L425: CHAPTER II.
- L781: CHAPTER III.
- L1054: CHAPTER IV.
- L1483: CHAPTER V.
- L1751: CHAPTER VI.
- L1996: CHAPTER VII.
- L2413: CHAPTER VIII.

## Rejected TOC-like Examples

- L9: CHAPTER I. A BEGGAR ON HORSEBACK
- L10: CHAPTER II. THE HIGHLAND WRITER
- L11: CHAPTER III. I GO TO PILRIG
- L12: CHAPTER IV. LORD ADVOCATE PRESTONGRANGE
- L13: CHAPTER V. IN THE ADVOCATE’S HOUSE
- L14: CHAPTER VI. UMQUILE THE MASTER OF LOVAT
- L15: CHAPTER VII. I MAKE A FAULT IN HONOUR
- L16: CHAPTER VIII. THE BRAVO

## Section Size Sanity

- Sections: 30
- Min/median/max words: 2125/3401/6371
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
