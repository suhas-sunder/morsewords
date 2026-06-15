# the-monkey-s-paw

- Source: `app/client/assets/temp-books/The Monkey's Paw.txt`
- Title: The Monkey's Paw
- Author: W. W. Jacobs
- Raw words: 7199
- Detected convention: standalone roman numeral sections
- Confidence: medium (0.72)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| roman-only | 3 | 3 | 0 | yes |  |
| isolated-title-case | 3 | 2 | 1 | no | weaker than selected strategy roman-only |
| all-caps-title | 3 | 3 | 0 | no | weaker than selected strategy roman-only |

## Body Heading Examples

- L13: I.
- L250: II.
- L375: III.

## Rejected TOC-like Examples

- L1: [Illustration]

## Section Size Sanity

- Sections: 3
- Min/median/max words: 958/1304/1771
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
