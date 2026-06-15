# war-and-peace

- Source: `app/client/assets/temp-books/War and Peace.txt`
- Title: War and Peace
- Author: graf Leo Tolstoy
- Raw words: 585368
- Detected convention: chapter-based roman numerals with book divisions
- Confidence: high (0.957)
- Recommended handling: needs manual sectioning review
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 730 | 299 | 431 | yes |  |
| book-division | 30 | 15 | 15 | no | weaker than selected strategy chapter-roman |
| all-caps-title | 17 | 10 | 6 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 125 | 116 | 8 | no | weaker than selected strategy chapter-roman |
| roman-numbered-title | 4 | 4 | 0 | no | weaker than selected strategy chapter-roman |
| arabic-only | 2 | 2 | 0 | no | weaker than selected strategy chapter-roman |
| arabic-numbered-title | 1 | 1 | 0 | no | weaker than selected strategy chapter-roman |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L15865: CHAPTER XVIII
- L16142: CHAPTER XIX
- L16342: CHAPTER I
- L16721: CHAPTER II
- L16964: CHAPTER III
- L17162: CHAPTER IV
- L17369: CHAPTER V
- L17481: CHAPTER VI

## Rejected TOC-like Examples

- L11: CHAPTER I
- L13: CHAPTER II
- L15: CHAPTER III
- L17: CHAPTER IV
- L19: CHAPTER V
- L21: CHAPTER VI
- L23: CHAPTER VII
- L25: CHAPTER VIII

## Section Size Sanity

- Sections: 299
- Min/median/max words: 154/1390/4206
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- TOC/body confusion is likely
- body headings were found but rejected by the selected strategy
