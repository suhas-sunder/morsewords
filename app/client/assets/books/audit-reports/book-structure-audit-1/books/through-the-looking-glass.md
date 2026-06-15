# through-the-looking-glass

- Source: `app/client/assets/temp-books/Through the Looking-Glass.txt`
- Title: Through the Looking-Glass
- Author: Lewis Carroll
- Raw words: 34043
- Detected convention: chapter-based roman numerals
- Confidence: high (0.964)
- Recommended handling: needs manual sectioning review
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 24 | 11 | 13 | yes |  |
| isolated-title-case | 30 | 27 | 3 | no | weaker than selected strategy chapter-roman |
| all-caps-title | 9 | 5 | 4 | no | weaker than selected strategy chapter-roman |
| arabic-only | 3 | 3 | 0 | no | weaker than selected strategy chapter-roman |
| arabic-numbered-title | 21 | 0 | 21 | no | rejected as TOC-like or front-matter-only evidence |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L460: CHAPTER II.
- L806: CHAPTER III.
- L1166: CHAPTER IV.
- L1619: CHAPTER V.
- L2025: CHAPTER VI.
- L2497: CHAPTER VII.
- L2852: CHAPTER VIII.
- L3374: CHAPTER IX.

## Rejected TOC-like Examples

- L104: CHAPTER I. Looking-Glass house
- L105: CHAPTER II. The Garden of Live Flowers
- L106: CHAPTER III. Looking-Glass Insects
- L107: CHAPTER IV. Tweedledum And Tweedledee
- L108: CHAPTER V. Wool and Water
- L109: CHAPTER VI. Humpty Dumpty
- L110: CHAPTER VII. The Lion and the Unicorn
- L111: CHAPTER VIII. “It’s my own Invention”

## Section Size Sanity

- Sections: 11
- Min/median/max words: 11/2973/4222
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- Manifest: `app/client/assets/books/generated/through-the-looking-glass/manifest.json`
- Sections: 14
- Included sections: 12
- Rights have not been reviewed; generated book is not publish-ready.
- Rights basis "unknown" is not publish-ready.
- Rights gate status is needs_manual_review; generated book is not publish-ready.
- Rights gate did not allow processed public story output.
- Owner-reviewed website approval is missing.
- Website publication is not allowed by the active approval path.

## Red Flags

- TOC/body confusion is likely
