# king-arthur-and-the-knights-of-the-round-table

- Source: `app/client/assets/temp-books/King Arthur and the Knights of the Round Table.txt`
- Title: King Arthur and the Knights of the Round Table
- Author: Sir Thomas Malory
- Raw words: 101882
- Detected convention: standalone roman numeral sections
- Confidence: high (0.95)
- Recommended handling: safe for normal processing
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| roman-only | 15 | 15 | 0 | yes |  |
| all-caps-title | 44 | 21 | 22 | no | weaker than selected strategy roman-only |
| isolated-title-case | 49 | 48 | 1 | no | weaker than selected strategy roman-only |
| special-front-back | 3 | 0 | 3 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L363: I
- L693: II
- L1217: III
- L1681: IV
- L2087: V
- L2544: VI
- L3141: VII
- L3473: VIII

## Rejected TOC-like Examples

- L314: THE COMING OF ARTHUR AND THE FOUNDING OF THE ROUND TABLE
- L316: I MERLIN FORETELLS THE BIRTH OF ARTHUR
- L318: II THE CROWNING OF ARTHUR AND THE SWORD EXCALIBUR
- L320: III ARTHUR DRIVES THE SAXONS FROM HIS REALM
- L322: IV THE KING'S MANY AND GREAT ADVENTURES
- L324: V SIR BALIN FIGHTS WITH HIS BROTHER, SIR BALAN
- L326: VI THE MARRIAGE OF ARTHUR AND GUINEVERE AND THE FOUNDING OF THE ROUND
- L327: TABLE
- L251: Sir Lancelot and Queen Guinevere
- L27: INTRODUCTION

## Section Size Sanity

- Sections: 15
- Min/median/max words: 3251/4845/14713
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
