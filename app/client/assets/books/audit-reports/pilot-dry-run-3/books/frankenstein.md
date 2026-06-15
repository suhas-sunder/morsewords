# Pilot Dry Run: frankenstein

- Source file: `Frankenstein.txt`
- Why selected: High-confidence chapter-Arabic structure with clear boundaries and a feasible first-hour preview; useful canonical novel baseline.
- Pass-2 risk level: medium
- Existing generated output: yes
- Candidate title: Frankenstein; or, the modern prometheus
- Candidate author: Mary Wollstonecraft Shelley
- Final dry-run recommendation: process later with warnings

## Boundary Decision

- Dry-run adjustment: none.

- Raw word count: 78439
- Kept word count estimate: 69645
- Removed front matter word count estimate: 5788
- Removed end matter word count estimate: 3006
- Candidate start: line 652, index 32552
- Start snippet: Chapter 1 I am by birth a Genevese, and my family is one of the most distinguished of that republic. My ancestors had been for many years counsellors and syndics, and my father had filled several public

### 10-20 Lines Before Start

- L632: destiny; listen to my history, and you will perceive how irrevocably it is
- L633: determined.”
- L634: [blank]
- L635: He then told me that he would commence his narrative the next day when I
- L636: should be at leisure. This promise drew from me the warmest thanks. I have
- L637: resolved every night, when I am not imperatively occupied by my duties, to
- L638: record, as nearly as possible in his own words, what he has related during
- L639: the day. If I should be engaged, I will at least make notes. This
- L640: manuscript will doubtless afford you the greatest pleasure; but to me, who
- L641: know him, and who hear it from his own lips—with what interest and
- L642: sympathy shall I read it in some future day! Even now, as I commence my
- L643: task, his full-toned voice swells in my ears; his lustrous eyes dwell on me
- L644: with all their melancholy sweetness; I see his thin hand raised in
- L645: animation, while the lineaments of his face are irradiated by the soul
- L646: within. Strange and harrowing must be his story, frightful the storm which
- L647: embraced the gallant vessel on its course and wrecked it—thus!
- L648: [blank]
- L649: [blank]
- L650: [blank]
- L651: [blank]

- Candidate end: line 7386, index 420347
- End snippet: will sleep in peace, or if it thinks, it will not surely think thus. Farewell.” He sprang from the cabin-window as he said this, upon the ice raft which lay close to the vessel. He was soon borne away by the waves and lost in darkness and distance.

### 10-20 Lines After End

- L7387: [blank]
- L7388: [blank]
- L7389: [blank]
- L7390: [blank]
- L7391: *** END OF THE PROJECT GUTENBERG EBOOK FRANKENSTEIN; OR, THE MODERN PROMETHEUS ***
- L7392: [blank]
- L7393: [blank]
- L7394: [blank]
- L7395: [blank]
- L7396: Updated editions will replace the previous one—the old editions will
- L7397: be renamed.
- L7398: [blank]
- L7399: Creating the works from print editions not protected by U.S. copyright
- L7400: law means that no one owns a United States copyright in these works,
- L7401: so the Foundation (and you!) can copy and distribute it in the United
- L7402: States without permission and without paying copyright
- L7403: royalties. Special rules, set forth in the General Terms of Use part
- L7404: of this license, apply to copying and distributing Project
- L7405: Gutenberg™ electronic works to protect the PROJECT GUTENBERG™
- L7406: concept and trademark. Project Gutenberg is a registered trademark,

## Structure Detection

- Detected structural convention: chapter-based arabic numbers
- Selected heading strategy: chapter-arabic
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
| chapter-arabic | 24 | 24 | 0 | yes |  |
| isolated-title-case | 13 | 12 | 1 | no | weaker than selected strategy chapter-arabic |
| roman-numbered-title | 4 | 4 | 0 | no | weaker than selected strategy chapter-arabic |

### Rejected Heading Strategies

| Pattern | Candidates | Body-like | TOC-like | Reason |
| --- | ---: | ---: | ---: | --- |
| isolated-title-case | 13 | 12 | 1 | weaker than selected strategy chapter-arabic |
| roman-numbered-title | 4 | 4 | 0 | weaker than selected strategy chapter-arabic |

### Structure Warnings

- None.

## Proposed Sections

- Total proposed sections: 24

| ID | Kind | Label | Title | Words | Default |
| --- | --- | --- | --- | ---: | --- |
| chapter-001 | chapter | Chapter 1 |  | 1781 | yes |
| chapter-002 | chapter | Chapter 2 |  | 2213 | yes |
| chapter-003 | chapter | Chapter 3 |  | 2690 | yes |
| chapter-004 | chapter | Chapter 4 |  | 2540 | yes |
| chapter-005 | chapter | Chapter 5 |  | 2361 | yes |
| chapter-006 | chapter | Chapter 6 |  | 2729 | yes |
| chapter-007 | chapter | Chapter 7 |  | 3574 | yes |
| chapter-008 | chapter | Chapter 8 |  | 3104 | yes |
| chapter-009 | chapter | Chapter 9 |  | 2226 | yes |
| chapter-010 | chapter | Chapter 10 |  | 2364 | yes |
| chapter-011 | chapter | Chapter 11 |  | 2912 | yes |
| chapter-012 | chapter | Chapter 12 |  | 2072 | yes |
| chapter-013 | chapter | Chapter 13 |  | 2040 | yes |
| chapter-014 | chapter | Chapter 14 |  | 1855 | yes |
| chapter-015 | chapter | Chapter 15 |  | 3019 | yes |
| chapter-016 | chapter | Chapter 16 |  | 3206 | yes |
| chapter-017 | chapter | Chapter 17 |  | 1922 | yes |
| chapter-018 | chapter | Chapter 18 |  | 2855 | yes |
| chapter-019 | chapter | Chapter 19 |  | 2618 | yes |
| chapter-020 | chapter | Chapter 20 |  | 3531 | yes |
| chapter-021 | chapter | Chapter 21 |  | 3747 | yes |
| chapter-022 | chapter | Chapter 22 |  | 3428 | yes |
| chapter-023 | chapter | Chapter 23 |  | 2600 | yes |
| chapter-024 | chapter | Chapter 24 |  | 8258 | yes |

## Suspicious Sections

- Suspiciously short sections: None
- Suspiciously long sections: None

## Cleanup Simulation

| Action | Count | Recommendation | Samples |
| --- | ---: | --- | --- |
| normalize-smart-quotes | 912 | Normalize smart quotes to ASCII quotes only in candidate playback text. | ’<br>’<br>’<br>’<br>’ |
| normalize-em-en-dashes | 106 | Normalize em/en dashes to spaced hyphen for Morse/audio playback, preserving sentence flow. | —<br>—<br>—<br>—<br>—<br>—<br>—<br>— |

- Footnotes/references: No footnote/reference handling issue detected in the dry run.
- Illustration/image placeholders: No illustration/image placeholder issue detected in the dry run.
- Dash normalization: Normalize em/en dashes to simple spaced hyphens for Morse/audio playback in candidate output only.

## First-Hour Preview Candidate

- Feasible: yes
- Confidence: medium
- Sections used: chapter-001 Chapter 1
- Approximate word count: 1781
- Starts at real readable content: yes
- Snippet: Chapter 1 I am by birth a Genevese, and my family is one of the most distinguished of that republic. My ancestors had been for many years counsellors and syndics, and my father had filled several public situations with honour and reputation. He was respected by all who knew him for his integrity and indefatigable attention to public business. He passed his...

## Existing Generated Output Comparison

- Manifest: app/client/assets/books/generated/frankenstein/manifest.json
- Section count: 26
- Default-included section count: 24
- First generated preview: Frankenstein; or, the Modern Prometheus by Mary Wollstonecraft (Godwin) Shelley
- Last generated preview: Chapter 24 My present situation was one in which all voluntary thought was swallowed up and lost. I was hurried away by fury; revenge alone endowed me with str...
- Apparent generated damage: suspiciously short generated sections

## Manual Review Checklist

- Confirm the first kept line is real readable content, not source metadata or a TOC entry.
- Confirm the final kept line is real book content and the Gutenberg/license footer is excluded.
- Confirm default-readable sections exclude TOC, transcriber notes, source/license text, and publisher catalog material.
- Check suspiciously short or long proposed sections before a real write pass.
- Verify cleanup removes playback-hostile artifacts without deleting dialogue, punctuation, paragraph structure, or headings.
- Confirm the first-hour preview candidate starts with real readable content.
- Compare candidate output against existing generated output because pass 2 flagged generated-output damage.

## Recommendation Reasons

- Table of contents appears isolated before readable content.
- Existing generated output warning: suspiciously short generated sections.
