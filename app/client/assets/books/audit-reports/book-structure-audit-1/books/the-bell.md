# the-bell

- Source: `app/client/assets/temp-books/The Bell.txt`
- Title: Andersen's Fairy Tales
- Author: H. C. Andersen
- Raw words: 8199
- Detected convention: story or titled-section headings
- Confidence: medium (0.621)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| all-caps-title | 3 | 3 | 0 | yes |  |
| isolated-title-case | 2 | 2 | 0 | no | weaker than selected strategy all-caps-title |

## Body Heading Examples

- L1: ANDERSEN'S FAIRY TALES
- L5: THE ELDERBUSH
- L311: THE BELL

## Rejected TOC-like Examples

- None.

## Section Size Sanity

- Sections: 3
- Min/median/max words: 7/2025/3007
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- Manifest: `app/client/assets/books/generated/the-bell/manifest.json`
- Sections: 2
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
