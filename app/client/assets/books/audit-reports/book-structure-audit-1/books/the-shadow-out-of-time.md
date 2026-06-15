# the-shadow-out-of-time

- Source: `app/client/assets/temp-books/The Shadow Out of Time.txt`
- Title: The Shadow Out of Time
- Author: unknown
- Raw words: 25650
- Detected convention: standalone roman numeral sections
- Confidence: high (0.834)
- Recommended handling: needs manual sectioning review
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| roman-only | 7 | 7 | 0 | yes |  |
| all-caps-title | 5 | 4 | 1 | no | weaker than selected strategy roman-only |
| isolated-title-case | 14 | 11 | 3 | no | weaker than selected strategy roman-only |

## Body Heading Examples

- L359: II.
- L673: III.
- L1035: IV.
- L1523: V.
- L1857: VI.
- L2252: VII.
- L2531: VIII.

## Rejected TOC-like Examples

- L14: IN YOUR COUNTRY, DO NOT DOWNLOAD OR REDISTRIBUTE THIS FILE.
- L16: _Title:_ The Shadow Out of Time
- L18: _Author:_ H. P. (Howard Phillips) Lovecraft, (1890-1937)
- L19: _Illustrator:_ Howard V. Brown (1878-1945)

## Section Size Sanity

- Sections: 7
- Min/median/max words: 2478/3124/4343
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
