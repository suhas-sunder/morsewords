# the-call-of-cthulhu

- Source: `app/client/assets/temp-books/The call of Cthulhu.txt`
- Title: The call of Cthulhu
- Author: H. P. Lovecraft
- Raw words: 15125
- Detected convention: isolated titled sections
- Confidence: medium (0.651)
- Recommended handling: needs manual sectioning review
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| isolated-title-case | 16 | 16 | 0 | yes |  |
| all-caps-title | 2 | 2 | 0 | no | weaker than selected strategy isolated-title-case |
| roman-numbered-title | 1 | 1 | 0 | no | weaker than selected strategy isolated-title-case |

## Body Heading Examples

- L1: The CALL of CTHULHU
- L19: --_Algernon Blackwood._
- L26: Thurston, of Boston.]
- L29: _1. The Horror in Clay._
- L56: of my grand-uncle, George Gammell Angell, Professor Emeritus of Semitic
- L57: languages in Brown University, Providence, Rhode Island. Professor
- L118: the second, "Narrative of Inspector John R. Legrasse, 121 Bienville
- L126: as Frazer's _Golden Bough_ and Miss Murray's _Witch-Cult in Western

## Rejected TOC-like Examples

- None.

## Section Size Sanity

- Sections: 16
- Min/median/max words: 3/211/3986
- Notes: many very small sections; headings may include TOC, captions, or fragments; largest section is much bigger than the median section

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- Manifest: `app/client/assets/books/generated/the-call-of-cthulhu/manifest.json`
- Sections: 4
- Included sections: 0
- No chapter headings were detected; generated fallback parts instead.
- Rights have not been reviewed; generated book is not publish-ready.
- Rights basis "unknown" is not publish-ready.
- Rights gate status is needs_manual_review; generated book is not publish-ready.
- Rights gate did not allow processed public story output.
- Owner-reviewed website approval is missing.
- Website publication is not allowed by the active approval path.
- existing generated output section count is far below likely raw body heading count (4 vs 16)

## Red Flags

- generated output likely collapsed real structure
