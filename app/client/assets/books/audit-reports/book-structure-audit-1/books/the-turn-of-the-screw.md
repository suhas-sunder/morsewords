# the-turn-of-the-screw

- Source: `app/client/assets/temp-books/The Turn of the Screw.txt`
- Title: The Turn of the Screw
- Author: Henry James
- Raw words: 46568
- Detected convention: standalone roman numeral sections
- Confidence: high (1)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| roman-only | 48 | 24 | 24 | yes |  |
| isolated-title-case | 19 | 17 | 0 | no | weaker than selected strategy roman-only |
| all-caps-title | 2 | 1 | 1 | no | weaker than selected strategy roman-only |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L336: I
- L494: II
- L674: III
- L869: IV
- L1044: V
- L1263: VI
- L1539: VII
- L1747: VIII

## Rejected TOC-like Examples

- L10: I
- L11: II
- L12: III
- L13: IV
- L14: V
- L15: VI
- L16: VII
- L17: VIII

## Section Size Sanity

- Sections: 24
- Min/median/max words: 1006/1708/2740
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
