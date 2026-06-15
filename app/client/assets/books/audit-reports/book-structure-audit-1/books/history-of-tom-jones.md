# history-of-tom-jones

- Source: `app/client/assets/temp-books/History of Tom Jones.txt`
- Title: History of Tom Jones, a Foundling
- Author: Henry Fielding
- Raw words: 354913
- Detected convention: chapter-based roman numerals with book divisions
- Confidence: high (0.876)
- Recommended handling: needs manual sectioning review
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 414 | 326 | 72 | yes |  |
| book-division | 36 | 31 | 3 | no | weaker than selected strategy chapter-roman |
| all-caps-title | 95 | 58 | 37 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 42 | 38 | 3 | no | weaker than selected strategy chapter-roman |
| letter-prefixed | 3 | 3 | 0 | no | weaker than selected strategy chapter-roman |
| arabic-numbered-title | 1 | 1 | 0 | no | weaker than selected strategy chapter-roman |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L26: Chapter iv -- The reader's neck brought into danger by a description;
- L29: Chapter v -- Containing a few common matters, with a very uncommon
- L32: Chapter vi -- Mrs Deborah is introduced into the parish with a
- L37: Chapter vii -- Containing such grave matter, that the reader cannot
- L41: Chapter viii -- A dialogue between Mesdames Bridget and Deborah;
- L44: Chapter ix -- Containing matters which will surprize the reader.
- L46: Chapter x -- The hospitality of Allworthy; with a short sketch of the
- L50: Chapter xi -- Containing many rules, and some examples, concerning

## Rejected TOC-like Examples

- L16: Chapter i -- The introduction to the work, or bill of fare to the
- L19: Chapter ii -- A short description of squire Allworthy, and a fuller
- L22: Chapter iii -- An odd accident which befel Mr Allworthy at his return
- L66: Chapter i -- Showing what kind of a history this is; what it is like,
- L104: Chapter i -- Containing little or nothing.
- L106: Chapter ii -- The heroe of this great history appears with very bad
- L114: Chapter iv.
- L129: Chapter viii -- A childish incident, in which, however, is seen a

## Section Size Sanity

- Sections: 326
- Min/median/max words: 4/49/76729
- Notes: 1 section(s) exceed 18000 words; many very small sections; headings may include TOC, captions, or fragments; largest section is much bigger than the median section

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- long book has huge sections despite detected headings
- body headings were found but rejected by the selected strategy
