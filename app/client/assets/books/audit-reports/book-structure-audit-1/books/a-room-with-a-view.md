# a-room-with-a-view

- Source: `app/client/assets/temp-books/A Room with a View.txt`
- Title: A Room with a View
- Author: E. M. Forster
- Raw words: 71434
- Detected convention: chapter-based roman numerals with part divisions
- Confidence: high (0.957)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 39 | 21 | 18 | yes |  |
| isolated-title-case | 133 | 129 | 4 | no | weaker than selected strategy chapter-roman |
| part-division | 4 | 2 | 2 | no | weaker than selected strategy chapter-roman |
| all-caps-title | 6 | 6 | 0 | no | weaker than selected strategy chapter-roman |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L32: Chapter XIX. Lying to Mr. Emerson
- L39: Chapter I
- L528: Chapter II
- L1126: Chapter III
- L1511: Chapter IV
- L1792: Chapter V
- L2293: Chapter VI
- L2723: Chapter VII

## Rejected TOC-like Examples

- L12: Chapter I. The Bertolini
- L13: Chapter II. In Santa Croce with No Baedeker
- L14: Chapter III. Music, Violets, and the Letter “S”
- L15: Chapter IV. Fourth Chapter
- L16: Chapter V. Possibilities of a Pleasant Outing
- L18: Chapter VII. They Return
- L21: Chapter VIII. Medieval
- L22: Chapter IX. Lucy As a Work of Art

## Section Size Sanity

- Sections: 21
- Min/median/max words: 16/3441/5206
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
