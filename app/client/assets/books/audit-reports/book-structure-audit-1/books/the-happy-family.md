# the-happy-family

- Source: `app/client/assets/temp-books/The Happy Family.txt`
- Title: Andersen's Fairy Tales
- Author: H. C. Andersen
- Raw words: 4474
- Detected convention: story or titled-section headings
- Confidence: low (0.411)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| all-caps-title | 2 | 2 | 0 | yes |  |
| isolated-title-case | 1 | 1 | 0 | no | weaker than selected strategy all-caps-title |

## Body Heading Examples

- L1: ANDERSEN'S FAIRY TALES
- L5: THE HAPPY FAMILY

## Rejected TOC-like Examples

- None.

## Section Size Sanity

- Sections: 2
- Min/median/max words: 7/1307/1307
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- Manifest: `app/client/assets/books/generated/the-happy-family/manifest.json`
- Sections: 1
- Included sections: 0
- Reference source file produced no body text; generated a minimal source-note section so the public route remains available.
- Missing Project Gutenberg start marker; body text was not destructively stripped.
- Missing Project Gutenberg end marker; footer text was not destructively stripped.
- Project Gutenberg markers were out of order; using the full normalized text.
- No chapter headings were detected; generated fallback parts instead.
- Missing Project Gutenberg ID.
- Rights have not been reviewed; generated book is not publish-ready.
- Rights basis "unknown" is not publish-ready.
- Rights gate status is reject; generated book is not publish-ready.
- Rights gate did not allow processed public story output.
- Owner-reviewed website approval is missing.
- Website publication is not allowed by the active approval path.

## Red Flags

- generated output may include source/license/TOC/footer junk
