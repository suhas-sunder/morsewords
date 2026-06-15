# under-the-knife

- Source: `app/client/assets/temp-books/UNDER THE KNIFE.txt`
- Title: UNDER THE KNIFE
- Author: unknown
- Raw words: 9659
- Detected convention: standalone roman numeral sections
- Confidence: medium (0.64)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| roman-only | 3 | 3 | 0 | yes |  |
| all-caps-title | 6 | 2 | 4 | no | weaker than selected strategy roman-only |
| arabic-only | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L81: I
- L112: II
- L153: III

## Rejected TOC-like Examples

- L7: H. G. WELLS
- L9: METHUEN & CO.
- L10: 36 ESSEX STREET, W.C.
- L11: LONDON
- L12: 1897

## Section Size Sanity

- Sections: 3
- Min/median/max words: 775/1463/1798
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: low
- End: low
- Missing Project Gutenberg start marker; body text was not destructively stripped.
- Missing Project Gutenberg end marker; footer text was not destructively stripped.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- start/end boundary confidence is low
