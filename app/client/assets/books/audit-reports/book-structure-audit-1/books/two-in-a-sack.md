# two-in-a-sack

- Source: `app/client/assets/temp-books/TWO IN A SACK.txt`
- Title: The Violet Fairy Book
- Author: Andrew Lang
- Raw words: 1677
- Detected convention: isolated titled sections
- Confidence: high (0.781)
- Recommended handling: safe for normal processing
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| isolated-title-case | 9 | 9 | 0 | yes |  |
| all-caps-title | 2 | 2 | 0 | no | weaker than selected strategy isolated-title-case |

## Body Heading Examples

- L3: By Various
- L5: Edited By Andrew Lang
- L120: One--two--
- L122: One--two--’
- L147: One--two--
- L149: One--two--’
- L162: One--two--’
- L221: Oh! Oh!’

## Rejected TOC-like Examples

- None.

## Section Size Sanity

- Sections: 9
- Min/median/max words: 2/66/846
- Notes: many very small sections; headings may include TOC, captions, or fragments; largest section is much bigger than the median section

## Boundary Confidence

- Start: medium
- End: medium
- Missing Project Gutenberg end marker; footer text was not destructively stripped.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
