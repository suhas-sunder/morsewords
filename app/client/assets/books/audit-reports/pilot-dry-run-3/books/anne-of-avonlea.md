# Pilot Dry Run: anne-of-avonlea

- Source file: `Anne of Avonlea.txt`
- Why selected: High-confidence standalone Roman sections with clear readable boundaries and a feasible preview candidate.
- Pass-2 risk level: medium
- Existing generated output: no
- Candidate title: Anne of Avonlea
- Candidate author: L. M. Montgomery
- Final dry-run recommendation: process later with warnings

## Boundary Decision

- Dry-run adjustment: none.

- Raw word count: 95082
- Kept word count estimate: 91915
- Removed front matter word count estimate: 163
- Removed end matter word count estimate: 3004
- Candidate start: line 49, index 1002
- Start snippet: Flowers spring to blossom where she walks The careful ways of duty, Our hard, stiff lines of life with her Are flowing curves of beauty. —WHITTIER

### 10-20 Lines Before Start

- L29: [blank]
- L30: [blank]
- L31: [blank]
- L32: [blank]
- L33: ANNE OF AVONLEA
- L34: [blank]
- L35: by Lucy Maud Montgomery
- L36: [blank]
- L37: [blank]
- L38: [blank]
- L39: [blank]
- L40: To
- L41: my former teacher
- L42: HATTIE GORDON SMITH
- L43: in grateful remembrance of her
- L44: sympathy and encouragement.
- L45: [blank]
- L46: [blank]
- L47: [blank]
- L48: [blank]

- Candidate end: line 9780, index 488941
- End snippet: Behind them in the garden the little stone house brooded among the shadows. It was lonely but not forsaken. It had not yet done with dreams and laughter and the joy of life; there were to be future summers for the little stone house; meanwhile, it could wait. And over the river in purple durance the echoes bided their time.

### 10-20 Lines After End

- L9781: [blank]
- L9782: [blank]
- L9783: [blank]
- L9784: *** END OF THE PROJECT GUTENBERG EBOOK ANNE OF AVONLEA ***
- L9785: [blank]
- L9786: [blank]
- L9787: [blank]
- L9788: [blank]
- L9789: Updated editions will replace the previous one—the old editions will
- L9790: be renamed.
- L9791: [blank]
- L9792: Creating the works from print editions not protected by U.S. copyright
- L9793: law means that no one owns a United States copyright in these works,
- L9794: so the Foundation (and you!) can copy and distribute it in the United
- L9795: States without permission and without paying copyright
- L9796: royalties. Special rules, set forth in the General Terms of Use part
- L9797: of this license, apply to copying and distributing Project
- L9798: Gutenberg™ electronic works to protect the PROJECT GUTENBERG™
- L9799: concept and trademark. Project Gutenberg is a registered trademark,
- L9800: and may not be used if you charge for an eBook, except by following

## Structure Detection

- Detected structural convention: standalone roman numeral sections
- Selected heading strategy: roman-only
- TOC entries detected: no
- Body headings detected: yes
- Section count from selected strategy: 30
- Fallback used: no
- Fallback legitimacy: not required
- Fallback reason: not required
- Structure detection status: pass

### Candidate Heading Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| roman-only | 30 | 30 | 0 | yes |  |
| isolated-title-case | 70 | 70 | 0 | no | weaker than selected strategy roman-only |
| all-caps-title | 2 | 1 | 1 | no | weaker than selected strategy roman-only |
| chapter-roman | 30 | 0 | 30 | no | rejected as TOC-like or front-matter-only evidence |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

### Rejected Heading Strategies

| Pattern | Candidates | Body-like | TOC-like | Reason |
| --- | ---: | ---: | ---: | --- |
| isolated-title-case | 70 | 70 | 0 | weaker than selected strategy roman-only |
| all-caps-title | 2 | 1 | 1 | weaker than selected strategy roman-only |
| chapter-roman | 30 | 0 | 30 | rejected as TOC-like or front-matter-only evidence |
| special-front-back | 1 | 0 | 1 | rejected as TOC-like or front-matter-only evidence |

### Structure Warnings

- None.

## Proposed Sections

- Total proposed sections: 31

| ID | Kind | Label | Title | Words | Default |
| --- | --- | --- | --- | ---: | --- |
| title-page-001 | title-page | Opening section |  | 218 | no |
| chapter-001 | chapter | Chapter 1 |  | 3524 | yes |
| chapter-002 | chapter | Chapter 2 |  | 2085 | yes |
| chapter-003 | chapter | Chapter 3 |  | 2455 | yes |
| chapter-004 | chapter | Chapter 4 |  | 1668 | yes |
| chapter-005 | chapter | Chapter 5 |  | 2385 | yes |
| chapter-006 | chapter | Chapter 6 |  | 3739 | yes |
| chapter-007 | chapter | Chapter 7 |  | 2022 | yes |
| chapter-008 | chapter | Chapter 8 |  | 3228 | yes |
| chapter-009 | chapter | Chapter 9 |  | 2150 | yes |
| chapter-010 | chapter | Chapter 10 |  | 3466 | yes |
| chapter-011 | chapter | Chapter 11 |  | 3283 | yes |
| chapter-012 | chapter | Chapter 12 |  | 2408 | yes |
| chapter-013 | chapter | Chapter 13 |  | 3457 | yes |
| chapter-014 | chapter | Chapter 14 |  | 3967 | yes |
| chapter-015 | chapter | Chapter 15 |  | 2753 | yes |
| chapter-016 | chapter | Chapter 16 |  | 2358 | yes |
| chapter-017 | chapter | Chapter 17 |  | 3708 | yes |
| chapter-018 | chapter | Chapter 18 |  | 3315 | yes |
| chapter-019 | chapter | Chapter 19 |  | 4043 | yes |
| chapter-020 | chapter | Chapter 20 |  | 2592 | yes |
| chapter-021 | chapter | Chapter 21 |  | 4405 | yes |
| chapter-022 | chapter | Chapter 22 |  | 1677 | yes |
| chapter-023 | chapter | Chapter 23 |  | 2497 | yes |
| chapter-024 | chapter | Chapter 24 |  | 2967 | yes |
| chapter-025 | chapter | Chapter 25 |  | 4440 | yes |
| chapter-026 | chapter | Chapter 26 |  | 4057 | yes |
| chapter-027 | chapter | Chapter 27 |  | 4298 | yes |
| chapter-028 | chapter | Chapter 28 |  | 3658 | yes |
| chapter-029 | chapter | Chapter 29 |  | 2371 | yes |
| chapter-030 | chapter | Chapter 30 |  | 2721 | yes |

## Suspicious Sections

- Suspiciously short sections: None
- Suspiciously long sections: None

## Cleanup Simulation

| Action | Count | Recommendation | Samples |
| --- | ---: | --- | --- |
| normalize-smart-quotes | 7184 | Normalize smart quotes to ASCII quotes only in candidate playback text. | ’<br>’<br>“<br>”<br>’ |
| normalize-em-en-dashes | 20 | Normalize em/en dashes to spaced hyphen for Morse/audio playback, preserving sentence flow. | —<br>—<br>—<br>—<br>—<br>—<br>—<br>— |

- Footnotes/references: No footnote/reference handling issue detected in the dry run.
- Illustration/image placeholders: Remove placeholder markers such as [Illustration] from playback text; preserve meaningful captions only after review.
- Dash normalization: Normalize em/en dashes to simple spaced hyphens for Morse/audio playback in candidate output only.

## First-Hour Preview Candidate

- Feasible: yes
- Confidence: medium
- Sections used: chapter-001 Chapter 1
- Approximate word count: 3524
- Starts at real readable content: yes
- Snippet: I An Irate Neighbor A tall, slim girl, “half-past sixteen,” with serious gray eyes and hair which her friends called auburn, had sat down on the broad red sandstone doorstep of a Prince Edward Island farmhouse one ripe afternoon in August, firmly resolved to construe so many lines of Virgil. But an August afternoon, with blue hazes scarfing the harvest slop...

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
- Table of contents detected near readable content.
- Illustration/image placeholders should be cleaned or suppressed later.
