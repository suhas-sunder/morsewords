# quo-vadis

- Source: `app/client/assets/temp-books/Quo Vadis.txt`
- Title: Quo Vadis: A Narrative of the Time of Nero
- Author: Henryk Sienkiewicz
- Raw words: 213761
- Detected convention: chapter-based roman numerals
- Confidence: high (0.945)
- Recommended handling: safe for normal processing
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 73 | 73 | 0 | yes |  |
| all-caps-title | 15 | 14 | 1 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 126 | 119 | 7 | no | weaker than selected strategy chapter-roman |
| roman-numbered-title | 1 | 1 | 0 | no | weaker than selected strategy chapter-roman |
| special-front-back | 1 | 1 | 0 | no | weaker than selected strategy chapter-roman |

## Body Heading Examples

- L54: Chapter I
- L571: Chapter II
- L1273: Chapter III
- L1372: Chapter IV
- L1644: Chapter V
- L1789: Chapter VI
- L1952: Chapter VII
- L2981: Chapter VIII

## Rejected TOC-like Examples

- L1: QUO VADIS
- L259: “No.”
- L283: “No.”
- L1621: Nero.”
- L3091: “No.”
- L3301: “Why?”
- L3385: Lygia.”
- L4613: “What?”

## Section Size Sanity

- Sections: 73
- Min/median/max words: 495/2630/10286
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
