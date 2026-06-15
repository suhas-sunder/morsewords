# the-nameless-city

- Source: `app/client/assets/temp-books/The Nameless City.txt`
- Title: The Nameless City
- Author: Howard Phillips Lovecraft (1890-1937)
- Raw words: 5225
- Detected convention: isolated titled sections
- Confidence: medium (0.601)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| isolated-title-case | 5 | 3 | 2 | yes |  |
| all-caps-title | 3 | 2 | 1 | no | weaker than selected strategy isolated-title-case |

## Body Heading Examples

- L27: The Nameless City
- L31: [Transcriber's Note: Published in _Weird Tales_, Volume 32, Number
- L520: [The end of _The Nameless City_ by Howard Phillips Lovecraft]

## Rejected TOC-like Examples

- L16: Title: The Nameless City
- L18: Author: Howard Phillips Lovecraft (1890-1937)

## Section Size Sanity

- Sections: 3
- Min/median/max words: 7/10/5055
- Notes: largest section is much bigger than the median section

## Boundary Confidence

- Start: low
- End: low
- Missing Project Gutenberg start marker; body text was not destructively stripped.
- Missing Project Gutenberg end marker; footer text was not destructively stripped.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- start/end boundary confidence is low
