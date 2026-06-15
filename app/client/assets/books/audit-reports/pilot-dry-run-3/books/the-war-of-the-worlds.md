# Pilot Dry Run: the-war-of-the-worlds

- Source file: `The War of the Worlds.txt`
- Why selected: High-confidence Roman-numbered sections with book divisions, selected to exercise nested structural reporting.
- Pass-2 risk level: medium
- Existing generated output: no
- Candidate title: The war of the worlds
- Candidate author: H. G. Wells
- Final dry-run recommendation: process later with warnings

## Boundary Decision

- Dry-run adjustment: none.

- Raw word count: 63850
- Kept word count estimate: 60517
- Removed front matter word count estimate: 327
- Removed end matter word count estimate: 3006
- Candidate start: line 84, index 1892
- Start snippet: BOOK ONE THE COMING OF THE MARTIANS

### 10-20 Lines Before Start

- L64: XV. WHAT HAD HAPPENED IN SURREY.
- L65: XVI. THE EXODUS FROM LONDON.
- L66: XVII. THE “THUNDER CHILD”.
- L67: [blank]
- L68: BOOK TWO.—THE EARTH UNDER THE MARTIANS
- L69: [blank]
- L70: I. UNDER FOOT.
- L71: II. WHAT WE SAW FROM THE RUINED HOUSE.
- L72: III. THE DAYS OF IMPRISONMENT.
- L73: IV. THE DEATH OF THE CURATE.
- L74: V. THE STILLNESS.
- L75: VI. THE WORK OF FIFTEEN DAYS.
- L76: VII. THE MAN ON PUTNEY HILL.
- L77: VIII. DEAD LONDON.
- L78: IX. WRECKAGE.
- L79: X. THE EPILOGUE.
- L80: [blank]
- L81: [blank]
- L82: [blank]
- L83: [blank]

- Candidate end: line 6396, index 338219
- End snippet: the tumult of playing children, and to recall the time when I saw it all bright and clear-cut, hard and silent, under the dawn of that last great day. . . . And strangest of all is it to hold my wife’s hand again, and to think that I have counted her, and that she has counted me, among the dead.

### 10-20 Lines After End

- L6397: [blank]
- L6398: [blank]
- L6399: [blank]
- L6400: [blank]
- L6401: *** END OF THE PROJECT GUTENBERG EBOOK THE WAR OF THE WORLDS ***
- L6402: [blank]
- L6403: [blank]
- L6404: [blank]
- L6405: [blank]
- L6406: Updated editions will replace the previous one—the old editions will
- L6407: be renamed.
- L6408: [blank]
- L6409: Creating the works from print editions not protected by U.S. copyright
- L6410: law means that no one owns a United States copyright in these works,
- L6411: so the Foundation (and you!) can copy and distribute it in the United
- L6412: States without permission and without paying copyright
- L6413: royalties. Special rules, set forth in the General Terms of Use part
- L6414: of this license, apply to copying and distributing Project
- L6415: Gutenberg™ electronic works to protect the PROJECT GUTENBERG™
- L6416: concept and trademark. Project Gutenberg is a registered trademark,

## Structure Detection

- Detected structural convention: standalone roman numeral sections with book divisions
- Selected heading strategy: roman-only
- TOC entries detected: yes
- Body headings detected: yes
- Section count from selected strategy: 27
- Fallback used: no
- Fallback legitimacy: not required
- Fallback reason: not required
- Structure detection status: pass

### Candidate Heading Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| roman-only | 27 | 27 | 0 | yes |  |
| all-caps-title | 31 | 30 | 1 | no | weaker than selected strategy roman-only |
| isolated-title-case | 14 | 14 | 0 | no | weaker than selected strategy roman-only |
| book-division | 2 | 2 | 0 | no | weaker than selected strategy roman-only |
| roman-numbered-title | 1 | 1 | 0 | no | weaker than selected strategy roman-only |

### Rejected Heading Strategies

| Pattern | Candidates | Body-like | TOC-like | Reason |
| --- | ---: | ---: | ---: | --- |
| all-caps-title | 31 | 30 | 1 | weaker than selected strategy roman-only |
| isolated-title-case | 14 | 14 | 0 | weaker than selected strategy roman-only |
| book-division | 2 | 2 | 0 | weaker than selected strategy roman-only |
| roman-numbered-title | 1 | 1 | 0 | weaker than selected strategy roman-only |

### Structure Warnings

- None.

## Proposed Sections

- Total proposed sections: 27

| ID | Kind | Label | Title | Words | Default |
| --- | --- | --- | --- | ---: | --- |
| chapter-001 | chapter | Chapter 1 | Book One | 2243 | yes |
| chapter-002 | chapter | Chapter 2 |  | 1350 | yes |
| chapter-003 | chapter | Chapter 3 |  | 1018 | yes |
| chapter-004 | chapter | Chapter 4 |  | 1127 | yes |
| chapter-005 | chapter | Chapter 5 |  | 1483 | yes |
| chapter-006 | chapter | Chapter 6 |  | 836 | yes |
| chapter-007 | chapter | Chapter 7 |  | 1327 | yes |
| chapter-008 | chapter | Chapter 8 |  | 980 | yes |
| chapter-009 | chapter | Chapter 9 |  | 2155 | yes |
| chapter-010 | chapter | Chapter 10 |  | 2263 | yes |
| chapter-011 | chapter | Chapter 11 |  | 2034 | yes |
| chapter-012 | chapter | Chapter 12 |  | 3867 | yes |
| chapter-013 | chapter | Chapter 13 |  | 1783 | yes |
| chapter-014 | chapter | Chapter 14 |  | 3751 | yes |
| chapter-015 | chapter | Chapter 15 |  | 2819 | yes |
| chapter-016 | chapter | Chapter 16 |  | 4422 | yes |
| chapter-017 | chapter | Chapter 17 |  | 3291 | yes |
| chapter-018 | chapter | Chapter 1 | Book Two | 2618 | yes |
| chapter-019 | chapter | Chapter 2 |  | 3303 | yes |
| chapter-020 | chapter | Chapter 3 |  | 1944 | yes |
| chapter-021 | chapter | Chapter 4 |  | 1616 | yes |
| chapter-022 | chapter | Chapter 5 |  | 963 | yes |
| chapter-023 | chapter | Chapter 6 |  | 1253 | yes |
| chapter-024 | chapter | Chapter 7 |  | 5735 | yes |
| chapter-025 | chapter | Chapter 8 |  | 3110 | yes |
| chapter-026 | chapter | Chapter 9 |  | 1846 | yes |
| chapter-027 | chapter | Chapter 10 |  | 1380 | yes |

## Suspicious Sections

- Suspiciously short sections: None
- Suspiciously long sections: None

## Cleanup Simulation

| Action | Count | Recommendation | Samples |
| --- | ---: | --- | --- |
| remove-page-and-decorative-lines | 1 | Remove standalone page markers and decorative separators; do not remove prose punctuation. | candidate L5943: . . . |
| normalize-smart-quotes | 1224 | Normalize smart quotes to ASCII quotes only in candidate playback text. | ’<br>’<br>“<br>”<br>’ |
| normalize-em-en-dashes | 309 | Normalize em/en dashes to spaced hyphen for Morse/audio playback, preserving sentence flow. | —<br>—<br>—<br>—<br>—<br>—<br>—<br>— |

- Footnotes/references: No footnote/reference handling issue detected in the dry run.
- Illustration/image placeholders: No illustration/image placeholder issue detected in the dry run.
- Dash normalization: Normalize em/en dashes to simple spaced hyphens for Morse/audio playback in candidate output only.

## First-Hour Preview Candidate

- Feasible: yes
- Confidence: medium
- Sections used: chapter-001 Chapter 1
- Approximate word count: 2243
- Starts at real readable content: yes
- Snippet: BOOK ONE THE COMING OF THE MARTIANS I. THE EVE OF THE WAR. No one would have believed in the last years of the nineteenth century that this world was being watched keenly and closely by intelligences greater than man’s and yet as mortal as his own; that as men busied themselves about their various concerns they were scrutinised and studied, perhaps almost a...

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
