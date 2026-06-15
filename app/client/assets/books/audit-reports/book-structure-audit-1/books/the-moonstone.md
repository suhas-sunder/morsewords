# the-moonstone

- Source: `app/client/assets/temp-books/The Moonstone.txt`
- Title: The Moonstone
- Author: Wilkie Collins
- Raw words: 202110
- Detected convention: chapter-based roman numerals
- Confidence: high (0.877)
- Recommended handling: needs manual sectioning review
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 89 | 35 | 54 | yes |  |
| all-caps-title | 36 | 24 | 11 | no | weaker than selected strategy chapter-roman |
| roman-only | 20 | 8 | 12 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 123 | 120 | 1 | no | weaker than selected strategy chapter-roman |
| arabic-only | 1 | 1 | 0 | no | weaker than selected strategy chapter-roman |
| special-front-back | 4 | 0 | 4 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L3292: CHAPTER XI
- L4105: CHAPTER XII
- L4617: CHAPTER XIII
- L4888: CHAPTER XIV
- L5257: CHAPTER XV
- L5843: CHAPTER XVI
- L6237: CHAPTER XVII
- L6554: CHAPTER XVIII

## Rejected TOC-like Examples

- L18: CHAPTER I
- L19: CHAPTER II
- L20: CHAPTER III
- L21: CHAPTER IV
- L22: CHAPTER V
- L23: CHAPTER VI
- L24: CHAPTER VII
- L25: CHAPTER VIII

## Section Size Sanity

- Sections: 35
- Min/median/max words: 647/4092/20582
- Notes: 1 section(s) exceed 18000 words

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- long book has huge sections despite detected headings
- TOC/body confusion is likely
