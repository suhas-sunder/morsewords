# the-three-taps-a-detective-story-without-a-moral

- Source: `app/client/assets/temp-books/The three taps - A detective story without a moral.txt`
- Title: The three taps
- Author: Ronald Arbuthnott Knox
- Raw words: 72767
- Detected convention: chapter-based roman numerals
- Confidence: high (0.95)
- Recommended handling: safe for normal processing
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 25 | 25 | 0 | yes |  |
| isolated-title-case | 59 | 56 | 2 | no | weaker than selected strategy chapter-roman |
| roman-numbered-title | 25 | 1 | 24 | no | weaker than selected strategy chapter-roman |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L42: Chapter I
- L340: Chapter II
- L615: Chapter III
- L885: Chapter IV
- L1169: Chapter V
- L1451: Chapter VI
- L1753: Chapter VII
- L1914: Chapter VIII

## Rejected TOC-like Examples

- L38: Susan and Francis Baker
- L1299: “Brinkman.”
- L10: I. The Euthanasia Policy
- L11: II. The Detective _Malgré Lui_
- L12: III. At the _Load of Mischief_
- L13: IV. The Bedroom
- L14: V. Supper, and Mr. Brinkman
- L15: VI. An Ear at the Keyhole
- L17: VIII. The Bishop at Home
- L18: IX. The Late Rector of Hipley

## Section Size Sanity

- Sections: 25
- Min/median/max words: 1807/2657/4706
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
