# goblin-tales-of-lancashire

- Source: `app/client/assets/temp-books/Goblin Tales of Lancashire.txt`
- Title: Goblin Tales of Lancashire
- Author: James Bowker
- Raw words: 54768
- Detected convention: story or titled-section headings
- Confidence: high (0.901)
- Recommended handling: needs manual sectioning review
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| all-caps-title | 82 | 40 | 42 | yes |  |
| arabic-only | 34 | 34 | 0 | no | weaker than selected strategy all-caps-title |
| roman-only | 17 | 17 | 0 | no | weaker than selected strategy all-caps-title |
| isolated-title-case | 34 | 34 | 0 | no | weaker than selected strategy all-caps-title |
| roman-numbered-title | 1 | 1 | 0 | no | weaker than selected strategy all-caps-title |

## Body Heading Examples

- L21: SPENSER
- L30: W. SWAN SONNENSCHEIN & CO.
- L330: GOBLIN TALES OF LANCASHIRE.
- L333: TH' SKRIKER (SHRIEKER).
- L513: THE UNBIDDEN GUEST.
- L785: THE FAIRY'S SPADE.
- L818: THE KING OF THE FAIRIES.
- L947: MOTHER AND CHILD.

## Rejected TOC-like Examples

- L6: GOBLIN TALES OF LANCASHIRE.
- L8: BY JAMES BOWKER, F.R.G.S.I.
- L11: AUTHOR OF 'PHOEBE CAREW, A NORTH COAST STORY,'
- L12: 'NAT HOLT'S FORTUNE,' ETC.
- L14: _WITH ILLUSTRATIONS FROM DRAWINGS
- L15: BY THE LATE CHARLES GLIDDON._
- L31: PATERNOSTER ROW
- L36: THE MOST NOBLE

## Section Size Sanity

- Sections: 40
- Min/median/max words: 1/1019/8873
- Notes: largest section is much bigger than the median section

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- TOC/body confusion is likely
