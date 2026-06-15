# island-nights-entertainments

- Source: `app/client/assets/temp-books/Island Nights' Entertainments.txt`
- Title: Island Nights' Entertainments
- Author: Robert Louis Stevenson
- Raw words: 52999
- Detected convention: story or titled-section headings
- Confidence: high (0.821)
- Recommended handling: needs manual sectioning review
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| all-caps-title | 9 | 7 | 2 | yes |  |
| chapter-roman | 5 | 4 | 1 | no | weaker than selected strategy all-caps-title |
| isolated-title-case | 17 | 9 | 5 | no | weaker than selected strategy all-caps-title |
| roman-numbered-title | 1 | 1 | 0 | no | weaker than selected strategy all-caps-title |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L360: JOHN BLACKAMOAR.
- L466: THE BAN.
- L1261: THE MISSIONARY.
- L1697: DEVIL-WORK.
- L2349: NIGHT IN THE BUSH.
- L2800: THE BOTTLE IMP.
- L4062: THE ISLE OF VOICES.

## Rejected TOC-like Examples

- L23: THE BEACH OF FALESÁ.
- L27: A SOUTH SEA BRIDAL.

## Section Size Sanity

- Sections: 7
- Min/median/max words: 1063/6802/12298
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- body headings were found but rejected by the selected strategy
