# the-shoes-of-fortune

- Source: `app/client/assets/temp-books/The Shoes of Fortune.txt`
- Title: Andersen's Fairy Tales
- Author: H. C. Andersen
- Raw words: 15869
- Detected convention: roman-numbered titled sections
- Confidence: high (0.87)
- Recommended handling: safe for normal processing
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| roman-numbered-title | 6 | 6 | 0 | yes |  |
| all-caps-title | 4 | 4 | 0 | no | weaker than selected strategy roman-numbered-title |
| isolated-title-case | 4 | 4 | 0 | no | weaker than selected strategy roman-numbered-title |

## Body Heading Examples

- L8: I. A Beginning
- L81: II. What Happened to the Councillor
- L363: III. The Watchman's Adventure
- L615: IV. A Moment of Head Importance--An Evening's “Dramatic Readings”--A
- L829: V. Metamorphosis of the Copying-Clerk
- L1143: VI. The Best That the Galoshes Gave

## Rejected TOC-like Examples

- None.

## Section Size Sanity

- Sections: 6
- Min/median/max words: 649/2430/3246
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- Manifest: `app/client/assets/books/generated/the-shoes-of-fortune/manifest.json`
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
