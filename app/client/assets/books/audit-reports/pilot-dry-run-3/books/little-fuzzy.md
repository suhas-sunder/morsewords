# Pilot Dry Run: little-fuzzy

- Source file: `Little Fuzzy.txt`
- Why selected: High-confidence standalone Roman-numbered sections, selected to test section numbering that is not explicitly chapter-labeled.
- Pass-2 risk level: medium
- Existing generated output: no
- Candidate title: Little Fuzzy
- Candidate author: H. Beam Piper
- Final dry-run recommendation: process later with warnings

## Boundary Decision

- Dry-run adjustment: none.

- Raw word count: 62323
- Kept word count estimate: 59136
- Removed front matter word count estimate: 176
- Removed end matter word count estimate: 3011
- Candidate start: line 50, index 1097
- Start snippet: Jack Holloway found himself squinting, the orange sun full in his eyes. He raised a hand to push his hat forward, then lowered it to the controls to alter the pulse rate of the contragravity-field generators and lift the manipulator another hundred feet. For a moment he sat, puffing on the short pipe that had yellowed the corners of his white mustache, and looked down at the red rag tied to a bush against the rock face of the gorge five

### 10-20 Lines Before Start

- L30: E-text prepared by Greg Weeks, Barbara Tozier, and the Project Gutenberg
- L31: Online Distributed Proofreading Team (http://www.pgdp.net/)
- L32: [blank]
- L33: [blank]
- L34: [blank]
- L35: LITTLE FUZZY
- L36: [blank]
- L37: by
- L38: [blank]
- L39: H. Beam Piper
- L40: [blank]
- L41: [blank]
- L42: [blank]
- L43: [blank]
- L44: [blank]
- L45: [blank]
- L46: [blank]
- L47: I
- L48: [blank]
- L49: [blank]

- Candidate end: line 6932, index 339211
- End snippet: * * * * *

### 10-20 Lines After End

- L6933: Transcriber's note:
- L6934: [blank]
- L6935: Numerous typographical errors have been corrected.
- L6936: [blank]
- L6937: [blank]
- L6938: [blank]
- L6939: [blank]
- L6940: [blank]
- L6941: [blank]
- L6942: *** END OF THE PROJECT GUTENBERG EBOOK LITTLE FUZZY ***
- L6943: [blank]
- L6944: [blank]
- L6945: [blank]
- L6946: [blank]
- L6947: Updated editions will replace the previous one—the old editions will
- L6948: be renamed.
- L6949: [blank]
- L6950: Creating the works from print editions not protected by U.S. copyright
- L6951: law means that no one owns a United States copyright in these works,
- L6952: so the Foundation (and you!) can copy and distribute it in the United

## Structure Detection

- Detected structural convention: standalone roman numeral sections
- Selected heading strategy: roman-only
- TOC entries detected: no
- Body headings detected: yes
- Section count from selected strategy: 16
- Fallback used: no
- Fallback legitimacy: not required
- Fallback reason: not required
- Structure detection status: pass

### Candidate Heading Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| roman-only | 16 | 16 | 0 | yes |  |
| isolated-title-case | 72 | 72 | 0 | no | weaker than selected strategy roman-only |

### Rejected Heading Strategies

| Pattern | Candidates | Body-like | TOC-like | Reason |
| --- | ---: | ---: | ---: | --- |
| isolated-title-case | 72 | 72 | 0 | weaker than selected strategy roman-only |

### Structure Warnings

- None.

## Proposed Sections

- Total proposed sections: 17

| ID | Kind | Label | Title | Words | Default |
| --- | --- | --- | --- | ---: | --- |
| title-page-001 | title-page | Opening section |  | 3815 | no |
| chapter-001 | chapter | Chapter 2 |  | 4754 | yes |
| chapter-002 | chapter | Chapter 3 |  | 3055 | yes |
| chapter-003 | chapter | Chapter 4 |  | 2109 | yes |
| chapter-004 | chapter | Chapter 5 |  | 5224 | yes |
| chapter-005 | chapter | Chapter 6 |  | 5025 | yes |
| chapter-006 | chapter | Chapter 7 |  | 4625 | yes |
| chapter-007 | chapter | Chapter 8 |  | 4048 | yes |
| chapter-008 | chapter | Chapter 9 |  | 3019 | yes |
| chapter-009 | chapter | Chapter 10 |  | 3860 | yes |
| chapter-010 | chapter | Chapter 11 |  | 2565 | yes |
| chapter-011 | chapter | Chapter 12 |  | 4500 | yes |
| chapter-012 | chapter | Chapter 13 |  | 1439 | yes |
| chapter-013 | chapter | Chapter 14 |  | 5387 | yes |
| chapter-014 | chapter | Chapter 15 |  | 1636 | yes |
| chapter-015 | chapter | Chapter 16 |  | 2725 | yes |
| chapter-016 | chapter | Chapter 17 |  | 1350 | yes |

## Suspicious Sections

- Suspiciously short sections: None
- Suspiciously long sections: None

## Cleanup Simulation

| Action | Count | Recommendation | Samples |
| --- | ---: | --- | --- |
| remove-page-and-decorative-lines | 43 | Remove standalone page markers and decorative separators; do not remove prose punctuation. | candidate L123: * * * * *<br>candidate L325: * * * * *<br>candidate L697: * * * * *<br>candidate L844: * * * * *<br>candidate L987: * * * * *<br>candidate L1054: * * * * *<br>candidate L1391: * * * * *<br>candidate L1659: * * * * * |

- Footnotes/references: No footnote/reference handling issue detected in the dry run.
- Illustration/image placeholders: No illustration/image placeholder issue detected in the dry run.
- Dash normalization: Normalize em/en dashes to simple spaced hyphens for Morse/audio playback in candidate output only.

## First-Hour Preview Candidate

- Feasible: yes
- Confidence: medium
- Sections used: chapter-001 Chapter 2
- Approximate word count: 4754
- Starts at real readable content: yes
- Snippet: II Jack Holloway landed the manipulator in front of the cluster of prefab huts. For a moment he sat still, realizing that he was tired, and then he climbed down from the control cabin and crossed the open grass to the door of the main living hut, opening it and reaching in to turn on the lights. Then he hesitated, looking up at Darius. There was a wide ring...

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

- Medium-confidence start boundary remains manageable but needs review.
- Transcriber/editor notes are present and should stay out of readable defaults.
- Decorative/page markers are cleanup candidates but not boundary blockers.
