# Pilot Dry Run: jack-and-jill

- Source file: `jack-and-jill.txt`
- Why selected: Medium-risk generated-output comparison case with high-confidence boundaries and isolated TOC cleanup.
- Pass-2 risk level: medium
- Existing generated output: yes
- Candidate title: Jack and Jill
- Candidate author: Louisa May Alcott
- Final dry-run recommendation: process later with warnings

## Boundary Decision

- Dry-run adjustment: none.

- Raw word count: 96210
- Kept word count estimate: 92885
- Removed front matter word count estimate: 321
- Removed end matter word count estimate: 3004
- Candidate start: line 95, index 2129
- Start snippet: Chapter I. The Catastrophe “Clear the lulla!” was the general cry on a bright December afternoon, when all the boys and girls of Harmony Village were out enjoying the first good snow of the season. Up and down three long coasts they went

### 10-20 Lines Before Start

- L75: Chapter XXI Pebbly Beach
- L76: Chapter XXII A Happy Day
- L77: Chapter XXIII Cattle Show
- L78: Chapter XXIV Down the River
- L79: 
- L80: 
- L81: 
- L82: 
- L83: 
- L84: JACK AND JILL
- L85: 
- L86: 
- L87: Jack and Jill went up the hill
- L88: To coast with fun and laughter;
- L89: Jack fell down and broke his crown,
- L90: And Jill came tumbling after.
- L91: 
- L92: 
- L93: 
- L94: 

- Candidate end: line 9836, index 498721
- End snippet: There are many such boys and girls, full of high hopes, lovely possibilities, and earnest plans, pausing a moment before they push their little boats from the safe shore. Let those who launch them see to it that they have good health to man the oars, good education for ballast, and good principles as pilots to guide them as they voyage down an ever-widening river to the sea.

### 10-20 Lines After End

- L9837: 
- L9838: 
- L9839: 
- L9840: 
- L9841: 
- L9842: 
- L9843: 
- L9844: *** END OF THE PROJECT GUTENBERG EBOOK JACK AND JILL ***
- L9845: 
- L9846: 
- L9847: 
- L9848: 
- L9849: Updated editions will replace the previous one—the old editions will
- L9850: be renamed.
- L9851: 
- L9852: Creating the works from print editions not protected by U.S. copyright
- L9853: law means that no one owns a United States copyright in these works,
- L9854: so the Foundation (and you!) can copy and distribute it in the United
- L9855: States without permission and without paying copyright
- L9856: royalties. Special rules, set forth in the General Terms of Use part

## Structure Detection

- Detected structural convention: chapter-based roman numerals
- Selected heading strategy: chapter-roman
- TOC entries detected: no
- Body headings detected: yes
- Section count from selected strategy: 24
- Fallback used: no
- Fallback legitimacy: not required
- Fallback reason: not required
- Structure detection status: pass

### Candidate Heading Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 24 | 24 | 0 | yes |  |
| all-caps-title | 6 | 5 | 1 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 29 | 24 | 5 | no | weaker than selected strategy chapter-roman |
| roman-numbered-title | 1 | 1 | 0 | no | weaker than selected strategy chapter-roman |

### Rejected Heading Strategies

| Pattern | Candidates | Body-like | TOC-like | Reason |
| --- | ---: | ---: | ---: | --- |
| all-caps-title | 6 | 5 | 1 | weaker than selected strategy chapter-roman |
| isolated-title-case | 29 | 24 | 5 | weaker than selected strategy chapter-roman |
| roman-numbered-title | 1 | 1 | 0 | weaker than selected strategy chapter-roman |

### Structure Warnings

- None.

## Proposed Sections

- Total proposed sections: 24

| ID | Kind | Label | Title | Words | Default |
| --- | --- | --- | --- | ---: | --- |
| chapter-001 | chapter | Chapter 1 | The Catastrophe | 2910 | yes |
| chapter-002 | chapter | Chapter 2 | Two Penitents | 2089 | yes |
| chapter-003 | chapter | Chapter 3 | Ward No. 1 | 3897 | yes |
| chapter-004 | chapter | Chapter 4 | Ward No. 2 | 3145 | yes |
| chapter-005 | chapter | Chapter 5 | Secrets | 1674 | yes |
| chapter-006 | chapter | Chapter 6 | Surprises | 4916 | yes |
| chapter-007 | chapter | Chapter 7 | Jill's Mission | 4437 | yes |
| chapter-008 | chapter | Chapter 8 | Merry and Molly | 4487 | yes |
| chapter-009 | chapter | Chapter 9 | The Debating Club | 4477 | yes |
| chapter-010 | chapter | Chapter 10 | The Dramatic Club | 3750 | yes |
| chapter-011 | chapter | Chapter 11 | “Down Brakes” | 3000 | yes |
| chapter-012 | chapter | Chapter 12 | The Twenty-Second of February | 4452 | yes |
| chapter-013 | chapter | Chapter 13 | Jack Has a Mystery | 4243 | yes |
| chapter-014 | chapter | Chapter 14 | And Jill Finds It Out | 3519 | yes |
| chapter-015 | chapter | Chapter 15 | Saint Lucy | 4126 | yes |
| chapter-016 | chapter | Chapter 16 | Up at Merry's | 4034 | yes |
| chapter-017 | chapter | Chapter 17 | Down at Molly's | 4381 | yes |
| chapter-018 | chapter | Chapter 18 | May Baskets | 3861 | yes |
| chapter-019 | chapter | Chapter 19 | Good Templars | 3914 | yes |
| chapter-020 | chapter | Chapter 20 | A Sweet Memory | 3729 | yes |
| chapter-021 | chapter | Chapter 21 | Pebbly Beach | 5641 | yes |
| chapter-022 | chapter | Chapter 22 | A Happy Day | 3092 | yes |
| chapter-023 | chapter | Chapter 23 | Cattle Show | 4672 | yes |
| chapter-024 | chapter | Chapter 24 | Down the River | 4439 | yes |

## Suspicious Sections

- Suspiciously short sections: None
- Suspiciously long sections: None

## Cleanup Simulation

| Action | Count | Recommendation | Samples |
| --- | ---: | --- | --- |
| remove-page-and-decorative-lines | 1 | Remove standalone page markers and decorative separators; do not remove prose punctuation. | candidate L4813: * * * * * |
| normalize-smart-quotes | 2967 | Normalize smart quotes to ASCII quotes only in candidate playback text. | “<br>”<br>“<br>”<br>“ |

- Footnotes/references: No footnote/reference handling issue detected in the dry run.
- Illustration/image placeholders: No illustration/image placeholder issue detected in the dry run.
- Dash normalization: Normalize em/en dashes to simple spaced hyphens for Morse/audio playback in candidate output only.

## First-Hour Preview Candidate

- Feasible: yes
- Confidence: medium
- Sections used: chapter-001 Chapter 1
- Approximate word count: 2910
- Starts at real readable content: yes
- Snippet: Chapter I. The Catastrophe “Clear the lulla!” was the general cry on a bright December afternoon, when all the boys and girls of Harmony Village were out enjoying the first good snow of the season. Up and down three long coasts they went as fast as legs and sleds could carry them. One smooth path led into the meadow, and here the little folk congregated; on...

## Existing Generated Output Comparison

- Manifest: app/client/assets/books/generated/jack-and-jill/manifest.json
- Section count: 26
- Default-included section count: 24
- First generated preview: JACK AND JILL By Louisa May Alcott To the schoolmates of ELLSWORTH DEVENS, Whose lovely character will not soon be forgotten, This Village Story is affectionat...
- Last generated preview: Chapter XXIV. Down the River A fortnight later, the boys were picking apples one golden October afternoon, and the girls were hurrying to finish their work, th...
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
