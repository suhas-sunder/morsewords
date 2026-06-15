# anna-karenina

- Source: `app/client/assets/temp-books/Anna Karenina.txt`
- Title: Anna Karenina
- Author: graf Leo Tolstoy
- Raw words: 360332
- Detected convention: chapter-based arabic numbers with part divisions
- Confidence: high (0.959)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-arabic | 239 | 183 | 56 | yes |  |
| part-division | 16 | 7 | 9 | no | weaker than selected strategy chapter-arabic |
| isolated-title-case | 98 | 94 | 1 | no | weaker than selected strategy chapter-arabic |
| roman-numbered-title | 2 | 2 | 0 | no | weaker than selected strategy chapter-arabic |
| all-caps-title | 1 | 0 | 0 | no | no convincing body headings for this pattern |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L9436: Chapter 23
- L9563: Chapter 24
- L9806: Chapter 25
- L10001: Chapter 26
- L10182: Chapter 27
- L10305: Chapter 28
- L10482: Chapter 29
- L10668: Chapter 30

## Rejected TOC-like Examples

- L25: Chapter 1
- L129: Chapter 2
- L284: Chapter 3
- L467: Chapter 4
- L681: Chapter 5
- L1055: Chapter 6
- L1163: Chapter 7
- L1252: Chapter 8

## Section Size Sanity

- Sections: 183
- Min/median/max words: 660/1461/2837
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- Manifest: `app/client/assets/books/generated/anna-karenina/manifest.json`
- Sections: 241
- Included sections: 239
- Rights have not been reviewed; generated book is not publish-ready.
- Rights basis "unknown" is not publish-ready.
- Rights gate status is needs_manual_review; generated book is not publish-ready.
- Rights gate did not allow processed public story output.
- Owner-reviewed website approval is missing.
- Website publication is not allowed by the active approval path.

## Red Flags

- None.
