# the-federalist-papers

- Source: `app/client/assets/temp-books/The Federalist Papers.txt`
- Title: The Federalist Papers
- Author: Alexander Hamilton
- Raw words: 199722
- Detected convention: story or titled-section headings
- Confidence: high (0.831)
- Recommended handling: needs manual sectioning review
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| all-caps-title | 368 | 294 | 74 | yes |  |
| roman-numbered-title | 5 | 5 | 0 | no | weaker than selected strategy all-caps-title |
| isolated-title-case | 265 | 216 | 49 | no | weaker than selected strategy all-caps-title |
| arabic-numbered-title | 2 | 2 | 0 | no | weaker than selected strategy all-caps-title |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L440: LONG FAREWELL TO ALL MY GREATNESS.”
- L825: UTMOST ENDEAVORS TO PREVENT OR DELAY THIS UNION.”
- L903: TO EACH OTHER.
- L1209: No. VII.
- L1328: THINGS WHICH WERE IN REALITY THE JUSTIFIABLE ACTS OF INDEPENDENT
- L2666: No. XIII.
- L3502: No. XVII.
- L3679: No. XVIII.

## Rejected TOC-like Examples

- L96: THE FEDERALIST.
- L103: HAMILTON
- L227: THE UTILITY OF THE UNION TO YOUR POLITICAL PROSPERITY
- L229: THE INSUFFICIENCY OF THE PRESENT CONFEDERATION TO PRESERVE THAT UNION
- L230: THE NECESSITY OF A GOVERNMENT AT LEAST EQUALLY ENERGETIC WITH THE ONE
- L231: PROPOSED, TO THE ATTAINMENT OF THIS OBJECT THE CONFORMITY OF THE
- L232: PROPOSED CONSTITUTION TO THE TRUE PRINCIPLES OF REPUBLICAN GOVERNMENT
- L233: ITS ANALOGY TO YOUR OWN STATE CONSTITUTION and lastly, THE ADDITIONAL

## Section Size Sanity

- Sections: 294
- Min/median/max words: 1/18/13027
- Notes: many very small sections; headings may include TOC, captions, or fragments; largest section is much bigger than the median section

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- Manifest: `app/client/assets/books/generated/the-federalist-papers/manifest.json`
- Sections: 42
- Included sections: 0
- No chapter headings were detected; generated fallback parts instead.
- Rights have not been reviewed; generated book is not publish-ready.
- Rights basis "unknown" is not publish-ready.
- Rights gate status is needs_manual_review; generated book is not publish-ready.
- Rights gate did not allow processed public story output.
- Owner-reviewed website approval is missing.
- Website publication is not allowed by the active approval path.
- existing generated output section count is far below likely raw body heading count (42 vs 294)
- existing generated first preview may include source, title-page, or TOC junk

## Red Flags

- body headings were found but rejected by the selected strategy
- generated output likely collapsed real structure
- generated output may include source/license/TOC/footer junk
