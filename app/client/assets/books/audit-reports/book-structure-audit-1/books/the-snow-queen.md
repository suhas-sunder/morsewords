# the-snow-queen

- Source: `app/client/assets/temp-books/THE SNOW QUEEN.txt`
- Title: Hans Andersen's Fairy Tales. First Series
- Author: H. C. Andersen
- Raw words: 12141
- Detected convention: story or titled-section headings
- Confidence: high (0.831)
- Recommended handling: needs manual sectioning review
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| all-caps-title | 20 | 18 | 2 | yes |  |
| isolated-title-case | 8 | 4 | 4 | no | weaker than selected strategy all-caps-title |
| special-front-back | 1 | 1 | 0 | no | weaker than selected strategy all-caps-title |

## Body Heading Examples

- L26: GINN AND COMPANY · PROPRIETORS
- L27: · BOSTON · U.S.A.
- L80: J. H. STICKNEY
- L83: THE SNOW QUEEN
- L86: STORY THE FIRST
- L88: WHICH DESCRIBES A LOOKING-GLASS AND ITS BROKEN FRAGMENTS
- L140: SECOND STORY
- L142: A LITTLE BOY AND A LITTLE GIRL

## Rejected TOC-like Examples

- L18: COPYRIGHT, 1886, 1914, BY J. H. STICKNEY
- L20: ALL RIGHTS RESERVED

## Section Size Sanity

- Sections: 18
- Min/median/max words: 2/4/2553
- Notes: many very small sections; headings may include TOC, captions, or fragments; largest section is much bigger than the median section

## Boundary Confidence

- Start: medium
- End: medium
- Missing Project Gutenberg end marker; footer text was not destructively stripped.

## Generated Comparison

- Manifest: `app/client/assets/books/generated/the-snow-queen/manifest.json`
- Sections: 4
- Included sections: 0
- No chapter headings were detected; generated fallback parts instead.
- Rights have not been reviewed; generated book is not publish-ready.
- Rights basis "unknown" is not publish-ready.
- Rights gate status is needs_manual_review; generated book is not publish-ready.
- Rights gate did not allow processed public story output.
- Owner-reviewed website approval is missing.
- Website publication is not allowed by the active approval path.
- existing generated output section count is far below likely raw body heading count (4 vs 18)

## Red Flags

- generated output likely collapsed real structure
