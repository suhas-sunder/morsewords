# twenty-years-after

- Source: `app/client/assets/temp-books/Twenty years after.txt`
- Title: Twenty years after
- Author: Alexandre Dumas
- Raw words: 249862
- Detected convention: chapter-based roman numerals
- Confidence: high (0.959)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 180 | 91 | 87 | yes |  |
| isolated-title-case | 391 | 354 | 35 | no | weaker than selected strategy chapter-roman |
| roman-numbered-title | 5 | 5 | 0 | no | weaker than selected strategy chapter-roman |
| all-caps-title | 2 | 2 | 0 | no | weaker than selected strategy chapter-roman |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L118: Chapter XC. Conclusion.
- L121: Chapter I.
- L536: Chapter II.
- L935: Chapter III.
- L1617: Chapter IV.
- L2074: Chapter V.
- L2343: Chapter VI.
- L2923: Chapter VII.

## Rejected TOC-like Examples

- L29: Chapter I. The Shade of Cardinal Richelieu.
- L30: Chapter II. A Nightly Patrol.
- L31: Chapter III. Dead Animosities.
- L32: Chapter IV. Anne of Austria at the Age of Forty-six.
- L33: Chapter V. The Gascon and the Italian.
- L34: Chapter VI. D’Artagnan in his Fortieth Year.
- L35: Chapter VII. Touches upon the Strange Effects a Half-pistole may have.
- L36: Chapter VIII. D’Artagnan, Going to a Distance to discover Aramis.

## Section Size Sanity

- Sections: 91
- Min/median/max words: 3/2534/5969
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
