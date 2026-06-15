# the-princess-and-the-goblin

- Source: `app/client/assets/temp-books/the-princess-and-the-goblin.txt`
- Title: The Princess and the Goblin
- Author: George MacDonald
- Raw words: 54402
- Detected convention: chapter-based arabic numbers
- Confidence: high (0.964)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-arabic | 32 | 31 | 1 | yes |  |
| isolated-title-case | 50 | 47 | 3 | no | weaker than selected strategy chapter-arabic |
| arabic-numbered-title | 32 | 0 | 32 | no | rejected as TOC-like or front-matter-only evidence |
| all-caps-title | 2 | 0 | 0 | no | no convincing body headings for this pattern |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L125: CHAPTER 2
- L203: CHAPTER 3
- L474: CHAPTER 4
- L642: CHAPTER 5
- L732: CHAPTER 6
- L1189: CHAPTER 7
- L1319: CHAPTER 8
- L1619: CHAPTER 9

## Rejected TOC-like Examples

- L46: CHAPTER 1

## Section Size Sanity

- Sections: 31
- Min/median/max words: 344/1465/3402
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- Manifest: `app/client/assets/books/generated/the-princess-and-the-goblin/manifest.json`
- Sections: 34
- Included sections: 32
- No generated comparison warnings.

## Red Flags

- None.
