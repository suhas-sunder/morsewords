# typhoon

- Source: `app/client/assets/temp-books/Typhoon.txt`
- Title: Typhoon
- Author: Joseph Conrad
- Raw words: 34249
- Detected convention: standalone roman numeral sections
- Confidence: high (0.87)
- Recommended handling: safe for normal processing
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| roman-only | 6 | 6 | 0 | yes |  |
| isolated-title-case | 11 | 11 | 0 | no | weaker than selected strategy roman-only |
| all-caps-title | 3 | 2 | 1 | no | weaker than selected strategy roman-only |
| arabic-numbered-title | 1 | 1 | 0 | no | weaker than selected strategy roman-only |
| special-front-back | 1 | 1 | 0 | no | weaker than selected strategy roman-only |

## Body Heading Examples

- L151: I
- L648: II
- L1275: III
- L1627: IV
- L2336: V
- L2915: VI

## Rejected TOC-like Examples

- L6: TYPHOON

## Section Size Sanity

- Sections: 6
- Min/median/max words: 3400/5225/6662
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
