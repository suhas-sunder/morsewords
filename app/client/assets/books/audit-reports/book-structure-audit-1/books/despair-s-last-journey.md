# despair-s-last-journey

- Source: `app/client/assets/temp-books/Despair's Last Journey.txt`
- Title: Despair's Last Journey
- Author: David Christie Murray
- Raw words: 156783
- Detected convention: chapter-based roman numerals
- Confidence: high (0.95)
- Recommended handling: safe for normal processing
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 29 | 29 | 0 | yes |  |
| isolated-title-case | 87 | 83 | 4 | no | weaker than selected strategy chapter-roman |
| all-caps-title | 6 | 6 | 0 | no | weaker than selected strategy chapter-roman |
| roman-numbered-title | 2 | 2 | 0 | no | weaker than selected strategy chapter-roman |
| roman-only | 3 | 3 | 0 | no | weaker than selected strategy chapter-roman |
| arabic-only | 1 | 1 | 0 | no | weaker than selected strategy chapter-roman |

## Body Heading Examples

- L735: CHAPTER I
- L1296: CHAPTER II
- L1834: CHAPTER III
- L2532: CHAPTER IV
- L2896: CHAPTER V
- L3380: CHAPTER VI
- L3836: CHAPTER VII
- L4820: CHAPTER VIII

## Rejected TOC-like Examples

- L170: ‘No.’
- L201: ‘Yes.’
- L234: ‘No.’
- L2503: ‘Yes.’

## Section Size Sanity

- Sections: 29
- Min/median/max words: 3207/4770/9219
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
