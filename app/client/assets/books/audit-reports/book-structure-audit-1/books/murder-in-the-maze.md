# murder-in-the-maze

- Source: `app/client/assets/temp-books/Murder in the Maze.txt`
- Title: Murder in the maze
- Author: J. J. Connington
- Raw words: 76026
- Detected convention: chapter-based roman numerals
- Confidence: high (0.964)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 18 | 17 | 1 | yes |  |
| isolated-title-case | 64 | 60 | 3 | no | weaker than selected strategy chapter-roman |
| all-caps-title | 3 | 3 | 0 | no | weaker than selected strategy chapter-roman |
| roman-numbered-title | 19 | 1 | 18 | no | weaker than selected strategy chapter-roman |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L727: CHAPTER II.
- L1375: CHAPTER III.
- L1779: CHAPTER IV.
- L2235: CHAPTER V.
- L2908: CHAPTER VI.
- L3364: CHAPTER VII.
- L3816: CHAPTER VIII.
- L4205: CHAPTER IX.

## Rejected TOC-like Examples

- L28: CHAPTER I.

## Section Size Sanity

- Sections: 17
- Min/median/max words: 2282/4097/6007
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: medium
- End: medium
- Missing Project Gutenberg end marker; footer text was not destructively stripped.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
