# the-whisperer-in-darkness

- Source: `app/client/assets/temp-books/The Whisperer in Darkness.txt`
- Title: The Whisperer in Darkness
- Author: unknown
- Raw words: 26718
- Detected convention: isolated titled sections
- Confidence: high (0.901)
- Recommended handling: needs manual sectioning review
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| isolated-title-case | 29 | 23 | 6 | yes |  |
| arabic-only | 7 | 7 | 0 | no | weaker than selected strategy isolated-title-case |
| all-caps-title | 33 | 31 | 2 | no | weaker than selected strategy isolated-title-case |

## Body Heading Examples

- L28: The Whisperer in Darkness
- L336: Townshend, Windham Co., Vermont,
- L343: My Dear Sir:
- L362: Tylor, Lubbock, Frazer, Quatrefages, Murray, Osborn, Keith, Boule,
- L645: Tsathoggua, Yog-Sothoth, R'lyeh, Nyarlathotep, Azathoth, Hastur, Yian,
- L646: Leng, the Lake of Hali, Bethmoora, the Yellow Sign, L'mur-Kathulos,
- L707: in Brattleboro, Bellows Falls, Newfane, and South Londonderry in
- L768: Iä! Shub-Niggurath! The Goat with a Thousand Young!

## Rejected TOC-like Examples

- L16: _Title:_ The Whisperer in Darkness
- L18: _Author:_ H. P. (Howard Phillips) (1890-1937)
- L19: _Illustrator:_ Curtis Charles Senf (1873-1949)
- L33: Weird Tales August 1931.]
- L339: Albert N. Wilmarth, Esq.,
- L340: 118 Saltonstall St.,

## Section Size Sanity

- Sections: 23
- Min/median/max words: 5/326/11101
- Notes: largest section is much bigger than the median section

## Boundary Confidence

- Start: low
- End: low
- Missing Project Gutenberg start marker; body text was not destructively stripped.
- Missing Project Gutenberg end marker; footer text was not destructively stripped.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- body headings were found but rejected by the selected strategy
- start/end boundary confidence is low
