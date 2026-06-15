# black-beauty

- Source: `app/client/assets/temp-books/black-beauty.txt`
- Title: Black Beauty
- Author: Anna Sewell
- Raw words: 63197
- Detected convention: part divisions
- Confidence: high (0.85)
- Recommended handling: needs manual sectioning review
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| part-division | 8 | 4 | 4 | yes |  |
| isolated-title-case | 102 | 53 | 49 | no | weaker than selected strategy part-division |
| all-caps-title | 1 | 1 | 0 | no | weaker than selected strategy part-division |
| roman-numbered-title | 1 | 1 | 0 | no | weaker than selected strategy part-division |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L91: Part I
- L2323: Part II
- L3528: Part III
- L5376: Part IV

## Rejected TOC-like Examples

- L22: Part I
- L48: Part II
- L62: Part III
- L80: Part IV

## Section Size Sanity

- Sections: 4
- Min/median/max words: 4976/18450/23581
- Notes: 2 section(s) exceed 18000 words

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- Manifest: `app/client/assets/books/generated/black-beauty/manifest.json`
- Sections: 12
- Included sections: 0
- No chapter headings were detected; generated fallback parts instead.
- Rights have not been reviewed; generated book is not publish-ready.
- Rights basis "unknown" is not publish-ready.
- Rights gate status is needs_manual_review; generated book is not publish-ready.
- Rights gate did not allow processed public story output.
- Owner-reviewed website approval is missing.
- Website publication is not allowed by the active approval path.

## Red Flags

- long book has huge sections despite detected headings
