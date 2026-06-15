# the-octopus-a-story-of-california

- Source: `app/client/assets/temp-books/The Octopus - A Story of California.txt`
- Title: The Octopus : A Story of California
- Author: Frank Norris
- Raw words: 200032
- Detected convention: chapter-based roman numerals with book divisions
- Confidence: high (0.88)
- Recommended handling: needs manual sectioning review
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 15 | 11 | 4 | yes |  |
| all-caps-title | 11 | 11 | 0 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 137 | 136 | 1 | no | weaker than selected strategy chapter-roman |
| book-division | 2 | 2 | 0 | no | weaker than selected strategy chapter-roman |

## Body Heading Examples

- L4892: CHAPTER V
- L6593: CHAPTER VI
- L8925: CHAPTER I
- L10143: CHAPTER II
- L11662: CHAPTER III
- L12407: CHAPTER IV
- L14275: CHAPTER V.
- L15568: CHAPTER VI

## Rejected TOC-like Examples

- L11: CHAPTER I
- L1511: CHAPTER II
- L2889: CHAPTER III
- L3839: CHAPTER IV

## Section Size Sanity

- Sections: 11
- Min/median/max words: 7538/11627/21719
- Notes: 1 section(s) exceed 18000 words

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- long book has huge sections despite detected headings
