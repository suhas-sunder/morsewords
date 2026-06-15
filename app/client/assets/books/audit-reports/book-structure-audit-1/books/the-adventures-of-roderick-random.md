# the-adventures-of-roderick-random

- Source: `app/client/assets/temp-books/The Adventures of Roderick Random.txt`
- Title: The Adventures of Roderick Random
- Author: T. Smollett
- Raw words: 195776
- Detected convention: chapter-based roman numerals
- Confidence: high (1)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 138 | 69 | 69 | yes |  |
| all-caps-title | 6 | 4 | 2 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 37 | 34 | 1 | no | weaker than selected strategy chapter-roman |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L258: CHAPTER I
- L402: CHAPTER II
- L544: CHAPTER III
- L698: CHAPTER IV
- L810: CHAPTER V
- L983: CHAPTER VI
- L1229: CHAPTER VII
- L1463: CHAPTER VIII

## Rejected TOC-like Examples

- L10: CHAPTER I.
- L11: CHAPTER II.
- L12: CHAPTER III.
- L13: CHAPTER IV.
- L14: CHAPTER V.
- L15: CHAPTER VI.
- L16: CHAPTER VII.
- L17: CHAPTER VIII.

## Section Size Sanity

- Sections: 69
- Min/median/max words: 1308/2581/5521
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
