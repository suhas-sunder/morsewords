# north-and-south

- Source: `app/client/assets/temp-books/North and South.txt`
- Title: North and South
- Author: Elizabeth Cleghorn Gaskell
- Raw words: 20943
- Detected convention: chapter-based roman numerals
- Confidence: high (0.87)
- Recommended handling: safe for normal processing
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 6 | 6 | 0 | yes |  |
| all-caps-title | 19 | 15 | 4 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 10 | 10 | 0 | no | weaker than selected strategy chapter-roman |

## Body Heading Examples

- L27: CHAPTER I.
- L451: CHAPTER II.
- L742: CHAPTER III.
- L1146: CHAPTER IV.
- L1569: CHAPTER V.
- L2061: CHAPTER VI.

## Rejected TOC-like Examples

- L13: MRS. GASKELL
- L17: LONDON
- L18: WALTER SCOTT, LIMITED
- L19: PATERNOSTER SQUARE

## Section Size Sanity

- Sections: 6
- Min/median/max words: 480/4002/4872
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: medium
- End: medium
- Missing Project Gutenberg end marker; footer text was not destructively stripped.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
