# spoon-river-anthology

- Source: `app/client/assets/temp-books/Spoon River Anthology.txt`
- Title: Spoon River Anthology
- Author: Edgar Lee Masters
- Raw words: 42312
- Detected convention: isolated titled sections
- Confidence: high (0.901)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| isolated-title-case | 644 | 328 | 313 | yes |  |
| all-caps-title | 102 | 102 | 0 | no | weaker than selected strategy isolated-title-case |
| special-front-back | 3 | 1 | 2 | no | weaker than selected strategy isolated-title-case |
| roman-only | 5 | 0 | 5 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L324: Zoll, Perry
- L327: The Hill
- L330: _Where are Elmer, Herman, Bert, Tom and Charley,
- L410: Fletcher McGee
- L618: Benjamin Pantier
- L635: Mrs. Benjamin Pantier
- L756: Benjamin Fraser
- L980: Doc Hill

## Rejected TOC-like Examples

- L13: Altman, Herman
- L14: Armstrong, Hannah
- L15: Arnett, Harold
- L16: Arnett, Justice
- L17: Atheist, The Village
- L18: Atherton, Lucius
- L22: Ballard, John
- L23: Barker, Amanda

## Section Size Sanity

- Sections: 328
- Min/median/max words: 1/98/1698
- Notes: many very small sections; headings may include TOC, captions, or fragments; largest section is much bigger than the median section

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
