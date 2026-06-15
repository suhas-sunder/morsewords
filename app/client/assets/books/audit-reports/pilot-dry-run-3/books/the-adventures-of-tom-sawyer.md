# Pilot Dry Run: the-adventures-of-tom-sawyer

- Source file: `The Adventures of Tom Sawyer.txt`
- Why selected: High-confidence chapter-Roman structure with regular chapters and low severe-artifact risk.
- Pass-2 risk level: medium
- Existing generated output: no
- Candidate title: The Adventures of Tom Sawyer, Complete
- Candidate author: Mark Twain
- Final dry-run recommendation: process later with warnings

## Boundary Decision

- Dry-run adjustment: none.

- Raw word count: 77052
- Kept word count estimate: 72807
- Removed front matter word count estimate: 1238
- Removed end matter word count estimate: 3007
- Candidate start: line 491, index 7555
- Start snippet: CHAPTER I “Tom!” No answer.

### 10-20 Lines Before Start

- L471: individual—he is a combination of the characteristics of three boys whom
- L472: I knew, and therefore belongs to the composite order of architecture.
- L473: [blank]
- L474: The odd superstitions touched upon were all prevalent among children and
- L475: slaves in the West at the period of this story—that is to say, thirty or
- L476: forty years ago.
- L477: [blank]
- L478: Although my book is intended mainly for the entertainment of boys and
- L479: girls, I hope it will not be shunned by men and women on that account,
- L480: for part of my plan has been to try to pleasantly remind adults of what
- L481: they once were themselves, and of how they felt and thought and talked,
- L482: and what queer enterprises they sometimes engaged in.
- L483: [blank]
- L484: THE AUTHOR.
- L485: [blank]
- L486: HARTFORD, 1876.
- L487: [blank]
- L488: [blank]
- L489: [blank]
- L490: [blank]

- Candidate end: line 8915, index 393599
- End snippet: Most of the characters that perform in this book still live, and are prosperous and happy. Some day it may seem worth while to take up the story of the younger ones again and see what sort of men and women they turned out to be; therefore it will be wisest not to reveal any of that part of their lives at present.

### 10-20 Lines After End

- L8916: [blank]
- L8917: [blank]
- L8918: [blank]
- L8919: [blank]
- L8920: [blank]
- L8921: [blank]
- L8922: *** END OF THE PROJECT GUTENBERG EBOOK THE ADVENTURES OF TOM SAWYER, COMPLETE ***
- L8923: [blank]
- L8924: [blank]
- L8925: [blank]
- L8926: [blank]
- L8927: Updated editions will replace the previous one—the old editions will
- L8928: be renamed.
- L8929: [blank]
- L8930: Creating the works from print editions not protected by U.S. copyright
- L8931: law means that no one owns a United States copyright in these works,
- L8932: so the Foundation (and you!) can copy and distribute it in the United
- L8933: States without permission and without paying copyright
- L8934: royalties. Special rules, set forth in the General Terms of Use part
- L8935: of this license, apply to copying and distributing Project

## Structure Detection

- Detected structural convention: chapter-based roman numerals
- Selected heading strategy: chapter-roman
- TOC entries detected: yes
- Body headings detected: yes
- Section count from selected strategy: 35
- Fallback used: no
- Fallback legitimacy: not required
- Fallback reason: not required
- Structure detection status: pass

### Candidate Heading Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 35 | 35 | 0 | yes |  |
| isolated-title-case | 85 | 83 | 2 | no | weaker than selected strategy chapter-roman |
| all-caps-title | 6 | 6 | 0 | no | weaker than selected strategy chapter-roman |
| roman-numbered-title | 1 | 1 | 0 | no | weaker than selected strategy chapter-roman |

### Rejected Heading Strategies

| Pattern | Candidates | Body-like | TOC-like | Reason |
| --- | ---: | ---: | ---: | --- |
| isolated-title-case | 85 | 83 | 2 | weaker than selected strategy chapter-roman |
| all-caps-title | 6 | 6 | 0 | weaker than selected strategy chapter-roman |
| roman-numbered-title | 1 | 1 | 0 | weaker than selected strategy chapter-roman |

### Structure Warnings

- None.

## Proposed Sections

- Total proposed sections: 35

| ID | Kind | Label | Title | Words | Default |
| --- | --- | --- | --- | ---: | --- |
| chapter-001 | chapter | Chapter 1 |  | 2525 | yes |
| chapter-002 | chapter | Chapter 2 |  | 1961 | yes |
| chapter-003 | chapter | Chapter 3 |  | 2290 | yes |
| chapter-004 | chapter | Chapter 4 |  | 3516 | yes |
| chapter-005 | chapter | Chapter 5 |  | 1935 | yes |
| chapter-006 | chapter | Chapter 6 |  | 3666 | yes |
| chapter-007 | chapter | Chapter 7 |  | 2003 | yes |
| chapter-008 | chapter | Chapter 8 |  | 1775 | yes |
| chapter-009 | chapter | Chapter 9 |  | 2241 | yes |
| chapter-010 | chapter | Chapter 10 |  | 2135 | yes |
| chapter-011 | chapter | Chapter 11 |  | 1522 | yes |
| chapter-012 | chapter | Chapter 12 |  | 1719 | yes |
| chapter-013 | chapter | Chapter 13 |  | 2520 | yes |
| chapter-014 | chapter | Chapter 14 |  | 2105 | yes |
| chapter-015 | chapter | Chapter 15 |  | 1724 | yes |
| chapter-016 | chapter | Chapter 16 |  | 3272 | yes |
| chapter-017 | chapter | Chapter 17 |  | 1149 | yes |
| chapter-018 | chapter | Chapter 18 |  | 3009 | yes |
| chapter-019 | chapter | Chapter 19 |  | 832 | yes |
| chapter-020 | chapter | Chapter 20 |  | 1734 | yes |
| chapter-021 | chapter | Chapter 21 |  | 2183 | yes |
| chapter-022 | chapter | Chapter 22 |  | 1027 | yes |
| chapter-023 | chapter | Chapter 23 |  | 2023 | yes |
| chapter-024 | chapter | Chapter 24 |  | 419 | yes |
| chapter-025 | chapter | Chapter 25 |  | 2236 | yes |
| chapter-026 | chapter | Chapter 26 |  | 2723 | yes |
| chapter-027 | chapter | Chapter 27 |  | 1028 | yes |
| chapter-028 | chapter | Chapter 28 |  | 1149 | yes |
| chapter-029 | chapter | Chapter 29 |  | 2677 | yes |
| chapter-030 | chapter | Chapter 30 |  | 3154 | yes |
| chapter-031 | chapter | Chapter 31 |  | 3076 | yes |
| chapter-032 | chapter | Chapter 32 |  | 1046 | yes |
| chapter-033 | chapter | Chapter 33 |  | 3493 | yes |
| chapter-034 | chapter | Chapter 34 |  | 922 | yes |
| chapter-035 | chapter | Chapter 35 |  | 2018 | yes |

## Suspicious Sections

- Suspiciously short sections: None
- Suspiciously long sections: None

## Cleanup Simulation

| Action | Count | Recommendation | Samples |
| --- | ---: | --- | --- |
| normalize-smart-quotes | 5467 | Normalize smart quotes to ASCII quotes only in candidate playback text. | “<br>”<br>“<br>”<br>“ |
| normalize-em-en-dashes | 846 | Normalize em/en dashes to spaced hyphen for Morse/audio playback, preserving sentence flow. | —<br>—<br>—<br>—<br>—<br>—<br>—<br>— |

- Footnotes/references: No footnote/reference handling issue detected in the dry run.
- Illustration/image placeholders: No illustration/image placeholder issue detected in the dry run.
- Dash normalization: Normalize em/en dashes to simple spaced hyphens for Morse/audio playback in candidate output only.

## First-Hour Preview Candidate

- Feasible: yes
- Confidence: medium
- Sections used: chapter-001 Chapter 1
- Approximate word count: 2525
- Starts at real readable content: yes
- Snippet: CHAPTER I “Tom!” No answer. “TOM!” No answer. “What’s gone with that boy, I wonder? You TOM!” No answer. The old lady pulled her spectacles down and looked over them about the room; then she put them up and looked out under them. She seldom or never looked _through_ them for so small a thing as a boy; they were her state pair, the pride of her heart, and we...

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
