# little-lasse

- Source: `app/client/assets/temp-books/Little Lasse.txt`
- Title: The Lilac Fairy Book
- Author: Andrew Lang
- Raw words: 2827
- Detected convention: isolated titled sections
- Confidence: medium (0.701)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| isolated-title-case | 6 | 6 | 0 | yes |  |
| all-caps-title | 1 | 1 | 0 | no | weaker than selected strategy isolated-title-case |

## Body Heading Examples

- L3: Edited by Andrew Lang
- L6: Little Lasse
- L217: Little Lasse, Lasse,
- L223: Little Lasse, Lasse;
- L230: Little Lasse, Lasse,
- L238: Lasse, Little Lasse?

## Rejected TOC-like Examples

- None.

## Section Size Sanity

- Sections: 6
- Min/median/max words: 4/44/1990
- Notes: many very small sections; headings may include TOC, captions, or fragments; largest section is much bigger than the median section

## Boundary Confidence

- Start: medium
- End: medium
- Missing Project Gutenberg end marker; footer text was not destructively stripped.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
