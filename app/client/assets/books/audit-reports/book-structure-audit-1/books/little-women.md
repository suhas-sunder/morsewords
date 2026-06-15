# little-women

- Source: `app/client/assets/temp-books/Little Women.txt`
- Title: Little Women; Or, Meg, Jo, Beth, and Amy
- Author: Louisa May Alcott
- Raw words: 196184
- Detected convention: standalone roman numeral sections
- Confidence: high (0.95)
- Recommended handling: safe for normal processing
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| roman-only | 47 | 47 | 0 | yes |  |
| all-caps-title | 143 | 134 | 9 | no | weaker than selected strategy roman-only |
| isolated-title-case | 230 | 169 | 60 | no | weaker than selected strategy roman-only |
| arabic-numbered-title | 18 | 18 | 0 | no | weaker than selected strategy roman-only |
| act-prefixed | 3 | 3 | 0 | no | weaker than selected strategy roman-only |
| roman-numbered-title | 47 | 2 | 45 | no | weaker than selected strategy roman-only |
| part-division | 2 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |
| special-front-back | 2 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L605: I.
- L1086: II.
- L1543: III.
- L2043: IV.
- L2520: V.
- L3065: VI.
- L3355: VII.
- L3665: VIII.

## Rejected TOC-like Examples

- L3: LOUISA M. ALCOTT]
- L14: LITTLE WOMEN
- L20: LOUISA M. ALCOTT
- L22: AUTHOR OF "LITTLE MEN," "AN OLD-FASHIONED GIRL"
- L32: LITTLE, BROWN, AND COMPANY
- L36: LOUISA M. ALCOTT,
- L42: BY LOUISA M. ALCOTT.
- L76: CHAPTER
- L16: Meg, Jo, Beth, and Amy
- L41: _Copyright, 1880_,

## Section Size Sanity

- Sections: 47
- Min/median/max words: 1936/4101/7439
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- Manifest: `app/client/assets/books/generated/little-women/manifest.json`
- Sections: 37
- Included sections: 0
- No chapter headings were detected; generated fallback parts instead.
- Rights have not been reviewed; generated book is not publish-ready.
- Rights basis "unknown" is not publish-ready.
- Rights gate status is needs_manual_review; generated book is not publish-ready.
- Rights gate did not allow processed public story output.
- Owner-reviewed website approval is missing.
- Website publication is not allowed by the active approval path.

## Red Flags

- None.
