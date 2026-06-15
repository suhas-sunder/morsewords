# the-water-babies

- Source: `app/client/assets/temp-books/the-water-babies.txt`
- Title: The Water-Babies: A Fairy Tale for a Land-Baby
- Author: Charles Kingsley
- Raw words: 72120
- Detected convention: story or titled-section headings
- Confidence: high (0.901)
- Recommended handling: needs manual sectioning review
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| all-caps-title | 22 | 14 | 8 | yes |  |
| chapter-roman | 7 | 7 | 0 | no | weaker than selected strategy all-caps-title |
| isolated-title-case | 91 | 87 | 3 | no | weaker than selected strategy all-caps-title |
| arabic-numbered-title | 5 | 5 | 0 | no | weaker than selected strategy all-caps-title |
| roman-only | 2 | 2 | 0 | no | weaker than selected strategy all-caps-title |
| arabic-only | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L8: THE WATER-BABIES
- L30: PRINTED IN GREAT BRITAIN
- L35: MY YOUNGEST SON
- L37: GRENVILLE ARTHUR
- L41: TO ALL OTHER GOOD LITTLE BOYS
- L44: COME READ ME MY RIDDLE, EACH GOOD LITTLE MAN;
- L45: IF YOU CANNOT READ IT, NO GROWN-UP FOLK CAN.
- L967: SPENSER.

## Rejected TOC-like Examples

- L12: BY CHARLES KINGSLEY
- L14: WITH ILLUSTRATIONS IN COLOUR BY
- L15: WARWICK GOBLE
- L17: MACMILLAN AND CO., LIMITED
- L18: ST. MARTIN'S STREET, LONDON
- L48: ILLUSTRATIONS
- L50: FACING PAGE
- L101: WORDSWORTH.

## Section Size Sanity

- Sections: 14
- Min/median/max words: 3/6442/17113
- Notes: many very small sections; headings may include TOC, captions, or fragments

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- Manifest: `app/client/assets/books/generated/the-water-babies/manifest.json`
- Sections: 10
- Included sections: 9
- No generated comparison warnings.

## Red Flags

- body headings were found but rejected by the selected strategy
