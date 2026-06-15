# a-christmas-carol

- Source: `app/client/assets/temp-books/a-christmas-carol.txt`
- Title: A Christmas Carol in Prose; Being a Ghost Story of Christmas
- Author: Charles Dickens
- Raw words: 31819
- Detected convention: stave-based sections
- Confidence: high (0.884)
- Recommended handling: needs manual sectioning review
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| stave-prefixed | 10 | 4 | 6 | yes |  |
| isolated-title-case | 43 | 41 | 1 | no | weaker than selected strategy stave-prefixed |
| all-caps-title | 3 | 3 | 0 | no | weaker than selected strategy stave-prefixed |
| roman-numbered-title | 2 | 2 | 0 | no | weaker than selected strategy stave-prefixed |
| special-front-back | 2 | 1 | 1 | no | weaker than selected strategy stave-prefixed |

## Body Heading Examples

- L978: STAVE II: THE FIRST OF THE THREE SPIRITS
- L1778: STAVE III: THE SECOND OF THE THREE SPIRITS
- L2779: STAVE IV: THE LAST OF THE SPIRITS
- L3519: STAVE V: THE END OF IT

## Rejected TOC-like Examples

- L25: Stave I: Marley's Ghost
- L26: Stave II: The First of the Three Spirits
- L27: Stave III: The Second of the Three Spirits
- L28: Stave IV: The Last of the Spirits
- L29: Stave V: The End of It
- L32: STAVE I: MARLEY'S GHOST

## Section Size Sanity

- Sections: 4
- Min/median/max words: 2309/6172/8243
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- Manifest: `app/client/assets/books/generated/a-christmas-carol/manifest.json`
- Sections: 7
- Included sections: 0
- No chapter headings were detected; generated fallback parts instead.
- Rights have not been reviewed; generated book is not publish-ready.
- Rights basis "unknown" is not publish-ready.
- Rights gate status is needs_manual_review; generated book is not publish-ready.
- Rights gate did not allow processed public story output.
- Owner-reviewed website approval is missing.
- Website publication is not allowed by the active approval path.

## Red Flags

- TOC/body confusion is likely
