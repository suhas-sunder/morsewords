# four-day-planet

- Source: `app/client/assets/temp-books/Four-Day Planet.txt`
- Title: Four-Day Planet
- Author: H. Beam Piper
- Raw words: 61092
- Detected convention: standalone arabic-numbered sections
- Confidence: high (0.95)
- Recommended handling: safe for normal processing
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| arabic-only | 20 | 20 | 0 | yes |  |
| isolated-title-case | 67 | 61 | 5 | no | weaker than selected strategy arabic-only |
| all-caps-title | 34 | 33 | 1 | no | weaker than selected strategy arabic-only |
| arabic-numbered-title | 20 | 2 | 18 | no | weaker than selected strategy arabic-only |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L89: 1
- L494: 2
- L879: 3
- L1196: 4
- L1530: 5
- L1911: 6
- L2209: 7
- L2480: 8

## Rejected TOC-like Examples

- L11: Four-Day Planet
- L21: 360 Park Avenue South
- L22: New York, New York 10010
- L25: Copyright © 1961 by H. Beam Piper
- L87: Four-Day Planet
- L20: A GROSSET & DUNLAP COMPANY
- L44: 1. The Ship from Terra
- L46: 2. Reporter Working
- L48: 3. Bottom Level
- L50: 4. Main City Level

## Section Size Sanity

- Sections: 20
- Min/median/max words: 1550/2916/4777
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
