# Pilot Dry Run: a-tale-of-two-cities

- Source file: `A Tale of Two Cities.txt`
- Why selected: High-confidence chapter-Roman structure with book-level divisions, selected to test nested book/chapter handling in a familiar novel.
- Pass-2 risk level: medium
- Existing generated output: no
- Candidate title: A Tale of Two Cities
- Candidate author: Charles Dickens
- Final dry-run recommendation: process later with warnings

## Boundary Decision

- Dry-run adjustment: none.

- Raw word count: 140776
- Kept word count estimate: 137574
- Removed front matter word count estimate: 196
- Removed end matter word count estimate: 3006
- Candidate start: line 52, index 1212
- Start snippet: CHAPTER I Five Years Later CHAPTER II A Sight CHAPTER III A Disappointment CHAPTER IV Congratulatory CHAPTER V The Jackal CHAPTER VI Hundreds of People

### 10-20 Lines Before Start

- L32: A STORY OF THE FRENCH REVOLUTION
- L33: [blank]
- L34: By Charles Dickens
- L35: [blank]
- L36: [blank]
- L37: CONTENTS
- L38: [blank]
- L39: [blank]
- L40: Book the First--Recalled to Life
- L41: [blank]
- L42: CHAPTER I The Period
- L43: CHAPTER II The Mail
- L44: CHAPTER III The Night Shadows
- L45: CHAPTER IV The Preparation
- L46: CHAPTER V The Wine-shop
- L47: CHAPTER VI The Shoemaker
- L48: [blank]
- L49: [blank]
- L50: Book the Second--the Golden Thread
- L51: [blank]

- Candidate end: line 15929, index 758444
- End snippet: with a forehead that I know and golden hair, to this place--then fair to look upon, with not a trace of this day’s disfigurement--and I hear him tell the child my story, with a tender and a faltering voice. “It is a far, far better thing that I do, than I have ever done; it is a far, far better rest that I go to than I have ever known.”

### 10-20 Lines After End

- L15930: [blank]
- L15931: [blank]
- L15932: [blank]
- L15933: *** END OF THE PROJECT GUTENBERG EBOOK A TALE OF TWO CITIES ***
- L15934: [blank]
- L15935: [blank]
- L15936: [blank]
- L15937: [blank]
- L15938: Updated editions will replace the previous one—the old editions will
- L15939: be renamed.
- L15940: [blank]
- L15941: Creating the works from print editions not protected by U.S. copyright
- L15942: law means that no one owns a United States copyright in these works,
- L15943: so the Foundation (and you!) can copy and distribute it in the United
- L15944: States without permission and without paying copyright
- L15945: royalties. Special rules, set forth in the General Terms of Use part
- L15946: of this license, apply to copying and distributing Project
- L15947: Gutenberg™ electronic works to protect the PROJECT GUTENBERG™
- L15948: concept and trademark. Project Gutenberg is a registered trademark,
- L15949: and may not be used if you charge for an eBook, except by following

## Structure Detection

- Detected structural convention: chapter-based roman numerals
- Selected heading strategy: chapter-roman
- TOC entries detected: no
- Body headings detected: yes
- Section count from selected strategy: 45
- Fallback used: no
- Fallback legitimacy: not required
- Fallback reason: not required
- Structure detection status: pass

### Candidate Heading Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 45 | 45 | 0 | yes |  |
| isolated-title-case | 266 | 225 | 41 | no | weaker than selected strategy chapter-roman |
| all-caps-title | 4 | 3 | 1 | no | weaker than selected strategy chapter-roman |

### Rejected Heading Strategies

| Pattern | Candidates | Body-like | TOC-like | Reason |
| --- | ---: | ---: | ---: | --- |
| isolated-title-case | 266 | 225 | 41 | weaker than selected strategy chapter-roman |
| all-caps-title | 4 | 3 | 1 | weaker than selected strategy chapter-roman |

### Structure Warnings

- None.

## Proposed Sections

- Total proposed sections: 46

| ID | Kind | Label | Title | Words | Default |
| --- | --- | --- | --- | ---: | --- |
| title-page-001 | title-page | Opening section |  | 198 | no |
| chapter-001 | chapter | Chapter 1 |  | 1011 | yes |
| chapter-002 | chapter | Chapter 2 |  | 2054 | yes |
| chapter-003 | chapter | Chapter 3 |  | 1640 | yes |
| chapter-004 | chapter | Chapter 4 |  | 4452 | yes |
| chapter-005 | chapter | Chapter 5 |  | 4189 | yes |
| chapter-006 | chapter | Chapter 6 |  | 4176 | yes |
| chapter-007 | chapter | Chapter 1 |  | 2467 | yes |
| chapter-008 | chapter | Chapter 2 |  | 2421 | yes |
| chapter-009 | chapter | Chapter 3 |  | 4911 | yes |
| chapter-010 | chapter | Chapter 4 |  | 2280 | yes |
| chapter-011 | chapter | Chapter 5 |  | 2160 | yes |
| chapter-012 | chapter | Chapter 6 |  | 4627 | yes |
| chapter-013 | chapter | Chapter 7 |  | 3342 | yes |
| chapter-014 | chapter | Chapter 8 |  | 1856 | yes |
| chapter-015 | chapter | Chapter 9 |  | 4092 | yes |
| chapter-016 | chapter | Chapter 10 |  | 2979 | yes |
| chapter-017 | chapter | Chapter 11 |  | 1426 | yes |
| chapter-018 | chapter | Chapter 12 |  | 2610 | yes |
| chapter-019 | chapter | Chapter 13 |  | 1854 | yes |
| chapter-020 | chapter | Chapter 14 |  | 3955 | yes |
| chapter-021 | chapter | Chapter 15 |  | 4241 | yes |
| chapter-022 | chapter | Chapter 16 |  | 3887 | yes |
| chapter-023 | chapter | Chapter 17 |  | 1918 | yes |
| chapter-024 | chapter | Chapter 18 |  | 2449 | yes |
| chapter-025 | chapter | Chapter 19 |  | 2809 | yes |
| chapter-026 | chapter | Chapter 20 |  | 1358 | yes |
| chapter-027 | chapter | Chapter 21 |  | 4307 | yes |
| chapter-028 | chapter | Chapter 22 |  | 2053 | yes |
| chapter-029 | chapter | Chapter 23 |  | 2634 | yes |
| chapter-030 | chapter | Chapter 24 |  | 4478 | yes |
| chapter-031 | chapter | Chapter 1 |  | 4259 | yes |
| chapter-032 | chapter | Chapter 2 |  | 2518 | yes |
| chapter-033 | chapter | Chapter 3 |  | 1740 | yes |
| chapter-034 | chapter | Chapter 4 |  | 2154 | yes |
| chapter-035 | chapter | Chapter 5 |  | 2296 | yes |
| chapter-036 | chapter | Chapter 6 |  | 2523 | yes |
| chapter-037 | chapter | Chapter 7 |  | 1878 | yes |
| chapter-038 | chapter | Chapter 8 |  | 4749 | yes |
| chapter-039 | chapter | Chapter 9 |  | 4713 | yes |
| chapter-040 | chapter | Chapter 10 |  | 5829 | yes |
| chapter-041 | chapter | Chapter 11 |  | 1475 | yes |
| chapter-042 | chapter | Chapter 12 |  | 3236 | yes |
| chapter-043 | chapter | Chapter 13 |  | 4427 | yes |
| chapter-044 | chapter | Chapter 14 |  | 4686 | yes |
| chapter-045 | chapter | Chapter 15 |  | 2257 | yes |

## Suspicious Sections

- Suspiciously short sections: None
- Suspiciously long sections: None

## Cleanup Simulation

| Action | Count | Recommendation | Samples |
| --- | ---: | --- | --- |
| remove-page-and-decorative-lines | 10 | Remove standalone page markers and decorative separators; do not remove prose punctuation. | candidate L13343: *****<br>candidate L13420: *****<br>candidate L13459: *****<br>candidate L13626: *****<br>candidate L13685: *****<br>candidate L13742: *****<br>candidate L13765: *****<br>candidate L13794: ***** |
| normalize-smart-quotes | 6921 | Normalize smart quotes to ASCII quotes only in candidate playback text. | ’<br>’<br>“<br>”<br>“ |

- Footnotes/references: No footnote/reference handling issue detected in the dry run.
- Illustration/image placeholders: No illustration/image placeholder issue detected in the dry run.
- Dash normalization: Normalize em/en dashes to simple spaced hyphens for Morse/audio playback in candidate output only.

## First-Hour Preview Candidate

- Feasible: yes
- Confidence: medium
- Sections used: chapter-001 Chapter 1
- Approximate word count: 1011
- Starts at real readable content: yes
- Snippet: CHAPTER I. The Period It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair, we had everything before us, we had nothing before...

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
- Decorative/page markers are cleanup candidates but not boundary blockers.
