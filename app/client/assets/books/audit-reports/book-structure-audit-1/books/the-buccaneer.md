# the-buccaneer

- Source: `app/client/assets/temp-books/The Buccaneer.txt`
- Title: The Buccaneer: A Tale
- Author: Mrs. S. C. Hall
- Raw words: 177537
- Detected convention: chapter-based roman numerals
- Confidence: high (0.956)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 46 | 37 | 9 | yes |  |
| all-caps-title | 76 | 51 | 25 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 91 | 87 | 4 | no | weaker than selected strategy chapter-roman |
| arabic-only | 3 | 0 | 3 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L4325: CHAPTER X.
- L4798: CHAPTER XI.
- L5287: CHAPTER XII.
- L5671: CHAPTER XIII.
- L6028: CHAPTER XIV.
- L6278: CHAPTER XV.
- L6741: CHAPTER I.
- L7153: CHAPTER II.

## Rejected TOC-like Examples

- L114: CHAPTER I.
- L722: CHAPTER II.
- L1066: CHAPTER III.
- L1442: CHAPTER IV.
- L2039: CHAPTER V.
- L2463: CHAPTER VI.
- L2888: CHAPTER VII.
- L3341: CHAPTER VIII.

## Section Size Sanity

- Sections: 37
- Min/median/max words: 1113/3508/8407
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
