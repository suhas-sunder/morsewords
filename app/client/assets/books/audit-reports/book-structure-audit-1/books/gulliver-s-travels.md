# gulliver-s-travels

- Source: `app/client/assets/temp-books/Gulliver's Travels.txt`
- Title: Gulliver's Travels into Several Remote Nations of the World
- Author: Jonathan Swift
- Raw words: 108555
- Detected convention: chapter-based roman numerals with part divisions
- Confidence: high (0.988)
- Recommended handling: needs manual sectioning review
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 39 | 31 | 8 | yes |  |
| part-division | 8 | 4 | 4 | no | weaker than selected strategy chapter-roman |
| all-caps-title | 10 | 7 | 3 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 9 | 9 | 0 | no | weaker than selected strategy chapter-roman |
| arabic-numbered-title | 1 | 1 | 0 | no | weaker than selected strategy chapter-roman |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L2358: CHAPTER I.
- L2764: CHAPTER II.
- L2952: CHAPTER III.
- L3285: CHAPTER IV.
- L3447: CHAPTER V.
- L3767: CHAPTER VI.
- L4057: CHAPTER VII.
- L4276: CHAPTER VIII.

## Rejected TOC-like Examples

- L225: CHAPTER I.
- L554: CHAPTER II.
- L873: CHAPTER III.
- L1137: CHAPTER IV.
- L1301: CHAPTER V.
- L1517: CHAPTER VI.
- L1858: CHAPTER VII.
- L2149: CHAPTER VIII.

## Section Size Sanity

- Sections: 31
- Min/median/max words: 1282/2418/4957
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- Manifest: `app/client/assets/books/generated/gulliver-s-travels/manifest.json`
- Sections: 49
- Included sections: 39
- No generated comparison warnings.

## Red Flags

- body headings were found but rejected by the selected strategy
