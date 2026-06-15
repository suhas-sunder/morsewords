# the-iliad

- Source: `app/client/assets/temp-books/The Iliad.txt`
- Title: The Iliad
- Author: Homer
- Raw words: 198396
- Detected convention: book divisions
- Confidence: high (0.922)
- Recommended handling: needs manual sectioning review
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| book-division | 48 | 23 | 25 | yes |  |
| all-caps-title | 142 | 65 | 77 | no | weaker than selected strategy book-division |
| isolated-title-case | 162 | 139 | 23 | no | weaker than selected strategy book-division |
| arabic-only | 5 | 4 | 1 | no | weaker than selected strategy book-division |
| roman-numbered-title | 4 | 4 | 0 | no | weaker than selected strategy book-division |
| volume-division | 3 | 3 | 0 | no | weaker than selected strategy book-division |
| date-entry | 1 | 1 | 0 | no | weaker than selected strategy book-division |
| roman-only | 1 | 1 | 0 | no | weaker than selected strategy book-division |
| section-prefixed | 1 | 1 | 0 | no | weaker than selected strategy book-division |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L1994: BOOK I.
- L2903: BOOK II.
- L4755: BOOK IV.
- L5468: BOOK V.
- L6722: BOOK VI.
- L7487: BOOK VII.
- L8151: BOOK VIII.
- L8943: BOOK IX.

## Rejected TOC-like Examples

- L23: BOOK I.
- L24: BOOK II.
- L25: BOOK III.
- L26: BOOK IV.
- L27: BOOK V.
- L28: BOOK VI.
- L29: BOOK VII.
- L30: BOOK VIII.

## Section Size Sanity

- Sections: 23
- Min/median/max words: 3950/5982/26415
- Notes: 1 section(s) exceed 18000 words

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- long book has huge sections despite detected headings
- TOC/body confusion is likely
