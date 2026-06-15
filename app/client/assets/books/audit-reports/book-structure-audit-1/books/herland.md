# herland

- Source: `app/client/assets/temp-books/Herland.txt`
- Title: Herland
- Author: Charlotte Perkins Gilman
- Raw words: 53436
- Detected convention: chapter-based arabic numbers
- Confidence: high (0.95)
- Recommended handling: safe for normal processing
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-arabic | 12 | 12 | 0 | yes |  |
| isolated-title-case | 22 | 22 | 0 | no | weaker than selected strategy chapter-arabic |
| all-caps-title | 1 | 1 | 0 | no | weaker than selected strategy chapter-arabic |

## Body Heading Examples

- L6: CHAPTER 1.
- L555: CHAPTER 2.
- L1037: CHAPTER 3.
- L1612: CHAPTER 4.
- L2143: CHAPTER 5.
- L2688: CHAPTER 6.
- L3163: CHAPTER 7.
- L3648: CHAPTER 8.

## Rejected TOC-like Examples

- None.

## Section Size Sanity

- Sections: 12
- Min/median/max words: 3988/4542/4860
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: medium
- End: medium
- Missing Project Gutenberg end marker; footer text was not destructively stripped.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
