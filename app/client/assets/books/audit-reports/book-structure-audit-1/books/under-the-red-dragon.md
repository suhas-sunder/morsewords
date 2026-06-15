# under-the-red-dragon

- Source: `app/client/assets/temp-books/Under the Red Dragon.txt`
- Title: Under the Red Dragon: A Novel
- Author: James Grant
- Raw words: 155883
- Detected convention: chapter-based roman numerals
- Confidence: high (0.95)
- Recommended handling: safe for normal processing
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 61 | 61 | 0 | yes |  |
| all-caps-title | 14 | 6 | 8 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 178 | 168 | 10 | no | weaker than selected strategy chapter-roman |
| roman-only | 3 | 2 | 1 | no | weaker than selected strategy chapter-roman |
| arabic-numbered-title | 1 | 1 | 0 | no | weaker than selected strategy chapter-roman |
| roman-numbered-title | 61 | 0 | 61 | no | rejected as TOC-like or front-matter-only evidence |
| arabic-only | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L95: CHAPTER I.--THE INVITATION.
- L336: CHAPTER II.--THE MOTH AND THE CANDLE.
- L559: CHAPTER III--By EXPRESS.
- L787: CHAPTER IV.--WINNY AND DORA LLOYD.
- L1065: CHAPTER V.--CRAIGADERYN COURT.
- L1330: CHAPTER VI.--THREE GRACES.
- L1831: CHAPTER VII.--PIQUE.
- L2276: CHAPTER VIII.--SUNDAY AT CRAIGADERYN.

## Rejected TOC-like Examples

- L7: UNDER THE RED DRAGON.
- L15: AUTHOR OF "THE ROMANCE OF WAR," "ONLY AN ENSIGN," ETC.
- L18: LONDON:
- L19: GEORGE ROUTLEDGE AND SONS,
- L20: THE BROADWAY, LUDGATE.
- L21: NEW YORK: 416, BROOME STREET.
- L25: CONTENTS.
- L27: CHAP.
- L972: "You!"
- L2122: "Yes."

## Section Size Sanity

- Sections: 61
- Min/median/max words: 1054/2371/4854
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
