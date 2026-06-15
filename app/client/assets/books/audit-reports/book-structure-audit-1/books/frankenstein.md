# frankenstein

- Source: `app/client/assets/temp-books/Frankenstein.txt`
- Title: Frankenstein; or, the modern prometheus
- Author: Mary Wollstonecraft Shelley
- Raw words: 78439
- Detected convention: chapter-based arabic numbers
- Confidence: high (1)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-arabic | 48 | 24 | 24 | yes |  |
| isolated-title-case | 23 | 19 | 3 | no | weaker than selected strategy chapter-arabic |
| roman-numbered-title | 4 | 4 | 0 | no | weaker than selected strategy chapter-arabic |
| letter-prefixed | 8 | 3 | 5 | no | weaker than selected strategy chapter-arabic |
| all-caps-title | 1 | 1 | 0 | no | weaker than selected strategy chapter-arabic |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L609: Chapter 1
- L773: Chapter 2
- L982: Chapter 3
- L1235: Chapter 4
- L1469: Chapter 5
- L1704: Chapter 6
- L1967: Chapter 7
- L2332: Chapter 8

## Rejected TOC-like Examples

- L14: Chapter 1
- L15: Chapter 2
- L16: Chapter 3
- L17: Chapter 4
- L18: Chapter 5
- L19: Chapter 6
- L20: Chapter 7
- L21: Chapter 8

## Section Size Sanity

- Sections: 24
- Min/median/max words: 1781/2690/8258
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- Manifest: `app/client/assets/books/generated/frankenstein/manifest.json`
- Sections: 26
- Included sections: 24
- No generated comparison warnings.

## Red Flags

- None.
