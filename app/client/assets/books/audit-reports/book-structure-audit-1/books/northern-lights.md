# northern-lights

- Source: `app/client/assets/temp-books/Northern Lights.txt`
- Title: Northern Lights
- Author: Gilbert Parker
- Raw words: 116029
- Detected convention: story or titled-section headings
- Confidence: high (0.901)
- Recommended handling: needs manual sectioning review
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| all-caps-title | 63 | 24 | 39 | yes |  |
| roman-only | 10 | 8 | 2 | no | weaker than selected strategy all-caps-title |
| isolated-title-case | 77 | 52 | 23 | no | weaker than selected strategy all-caps-title |
| roman-numbered-title | 1 | 1 | 0 | no | weaker than selected strategy all-caps-title |
| special-front-back | 2 | 0 | 2 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L567: [Illustration: THE BIRD SHE HEARD IN THE NIGHT WAS CALLING IN HIS
- L568: EARS NOW]
- L774: ONCE AT RED MAN'S RIVER
- L1325: THE STROKE OF THE HOUR
- L1972: [Illustration: SHE SWAYED AND FELL FAINTING AT THE FEET OF BA'TISTE]
- L1975: BUCKMASTER'S BOY
- L2427: [Illustration: LITTLE BY LITTLE THEY DREW TO THE EDGE OF THE ROCK]
- L2468: TO-MORROW

## Rejected TOC-like Examples

- L8: NORTHERN LIGHTS
- L11: GILBERT PARKER
- L13: ILLUSTRATED
- L15: HARPER & BROTHERS PUBLISHERS
- L16: NEW YORK AND LONDON
- L21: GILBERT PARKER
- L51: ISHBEL, COUNTESS OF ABERDEEN
- L52: A TRUE FRIEND

## Section Size Sanity

- Sections: 24
- Min/median/max words: 11/5468/13979
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- TOC/body confusion is likely
- body headings were found but rejected by the selected strategy
