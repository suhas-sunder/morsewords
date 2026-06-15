# the-red-thumb-mark

- Source: `app/client/assets/temp-books/The Red Thumb Mark.txt`
- Title: The Red Thumb Mark
- Author: R. Austin Freeman
- Raw words: 73793
- Detected convention: chapter-based roman numerals
- Confidence: high (1)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 34 | 17 | 17 | yes |  |
| all-caps-title | 36 | 19 | 17 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 40 | 39 | 1 | no | weaker than selected strategy chapter-roman |
| special-front-back | 2 | 1 | 1 | no | weaker than selected strategy chapter-roman |

## Body Heading Examples

- L90: CHAPTER I
- L321: CHAPTER II
- L764: CHAPTER III
- L1331: CHAPTER IV
- L1805: CHAPTER V
- L2166: CHAPTER VI
- L2561: CHAPTER VII
- L2854: CHAPTER VIII

## Rejected TOC-like Examples

- L38: CHAPTER I
- L41: CHAPTER II
- L44: CHAPTER III
- L47: CHAPTER IV
- L50: CHAPTER V
- L53: CHAPTER VI
- L56: CHAPTER VII
- L59: CHAPTER VIII

## Section Size Sanity

- Sections: 17
- Min/median/max words: 1940/3516/9509
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
