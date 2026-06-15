# jane-eyre

- Source: `app/client/assets/temp-books/Jane Eyre.txt`
- Title: Jane Eyre: An Autobiography
- Author: Charlotte Brontë
- Raw words: 191585
- Detected convention: chapter-based roman numerals
- Confidence: high (0.95)
- Recommended handling: safe for normal processing
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 37 | 37 | 0 | yes |  |
| all-caps-title | 15 | 9 | 6 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 156 | 144 | 12 | no | weaker than selected strategy chapter-roman |
| roman-numbered-title | 2 | 2 | 0 | no | weaker than selected strategy chapter-roman |
| special-front-back | 1 | 1 | 0 | no | weaker than selected strategy chapter-roman |
| arabic-only | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L138: CHAPTER I
- L365: CHAPTER II
- L652: CHAPTER III
- L1048: CHAPTER IV
- L1695: CHAPTER V
- L2269: CHAPTER VI
- L2602: CHAPTER VII
- L2975: CHAPTER VIII

## Rejected TOC-like Examples

- L1: JANE EYRE
- L6: _ILLUSTRATED BY F. H. TOWNSEND_
- L9: SERVICE & PATON
- L10: 5 HENRIETTA STREET
- L18: W. M. THACKERAY, ESQ.,
- L21: IS RESPECTFULLY INSCRIBED
- L4: by Charlotte Brontë
- L8: London
- L13: _The Illustrations_
- L15: SERVICE & PATON, _London_

## Section Size Sanity

- Sections: 37
- Min/median/max words: 1950/4398/11298
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- Manifest: `app/client/assets/books/generated/jane-eyre/manifest.json`
- Sections: 39
- Included sections: 37
- Rights have not been reviewed; generated book is not publish-ready.
- Rights basis "unknown" is not publish-ready.
- Rights gate status is needs_manual_review; generated book is not publish-ready.
- Rights gate did not allow processed public story output.
- Owner-reviewed website approval is missing.
- Website publication is not allowed by the active approval path.

## Red Flags

- None.
