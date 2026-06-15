# the-sign-of-the-four

- Source: `app/client/assets/temp-books/The Sign of the Four.txt`
- Title: The Sign of the Four
- Author: Arthur Conan Doyle
- Raw words: 46661
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
| isolated-title-case | 38 | 35 | 1 | no | weaker than selected strategy chapter-roman |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L344: Chapter II
- L559: Chapter III
- L743: Chapter IV
- L1107: Chapter V
- L1395: Chapter VI
- L1754: Chapter VII
- L2208: Chapter VIII
- L2599: Chapter IX

## Rejected TOC-like Examples

- L9: Chapter I. The Science of Deduction
- L10: Chapter II. The Statement of the Case
- L11: Chapter III. In Quest of a Solution
- L12: Chapter IV. The Story of the Bald-Headed Man
- L13: Chapter V. The Tragedy of Pondicherry Lodge
- L14: Chapter VI. Sherlock Holmes Gives a Demonstration
- L15: Chapter VII. The Episode of the Barrel
- L16: Chapter VIII. The Baker Street Irregulars

## Section Size Sanity

- Sections: 11
- Min/median/max words: 1745/3365/10378
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- TOC/body confusion is likely
