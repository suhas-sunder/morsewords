# the-wonderful-wizard-of-oz

- Source: `app/client/assets/temp-books/the-wonderful-wizard-of-oz.txt`
- Title: The Wonderful Wizard of Oz
- Author: L. Frank Baum
- Raw words: 43060
- Detected convention: chapter-based roman numerals
- Confidence: high (0.958)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 48 | 25 | 23 | yes |  |
| isolated-title-case | 39 | 36 | 2 | no | weaker than selected strategy chapter-roman |
| all-caps-title | 2 | 1 | 1 | no | weaker than selected strategy chapter-roman |
| special-front-back | 3 | 1 | 2 | no | weaker than selected strategy chapter-roman |
| roman-numbered-title | 1 | 1 | 0 | no | weaker than selected strategy chapter-roman |

## Body Heading Examples

- L40: Chapter XXIV. Home Again
- L73: Chapter I
- L192: Chapter II
- L431: Chapter III
- L664: Chapter IV
- L831: Chapter V
- L1057: Chapter VI
- L1241: Chapter VII

## Rejected TOC-like Examples

- L17: Chapter I. The Cyclone
- L18: Chapter II. The Council with the Munchkins
- L19: Chapter III. How Dorothy Saved the Scarecrow
- L20: Chapter IV. The Road Through the Forest
- L21: Chapter V. The Rescue of the Tin Woodman
- L22: Chapter VI. The Cowardly Lion
- L23: Chapter VII. The Journey to the Great Oz
- L24: Chapter VIII. The Deadly Poppy Field

## Section Size Sanity

- Sections: 25
- Min/median/max words: 79/1447/3688
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- Manifest: `app/client/assets/books/generated/the-wonderful-wizard-of-oz/manifest.json`
- Sections: 28
- Included sections: 24
- Rights have not been reviewed; generated book is not publish-ready.
- Rights basis "unknown" is not publish-ready.
- Rights gate status is needs_manual_review; generated book is not publish-ready.
- Rights gate did not allow processed public story output.
- Owner-reviewed website approval is missing.
- Website publication is not allowed by the active approval path.

## Red Flags

- None.
