# romeo-and-juliet

- Source: `app/client/assets/temp-books/Romeo and Juliet.txt`
- Title: Romeo and Juliet
- Author: William Shakespeare
- Raw words: 29891
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
| all-caps-title | 843 | 637 | 206 | no | weaker than selected strategy act-prefixed |
| isolated-title-case | 108 | 96 | 12 | no | weaker than selected strategy act-prefixed |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L108: ACT I
- L1384: ACT II
- L2522: ACT III
- L3822: ACT IV
- L4540: ACT V

## Rejected TOC-like Examples

- L10: ACT I
- L17: ACT II
- L26: ACT III
- L33: ACT IV
- L40: ACT V

## Section Size Sanity

- Sections: 5
- Min/median/max words: 3559/5815/6957
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
