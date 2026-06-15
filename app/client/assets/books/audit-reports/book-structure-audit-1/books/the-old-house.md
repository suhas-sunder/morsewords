# the-old-house

- Source: `app/client/assets/temp-books/The Old House.txt`
- Title: Andersen's Fairy Tales
- Author: H. C. Andersen
- Raw words: 21410
- Detected convention: story or titled-section headings
- Confidence: high (0.851)
- Recommended handling: safe for normal processing
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| all-caps-title | 10 | 10 | 0 | yes |  |
| isolated-title-case | 3 | 3 | 0 | no | weaker than selected strategy all-caps-title |

## Body Heading Examples

- L1: ANDERSEN'S FAIRY TALES
- L6: THE OLD HOUSE
- L316: THE HAPPY FAMILY
- L447: THE STORY OF A MOTHER
- L663: THE FALSE COLLAR
- L768: THE SHADOW
- L1275: THE LITTLE MATCH GIRL
- L1374: THE DREAM OF LITTLE TUK

## Rejected TOC-like Examples

- None.

## Section Size Sanity

- Sections: 10
- Min/median/max words: 7/1897/5035
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- Manifest: `app/client/assets/books/generated/the-old-house/manifest.json`
- Sections: 5
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
