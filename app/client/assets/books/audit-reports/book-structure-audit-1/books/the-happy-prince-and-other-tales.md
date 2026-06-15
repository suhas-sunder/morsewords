# the-happy-prince-and-other-tales

- Source: `app/client/assets/temp-books/The Happy Prince, and Other Tales.txt`
- Title: The Happy Prince, and Other Tales
- Author: Oscar Wilde
- Raw words: 19593
- Detected convention: isolated titled sections
- Confidence: medium (0.701)
- Recommended handling: needs manual sectioning review
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| isolated-title-case | 25 | 9 | 14 | yes |  |
| all-caps-title | 11 | 3 | 8 | no | weaker than selected strategy isolated-title-case |
| roman-numbered-title | 1 | 1 | 0 | no | weaker than selected strategy isolated-title-case |
| arabic-only | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L1: [Picture: Book cover]
- L147: “I am the Happy Prince.”
- L718: [Picture: The Selfish Giant]
- L885: Paradise.”
- L896: [Picture: Hans and the Miller]
- L1304: “‘Little Hans, Doctor.’
- L1389: [Picture: The Remarkable Rocket]
- L1881: Printed by BALLANTYNE & CO. LIMITED

## Rejected TOC-like Examples

- L7: And Other Tales
- L28: _First Edition_ _May_ 1888
- L29: _Second Impression_ _January_ 1889
- L30: _Third Impression_ _February_ 1902
- L31: _Fourth Impression_ _September_ 1905
- L32: _Fifth Impression_ _February_ 1907
- L33: _Sixth Impression_ _March_ 1908
- L34: _Seventh Impression_ _March_ 1910

## Section Size Sanity

- Sections: 9
- Min/median/max words: 5/838/5125
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- TOC/body confusion is likely
