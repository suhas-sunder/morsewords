# the-wailing-octopus-a-rick-brant-science-adventure-story

- Source: `app/client/assets/temp-books/The Wailing Octopus - A Rick Brant Science-Adventure Story.txt`
- Title: The Wailing Octopus: A Rick Brant Science-Adventure Story
- Author: Harold L. Goodwin
- Raw words: 49521
- Detected convention: chapter-based roman numerals
- Confidence: high (0.95)
- Recommended handling: safe for normal processing
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 20 | 20 | 0 | yes |  |
| all-caps-title | 46 | 22 | 24 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 47 | 45 | 2 | no | weaker than selected strategy chapter-roman |
| arabic-only | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L93: CHAPTER I
- L420: CHAPTER II
- L750: CHAPTER III
- L1144: CHAPTER IV
- L1448: CHAPTER V
- L1663: CHAPTER VI
- L1888: CHAPTER VII
- L2233: CHAPTER VIII

## Rejected TOC-like Examples

- L4: THE WAILING OCTOPUS
- L8: BY JOHN BLAINE
- L12: BY GROSSET & DUNLAP, INC.
- L30: I DESTINATION: CLIPPER CAY
- L32: II THE SCUBA SLIP
- L34: III THE SHADOW
- L36: IV VISITORS BY NIGHT
- L38: V THE WARNING
- L71: List of Illustrations
- L87: [Illustration: Spindrift Island]

## Section Size Sanity

- Sections: 20
- Min/median/max words: 892/2370/3350
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
