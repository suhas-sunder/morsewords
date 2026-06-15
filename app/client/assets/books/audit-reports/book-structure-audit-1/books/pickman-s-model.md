# pickman-s-model

- Source: `app/client/assets/temp-books/Pickman's Model.txt`
- Title: Pickman's Model
- Author: H. P. Lovecraft (1890-1937)
- Raw words: 5502
- Detected convention: isolated titled sections
- Confidence: high (0.821)
- Recommended handling: needs manual sectioning review
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| isolated-title-case | 6 | 4 | 2 | yes |  |
| all-caps-title | 2 | 1 | 1 | no | weaker than selected strategy isolated-title-case |

## Body Heading Examples

- L29: [Source: Famous Fantastic Mysteries, December, 1951]
- L43: H. P. Lovecraft
- L393: "Holmes, Lowell, and Longfellow Lie Buried in Mount Auburn."
- L554: [The end of _Pickman's Model_ by H. P. Lovecraft]

## Rejected TOC-like Examples

- L16: Title: Pickman's Model
- L18: Author: H. P. Lovecraft (1890-1937)

## Section Size Sanity

- Sections: 4
- Min/median/max words: 9/1606/3666
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: low
- End: low
- Missing Project Gutenberg start marker; body text was not destructively stripped.
- Missing Project Gutenberg end marker; footer text was not destructively stripped.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- start/end boundary confidence is low
