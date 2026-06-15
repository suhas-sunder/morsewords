# the-raspberry-worm

- Source: `app/client/assets/temp-books/The Raspberry Worm.txt`
- Title: The Lilac Fairy Book
- Author: Andrew Lang
- Raw words: 4828
- Detected convention: isolated titled sections
- Confidence: medium (0.771)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| isolated-title-case | 5 | 5 | 0 | yes |  |
| all-caps-title | 1 | 1 | 0 | no | weaker than selected strategy isolated-title-case |

## Body Heading Examples

- L3: Edited by Andrew Lang
- L6: The Raspberry Worm
- L257: The Stones of Plouhinec
- L421: ‘You?’
- L423: ‘Yes, I.’

## Rejected TOC-like Examples

- None.

## Section Size Sanity

- Sections: 5
- Min/median/max words: 1/956/2091
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: medium
- End: medium
- Missing Project Gutenberg end marker; footer text was not destructively stripped.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
