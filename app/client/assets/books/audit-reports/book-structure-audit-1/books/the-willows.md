# the-willows

- Source: `app/client/assets/temp-books/The Willows.txt`
- Title: The Willows
- Author: Algernon Blackwood
- Raw words: 22947
- Detected convention: standalone roman numeral sections
- Confidence: high (0.884)
- Recommended handling: needs manual sectioning review
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| roman-only | 10 | 4 | 6 | yes |  |
| isolated-title-case | 4 | 2 | 0 | no | weaker than selected strategy roman-only |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L637: II.
- L749: III.
- L901: IV.
- L1887: V.

## Rejected TOC-like Examples

- L10: I.
- L11: II.
- L12: III.
- L13: IV.
- L14: V.
- L17: I.

## Section Size Sanity

- Sections: 4
- Min/median/max words: 1160/1798/9068
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- TOC/body confusion is likely
