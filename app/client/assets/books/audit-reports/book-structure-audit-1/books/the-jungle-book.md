# the-jungle-book

- Source: `app/client/assets/temp-books/The Jungle Book.txt`
- Title: The Jungle Book
- Author: Rudyard Kipling
- Raw words: 54912
- Detected convention: isolated titled sections
- Confidence: high (0.901)
- Recommended handling: needs manual sectioning review
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| isolated-title-case | 66 | 51 | 14 | yes |  |
| all-caps-title | 9 | 8 | 0 | no | weaker than selected strategy isolated-title-case |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L114: Wolf. “It is Man.”
- L347: “Look well--look well, O Wolves!”
- L371: the Free People.”
- L521: Flower.”
- L821: Kaa’s Hunting
- L833: _Maxims of Baloo_
- L894: Brother!”
- L957: Monkey People.”

## Rejected TOC-like Examples

- L8: Mowgli’s Brothers
- L9: Hunting-Song of the Seeonee Pack
- L10: Kaa’s Hunting
- L12: “Tiger! Tiger!”
- L13: Mowgli’s Song
- L14: The White Seal
- L15: Lukannon
- L16: “Rikki-Tikki-Tavi”

## Section Size Sanity

- Sections: 51
- Min/median/max words: 1/366/4688
- Notes: largest section is much bigger than the median section

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- Manifest: `app/client/assets/books/generated/the-jungle-book/manifest.json`
- Sections: 11
- Included sections: 0
- No chapter headings were detected; generated fallback parts instead.
- existing generated output section count is far below likely raw body heading count (11 vs 51)
- existing generated first preview may include source, title-page, or TOC junk

## Red Flags

- generated output likely collapsed real structure
- generated output may include source/license/TOC/footer junk
