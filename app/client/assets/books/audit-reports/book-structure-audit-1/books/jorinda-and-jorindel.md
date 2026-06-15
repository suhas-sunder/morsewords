# jorinda-and-jorindel

- Source: `app/client/assets/temp-books/JORINDA AND JORINDEL.txt`
- Title: Grimms' Fairy Tales
- Author: Jacob Grimm
- Raw words: 1296
- Detected convention: isolated titled sections
- Confidence: medium (0.691)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| isolated-title-case | 4 | 4 | 0 | yes |  |
| all-caps-title | 1 | 1 | 0 | no | weaker than selected strategy isolated-title-case |

## Body Heading Examples

- L1: Grimms’ Fairy Tales
- L3: By Jacob Grimm and Wilhelm Grimm
- L45: Well-a-day! Well-a-day!
- L47: Well-a-day!’

## Rejected TOC-like Examples

- None.

## Section Size Sanity

- Sections: 4
- Min/median/max words: 3/410/726
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: medium
- End: medium
- Missing Project Gutenberg end marker; footer text was not destructively stripped.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
