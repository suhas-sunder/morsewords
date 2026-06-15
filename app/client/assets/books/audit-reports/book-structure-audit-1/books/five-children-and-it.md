# five-children-and-it

- Source: `app/client/assets/temp-books/Five Children and It.txt`
- Title: Five Children and It
- Author: E. Nesbit
- Raw words: 57386
- Detected convention: chapter-based roman numerals
- Confidence: high (0.95)
- Recommended handling: safe for normal processing
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 10 | 10 | 0 | yes |  |
| all-caps-title | 43 | 21 | 21 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 73 | 20 | 53 | no | weaker than selected strategy chapter-roman |
| roman-numbered-title | 1 | 1 | 0 | no | weaker than selected strategy chapter-roman |
| special-front-back | 2 | 0 | 2 | no | rejected as TOC-like or front-matter-only evidence |
| arabic-only | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L197: CHAPTER I
- L947: CHAPTER II
- L1644: CHAPTER III
- L2418: CHAPTER IV
- L3069: CHAPTER V
- L3472: CHAPTER VI
- L3957: CHAPTER VII
- L4364: CHAPTER VIII

## Rejected TOC-like Examples

- L9: FIVE CHILDREN
- L10: AND IT
- L13: E. NESBIT
- L15: AUTHOR OF "THE TREASURE-SEEKERS,"
- L16: "THE WOULD-BE-GOODS," ETC.
- L31: COPYRIGHT, 1905, BY
- L37: _TO_
- L39: JOHN BLAND
- L91: The Psammead _Frontispiece_
- L93: That First Glorious Rush Round the Garden _Facing page_ 2

## Section Size Sanity

- Sections: 10
- Min/median/max words: 2949/5864/8485
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
