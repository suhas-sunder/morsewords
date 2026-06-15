# the-history-of-sir-richard-calmady-a-romance

- Source: `app/client/assets/temp-books/The History of Sir Richard Calmady - A Romance.txt`
- Title: The History of Sir Richard Calmady: A Romance
- Author: Lucas Malet
- Raw words: 267796
- Detected convention: chapter-based roman numerals with book divisions
- Confidence: high (0.951)
- Recommended handling: needs manual sectioning review
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 60 | 44 | 16 | yes |  |
| all-caps-title | 94 | 82 | 11 | no | weaker than selected strategy chapter-roman |
| book-division | 12 | 6 | 6 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 91 | 72 | 5 | no | weaker than selected strategy chapter-roman |
| roman-numbered-title | 60 | 19 | 18 | no | weaker than selected strategy chapter-roman |
| arabic-only | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L6726: CHAPTER VII
- L7133: CHAPTER VIII
- L7605: CHAPTER I
- L7822: CHAPTER II
- L8146: CHAPTER III
- L8479: CHAPTER IV
- L9005: CHAPTER V
- L9668: CHAPTER VI

## Rejected TOC-like Examples

- L230: CHAPTER I
- L437: CHAPTER II
- L941: CHAPTER III
- L1148: CHAPTER IV
- L1501: CHAPTER V
- L1916: CHAPTER VI
- L2435: CHAPTER VII
- L2934: CHAPTER VIII

## Section Size Sanity

- Sections: 44
- Min/median/max words: 1684/4522/9777
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- body headings were found but rejected by the selected strategy
