# the-amateur-cracksman

- Source: `app/client/assets/temp-books/The Amateur Cracksman.txt`
- Title: The Amateur Cracksman
- Author: E. W. Hornung
- Raw words: 55424
- Detected convention: story or titled-section headings
- Confidence: high (0.901)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| all-caps-title | 24 | 11 | 10 | yes |  |
| isolated-title-case | 54 | 51 | 3 | no | weaker than selected strategy all-caps-title |
| roman-only | 5 | 3 | 2 | no | weaker than selected strategy all-caps-title |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L1: THE AMATEUR CRACKSMAN
- L887: A COSTUME PIECE
- L1558: GENTLEMEN AND PLAYERS
- L2344: LE PREMIER PAS
- L3011: WILFUL MURDER
- L3488: "JACK--RUTTER?"
- L3638: NINE POINTS OF THE LAW
- L4027: "I?"

## Rejected TOC-like Examples

- L14: THE AMATEUR CRACKSMAN
- L19: THE IDES OF MARCH
- L20: A COSTUME PIECE
- L21: GENTLEMEN AND PLAYERS
- L22: LE PREMIER PAS
- L23: WILFUL MURDER
- L24: NINE POINTS OF THE LAW
- L25: THE RETURN MATCH

## Section Size Sanity

- Sections: 11
- Min/median/max words: 477/5516/8546
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
