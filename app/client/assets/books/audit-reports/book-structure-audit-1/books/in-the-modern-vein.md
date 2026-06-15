# in-the-modern-vein

- Source: `app/client/assets/temp-books/IN THE MODERN VEIN.txt`
- Title: IN THE MODERN VEIN
- Author: unknown
- Raw words: 3643
- Detected convention: isolated titled sections
- Confidence: low (0.391)
- Recommended handling: needs manual sectioning review
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| isolated-title-case | 1 | 1 | 0 | yes |  |
| all-caps-title | 6 | 2 | 4 | no | weaker than selected strategy isolated-title-case |
| arabic-only | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L167: “Nothing.”

## Rejected TOC-like Examples

- L7: H. G. WELLS
- L9: METHUEN & CO.
- L10: 36 ESSEX STREET, W.C.
- L11: LONDON
- L12: 1897

## Section Size Sanity

- Sections: 1
- Min/median/max words: 638/638/638
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
