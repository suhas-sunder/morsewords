# the-dunwich-horror

- Source: `app/client/assets/temp-books/The Dunwich horror.txt`
- Title: The Dunwich horror
- Author: H. P. Lovecraft
- Raw words: 20617
- Detected convention: standalone arabic-numbered sections
- Confidence: high (0.95)
- Recommended handling: safe for normal processing
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| arabic-only | 10 | 10 | 0 | yes |  |
| isolated-title-case | 9 | 9 | 0 | no | weaker than selected strategy arabic-only |
| all-caps-title | 2 | 2 | 0 | no | weaker than selected strategy arabic-only |
| arabic-numbered-title | 1 | 1 | 0 | no | weaker than selected strategy arabic-only |

## Body Heading Examples

- L29: 1
- L160: 2
- L298: 3
- L410: 4
- L542: 5
- L688: 6
- L827: 7
- L1064: 8

## Rejected TOC-like Examples

- None.

## Section Size Sanity

- Sections: 10
- Min/median/max words: 1211/1524/2505
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
