# dr-jekyll-and-mr-hyde

- Source: `app/client/assets/temp-books/Dr. Jekyll and Mr. Hyde.txt`
- Title: The strange case of Dr. Jekyll and Mr. Hyde
- Author: Robert Louis Stevenson
- Raw words: 29054
- Detected convention: story or titled-section headings
- Confidence: high (0.901)
- Recommended handling: needs manual sectioning review
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| all-caps-title | 23 | 12 | 11 | yes |  |
| isolated-title-case | 11 | 11 | 0 | no | weaker than selected strategy all-caps-title |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L257: SEARCH FOR MR. HYDE
- L560: DR. JEKYLL WAS QUITE AT EASE
- L647: THE CAREW MURDER CASE
- L807: INCIDENT OF THE LETTER
- L994: INCIDENT OF DR. LANYON
- L1132: INCIDENT AT THE WINDOW
- L1196: THE LAST NIGHT
- L1662: “HENRY JEKYLL.”

## Rejected TOC-like Examples

- L9: STORY OF THE DOOR
- L11: SEARCH FOR MR. HYDE
- L13: DR. JEKYLL WAS QUITE AT EASE
- L15: THE CAREW MURDER CASE
- L17: INCIDENT OF THE LETTER
- L19: INCIDENT OF DR. LANYON
- L21: INCIDENT AT THE WINDOW
- L23: THE LAST NIGHT

## Section Size Sanity

- Sections: 12
- Min/median/max words: 2/1652/6963
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- Manifest: `app/client/assets/books/generated/dr-jekyll-and-mr-hyde/manifest.json`
- Sections: 6
- Included sections: 0
- No chapter headings were detected; generated fallback parts instead.
- existing generated first preview may include source, title-page, or TOC junk

## Red Flags

- generated output may include source/license/TOC/footer junk
