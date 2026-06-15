# the-financier

- Source: `app/client/assets/temp-books/The Financier.txt`
- Title: The Financier: A Novel
- Author: Theodore Dreiser
- Raw words: 201609
- Detected convention: chapter-based roman numerals
- Confidence: high (0.964)
- Recommended handling: needs manual sectioning review
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 118 | 58 | 60 | yes |  |
| isolated-title-case | 104 | 95 | 7 | no | weaker than selected strategy chapter-roman |
| all-caps-title | 11 | 11 | 0 | no | weaker than selected strategy chapter-roman |
| roman-numbered-title | 2 | 2 | 0 | no | weaker than selected strategy chapter-roman |
| arabic-numbered-title | 1 | 1 | 0 | no | weaker than selected strategy chapter-roman |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L279: Chapter II
- L569: Chapter III
- L1039: Chapter IV
- L1301: Chapter V
- L1488: Chapter VI
- L1805: Chapter VII
- L2048: Chapter VIII
- L2282: Chapter IX

## Rejected TOC-like Examples

- L8: Chapter I
- L9: Chapter II
- L10: Chapter III
- L11: Chapter IV
- L12: Chapter V
- L13: Chapter VI
- L14: Chapter VII
- L15: Chapter VIII

## Section Size Sanity

- Sections: 58
- Min/median/max words: 966/3111/10401
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- TOC/body confusion is likely
