# treasure-island

- Source: `app/client/assets/temp-books/treasure-island.txt`
- Title: Treasure Island
- Author: Robert Louis Stevenson
- Raw words: 73246
- Detected convention: standalone roman numeral sections with part divisions
- Confidence: high (0.939)
- Recommended handling: needs manual sectioning review
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| roman-only | 34 | 34 | 0 | yes |  |
| part-division | 12 | 6 | 6 | no | weaker than selected strategy roman-only |
| isolated-title-case | 57 | 51 | 6 | no | weaker than selected strategy roman-only |
| all-caps-title | 13 | 4 | 9 | no | weaker than selected strategy roman-only |
| roman-numbered-title | 34 | 0 | 34 | no | rejected as TOC-like or front-matter-only evidence |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L107: I
- L308: II
- L549: III
- L763: IV
- L968: V
- L1175: VI
- L1411: VII
- L1631: VIII

## Rejected TOC-like Examples

- L37: PART ONE
- L47: PART TWO
- L57: PART THREE
- L64: PART FOUR
- L78: PART FIVE
- L88: PART SIX
- L38: The Old Buccaneer
- L48: The Sea Cook
- L58: My Shore Adventure
- L65: The Stockade

## Section Size Sanity

- Sections: 34
- Min/median/max words: 1509/2006/3025
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- Manifest: `app/client/assets/books/generated/treasure-island/manifest.json`
- Sections: 14
- Included sections: 0
- No chapter headings were detected; generated fallback parts instead.
- existing generated output section count is far below likely raw body heading count (14 vs 34)

## Red Flags

- body headings were found but rejected by the selected strategy
- generated output likely collapsed real structure
