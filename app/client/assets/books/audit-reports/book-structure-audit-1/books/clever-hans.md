# clever-hans

- Source: `app/client/assets/temp-books/CLEVER HANS.txt`
- Title: Grimms' Fairy Tales
- Author: Jacob Grimm
- Raw words: 1060
- Detected convention: isolated titled sections
- Confidence: high (0.851)
- Recommended handling: safe for normal processing
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| isolated-title-case | 12 | 12 | 0 | yes |  |
| all-caps-title | 1 | 1 | 0 | no | weaker than selected strategy isolated-title-case |

## Body Heading Examples

- L1: Grimms’ Fairy Tales
- L3: By Jacob Grimm and Wilhelm Grimm
- L11: ‘Goodbye, Hans.’ Hans comes to Gretel. ‘Good day, Gretel.’ ‘Good day,
- L14: ‘Goodbye, Gretel.’ ‘Goodbye, Hans.’
- L24: ‘Whither away, Hans?’ ‘To Gretel, mother.’ ‘Behave well, Hans.’ ‘Oh,
- L28: presents Hans with a knife. ‘Goodbye, Gretel.’ ‘Goodbye, Hans.’ Hans
- L36: ‘Whither away, Hans?’ ‘To Gretel, mother.’ ‘Behave well, Hans.’ ‘Oh,
- L49: ‘Whither away, Hans?’ ‘To Gretel, mother.’ ‘Behave well, Hans.’ ‘Oh,

## Rejected TOC-like Examples

- None.

## Section Size Sanity

- Sections: 12
- Min/median/max words: 3/81/171
- Notes: many very small sections; headings may include TOC, captions, or fragments

## Boundary Confidence

- Start: medium
- End: medium
- Missing Project Gutenberg end marker; footer text was not destructively stripped.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
