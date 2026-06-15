# the-lady-of-the-lake

- Source: `app/client/assets/temp-books/The Lady of the Lake.txt`
- Title: The Lady of the Lake
- Author: Walter Scott
- Raw words: 81900
- Detected convention: canto-based verse sections
- Confidence: high (0.928)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| canto-prefixed | 13 | 9 | 4 | yes |  |
| all-caps-title | 14 | 11 | 3 | no | weaker than selected strategy canto-prefixed |
| roman-numbered-title | 20 | 20 | 0 | no | weaker than selected strategy canto-prefixed |
| isolated-title-case | 107 | 87 | 20 | no | weaker than selected strategy canto-prefixed |
| roman-only | 190 | 85 | 105 | no | weaker than selected strategy canto-prefixed |
| arabic-numbered-title | 813 | 813 | 0 | no | weaker than selected strategy canto-prefixed |
| arabic-only | 3 | 3 | 0 | no | weaker than selected strategy canto-prefixed |
| volume-division | 1 | 1 | 0 | no | weaker than selected strategy canto-prefixed |
| special-front-back | 1 | 1 | 0 | no | weaker than selected strategy canto-prefixed |

## Body Heading Examples

- L3931: CANTO FIFTH.
- L4966: CANTO SIXTH.
- L6235: Canto First.
- L7366: Canto Second.
- L8461: Canto Third.
- L9477: Canto Fourth.
- L10306: canto v., it serves the poet's purpose still further. Without it,
- L10481: Canto Fifth.

## Rejected TOC-like Examples

- L98: CANTO FIRST.
- L998: CANTO SECOND.
- L2035: CANTO THIRD.
- L2950: CANTO FOURTH.

## Section Size Sanity

- Sections: 9
- Min/median/max words: 920/7080/8404
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
