# the-man-who-was-thursday-a-nightmare

- Source: `app/client/assets/temp-books/The Man Who Was Thursday - A Nightmare.txt`
- Title: The Man Who Was Thursday: A Nightmare
- Author: G. K. Chesterton
- Raw words: 61885
- Detected convention: chapter-based roman numerals
- Confidence: high (1)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 30 | 15 | 15 | yes |  |
| all-caps-title | 22 | 18 | 4 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 29 | 28 | 1 | no | weaker than selected strategy chapter-roman |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L107: CHAPTER I.
- L509: CHAPTER II.
- L843: CHAPTER III.
- L1275: CHAPTER IV.
- L1648: CHAPTER V.
- L1959: CHAPTER VI.
- L2261: CHAPTER VII.
- L2579: CHAPTER VIII.

## Rejected TOC-like Examples

- L13: CHAPTER I. THE TWO POETS OF SAFFRON PARK
- L14: CHAPTER II. THE SECRET OF GABRIEL SYME
- L15: CHAPTER III. THE MAN WHO WAS THURSDAY
- L16: CHAPTER IV. THE TALE OF A DETECTIVE
- L17: CHAPTER V. THE FEAST OF FEAR
- L18: CHAPTER VI. THE EXPOSURE
- L19: CHAPTER VII. THE UNACCOUNTABLE CONDUCT OF PROFESSOR DE WORMS
- L20: CHAPTER VIII. THE PROFESSOR EXPLAINS

## Section Size Sanity

- Sections: 15
- Min/median/max words: 2884/3576/5484
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
