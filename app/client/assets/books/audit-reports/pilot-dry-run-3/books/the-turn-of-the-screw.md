# Pilot Dry Run: the-turn-of-the-screw

- Source file: `The Turn of the Screw.txt`
- Why selected: High-confidence standalone Roman sections with clear narrative divisions and manageable cleanup risk.
- Pass-2 risk level: medium
- Existing generated output: no
- Candidate title: The Turn of the Screw
- Candidate author: Henry James
- Final dry-run recommendation: process later with warnings

## Boundary Decision

- Dry-run adjustment: none.

- Raw word count: 46568
- Kept word count estimate: 42081
- Removed front matter word count estimate: 1481
- Removed end matter word count estimate: 3006
- Candidate start: line 219, index 7790
- Start snippet: “The outbreak,” I returned, “will make a tremendous occasion of Thursday night;” and everyone so agreed with me that, in the light of it, we lost all attention for everything else. The last story, however incomplete and like the mere opening of a serial, had been told; we handshook and “candlestuck,” as somebody said, and went to bed.

### 10-20 Lines Before Start

- L199: [blank]
- L200: “More’s the pity, then. That’s the only way I ever understand.”
- L201: [blank]
- L202: “Won’t _you_ tell, Douglas?” somebody else inquired.
- L203: [blank]
- L204: He sprang to his feet again. “Yes—tomorrow. Now I must go to bed. Good
- L205: night.” And quickly catching up a candlestick, he left us slightly
- L206: bewildered. From our end of the great brown hall we heard his step on
- L207: the stair; whereupon Mrs. Griffin spoke. “Well, if I don’t know who she
- L208: was in love with, I know who _he_ was.”
- L209: [blank]
- L210: “She was ten years older,” said her husband.
- L211: [blank]
- L212: “_Raison de plus_—at that age! But it’s rather nice, his long
- L213: reticence.”
- L214: [blank]
- L215: “Forty years!” Griffin put in.
- L216: [blank]
- L217: “With this outbreak at last.”
- L218: [blank]

- Candidate end: line 4576, index 229291
- End snippet: he uttered the cry of a creature hurled over an abyss, and the grasp with which I recovered him might have been that of catching him in his fall. I caught him, yes, I held him—it may be imagined with what a passion; but at the end of a minute I began to feel what it truly was that I held. We were alone with the quiet day, and his little heart, dispossessed, had stopped.

### 10-20 Lines After End

- L4577: [blank]
- L4578: [blank]
- L4579: [blank]
- L4580: *** END OF THE PROJECT GUTENBERG EBOOK THE TURN OF THE SCREW ***
- L4581: [blank]
- L4582: [blank]
- L4583: [blank]
- L4584: [blank]
- L4585: Updated editions will replace the previous one—the old editions will
- L4586: be renamed.
- L4587: [blank]
- L4588: Creating the works from print editions not protected by U.S. copyright
- L4589: law means that no one owns a United States copyright in these works,
- L4590: so the Foundation (and you!) can copy and distribute it in the United
- L4591: States without permission and without paying copyright
- L4592: royalties. Special rules, set forth in the General Terms of Use part
- L4593: of this license, apply to copying and distributing Project
- L4594: Gutenberg™ electronic works to protect the PROJECT GUTENBERG™
- L4595: concept and trademark. Project Gutenberg is a registered trademark,
- L4596: and may not be used if you charge for an eBook, except by following

## Structure Detection

- Detected structural convention: standalone roman numeral sections
- Selected heading strategy: roman-only
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
| roman-only | 24 | 24 | 0 | yes |  |
| isolated-title-case | 17 | 17 | 0 | no | weaker than selected strategy roman-only |

### Rejected Heading Strategies

| Pattern | Candidates | Body-like | TOC-like | Reason |
| --- | ---: | ---: | ---: | --- |
| isolated-title-case | 17 | 17 | 0 | weaker than selected strategy roman-only |

### Structure Warnings

- None.

## Proposed Sections

- Total proposed sections: 25

| ID | Kind | Label | Title | Words | Default |
| --- | --- | --- | --- | ---: | --- |
| title-page-001 | title-page | Opening section |  | 1545 | no |
| chapter-001 | chapter | Chapter 1 |  | 1737 | yes |
| chapter-002 | chapter | Chapter 2 |  | 1465 | yes |
| chapter-003 | chapter | Chapter 3 |  | 2195 | yes |
| chapter-004 | chapter | Chapter 4 |  | 2164 | yes |
| chapter-005 | chapter | Chapter 5 |  | 1276 | yes |
| chapter-006 | chapter | Chapter 6 |  | 2740 | yes |
| chapter-007 | chapter | Chapter 7 |  | 1476 | yes |
| chapter-008 | chapter | Chapter 8 |  | 2061 | yes |
| chapter-009 | chapter | Chapter 9 |  | 2013 | yes |
| chapter-010 | chapter | Chapter 10 |  | 1775 | yes |
| chapter-011 | chapter | Chapter 11 |  | 1514 | yes |
| chapter-012 | chapter | Chapter 12 |  | 1197 | yes |
| chapter-013 | chapter | Chapter 13 |  | 2074 | yes |
| chapter-014 | chapter | Chapter 14 |  | 1386 | yes |
| chapter-015 | chapter | Chapter 15 |  | 1220 | yes |
| chapter-016 | chapter | Chapter 16 |  | 1006 | yes |
| chapter-017 | chapter | Chapter 17 |  | 1708 | yes |
| chapter-018 | chapter | Chapter 18 |  | 1211 | yes |
| chapter-019 | chapter | Chapter 19 |  | 1384 | yes |
| chapter-020 | chapter | Chapter 20 |  | 1865 | yes |
| chapter-021 | chapter | Chapter 21 |  | 2174 | yes |
| chapter-022 | chapter | Chapter 22 |  | 1482 | yes |
| chapter-023 | chapter | Chapter 23 |  | 1453 | yes |
| chapter-024 | chapter | Chapter 24 |  | 1960 | yes |

## Suspicious Sections

- Suspiciously short sections: None
- Suspiciously long sections: None

## Cleanup Simulation

| Action | Count | Recommendation | Samples |
| --- | ---: | --- | --- |
| normalize-smart-quotes | 2437 | Normalize smart quotes to ASCII quotes only in candidate playback text. | “<br>”<br>“<br>”<br>“ |
| normalize-em-en-dashes | 619 | Normalize em/en dashes to spaced hyphen for Morse/audio playback, preserving sentence flow. | —<br>—<br>—<br>—<br>—<br>—<br>—<br>— |

- Footnotes/references: No footnote/reference handling issue detected in the dry run.
- Illustration/image placeholders: No illustration/image placeholder issue detected in the dry run.
- Dash normalization: Normalize em/en dashes to simple spaced hyphens for Morse/audio playback in candidate output only.

## First-Hour Preview Candidate

- Feasible: yes
- Confidence: medium
- Sections used: chapter-001 Chapter 1
- Approximate word count: 1737
- Starts at real readable content: yes
- Snippet: I I remember the whole beginning as a succession of flights and drops, a little seesaw of the right throbs and the wrong. After rising, in town, to meet his appeal, I had at all events a couple of very bad days—found myself doubtful again, felt indeed sure I had made a mistake. In this state of mind I spent the long hours of bumping, swinging coach that car...

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
- Table of contents appears isolated before readable content.
