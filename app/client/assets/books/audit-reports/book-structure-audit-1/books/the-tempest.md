# the-tempest

- Source: `app/client/assets/temp-books/The Tempest.txt`
- Title: The Tempest
- Author: William Shakespeare
- Raw words: 27160
- Detected convention: play acts
- Confidence: high (0.87)
- Recommended handling: safe for normal processing
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| act-prefixed | 5 | 5 | 0 | yes |  |
| all-caps-title | 42 | 37 | 5 | no | weaker than selected strategy act-prefixed |
| isolated-title-case | 151 | 132 | 19 | no | weaker than selected strategy act-prefixed |
| roman-numbered-title | 22 | 22 | 0 | no | weaker than selected strategy act-prefixed |
| arabic-only | 1 | 1 | 0 | no | weaker than selected strategy act-prefixed |

## Body Heading Examples

- L95: ACT I.
- L1176: ACT II.
- L2084: ACT III.
- L2736: ACT IV.
- L3206: ACT V.

## Rejected TOC-like Examples

- L41: _VOLUME I._
- L49: THE TEMPEST.
- L62: FRANCISCO, „
- L74: CERES, „ „
- L75: JUNO, „ „
- L61: ADRIAN, Lord
- L76: Nymphs, „ „
- L77: Reapers, „ „
- L152: _Re-enter Boatswain._
- L264: _Pros._ Be collected:

## Section Size Sanity

- Sections: 5
- Min/median/max words: 2759/5226/6509
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
