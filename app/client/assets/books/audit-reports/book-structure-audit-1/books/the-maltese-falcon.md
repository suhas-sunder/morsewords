# the-maltese-falcon

- Source: `app/client/assets/temp-books/The Maltese falcon.txt`
- Title: The Maltese falcon
- Author: Dashiell Hammett
- Raw words: 72883
- Detected convention: standalone arabic-numbered sections
- Confidence: high (0.95)
- Recommended handling: safe for normal processing
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| arabic-only | 20 | 20 | 0 | yes |  |
| all-caps-title | 29 | 26 | 3 | no | weaker than selected strategy arabic-only |
| isolated-title-case | 128 | 113 | 14 | no | weaker than selected strategy arabic-only |
| roman-numbered-title | 1 | 1 | 0 | no | weaker than selected strategy arabic-only |

## Body Heading Examples

- L31: 1
- L341: 2
- L885: 3
- L1218: 4
- L1761: 5
- L2023: 6
- L2397: 7
- L2911: 8

## Rejected TOC-like Examples

- L7: MALTESE
- L8: FALCON
- L13: ALFRED · A · KNOPF
- L117: “Yes.”
- L504: Spade said: “No.”
- L633: “No.”
- L983: “Yes.”
- L1086: “No.”
- L1128: “Thanks.”
- L1151: “Thanks.”

## Section Size Sanity

- Sections: 20
- Min/median/max words: 2092/3414/6550
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
