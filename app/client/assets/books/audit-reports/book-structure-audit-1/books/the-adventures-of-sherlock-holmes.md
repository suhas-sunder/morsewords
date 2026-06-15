# the-adventures-of-sherlock-holmes

- Source: `app/client/assets/temp-books/The Adventures of Sherlock Holmes.txt`
- Title: The Adventures of Sherlock Holmes
- Author: Arthur Conan Doyle
- Raw words: 108416
- Detected convention: roman-numbered titled sections
- Confidence: high (0.964)
- Recommended handling: needs manual sectioning review
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| roman-numbered-title | 24 | 11 | 13 | yes |  |
| all-caps-title | 8 | 8 | 0 | no | weaker than selected strategy roman-numbered-title |
| isolated-title-case | 128 | 111 | 15 | no | weaker than selected strategy roman-numbered-title |
| roman-only | 4 | 3 | 1 | no | weaker than selected strategy roman-numbered-title |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L1100: II. THE RED-HEADED LEAGUE
- L2134: III. A CASE OF IDENTITY
- L2883: IV. THE BOSCOMBE VALLEY MYSTERY
- L3935: V. THE FIVE ORANGE PIPS
- L4770: VI. THE MAN WITH THE TWISTED LIP
- L5810: VII. THE ADVENTURE OF THE BLUE CARBUNCLE
- L6736: VIII. THE ADVENTURE OF THE SPECKLED BAND
- L7873: IX. THE ADVENTURE OF THE ENGINEER’S THUMB

## Rejected TOC-like Examples

- L8: I. A Scandal in Bohemia
- L9: II. The Red-Headed League
- L10: III. A Case of Identity
- L11: IV. The Boscombe Valley Mystery
- L12: V. The Five Orange Pips
- L13: VI. The Man with the Twisted Lip
- L14: VII. The Adventure of the Blue Carbuncle
- L15: VIII. The Adventure of the Speckled Band

## Section Size Sanity

- Sections: 11
- Min/median/max words: 7042/9201/10017
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- TOC/body confusion is likely
