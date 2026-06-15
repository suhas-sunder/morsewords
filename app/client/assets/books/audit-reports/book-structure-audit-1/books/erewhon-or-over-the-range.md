# erewhon-or-over-the-range

- Source: `app/client/assets/temp-books/Erewhon; Or, Over the Range.txt`
- Title: Erewhon; Or, Over the Range
- Author: Samuel Butler
- Raw words: 28318
- Detected convention: chapter-based roman numerals
- Confidence: high (1)
- Recommended handling: needs manual sectioning review
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 39 | 10 | 29 | yes |  |
| all-caps-title | 12 | 4 | 7 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 6 | 3 | 3 | no | weaker than selected strategy chapter-roman |
| date-entry | 2 | 2 | 0 | no | weaker than selected strategy chapter-roman |
| arabic-numbered-title | 1 | 1 | 0 | no | weaker than selected strategy chapter-roman |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L283: CHAPTER I. WASTE LANDS
- L475: CHAPTER II. IN THE WOOL-SHED
- L613: CHAPTER III. UP THE RIVER
- L782: CHAPTER IV. THE SADDLE
- L1033: CHAPTER V. THE RIVER AND THE RANGE
- L1296: CHAPTER VI. INTO EREWHON
- L1553: CHAPTER VII. FIRST IMPRESSIONS
- L1768: CHAPTER VIII. IN PRISON

## Rejected TOC-like Examples

- L25: CHAPTER I. WASTE LANDS
- L26: CHAPTER II. IN THE WOOL-SHED
- L27: CHAPTER III. UP THE RIVER
- L28: CHAPTER IV. THE SADDLE
- L29: CHAPTER V. THE RIVER AND THE RANGE
- L30: CHAPTER VI. INTO EREWHON
- L31: CHAPTER VII. FIRST IMPRESSIONS
- L32: CHAPTER VIII. IN PRISON

## Section Size Sanity

- Sections: 10
- Min/median/max words: 1607/2781/3683
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: medium
- End: medium
- Missing Project Gutenberg end marker; footer text was not destructively stripped.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- TOC/body confusion is likely
