# the-war-of-the-worlds

- Source: `app/client/assets/temp-books/The War of the Worlds.txt`
- Title: The war of the worlds
- Author: H. G. Wells
- Raw words: 63850
- Detected convention: standalone roman numeral sections with book divisions
- Confidence: high (0.955)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| roman-only | 27 | 17 | 10 | yes |  |
| all-caps-title | 31 | 29 | 2 | no | weaker than selected strategy roman-only |
| isolated-title-case | 17 | 16 | 0 | no | weaker than selected strategy roman-only |
| roman-numbered-title | 28 | 1 | 27 | no | weaker than selected strategy roman-only |
| book-division | 4 | 1 | 3 | no | weaker than selected strategy roman-only |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L1606: XI.
- L1820: XII.
- L2236: XIII.
- L2455: XIV.
- L2855: XV.
- L3141: XVI.
- L3616: XVII.
- L3949: I.

## Rejected TOC-like Examples

- L56: I.
- L272: II.
- L415: III.
- L525: IV.
- L649: V.
- L806: VI.
- L894: VII.
- L1052: VIII.

## Section Size Sanity

- Sections: 17
- Min/median/max words: 963/2611/5735
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
