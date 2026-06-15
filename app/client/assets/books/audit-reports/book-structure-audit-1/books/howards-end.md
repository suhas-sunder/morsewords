# howards-end

- Source: `app/client/assets/temp-books/Howards End.txt`
- Title: Howards End
- Author: E. M. Forster
- Raw words: 102432
- Detected convention: chapter-based roman numerals
- Confidence: high (0.95)
- Recommended handling: safe for normal processing
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 40 | 40 | 0 | yes |  |
| all-caps-title | 20 | 16 | 4 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 181 | 168 | 13 | no | weaker than selected strategy chapter-roman |
| roman-numbered-title | 1 | 1 | 0 | no | weaker than selected strategy chapter-roman |

## Body Heading Examples

- L6: CHAPTER I
- L132: CHAPTER II
- L391: CHAPTER III
- L797: CHAPTER IV
- L1072: CHAPTER V
- L1612: CHAPTER VI
- L2036: CHAPTER VII
- L2365: CHAPTER VIII

## Rejected TOC-like Examples

- L1: HOWARDS END
- L84: “HELEN.”
- L121: “HELEN.”
- L2471: “M. J. SCHLEGEL.”
- L12: “Howards End,
- L16: “Dearest Meg,
- L87: “Howards End
- L124: “Howards End,
- L718: “No.”
- L1648: “Evening, Mr. Bast.”

## Section Size Sanity

- Sections: 40
- Min/median/max words: 445/2599/5340
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: medium
- End: medium
- Missing Project Gutenberg end marker; footer text was not destructively stripped.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
