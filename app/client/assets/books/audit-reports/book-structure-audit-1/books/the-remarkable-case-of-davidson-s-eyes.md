# the-remarkable-case-of-davidson-s-eyes

- Source: `app/client/assets/temp-books/THE REMARKABLE CASE OF DAVIDSON'S EYES.txt`
- Title: The Stolen Bacillus and Other Incidents
- Author: H. G. Wells
- Raw words: 4107
- Detected convention: standalone roman numeral sections
- Confidence: high (0.834)
- Recommended handling: safe for normal processing
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| roman-only | 4 | 4 | 0 | yes |  |
| all-caps-title | 9 | 5 | 4 | no | weaker than selected strategy roman-only |
| isolated-title-case | 2 | 1 | 1 | no | weaker than selected strategy roman-only |
| arabic-only | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L147: II.
- L219: III.
- L320: IV.
- L373: V.

## Rejected TOC-like Examples

- L5: AUTHOR OF "THE TIME MACHINE"
- L7: METHUEN & CO.
- L8: 36 ESSEX STREET, STRAND
- L9: LONDON
- L11: _Colonial Library_
- L10: 1895

## Section Size Sanity

- Sections: 4
- Min/median/max words: 548/631/1089
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: medium
- End: medium
- Missing Project Gutenberg end marker; footer text was not destructively stripped.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
