# oliver-twist

- Source: `app/client/assets/temp-books/Oliver Twist.txt`
- Title: Oliver Twist
- Author: Charles Dickens
- Raw words: 164302
- Detected convention: chapter-based roman numerals
- Confidence: high (0.964)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 53 | 52 | 1 | yes |  |
| all-caps-title | 192 | 93 | 99 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 63 | 57 | 6 | no | weaker than selected strategy chapter-roman |
| roman-numbered-title | 1 | 1 | 0 | no | weaker than selected strategy chapter-roman |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L232: CHAPTER II.
- L671: CHAPTER III.
- L1038: CHAPTER IV.
- L1340: CHAPTER V.
- L1807: CHAPTER VI.
- L2006: CHAPTER VII.
- L2284: CHAPTER VIII.
- L2631: CHAPTER IX.

## Rejected TOC-like Examples

- L112: CHAPTER I.

## Section Size Sanity

- Sections: 52
- Min/median/max words: 994/3266/5371
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
