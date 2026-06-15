# unicorns

- Source: `app/client/assets/temp-books/Unicorns.txt`
- Title: Unicorns
- Author: James Huneker
- Raw words: 85812
- Detected convention: chapter-based roman numerals
- Confidence: high (0.987)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 30 | 28 | 2 | yes |  |
| all-caps-title | 87 | 70 | 17 | no | weaker than selected strategy chapter-roman |
| roman-only | 26 | 14 | 12 | no | weaker than selected strategy chapter-roman |
| roman-numbered-title | 33 | 6 | 27 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 150 | 147 | 2 | no | weaker than selected strategy chapter-roman |
| arabic-numbered-title | 5 | 5 | 0 | no | weaker than selected strategy chapter-roman |
| arabic-only | 2 | 2 | 0 | no | weaker than selected strategy chapter-roman |
| special-front-back | 2 | 1 | 1 | no | weaker than selected strategy chapter-roman |

## Body Heading Examples

- L178: CHAPTER I
- L560: CHAPTER III
- L914: CHAPTER IV
- L1388: CHAPTER V
- L2064: CHAPTER VII
- L2385: CHAPTER VIII
- L2603: CHAPTER IX
- L2711: CHAPTER X

## Rejected TOC-like Examples

- L277: CHAPTER II
- L1706: CHAPTER VI

## Section Size Sanity

- Sections: 28
- Min/median/max words: 1028/3084/6660
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
