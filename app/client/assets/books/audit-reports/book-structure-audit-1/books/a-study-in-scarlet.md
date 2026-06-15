# a-study-in-scarlet

- Source: `app/client/assets/temp-books/A Study in Scarlet.txt`
- Title: A Study in Scarlet
- Author: Arthur Conan Doyle
- Raw words: 47060
- Detected convention: chapter-based roman numerals with part divisions
- Confidence: high (0.95)
- Recommended handling: needs manual sectioning review
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 28 | 11 | 17 | yes |  |
| all-caps-title | 22 | 20 | 2 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 26 | 25 | 1 | no | weaker than selected strategy chapter-roman |
| part-division | 4 | 2 | 2 | no | weaker than selected strategy chapter-roman |
| arabic-numbered-title | 12 | 4 | 8 | no | weaker than selected strategy chapter-roman |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L1205: CHAPTER IV.
- L1487: CHAPTER V.
- L1766: CHAPTER VI.
- L2153: CHAPTER VII.
- L2510: CHAPTER I.
- L2908: CHAPTER II.
- L3166: CHAPTER III.
- L3372: CHAPTER IV.

## Rejected TOC-like Examples

- L11: CHAPTER I. MR. SHERLOCK HOLMES.
- L12: CHAPTER II. THE SCIENCE OF DEDUCTION.
- L13: CHAPTER III. THE LAURISTON GARDENS MYSTERY
- L14: CHAPTER IV. WHAT JOHN RANCE HAD TO TELL.
- L15: CHAPTER V. OUR ADVERTISEMENT BRINGS A VISITOR.
- L16: CHAPTER VI. TOBIAS GREGSON SHOWS WHAT HE CAN DO.
- L17: CHAPTER VII. LIGHT IN THE DARKNESS.
- L20: CHAPTER I. ON THE GREAT ALKALI PLAIN.

## Section Size Sanity

- Sections: 11
- Min/median/max words: 1878/3239/4554
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- TOC/body confusion is likely
