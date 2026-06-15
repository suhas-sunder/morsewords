# the-elderbush

- Source: `app/client/assets/temp-books/The Elderbush.txt`
- Title: Andersen's Fairy Tales
- Author: H. C. Andersen
- Raw words: 6174
- Detected convention: isolated titled sections
- Confidence: low (0.541)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| isolated-title-case | 2 | 2 | 0 | yes |  |
| all-caps-title | 2 | 2 | 0 | no | weaker than selected strategy isolated-title-case |

## Body Heading Examples

- L3: By Hans Christian Andersen
- L130: Christian.'

## Rejected TOC-like Examples

- None.

## Section Size Sanity

- Sections: 2
- Min/median/max words: 1159/1852/1852
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- Manifest: `app/client/assets/books/generated/the-elderbush/manifest.json`
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
