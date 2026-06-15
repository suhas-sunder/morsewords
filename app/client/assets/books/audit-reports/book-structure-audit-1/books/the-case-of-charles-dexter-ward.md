# the-case-of-charles-dexter-ward

- Source: `app/client/assets/temp-books/The case of Charles Dexter Ward.txt`
- Title: The case of Charles Dexter Ward
- Author: H. P. Lovecraft
- Raw words: 47937
- Detected convention: story or titled-section headings
- Confidence: high (0.781)
- Recommended handling: needs manual sectioning review
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| all-caps-title | 25 | 25 | 0 | yes |  |
| isolated-title-case | 56 | 56 | 0 | no | weaker than selected strategy all-caps-title |
| roman-numbered-title | 2 | 2 | 0 | no | weaker than selected strategy all-caps-title |

## Body Heading Examples

- L3: By H. P. LOVECRAFT
- L22: TALES.
- L41: BORELLUS.
- L1956: MIES JESCHET BOENE DOESEF DOUVEMA ENITEMAUS."
- L3276: Y'AI 'NG'NGAH,
- L3277: _YOG-SOTHOTH_
- L3278: H'EE----L'GEB
- L3279: F'AI THRODOG

## Rejected TOC-like Examples

- None.

## Section Size Sanity

- Sections: 25
- Min/median/max words: 1/2/19266
- Notes: 1 section(s) exceed 18000 words; many very small sections; headings may include TOC, captions, or fragments; largest section is much bigger than the median section

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- long book has huge sections despite detected headings
