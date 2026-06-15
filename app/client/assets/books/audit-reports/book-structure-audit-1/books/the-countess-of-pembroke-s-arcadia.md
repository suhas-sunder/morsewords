# the-countess-of-pembroke-s-arcadia

- Source: `app/client/assets/temp-books/The Countess of Pembroke's Arcadia.txt`
- Title: The Countess of Pembroke's Arcadia
- Author: Philip Sidney
- Raw words: 350745
- Detected convention: book divisions
- Confidence: high (0.85)
- Recommended handling: needs manual sectioning review
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| book-division | 11 | 6 | 5 | yes |  |
| all-caps-title | 170 | 124 | 46 | no | weaker than selected strategy book-division |
| isolated-title-case | 59 | 58 | 1 | no | weaker than selected strategy book-division |
| arabic-only | 2 | 2 | 0 | no | weaker than selected strategy book-division |
| volume-division | 1 | 1 | 0 | no | weaker than selected strategy book-division |
| arabic-numbered-title | 1 | 1 | 0 | no | weaker than selected strategy book-division |
| special-front-back | 4 | 0 | 4 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L1291: BOOK I
- L6717: BOOK II
- L14718: BOOK III
- L24697: BOOK IV
- L27014: BOOK V
- L29360: BOOK VI

## Rejected TOC-like Examples

- L30: BOOK I
- L31: BOOK II
- L32: BOOK III
- L33: BOOK IV
- L34: BOOK V

## Section Size Sanity

- Sections: 6
- Min/median/max words: 25597/59436/109583
- Notes: 6 section(s) exceed 18000 words

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- long book has huge sections despite detected headings
