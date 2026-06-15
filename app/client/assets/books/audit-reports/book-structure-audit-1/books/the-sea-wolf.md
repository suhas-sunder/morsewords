# the-sea-wolf

- Source: `app/client/assets/temp-books/the sea-wolf.txt`
- Title: The Sea-Wolf
- Author: Jack London
- Raw words: 110235
- Detected convention: chapter-based roman numerals
- Confidence: high (0.95)
- Recommended handling: safe for normal processing
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 39 | 39 | 0 | yes |  |
| all-caps-title | 11 | 4 | 7 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 32 | 31 | 1 | no | weaker than selected strategy chapter-roman |
| roman-numbered-title | 2 | 2 | 0 | no | weaker than selected strategy chapter-roman |
| arabic-only | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L35: CHAPTER I
- L330: CHAPTER II
- L621: CHAPTER III
- L1116: CHAPTER IV
- L1356: CHAPTER V
- L1650: CHAPTER VI
- L2149: CHAPTER VII
- L2281: CHAPTER VIII

## Rejected TOC-like Examples

- L5: JACK LONDON
- L7: AUTHOR OF
- L8: “THE CALL OF THE WILD,” “THE FAITH OF MEN,”
- L9: ETC.
- L13: _POPULAR EDITION_.
- L17: LONDON
- L18: WILLIAM HEINEMANN
- L1003: “Van Weyden, sir.”
- L19: 1917

## Section Size Sanity

- Sections: 39
- Min/median/max words: 1026/2632/5382
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- Manifest: `app/client/assets/books/generated/the-sea-wolf/manifest.json`
- Sections: 40
- Included sections: 39
- No generated comparison warnings.

## Red Flags

- None.
