# the-turmoil

- Source: `app/client/assets/temp-books/The Turmoil.txt`
- Title: The Turmoil: A Novel
- Author: Booth Tarkington
- Raw words: 93705
- Detected convention: chapter-based roman numerals
- Confidence: high (0.939)
- Recommended handling: safe for normal processing
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 33 | 33 | 0 | yes |  |
| all-caps-title | 14 | 13 | 1 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 133 | 127 | 6 | no | weaker than selected strategy chapter-roman |
| arabic-only | 1 | 1 | 0 | no | weaker than selected strategy chapter-roman |

## Body Heading Examples

- L13: CHAPTER I
- L135: CHAPTER II
- L316: CHAPTER III
- L648: CHAPTER IV
- L1000: CHAPTER V
- L1263: CHAPTER VI
- L1640: CHAPTER VII
- L1912: CHAPTER VIII

## Rejected TOC-like Examples

- L1919: FUGITIVE
- L867: “Well?”
- L1104: “What!”
- L1496: “How?”
- L1695: “Mary!”
- L1743: “Mary!”
- L1892: “Yes.”

## Section Size Sanity

- Sections: 33
- Min/median/max words: 1224/2667/4359
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
