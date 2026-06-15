# Pilot Dry Run: the-three-musketeers

- Source file: `the-three-musketeers.txt`
- Why selected: High-confidence chapter-Roman structure with many regular chapters, selected to test longer adventure fiction without severe boundary ambiguity.
- Pass-2 risk level: medium
- Existing generated output: yes
- Candidate title: The three musketeers
- Candidate author: Alexandre Dumas Auguste Maquet
- Final dry-run recommendation: process later with warnings

## Boundary Decision

- Dry-run adjustment: none.

- Raw word count: 236958
- Kept word count estimate: 232555
- Removed front matter word count estimate: 1399
- Removed end matter word count estimate: 3004
- Candidate start: line 206, index 8265
- Start snippet: Chapter I. THE THREE PRESENTS OF D’ARTAGNAN THE ELDER On the first Monday of the month of April, 1625, the market town of Meung, in which the author of _Romance of the Rose_ was born, appeared

### 10-20 Lines Before Start

- L186: Now, this is the first part of this precious manuscript which we offer
- L187: to our readers, restoring it to the title which belongs to it, and
- L188: entering into an engagement that if (of which we have no doubt) this
- L189: first part should obtain the success it merits, we will publish the
- L190: second immediately.
- L191: [blank]
- L192: In the meanwhile, as the godfather is a second father, we beg the
- L193: reader to lay to our account, and not to that of the Comte de la Fère,
- L194: the pleasure or the _ennui_ he may experience.
- L195: [blank]
- L196: This being understood, let us proceed with our history.
- L197: [blank]
- L198: [blank]
- L199: [blank]
- L200: [blank]
- L201: The Three Musketeers
- L202: [blank]
- L203: [blank]
- L204: [blank]
- L205: [blank]

- Candidate end: line 31131, index 1298906
- End snippet: cardinal had him informed that he would provide for him so that he should never want for anything in future. In fact, M. Bonacieux, having left his house at seven o’clock in the evening to go to the Louvre, never appeared again in the Rue des Fossoyeurs; the opinion of those who seemed to be best informed was that he was fed and lodged in some royal castle, at the expense of his generous Eminence.

### 10-20 Lines After End

- L31132: [blank]
- L31133: [blank]
- L31134: [blank]
- L31135: *** END OF THE PROJECT GUTENBERG EBOOK THE THREE MUSKETEERS ***
- L31136: [blank]
- L31137: [blank]
- L31138: [blank]
- L31139: [blank]
- L31140: Updated editions will replace the previous one—the old editions will
- L31141: be renamed.
- L31142: [blank]
- L31143: Creating the works from print editions not protected by U.S. copyright
- L31144: law means that no one owns a United States copyright in these works,
- L31145: so the Foundation (and you!) can copy and distribute it in the United
- L31146: States without permission and without paying copyright
- L31147: royalties. Special rules, set forth in the General Terms of Use part
- L31148: of this license, apply to copying and distributing Project
- L31149: Gutenberg™ electronic works to protect the PROJECT GUTENBERG™
- L31150: concept and trademark. Project Gutenberg is a registered trademark,
- L31151: and may not be used if you charge for an eBook, except by following

## Structure Detection

- Detected structural convention: chapter-based roman numerals
- Selected heading strategy: chapter-roman
- TOC entries detected: yes
- Body headings detected: yes
- Section count from selected strategy: 67
- Fallback used: no
- Fallback legitimacy: not required
- Fallback reason: not required
- Structure detection status: pass

### Candidate Heading Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 67 | 67 | 0 | yes |  |
| all-caps-title | 82 | 82 | 0 | no | weaker than selected strategy chapter-roman |
| roman-numbered-title | 51 | 51 | 0 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 315 | 315 | 0 | no | weaker than selected strategy chapter-roman |
| date-entry | 1 | 1 | 0 | no | weaker than selected strategy chapter-roman |
| special-front-back | 1 | 1 | 0 | no | weaker than selected strategy chapter-roman |

### Rejected Heading Strategies

| Pattern | Candidates | Body-like | TOC-like | Reason |
| --- | ---: | ---: | ---: | --- |
| all-caps-title | 82 | 82 | 0 | weaker than selected strategy chapter-roman |
| roman-numbered-title | 51 | 51 | 0 | weaker than selected strategy chapter-roman |
| isolated-title-case | 315 | 315 | 0 | weaker than selected strategy chapter-roman |
| date-entry | 1 | 1 | 0 | weaker than selected strategy chapter-roman |
| special-front-back | 1 | 1 | 0 | weaker than selected strategy chapter-roman |

### Structure Warnings

- None.

## Proposed Sections

- Total proposed sections: 67

| ID | Kind | Label | Title | Words | Default |
| --- | --- | --- | --- | ---: | --- |
| chapter-001 | chapter | Chapter 1 |  | 5855 | yes |
| chapter-002 | chapter | Chapter 2 |  | 3993 | yes |
| chapter-003 | chapter | Chapter 3 |  | 4349 | yes |
| chapter-004 | chapter | Chapter 4 |  | 2961 | yes |
| chapter-005 | chapter | Chapter 5 |  | 3732 | yes |
| chapter-006 | chapter | Chapter 6 |  | 7223 | yes |
| chapter-007 | chapter | Chapter 7 |  | 3352 | yes |
| chapter-008 | chapter | Chapter 8 |  | 2804 | yes |
| chapter-009 | chapter | Chapter 9 |  | 2635 | yes |
| chapter-010 | chapter | Chapter 10 |  | 3411 | yes |
| chapter-011 | chapter | Chapter 11 |  | 6104 | yes |
| chapter-012 | chapter | Chapter 12 |  | 3108 | yes |
| chapter-013 | chapter | Chapter 13 |  | 2971 | yes |
| chapter-014 | chapter | Chapter 14 |  | 3258 | yes |
| chapter-015 | chapter | Chapter 15 |  | 2865 | yes |
| chapter-016 | chapter | Chapter 16 |  | 4150 | yes |
| chapter-017 | chapter | Chapter 17 |  | 4477 | yes |
| chapter-018 | chapter | Chapter 18 |  | 2177 | yes |
| chapter-019 | chapter | Chapter 19 |  | 2854 | yes |
| chapter-020 | chapter | Chapter 20 |  | 4048 | yes |
| chapter-021 | chapter | Chapter 21 |  | 3517 | yes |
| chapter-022 | chapter | Chapter 22 |  | 2594 | yes |
| chapter-023 | chapter | Chapter 23 |  | 3671 | yes |
| chapter-024 | chapter | Chapter 24 |  | 3702 | yes |
| chapter-025 | chapter | Chapter 25 |  | 6754 | yes |
| chapter-026 | chapter | Chapter 26 |  | 5741 | yes |
| chapter-027 | chapter | Chapter 27 |  | 6750 | yes |
| chapter-028 | chapter | Chapter 28 |  | 4734 | yes |
| chapter-029 | chapter | Chapter 29 |  | 2924 | yes |
| chapter-030 | chapter | Chapter 30 |  | 2719 | yes |
| chapter-031 | chapter | Chapter 31 |  | 2690 | yes |
| chapter-032 | chapter | Chapter 32 |  | 3280 | yes |
| chapter-033 | chapter | Chapter 33 |  | 3253 | yes |
| chapter-034 | chapter | Chapter 34 |  | 2896 | yes |
| chapter-035 | chapter | Chapter 35 |  | 2565 | yes |
| chapter-036 | chapter | Chapter 36 |  | 2365 | yes |
| chapter-037 | chapter | Chapter 37 |  | 2411 | yes |
| chapter-038 | chapter | Chapter 38 |  | 3126 | yes |
| chapter-039 | chapter | Chapter 39 |  | 3136 | yes |
| chapter-040 | chapter | Chapter 40 |  | 2787 | yes |
| chapter-041 | chapter | Chapter 41 |  | 4630 | yes |
| chapter-042 | chapter | Chapter 42 |  | 2552 | yes |
| chapter-043 | chapter | Chapter 43 |  | 2810 | yes |
| chapter-044 | chapter | Chapter 44 |  | 2827 | yes |
| chapter-045 | chapter | Chapter 45 |  | 2077 | yes |
| chapter-046 | chapter | Chapter 46 |  | 2276 | yes |
| chapter-047 | chapter | Chapter 47 |  | 5521 | yes |
| chapter-048 | chapter | Chapter 48 |  | 4985 | yes |
| chapter-049 | chapter | Chapter 49 |  | 2817 | yes |
| chapter-050 | chapter | Chapter 50 |  | 2788 | yes |
| chapter-051 | chapter | Chapter 51 |  | 3942 | yes |
| chapter-052 | chapter | Chapter 52 |  | 2609 | yes |
| chapter-053 | chapter | Chapter 53 |  | 2522 | yes |
| chapter-054 | chapter | Chapter 54 |  | 3156 | yes |
| chapter-055 | chapter | Chapter 55 |  | 3011 | yes |
| chapter-056 | chapter | Chapter 56 |  | 5441 | yes |
| chapter-057 | chapter | Chapter 57 |  | 2266 | yes |
| chapter-058 | chapter | Chapter 58 |  | 2762 | yes |
| chapter-059 | chapter | Chapter 59 |  | 3549 | yes |
| chapter-060 | chapter | Chapter 60 |  | 1980 | yes |
| chapter-061 | chapter | Chapter 61 |  | 4355 | yes |
| chapter-062 | chapter | Chapter 62 |  | 1508 | yes |
| chapter-063 | chapter | Chapter 63 |  | 4669 | yes |
| chapter-064 | chapter | Chapter 64 |  | 2028 | yes |
| chapter-065 | chapter | Chapter 65 |  | 2591 | yes |
| chapter-066 | chapter | Chapter 66 |  | 1548 | yes |
| chapter-067 | chapter | Chapter 67 |  | 3393 | yes |

## Suspicious Sections

- Suspiciously short sections: None
- Suspiciously long sections: None

## Cleanup Simulation

| Action | Count | Recommendation | Samples |
| --- | ---: | --- | --- |
| normalize-smart-quotes | 18724 | Normalize smart quotes to ASCII quotes only in candidate playback text. | ’<br>’<br>’<br>’<br>“ |
| normalize-em-en-dashes | 843 | Normalize em/en dashes to spaced hyphen for Morse/audio playback, preserving sentence flow. | —<br>—<br>—<br>—<br>—<br>—<br>—<br>— |

- Footnotes/references: No footnote/reference handling issue detected in the dry run.
- Illustration/image placeholders: No illustration/image placeholder issue detected in the dry run.
- Dash normalization: Normalize em/en dashes to simple spaced hyphens for Morse/audio playback in candidate output only.

## First-Hour Preview Candidate

- Feasible: yes
- Confidence: medium
- Sections used: chapter-001 Chapter 1
- Approximate word count: 5855
- Starts at real readable content: yes
- Snippet: Chapter I. THE THREE PRESENTS OF D’ARTAGNAN THE ELDER On the first Monday of the month of April, 1625, the market town of Meung, in which the author of _Romance of the Rose_ was born, appeared to be in as perfect a state of revolution as if the Huguenots had just made a second La Rochelle of it. Many citizens, seeing the women flying toward the High Street,...

## Existing Generated Output Comparison

- Manifest: app/client/assets/books/generated/the-three-musketeers/manifest.json
- Section count: 71
- Default-included section count: 67
- First generated preview: The Three Musketeers By Alexandre Dumas, Père First Volume of the D’Artagnan Series
- Last generated preview: EPILOGUE La Rochelle, deprived of the assistance of the English fleet and of the diversion promised by Buckingham, surrendered after a siege of a year. On the...
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
- Non-prose structure signals need section parsing review.
- Existing generated output warning: suspiciously short generated sections.
