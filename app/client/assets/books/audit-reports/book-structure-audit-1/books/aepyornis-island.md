# aepyornis-island

- Source: `app/client/assets/temp-books/AEPYORNIS ISLAND.txt`
- Title: The Stolen Bacillus and Other Incidents
- Author: H. G. Wells
- Raw words: 5259
- Detected convention: story or titled-section headings
- Confidence: low (0.541)
- Recommended handling: needs manual sectioning review
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| all-caps-title | 10 | 6 | 4 | yes |  |
| isolated-title-case | 2 | 1 | 1 | no | weaker than selected strategy all-caps-title |
| arabic-only | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L1: THE STOLEN BACILLUS AND OTHER INCIDENTS
- L3: BY H.G. WELLS
- L16: H.B. MARRIOTT WATSON
- L26: H.G. WELLS.
- L29: AEPYORNIS ISLAND
- L127: 1745.--H.G.W.]

## Rejected TOC-like Examples

- L5: AUTHOR OF "THE TIME MACHINE"
- L7: METHUEN & CO.
- L8: 36 ESSEX STREET, STRAND
- L9: LONDON

## Section Size Sanity

- Sections: 6
- Min/median/max words: 3/62/4193
- Notes: many very small sections; headings may include TOC, captions, or fragments; largest section is much bigger than the median section

## Boundary Confidence

- Start: medium
- End: medium
- Missing Project Gutenberg end marker; footer text was not destructively stripped.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- TOC/body confusion is likely
