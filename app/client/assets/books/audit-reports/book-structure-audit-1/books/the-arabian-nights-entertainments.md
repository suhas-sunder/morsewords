# the-arabian-nights-entertainments

- Source: `app/client/assets/temp-books/The Arabian Nights Entertainments.txt`
- Title: The Arabian Nights Entertainments
- Author: Andrew Lang
- Raw words: 103133
- Detected convention: isolated titled sections
- Confidence: high (0.901)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| isolated-title-case | 68 | 38 | 30 | yes |  |
| special-front-back | 3 | 1 | 2 | no | weaker than selected strategy isolated-title-case |

## Body Heading Examples

- L1: The Arabian Nights Entertainments,
- L4: Selected and Edited
- L8: Andrew Lang
- L13: Longmans, Green and Co, 1918 (1898)
- L134: The Arabian Nights
- L701: Fisherman."
- L704: The Story of the Fisherman
- L838: The Story of the Greek King and the Physician Douban

## Rejected TOC-like Examples

- L19: The Arabian Nights
- L23: The Story of the Fisherman
- L24: The Story of the Greek King and the Physician Douban
- L26: The Story of the Vizir Who Was Punished
- L27: The Story of the Young King of the Black Isles
- L28: The Story of the Three Calenders, Sons of Kings,
- L30: The Story of the First Calender, Son of a King
- L31: The Story of the Envious Man and of Him Who Was Envied

## Section Size Sanity

- Sections: 38
- Min/median/max words: 1/2260/13269
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: medium
- End: medium
- Missing Project Gutenberg end marker; footer text was not destructively stripped.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
