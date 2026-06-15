# the-fisherman-and-his-wife

- Source: `app/client/assets/temp-books/THE FISHERMAN AND HIS WIFE.txt`
- Title: Grimms' Fairy Tales
- Author: Jacob Grimm
- Raw words: 2277
- Detected convention: isolated titled sections
- Confidence: high (0.821)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| isolated-title-case | 8 | 7 | 1 | yes |  |
| all-caps-title | 1 | 1 | 0 | no | weaker than selected strategy isolated-title-case |

## Body Heading Examples

- L1: Grimms’ Fairy Tales
- L3: By Jacob Grimm and Wilhelm Grimm
- L68: My wife Ilsabill
- L99: My wife Ilsabill
- L133: My wife Ilsabill
- L167: My wife Ilsabill
- L205: My wife Ilsabill

## Rejected TOC-like Examples

- L35: My wife Ilsabill

## Section Size Sanity

- Sections: 7
- Min/median/max words: 3/339/639
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: medium
- End: medium
- Missing Project Gutenberg end marker; footer text was not destructively stripped.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
