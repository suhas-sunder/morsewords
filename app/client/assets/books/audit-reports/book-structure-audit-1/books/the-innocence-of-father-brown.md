# the-innocence-of-father-brown

- Source: `app/client/assets/temp-books/The innocence of Father Brown.txt`
- Title: The innocence of Father Brown
- Author: G. K. Chesterton
- Raw words: 83138
- Detected convention: isolated titled sections
- Confidence: medium (0.701)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| isolated-title-case | 43 | 29 | 13 | yes |  |
| all-caps-title | 1 | 1 | 0 | no | weaker than selected strategy isolated-title-case |
| roman-numbered-title | 1 | 1 | 0 | no | weaker than selected strategy isolated-title-case |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L800: The Secret Garden
- L1124: “Thank you,” said Valentin. “Come in, Ivan.”
- L1229: “Gone. Scooted. Evaporated,” replied Ivan in humorous French. “His hat
- L1324: “Great Heaven!” cried O’Brien. “Is Brayne a monomaniac?”
- L1365: “Good morning, Commandant O’Brien,” said Valentin, with quiet
- L1625: The Queer Feet
- L1650: The Vernon Hotel at which The Twelve True Fishermen held their annual
- L2366: The Flying Stars

## Rejected TOC-like Examples

- L8: The Blue Cross
- L9: The Secret Garden
- L10: The Queer Feet
- L11: The Flying Stars
- L12: The Invisible Man
- L13: The Honour of Israel Gow
- L14: The Wrong Shape
- L15: The Sins of Prince Saradine

## Section Size Sanity

- Sections: 29
- Min/median/max words: 143/1652/7443
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
