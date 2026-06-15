# persuasion

- Source: `app/client/assets/temp-books/Persuasion.txt`
- Title: Persuasion
- Author: Jane Austen
- Raw words: 87069
- Detected convention: chapter-based roman numerals
- Confidence: high (1)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 48 | 24 | 24 | yes |  |
| all-caps-title | 5 | 5 | 0 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 32 | 30 | 0 | no | weaker than selected strategy chapter-roman |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L38: CHAPTER I.
- L298: CHAPTER II.
- L490: CHAPTER III.
- L775: CHAPTER IV.
- L947: CHAPTER V.
- L1282: CHAPTER VI.
- L1639: CHAPTER VII.
- L1972: CHAPTER VIII.

## Rejected TOC-like Examples

- L12: CHAPTER I.
- L13: CHAPTER II.
- L14: CHAPTER III.
- L15: CHAPTER IV.
- L16: CHAPTER V.
- L17: CHAPTER VI.
- L18: CHAPTER VII.
- L19: CHAPTER VIII.

## Section Size Sanity

- Sections: 24
- Min/median/max words: 1598/3334/7028
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
