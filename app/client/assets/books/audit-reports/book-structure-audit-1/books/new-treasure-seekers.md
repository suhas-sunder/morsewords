# new-treasure-seekers

- Source: `app/client/assets/temp-books/new-treasure-seekers.txt`
- Title: New Treasure Seekers; Or, The Bastable Children in Search of a Fortune
- Author: E. Nesbit
- Raw words: 72103
- Detected convention: story or titled-section headings
- Confidence: high (0.901)
- Recommended handling: needs manual sectioning review
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| all-caps-title | 129 | 62 | 67 | yes |  |
| isolated-title-case | 53 | 45 | 8 | no | weaker than selected strategy all-caps-title |
| roman-numbered-title | 1 | 1 | 0 | no | weaker than selected strategy all-caps-title |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L14: [Illustration: THE STAIR WAS OF STONE, ARCHED OVERHEAD LIKE CHURCHES.]
- L16: NEW TREASURE SEEKERS
- L45: NEW TREASURE SEEKERS
- L412: "HORACE OCTAVIUS BASTABLE."
- L710: _THE CONSCIENCE-PUDDING_
- L1389: _ARCHIBALD THE UNPLEASANT_
- L1680: [Illustration: SO OSWALD OPENED THE TRAP-DOOR AND SQUINTED DOWN, AND
- L1681: THERE WAS THAT ARCHIBALD.]

## Rejected TOC-like Examples

- L12: NEW TREASURE SEEKERS
- L22: E. NESBIT
- L37: ARTHUR WATTS
- L38: (OSWALD IN PARIS)
- L39: FROM
- L40: E. NESBIT
- L54: PAGE
- L55: THE ROAD TO ROME; OR, THE SILLY STOWAWAY 15

## Section Size Sanity

- Sections: 62
- Min/median/max words: 2/744/5803
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- Manifest: `app/client/assets/books/generated/new-treasure-seekers/manifest.json`
- Sections: 14
- Included sections: 0
- No chapter headings were detected; generated fallback parts instead.
- Rights have not been reviewed; generated book is not publish-ready.
- Rights basis "unknown" is not publish-ready.
- Rights gate status is needs_manual_review; generated book is not publish-ready.
- Rights gate did not allow processed public story output.
- Owner-reviewed website approval is missing.
- Website publication is not allowed by the active approval path.
- existing generated output section count is far below likely raw body heading count (14 vs 62)
- existing generated first preview may include source, title-page, or TOC junk

## Red Flags

- TOC/body confusion is likely
- generated output likely collapsed real structure
- generated output may include source/license/TOC/footer junk
