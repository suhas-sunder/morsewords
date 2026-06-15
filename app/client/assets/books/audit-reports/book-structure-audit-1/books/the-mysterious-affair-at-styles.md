# the-mysterious-affair-at-styles

- Source: `app/client/assets/temp-books/The Mysterious Affair at Styles.txt`
- Title: The Mysterious Affair at Styles
- Author: Agatha Christie
- Raw words: 61089
- Detected convention: chapter-based roman numerals
- Confidence: high (0.964)
- Recommended handling: needs manual sectioning review
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 26 | 12 | 14 | yes |  |
| all-caps-title | 20 | 19 | 1 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 179 | 166 | 11 | no | weaker than selected strategy chapter-roman |
| roman-numbered-title | 3 | 3 | 0 | no | weaker than selected strategy chapter-roman |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L586: CHAPTER II.
- L955: CHAPTER III.
- L1256: CHAPTER IV.
- L2189: CHAPTER V.
- L3450: CHAPTER VI.
- L4061: CHAPTER VII.
- L4571: CHAPTER VIII.
- L5302: CHAPTER IX.

## Rejected TOC-like Examples

- L8: CHAPTER I. I GO TO STYLES
- L9: CHAPTER II. THE 16TH AND 17TH OF JULY
- L10: CHAPTER III. THE NIGHT OF THE TRAGEDY
- L11: CHAPTER IV. POIROT INVESTIGATES
- L12: CHAPTER V. “IT ISN’T STRYCHNINE, IS IT?”
- L13: CHAPTER VI. THE INQUEST
- L14: CHAPTER VII. POIROT PAYS HIS DEBTS
- L15: CHAPTER VIII. FRESH SUSPICIONS

## Section Size Sanity

- Sections: 12
- Min/median/max words: 2222/4212/8115
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- TOC/body confusion is likely
