# Pilot Dry Run: room-13

- Source file: `Room 13.txt`
- Why selected: Medium-risk novel with high-confidence boundaries and an end-note/correction edge case that should remain reviewable before writing.
- Pass-2 risk level: medium
- Existing generated output: no
- Candidate title: Room 13
- Candidate author: Edgar Wallace
- Final dry-run recommendation: process later with warnings

## Boundary Decision

- Dry-run adjustment: none.

- Raw word count: 64632
- Kept word count estimate: 61369
- Removed front matter word count estimate: 260
- Removed end matter word count estimate: 3003
- Candidate start: line 115, index 1663
- Start snippet: CHAPTER I Over the grim stone archway was carved the words: PARCERE SUBJECTIS.

### 10-20 Lines Before Start

- L95: Chapter XX
- L96: Chapter XXI
- L97: Chapter XXII
- L98: Chapter XXIII
- L99: Chapter XXIV
- L100: Chapter XXV
- L101: Chapter XXVI
- L102: Chapter XXVII
- L103: Chapter XXVIII
- L104: Chapter XXIX
- L105: Chapter XXX
- L106: Chapter XXXI
- L107: Chapter XXXII
- L108: Chapter XXXIII
- L109: 
- L110: 
- L111: 
- L112: 
- L113: ROOM 13
- L114: 

- Candidate end: line 8287, index 330236
- End snippet: [Chapter XXXI] “_John_ listened at the door; he was coming alone” to _Johnny_. [End of text]

### 10-20 Lines After End

- L8288: 
- L8289: 
- L8290: 
- L8291: 
- L8292: 
- L8293: 
- L8294: 
- L8295: 
- L8296: *** END OF THE PROJECT GUTENBERG EBOOK ROOM 13 ***
- L8297: 
- L8298: 
- L8299: 
- L8300: 
- L8301: Updated editions will replace the previous one—the old editions will
- L8302: be renamed.
- L8303: 
- L8304: Creating the works from print editions not protected by U.S. copyright
- L8305: law means that no one owns a United States copyright in these works,
- L8306: so the Foundation (and you!) can copy and distribute it in the United
- L8307: States without permission and without paying copyright

## Structure Detection

- Detected structural convention: chapter-based roman numerals
- Selected heading strategy: chapter-roman
- TOC entries detected: yes
- Body headings detected: yes
- Section count from selected strategy: 33
- Fallback used: no
- Fallback legitimacy: not required
- Fallback reason: not required
- Structure detection status: pass

### Candidate Heading Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 33 | 33 | 0 | yes |  |
| isolated-title-case | 77 | 72 | 5 | no | weaker than selected strategy chapter-roman |
| all-caps-title | 2 | 2 | 0 | no | weaker than selected strategy chapter-roman |
| arabic-numbered-title | 1 | 1 | 0 | no | weaker than selected strategy chapter-roman |

### Rejected Heading Strategies

| Pattern | Candidates | Body-like | TOC-like | Reason |
| --- | ---: | ---: | ---: | --- |
| isolated-title-case | 77 | 72 | 5 | weaker than selected strategy chapter-roman |
| all-caps-title | 2 | 2 | 0 | weaker than selected strategy chapter-roman |
| arabic-numbered-title | 1 | 1 | 0 | weaker than selected strategy chapter-roman |

### Structure Warnings

- None.

## Room 13 Regression

- Body chapter heading count: 33
- Final section count: 33
- TOC/body distinction: TOC-like entries were detected separately from body headings.
- Prior 2-section collapse fixed: yes

### Body Chapter Examples

- L1: CHAPTER I
- L289: CHAPTER II
- L655: CHAPTER III
- L954: CHAPTER IV
- L1134: CHAPTER V
- L1362: CHAPTER VI
- L1663: CHAPTER VII
- L1913: CHAPTER VIII

### TOC-Like Examples

- L64: Chapter I
- L65: Chapter II
- L66: Chapter III
- L67: Chapter IV
- L68: Chapter V
- L69: Chapter VI
- L70: Chapter VII
- L71: Chapter VIII

## Proposed Sections

- Total proposed sections: 33

| ID | Kind | Label | Title | Words | Default |
| --- | --- | --- | --- | ---: | --- |
| chapter-001 | chapter | Chapter 1 |  | 2343 | yes |
| chapter-002 | chapter | Chapter 2 |  | 2597 | yes |
| chapter-003 | chapter | Chapter 3 |  | 2089 | yes |
| chapter-004 | chapter | Chapter 4 |  | 1224 | yes |
| chapter-005 | chapter | Chapter 5 |  | 1522 | yes |
| chapter-006 | chapter | Chapter 6 |  | 2066 | yes |
| chapter-007 | chapter | Chapter 7 |  | 2074 | yes |
| chapter-008 | chapter | Chapter 8 |  | 1021 | yes |
| chapter-009 | chapter | Chapter 9 |  | 1497 | yes |
| chapter-010 | chapter | Chapter 10 |  | 2250 | yes |
| chapter-011 | chapter | Chapter 11 |  | 2168 | yes |
| chapter-012 | chapter | Chapter 12 |  | 2534 | yes |
| chapter-013 | chapter | Chapter 13 |  | 1562 | yes |
| chapter-014 | chapter | Chapter 14 |  | 564 | yes |
| chapter-015 | chapter | Chapter 15 |  | 1983 | yes |
| chapter-016 | chapter | Chapter 16 |  | 2317 | yes |
| chapter-017 | chapter | Chapter 17 |  | 975 | yes |
| chapter-018 | chapter | Chapter 18 |  | 1999 | yes |
| chapter-019 | chapter | Chapter 19 |  | 1416 | yes |
| chapter-020 | chapter | Chapter 20 |  | 1568 | yes |
| chapter-021 | chapter | Chapter 21 |  | 2830 | yes |
| chapter-022 | chapter | Chapter 22 |  | 1456 | yes |
| chapter-023 | chapter | Chapter 23 |  | 1885 | yes |
| chapter-024 | chapter | Chapter 24 |  | 1834 | yes |
| chapter-025 | chapter | Chapter 25 |  | 1704 | yes |
| chapter-026 | chapter | Chapter 26 |  | 3407 | yes |
| chapter-027 | chapter | Chapter 27 |  | 1804 | yes |
| chapter-028 | chapter | Chapter 28 |  | 2311 | yes |
| chapter-029 | chapter | Chapter 29 |  | 1933 | yes |
| chapter-030 | chapter | Chapter 30 |  | 1305 | yes |
| chapter-031 | chapter | Chapter 31 |  | 2114 | yes |
| chapter-032 | chapter | Chapter 32 |  | 1690 | yes |
| chapter-033 | chapter | Chapter 33 |  | 1327 | yes |

## Suspicious Sections

- Suspiciously short sections: None
- Suspiciously long sections: None

## Cleanup Simulation

| Action | Count | Recommendation | Samples |
| --- | ---: | --- | --- |
| remove-page-and-decorative-lines | 2 | Remove standalone page markers and decorative separators; do not remove prose punctuation. | candidate L903: * * * * *<br>candidate L3006: * * * * * |
| normalize-smart-quotes | 6112 | Normalize smart quotes to ASCII quotes only in candidate playback text. | “<br>”<br>“<br>”<br>’ |

- Footnotes/references: No footnote/reference handling issue detected in the dry run.
- Illustration/image placeholders: No illustration/image placeholder issue detected in the dry run.
- Dash normalization: Normalize em/en dashes to simple spaced hyphens for Morse/audio playback in candidate output only.

## First-Hour Preview Candidate

- Feasible: yes
- Confidence: medium
- Sections used: chapter-001 Chapter 1
- Approximate word count: 2343
- Starts at real readable content: yes
- Snippet: CHAPTER I Over the grim stone archway was carved the words: PARCERE SUBJECTIS. In cold weather, and employing the argot of his companions, Johnny Gray translated this as “Parky Subjects”--it certainly had no significance as “Spare the Vanquished,” for he had been neither vanquished nor spared. Day by day, harnessed to the shafts, he and Lal Morgon had pulle...

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
