# the-leavenworth-case

- Source: `app/client/assets/temp-books/The Leavenworth Case.txt`
- Title: The Leavenworth Case
- Author: Anna Katharine Green
- Raw words: 115365
- Detected convention: roman-numbered titled sections with book divisions
- Confidence: high (0.948)
- Recommended handling: needs manual sectioning review
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| roman-numbered-title | 83 | 46 | 37 | yes |  |
| book-division | 8 | 4 | 4 | no | weaker than selected strategy roman-numbered-title |
| all-caps-title | 33 | 28 | 5 | no | weaker than selected strategy roman-numbered-title |
| arabic-numbered-title | 14 | 14 | 0 | no | weaker than selected strategy roman-numbered-title |
| isolated-title-case | 158 | 152 | 6 | no | weaker than selected strategy roman-numbered-title |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L109: XXXVII. CULMINATION 373
- L111: XXXVIII. A FULL CONFESSION 384
- L113: XXXIX. THE OUTCOME OF A GREAT CRIME 405
- L156: I. “A GREAT CASE”
- L479: II. THE CORONER’S INQUEST
- L632: III. FACTS AND DEDUCTIONS
- L1402: IV. A CLUE.
- L1952: VI. SIDE-LIGHTS

## Rejected TOC-like Examples

- L22: I. “A GREAT CASE” 1
- L24: II. THE CORONER’S INQUEST 11
- L26: III. FACTS AND DEDUCTIONS 17
- L28: IV. A CLUE 36
- L30: V. EXPERT TESTIMONY 43
- L32: VI. SIDE-LIGHTS 51
- L34: VII. MARY LEAVENWORTH 57
- L36: VIII. CIRCUMSTANTIAL EVIDENCE 65

## Section Size Sanity

- Sections: 46
- Min/median/max words: 3/2334/6869
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- body headings were found but rejected by the selected strategy
