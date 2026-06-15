# Pilot Dry Run: the-life-and-adventures-of-robinson-crusoe

- Source file: `The Life and Adventures of Robinson Crusoe.txt`
- Why selected: High-confidence chapter-Roman structure with prefatory material to review conservatively without severe boundary ambiguity.
- Pass-2 risk level: medium
- Existing generated output: no
- Candidate title: The Life and Adventures of Robinson Crusoe
- Candidate author: Daniel Defoe
- Final dry-run recommendation: process later with warnings

## Boundary Decision

- Dry-run adjustment: none.

- Raw word count: 124677
- Kept word count estimate: 121380
- Removed front matter word count estimate: 289
- Removed end matter word count estimate: 3008
- Candidate start: line 74, index 1755
- Start snippet: CHAPTER I. START IN LIFE I was born in the year 1632, in the city of York, of a good family, though not of that country, my father being a foreigner of Bremen, who settled first at Hull. He got a good estate by merchandise, and leaving

### 10-20 Lines Before Start

- L54: CHAPTER V—BUILDS A HOUSE—THE JOURNAL
- L55: CHAPTER VI—ILL AND CONSCIENCE-STRICKEN
- L56: CHAPTER VII—AGRICULTURAL EXPERIENCE
- L57: CHAPTER VIII—SURVEYS HIS POSITION
- L58: CHAPTER IX—A BOAT
- L59: CHAPTER X—TAMES GOATS
- L60: CHAPTER XI—FINDS PRINT OF MAN’S FOOT ON THE SAND
- L61: CHAPTER XII—A CAVE RETREAT
- L62: CHAPTER XIII—WRECK OF A SPANISH SHIP
- L63: CHAPTER XIV—A DREAM REALISED
- L64: CHAPTER XV—FRIDAY’S EDUCATION
- L65: CHAPTER XVI—RESCUE OF PRISONERS FROM CANNIBALS
- L66: CHAPTER XVII—VISIT OF MUTINEERS
- L67: CHAPTER XVIII—THE SHIP RECOVERED
- L68: CHAPTER XIX—RETURN TO ENGLAND
- L69: CHAPTER XX—FIGHT BETWEEN FRIDAY AND A BEAR
- L70: [blank]
- L71: [blank]
- L72: [blank]
- L73: [blank]

- Candidate end: line 10197, index 622406
- End snippet: recovered the possession of their plantation, and still lived upon the island. All these things, with some very surprising incidents in some new adventures of my own, for ten years more, I shall give a farther account of in the Second Part of my Story.

### 10-20 Lines After End

- L10198: [blank]
- L10199: [blank]
- L10200: [blank]
- L10201: [blank]
- L10202: *** END OF THE PROJECT GUTENBERG EBOOK THE LIFE AND ADVENTURES OF ROBINSON CRUSOE ***
- L10203: [blank]
- L10204: [blank]
- L10205: [blank]
- L10206: [blank]
- L10207: Updated editions will replace the previous one—the old editions will
- L10208: be renamed.
- L10209: [blank]
- L10210: Creating the works from print editions not protected by U.S. copyright
- L10211: law means that no one owns a United States copyright in these works,
- L10212: so the Foundation (and you!) can copy and distribute it in the United
- L10213: States without permission and without paying copyright
- L10214: royalties. Special rules, set forth in the General Terms of Use part
- L10215: of this license, apply to copying and distributing Project
- L10216: Gutenberg™ electronic works to protect the PROJECT GUTENBERG™
- L10217: concept and trademark. Project Gutenberg is a registered trademark,

## Structure Detection

- Detected structural convention: chapter-based roman numerals
- Selected heading strategy: chapter-roman
- TOC entries detected: no
- Body headings detected: yes
- Section count from selected strategy: 20
- Fallback used: no
- Fallback legitimacy: not required
- Fallback reason: not required
- Structure detection status: pass

### Candidate Heading Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 20 | 20 | 0 | yes |  |
| isolated-title-case | 4 | 4 | 0 | no | weaker than selected strategy chapter-roman |

### Rejected Heading Strategies

| Pattern | Candidates | Body-like | TOC-like | Reason |
| --- | ---: | ---: | ---: | --- |
| isolated-title-case | 4 | 4 | 0 | weaker than selected strategy chapter-roman |

### Structure Warnings

- None.

## Proposed Sections

- Total proposed sections: 20

| ID | Kind | Label | Title | Words | Default |
| --- | --- | --- | --- | ---: | --- |
| chapter-001 | chapter | Chapter 1 | START IN LIFE | 5270 | yes |
| chapter-002 | chapter | Chapter 2 | SLAVERY AND ESCAPE | 5210 | yes |
| chapter-003 | chapter | Chapter 3 | WRECKED ON A DESERT ISLAND | 7636 | yes |
| chapter-004 | chapter | Chapter 4 | FIRST WEEKS ON THE ISLAND | 8920 | yes |
| chapter-005 | chapter | Chapter 5 | BUILDS A HOUSE—THE JOURNAL | 5454 | yes |
| chapter-006 | chapter | Chapter 6 | ILL AND CONSCIENCE-STRICKEN | 5678 | yes |
| chapter-007 | chapter | Chapter 7 | AGRICULTURAL EXPERIENCE | 3918 | yes |
| chapter-008 | chapter | Chapter 8 | SURVEYS HIS POSITION | 4369 | yes |
| chapter-009 | chapter | Chapter 9 | A BOAT | 7004 | yes |
| chapter-010 | chapter | Chapter 10 | TAMES GOATS | 5005 | yes |
| chapter-011 | chapter | Chapter 11 | FINDS PRINT OF MAN’S FOOT ON THE SAND | 5577 | yes |
| chapter-012 | chapter | Chapter 12 | A CAVE RETREAT | 7087 | yes |
| chapter-013 | chapter | Chapter 13 | WRECK OF A SPANISH SHIP | 5574 | yes |
| chapter-014 | chapter | Chapter 14 | A DREAM REALISED | 6822 | yes |
| chapter-015 | chapter | Chapter 15 | FRIDAY’S EDUCATION | 6223 | yes |
| chapter-016 | chapter | Chapter 16 | RESCUE OF PRISONERS FROM CANNIBALS | 7112 | yes |
| chapter-017 | chapter | Chapter 17 | VISIT OF MUTINEERS | 6395 | yes |
| chapter-018 | chapter | Chapter 18 | THE SHIP RECOVERED | 6928 | yes |
| chapter-019 | chapter | Chapter 19 | RETURN TO ENGLAND | 6104 | yes |
| chapter-020 | chapter | Chapter 20 | FIGHT BETWEEN FRIDAY AND A BEAR | 5094 | yes |

## Suspicious Sections

- Suspiciously short sections: None
- Suspiciously long sections: None

## Cleanup Simulation

| Action | Count | Recommendation | Samples |
| --- | ---: | --- | --- |
| normalize-smart-quotes | 859 | Normalize smart quotes to ASCII quotes only in candidate playback text. | ’<br>’<br>’<br>’<br>“ |
| normalize-em-en-dashes | 333 | Normalize em/en dashes to spaced hyphen for Morse/audio playback, preserving sentence flow. | —<br>—<br>—<br>—<br>—<br>—<br>—<br>— |

- Footnotes/references: No footnote/reference handling issue detected in the dry run.
- Illustration/image placeholders: No illustration/image placeholder issue detected in the dry run.
- Dash normalization: Normalize em/en dashes to simple spaced hyphens for Morse/audio playback in candidate output only.

## First-Hour Preview Candidate

- Feasible: yes
- Confidence: medium
- Sections used: chapter-001 Chapter 1
- Approximate word count: 5270
- Starts at real readable content: yes
- Snippet: CHAPTER I. START IN LIFE I was born in the year 1632, in the city of York, of a good family, though not of that country, my father being a foreigner of Bremen, who settled first at Hull. He got a good estate by merchandise, and leaving off his trade, lived afterwards at York, from whence he had married my mother, whose relations were named Robinson, a very...

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
