# rapunzel

- Source: `app/client/assets/temp-books/RAPUNZEL.txt`
- Title: Grimms' Fairy Tales
- Author: Jacob Grimm
- Raw words: 1566
- Detected convention: isolated titled sections
- Confidence: medium (0.771)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| isolated-title-case | 6 | 6 | 0 | yes |  |
| all-caps-title | 1 | 1 | 0 | no | weaker than selected strategy isolated-title-case |

## Body Heading Examples

- L1: Grimms’ Fairy Tales
- L3: By Jacob Grimm and Wilhelm Grimm
- L52: ‘Rapunzel, Rapunzel,
- L70: ‘Rapunzel, Rapunzel,
- L78: ‘Rapunzel, Rapunzel,
- L111: ‘Rapunzel, Rapunzel,

## Rejected TOC-like Examples

- None.

## Section Size Sanity

- Sections: 6
- Min/median/max words: 3/251/555
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: medium
- End: medium
- Missing Project Gutenberg end marker; footer text was not destructively stripped.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
