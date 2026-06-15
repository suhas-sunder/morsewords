# the-sea-lady

- Source: `app/client/assets/temp-books/The Sea Lady.txt`
- Title: The Sea Lady
- Author: Herbert George Wells
- Raw words: 41468
- Detected convention: standalone roman numeral sections
- Confidence: high (0.961)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| roman-only | 39 | 24 | 15 | yes |  |
| all-caps-title | 35 | 22 | 13 | no | weaker than selected strategy roman-only |
| isolated-title-case | 97 | 91 | 6 | no | weaker than selected strategy roman-only |
| arabic-only | 16 | 0 | 16 | no | rejected as TOC-like or front-matter-only evidence |
| roman-numbered-title | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L522: I
- L597: II
- L653: III
- L716: I
- L724: II
- L763: III
- L794: I
- L903: II

## Rejected TOC-like Examples

- L44: I.
- L47: II.
- L50: III.
- L53: IV.
- L56: V.
- L59: VI.
- L62: VII.
- L65: VIII.

## Section Size Sanity

- Sections: 24
- Min/median/max words: 221/1122/2954
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: medium
- End: medium
- Missing Project Gutenberg end marker; footer text was not destructively stripped.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
