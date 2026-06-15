# siddhartha

- Source: `app/client/assets/temp-books/Siddhartha.txt`
- Title: Siddhartha
- Author: Hermann Hesse
- Raw words: 42824
- Detected convention: story or titled-section headings
- Confidence: high (0.901)
- Recommended handling: needs manual sectioning review
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| all-caps-title | 26 | 11 | 15 | yes |  |
| isolated-title-case | 7 | 4 | 1 | no | weaker than selected strategy all-caps-title |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L330: WITH THE SAMANAS
- L663: GOTAMA
- L981: AWAKENING
- L1117: SECOND PART
- L1122: KAMALA
- L1603: WITH THE CHILDLIKE PEOPLE
- L1911: SANSARA
- L2194: BY THE RIVER

## Rejected TOC-like Examples

- L12: FIRST PART
- L13: THE SON OF THE BRAHMAN
- L14: WITH THE SAMANAS
- L15: GOTAMA
- L16: AWAKENING
- L18: SECOND PART
- L19: KAMALA
- L20: WITH THE CHILDLIKE PEOPLE

## Section Size Sanity

- Sections: 11
- Min/median/max words: 10/3350/5617
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- TOC/body confusion is likely
