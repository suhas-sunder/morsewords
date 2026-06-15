# robert-orange

- Source: `app/client/assets/temp-books/Robert Orange.txt`
- Title: Robert Orange
- Author: John Oliver Hobbes
- Raw words: 103436
- Detected convention: chapter-based roman numerals
- Confidence: high (0.95)
- Recommended handling: safe for normal processing
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 30 | 30 | 0 | yes |  |
| all-caps-title | 67 | 66 | 1 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 135 | 132 | 3 | no | weaker than selected strategy chapter-roman |
| roman-only | 2 | 2 | 0 | no | weaker than selected strategy chapter-roman |
| roman-numbered-title | 3 | 3 | 0 | no | weaker than selected strategy chapter-roman |
| arabic-numbered-title | 3 | 3 | 0 | no | weaker than selected strategy chapter-roman |

## Body Heading Examples

- L22: CHAPTER I
- L446: CHAPTER II
- L708: CHAPTER III
- L989: CHAPTER IV
- L1244: CHAPTER V
- L1665: CHAPTER VI
- L1952: CHAPTER VII
- L2406: CHAPTER VIII

## Rejected TOC-like Examples

- L1633: BRIGIT."
- L171: "Why?"
- L1608: "Yes."
- L1650: "Why?"

## Section Size Sanity

- Sections: 30
- Min/median/max words: 1122/3379/6849
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
