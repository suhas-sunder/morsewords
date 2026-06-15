# the-mark-of-zorro

- Source: `app/client/assets/temp-books/The mark of Zorro.txt`
- Title: The mark of Zorro
- Author: Johnston McCulley
- Raw words: 72509
- Detected convention: chapter-based roman numerals
- Confidence: high (0.95)
- Recommended handling: safe for normal processing
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 39 | 39 | 0 | yes |  |
| all-caps-title | 87 | 40 | 47 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 43 | 38 | 3 | no | weaker than selected strategy chapter-roman |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L109: CHAPTER I
- L299: CHAPTER II
- L534: CHAPTER III
- L697: CHAPTER IV
- L981: CHAPTER V
- L1147: CHAPTER VI
- L1414: CHAPTER VII
- L1649: CHAPTER VIII

## Rejected TOC-like Examples

- L9: GROSSET & DUNLAP
- L10: PUBLISHERS NEW YORK
- L13: COPYRIGHT, 1924, BY
- L14: GROSSET & DUNLAP
- L20: DOUGLAS FAIRBANKS
- L21: THE ORIGINAL "ZORRO" OF THE SCREEN
- L26: CHAPTER PAGE
- L27: I PEDRO, THE BOASTER 1
- L7: [Illustration: Decoration]
- L16: Printed in the United States of America

## Section Size Sanity

- Sections: 39
- Min/median/max words: 786/1736/3492
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
