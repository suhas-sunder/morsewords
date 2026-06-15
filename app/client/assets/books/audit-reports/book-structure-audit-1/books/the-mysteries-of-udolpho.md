# the-mysteries-of-udolpho

- Source: `app/client/assets/temp-books/The Mysteries of Udolpho.txt`
- Title: The Mysteries of Udolpho
- Author: Ann Ward Radcliffe
- Raw words: 296842
- Detected convention: chapter-based roman numerals with volume divisions
- Confidence: high (0.992)
- Recommended handling: needs manual sectioning review
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 114 | 44 | 70 | yes |  |
| volume-division | 8 | 4 | 4 | no | weaker than selected strategy chapter-roman |
| all-caps-title | 87 | 70 | 17 | no | weaker than selected strategy chapter-roman |
| roman-numbered-title | 7 | 7 | 0 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 30 | 26 | 0 | no | weaker than selected strategy chapter-roman |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L7080: CHAPTER I
- L7477: CHAPTER II
- L7962: CHAPTER III
- L9373: CHAPTER IV
- L9731: CHAPTER V
- L10629: CHAPTER VI
- L12063: CHAPTER VII
- L12959: CHAPTER VIII

## Rejected TOC-like Examples

- L17: CHAPTER I
- L18: CHAPTER II
- L19: CHAPTER III
- L20: CHAPTER IV
- L21: CHAPTER V
- L22: CHAPTER VI
- L23: CHAPTER VII
- L24: CHAPTER VIII

## Section Size Sanity

- Sections: 44
- Min/median/max words: 969/4243/13724
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
