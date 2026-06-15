# botchan

- Source: `app/client/assets/temp-books/Botchan.txt`
- Title: Botchan (Master Darling)
- Author: Soseki Natsume
- Raw words: 51488
- Detected convention: chapter-based roman numerals
- Confidence: high (1)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 22 | 11 | 11 | yes |  |
| all-caps-title | 6 | 4 | 2 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 22 | 21 | 0 | no | weaker than selected strategy chapter-roman |
| arabic-only | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L144: CHAPTER I
- L529: CHAPTER II.
- L846: CHAPTER III.
- L1170: CHAPTER IV
- L1566: CHAPTER V.
- L1934: CHAPTER VI.
- L2409: CHAPTER VII.
- L2907: CHAPTER VIII.

## Rejected TOC-like Examples

- L16: CHAPTER I
- L17: CHAPTER II
- L18: CHAPTER III
- L19: CHAPTER IV
- L20: CHAPTER V
- L21: CHAPTER VI
- L22: CHAPTER VII
- L23: CHAPTER VIII

## Section Size Sanity

- Sections: 11
- Min/median/max words: 3512/4206/5312
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- Manifest: `app/client/assets/books/generated/botchan/manifest.json`
- Sections: 13
- Included sections: 11
- Rights have not been reviewed; generated book is not publish-ready.
- Rights basis "unknown" is not publish-ready.
- Rights gate status is needs_manual_review; generated book is not publish-ready.
- Rights gate did not allow processed public story output.
- Owner-reviewed website approval is missing.
- Website publication is not allowed by the active approval path.

## Red Flags

- None.
