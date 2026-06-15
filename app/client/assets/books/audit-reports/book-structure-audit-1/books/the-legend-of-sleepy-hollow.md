# the-legend-of-sleepy-hollow

- Source: `app/client/assets/temp-books/the-legend-of-sleepy-hollow.txt`
- Title: The Legend of Sleepy Hollow
- Author: Washington Irving
- Raw words: 15429
- Detected convention: story or titled-section headings
- Confidence: medium (0.701)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| all-caps-title | 5 | 5 | 0 | yes |  |
| isolated-title-case | 3 | 3 | 0 | no | weaker than selected strategy all-caps-title |

## Body Heading Examples

- L6: FOUND AMONG THE PAPERS OF THE LATE DIEDRICH KNICKERBOCKER.
- L13: CASTLE OF INDOLENCE.
- L1074: POSTSCRIPT.
- L1076: FOUND IN THE HANDWRITING OF MR. KNICKERBOCKER.
- L1123: THE END.

## Rejected TOC-like Examples

- None.

## Section Size Sanity

- Sections: 5
- Min/median/max words: 1/40/11789
- Notes: many very small sections; headings may include TOC, captions, or fragments; largest section is much bigger than the median section

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- Manifest: `app/client/assets/books/generated/the-legend-of-sleepy-hollow/manifest.json`
- Sections: 4
- Included sections: 0
- No chapter headings were detected; generated fallback parts instead.
- Rights have not been reviewed; generated book is not publish-ready.
- Rights basis "unknown" is not publish-ready.
- Rights gate status is needs_manual_review; generated book is not publish-ready.
- Rights gate did not allow processed public story output.
- Owner-reviewed website approval is missing.
- Website publication is not allowed by the active approval path.

## Red Flags

- None.
