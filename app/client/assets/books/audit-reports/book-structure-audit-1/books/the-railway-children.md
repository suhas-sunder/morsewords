# the-railway-children

- Source: `app/client/assets/temp-books/the-railway-children.txt`
- Title: The Railway Children
- Author: E. Nesbit
- Raw words: 62950
- Detected convention: chapter-based roman numerals
- Confidence: high (0.95)
- Recommended handling: needs manual sectioning review
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 14 | 14 | 0 | yes |  |
| all-caps-title | 12 | 12 | 0 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 54 | 53 | 1 | no | weaker than selected strategy chapter-roman |
| roman-numbered-title | 14 | 0 | 14 | no | rejected as TOC-like or front-matter-only evidence |
| arabic-only | 2 | 0 | 2 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L29: Chapter I. The beginning of things.
- L584: Chapter II. Peter's coal-mine.
- L1265: Chapter III. The old gentleman.
- L1854: Chapter IV. The engine-burglar.
- L2491: Chapter V. Prisoners and captives.
- L2947: Chapter VI. Saviours of the train.
- L3450: Chapter VII. For valour.
- L4033: Chapter VIII. The amateur firemen.

## Rejected TOC-like Examples

- L1142: White Heather Sidings
- L13: I. The beginning of things.
- L14: II. Peter's coal-mine.
- L15: III. The old gentleman.
- L16: IV. The engine-burglar.
- L17: V. Prisoners and captives.
- L18: VI. Saviours of the train.
- L19: VII. For valour.
- L20: VIII. The amateur fireman.
- L1538: 379

## Section Size Sanity

- Sections: 14
- Min/median/max words: 3636/4192/5162
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- Manifest: `app/client/assets/books/generated/the-railway-children/manifest.json`
- Sections: 15
- Included sections: 14
- existing generated first preview may include source, title-page, or TOC junk

## Red Flags

- generated output may include source/license/TOC/footer junk
