# around-the-world-in-eighty-days

- Source: `app/client/assets/temp-books/around-the-world-in-eighty-days.txt`
- Title: Around the World in Eighty Days
- Author: Jules Verne
- Raw words: 67077
- Detected convention: chapter-based roman numerals
- Confidence: high (1)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 74 | 37 | 37 | yes |  |
| all-caps-title | 63 | 63 | 0 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 107 | 98 | 6 | no | weaker than selected strategy chapter-roman |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L50: CHAPTER I.
- L215: CHAPTER II.
- L329: CHAPTER III.
- L604: CHAPTER IV.
- L752: CHAPTER V.
- L860: CHAPTER VI.
- L1030: CHAPTER VII.
- L1156: CHAPTER VIII.

## Rejected TOC-like Examples

- L11: CHAPTER I. IN WHICH PHILEAS FOGG AND PASSEPARTOUT ACCEPT EACH OTHER, THE ONE AS MASTER, THE OTHER AS MAN
- L12: CHAPTER II. IN WHICH PASSEPARTOUT IS CONVINCED THAT HE HAS AT LAST FOUND HIS IDEAL
- L13: CHAPTER III. IN WHICH A CONVERSATION TAKES PLACE WHICH SEEMS LIKELY TO COST PHILEAS FOGG DEAR
- L14: CHAPTER IV. IN WHICH PHILEAS FOGG ASTOUNDS PASSEPARTOUT, HIS SERVANT
- L15: CHAPTER V. IN WHICH A NEW SPECIES OF FUNDS, UNKNOWN TO THE MONEYED MEN, APPEARS ON ’CHANGE
- L16: CHAPTER VI. IN WHICH FIX, THE DETECTIVE, BETRAYS A VERY NATURAL IMPATIENCE
- L17: CHAPTER VII. WHICH ONCE MORE DEMONSTRATES THE USELESSNESS OF PASSPORTS AS AIDS TO DETECTIVES
- L18: CHAPTER VIII. IN WHICH PASSEPARTOUT TALKS RATHER MORE, PERHAPS, THAN IS PRUDENT

## Section Size Sanity

- Sections: 37
- Min/median/max words: 800/1764/2601
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- Manifest: `app/client/assets/books/generated/around-the-world-in-eighty-days/manifest.json`
- Sections: 39
- Included sections: 37
- Rights have not been reviewed; generated book is not publish-ready.
- Rights basis "unknown" is not publish-ready.
- Rights gate status is needs_manual_review; generated book is not publish-ready.
- Rights gate did not allow processed public story output.
- Owner-reviewed website approval is missing.
- Website publication is not allowed by the active approval path.

## Red Flags

- None.
