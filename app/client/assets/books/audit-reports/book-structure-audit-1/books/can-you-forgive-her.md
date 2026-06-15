# can-you-forgive-her

- Source: `app/client/assets/temp-books/Can You Forgive Her.txt`
- Title: Can You Forgive Her?
- Author: Anthony Trollope
- Raw words: 318007
- Detected convention: chapter-based roman numerals with volume divisions
- Confidence: high (0.95)
- Recommended handling: safe for normal processing
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 80 | 80 | 0 | yes |  |
| all-caps-title | 25 | 23 | 2 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 187 | 175 | 11 | no | weaker than selected strategy chapter-roman |
| roman-only | 1 | 1 | 0 | no | weaker than selected strategy chapter-roman |
| volume-division | 6 | 1 | 5 | no | weaker than selected strategy chapter-roman |
| roman-numbered-title | 80 | 0 | 80 | no | rejected as TOC-like or front-matter-only evidence |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L190: CHAPTER I.
- L443: CHAPTER II.
- L915: CHAPTER III.
- L1459: CHAPTER IV.
- L1817: CHAPTER V.
- L2270: CHAPTER VI.
- L2750: CHAPTER VII.
- L3183: CHAPTER VIII.

## Rejected TOC-like Examples

- L930: DEAREST ALICE,
- L4397: ALICE VAVASOR.
- L576: Alice."
- L1399: "No."
- L1638: "No."
- L1640: "Oh, George!"
- L2953: "No!"
- L3120: Bellfield."
- L3367: Cheesacre?"
- L4312: Queen Anne Street,

## Section Size Sanity

- Sections: 80
- Min/median/max words: 2316/3969/6314
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
