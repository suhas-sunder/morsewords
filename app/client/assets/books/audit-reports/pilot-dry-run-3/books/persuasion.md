# Pilot Dry Run: persuasion

- Source file: `Persuasion.txt`
- Why selected: High-confidence chapter-Roman structure with clean boundaries and a feasible preview source.
- Pass-2 risk level: medium
- Existing generated output: no
- Candidate title: Persuasion
- Candidate author: Jane Austen
- Final dry-run recommendation: process later with warnings

## Boundary Decision

- Dry-run adjustment: none.

- Raw word count: 87069
- Kept word count estimate: 83877
- Removed front matter word count estimate: 190
- Removed end matter word count estimate: 3002
- Candidate start: line 71, index 1234
- Start snippet: CHAPTER I. Sir Walter Elliot, of Kellynch Hall, in Somersetshire, was a man who, for his own amusement, never took up any book but the Baronetage; there he found occupation for an idle hour, and consolation in a distressed

### 10-20 Lines Before Start

- L51: CHAPTER IX.
- L52: CHAPTER X.
- L53: CHAPTER XI.
- L54: CHAPTER XII.
- L55: CHAPTER XIII.
- L56: CHAPTER XIV.
- L57: CHAPTER XV.
- L58: CHAPTER XVI.
- L59: CHAPTER XVII.
- L60: CHAPTER XVIII.
- L61: CHAPTER XIX.
- L62: CHAPTER XX.
- L63: CHAPTER XXI.
- L64: CHAPTER XXII.
- L65: CHAPTER XXIII.
- L66: CHAPTER XXIV.
- L67: [blank]
- L68: [blank]
- L69: [blank]
- L70: [blank]

- Candidate end: line 8386, index 465674
- End snippet: sunshine. She gloried in being a sailor’s wife, but she must pay the tax of quick alarm for belonging to that profession which is, if possible, more distinguished in its domestic virtues than in its national importance. Finis

### 10-20 Lines After End

- L8387: [blank]
- L8388: [blank]
- L8389: [blank]
- L8390: *** END OF THE PROJECT GUTENBERG EBOOK PERSUASION ***
- L8391: [blank]
- L8392: [blank]
- L8393: [blank]
- L8394: [blank]
- L8395: Updated editions will replace the previous one—the old editions will
- L8396: be renamed.
- L8397: [blank]
- L8398: Creating the works from print editions not protected by U.S. copyright
- L8399: law means that no one owns a United States copyright in these works,
- L8400: so the Foundation (and you!) can copy and distribute it in the United
- L8401: States without permission and without paying copyright
- L8402: royalties. Special rules, set forth in the General Terms of Use part
- L8403: of this license, apply to copying and distributing Project
- L8404: Gutenberg™ electronic works to protect the PROJECT GUTENBERG™
- L8405: concept and trademark. Project Gutenberg is a registered trademark,
- L8406: and may not be used if you charge for an eBook, except by following

## Structure Detection

- Detected structural convention: chapter-based roman numerals
- Selected heading strategy: chapter-roman
- TOC entries detected: yes
- Body headings detected: yes
- Section count from selected strategy: 24
- Fallback used: no
- Fallback legitimacy: not required
- Fallback reason: not required
- Structure detection status: pass

### Candidate Heading Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 24 | 24 | 0 | yes |  |
| all-caps-title | 5 | 5 | 0 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 30 | 30 | 0 | no | weaker than selected strategy chapter-roman |

### Rejected Heading Strategies

| Pattern | Candidates | Body-like | TOC-like | Reason |
| --- | ---: | ---: | ---: | --- |
| all-caps-title | 5 | 5 | 0 | weaker than selected strategy chapter-roman |
| isolated-title-case | 30 | 30 | 0 | weaker than selected strategy chapter-roman |

### Structure Warnings

- None.

## Proposed Sections

- Total proposed sections: 24

| ID | Kind | Label | Title | Words | Default |
| --- | --- | --- | --- | ---: | --- |
| chapter-001 | chapter | Chapter 1 |  | 2630 | yes |
| chapter-002 | chapter | Chapter 2 |  | 1992 | yes |
| chapter-003 | chapter | Chapter 3 |  | 2847 | yes |
| chapter-004 | chapter | Chapter 4 |  | 1812 | yes |
| chapter-005 | chapter | Chapter 5 |  | 3334 | yes |
| chapter-006 | chapter | Chapter 6 |  | 3831 | yes |
| chapter-007 | chapter | Chapter 7 |  | 3462 | yes |
| chapter-008 | chapter | Chapter 8 |  | 3360 | yes |
| chapter-009 | chapter | Chapter 9 |  | 2883 | yes |
| chapter-010 | chapter | Chapter 10 |  | 3871 | yes |
| chapter-011 | chapter | Chapter 11 |  | 3016 | yes |
| chapter-012 | chapter | Chapter 12 |  | 5572 | yes |
| chapter-013 | chapter | Chapter 13 |  | 2765 | yes |
| chapter-014 | chapter | Chapter 14 |  | 2545 | yes |
| chapter-015 | chapter | Chapter 15 |  | 2821 | yes |
| chapter-016 | chapter | Chapter 16 |  | 2421 | yes |
| chapter-017 | chapter | Chapter 17 |  | 3504 | yes |
| chapter-018 | chapter | Chapter 18 |  | 4147 | yes |
| chapter-019 | chapter | Chapter 19 |  | 2406 | yes |
| chapter-020 | chapter | Chapter 20 |  | 3513 | yes |
| chapter-021 | chapter | Chapter 21 |  | 7028 | yes |
| chapter-022 | chapter | Chapter 22 |  | 5911 | yes |
| chapter-023 | chapter | Chapter 23 |  | 6608 | yes |
| chapter-024 | chapter | Chapter 24 |  | 1598 | yes |

## Suspicious Sections

- Suspiciously short sections: None
- Suspiciously long sections: None

## Cleanup Simulation

| Action | Count | Recommendation | Samples |
| --- | ---: | --- | --- |
| normalize-smart-quotes | 2149 | Normalize smart quotes to ASCII quotes only in candidate playback text. | “<br>“<br>”<br>’<br>’ |
| normalize-em-en-dashes | 139 | Normalize em/en dashes to spaced hyphen for Morse/audio playback, preserving sentence flow. | —<br>—<br>—<br>—<br>—<br>—<br>—<br>— |

- Footnotes/references: No footnote/reference handling issue detected in the dry run.
- Illustration/image placeholders: No illustration/image placeholder issue detected in the dry run.
- Dash normalization: Normalize em/en dashes to simple spaced hyphens for Morse/audio playback in candidate output only.

## First-Hour Preview Candidate

- Feasible: yes
- Confidence: medium
- Sections used: chapter-001 Chapter 1
- Approximate word count: 2630
- Starts at real readable content: yes
- Snippet: CHAPTER I. Sir Walter Elliot, of Kellynch Hall, in Somersetshire, was a man who, for his own amusement, never took up any book but the Baronetage; there he found occupation for an idle hour, and consolation in a distressed one; there his faculties were roused into admiration and respect, by contemplating the limited remnant of the earliest patents; there an...

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
