# the-art-of-war

- Source: `app/client/assets/temp-books/The Art of War.txt`
- Title: The Art of War
- Author: active 6th century B.C. Sunzi
- Raw words: 59346
- Detected convention: chapter-based roman numerals
- Confidence: high (1)
- Recommended handling: needs manual sectioning review
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 25 | 13 | 12 | yes |  |
| arabic-numbered-title | 473 | 473 | 0 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 42 | 32 | 10 | no | weaker than selected strategy chapter-roman |
| all-caps-title | 5 | 3 | 2 | no | weaker than selected strategy chapter-roman |
| roman-numbered-title | 5 | 5 | 0 | no | weaker than selected strategy chapter-roman |
| special-front-back | 3 | 1 | 2 | no | weaker than selected strategy chapter-roman |
| arabic-only | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L1572: Chapter I. LAYING PLANS
- L1795: Chapter II. WAGING WAR
- L1995: Chapter III. ATTACK BY STRATAGEM
- L2295: Chapter IV. TACTICAL DISPOSITIONS
- L2504: Chapter V. ENERGY
- L2791: Chapter VI. WEAK POINTS AND STRONG
- L3145: Chapter VII. MANŒUVERING
- L3592: Chapter VIII. VARIATION OF TACTICS

## Rejected TOC-like Examples

- L40: Chapter I. Laying plans
- L41: Chapter II. Waging War
- L42: Chapter III. Attack by Stratagem
- L43: Chapter IV. Tactical Dispositions
- L44: Chapter V. Energy
- L45: Chapter VI. Weak Points and Strong
- L47: Chapter VIII. Variation of Tactics
- L48: Chapter IX. The Army on the March

## Section Size Sanity

- Sections: 13
- Min/median/max words: 1498/2471/9771
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- Manifest: `app/client/assets/books/generated/the-art-of-war/manifest.json`
- Sections: 17
- Included sections: 13
- Rights have not been reviewed; generated book is not publish-ready.
- Rights basis "unknown" is not publish-ready.
- Rights gate status is needs_manual_review; generated book is not publish-ready.
- Rights gate did not allow processed public story output.
- Owner-reviewed website approval is missing.
- Website publication is not allowed by the active approval path.

## Red Flags

- body headings were found but rejected by the selected strategy
