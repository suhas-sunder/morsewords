# astounding-stories-of-super-science

- Source: `app/client/assets/temp-books/Astounding Stories of Super-Science.txt`
- Title: Astounding Stories of Super-Science, October, 1930
- Author: Various
- Raw words: 81947
- Detected convention: chapter-based roman numerals
- Confidence: high (0.941)
- Recommended handling: safe for normal processing
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 20 | 20 | 0 | yes |  |
| all-caps-title | 18 | 15 | 3 | no | weaker than selected strategy chapter-roman |
| arabic-numbered-title | 4 | 4 | 0 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 231 | 226 | 5 | no | weaker than selected strategy chapter-roman |
| roman-only | 1 | 1 | 0 | no | weaker than selected strategy chapter-roman |

## Body Heading Examples

- L1412: CHAPTER I
- L1695: CHAPTER II
- L2018: CHAPTER III
- L2293: CHAPTER IV
- L2626: CHAPTER V
- L2922: CHAPTER VI
- L3316: CHAPTER VII
- L3559: CHAPTER VIII

## Rejected TOC-like Examples

- L36: MONTHLY, ALL STAR DETECTIVE STORIES, RANGELAND LOVE STORY MAGAZINE,
- L37: and WESTERN ADVENTURES.
- L67: JETTA OF THE LOWLANDS RAY CUMMINGS 94
- L19: The Clayton Standard on a Magazine Guarantees
- L39: _More than Two Million Copies Required to Supply the Monthly Demand
- L40: for Clayton Magazines._
- L795: "Yes."
- L1398: [Advertisement: ]

## Section Size Sanity

- Sections: 20
- Min/median/max words: 1287/2332/15124
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
