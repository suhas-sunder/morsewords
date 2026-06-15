# the-regent-s-daughter

- Source: `app/client/assets/temp-books/The regent's daughter.txt`
- Title: The regent's daughter
- Author: Alexandre Dumas
- Raw words: 89144
- Detected convention: chapter-based roman numerals with volume divisions
- Confidence: high (0.95)
- Recommended handling: safe for normal processing
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 38 | 38 | 0 | yes |  |
| all-caps-title | 57 | 54 | 2 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 204 | 189 | 14 | no | weaker than selected strategy chapter-roman |
| roman-numbered-title | 5 | 5 | 0 | no | weaker than selected strategy chapter-roman |
| arabic-numbered-title | 39 | 5 | 4 | no | weaker than selected strategy chapter-roman |
| volume-division | 1 | 1 | 0 | no | weaker than selected strategy chapter-roman |
| arabic-only | 1 | 0 | 0 | no | no convincing body headings for this pattern |

## Body Heading Examples

- L146: CHAPTER I.
- L520: CHAPTER II.
- L775: CHAPTER III.
- L1163: CHAPTER IV.
- L1339: CHAPTER V.
- L1678: CHAPTER VI.
- L1838: CHAPTER VII.
- L2235: CHAPTER VIII.

## Rejected TOC-like Examples

- L20: THE REGENT'S DAUGHTER
- L38: THE REGENT'S DAUGHTER.
- L88: Gaston
- L502: "Well?"
- L629: "How?"
- L1233: Helene?"
- L1248: "Yes."
- L1287: "Gaston!"
- L1800: "Yes."
- L1987: "M. de Livry."

## Section Size Sanity

- Sections: 38
- Min/median/max words: 866/2074/9306
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
