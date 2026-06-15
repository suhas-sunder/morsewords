# the-count-of-monte-cristo

- Source: `app/client/assets/temp-books/The Count of Monte Cristo.txt`
- Title: The Count of Monte Cristo
- Author: Alexandre Dumas
- Raw words: 471394
- Detected convention: chapter-based arabic numbers with volume divisions
- Confidence: high (1)
- Recommended handling: needs manual sectioning review
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-arabic | 234 | 117 | 117 | yes |  |
| volume-division | 10 | 5 | 5 | no | weaker than selected strategy chapter-arabic |
| isolated-title-case | 710 | 657 | 53 | no | weaker than selected strategy chapter-arabic |
| roman-numbered-title | 74 | 74 | 0 | no | weaker than selected strategy chapter-arabic |
| all-caps-title | 8 | 7 | 0 | no | weaker than selected strategy chapter-arabic |
| arabic-numbered-title | 2 | 2 | 0 | no | weaker than selected strategy chapter-arabic |
| arabic-only | 1 | 1 | 0 | no | weaker than selected strategy chapter-arabic |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L140: Chapter 1. Marseilles—The Arrival
- L589: Chapter 2. Father and Son
- L961: Chapter 3. The Catalans
- L1420: Chapter 4. Conspiracy
- L1741: Chapter 5. The Marriage Feast
- L2432: Chapter 6. The Deputy Procureur du Roi
- L2935: Chapter 7. The Examination
- L3380: Chapter 8. The Château d’If

## Rejected TOC-like Examples

- L10: Chapter 1. Marseilles—The Arrival
- L11: Chapter 2. Father and Son
- L12: Chapter 3. The Catalans
- L13: Chapter 4. Conspiracy
- L14: Chapter 5. The Marriage Feast
- L15: Chapter 6. The Deputy Procureur du Roi
- L16: Chapter 7. The Examination
- L17: Chapter 8. The Château d’If

## Section Size Sanity

- Sections: 117
- Min/median/max words: 1351/3469/11063
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- Manifest: `app/client/assets/books/generated/the-count-of-monte-cristo/manifest.json`
- Sections: 4
- Included sections: 2
- Rights have not been reviewed; generated book is not publish-ready.
- Rights basis "unknown" is not publish-ready.
- Rights gate status is needs_manual_review; generated book is not publish-ready.
- Rights gate did not allow processed public story output.
- Owner-reviewed website approval is missing.
- Website publication is not allowed by the active approval path.
- existing generated output section count is far below likely raw body heading count (4 vs 117)

## Red Flags

- body headings were found but rejected by the selected strategy
- generated output likely collapsed real structure
