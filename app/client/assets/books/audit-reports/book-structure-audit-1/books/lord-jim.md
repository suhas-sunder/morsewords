# lord-jim

- Source: `app/client/assets/temp-books/Lord Jim.txt`
- Title: Lord Jim
- Author: Joseph Conrad
- Raw words: 134775
- Detected convention: chapter-based arabic numbers
- Confidence: high (0.95)
- Recommended handling: safe for normal processing
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-arabic | 45 | 45 | 0 | yes |  |
| all-caps-title | 5 | 4 | 1 | no | weaker than selected strategy chapter-arabic |
| isolated-title-case | 6 | 6 | 0 | no | weaker than selected strategy chapter-arabic |
| arabic-only | 1 | 1 | 0 | no | weaker than selected strategy chapter-arabic |
| roman-numbered-title | 1 | 1 | 0 | no | weaker than selected strategy chapter-arabic |

## Body Heading Examples

- L88: CHAPTER 1
- L274: CHAPTER 2
- L468: CHAPTER 3
- L746: CHAPTER 4
- L912: CHAPTER 5
- L1492: CHAPTER 6
- L2056: CHAPTER 7
- L2389: CHAPTER 8

## Rejected TOC-like Examples

- L1: LORD JIM

## Section Size Sanity

- Sections: 45
- Min/median/max words: 1325/2569/7244
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
