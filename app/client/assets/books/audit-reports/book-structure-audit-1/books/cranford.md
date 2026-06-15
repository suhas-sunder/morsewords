# cranford

- Source: `app/client/assets/temp-books/Cranford.txt`
- Title: Cranford
- Author: Elizabeth Cleghorn Gaskell
- Raw words: 75436
- Detected convention: chapter-based roman numerals
- Confidence: high (1)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 32 | 16 | 16 | yes |  |
| all-caps-title | 21 | 20 | 1 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 30 | 24 | 6 | no | weaker than selected strategy chapter-roman |
| arabic-only | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L76: CHAPTER I.
- L462: CHAPTER II.
- L991: CHAPTER III.
- L1314: CHAPTER IV.
- L1760: CHAPTER V.
- L2125: CHAPTER VI.
- L2556: CHAPTER VII.
- L2930: CHAPTER VIII.

## Rejected TOC-like Examples

- L25: CHAPTER I. OUR SOCIETY
- L26: CHAPTER II. THE CAPTAIN
- L27: CHAPTER III. A LOVE AFFAIR OF LONG AGO
- L28: CHAPTER IV. A VISIT TO AN OLD BACHELOR
- L29: CHAPTER V. OLD LETTERS
- L30: CHAPTER VI. POOR PETER
- L31: CHAPTER VII. VISITING
- L32: CHAPTER VIII. “YOUR LADYSHIP”

## Section Size Sanity

- Sections: 16
- Min/median/max words: 3014/4448/7023
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
