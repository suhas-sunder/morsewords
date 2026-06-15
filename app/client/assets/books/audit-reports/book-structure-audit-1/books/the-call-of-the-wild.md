# the-call-of-the-wild

- Source: `app/client/assets/temp-books/The call of the wild.txt`
- Title: The call of the wild
- Author: Jack London
- Raw words: 35327
- Detected convention: chapter-based roman numerals
- Confidence: high (0.884)
- Recommended handling: needs manual sectioning review
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 14 | 6 | 8 | yes |  |
| isolated-title-case | 6 | 4 | 0 | no | weaker than selected strategy chapter-roman |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L397: Chapter II. The Law of Club and Fang
- L701: Chapter III. The Dominant Primordial Beast
- L1176: Chapter IV. Who Has Won to Mastership
- L1482: Chapter V. The Toil of Trace and Trail
- L2009: Chapter VI. For the Love of a Man
- L2482: Chapter VII. The Sounding of the Call

## Rejected TOC-like Examples

- L11: Chapter I. Into the Primitive
- L12: Chapter II. The Law of Club and Fang
- L13: Chapter III. The Dominant Primordial Beast
- L14: Chapter IV. Who Has Won to Mastership
- L15: Chapter V. The Toil of Trace and Trail
- L16: Chapter VI. For the Love of a Man
- L17: Chapter VII. The Sounding of the Call
- L20: Chapter I. Into the Primitive

## Section Size Sanity

- Sections: 6
- Min/median/max words: 3260/5211/6263
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- Manifest: `app/client/assets/books/generated/the-call-of-the-wild/manifest.json`
- Sections: 9
- Included sections: 7
- No generated comparison warnings.

## Red Flags

- TOC/body confusion is likely
