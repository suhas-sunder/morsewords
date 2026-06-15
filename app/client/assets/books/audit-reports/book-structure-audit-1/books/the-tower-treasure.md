# the-tower-treasure

- Source: `app/client/assets/temp-books/The tower treasure.txt`
- Title: The tower treasure
- Author: Franklin W. Dixon
- Raw words: 44713
- Detected convention: chapter-based roman numerals
- Confidence: high (0.95)
- Recommended handling: safe for normal processing
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 24 | 24 | 0 | yes |  |
| all-caps-title | 69 | 32 | 37 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 48 | 43 | 3 | no | weaker than selected strategy chapter-roman |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L87: CHAPTER I
- L273: CHAPTER II
- L503: CHAPTER III
- L720: CHAPTER IV
- L912: CHAPTER V
- L1241: CHAPTER VI
- L1455: CHAPTER VII
- L1674: CHAPTER VIII

## Rejected TOC-like Examples

- L3: THE TOWER TREASURE
- L5: By FRANKLIN W. DIXON
- L7: AUTHOR OF
- L8: THE HARDY BOYS: THE HOUSE ON THE CLIFF
- L9: THE HARDY BOYS: THE SECRET OF THE OLD MILL
- L11: _ILLUSTRATED BY_
- L12: WALTER S. ROGERS
- L14: NEW YORK
- L18: Made in the United States of America
- L428: "No."

## Section Size Sanity

- Sections: 24
- Min/median/max words: 1267/1681/2478
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
