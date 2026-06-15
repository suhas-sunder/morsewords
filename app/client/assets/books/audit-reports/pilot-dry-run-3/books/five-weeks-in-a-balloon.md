# Pilot Dry Run: five-weeks-in-a-balloon

- Source file: `Five Weeks in a Balloon.txt`
- Why selected: High-confidence chapter word-ordinal structure, selected to test a less common but regular heading convention.
- Pass-2 risk level: medium
- Existing generated output: no
- Candidate title: Five Weeks in a Balloon
- Candidate author: Jules Verne
- Final dry-run recommendation: process later with warnings

## Boundary Decision

- Dry-run adjustment: none.

- Raw word count: 96843
- Kept word count estimate: 93679
- Removed front matter word count estimate: 158
- Removed end matter word count estimate: 3006
- Candidate start: line 39, index 945
- Start snippet: Journeys And Discoveries In Africa By Three Englishmen. Compiled In French By Jules Verne,

### 10-20 Lines Before Start

- L19: [blank]
- L20: Language: English
- L21: [blank]
- L22: Original publication: New York: Appleton & Co., 1869
- L23: [blank]
- L24: Other information and formats: www.gutenberg.org/ebooks/3526
- L25: [blank]
- L26: Credits: Judy Boss and David Widger
- L27: [blank]
- L28: [blank]
- L29: *** START OF THE PROJECT GUTENBERG EBOOK FIVE WEEKS IN A BALLOON ***
- L30: [blank]
- L31: [Illustration]
- L32: [blank]
- L33: [blank]
- L34: [blank]
- L35: [blank]
- L36: FIVE WEEKS IN A BALLOON
- L37: [blank]
- L38: Or,

- Candidate end: line 12185, index 536571
- End snippet: recent expeditions of Messrs. Speke and Grant, De Heuglin and Muntzinger, who have been ascending to the sources of the Nile, and penetrating to the centre of Africa, we shall be enabled ere long to verify, in turn, the discoveries of Dr. Ferguson in that vast region comprised between the fourteenth and thirty-third degrees of east longitude.

### 10-20 Lines After End

- L12186: [blank]
- L12187: [blank]
- L12188: [blank]
- L12189: *** END OF THE PROJECT GUTENBERG EBOOK FIVE WEEKS IN A BALLOON ***
- L12190: [blank]
- L12191: [blank]
- L12192: [blank]
- L12193: [blank]
- L12194: Updated editions will replace the previous one—the old editions will
- L12195: be renamed.
- L12196: [blank]
- L12197: Creating the works from print editions not protected by U.S. copyright
- L12198: law means that no one owns a United States copyright in these works,
- L12199: so the Foundation (and you!) can copy and distribute it in the United
- L12200: States without permission and without paying copyright
- L12201: royalties. Special rules, set forth in the General Terms of Use part
- L12202: of this license, apply to copying and distributing Project
- L12203: Gutenberg™ electronic works to protect the PROJECT GUTENBERG™
- L12204: concept and trademark. Project Gutenberg is a registered trademark,
- L12205: and may not be used if you charge for an eBook, except by following

## Structure Detection

- Detected structural convention: chapter-based word ordinals
- Selected heading strategy: chapter-word
- TOC entries detected: yes
- Body headings detected: yes
- Section count from selected strategy: 39
- Fallback used: no
- Fallback legitimacy: not required
- Fallback reason: not required
- Structure detection status: pass

### Candidate Heading Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-word | 78 | 39 | 39 | yes |  |
| all-caps-title | 65 | 57 | 8 | no | weaker than selected strategy chapter-word |
| isolated-title-case | 271 | 264 | 7 | no | weaker than selected strategy chapter-word |
| arabic-numbered-title | 3 | 3 | 0 | no | weaker than selected strategy chapter-word |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

### Rejected Heading Strategies

| Pattern | Candidates | Body-like | TOC-like | Reason |
| --- | ---: | ---: | ---: | --- |
| all-caps-title | 65 | 57 | 8 | weaker than selected strategy chapter-word |
| isolated-title-case | 271 | 264 | 7 | weaker than selected strategy chapter-word |
| arabic-numbered-title | 3 | 3 | 0 | weaker than selected strategy chapter-word |
| special-front-back | 1 | 0 | 1 | rejected as TOC-like or front-matter-only evidence |

### Structure Warnings

- None.

## Proposed Sections

- Total proposed sections: 40

| ID | Kind | Label | Title | Words | Default |
| --- | --- | --- | --- | ---: | --- |
| title-page-001 | title-page | Opening section |  | 1847 | no |
| chapter-001 | chapter | Chapter 1 |  | 2280 | yes |
| chapter-002 | chapter | Chapter 2 |  | 1036 | yes |
| chapter-003 | chapter | Chapter 3 |  | 2389 | yes |
| chapter-004 | chapter | Chapter 4 |  | 1619 | yes |
| chapter-005 | chapter | Chapter 5 |  | 1719 | yes |
| chapter-006 | chapter | Chapter 6 |  | 1574 | yes |
| chapter-007 | chapter | Chapter 7 |  | 1425 | yes |
| chapter-008 | chapter | Chapter 8 |  | 1971 | yes |
| chapter-009 | chapter | Chapter 9 |  | 1525 | yes |
| chapter-010 | chapter | Chapter 10 |  | 1557 | yes |
| chapter-011 | chapter | Chapter 11 |  | 1978 | yes |
| chapter-012 | chapter | Chapter 12 |  | 2570 | yes |
| chapter-013 | chapter | Chapter 13 |  | 2051 | yes |
| chapter-014 | chapter | Chapter 14 |  | 2665 | yes |
| chapter-015 | chapter | Chapter 15 |  | 3383 | yes |
| chapter-016 | chapter | Chapter 16 |  | 2835 | yes |
| chapter-017 | chapter | Chapter 17 |  | 2837 | yes |
| chapter-018 | chapter | Chapter 18 |  | 3018 | yes |
| chapter-019 | chapter | Chapter 19 |  | 1662 | yes |
| chapter-020 | chapter | Chapter 20 |  | 1868 | yes |
| chapter-021 | chapter | Chapter 20 | FIRST | 2482 | yes |
| chapter-022 | chapter | Chapter 20 | SECOND | 2539 | yes |
| chapter-023 | chapter | Chapter 20 | THIRD | 2408 | yes |
| chapter-024 | chapter | Chapter 20 | FOURTH | 2507 | yes |
| chapter-025 | chapter | Chapter 20 | FIFTH | 1938 | yes |
| chapter-026 | chapter | Chapter 20 | SIXTH | 2126 | yes |
| chapter-027 | chapter | Chapter 20 | SEVENTH | 1918 | yes |
| chapter-028 | chapter | Chapter 20 | EIGHTH | 1960 | yes |
| chapter-029 | chapter | Chapter 20 | NINTH | 2056 | yes |
| chapter-030 | chapter | Chapter 30 |  | 2609 | yes |
| chapter-031 | chapter | Chapter 30 | FIRST | 1556 | yes |
| chapter-032 | chapter | Chapter 30 | SECOND | 1758 | yes |
| chapter-033 | chapter | Chapter 30 | THIRD | 2309 | yes |
| chapter-034 | chapter | Chapter 30 | FOURTH | 1645 | yes |
| chapter-035 | chapter | Chapter 30 | FIFTH | 3262 | yes |
| chapter-036 | chapter | Chapter 30 | SIXTH | 1745 | yes |
| chapter-037 | chapter | Chapter 30 | SEVENTH | 1987 | yes |
| chapter-038 | chapter | Chapter 30 | EIGHTH | 2634 | yes |
| chapter-039 | chapter | Chapter 30 | NINTH | 10431 | yes |

## Suspicious Sections

- Suspiciously short sections: None
- Suspiciously long sections: None

## Cleanup Simulation

| Action | Count | Recommendation | Samples |
| --- | ---: | --- | --- |
| remove-numbered-reference-markers | 8 | Remove inline numeric reference markers from playback text; keep footnote prose only after manual review. | [1]<br>[1]<br>[2]<br>[2]<br>[3]<br>[3]<br>[4]<br>[4] |
| remove-page-and-decorative-lines | 1 | Remove standalone page markers and decorative separators; do not remove prose punctuation. | candidate L1907: ————— |
| normalize-smart-quotes | 5215 | Normalize smart quotes to ASCII quotes only in candidate playback text. | “<br>”<br>’<br>’<br>“ |
| normalize-em-en-dashes | 998 | Normalize em/en dashes to spaced hyphen for Morse/audio playback, preserving sentence flow. | —<br>—<br>—<br>—<br>—<br>—<br>—<br>— |

- Footnotes/references: Review footnote/reference markers before processing; remove orphan inline markers from playback, and include note prose only if needed for comprehension.
- Illustration/image placeholders: Remove placeholder markers such as [Illustration] from playback text; preserve meaningful captions only after review.
- Dash normalization: Normalize em/en dashes to simple spaced hyphens for Morse/audio playback in candidate output only.

## First-Hour Preview Candidate

- Feasible: yes
- Confidence: medium
- Sections used: chapter-001 Chapter 1
- Approximate word count: 2280
- Starts at real readable content: yes
- Snippet: CHAPTER FIRST. The End of a much-applauded Speech.—The Presentation of Dr. Samuel Ferguson.—Excelsior.—Full-length Portrait of the Doctor.—A Fatalist convinced.—A Dinner at the Travellers’ Club.—Several Toasts for the Occasion. There was a large audience assembled on the 14th of January, 1862, at the session of the Royal Geographical Society, No. 3 Waterloo...

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
