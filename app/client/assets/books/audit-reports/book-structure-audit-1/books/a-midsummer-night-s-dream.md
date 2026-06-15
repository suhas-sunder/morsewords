# a-midsummer-night-s-dream

- Source: `app/client/assets/temp-books/A Midsummer Night's Dream.txt`
- Title: A Midsummer Night's Dream
- Author: William Shakespeare
- Raw words: 20837
- Detected convention: play acts
- Confidence: high (0.92)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| act-prefixed | 10 | 5 | 5 | yes |  |
| all-caps-title | 502 | 400 | 102 | no | weaker than selected strategy act-prefixed |
| isolated-title-case | 110 | 79 | 31 | no | weaker than selected strategy act-prefixed |
| special-front-back | 3 | 2 | 1 | no | weaker than selected strategy act-prefixed |
| scene-prefixed | 9 | 0 | 9 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L73: ACT I
- L626: ACT II
- L1247: ACT III
- L2360: ACT IV
- L2786: ACT V

## Rejected TOC-like Examples

- L8: ACT I
- L14: ACT II
- L20: ACT III
- L26: ACT IV
- L32: ACT V

## Section Size Sanity

- Sections: 5
- Min/median/max words: 2246/3294/5550
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
