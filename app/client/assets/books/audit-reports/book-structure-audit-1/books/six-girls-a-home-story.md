# six-girls-a-home-story

- Source: `app/client/assets/temp-books/Six Girls - A Home Story.txt`
- Title: Six Girls: A Home Story
- Author: Fannie Belle Irving
- Raw words: 108150
- Detected convention: chapter-based roman numerals
- Confidence: high (0.95)
- Recommended handling: safe for normal processing
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 25 | 25 | 0 | yes |  |
| all-caps-title | 62 | 49 | 10 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 62 | 59 | 3 | no | weaker than selected strategy chapter-roman |
| roman-numbered-title | 26 | 2 | 22 | no | weaker than selected strategy chapter-roman |

## Body Heading Examples

- L111: CHAPTER I.
- L402: CHAPTER II.
- L934: CHAPTER III.
- L1279: CHAPTER IV.
- L1658: CHAPTER V.
- L2081: CHAPTER VI.
- L2522: CHAPTER VII.
- L2932: CHAPTER VIII.

## Rejected TOC-like Examples

- L7: SIX GIRLS
- L12: FANNIE BELLE IRVING
- L14: ILLUSTRATED BY F. T. MERRILL
- L16: BOSTON
- L17: DANA ESTES AND COMPANY
- L18: PUBLISHERS
- L47: ELSE 97
- L96: KAT AND KIT 49
- L21: _Copyright, 1882_,
- L432: "Olive?"

## Section Size Sanity

- Sections: 25
- Min/median/max words: 2454/4015/7273
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
