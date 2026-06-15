# the-works-of-edgar-allan-poe-the-raven-edition

- Source: `app/client/assets/temp-books/The Works of Edgar Allan Poe, The Raven Edition.txt`
- Title: The Works of Edgar Allan Poe, The Raven Edition
- Author: Edgar Allan Poe
- Raw words: 17694
- Detected convention: isolated titled sections
- Confidence: high (0.901)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| isolated-title-case | 22 | 15 | 4 | yes |  |
| all-caps-title | 143 | 8 | 135 | no | weaker than selected strategy isolated-title-case |
| chapter-arabic | 25 | 0 | 25 | no | rejected as TOC-like or front-matter-only evidence |
| special-front-back | 6 | 0 | 6 | no | rejected as TOC-like or front-matter-only evidence |
| volume-division | 6 | 0 | 6 | no | rejected as TOC-like or front-matter-only evidence |

## Body Heading Examples

- L249: of Hans Pfaall,” “MSS. Found in a Bottle,” “A Descent Into a
- L251: “William Wilson,” “The Black Cat” and “The Tell-tale Heart,”
- L256: “The Purloined Letter” and “The Mystery of Marie Roget,” the
- L267: “The Bells,” “The Haunted Palace,” “Tamerlane,” “The City in the
- L378: On September 22, 1835, Poe married his cousin, Virginia Clemm, in
- L416: the “Southern Literary Messenger” in Richmond, Va.; “Graham’s
- L418: “Evening Mirror,” the “Broadway Journal,” and “Godey’s Lady’s
- L436: in New York:

## Rejected TOC-like Examples

- L10: The Raven Edition
- L210: “Haunted Palace”:
- L403: I and my Annabel Lee;
- L409: My beautiful Annabel Lee;

## Section Size Sanity

- Sections: 15
- Min/median/max words: 18/230/6813
- Notes: largest section is much bigger than the median section

## Boundary Confidence

- Start: medium
- End: medium
- Missing Project Gutenberg end marker; footer text was not destructively stripped.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
