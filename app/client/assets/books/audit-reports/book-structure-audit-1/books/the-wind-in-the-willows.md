# the-wind-in-the-willows

- Source: `app/client/assets/temp-books/The Wind in the Willows.txt`
- Title: The Wind in the Willows
- Author: Kenneth Grahame
- Raw words: 62368
- Detected convention: standalone roman numeral sections
- Confidence: high (1)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| roman-only | 13 | 12 | 1 | yes |  |
| all-caps-title | 31 | 22 | 9 | no | weaker than selected strategy roman-only |
| isolated-title-case | 36 | 30 | 6 | no | weaker than selected strategy roman-only |
| roman-numbered-title | 12 | 2 | 10 | no | weaker than selected strategy roman-only |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L94: I
- L581: II
- L1044: III
- L1519: IV
- L1996: V
- L2544: VI
- L3043: VII
- L3433: VIII

## Rejected TOC-like Examples

- L30: MCMXIII

## Section Size Sanity

- Sections: 12
- Min/median/max words: 3778/4789/6116
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
