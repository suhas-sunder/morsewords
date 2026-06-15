# Pilot Dry Run: cranford

- Source file: `Cranford.txt`
- Why selected: High-confidence chapter-Roman structure with manageable length and clear start/end markers.
- Pass-2 risk level: medium
- Existing generated output: no
- Candidate title: Cranford
- Candidate author: Elizabeth Cleghorn Gaskell
- Final dry-run recommendation: process later with warnings

## Boundary Decision

- Dry-run adjustment: none.

- Raw word count: 75436
- Kept word count estimate: 71994
- Removed front matter word count estimate: 440
- Removed end matter word count estimate: 3002
- Candidate start: line 117, index 3043
- Start snippet: CHAPTER I. OUR SOCIETY IN the first place, Cranford is in possession of the Amazons; all the holders of houses above a certain rent are women. If a married couple

### 10-20 Lines Before Start

- L97: Afraid of matrimonial reports
- L98: Asked him to take care of us
- L99: Slaughterous and indiscriminate directions
- L100: Would stretch out their little arms
- L101: “What do you think, Miss Matty?”
- L102: Standing over him like a bold dragoon
- L103: “You must give me your note, Mr Dobson, if you please”
- L104: “Please, ma’am, he wants to marry me off hand”
- L105: Miss Matty and I sat assenting to accounts
- L106: Smiling glory ... and becoming blushes
- L107: I went to call Miss Matty
- L108: [blank]
- L109: * * * * *
- L110: [blank]
- L111: _Most of the three-colour blocks used in this book have been made by the
- L112: Graphic Photo-Engraving Co._, _London_
- L113: [blank]
- L114: [blank]
- L115: [blank]
- L116: [blank]

- Candidate end: line 6724, index 390249
- End snippet: * * * * * PRINTED BY TURNBULL AND SPEARS, EDINBURGH

### 10-20 Lines After End

- L6725: [blank]
- L6726: [blank]
- L6727: [blank]
- L6728: [blank]
- L6729: *** END OF THE PROJECT GUTENBERG EBOOK CRANFORD ***
- L6730: [blank]
- L6731: [blank]
- L6732: [blank]
- L6733: [blank]
- L6734: Updated editions will replace the previous one—the old editions will
- L6735: be renamed.
- L6736: [blank]
- L6737: Creating the works from print editions not protected by U.S. copyright
- L6738: law means that no one owns a United States copyright in these works,
- L6739: so the Foundation (and you!) can copy and distribute it in the United
- L6740: States without permission and without paying copyright
- L6741: royalties. Special rules, set forth in the General Terms of Use part
- L6742: of this license, apply to copying and distributing Project
- L6743: Gutenberg™ electronic works to protect the PROJECT GUTENBERG™
- L6744: concept and trademark. Project Gutenberg is a registered trademark,

## Structure Detection

- Detected structural convention: chapter-based roman numerals
- Selected heading strategy: chapter-roman
- TOC entries detected: yes
- Body headings detected: yes
- Section count from selected strategy: 16
- Fallback used: no
- Fallback legitimacy: not required
- Fallback reason: not required
- Structure detection status: pass

### Candidate Heading Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 16 | 16 | 0 | yes |  |
| all-caps-title | 19 | 19 | 0 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 23 | 23 | 0 | no | weaker than selected strategy chapter-roman |

### Rejected Heading Strategies

| Pattern | Candidates | Body-like | TOC-like | Reason |
| --- | ---: | ---: | ---: | --- |
| all-caps-title | 19 | 19 | 0 | weaker than selected strategy chapter-roman |
| isolated-title-case | 23 | 23 | 0 | weaker than selected strategy chapter-roman |

### Structure Warnings

- None.

## Proposed Sections

- Total proposed sections: 16

| ID | Kind | Label | Title | Words | Default |
| --- | --- | --- | --- | ---: | --- |
| chapter-001 | chapter | Chapter 1 |  | 3990 | yes |
| chapter-002 | chapter | Chapter 2 |  | 5663 | yes |
| chapter-003 | chapter | Chapter 3 |  | 3500 | yes |
| chapter-004 | chapter | Chapter 4 |  | 4290 | yes |
| chapter-005 | chapter | Chapter 5 |  | 4175 | yes |
| chapter-006 | chapter | Chapter 6 |  | 4807 | yes |
| chapter-007 | chapter | Chapter 7 |  | 3855 | yes |
| chapter-008 | chapter | Chapter 8 |  | 5075 | yes |
| chapter-009 | chapter | Chapter 9 |  | 3779 | yes |
| chapter-010 | chapter | Chapter 10 |  | 5547 | yes |
| chapter-011 | chapter | Chapter 11 |  | 4684 | yes |
| chapter-012 | chapter | Chapter 12 |  | 3178 | yes |
| chapter-013 | chapter | Chapter 13 |  | 4448 | yes |
| chapter-014 | chapter | Chapter 14 |  | 7023 | yes |
| chapter-015 | chapter | Chapter 15 |  | 4966 | yes |
| chapter-016 | chapter | Chapter 16 |  | 3014 | yes |

## Suspicious Sections

- Suspiciously short sections: None
- Suspiciously long sections: None

## Cleanup Simulation

| Action | Count | Recommendation | Samples |
| --- | ---: | --- | --- |
| remove-page-and-decorative-lines | 1 | Remove standalone page markers and decorative separators; do not remove prose punctuation. | candidate L6574: * * * * * |
| normalize-smart-quotes | 2293 | Normalize smart quotes to ASCII quotes only in candidate playback text. | ’<br>“<br>”<br>“<br>” |
| normalize-em-en-dashes | 521 | Normalize em/en dashes to spaced hyphen for Morse/audio playback, preserving sentence flow. | —<br>—<br>—<br>—<br>—<br>—<br>—<br>— |

- Footnotes/references: No footnote/reference handling issue detected in the dry run.
- Illustration/image placeholders: No illustration/image placeholder issue detected in the dry run.
- Dash normalization: Normalize em/en dashes to simple spaced hyphens for Morse/audio playback in candidate output only.

## First-Hour Preview Candidate

- Feasible: yes
- Confidence: medium
- Sections used: chapter-001 Chapter 1
- Approximate word count: 3990
- Starts at real readable content: yes
- Snippet: CHAPTER I. OUR SOCIETY IN the first place, Cranford is in possession of the Amazons; all the holders of houses above a certain rent are women. If a married couple come to settle in the town, somehow the gentleman disappears; he is either fairly frightened to death by being the only man in the Cranford evening parties, or he is accounted for by being with hi...

## Existing Generated Output Comparison

- Manifest: None
- Section count: 0
- Default-included section count: 0
- First generated preview: None
- Last generated preview: None
- Apparent generated damage: No generated-output damage flagged in this dry run.

## Manual Review Checklist

- Confirm the first kept line is real readable content, not source metadata or a TOC entry.
- Confirm the final kept line is real book content and the Gutenberg/license footer is excluded.
- Confirm default-readable sections exclude TOC, transcriber notes, source/license text, and publisher catalog material.
- Check suspiciously short or long proposed sections before a real write pass.
- Verify cleanup removes playback-hostile artifacts without deleting dialogue, punctuation, paragraph structure, or headings.
- Confirm the first-hour preview candidate starts with real readable content.

## Recommendation Reasons

- Table of contents appears isolated before readable content.
