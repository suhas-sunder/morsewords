# dagon

- Source: `app/client/assets/temp-books/Dagon.txt`
- Title: Dagon
- Author: Howard Phillips Lovecraft (1890-1937)
- Raw words: 2267
- Detected convention: isolated titled sections
- Confidence: medium (0.601)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| isolated-title-case | 6 | 3 | 3 | yes |  |
| all-caps-title | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L29: _H. P. Lovecraft, master of
- L33: Dagon
- L243: [The end of _Dagon_ by Howard Phillips Lovecraft]

## Rejected TOC-like Examples

- L16: Title: Dagon
- L18: Author: Howard Phillips Lovecraft (1890-1937)
- L26: [Source: Weird Tales, November 1951]

## Section Size Sanity

- Sections: 3
- Min/median/max words: 8/13/2089
- Notes: largest section is much bigger than the median section

## Boundary Confidence

- Start: low
- End: low
- Missing Project Gutenberg start marker; body text was not destructively stripped.
- Missing Project Gutenberg end marker; footer text was not destructively stripped.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- start/end boundary confidence is low
