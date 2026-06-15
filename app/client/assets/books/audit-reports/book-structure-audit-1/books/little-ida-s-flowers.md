# little-ida-s-flowers

- Source: `app/client/assets/temp-books/LITTLE IDA'S FLOWERS.txt`
- Title: Hans Andersen's Fairy Tales. First Series
- Author: H. C. Andersen
- Raw words: 3444
- Detected convention: story or titled-section headings
- Confidence: medium (0.611)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| all-caps-title | 6 | 4 | 2 | yes |  |
| isolated-title-case | 8 | 4 | 4 | no | weaker than selected strategy all-caps-title |
| special-front-back | 1 | 1 | 0 | no | weaker than selected strategy all-caps-title |

## Body Heading Examples

- L26: GINN AND COMPANY · PROPRIETORS
- L27: · BOSTON · U.S.A.
- L80: J. H. STICKNEY
- L83: LITTLE IDA'S FLOWERS

## Rejected TOC-like Examples

- L18: COPYRIGHT, 1886, 1914, BY J. H. STICKNEY
- L20: ALL RIGHTS RESERVED

## Section Size Sanity

- Sections: 4
- Min/median/max words: 3/508/2684
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: medium
- End: medium
- Missing Project Gutenberg end marker; footer text was not destructively stripped.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
