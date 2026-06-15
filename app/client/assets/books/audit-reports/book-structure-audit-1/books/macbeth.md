# macbeth

- Source: `app/client/assets/temp-books/Macbeth.txt`
- Title: Macbeth
- Author: William Shakespeare
- Raw words: 22227
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
| all-caps-title | 652 | 532 | 120 | no | weaker than selected strategy act-prefixed |
| isolated-title-case | 105 | 80 | 25 | no | weaker than selected strategy act-prefixed |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L89: ACT I
- L946: ACT II
- L1630: ACT III
- L2487: ACT IV
- L3414: ACT V

## Rejected TOC-like Examples

- L8: ACT I
- L18: ACT II
- L25: ACT III
- L34: ACT IV
- L40: ACT V

## Section Size Sanity

- Sections: 5
- Min/median/max words: 3015/4104/4159
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
