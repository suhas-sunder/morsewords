# hansel-and-gretel

- Source: `app/client/assets/temp-books/HANSEL AND GRETEL.txt`
- Title: Grimms' Fairy Tales
- Author: Jacob Grimm
- Raw words: 3097
- Detected convention: isolated titled sections
- Confidence: low (0.411)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| isolated-title-case | 2 | 2 | 0 | yes |  |
| all-caps-title | 1 | 1 | 0 | no | weaker than selected strategy isolated-title-case |

## Body Heading Examples

- L1: Grimms’ Fairy Tales
- L3: By Jacob Grimm and Wilhelm Grimm

## Rejected TOC-like Examples

- None.

## Section Size Sanity

- Sections: 2
- Min/median/max words: 3/2951/2951
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: medium
- End: medium
- Missing Project Gutenberg end marker; footer text was not destructively stripped.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
