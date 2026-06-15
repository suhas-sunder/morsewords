# middlemarch

- Source: `app/client/assets/temp-books/Middlemarch.txt`
- Title: Middlemarch
- Author: George Eliot
- Raw words: 325209
- Detected convention: book divisions
- Confidence: high (0.93)
- Recommended handling: needs manual sectioning review
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| book-division | 16 | 8 | 8 | yes |  |
| chapter-roman | 172 | 80 | 92 | no | weaker than selected strategy book-division |
| all-caps-title | 28 | 23 | 5 | no | weaker than selected strategy book-division |
| isolated-title-case | 84 | 80 | 4 | no | weaker than selected strategy book-division |
| roman-numbered-title | 1 | 1 | 0 | no | weaker than selected strategy book-division |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L173: BOOK I.
- L4936: BOOK II.
- L9110: BOOK III.
- L12749: BOOK IV.
- L17036: BOOK V.
- L21105: BOOK VI.
- L25271: BOOK VII.
- L28993: BOOK VIII.

## Rejected TOC-like Examples

- L16: BOOK I. MISS BROOKE.
- L30: BOOK II. OLD AND YOUNG.
- L42: BOOK III. WAITING FOR DEATH.
- L55: BOOK IV. THREE LOVE PROBLEMS.
- L66: BOOK V. THE DEAD HAND.
- L79: BOOK VI. THE WIDOW AND THE WIFE.
- L90: BOOK VII. TWO TEMPTATIONS.
- L101: BOOK VIII. SUNSET AND SUNRISE.

## Section Size Sanity

- Sections: 8
- Min/median/max words: 35824/40953/44014
- Notes: 8 section(s) exceed 18000 words

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- long book has huge sections despite detected headings
- body headings were found but rejected by the selected strategy
