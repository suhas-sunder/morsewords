# little-fuzzy

- Source: `app/client/assets/temp-books/Little Fuzzy.txt`
- Title: Little Fuzzy
- Author: H. Beam Piper
- Raw words: 62323
- Detected convention: standalone roman numeral sections
- Confidence: high (0.95)
- Recommended handling: safe for normal processing
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| roman-only | 17 | 17 | 0 | yes |  |
| isolated-title-case | 73 | 72 | 1 | no | weaker than selected strategy roman-only |
| all-caps-title | 1 | 1 | 0 | no | weaker than selected strategy roman-only |

## Body Heading Examples

- L11: I
- L436: II
- L931: III
- L1268: IV
- L1519: V
- L2179: VI
- L2744: VII
- L3303: VIII

## Rejected TOC-like Examples

- L682: "Yeek?"

## Section Size Sanity

- Sections: 17
- Min/median/max words: 1350/3816/5387
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
