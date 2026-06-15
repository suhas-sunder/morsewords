# figures-of-earth-a-comedy-of-appearances

- Source: `app/client/assets/temp-books/Figures of Earth - A Comedy of Appearances.txt`
- Title: Figures of Earth: A Comedy of Appearances
- Author: James Branch Cabell
- Raw words: 63637
- Detected convention: standalone roman numeral sections with part divisions
- Confidence: high (1)
- Recommended handling: needs manual sectioning review
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| roman-only | 35 | 33 | 2 | yes |  |
| part-division | 10 | 5 | 5 | no | weaker than selected strategy roman-only |
| all-caps-title | 58 | 16 | 42 | no | weaker than selected strategy roman-only |
| isolated-title-case | 90 | 76 | 10 | no | weaker than selected strategy roman-only |
| special-front-back | 3 | 1 | 2 | no | weaker than selected strategy roman-only |
| arabic-only | 1 | 1 | 0 | no | weaker than selected strategy roman-only |
| date-entry | 1 | 0 | 0 | no | no convincing body headings for this pattern |

## Body Heading Examples

- L454: I
- L651: II
- L837: III
- L990: IV
- L1426: V
- L1634: VI
- L1764: VII
- L1947: VIII

## Rejected TOC-like Examples

- L336: II
- L381: III

## Section Size Sanity

- Sections: 33
- Min/median/max words: 1011/1769/3833
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: medium
- End: medium
- Missing Project Gutenberg end marker; footer text was not destructively stripped.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- body headings were found but rejected by the selected strategy
