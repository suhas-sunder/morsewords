# the-works-of-edgar-allan-poe

- Source: `app/client/assets/temp-books/The Works of Edgar Allan Poe.txt`
- Title: The Works of Edgar Allan Poe — Volume 2
- Author: Edgar Allan Poe
- Raw words: 99822
- Detected convention: story or titled-section headings
- Confidence: high (0.901)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| all-caps-title | 48 | 24 | 24 | yes |  |
| roman-only | 6 | 6 | 0 | no | weaker than selected strategy all-caps-title |
| isolated-title-case | 40 | 40 | 0 | no | weaker than selected strategy all-caps-title |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |
| volume-division | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L861: THE THOUSAND-AND-SECOND TALE OF SCHEHERAZADE
- L1479: A DESCENT INTO THE MAELSTROM.
- L2160: VON KEMPELEN AND HIS DISCOVERY
- L2440: MESMERIC REVELATION
- L2897: THE FACTS IN THE CASE OF M. VALDEMAR
- L2971: MY DEAR P——,
- L2977: VALDEMAR
- L3298: THE BLACK CAT.

## Rejected TOC-like Examples

- L12: THE PURLOINED LETTER
- L13: THE THOUSAND-AND-SECOND TALE OF SCHEHERAZADE
- L14: A DESCENT INTO THE MAELSTROM.
- L15: VON KEMPELEN AND HIS DISCOVERY
- L16: MESMERIC REVELATION
- L17: THE FACTS IN THE CASE OF M. VALDEMAR
- L18: THE BLACK CAT.
- L19: THE FALL OF THE HOUSE OF USHER

## Section Size Sanity

- Sections: 24
- Min/median/max words: 32/3221/8038
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
