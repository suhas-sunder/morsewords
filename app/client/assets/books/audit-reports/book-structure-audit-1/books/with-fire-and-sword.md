# with-fire-and-sword

- Source: `app/client/assets/temp-books/With Fire and Sword.txt`
- Title: With Fire and Sword: An Historical Novel of Poland and Russia
- Author: Henryk Sienkiewicz
- Raw words: 311381
- Detected convention: chapter-based roman numerals
- Confidence: high (0.95)
- Recommended handling: safe for normal processing
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 63 | 63 | 0 | yes |  |
| all-caps-title | 33 | 18 | 13 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 291 | 273 | 17 | no | weaker than selected strategy chapter-roman |
| arabic-numbered-title | 2 | 2 | 0 | no | weaker than selected strategy chapter-roman |
| arabic-only | 1 | 1 | 0 | no | weaker than selected strategy chapter-roman |

## Body Heading Examples

- L654: CHAPTER I.
- L1190: CHAPTER II.
- L1881: CHAPTER III.
- L2643: CHAPTER IV.
- L3509: CHAPTER V.
- L4244: CHAPTER VI.
- L4530: CHAPTER VII.
- L4779: CHAPTER VIII.

## Rejected TOC-like Examples

- L14: WITH FIRE AND SWORD.
- L18: HENRYK SIENKIKWICZ.
- L21: THE WORKS
- L23: HENRYK SIENKIEWICZ.
- L25: TRANSLATED BY JEREMIAH CURTIN.
- L43: ROME IN THE TIME OF NERO.
- L61: FIRE AND SWORD.
- L78: JEREMIAH CURTIN.
- L55: [Illustration: Henryk Sienkiewicz and his Children.]
- L1181: Hear, O God, our prayers,--

## Section Size Sanity

- Sections: 63
- Min/median/max words: 1909/4386/14090
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
