# the-adventures-of-tom-sawyer

- Source: `app/client/assets/temp-books/The Adventures of Tom Sawyer.txt`
- Title: The Adventures of Tom Sawyer, Complete
- Author: Mark Twain
- Raw words: 77052
- Detected convention: chapter-based roman numerals
- Confidence: high (1)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 70 | 35 | 35 | yes |  |
| all-caps-title | 10 | 7 | 1 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 254 | 80 | 172 | no | weaker than selected strategy chapter-roman |
| special-front-back | 2 | 1 | 1 | no | weaker than selected strategy chapter-roman |
| roman-numbered-title | 1 | 1 | 0 | no | weaker than selected strategy chapter-roman |

## Body Heading Examples

- L452: CHAPTER I
- L806: CHAPTER II
- L1027: CHAPTER III
- L1245: CHAPTER IV
- L1609: CHAPTER V
- L1783: CHAPTER VI
- L2292: CHAPTER VII
- L2554: CHAPTER VIII

## Rejected TOC-like Examples

- L12: CHAPTER I. Y-o-u-u Tom—Aunt Polly Decides Upon her Duty—Tom Practices
- L15: CHAPTER II. Strong Temptations—Strategic Movements—The Innocents
- L18: CHAPTER III. Tom as a General—Triumph and Reward—Dismal
- L21: CHAPTER IV. Mental Acrobatics—Attending Sunday—School—The
- L24: CHAPTER V. A Useful Minister—In Church—The Climax
- L26: CHAPTER VI. Self-Examination—Dentistry—The Midnight Charm—Witches and
- L29: CHAPTER VII. A Treaty Entered Into—Early Lessons—A Mistake Made
- L31: CHAPTER VIII. Tom Decides on his Course—Old Scenes Re-enacted

## Section Size Sanity

- Sections: 35
- Min/median/max words: 419/2023/3666
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
