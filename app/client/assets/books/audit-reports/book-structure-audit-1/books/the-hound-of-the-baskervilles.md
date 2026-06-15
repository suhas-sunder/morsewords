# the-hound-of-the-baskervilles

- Source: `app/client/assets/temp-books/The Hound of the Baskervilles.txt`
- Title: The Hound of the Baskervilles
- Author: Arthur Conan Doyle
- Raw words: 62939
- Detected convention: chapter-based arabic numbers
- Confidence: high (0.964)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-arabic | 15 | 14 | 1 | yes |  |
| isolated-title-case | 120 | 95 | 25 | no | weaker than selected strategy chapter-arabic |
| all-caps-title | 3 | 3 | 0 | no | weaker than selected strategy chapter-arabic |
| roman-numbered-title | 2 | 2 | 0 | no | weaker than selected strategy chapter-arabic |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L340: Chapter 2.
- L770: Chapter 3.
- L1232: Chapter 4.
- L1783: Chapter 5.
- L2287: Chapter 6.
- L2699: Chapter 7.
- L3314: Chapter 8.
- L3593: Chapter 9.

## Rejected TOC-like Examples

- L46: Chapter 1.

## Section Size Sanity

- Sections: 14
- Min/median/max words: 2771/4093/6713
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
