# sense-and-sensibility

- Source: `app/client/assets/temp-books/Sense and Sensibility.txt`
- Title: Sense and Sensibility
- Author: Jane Austen
- Raw words: 123681
- Detected convention: chapter-based roman numerals
- Confidence: high (1)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 100 | 50 | 50 | yes |  |
| all-caps-title | 9 | 9 | 0 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 31 | 27 | 1 | no | weaker than selected strategy chapter-roman |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L65: CHAPTER I.
- L217: CHAPTER II.
- L419: CHAPTER III.
- L582: CHAPTER IV.
- L776: CHAPTER V.
- L876: CHAPTER VI.
- L1003: CHAPTER VII.
- L1128: CHAPTER VIII.

## Rejected TOC-like Examples

- L13: CHAPTER I
- L14: CHAPTER II
- L15: CHAPTER III
- L16: CHAPTER IV
- L17: CHAPTER V
- L18: CHAPTER VI
- L19: CHAPTER VII
- L20: CHAPTER VIII

## Section Size Sanity

- Sections: 50
- Min/median/max words: 1031/2375/5524
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- Manifest: `app/client/assets/books/generated/sense-and-sensibility/manifest.json`
- Sections: 52
- Included sections: 50
- Rights have not been reviewed; generated book is not publish-ready.
- Rights basis "unknown" is not publish-ready.
- Rights gate status is needs_manual_review; generated book is not publish-ready.
- Rights gate did not allow processed public story output.
- Owner-reviewed website approval is missing.
- Website publication is not allowed by the active approval path.

## Red Flags

- None.
