# a-slip-under-the-microscope

- Source: `app/client/assets/temp-books/A SLIP UNDER THE MICROSCOPE.txt`
- Title: A SLIP UNDER THE MICROSCOPE
- Author: unknown
- Raw words: 7057
- Detected convention: isolated titled sections
- Confidence: medium (0.621)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| isolated-title-case | 5 | 5 | 0 | yes |  |
| all-caps-title | 6 | 2 | 4 | no | weaker than selected strategy isolated-title-case |
| arabic-only | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L75: H. J. Somers Wedderburn
- L195: “Moved? Never!”
- L201: “It was Mr. Hill.”
- L203: “Hill!”
- L205: “Mr. Hill!”

## Rejected TOC-like Examples

- L7: H. G. WELLS
- L9: METHUEN & CO.
- L10: 36 ESSEX STREET, W.C.
- L11: LONDON
- L12: 1897

## Section Size Sanity

- Sections: 5
- Min/median/max words: 1/25/3731
- Notes: many very small sections; headings may include TOC, captions, or fragments; largest section is much bigger than the median section

## Boundary Confidence

- Start: low
- End: low
- Missing Project Gutenberg start marker; body text was not destructively stripped.
- Missing Project Gutenberg end marker; footer text was not destructively stripped.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- start/end boundary confidence is low
