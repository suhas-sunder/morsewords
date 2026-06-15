# crime-and-punishment

- Source: `app/client/assets/temp-books/Crime and Punishment.txt`
- Title: Crime and Punishment
- Author: Fyodor Dostoyevsky
- Raw words: 211320
- Detected convention: chapter-based roman numerals with part divisions
- Confidence: high (0.943)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 39 | 29 | 10 | yes |  |
| part-division | 6 | 6 | 0 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 118 | 113 | 5 | no | weaker than selected strategy chapter-roman |
| all-caps-title | 6 | 5 | 1 | no | weaker than selected strategy chapter-roman |
| roman-only | 2 | 2 | 0 | no | weaker than selected strategy chapter-roman |
| roman-numbered-title | 2 | 2 | 0 | no | weaker than selected strategy chapter-roman |
| special-front-back | 1 | 1 | 0 | no | weaker than selected strategy chapter-roman |

## Body Heading Examples

- L5297: CHAPTER IV
- L5732: CHAPTER V
- L6238: CHAPTER VI
- L7147: CHAPTER VII
- L7930: CHAPTER I
- L8473: CHAPTER II
- L8958: CHAPTER III
- L9560: CHAPTER IV

## Rejected TOC-like Examples

- L98: CHAPTER I
- L439: CHAPTER II
- L1091: CHAPTER III
- L1582: CHAPTER IV
- L2056: CHAPTER V
- L2494: CHAPTER VI
- L2982: CHAPTER VII
- L3488: CHAPTER I

## Section Size Sanity

- Sections: 29
- Min/median/max words: 2797/5101/10405
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- Manifest: `app/client/assets/books/generated/crime-and-punishment/manifest.json`
- Sections: 47
- Included sections: 39
- No generated comparison warnings.

## Red Flags

- None.
