# love-among-the-chickens

- Source: `app/client/assets/temp-books/Love Among the Chickens.txt`
- Title: Love Among the Chickens
- Author: P. G. Wodehouse
- Raw words: 52688
- Detected convention: standalone roman numeral sections
- Confidence: high (0.95)
- Recommended handling: safe for normal processing
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| roman-only | 23 | 23 | 0 | yes |  |
| all-caps-title | 42 | 38 | 2 | no | weaker than selected strategy roman-only |
| isolated-title-case | 87 | 83 | 4 | no | weaker than selected strategy roman-only |
| roman-numbered-title | 23 | 1 | 22 | no | weaker than selected strategy roman-only |
| special-front-back | 3 | 1 | 2 | no | weaker than selected strategy roman-only |
| arabic-only | 1 | 1 | 0 | no | weaker than selected strategy roman-only |

## Body Heading Examples

- L117: I
- L402: II
- L706: III
- L962: IV
- L1286: V
- L1526: VI
- L1732: VII
- L2072: VIII

## Rejected TOC-like Examples

- L14: AN ENGLISH CHICKEN FARM
- L41: CHAPTER
- L126: "Sir?"
- L130: "Sir?"
- L350: "Sir?"
- L674: Garnet."
- L43: I. --A LETTER WITH A POSTSCRIPT
- L45: II. --UKRIDGE'S SCHEME
- L47: III. --WATERLOO, SOME FELLOW-TRAVELERS, AND A GIRL WITH BROWN HAIR
- L49: IV. --THE ARRIVAL

## Section Size Sanity

- Sections: 23
- Min/median/max words: 1398/2264/2721
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
