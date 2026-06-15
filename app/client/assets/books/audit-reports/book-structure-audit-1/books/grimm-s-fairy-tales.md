# grimm-s-fairy-tales

- Source: `app/client/assets/temp-books/Grimm's Fairy Tales.txt`
- Title: Grimms' Fairy Tales
- Author: Jacob Grimm
- Raw words: 104831
- Detected convention: story or titled-section headings
- Confidence: high (0.901)
- Recommended handling: needs manual sectioning review
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| all-caps-title | 131 | 66 | 65 | yes |  |
| isolated-title-case | 34 | 28 | 6 | no | weaker than selected strategy all-caps-title |
| arabic-numbered-title | 5 | 3 | 2 | no | weaker than selected strategy all-caps-title |

## Body Heading Examples

- L6: PREPARER’S NOTE
- L84: THE BROTHERS GRIMM FAIRY TALES
- L87: THE GOLDEN BIRD
- L294: HANS IN LUCK
- L497: JORINDA AND JORINDEL
- L614: THE TRAVELLING MUSICIANS
- L727: OLD SULTAN
- L800: THE STRAW, THE COAL, AND THE BEAN

## Rejected TOC-like Examples

- L13: CONTENTS:
- L15: THE GOLDEN BIRD
- L16: HANS IN LUCK
- L17: JORINDA AND JORINDEL
- L18: THE TRAVELLING MUSICIANS
- L19: OLD SULTAN
- L20: THE STRAW, THE COAL, AND THE BEAN
- L21: BRIAR ROSE

## Section Size Sanity

- Sections: 66
- Min/median/max words: 5/1414/3815
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- Manifest: `app/client/assets/books/generated/grimm-s-fairy-tales/manifest.json`
- Sections: 18
- Included sections: 0
- No chapter headings were detected; generated fallback parts instead.
- Rights have not been reviewed; generated book is not publish-ready.
- Rights basis "unknown" is not publish-ready.
- Rights gate status is needs_manual_review; generated book is not publish-ready.
- Rights gate did not allow processed public story output.
- Owner-reviewed website approval is missing.
- Website publication is not allowed by the active approval path.
- existing generated output section count is far below likely raw body heading count (18 vs 66)

## Red Flags

- generated output likely collapsed real structure
