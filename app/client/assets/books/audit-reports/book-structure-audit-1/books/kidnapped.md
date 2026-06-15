# kidnapped

- Source: `app/client/assets/temp-books/Kidnapped.txt`
- Title: Kidnapped
- Author: Robert Louis Stevenson
- Raw words: 86160
- Detected convention: chapter-based roman numerals
- Confidence: high (0.964)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 30 | 29 | 1 | yes |  |
| all-caps-title | 88 | 36 | 51 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 16 | 15 | 1 | no | weaker than selected strategy chapter-roman |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L391: CHAPTER II
- L601: CHAPTER III
- L892: CHAPTER IV
- L1187: CHAPTER V
- L1433: CHAPTER VI
- L1634: CHAPTER VII
- L1900: CHAPTER VIII
- L2087: CHAPTER IX

## Rejected TOC-like Examples

- L222: CHAPTER I

## Section Size Sanity

- Sections: 29
- Min/median/max words: 1418/2764/4049
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
