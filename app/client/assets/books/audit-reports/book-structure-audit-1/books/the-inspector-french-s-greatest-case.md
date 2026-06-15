# the-inspector-french-s-greatest-case

- Source: `app/client/assets/temp-books/The Inspector French’s Greatest Case.txt`
- Title: Inspector French's greatest case
- Author: Freeman Wills Crofts
- Raw words: 85958
- Detected convention: chapter-based roman numerals
- Confidence: high (0.95)
- Recommended handling: safe for normal processing
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 20 | 20 | 0 | yes |  |
| all-caps-title | 37 | 35 | 2 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 74 | 73 | 1 | no | weaker than selected strategy chapter-roman |
| arabic-numbered-title | 27 | 27 | 0 | no | weaker than selected strategy chapter-roman |
| roman-numbered-title | 23 | 3 | 20 | no | weaker than selected strategy chapter-roman |
| arabic-only | 1 | 1 | 0 | no | weaker than selected strategy chapter-roman |
| roman-only | 1 | 1 | 0 | no | weaker than selected strategy chapter-roman |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L56: CHAPTER I
- L535: CHAPTER II
- L920: CHAPTER III
- L1383: CHAPTER IV
- L1912: CHAPTER V
- L2328: CHAPTER VI
- L2896: CHAPTER VII
- L3276: CHAPTER VIII

## Rejected TOC-like Examples

- L28: PRINTED IN THE UNITED STATES OF AMERICA
- L33: CHAP. PAGE
- L1593: Vanderkemp?”
- L34: I. MURDER! 1
- L35: II. THE FIRM OF DUKE AND PEABODY 17
- L36: III. GATHERING THE THREADS 29
- L37: IV. MISSING 45
- L38: V. FRENCH TAKES A JOURNEY 62
- L39: VI. THE HOTEL IN BARCELONA 77
- L40: VII. CONCERNING A WEDDING 96

## Section Size Sanity

- Sections: 20
- Min/median/max words: 2971/4211/5119
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
