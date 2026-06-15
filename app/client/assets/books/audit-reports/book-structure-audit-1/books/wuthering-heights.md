# wuthering-heights

- Source: `app/client/assets/temp-books/Wuthering Heights.txt`
- Title: Wuthering Heights
- Author: Emily Brontë
- Raw words: 121975
- Detected convention: chapter-based roman numerals
- Confidence: high (0.95)
- Recommended handling: safe for normal processing
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 34 | 34 | 0 | yes |  |
| isolated-title-case | 23 | 22 | 1 | no | weaker than selected strategy chapter-roman |
| roman-numbered-title | 3 | 3 | 0 | no | weaker than selected strategy chapter-roman |

## Body Heading Examples

- L6: CHAPTER I
- L211: CHAPTER II
- L620: CHAPTER III
- L1117: CHAPTER IV
- L1398: CHAPTER V
- L1524: CHAPTER VI
- L1759: CHAPTER VII
- L2171: CHAPTER VIII

## Rejected TOC-like Examples

- L2396: Heathcliff?”

## Section Size Sanity

- Sections: 34
- Min/median/max words: 1430/3407/6977
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
