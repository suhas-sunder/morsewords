# the-purple-pileus

- Source: `app/client/assets/temp-books/THE PURPLE PILEUS.txt`
- Title: THE PURPLE PILEUS
- Author: unknown
- Raw words: 4631
- Detected convention: isolated titled sections
- Confidence: low (0.541)
- Recommended handling: needs manual sectioning review
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| isolated-title-case | 3 | 3 | 0 | yes |  |
| all-caps-title | 5 | 1 | 4 | no | weaker than selected strategy isolated-title-case |
| arabic-only | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L106: “Tea,” said Mr. Coombes. “Jol’ thing, tea. Tose-stools, too. Brosher.”
- L134: “Well?”
- L144: “Well?”

## Rejected TOC-like Examples

- L7: H. G. WELLS
- L9: METHUEN & CO.
- L10: 36 ESSEX STREET, W.C.
- L11: LONDON
- L12: 1897

## Section Size Sanity

- Sections: 3
- Min/median/max words: 167/203/1170
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: low
- End: low
- Missing Project Gutenberg start marker; body text was not destructively stripped.
- Missing Project Gutenberg end marker; footer text was not destructively stripped.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- TOC/body confusion is likely
- start/end boundary confidence is low
