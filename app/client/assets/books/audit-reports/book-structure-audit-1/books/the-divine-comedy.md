# the-divine-comedy

- Source: `app/client/assets/temp-books/The Divine Comedy.txt`
- Title: The divine comedy
- Author: Dante Alighieri
- Raw words: 117095
- Detected convention: canto-based verse sections
- Confidence: high (0.96)
- Recommended handling: needs manual sectioning review
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| canto-prefixed | 200 | 76 | 124 | yes |  |
| all-caps-title | 14 | 5 | 9 | no | weaker than selected strategy canto-prefixed |
| isolated-title-case | 66 | 56 | 10 | no | weaker than selected strategy canto-prefixed |

## Body Heading Examples

- L3807: CANTO XXV
- L3958: CANTO XXVI
- L4107: CANTO XXVII
- L4256: CANTO XXVIII
- L4409: CANTO XXIX
- L4566: CANTO XXX
- L4728: CANTO XXXI
- L4878: CANTO XXXII

## Rejected TOC-like Examples

- L19: Canto 1
- L20: Canto 2
- L21: Canto 3
- L22: Canto 4
- L23: Canto 5
- L24: Canto 6
- L25: Canto 7
- L26: Canto 8

## Section Size Sanity

- Sections: 76
- Min/median/max words: 992/1137/1307
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- Manifest: `app/client/assets/books/generated/the-divine-comedy/manifest.json`
- Sections: 22
- Included sections: 0
- No chapter headings were detected; generated fallback parts instead.
- Rights have not been reviewed; generated book is not publish-ready.
- Rights basis "unknown" is not publish-ready.
- Rights gate status is needs_manual_review; generated book is not publish-ready.
- Rights gate did not allow processed public story output.
- Owner-reviewed website approval is missing.
- Website publication is not allowed by the active approval path.
- existing generated output section count is far below likely raw body heading count (22 vs 76)

## Red Flags

- TOC/body confusion is likely
- generated output likely collapsed real structure
