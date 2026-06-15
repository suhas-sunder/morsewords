# father-goriot

- Source: `app/client/assets/temp-books/Father Goriot.txt`
- Title: Father Goriot
- Author: Honoré de Balzac
- Raw words: 107976
- Detected convention: story or titled-section headings
- Confidence: medium (0.701)
- Recommended handling: needs manual sectioning review
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| all-caps-title | 7 | 7 | 0 | yes |  |
| isolated-title-case | 232 | 223 | 9 | no | weaker than selected strategy all-caps-title |
| roman-numbered-title | 6 | 6 | 0 | no | weaker than selected strategy all-caps-title |
| arabic-numbered-title | 1 | 1 | 0 | no | weaker than selected strategy all-caps-title |

## Body Heading Examples

- L1: FATHER GORIOT
- L12: DE BALZAC.
- L15: FATHER GORIOT
- L3553: “LAURE DE RASTIGNAC.”
- L6531: “DELPHINE.”
- L8251: “VICOMTESSE DE BEAUSEANT.”
- L10771: ADDENDUM

## Rejected TOC-like Examples

- L980: Goriot!”
- L1605: “Who?”
- L1903: “Corn-elian.”
- L1905: “Corn-ice.”
- L1907: “Corn-ucopia.”
- L1909: “Corn-crake.”
- L1913: “Corn-orama.”
- L1947: Mlle. Victorine.”

## Section Size Sanity

- Sections: 7
- Min/median/max words: 2/15031/34621
- Notes: 3 section(s) exceed 18000 words

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- long book has huge sections despite detected headings
- body headings were found but rejected by the selected strategy
