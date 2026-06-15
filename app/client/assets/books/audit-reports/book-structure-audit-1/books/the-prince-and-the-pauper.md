# the-prince-and-the-pauper

- Source: `app/client/assets/temp-books/The Prince and the Pauper.txt`
- Title: The Prince and the Pauper
- Author: Mark Twain
- Raw words: 74570
- Detected convention: chapter-based roman numerals
- Confidence: high (0.95)
- Recommended handling: safe for normal processing
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 33 | 33 | 0 | yes |  |
| all-caps-title | 195 | 7 | 188 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 49 | 46 | 3 | no | weaker than selected strategy chapter-roman |
| arabic-only | 1 | 1 | 0 | no | weaker than selected strategy chapter-roman |
| special-front-back | 2 | 1 | 1 | no | weaker than selected strategy chapter-roman |
| roman-numbered-title | 33 | 0 | 33 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L444: CHAPTER I. The birth of the Prince and the Pauper.
- L468: CHAPTER II. Tom’s early life.
- L620: CHAPTER III. Tom’s meeting with the Prince.
- L909: CHAPTER IV. The Prince’s troubles begin.
- L1051: CHAPTER V. Tom as a Patrician.
- L1333: CHAPTER VI. Tom receives instructions.
- L1624: CHAPTER VII. Tom’s first royal dinner.
- L1743: CHAPTER VIII. The Question of the Seal.

## Rejected TOC-like Examples

- L59: ILLUSTRATIONS
- L63: THE BIRTH OF THE PRINCE AND THE PAUPER
- L65: “SPLENDID PAGEANTS AND GREAT BONFIRES”
- L67: TOM’S EARLY LIFE
- L69: OFFAL COURT
- L71: “WITH ANY MISERABLE CRUST”
- L73: “HE OFTEN READ THE PRIEST’S BOOKS”
- L75: “SAW POOR ANNE ASKEW BURNED”
- L61: THE GREAT SEAL (frontispiece)
- L1287: Lord Hertford said--

## Section Size Sanity

- Sections: 33
- Min/median/max words: 269/1994/5897
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
