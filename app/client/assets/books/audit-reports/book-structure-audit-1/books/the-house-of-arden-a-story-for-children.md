# the-house-of-arden-a-story-for-children

- Source: `app/client/assets/temp-books/The House of Arden - A Story for Children.txt`
- Title: The House of Arden: A Story for Children
- Author: E. Nesbit
- Raw words: 76945
- Detected convention: chapter-based roman numerals
- Confidence: high (1)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 28 | 14 | 14 | yes |  |
| all-caps-title | 106 | 43 | 63 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 77 | 69 | 8 | no | weaker than selected strategy chapter-roman |
| arabic-only | 2 | 1 | 1 | no | weaker than selected strategy chapter-roman |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L151: CHAPTER I
- L1002: CHAPTER II
- L1927: CHAPTER III
- L2485: CHAPTER IV
- L2861: CHAPTER V
- L3475: CHAPTER VI
- L4145: CHAPTER VII
- L4650: CHAPTER VIII

## Rejected TOC-like Examples

- L44: CHAPTER I
- L48: CHAPTER II
- L52: CHAPTER III
- L56: CHAPTER IV
- L60: CHAPTER V
- L64: CHAPTER VI
- L68: CHAPTER VII
- L72: CHAPTER VIII

## Section Size Sanity

- Sections: 14
- Min/median/max words: 3426/5161/7039
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
