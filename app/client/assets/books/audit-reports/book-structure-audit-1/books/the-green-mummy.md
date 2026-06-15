# the-green-mummy

- Source: `app/client/assets/temp-books/The Green Mummy.txt`
- Title: The Green Mummy
- Author: Fergus Hume
- Raw words: 91562
- Detected convention: chapter-based roman numerals
- Confidence: high (0.95)
- Recommended handling: safe for normal processing
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 27 | 27 | 0 | yes |  |
| isolated-title-case | 59 | 58 | 0 | no | weaker than selected strategy chapter-roman |
| all-caps-title | 30 | 0 | 30 | no | rejected as TOC-like or front-matter-only evidence |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L70: CHAPTER I. THE LOVERS
- L553: CHAPTER II. PROFESSOR BRADDOCK
- L922: CHAPTER III. A MYSTERIOUS TOMB
- L1222: CHAPTER IV. THE UNEXPECTED
- L1586: CHAPTER V. MYSTERY
- L1879: CHAPTER VI. THE INQUEST
- L2309: CHAPTER VII. THE CAPTAIN OF THE DIVER
- L2728: CHAPTER VIII. THE BARONET

## Rejected TOC-like Examples

- L1: THE GREEN MUMMY
- L9: CHAPTER
- L12: I THE LOVERS
- L14: II PROFESSOR BRADDOCK
- L16: III A MYSTERIOUS TOMB
- L18: IV THE UNEXPECTED
- L20: V MYSTERY
- L22: VI THE INQUEST
- L6: CONTENTS

## Section Size Sanity

- Sections: 27
- Min/median/max words: 2506/3226/4789
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
