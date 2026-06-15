# triplanetary

- Source: `app/client/assets/temp-books/Triplanetary.txt`
- Title: Triplanetary
- Author: E. E. Smith
- Raw words: 60768
- Detected convention: chapter-based roman numerals
- Confidence: high (0.95)
- Recommended handling: safe for normal processing
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 13 | 13 | 0 | yes |  |
| isolated-title-case | 39 | 38 | 1 | no | weaker than selected strategy chapter-roman |
| all-caps-title | 1 | 1 | 0 | no | weaker than selected strategy chapter-roman |
| arabic-numbered-title | 1 | 1 | 0 | no | weaker than selected strategy chapter-roman |

## Body Heading Examples

- L35: CHAPTER I
- L714: CHAPTER II
- L1315: CHAPTER III
- L1715: CHAPTER IV
- L2331: CHAPTER V
- L2992: CHAPTER VI
- L3238: CHAPTER VII
- L3694: CHAPTER VIII

## Rejected TOC-like Examples

- L76: [Illustration:

## Section Size Sanity

- Sections: 13
- Min/median/max words: 1420/4764/6234
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
