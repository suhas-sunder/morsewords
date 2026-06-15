# the-emerald-city-of-oz

- Source: `app/client/assets/temp-books/the-emerald-city-of-oz.txt`
- Title: The Emerald City of Oz
- Author: L. Frank Baum
- Raw words: 57005
- Detected convention: arabic-numbered titled sections
- Confidence: high (1)
- Recommended handling: needs manual sectioning review
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| arabic-numbered-title | 60 | 30 | 30 | yes |  |
| all-caps-title | 11 | 11 | 0 | no | weaker than selected strategy arabic-numbered-title |
| isolated-title-case | 51 | 50 | 1 | no | weaker than selected strategy arabic-numbered-title |
| roman-numbered-title | 2 | 1 | 1 | no | weaker than selected strategy arabic-numbered-title |
| special-front-back | 2 | 1 | 1 | no | weaker than selected strategy arabic-numbered-title |

## Body Heading Examples

- L82: 1. How the Nome King Became Angry
- L310: 2. How Uncle Henry Got Into Trouble
- L500: 3. How Ozma Granted Dorothy's Request
- L720: 4. How The Nome King Planned Revenge
- L924: 5. How Dorothy Became a Princess
- L1175: 6. How Guph Visited the Whimsies
- L1309: 7. How Aunt Em Conquered the Lion
- L1605: 8. How the Grand Gallipoot Joined The Nomes

## Rejected TOC-like Examples

- L16: 1. How the Nome King Became Angry
- L17: 2. How Uncle Henry Got Into Trouble
- L18: 3. How Ozma Granted Dorothy's Request
- L19: 4. How The Nome King Planned Revenge
- L20: 5. How Dorothy Became a Princess
- L21: 6. How Guph Visited the Whimsies
- L22: 7. How Aunt Em Conquered the Lion
- L23: 8. How the Grand Gallipoot Joined The Nomes

## Section Size Sanity

- Sections: 30
- Min/median/max words: 174/1839/2707
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- Manifest: `app/client/assets/books/generated/the-emerald-city-of-oz/manifest.json`
- Sections: 11
- Included sections: 0
- No chapter headings were detected; generated fallback parts instead.
- existing generated output section count is far below likely raw body heading count (11 vs 30)
- existing generated first preview may include source, title-page, or TOC junk

## Red Flags

- generated output likely collapsed real structure
- generated output may include source/license/TOC/footer junk
