# moby-dick

- Source: `app/client/assets/temp-books/Moby Dick.txt`
- Title: Moby Dick; Or, The Whale
- Author: Herman Melville
- Raw words: 220105
- Detected convention: chapter-based arabic numbers with book divisions
- Confidence: high (1)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-arabic | 270 | 135 | 135 | yes |  |
| all-caps-title | 10 | 9 | 1 | no | weaker than selected strategy chapter-arabic |
| roman-numbered-title | 6 | 6 | 0 | no | weaker than selected strategy chapter-arabic |
| isolated-title-case | 75 | 75 | 0 | no | weaker than selected strategy chapter-arabic |
| book-division | 14 | 14 | 0 | no | weaker than selected strategy chapter-arabic |
| arabic-only | 4 | 4 | 0 | no | weaker than selected strategy chapter-arabic |
| special-front-back | 3 | 1 | 2 | no | weaker than selected strategy chapter-arabic |

## Body Heading Examples

- L790: CHAPTER 1. Loomings.
- L991: CHAPTER 2. The Carpet-Bag.
- L1125: CHAPTER 3. The Spouter-Inn.
- L1695: CHAPTER 4. The Counterpane.
- L1839: CHAPTER 5. Breakfast.
- L1917: CHAPTER 6. The Street.
- L2002: CHAPTER 7. The Chapel.
- L2096: CHAPTER 8. The Pulpit.

## Rejected TOC-like Examples

- L14: CHAPTER 1. Loomings.
- L16: CHAPTER 2. The Carpet-Bag.
- L18: CHAPTER 3. The Spouter-Inn.
- L20: CHAPTER 4. The Counterpane.
- L22: CHAPTER 5. Breakfast.
- L24: CHAPTER 6. The Street.
- L26: CHAPTER 7. The Chapel.
- L28: CHAPTER 8. The Pulpit.

## Section Size Sanity

- Sections: 135
- Min/median/max words: 55/1225/8031
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
