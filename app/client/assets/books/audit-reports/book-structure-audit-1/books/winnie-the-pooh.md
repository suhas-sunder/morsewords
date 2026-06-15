# winnie-the-pooh

- Source: `app/client/assets/temp-books/Winnie-the-Pooh.txt`
- Title: Winnie-the-Pooh
- Author: A. A. Milne
- Raw words: 26340
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
| all-caps-title | 58 | 38 | 20 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 123 | 103 | 19 | no | weaker than selected strategy chapter-roman |
| arabic-numbered-title | 11 | 11 | 0 | no | weaker than selected strategy chapter-roman |
| roman-numbered-title | 11 | 2 | 9 | no | weaker than selected strategy chapter-roman |
| special-front-back | 2 | 1 | 1 | no | weaker than selected strategy chapter-roman |

## Body Heading Examples

- L176: CHAPTER I
- L556: CHAPTER II
- L799: CHAPTER III
- L972: CHAPTER IV
- L1190: CHAPTER V
- L1532: CHAPTER VI
- L2002: CHAPTER VII
- L2481: CHAPTER VIII

## Rejected TOC-like Examples

- L29: WINNIE-THE-POOH
- L59: _MYSTERY STORY_
- L64: WINNIE-THE-POOH
- L67: McCLELLAND & STEWART, LTD.
- L69: PUBLISHERS - - TORONTO
- L85: TO HER
- L87: HAND IN HAND WE COME
- L88: CHRISTOPHER ROBIN AND I
- L11: Title: Winnie-the-Pooh
- L13: Author: A. A. Milne

## Section Size Sanity

- Sections: 10
- Min/median/max words: 1254/2645/3035
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
