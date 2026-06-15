# parnassus-on-wheels

- Source: `app/client/assets/temp-books/Parnassus on Wheels.txt`
- Title: Parnassus on Wheels
- Author: Christopher Morley
- Raw words: 13239
- Detected convention: chapter-based word ordinals
- Confidence: high (0.87)
- Recommended handling: safe for normal processing
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-word | 6 | 6 | 0 | yes |  |
| all-caps-title | 24 | 18 | 6 | no | weaker than selected strategy chapter-word |
| isolated-title-case | 9 | 9 | 0 | no | weaker than selected strategy chapter-word |

## Body Heading Examples

- L57: CHAPTER ONE
- L236: CHAPTER TWO
- L463: CHAPTER THREE
- L664: CHAPTER FOUR
- L1041: CHAPTER FIVE
- L1403: CHAPTER SIX

## Rejected TOC-like Examples

- L5: CHRISTOPHER MORLEY
- L159: DEAR MR. McGILL:
- L257: TRAVELLING PARNASSUS
- L260: HAZLITT, AND ALL OTHERS
- L303: ROGER MIFFLIN'S
- L304: TRAVELLING PARNASSUS

## Section Size Sanity

- Sections: 6
- Min/median/max words: 236/1958/3758
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: medium
- End: medium
- Missing Project Gutenberg end marker; footer text was not destructively stripped.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
