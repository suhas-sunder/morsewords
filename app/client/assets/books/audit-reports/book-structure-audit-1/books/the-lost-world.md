# the-lost-world

- Source: `app/client/assets/temp-books/The Lost World.txt`
- Title: The Lost World
- Author: Arthur Conan Doyle
- Raw words: 79252
- Detected convention: chapter-based roman numerals
- Confidence: high (0.95)
- Recommended handling: safe for normal processing
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 16 | 16 | 0 | yes |  |
| all-caps-title | 14 | 11 | 3 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 58 | 55 | 3 | no | weaker than selected strategy chapter-roman |
| roman-numbered-title | 17 | 1 | 16 | no | weaker than selected strategy chapter-roman |
| special-front-back | 2 | 0 | 2 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L58: CHAPTER I
- L293: CHAPTER II
- L603: CHAPTER III
- L906: CHAPTER IV
- L1567: CHAPTER V
- L2049: CHAPTER VI
- L2388: CHAPTER VII
- L2729: CHAPTER VIII

## Rejected TOC-like Examples

- L1: THE LOST WORLD
- L33: CHAPTER
- L53: THE LOST WORLD
- L9: The Lost World
- L24: by Professor G. E. Challenger, who, being
- L56: The Lost World
- L35: I. "THERE ARE HEROISMS ALL ROUND US"
- L36: II. "TRY YOUR LUCK WITH PROFESSOR CHALLENGER"
- L37: III. "HE IS A PERFECTLY IMPOSSIBLE PERSON"
- L38: IV. "IT'S JUST THE VERY BIGGEST THING IN THE WORLD"

## Section Size Sanity

- Sections: 16
- Min/median/max words: 2109/5409/8223
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
