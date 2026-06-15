# the-brothers-karamazov

- Source: `app/client/assets/temp-books/The Brothers Karamazov.txt`
- Title: The Brothers Karamazov
- Author: Fyodor Dostoyevsky
- Raw words: 362226
- Detected convention: chapter-based roman numerals with book divisions and part divisions
- Confidence: high (0.945)
- Recommended handling: needs manual sectioning review
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 192 | 68 | 121 | yes |  |
| book-division | 24 | 12 | 12 | no | weaker than selected strategy chapter-roman |
| part-division | 8 | 4 | 4 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 252 | 236 | 12 | no | weaker than selected strategy chapter-roman |
| roman-numbered-title | 8 | 8 | 0 | no | weaker than selected strategy chapter-roman |
| all-caps-title | 3 | 3 | 0 | no | weaker than selected strategy chapter-roman |
| special-front-back | 3 | 1 | 2 | no | weaker than selected strategy chapter-roman |

## Body Heading Examples

- L8481: Chapter V.
- L8944: Chapter VI.
- L9292: Chapter VII.
- L9697: Chapter I.
- L10180: Chapter II.
- L10494: Chapter III.
- L10892: Chapter IV.
- L11337: Chapter V.

## Rejected TOC-like Examples

- L18: Chapter I. Fyodor Pavlovitch Karamazov
- L19: Chapter II. He Gets Rid Of His Eldest Son
- L20: Chapter III. The Second Marriage And The Second Family
- L21: Chapter IV. The Third Son, Alyosha
- L22: Chapter V. Elders
- L24: Chapter I. They Arrive At The Monastery
- L25: Chapter II. The Old Buffoon
- L26: Chapter III. Peasant Women Who Have Faith

## Section Size Sanity

- Sections: 68
- Min/median/max words: 1410/3954/9389
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- TOC/body confusion is likely
- body headings were found but rejected by the selected strategy
