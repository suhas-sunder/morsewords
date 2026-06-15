# the-adventures-of-pinocchio

- Source: `app/client/assets/temp-books/The Adventures of Pinocchio.txt`
- Title: The Adventures of Pinocchio
- Author: Carlo Collodi
- Raw words: 43553
- Detected convention: chapter-based arabic numbers
- Confidence: high (0.95)
- Recommended handling: safe for normal processing
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-arabic | 36 | 36 | 0 | yes |  |
| all-caps-title | 15 | 15 | 0 | no | weaker than selected strategy chapter-arabic |
| isolated-title-case | 73 | 67 | 6 | no | weaker than selected strategy chapter-arabic |

## Body Heading Examples

- L14: CHAPTER 1
- L102: CHAPTER 2
- L236: CHAPTER 3
- L380: CHAPTER 4
- L477: CHAPTER 5
- L550: CHAPTER 6
- L613: CHAPTER 7
- L730: CHAPTER 8

## Rejected TOC-like Examples

- L163: “No!”
- L165: “Yes!”
- L167: “No!”
- L169: “Yes!”
- L462: “Why?”
- L1187: “Why?”

## Section Size Sanity

- Sections: 36
- Min/median/max words: 441/929/2909
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
