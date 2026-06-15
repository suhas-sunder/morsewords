# les-miserables

- Source: `app/client/assets/temp-books/Les Misérables.txt`
- Title: Les Misérables
- Author: Victor Hugo
- Raw words: 575215
- Detected convention: story or titled-section headings
- Confidence: high (0.901)
- Recommended handling: needs manual sectioning review
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| all-caps-title | 938 | 489 | 444 | yes |  |
| volume-division | 5 | 5 | 0 | no | weaker than selected strategy all-caps-title |
| isolated-title-case | 725 | 635 | 85 | no | weaker than selected strategy all-caps-title |
| roman-numbered-title | 130 | 130 | 0 | no | weaker than selected strategy all-caps-title |
| arabic-numbered-title | 6 | 6 | 0 | no | weaker than selected strategy all-caps-title |
| chapter-roman | 4 | 2 | 2 | no | weaker than selected strategy all-caps-title |
| arabic-only | 2 | 2 | 0 | no | weaker than selected strategy all-caps-title |
| special-front-back | 3 | 1 | 2 | no | weaker than selected strategy all-caps-title |

## Body Heading Examples

- L252: CHAPTER II—IN WHICH THE READER WILL PERUSE TWO VERSES, WHICH ARE OF
- L738: CABUC
- L779: VOLUME V—JEAN VALJEAN
- L783: CHAPTER I—THE CHARYBDIS OF THE FAUBOURG SAINT ANTOINE AND THE SCYLLA
- L1043: LES MISÉRABLES
- L1060: HAUTEVILLE HOUSE, 1862.
- L1067: BOOK FIRST—A JUST MAN
- L1070: CHAPTER I—M. MYRIEL

## Rejected TOC-like Examples

- L1: LES MISÉRABLES
- L31: LES MISÉRABLES
- L36: VOLUME I—FANTINE
- L39: BOOK FIRST—A JUST MAN
- L41: CHAPTER I—M. MYRIEL
- L43: CHAPTER II—M. MYRIEL BECOMES M. WELCOME
- L45: CHAPTER III—A HARD BISHOPRIC FOR A GOOD BISHOP
- L47: CHAPTER IV—WORKS CORRESPONDING TO WORDS

## Section Size Sanity

- Sections: 489
- Min/median/max words: 1/931/9007
- Notes: largest section is much bigger than the median section

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- Manifest: `app/client/assets/books/generated/les-miserables/manifest.json`
- Sections: 6
- Included sections: 2
- Rights have not been reviewed; generated book is not publish-ready.
- Rights basis "unknown" is not publish-ready.
- Rights gate status is needs_manual_review; generated book is not publish-ready.
- Rights gate did not allow processed public story output.
- Owner-reviewed website approval is missing.
- Website publication is not allowed by the active approval path.
- existing generated output section count is far below likely raw body heading count (6 vs 489)

## Red Flags

- body headings were found but rejected by the selected strategy
- generated output likely collapsed real structure
