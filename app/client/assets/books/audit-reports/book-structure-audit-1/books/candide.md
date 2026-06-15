# candide

- Source: `app/client/assets/temp-books/Candide.txt`
- Title: Candide
- Author: Voltaire
- Raw words: 39052
- Detected convention: standalone roman numeral sections
- Confidence: high (0.95)
- Recommended handling: needs manual sectioning review
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| roman-only | 30 | 30 | 0 | yes |  |
| all-caps-title | 52 | 48 | 4 | no | weaker than selected strategy roman-only |
| isolated-title-case | 45 | 35 | 10 | no | weaker than selected strategy roman-only |
| special-front-back | 2 | 1 | 1 | no | weaker than selected strategy roman-only |
| roman-numbered-title | 30 | 0 | 30 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L268: I
- L352: II
- L446: III
- L534: IV
- L656: V
- L760: VI
- L807: VII
- L898: VIII

## Rejected TOC-like Examples

- L36: CANDIDE
- L42: BONI AND LIVERIGHT, INC.
- L44: PUBLISHERS NEW YORK
- L163: CHAPTER PAGE
- L6: | Transcriber's Note: |
- L170: Bulgarians 5
- L181: Candide, and James the Anabaptist 18
- L216: with Two Girls, Two Monkeys, and
- L223: Dorado 80
- L227: Martin 89

## Section Size Sanity

- Sections: 30
- Min/median/max words: 373/1037/3458
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- Manifest: `app/client/assets/books/generated/candide/manifest.json`
- Sections: 8
- Included sections: 0
- No chapter headings were detected; generated fallback parts instead.
- Rights have not been reviewed; generated book is not publish-ready.
- Rights basis "unknown" is not publish-ready.
- Rights gate status is needs_manual_review; generated book is not publish-ready.
- Rights gate did not allow processed public story output.
- Owner-reviewed website approval is missing.
- Website publication is not allowed by the active approval path.
- existing generated output section count is far below likely raw body heading count (8 vs 30)

## Red Flags

- generated output likely collapsed real structure
