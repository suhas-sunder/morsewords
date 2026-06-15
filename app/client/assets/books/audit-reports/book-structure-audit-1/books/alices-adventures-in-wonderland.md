# alices-adventures-in-wonderland

- Source: `app/client/assets/temp-books/alices-adventures-in-wonderland.txt`
- Title: Alice's Adventures in Wonderland
- Author: Lewis Carroll
- Raw words: 30441
- Detected convention: chapter-based roman numerals
- Confidence: high (0.964)
- Recommended handling: needs manual sectioning review
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 24 | 11 | 13 | yes |  |
| isolated-title-case | 24 | 23 | 1 | no | weaker than selected strategy chapter-roman |
| all-caps-title | 3 | 2 | 1 | no | weaker than selected strategy chapter-roman |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L243: CHAPTER II.
- L446: CHAPTER III.
- L654: CHAPTER IV.
- L916: CHAPTER V.
- L1213: CHAPTER VI.
- L1538: CHAPTER VII.
- L1881: CHAPTER VIII.
- L2187: CHAPTER IX.

## Rejected TOC-like Examples

- L12: CHAPTER I. Down the Rabbit-Hole
- L13: CHAPTER II. The Pool of Tears
- L14: CHAPTER III. A Caucus-Race and a Long Tale
- L15: CHAPTER IV. The Rabbit Sends in a Little Bill
- L16: CHAPTER V. Advice from a Caterpillar
- L17: CHAPTER VI. Pig and Pepper
- L18: CHAPTER VII. A Mad Tea-Party
- L19: CHAPTER VIII. The Queen’s Croquet-Ground

## Section Size Sanity

- Sections: 11
- Min/median/max words: 1733/2242/2728
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- Manifest: `app/client/assets/books/generated/alices-adventures-in-wonderland/manifest.json`
- Sections: 14
- Included sections: 12
- Rights have not been reviewed; generated book is not publish-ready.
- Rights gate status is needs_manual_review; generated book is not publish-ready.
- Rights gate did not allow processed public story output.
- Owner-reviewed website approval is missing.
- Website publication is not allowed by the active approval path.

## Red Flags

- TOC/body confusion is likely
