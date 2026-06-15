# hamlet

- Source: `app/client/assets/temp-books/Hamlet.txt`
- Title: Hamlet
- Author: William Shakespeare
- Raw words: 36471
- Detected convention: play acts
- Confidence: high (0.91)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| act-prefixed | 10 | 9 | 1 | yes |  |
| all-caps-title | 74 | 51 | 23 | no | weaker than selected strategy act-prefixed |
| special-front-back | 5 | 4 | 1 | no | weaker than selected strategy act-prefixed |
| isolated-title-case | 385 | 352 | 33 | no | weaker than selected strategy act-prefixed |
| arabic-only | 1 | 1 | 0 | no | weaker than selected strategy act-prefixed |
| roman-numbered-title | 1 | 1 | 0 | no | weaker than selected strategy act-prefixed |

## Body Heading Examples

- L1192: Act I
- L1634: ACT II.
- L2306: Act II
- L2609: ACT III.
- L3651: Act III
- L4225: ACT IV.
- L4763: Act IV
- L4958: ACT V.

## Rejected TOC-like Examples

- L163: ACT I.

## Section Size Sanity

- Sections: 9
- Min/median/max words: 1167/2510/5710
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
