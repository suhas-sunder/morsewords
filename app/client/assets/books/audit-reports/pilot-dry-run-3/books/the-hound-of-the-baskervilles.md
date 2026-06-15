# Pilot Dry Run: the-hound-of-the-baskervilles

- Source file: `The Hound of the Baskervilles.txt`
- Why selected: High-confidence chapter-Arabic structure with clear chapter titles and feasible preview source.
- Pass-2 risk level: medium
- Existing generated output: no
- Candidate title: The Hound of the Baskervilles
- Candidate author: Arthur Conan Doyle
- Final dry-run recommendation: process later with warnings

## Boundary Decision

- Dry-run adjustment: none.

- Raw word count: 62939
- Kept word count estimate: 59642
- Removed front matter word count estimate: 291
- Removed end matter word count estimate: 3006
- Candidate start: line 84, index 1765
- Start snippet: Chapter 1. Mr. Sherlock Holmes Mr. Sherlock Holmes, who was usually very late in the mornings, save upon those not infrequent occasions when he was up all

### 10-20 Lines Before Start

- L64: [blank]
- L65: Chapter 1 Mr. Sherlock Holmes
- L66: Chapter 2 The Curse of the Baskervilles
- L67: Chapter 3 The Problem
- L68: Chapter 4 Sir Henry Baskerville
- L69: Chapter 5 Three Broken Threads
- L70: Chapter 6 Baskerville Hall
- L71: Chapter 7 The Stapletons of Merripit House
- L72: Chapter 8 First Report of Dr. Watson
- L73: Chapter 9 The Light upon the Moor [Second Report of Dr. Watson]
- L74: Chapter 10 Extract from the Diary of Dr. Watson
- L75: Chapter 11 The Man on the Tor
- L76: Chapter 12 Death on the Moor
- L77: Chapter 13 Fixing the Nets
- L78: Chapter 14 The Hound of the Baskervilles
- L79: Chapter 15 A Retrospection
- L80: [blank]
- L81: [blank]
- L82: [blank]
- L83: [blank]

- Candidate end: line 7379, index 354982
- End snippet: for _Les Huguenots_. Have you heard the De Reszkes? Might I trouble you then to be ready in half an hour, and we can stop at Marcini’s for a little dinner on the way?” THE END

### 10-20 Lines After End

- L7380: [blank]
- L7381: [blank]
- L7382: [blank]
- L7383: *** END OF THE PROJECT GUTENBERG EBOOK THE HOUND OF THE BASKERVILLES ***
- L7384: [blank]
- L7385: [blank]
- L7386: [blank]
- L7387: [blank]
- L7388: Updated editions will replace the previous one—the old editions will
- L7389: be renamed.
- L7390: [blank]
- L7391: Creating the works from print editions not protected by U.S. copyright
- L7392: law means that no one owns a United States copyright in these works,
- L7393: so the Foundation (and you!) can copy and distribute it in the United
- L7394: States without permission and without paying copyright
- L7395: royalties. Special rules, set forth in the General Terms of Use part
- L7396: of this license, apply to copying and distributing Project
- L7397: Gutenberg™ electronic works to protect the PROJECT GUTENBERG™
- L7398: concept and trademark. Project Gutenberg is a registered trademark,
- L7399: and may not be used if you charge for an eBook, except by following

## Structure Detection

- Detected structural convention: chapter-based arabic numbers
- Selected heading strategy: chapter-arabic
- TOC entries detected: yes
- Body headings detected: yes
- Section count from selected strategy: 15
- Fallback used: no
- Fallback legitimacy: not required
- Fallback reason: not required
- Structure detection status: pass

### Candidate Heading Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-arabic | 15 | 15 | 0 | yes |  |
| isolated-title-case | 101 | 99 | 2 | no | weaker than selected strategy chapter-arabic |
| all-caps-title | 2 | 2 | 0 | no | weaker than selected strategy chapter-arabic |
| roman-numbered-title | 2 | 2 | 0 | no | weaker than selected strategy chapter-arabic |

### Rejected Heading Strategies

| Pattern | Candidates | Body-like | TOC-like | Reason |
| --- | ---: | ---: | ---: | --- |
| isolated-title-case | 101 | 99 | 2 | weaker than selected strategy chapter-arabic |
| all-caps-title | 2 | 2 | 0 | weaker than selected strategy chapter-arabic |
| roman-numbered-title | 2 | 2 | 0 | weaker than selected strategy chapter-arabic |

### Structure Warnings

- None.

## Proposed Sections

- Total proposed sections: 15

| ID | Kind | Label | Title | Words | Default |
| --- | --- | --- | --- | ---: | --- |
| chapter-001 | chapter | Chapter 1 |  | 2273 | yes |
| chapter-002 | chapter | Chapter 2 |  | 3875 | yes |
| chapter-003 | chapter | Chapter 3 |  | 2920 | yes |
| chapter-004 | chapter | Chapter 4 |  | 4093 | yes |
| chapter-005 | chapter | Chapter 5 |  | 3465 | yes |
| chapter-006 | chapter | Chapter 6 |  | 3523 | yes |
| chapter-007 | chapter | Chapter 7 |  | 5002 | yes |
| chapter-008 | chapter | Chapter 8 |  | 2771 | yes |
| chapter-009 | chapter | Chapter 9 |  | 6713 | yes |
| chapter-010 | chapter | Chapter 10 |  | 3718 | yes |
| chapter-011 | chapter | Chapter 11 |  | 4598 | yes |
| chapter-012 | chapter | Chapter 12 |  | 4902 | yes |
| chapter-013 | chapter | Chapter 13 |  | 3474 | yes |
| chapter-014 | chapter | Chapter 14 |  | 4212 | yes |
| chapter-015 | chapter | Chapter 15 |  | 4103 | yes |

## Suspicious Sections

- Suspiciously short sections: None
- Suspiciously long sections: None

## Cleanup Simulation

| Action | Count | Recommendation | Samples |
| --- | ---: | --- | --- |
| normalize-smart-quotes | 3205 | Normalize smart quotes to ASCII quotes only in candidate playback text. | “<br>”<br>“<br>”<br>“ |
| normalize-em-en-dashes | 156 | Normalize em/en dashes to spaced hyphen for Morse/audio playback, preserving sentence flow. | —<br>—<br>—<br>—<br>—<br>—<br>—<br>— |

- Footnotes/references: No footnote/reference handling issue detected in the dry run.
- Illustration/image placeholders: No illustration/image placeholder issue detected in the dry run.
- Dash normalization: Normalize em/en dashes to simple spaced hyphens for Morse/audio playback in candidate output only.

## First-Hour Preview Candidate

- Feasible: yes
- Confidence: medium
- Sections used: chapter-001 Chapter 1
- Approximate word count: 2273
- Starts at real readable content: yes
- Snippet: Chapter 1. Mr. Sherlock Holmes Mr. Sherlock Holmes, who was usually very late in the mornings, save upon those not infrequent occasions when he was up all night, was seated at the breakfast table. I stood upon the hearth-rug and picked up the stick which our visitor had left behind him the night before. It was a fine, thick piece of wood, bulbous-headed, of...

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
