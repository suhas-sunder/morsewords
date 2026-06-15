# the-adventures-of-ferdinand-count-fathom

- Source: `app/client/assets/temp-books/The Adventures of Ferdinand Count Fathom.txt`
- Title: The Adventures of Ferdinand Count Fathom — Complete
- Author: T. Smollett
- Raw words: 165671
- Detected convention: story or titled-section headings
- Confidence: high (0.901)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| all-caps-title | 154 | 150 | 4 | yes |  |
| chapter-word | 76 | 68 | 0 | no | weaker than selected strategy all-caps-title |
| isolated-title-case | 25 | 15 | 9 | no | weaker than selected strategy all-caps-title |
| part-division | 3 | 1 | 2 | no | weaker than selected strategy all-caps-title |
| special-front-back | 3 | 0 | 3 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L305: G. H. MAYNADIER
- L311: TO DOCTOR ———
- L455: THE AUTHOR.
- L460: SOME SAGE OBSERVATIONS THAT NATURALLY INTRODUCE OUR IMPORTANT HISTORY.
- L610: A SUPERFICIAL VIEW OF OUR HERO’S INFANCY.
- L712: HE IS INITIATED IN A MILITARY LIFE, AND HAS THE GOOD FORTUNE TO ACQUIRE
- L713: A GENEROUS PATRON.
- L827: HIS MOTHER’S PROWESS AND DEATH; TOGETHER WITH SOME INSTANCES OF HIS OWN

## Rejected TOC-like Examples

- L10: COMPLETE IN TWO PARTS
- L21: TO DOCTOR
- L93: ILLUSTRATIONS
- L308: THE ADVENTURES OF FERDINAND COUNT FATHOM

## Section Size Sanity

- Sections: 150
- Min/median/max words: 2/171/7134
- Notes: many very small sections; headings may include TOC, captions, or fragments; largest section is much bigger than the median section

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
