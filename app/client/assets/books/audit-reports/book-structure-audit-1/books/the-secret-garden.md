# the-secret-garden

- Source: `app/client/assets/temp-books/The Secret Garden.txt`
- Title: The Secret Garden
- Author: Frances Hodgson Burnett
- Raw words: 84626
- Detected convention: chapter-based roman numerals
- Confidence: high (0.95)
- Recommended handling: safe for normal processing
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 27 | 27 | 0 | yes |  |
| all-caps-title | 66 | 33 | 33 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 36 | 32 | 4 | no | weaker than selected strategy chapter-roman |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L75: CHAPTER I
- L265: CHAPTER II
- L556: CHAPTER III
- L723: CHAPTER IV
- L1355: CHAPTER V
- L1588: CHAPTER VI
- L1831: CHAPTER VII
- L2072: CHAPTER VIII

## Rejected TOC-like Examples

- L23: FREDERICK A. STOKES COMPANY
- L24: PUBLISHERS
- L27: FRANCES HODGSON BURNETT
- L30: THE PHILLIPS PUBLISHING CO.
- L42: CHAPTER PAGE
- L43: I THERE IS NO ONE LEFT 1
- L44: II MISTRESS MARY QUITE CONTRARY 10
- L45: III ACROSS THE MOOR 23
- L748: "Yes."
- L969: "No."

## Section Size Sanity

- Sections: 27
- Min/median/max words: 1468/2710/5314
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- Manifest: `app/client/assets/books/generated/the-secret-garden/manifest.json`
- Sections: 29
- Included sections: 27
- Rights have not been reviewed; generated book is not publish-ready.
- Rights basis "unknown" is not publish-ready.
- Rights gate status is reject; generated book is not publish-ready.
- Rights gate did not allow processed public story output.
- Owner-reviewed website approval is missing.
- Website publication is not allowed by the active approval path.

## Red Flags

- None.
