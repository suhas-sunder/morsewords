# the-woman-in-white

- Source: `app/client/assets/temp-books/The Woman in White.txt`
- Title: The Woman in White
- Author: Wilkie Collins
- Raw words: 252438
- Detected convention: standalone roman numeral sections
- Confidence: high (0.937)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| roman-only | 53 | 40 | 13 | yes |  |
| all-caps-title | 42 | 24 | 18 | no | weaker than selected strategy roman-only |
| isolated-title-case | 130 | 117 | 12 | no | weaker than selected strategy roman-only |
| arabic-numbered-title | 6 | 6 | 0 | no | weaker than selected strategy roman-only |
| roman-numbered-title | 1 | 1 | 0 | no | weaker than selected strategy roman-only |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L3125: XII
- L3503: XIII
- L4131: XIV
- L4463: XV
- L6212: IV
- L7150: II
- L7796: I
- L8363: II

## Rejected TOC-like Examples

- L80: II
- L213: III
- L574: IV
- L970: V
- L1054: VI
- L1322: VII
- L1629: VIII
- L2244: IX

## Section Size Sanity

- Sections: 40
- Min/median/max words: 93/5446/16698
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
