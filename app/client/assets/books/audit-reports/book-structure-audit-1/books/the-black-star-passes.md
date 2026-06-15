# the-black-star-passes

- Source: `app/client/assets/temp-books/The Black Star Passes.txt`
- Title: The Black Star Passes
- Author: Jr. John W. Campbell
- Raw words: 79248
- Detected convention: standalone roman numeral sections with book divisions
- Confidence: high (0.986)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| roman-only | 18 | 14 | 4 | yes |  |
| all-caps-title | 24 | 21 | 3 | no | weaker than selected strategy roman-only |
| book-division | 6 | 3 | 3 | no | weaker than selected strategy roman-only |
| isolated-title-case | 35 | 29 | 6 | no | weaker than selected strategy roman-only |
| special-front-back | 5 | 3 | 2 | no | weaker than selected strategy roman-only |

## Body Heading Examples

- L2349: I
- L2537: II
- L2738: III
- L3001: IV
- L3276: V
- L4042: VI
- L4526: VII
- L4821: VIII

## Rejected TOC-like Examples

- L493: I.
- L786: II
- L1312: III
- L1784: IV

## Section Size Sanity

- Sections: 14
- Min/median/max words: 1790/3370/8417
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
