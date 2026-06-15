# anne-of-green-gables

- Source: `app/client/assets/temp-books/Anne of Green Gables.txt`
- Title: Anne of Green Gables
- Author: L. M. Montgomery
- Raw words: 109928
- Detected convention: chapter-based roman numerals
- Confidence: high (0.95)
- Recommended handling: needs manual sectioning review
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 38 | 38 | 0 | yes |  |
| isolated-title-case | 88 | 49 | 39 | no | weaker than selected strategy chapter-roman |
| all-caps-title | 3 | 1 | 2 | no | weaker than selected strategy chapter-roman |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L50: CHAPTER I. Mrs. Rachel Lynde Is Surprised
- L325: CHAPTER II. Matthew Cuthbert Is Surprised
- L817: CHAPTER III. Marilla Cuthbert Is Surprised
- L1088: CHAPTER IV. Morning at Green Gables
- L1335: CHAPTER V. Anne’s History
- L1535: CHAPTER VI. Marilla Makes Up Her Mind
- L1740: CHAPTER VII. Anne Says Her Prayers
- L1882: CHAPTER VIII. Anne’s Bringing-up Is Begun

## Rejected TOC-like Examples

- L8: CHAPTER I Mrs. Rachel Lynde Is Surprised
- L9: CHAPTER II Matthew Cuthbert Is Surprised
- L10: CHAPTER III Marilla Cuthbert Is Surprised
- L11: CHAPTER IV Morning at Green Gables
- L12: CHAPTER V Anne’s History
- L13: CHAPTER VI Marilla Makes Up Her Mind
- L14: CHAPTER VII Anne Says Her Prayers
- L15: CHAPTER VIII Anne’s Bringing-up Is Begun
- L1: ANNE OF GREEN GABLES
- L48: ANNE OF GREEN GABLES

## Section Size Sanity

- Sections: 38
- Min/median/max words: 1263/2617/5458
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- Manifest: `app/client/assets/books/generated/anne-of-green-gables/manifest.json`
- Sections: 39
- Included sections: 38
- existing generated first preview may include source, title-page, or TOC junk

## Red Flags

- generated output may include source/license/TOC/footer junk
