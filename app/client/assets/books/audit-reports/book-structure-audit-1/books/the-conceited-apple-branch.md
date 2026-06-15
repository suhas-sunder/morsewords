# the-conceited-apple-branch

- Source: `app/client/assets/temp-books/THE CONCEITED APPLE BRANCH.txt`
- Title: Hans Andersen's Fairy Tales. First Series
- Author: H. C. Andersen
- Raw words: 2132
- Detected convention: story or titled-section headings
- Confidence: medium (0.741)
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
- L83: THE CONCEITED APPLE BRANCH

## Rejected TOC-like Examples

- L18: COPYRIGHT, 1886, 1914, BY J. H. STICKNEY
- L20: ALL RIGHTS RESERVED

## Section Size Sanity

- Sections: 4
- Min/median/max words: 3/508/1372
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: medium
- End: medium
- Missing Project Gutenberg end marker; footer text was not destructively stripped.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
