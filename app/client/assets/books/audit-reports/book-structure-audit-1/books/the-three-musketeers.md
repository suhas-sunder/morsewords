# the-three-musketeers

- Source: `app/client/assets/temp-books/the-three-musketeers.txt`
- Title: The three musketeers
- Author: Alexandre Dumas
- Raw words: 236958
- Detected convention: chapter-based roman numerals
- Confidence: high (1)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 134 | 67 | 67 | yes |  |
| all-caps-title | 85 | 84 | 1 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 319 | 281 | 36 | no | weaker than selected strategy chapter-roman |
| roman-numbered-title | 51 | 51 | 0 | no | weaker than selected strategy chapter-roman |
| special-front-back | 3 | 1 | 2 | no | weaker than selected strategy chapter-roman |
| date-entry | 1 | 1 | 0 | no | weaker than selected strategy chapter-roman |

## Body Heading Examples

- L171: Chapter I.
- L815: Chapter II.
- L1235: Chapter III.
- L1710: Chapter IV.
- L2058: Chapter V.
- L2534: Chapter VI.
- L3381: Chapter VII.
- L3724: Chapter VIII.

## Rejected TOC-like Examples

- L11: Chapter I. THE THREE PRESENTS OF D’ARTAGNAN THE ELDER
- L12: Chapter II. THE ANTECHAMBER OF M. DE TRÉVILLE
- L13: Chapter III. THE AUDIENCE
- L14: Chapter IV. THE SHOULDER OF ATHOS, THE BALDRIC OF PORTHOS AND THE HANDKERCHIEF OF ARAMIS
- L15: Chapter V. THE KING’S MUSKETEERS AND THE CARDINAL’S GUARDS
- L16: Chapter VI. HIS MAJESTY KING LOUIS XIII.
- L17: Chapter VII. THE INTERIOR OF THE MUSKETEERS
- L18: Chapter VIII. CONCERNING A COURT INTRIGUE

## Section Size Sanity

- Sections: 67
- Min/median/max words: 1508/3108/7223
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- Manifest: `app/client/assets/books/generated/the-three-musketeers/manifest.json`
- Sections: 71
- Included sections: 67
- No generated comparison warnings.

## Red Flags

- None.
