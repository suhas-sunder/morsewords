# pollyanna

- Source: `app/client/assets/temp-books/Pollyanna.txt`
- Title: Pollyanna
- Author: Eleanor H. Porter
- Raw words: 60015
- Detected convention: chapter-based roman numerals
- Confidence: high (0.95)
- Recommended handling: safe for normal processing
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 32 | 32 | 0 | yes |  |
| all-caps-title | 10 | 7 | 3 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 96 | 92 | 3 | no | weaker than selected strategy chapter-roman |
| roman-numbered-title | 32 | 0 | 32 | no | rejected as TOC-like or front-matter-only evidence |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L53: CHAPTER I. MISS POLLY
- L217: CHAPTER II. OLD TOM AND NANCY
- L357: CHAPTER III. THE COMING OF POLLYANNA
- L641: CHAPTER IV. THE LITTLE ATTIC ROOM
- L934: CHAPTER V. THE GAME
- L1150: CHAPTER VI. A QUESTION OF DUTY
- L1490: CHAPTER VII. POLLYANNA AND PUNISHMENTS
- L1689: CHAPTER VIII. POLLYANNA PAYS A VISIT

## Rejected TOC-like Examples

- L1: POLLYANNA
- L15: CHAPTER
- L50: POLLYANNA
- L64: “Nancy!”
- L757: “Yes, Aunt Polly.”
- L1008: “The--GAME?”
- L16: I. MISS POLLY
- L17: II. OLD TOM AND NANCY
- L18: III. THE COMING OF POLLYANNA
- L19: IV. THE LITTLE ATTIC ROOM

## Section Size Sanity

- Sections: 32
- Min/median/max words: 296/1717/3859
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
