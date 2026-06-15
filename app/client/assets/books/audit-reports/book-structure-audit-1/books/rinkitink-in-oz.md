# rinkitink-in-oz

- Source: `app/client/assets/temp-books/rinkitink-in-oz.txt`
- Title: Rinkitink in Oz
- Author: L. Frank Baum
- Raw words: 52661
- Detected convention: chapter-based arabic numbers
- Confidence: high (0.95)
- Recommended handling: safe for normal processing
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-arabic | 24 | 24 | 0 | yes |  |
| isolated-title-case | 195 | 141 | 51 | no | weaker than selected strategy chapter-arabic |
| all-caps-title | 11 | 3 | 8 | no | weaker than selected strategy chapter-arabic |
| roman-numbered-title | 2 | 0 | 2 | no | rejected as TOC-like or front-matter-only evidence |
| arabic-only | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L145: CHAPTER 1
- L372: CHAPTER 2
- L669: CHAPTER 3
- L878: CHAPTER 4
- L1182: CHAPTER 5
- L1653: CHAPTER 6
- L2042: CHAPTER 7
- L2352: CHAPTER 8

## Rejected TOC-like Examples

- L5: [Illustration]
- L7: [Illustration]
- L24: [Illustration]
- L30: Chicago
- L33: [Illustration]
- L35: Copyright 1916
- L36: By L. Frank Baum
- L43: My New Grandson--
- L26: ILLUSTRATED BY
- L27: JOHN R. NEILL

## Section Size Sanity

- Sections: 24
- Min/median/max words: 758/2006/4833
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- Manifest: `app/client/assets/books/generated/rinkitink-in-oz/manifest.json`
- Sections: 25
- Included sections: 24
- Rights have not been reviewed; generated book is not publish-ready.
- Rights basis "unknown" is not publish-ready.
- Rights gate status is needs_manual_review; generated book is not publish-ready.
- Rights gate did not allow processed public story output.
- Owner-reviewed website approval is missing.
- Website publication is not allowed by the active approval path.

## Red Flags

- None.
