# the-private-memoirs-and-confessions-of-a-justified-sinner

- Source: `app/client/assets/temp-books/The Private Memoirs and Confessions of a Justified Sinner.txt`
- Title: The Private Memoirs and Confessions of a Justified Sinner
- Author: James Hogg
- Raw words: 87332
- Detected convention: story or titled-section headings
- Confidence: high (0.831)
- Recommended handling: needs manual sectioning review
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| all-caps-title | 14 | 8 | 6 | yes |  |
| isolated-title-case | 9 | 9 | 0 | no | weaker than selected strategy all-caps-title |
| roman-numbered-title | 1 | 1 | 0 | no | weaker than selected strategy all-caps-title |

## Body Heading Examples

- L19: THE EDITOR'S NARRATIVE
- L2947: WRITTEN BY HIMSELF
- L2950: PRIVATE MEMOIRS AND CONFESSIONS OF A SINNER
- L7384: END OF THE MEMOIR
- L7767: THE PRIVATE MEMOIRS
- L7768: AND CONFESSIONS
- L7769: OF A JUSTIFIED SINNER:
- L7771: WRITTEN BY HIMSELF

## Rejected TOC-like Examples

- L4: THE PRIVATE MEMOIRS
- L5: AND CONFESSIONS
- L6: OF A JUSTIFIED SINNER
- L8: WRITTEN BY HIMSELF
- L10: WITH A DETAIL OF CURIOUS TRADITIONARY FACTS, AND
- L11: OTHER EVIDENCE, BY THE EDITOR

## Section Size Sanity

- Sections: 8
- Min/median/max words: 2/532/48813
- Notes: 2 section(s) exceed 18000 words; many very small sections; headings may include TOC, captions, or fragments; largest section is much bigger than the median section

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- long book has huge sections despite detected headings
