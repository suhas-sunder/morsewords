# an-enquiry-concerning-human-understanding

- Source: `app/client/assets/temp-books/An Enquiry Concerning Human Understanding.txt`
- Title: An Enquiry Concerning Human Understanding
- Author: David Hume
- Raw words: 61015
- Detected convention: section-based divisions
- Confidence: high (0.964)
- Recommended handling: needs manual sectioning review
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| section-prefixed | 12 | 11 | 1 | yes |  |
| arabic-numbered-title | 141 | 141 | 0 | no | weaker than selected strategy section-prefixed |
| all-caps-title | 16 | 14 | 2 | no | weaker than selected strategy section-prefixed |
| part-division | 13 | 10 | 3 | no | weaker than selected strategy section-prefixed |
| isolated-title-case | 137 | 136 | 0 | no | weaker than selected strategy section-prefixed |
| arabic-only | 16 | 16 | 0 | no | weaker than selected strategy section-prefixed |
| roman-numbered-title | 18 | 6 | 12 | no | weaker than selected strategy section-prefixed |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L386: SECTION II.
- L583: SECTION III.
- L646: SECTION IV.
- L1108: SECTION V.
- L1639: SECTION VI.
- L1739: SECTION VII.
- L2378: SECTION VIII.
- L3130: SECTION IX.

## Rejected TOC-like Examples

- L40: SECTION I.

## Section Size Sanity

- Sections: 11
- Min/median/max words: 539/5512/9327
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- body headings were found but rejected by the selected strategy
