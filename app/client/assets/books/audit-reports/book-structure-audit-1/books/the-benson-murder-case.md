# the-benson-murder-case

- Source: `app/client/assets/temp-books/The Benson Murder Case.txt`
- Title: The Benson murder case
- Author: S. S. Van Dine
- Raw words: 88738
- Detected convention: chapter-based roman numerals
- Confidence: high (0.964)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 25 | 24 | 1 | yes |  |
| isolated-title-case | 140 | 108 | 32 | no | weaker than selected strategy chapter-roman |
| roman-numbered-title | 25 | 0 | 25 | no | rejected as TOC-like or front-matter-only evidence |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L569: CHAPTER II.
- L1045: CHAPTER III.
- L1504: CHAPTER IV.
- L1964: CHAPTER V.
- L2323: CHAPTER VI.
- L2731: CHAPTER VII.
- L3311: CHAPTER VIII.
- L3748: CHAPTER IX.

## Rejected TOC-like Examples

- L182: CHAPTER I.

## Section Size Sanity

- Sections: 24
- Min/median/max words: 2393/3365/4451
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
