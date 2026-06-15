# the-scarlet-letter

- Source: `app/client/assets/temp-books/The Scarlet Letter.txt`
- Title: The Scarlet Letter
- Author: Nathaniel Hawthorne
- Raw words: 88318
- Detected convention: standalone roman numeral sections
- Confidence: high (0.95)
- Recommended handling: safe for normal processing
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| roman-only | 24 | 24 | 0 | yes |  |
| all-caps-title | 73 | 40 | 32 | no | weaker than selected strategy roman-only |
| isolated-title-case | 76 | 67 | 9 | no | weaker than selected strategy roman-only |
| roman-numbered-title | 24 | 2 | 20 | no | weaker than selected strategy roman-only |
| arabic-only | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L1568: I.
- L1627: II.
- L1967: III.
- L2298: IV.
- L2553: V.
- L2879: VI.
- L3226: VII.
- L3486: VIII.

## Rejected TOC-like Examples

- L1: THE SCARLET LETTER.
- L11: BOSTON:
- L12: JAMES R. OSGOOD AND COMPANY,
- L13: LATE TICKNOR & FIELDS, AND FIELDS, OSGOOD, & CO.
- L16: COPYRIGHT, 1850 AND 1877.
- L17: BY NATHANIEL HAWTHORNE AND JAMES R. OSGOOD & CO.
- L66: PAGE
- L71: THE SCARLET LETTER.
- L9: [Illustration]
- L22: [Illustration]

## Section Size Sanity

- Sections: 24
- Min/median/max words: 495/3163/3882
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
