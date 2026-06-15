# the-time-machine

- Source: `app/client/assets/temp-books/The Time Machine.txt`
- Title: The Time Machine
- Author: H. G. Wells
- Raw words: 35884
- Detected convention: standalone roman numeral sections
- Confidence: high (0.964)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| roman-only | 16 | 15 | 1 | yes |  |
| isolated-title-case | 38 | 21 | 16 | no | weaker than selected strategy roman-only |
| special-front-back | 4 | 2 | 2 | no | weaker than selected strategy roman-only |
| roman-numbered-title | 1 | 1 | 0 | no | weaker than selected strategy roman-only |

## Body Heading Examples

- L249: II.
- L401: III.
- L598: IV.
- L792: V.
- L951: VI.
- L1165: VII.
- L1372: VIII.
- L1754: IX.

## Rejected TOC-like Examples

- L29: I.

## Section Size Sanity

- Sections: 15
- Min/median/max words: 488/2108/4213
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
