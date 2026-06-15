# great-expectations

- Source: `app/client/assets/temp-books/Great Expectations.txt`
- Title: Great Expectations
- Author: Charles Dickens
- Raw words: 121322
- Detected convention: chapter-based roman numerals
- Confidence: high (1)
- Recommended handling: needs manual sectioning review
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 98 | 39 | 59 | yes |  |
| isolated-title-case | 132 | 114 | 15 | no | weaker than selected strategy chapter-roman |
| all-caps-title | 4 | 4 | 0 | no | weaker than selected strategy chapter-roman |
| roman-numbered-title | 2 | 2 | 0 | no | weaker than selected strategy chapter-roman |
| roman-only | 1 | 1 | 0 | no | weaker than selected strategy chapter-roman |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L76: Chapter I.
- L284: Chapter II.
- L645: Chapter III.
- L867: Chapter IV.
- L1216: Chapter V.
- L1647: Chapter VI.
- L1717: Chapter VII.
- L2166: Chapter VIII.

## Rejected TOC-like Examples

- L13: Chapter I.
- L14: Chapter II.
- L15: Chapter III.
- L16: Chapter IV.
- L17: Chapter V.
- L18: Chapter VI.
- L19: Chapter VII.
- L20: Chapter VIII.

## Section Size Sanity

- Sections: 39
- Min/median/max words: 787/2879/5806
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: medium
- End: medium
- Missing Project Gutenberg end marker; footer text was not destructively stripped.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- TOC/body confusion is likely
