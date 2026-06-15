# the-elements-of-style

- Source: `app/client/assets/temp-books/The Elements of Style.txt`
- Title: The Elements of Style
- Author: William Strunk
- Raw words: 17083
- Detected convention: roman-numbered titled sections
- Confidence: high (0.903)
- Recommended handling: needs manual sectioning review
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| roman-numbered-title | 23 | 20 | 2 | yes |  |
| arabic-numbered-title | 61 | 45 | 1 | no | weaker than selected strategy roman-numbered-title |
| all-caps-title | 12 | 3 | 8 | no | weaker than selected strategy roman-numbered-title |
| isolated-title-case | 31 | 30 | 1 | no | weaker than selected strategy roman-numbered-title |
| chapter-roman | 1 | 1 | 0 | no | weaker than selected strategy roman-numbered-title |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L96: IV. A Few Matters of Form 33
- L98: V. Words and Expressions Commonly Misused 36
- L100: VI. Spelling 48
- L102: VII. Exercises on Chapters II and III 50
- L105: I. INTRODUCTORY
- L157: II. ELEMENTARY RULES OF USAGE
- L503: III. ELEMENTARY PRINCIPLES OF COMPOSITION
- L535: C. Subject.

## Rejected TOC-like Examples

- L49: I. Introductory 5
- L51: II. Elementary Rules of Usage 7

## Section Size Sanity

- Sections: 20
- Min/median/max words: 2/153/5117
- Notes: many very small sections; headings may include TOC, captions, or fragments; largest section is much bigger than the median section

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- Manifest: `app/client/assets/books/generated/the-elements-of-style/manifest.json`
- Sections: 4
- Included sections: 0
- No chapter headings were detected; generated fallback parts instead.
- Rights have not been reviewed; generated book is not publish-ready.
- Rights basis "unknown" is not publish-ready.
- Rights gate status is needs_manual_review; generated book is not publish-ready.
- Rights gate did not allow processed public story output.
- Owner-reviewed website approval is missing.
- Website publication is not allowed by the active approval path.
- existing generated output section count is far below likely raw body heading count (4 vs 20)

## Red Flags

- body headings were found but rejected by the selected strategy
- generated output likely collapsed real structure
