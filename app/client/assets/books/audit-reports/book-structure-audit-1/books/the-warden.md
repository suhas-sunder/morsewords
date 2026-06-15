# the-warden

- Source: `app/client/assets/temp-books/The Warden.txt`
- Title: The Warden
- Author: Anthony Trollope
- Raw words: 75409
- Detected convention: chapter-based roman numerals
- Confidence: high (0.991)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 21 | 20 | 1 | yes |  |
| all-caps-title | 31 | 30 | 0 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 18 | 17 | 0 | no | weaker than selected strategy chapter-roman |
| roman-numbered-title | 21 | 0 | 21 | no | rejected as TOC-like or front-matter-only evidence |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L36: Chapter I
- L258: Chapter II
- L676: Chapter III
- L1426: Chapter V
- L1879: Chapter VI
- L2337: Chapter VII
- L2521: Chapter VIII
- L2934: Chapter IX

## Rejected TOC-like Examples

- L1101: Chapter IV

## Section Size Sanity

- Sections: 20
- Min/median/max words: 1663/3619/7113
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
