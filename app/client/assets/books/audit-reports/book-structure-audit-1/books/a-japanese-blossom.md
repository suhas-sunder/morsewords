# a-japanese-blossom

- Source: `app/client/assets/temp-books/A Japanese Blossom.txt`
- Title: A Japanese Blossom
- Author: Onoto Watanna
- Raw words: 35731
- Detected convention: standalone roman numeral sections
- Confidence: high (0.95)
- Recommended handling: safe for normal processing
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| roman-only | 29 | 29 | 0 | yes |  |
| all-caps-title | 38 | 20 | 13 | no | weaker than selected strategy roman-only |
| isolated-title-case | 67 | 61 | 6 | no | weaker than selected strategy roman-only |
| roman-numbered-title | 1 | 1 | 0 | no | weaker than selected strategy roman-only |

## Body Heading Examples

- L83: I
- L284: II
- L479: III
- L732: IV
- L931: V
- L1100: VI
- L1202: VII
- L1302: VIII

## Rejected TOC-like Examples

- L52: ILLUSTRATIONS
- L56: OTHER”
- L58: “MARION SAT ON A GIGANTIC 52
- L59: MOSS-GROWN ROCK, LOOKING ... AT
- L60: THE CHILDREN IN THE FAMILY POND”
- L62: “THE LITTLE WAITRESS BROUGHT HER 170
- L63: SAMISEN, AND ... BEGAN TO PLAY
- L64: AND SING”
- L1: [Illustration:
- L24: [Illustration]

## Section Size Sanity

- Sections: 29
- Min/median/max words: 486/1064/2136
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
