# emma

- Source: `app/client/assets/temp-books/Emma.txt`
- Title: Emma
- Author: Jane Austen
- Raw words: 69322
- Detected convention: chapter-based roman numerals with volume divisions
- Confidence: high (0.956)
- Recommended handling: needs manual sectioning review
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 80 | 18 | 62 | yes |  |
| isolated-title-case | 21 | 19 | 0 | no | weaker than selected strategy chapter-roman |
| volume-division | 5 | 2 | 3 | no | weaker than selected strategy chapter-roman |
| roman-numbered-title | 1 | 1 | 0 | no | weaker than selected strategy chapter-roman |
| all-caps-title | 1 | 1 | 0 | no | weaker than selected strategy chapter-roman |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L1845: CHAPTER VIII
- L2269: CHAPTER IX
- L2827: CHAPTER X
- L3097: CHAPTER XI
- L3311: CHAPTER XII
- L3659: CHAPTER XIII
- L3971: CHAPTER XIV
- L4208: CHAPTER XV

## Rejected TOC-like Examples

- L9: CHAPTER I.
- L10: CHAPTER II.
- L11: CHAPTER III.
- L12: CHAPTER IV.
- L13: CHAPTER V.
- L14: CHAPTER VI.
- L15: CHAPTER VII.
- L16: CHAPTER VIII.

## Section Size Sanity

- Sections: 18
- Min/median/max words: 1186/3025/4801
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: medium
- End: medium
- Missing Project Gutenberg end marker; footer text was not destructively stripped.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- TOC/body confusion is likely
