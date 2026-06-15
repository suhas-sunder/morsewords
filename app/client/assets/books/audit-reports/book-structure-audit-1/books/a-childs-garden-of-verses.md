# a-childs-garden-of-verses

- Source: `app/client/assets/temp-books/a-childs-garden-of-verses.txt`
- Title: A Child's Garden of Verses
- Author: Robert Louis Stevenson
- Raw words: 12226
- Detected convention: isolated titled sections
- Confidence: high (0.831)
- Recommended handling: needs manual sectioning review
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| isolated-title-case | 149 | 124 | 25 | yes |  |
| all-caps-title | 226 | 123 | 102 | no | not selected because another strategy better spans the readable body |
| arabic-only | 2 | 2 | 0 | no | weaker than selected strategy isolated-title-case |
| arabic-numbered-title | 3 | 0 | 3 | no | rejected as TOC-like or front-matter-only evidence |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L485: [Illustration: FOREIGN LANDS]
- L503: Where the Great Wall round China goes,
- L520: [Illustration]
- L541: [Illustration]
- L557: [Illustration]
- L589: [Illustration]
- L591: [Illustration]
- L617: [Illustration]

## Rejected TOC-like Examples

- L5: Child's
- L6: Garden
- L12: Jessie Willcox Smith_
- L17: Copyright, 1905, By CHARLES SCRIBNER'S SONS
- L19: Printed in the United States of America
- L23: permission of Charles Scribner's Sons
- L27: Reset March 1955
- L29: [Illustration]

## Section Size Sanity

- Sections: 124
- Min/median/max words: 1/26/285
- Notes: many very small sections; headings may include TOC, captions, or fragments; largest section is much bigger than the median section

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- Manifest: `app/client/assets/books/generated/a-childs-garden-of-verses/manifest.json`
- Sections: 3
- Included sections: 0
- No chapter headings were detected; generated fallback parts instead.
- Rights have not been reviewed; generated book is not publish-ready.
- Rights basis "unknown" is not publish-ready.
- Rights gate status is reject; generated book is not publish-ready.
- Rights gate did not allow processed public story output.
- Owner-reviewed website approval is missing.
- Website publication is not allowed by the active approval path.
- existing generated output section count is far below likely raw body heading count (3 vs 124)

## Red Flags

- generated output likely collapsed real structure
