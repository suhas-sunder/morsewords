# the-book-of-dragons

- Source: `app/client/assets/temp-books/the-book-of-dragons.txt`
- Title: The Book of Dragons
- Author: E. Nesbit
- Raw words: 45792
- Detected convention: roman-numbered titled sections
- Confidence: high (1)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| roman-numbered-title | 16 | 8 | 8 | yes |  |
| all-caps-title | 7 | 5 | 2 | no | weaker than selected strategy roman-numbered-title |
| isolated-title-case | 43 | 20 | 23 | no | weaker than selected strategy roman-numbered-title |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L121: I. The Book of Beasts
- L649: II. Uncle James, or The Purple Stranger
- L1202: III. The Deliverers of Their Country
- L1725: IV. The Ice Dragon, or Do as You Are Told
- L2423: V. The Island of the Nine Whirlpools
- L3014: VI. The Dragon Tamers
- L3633: VII. The Fiery Dragon,
- L4235: VIII. Kind Little Edmund, or The Caves and the Cockatrice

## Rejected TOC-like Examples

- L25: I. The Book of Beasts 1
- L27: II. Uncle James, or The Purple Stranger 19
- L29: III. The Deliverers of Their Country 39
- L31: IV. The Ice Dragon, or Do as You Are Told 57
- L33: V. The Island of the Nine Whirlpools 79
- L35: VI. The Dragon Tamers 99
- L37: VII. The Fiery Dragon, or The Heart of Stone
- L40: VIII. Kind Little Edmund, or The Caves and the

## Section Size Sanity

- Sections: 8
- Min/median/max words: 4758/5251/6173
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- Manifest: `app/client/assets/books/generated/the-book-of-dragons/manifest.json`
- Sections: 9
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
