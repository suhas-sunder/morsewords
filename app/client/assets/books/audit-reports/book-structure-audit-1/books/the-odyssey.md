# the-odyssey

- Source: `app/client/assets/temp-books/The Odyssey.txt`
- Title: The Odyssey
- Author: Homer
- Raw words: 133268
- Detected convention: book divisions
- Confidence: high (0.993)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| book-division | 49 | 25 | 24 | yes |  |
| all-caps-title | 58 | 50 | 8 | no | weaker than selected strategy book-division |
| isolated-title-case | 32 | 30 | 0 | no | weaker than selected strategy book-division |
| arabic-numbered-title | 2 | 2 | 0 | no | weaker than selected strategy book-division |
| roman-numbered-title | 1 | 1 | 0 | no | weaker than selected strategy book-division |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L223: Book i., is continued to the end of Book iv., and not resumed till
- L334: BOOK I
- L698: BOOK II
- L1072: BOOK III
- L1497: BOOK IV
- L2225: BOOK V
- L2630: BOOK VI
- L2928: BOOK VII

## Rejected TOC-like Examples

- L16: BOOK I.
- L17: BOOK II.
- L18: BOOK III.
- L19: BOOK IV.
- L20: BOOK V.
- L21: BOOK VI.
- L22: BOOK VII.
- L23: BOOK VIII.

## Section Size Sanity

- Sections: 25
- Min/median/max words: 936/4630/14337
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
