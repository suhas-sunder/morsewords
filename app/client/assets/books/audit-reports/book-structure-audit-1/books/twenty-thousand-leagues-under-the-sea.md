# twenty-thousand-leagues-under-the-sea

- Source: `app/client/assets/temp-books/Twenty Thousand Leagues under the Sea.txt`
- Title: Twenty Thousand Leagues under the Sea
- Author: Jules Verne
- Raw words: 108476
- Detected convention: chapter-based roman numerals with part divisions
- Confidence: high (0.96)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 46 | 34 | 12 | yes |  |
| all-caps-title | 96 | 49 | 47 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 95 | 90 | 3 | no | weaker than selected strategy chapter-roman |
| roman-numbered-title | 2 | 2 | 0 | no | weaker than selected strategy chapter-roman |
| part-division | 4 | 1 | 3 | no | weaker than selected strategy chapter-roman |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L2992: CHAPTER XIII
- L3228: CHAPTER XIV
- L3518: CHAPTER XV
- L3724: CHAPTER XVI
- L3956: CHAPTER XVII
- L4143: CHAPTER XVIII
- L4438: CHAPTER XIX
- L4687: CHAPTER XX

## Rejected TOC-like Examples

- L78: CHAPTER I
- L287: CHAPTER II
- L471: CHAPTER III
- L655: CHAPTER IV
- L877: CHAPTER V
- L1072: CHAPTER VI
- L1390: CHAPTER VII
- L1657: CHAPTER VIII

## Section Size Sanity

- Sections: 34
- Min/median/max words: 453/2344/3364
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
