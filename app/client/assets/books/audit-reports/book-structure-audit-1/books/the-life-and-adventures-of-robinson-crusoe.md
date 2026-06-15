# the-life-and-adventures-of-robinson-crusoe

- Source: `app/client/assets/temp-books/The Life and Adventures of Robinson Crusoe.txt`
- Title: The Life and Adventures of Robinson Crusoe
- Author: Daniel Defoe
- Raw words: 124677
- Detected convention: chapter-based roman numerals
- Confidence: high (0.95)
- Recommended handling: safe for normal processing
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 20 | 20 | 0 | yes |  |
| isolated-title-case | 11 | 5 | 6 | no | weaker than selected strategy chapter-roman |
| all-caps-title | 20 | 0 | 20 | no | rejected as TOC-like or front-matter-only evidence |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L41: CHAPTER I. START IN LIFE
- L480: CHAPTER II. SLAVERY AND ESCAPE
- L912: CHAPTER III. WRECKED ON A DESERT ISLAND
- L1561: CHAPTER IV. FIRST WEEKS ON THE ISLAND
- L2343: CHAPTER V. BUILDS A HOUSE—THE JOURNAL
- L2835: CHAPTER VI. ILL AND CONSCIENCE-STRICKEN
- L3319: CHAPTER VII. AGRICULTURAL EXPERIENCE
- L3643: CHAPTER VIII. SURVEYS HIS POSITION

## Rejected TOC-like Examples

- L4: Robinson Crusoe
- L8: Daniel Defoe
- L10: _With Illustrations by H. M. Brock_
- L12: London
- L13: Seeley, Service & Co. Limited
- L14: 38 Great Russell Street
- L19: CHAPTER I—START IN LIFE
- L20: CHAPTER II—SLAVERY AND ESCAPE
- L21: CHAPTER III—WRECKED ON A DESERT ISLAND
- L22: CHAPTER IV—FIRST WEEKS ON THE ISLAND

## Section Size Sanity

- Sections: 20
- Min/median/max words: 3918/6104/8920
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
