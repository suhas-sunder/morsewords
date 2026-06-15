# the-shadow-over-innsmouth

- Source: `app/client/assets/temp-books/The shadow over Innsmouth.txt`
- Title: The shadow over Innsmouth
- Author: H. P. Lovecraft
- Raw words: 20345
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
| isolated-title-case | 7 | 7 | 0 | no | weaker than selected strategy roman-only |
| all-caps-title | 3 | 2 | 1 | no | weaker than selected strategy roman-only |

## Body Heading Examples

- L278: II
- L532: III
- L950: IV
- L1478: V

## Rejected TOC-like Examples

- L5: By H. P. LOVECRAFT

## Section Size Sanity

- Sections: 4
- Min/median/max words: 2424/4186/5496
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
