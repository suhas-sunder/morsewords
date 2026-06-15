# anne-of-avonlea

- Source: `app/client/assets/temp-books/Anne of Avonlea.txt`
- Title: Anne of Avonlea
- Author: L. M. Montgomery
- Raw words: 95082
- Detected convention: standalone roman numeral sections
- Confidence: high (0.95)
- Recommended handling: safe for normal processing
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| roman-only | 30 | 30 | 0 | yes |  |
| isolated-title-case | 72 | 70 | 1 | no | weaker than selected strategy roman-only |
| all-caps-title | 4 | 2 | 2 | no | weaker than selected strategy roman-only |
| chapter-roman | 30 | 0 | 30 | no | rejected as TOC-like or front-matter-only evidence |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L57: I
- L416: II
- L641: III
- L913: IV
- L1111: V
- L1346: VI
- L1727: VII
- L1932: VIII

## Rejected TOC-like Examples

- L6: by Lucy Maud Montgomery
- L11: HATTIE GORDON SMITH
- L20: —WHITTIER
- L25: CHAPTER I. An Irate Neighbor
- L26: CHAPTER II. Selling in Haste and Repenting at Leisure
- L27: CHAPTER III. Mr. Harrison at Home
- L28: CHAPTER IV. Different Opinions
- L29: CHAPTER V. A Full-fledged Schoolma’am
- L30: CHAPTER VI. All Sorts and Conditions of Men . . . and women
- L31: CHAPTER VII. The Pointing of Duty

## Section Size Sanity

- Sections: 30
- Min/median/max words: 1668/3228/4440
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
