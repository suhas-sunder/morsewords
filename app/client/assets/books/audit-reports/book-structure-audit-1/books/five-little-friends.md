# five-little-friends

- Source: `app/client/assets/temp-books/Five Little Friends.txt`
- Title: Five Little Friends
- Author: Sherred Willcox Adams
- Raw words: 14963
- Detected convention: story or titled-section headings
- Confidence: high (0.821)
- Recommended handling: needs manual sectioning review
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| all-caps-title | 15 | 5 | 9 | yes |  |
| isolated-title-case | 36 | 30 | 6 | no | weaker than selected strategy all-caps-title |
| roman-only | 2 | 2 | 0 | no | weaker than selected strategy all-caps-title |
| arabic-only | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L23: BY THE MACMILLAN COMPANY.
- L321: [Illustration: THE SIGNS WERE LIKE THESE ONLY MUCH, MUCH BIGGER]
- L520: [Illustration: THE LUNCH WAS PACKED AND OFF THE CHILDREN WENT]
- L523: THE FIVE LITTLE FRIENDS IN VACATION
- L1321: B. J.

## Rejected TOC-like Examples

- L9: SHERRED WILLCOX ADAMS
- L11: _ILLUSTRATED BY_
- L12: MAUD AND MISKA PETERSHAM
- L15: THE MACMILLAN COMPANY
- L21: COPYRIGHT, 1922,
- L35: PAGE
- L37: THE FIVE LITTLE FRIENDS AT SCHOOL 1
- L39: THE FIVE LITTLE FRIENDS IN VACATION 53

## Section Size Sanity

- Sections: 5
- Min/median/max words: 10/1814/6466
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- TOC/body confusion is likely
