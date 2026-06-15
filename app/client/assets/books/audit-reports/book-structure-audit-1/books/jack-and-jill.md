# jack-and-jill

- Source: `app/client/assets/temp-books/jack-and-jill.txt`
- Title: Jack and Jill
- Author: Louisa May Alcott
- Raw words: 96210
- Detected convention: chapter-based roman numerals
- Confidence: high (0.95)
- Recommended handling: safe for normal processing
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 24 | 24 | 0 | yes |  |
| all-caps-title | 9 | 6 | 3 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 54 | 25 | 29 | no | weaker than selected strategy chapter-roman |
| arabic-only | 1 | 1 | 0 | no | weaker than selected strategy chapter-roman |
| roman-numbered-title | 1 | 1 | 0 | no | weaker than selected strategy chapter-roman |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L51: Chapter I. The Catastrophe
- L382: Chapter II. Two Penitents
- L602: Chapter III. Ward No. 1
- L1045: Chapter IV. Ward No. 2.
- L1362: Chapter V. Secrets
- L1530: Chapter VI. Surprises
- L2078: Chapter VII. Jill's Mission
- L2522: Chapter VIII. Merry and Molly

## Rejected TOC-like Examples

- L1: JACK AND JILL
- L42: JACK AND JILL
- L1988: THE BLESSED DAY
- L16: Chapter I The Catastrophe
- L17: Chapter II Two Penitents
- L18: Chapter III Ward No. I
- L19: Chapter IV Ward No. 2
- L20: Chapter V Secrets
- L21: Chapter VI Surprises
- L22: Chapter VII Jill's Mission

## Section Size Sanity

- Sections: 24
- Min/median/max words: 1674/4034/5641
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- Manifest: `app/client/assets/books/generated/jack-and-jill/manifest.json`
- Sections: 26
- Included sections: 24
- Rights have not been reviewed; generated book is not publish-ready.
- Rights basis "unknown" is not publish-ready.
- Rights gate status is needs_manual_review; generated book is not publish-ready.
- Rights gate did not allow processed public story output.
- Owner-reviewed website approval is missing.
- Website publication is not allowed by the active approval path.

## Red Flags

- None.
