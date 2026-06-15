# five-weeks-in-a-balloon

- Source: `app/client/assets/temp-books/Five Weeks in a Balloon.txt`
- Title: Five Weeks in a Balloon
- Author: Jules Verne
- Raw words: 96843
- Detected convention: chapter-based word ordinals
- Confidence: high (0.91)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-word | 78 | 39 | 39 | yes |  |
| all-caps-title | 66 | 57 | 9 | no | weaker than selected strategy chapter-word |
| isolated-title-case | 272 | 190 | 82 | no | weaker than selected strategy chapter-word |
| arabic-numbered-title | 3 | 3 | 0 | no | weaker than selected strategy chapter-word |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L382: CHAPTER FIRST.
- L655: CHAPTER SECOND.
- L775: CHAPTER THIRD.
- L1101: CHAPTER FOURTH.
- L1286: CHAPTER FIFTH.
- L1529: CHAPTER SIXTH.
- L1744: CHAPTER SEVENTH.
- L1923: CHAPTER EIGHTH.

## Rejected TOC-like Examples

- L25: CHAPTER FIRST.
- L26: CHAPTER SECOND.
- L27: CHAPTER THIRD.
- L28: CHAPTER FOURTH.
- L29: CHAPTER FIFTH.
- L30: CHAPTER SIXTH.
- L31: CHAPTER SEVENTH.
- L32: CHAPTER EIGHTH.

## Section Size Sanity

- Sections: 39
- Min/median/max words: 1036/2051/10431
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
