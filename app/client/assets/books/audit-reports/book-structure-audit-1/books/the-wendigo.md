# the-wendigo

- Source: `app/client/assets/temp-books/The Wendigo.txt`
- Title: The Wendigo
- Author: Algernon Blackwood
- Raw words: 21797
- Detected convention: standalone roman numeral sections
- Confidence: high (0.95)
- Recommended handling: safe for normal processing
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| roman-only | 9 | 9 | 0 | yes |  |
| all-caps-title | 1 | 1 | 0 | no | weaker than selected strategy roman-only |
| arabic-only | 1 | 1 | 0 | no | weaker than selected strategy roman-only |
| isolated-title-case | 1 | 1 | 0 | no | weaker than selected strategy roman-only |

## Body Heading Examples

- L8: I
- L262: II
- L696: III
- L759: IV
- L1038: V
- L1207: VI
- L1444: VII
- L1586: VIII

## Rejected TOC-like Examples

- None.

## Section Size Sanity

- Sections: 9
- Min/median/max words: 566/2142/4230
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
