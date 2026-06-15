# don-quixote

- Source: `app/client/assets/temp-books/Don Quixote.txt`
- Title: Don Quixote
- Author: Miguel de Cervantes Saavedra
- Raw words: 434443
- Detected convention: chapter-based roman numerals with volume divisions
- Confidence: high (0.963)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 146 | 102 | 44 | yes |  |
| all-caps-title | 653 | 284 | 368 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 360 | 288 | 72 | no | weaker than selected strategy chapter-roman |
| roman-numbered-title | 3 | 3 | 0 | no | weaker than selected strategy chapter-roman |
| volume-division | 1 | 1 | 0 | no | weaker than selected strategy chapter-roman |
| special-front-back | 2 | 0 | 2 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L9967: CHAPTER XXV.
- L10598: CHAPTER XXVI.
- L10914: CHAPTER XXVII.
- L11517: CHAPTER XXVIII.
- L12058: CHAPTER XXIX.
- L12526: CHAPTER XXX.
- L12943: CHAPTER XXXI.
- L13306: CHAPTER XXXII.

## Rejected TOC-like Examples

- L69: CHAPTER III
- L86: CHAPTER VIII
- L130: CHAPTER XIX
- L155: CHAPTER XXV
- L184: CHAPTER XXXII
- L224: CHAPTER XLIV
- L231: CHAPTER XLVI
- L254: CHAPTER LII

## Section Size Sanity

- Sections: 102
- Min/median/max words: 823/3004/8275
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- Manifest: `app/client/assets/books/generated/don-quixote/manifest.json`
- Sections: 149
- Included sections: 146
- Rights have not been reviewed; generated book is not publish-ready.
- Rights basis "unknown" is not publish-ready.
- Rights gate status is needs_manual_review; generated book is not publish-ready.
- Rights gate did not allow processed public story output.
- Owner-reviewed website approval is missing.
- Website publication is not allowed by the active approval path.

## Red Flags

- None.
