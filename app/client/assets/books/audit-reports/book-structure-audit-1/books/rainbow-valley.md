# rainbow-valley

- Source: `app/client/assets/temp-books/rainbow-valley.txt`
- Title: Rainbow Valley
- Author: L. M. Montgomery
- Raw words: 87152
- Detected convention: chapter-based roman numerals
- Confidence: high (0.995)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 35 | 34 | 1 | yes |  |
| all-caps-title | 43 | 37 | 5 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 59 | 57 | 2 | no | weaker than selected strategy chapter-roman |
| roman-numbered-title | 38 | 3 | 35 | no | weaker than selected strategy chapter-roman |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L67: CHAPTER I.
- L204: CHAPTER II.
- L802: CHAPTER IV.
- L1142: CHAPTER V.
- L1657: CHAPTER VI.
- L1854: CHAPTER VII.
- L2125: CHAPTER VIII.
- L2393: CHAPTER IX.

## Rejected TOC-like Examples

- L581: CHAPTER III.

## Section Size Sanity

- Sections: 34
- Min/median/max words: 1091/2484/5658
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- Manifest: `app/client/assets/books/generated/rainbow-valley/manifest.json`
- Sections: 37
- Included sections: 35
- Rights have not been reviewed; generated book is not publish-ready.
- Rights basis "unknown" is not publish-ready.
- Rights gate status is needs_manual_review; generated book is not publish-ready.
- Rights gate did not allow processed public story output.
- Owner-reviewed website approval is missing.
- Website publication is not allowed by the active approval path.

## Red Flags

- None.
