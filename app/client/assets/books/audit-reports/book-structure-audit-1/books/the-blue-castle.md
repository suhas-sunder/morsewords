# the-blue-castle

- Source: `app/client/assets/temp-books/The Blue Castle.txt`
- Title: The Blue Castle: a novel
- Author: L. M. Montgomery
- Raw words: 74215
- Detected convention: chapter-based roman numerals
- Confidence: high (1)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 90 | 45 | 45 | yes |  |
| isolated-title-case | 57 | 56 | 1 | no | weaker than selected strategy chapter-roman |
| all-caps-title | 6 | 2 | 4 | no | weaker than selected strategy chapter-roman |
| roman-numbered-title | 2 | 1 | 1 | no | weaker than selected strategy chapter-roman |
| roman-only | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L66: CHAPTER I
- L413: CHAPTER II
- L526: CHAPTER III
- L718: CHAPTER IV
- L803: CHAPTER V
- L961: CHAPTER VI
- L1138: CHAPTER VII
- L1371: CHAPTER VIII

## Rejected TOC-like Examples

- L16: CHAPTER I
- L17: CHAPTER II
- L18: CHAPTER III
- L19: CHAPTER IV
- L20: CHAPTER V
- L21: CHAPTER VI
- L22: CHAPTER VII
- L23: CHAPTER VIII

## Section Size Sanity

- Sections: 45
- Min/median/max words: 202/1352/3972
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
