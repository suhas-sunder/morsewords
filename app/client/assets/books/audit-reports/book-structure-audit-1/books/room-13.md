# room-13

- Source: `app/client/assets/temp-books/Room 13.txt`
- Title: Room 13
- Author: Edgar Wallace
- Raw words: 64632
- Detected convention: chapter-based roman numerals
- Confidence: high (1)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 66 | 33 | 33 | yes |  |
| all-caps-title | 12 | 4 | 8 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 82 | 72 | 10 | no | weaker than selected strategy chapter-roman |
| arabic-numbered-title | 1 | 1 | 0 | no | weaker than selected strategy chapter-roman |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L72: CHAPTER I
- L360: CHAPTER II
- L726: CHAPTER III
- L1025: CHAPTER IV
- L1205: CHAPTER V
- L1433: CHAPTER VI
- L1734: CHAPTER VII
- L1984: CHAPTER VIII

## Rejected TOC-like Examples

- L35: Chapter I
- L36: Chapter II
- L37: Chapter III
- L38: Chapter IV
- L39: Chapter V
- L40: Chapter VI
- L41: Chapter VII
- L42: Chapter VIII

## Section Size Sanity

- Sections: 33
- Min/median/max words: 564/1885/3407
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
