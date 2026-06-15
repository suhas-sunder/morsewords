# a-tale-of-two-cities

- Source: `app/client/assets/temp-books/A Tale of Two Cities.txt`
- Title: A Tale of Two Cities
- Author: Charles Dickens
- Raw words: 140776
- Detected convention: chapter-based roman numerals
- Confidence: high (0.96)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 45 | 34 | 11 | yes |  |
| isolated-title-case | 275 | 218 | 56 | no | weaker than selected strategy chapter-roman |
| all-caps-title | 6 | 3 | 1 | no | weaker than selected strategy chapter-roman |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L3695: CHAPTER VI.
- L4231: CHAPTER VII.
- L4570: CHAPTER VIII.
- L4816: CHAPTER IX.
- L5316: CHAPTER X.
- L5674: CHAPTER XI.
- L5854: CHAPTER XII.
- L6152: CHAPTER XIII.

## Rejected TOC-like Examples

- L71: CHAPTER I.
- L168: CHAPTER II.
- L421: CHAPTER III.
- L605: CHAPTER IV.
- L1098: CHAPTER V.
- L1548: CHAPTER VI.
- L2026: CHAPTER I.
- L2279: CHAPTER II.

## Section Size Sanity

- Sections: 34
- Min/median/max words: 1358/2809/5829
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
