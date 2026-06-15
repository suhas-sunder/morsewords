# Pilot Dry Run: anne-of-green-gables

- Source file: `Anne of Green Gables.txt`
- Why selected: Medium-risk book with high-confidence boundaries, an isolated TOC, an existing generated output for comparison, and a feasible preview source.
- Pass-2 risk level: medium
- Existing generated output: yes
- Candidate title: Anne of Green Gables
- Candidate author: L. M. Montgomery
- Final dry-run recommendation: process later with warnings

## Boundary Decision

- Dry-run adjustment: none.

- Raw word count: 109928
- Kept word count estimate: 106496
- Removed front matter word count estimate: 427
- Removed end matter word count estimate: 3005
- Candidate start: line 82, index 2898
- Start snippet: CHAPTER I. Mrs. Rachel Lynde Is Surprised MRS. Rachel Lynde lived just where the Avonlea main road dipped down into a little hollow, fringed with alders and ladies’ eardrops and traversed by a brook that had its source away back in the woods of the

### 10-20 Lines Before Start

- L62: CHAPTER XXV Matthew Insists on Puffed Sleeves
- L63: CHAPTER XXVI The Story Club Is Formed
- L64: CHAPTER XXVII Vanity and Vexation of Spirit
- L65: CHAPTER XXVIII An Unfortunate Lily Maid
- L66: CHAPTER XXIX An Epoch in Anne’s Life
- L67: CHAPTER XXX The Queen’s Class Is Organized
- L68: CHAPTER XXXI Where the Brook and River Meet
- L69: CHAPTER XXXII The Pass List Is Out
- L70: CHAPTER XXXIII The Hotel Concert
- L71: CHAPTER XXXIV A Queen’s Girl
- L72: CHAPTER XXXV The Winter at Queen’s
- L73: CHAPTER XXXVI The Glory and the Dream
- L74: CHAPTER XXXVII The Reaper Whose Name Is Death
- L75: CHAPTER XXXVIII The Bend in the Road
- L76: 
- L77: 
- L78: 
- L79: 
- L80: ANNE OF GREEN GABLES
- L81: 

- Candidate end: line 10809, index 561981
- End snippet: The joy of sincere work and worthy aspiration and congenial friendship were to be hers; nothing could rob her of her birthright of fancy or her ideal world of dreams. And there was always the bend in the road! “‘God’s in his heaven, all’s right with the world,’” whispered Anne softly.

### 10-20 Lines After End

- L10810: 
- L10811: 
- L10812: 
- L10813: *** END OF THE PROJECT GUTENBERG EBOOK ANNE OF GREEN GABLES ***
- L10814: 
- L10815: 
- L10816: 
- L10817: 
- L10818: Updated editions will replace the previous one—the old editions will
- L10819: be renamed.
- L10820: 
- L10821: Creating the works from print editions not protected by U.S. copyright
- L10822: law means that no one owns a United States copyright in these works,
- L10823: so the Foundation (and you!) can copy and distribute it in the United
- L10824: States without permission and without paying copyright
- L10825: royalties. Special rules, set forth in the General Terms of Use part
- L10826: of this license, apply to copying and distributing Project
- L10827: Gutenberg™ electronic works to protect the PROJECT GUTENBERG™
- L10828: concept and trademark. Project Gutenberg is a registered trademark,
- L10829: and may not be used if you charge for an eBook, except by following

## Structure Detection

- Detected structural convention: chapter-based roman numerals
- Selected heading strategy: chapter-roman
- TOC entries detected: no
- Body headings detected: yes
- Section count from selected strategy: 38
- Fallback used: no
- Fallback legitimacy: not required
- Fallback reason: not required
- Structure detection status: pass

### Candidate Heading Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 38 | 38 | 0 | yes |  |
| isolated-title-case | 49 | 48 | 1 | no | weaker than selected strategy chapter-roman |
| all-caps-title | 1 | 1 | 0 | no | weaker than selected strategy chapter-roman |

### Rejected Heading Strategies

| Pattern | Candidates | Body-like | TOC-like | Reason |
| --- | ---: | ---: | ---: | --- |
| isolated-title-case | 49 | 48 | 1 | weaker than selected strategy chapter-roman |
| all-caps-title | 1 | 1 | 0 | weaker than selected strategy chapter-roman |

### Structure Warnings

- None.

## Proposed Sections

- Total proposed sections: 38

| ID | Kind | Label | Title | Words | Default |
| --- | --- | --- | --- | ---: | --- |
| chapter-001 | chapter | Chapter 1 | Mrs. Rachel Lynde Is Surprised | 2954 | yes |
| chapter-002 | chapter | Chapter 2 | Matthew Cuthbert Is Surprised | 5135 | yes |
| chapter-003 | chapter | Chapter 3 | Marilla Cuthbert Is Surprised | 2251 | yes |
| chapter-004 | chapter | Chapter 4 | Morning at Green Gables | 2392 | yes |
| chapter-005 | chapter | Chapter 5 | Anne’s History | 2197 | yes |
| chapter-006 | chapter | Chapter 6 | Marilla Makes Up Her Mind | 2020 | yes |
| chapter-007 | chapter | Chapter 7 | Anne Says Her Prayers | 1263 | yes |
| chapter-008 | chapter | Chapter 8 | Anne’s Bringing-up Is Begun | 3044 | yes |
| chapter-009 | chapter | Chapter 9 | Mrs. Rachel Lynde Is Properly Horrified | 2485 | yes |
| chapter-010 | chapter | Chapter 10 | Anne’s Apology | 2587 | yes |
| chapter-011 | chapter | Chapter 11 | Anne’s Impressions of Sunday-school | 1837 | yes |
| chapter-012 | chapter | Chapter 12 | A Solemn Vow and Promise | 2117 | yes |
| chapter-013 | chapter | Chapter 13 | The Delights of Anticipation | 1929 | yes |
| chapter-014 | chapter | Chapter 14 | Anne’s Confession | 3196 | yes |
| chapter-015 | chapter | Chapter 15 | A Tempest in the School Teapot | 5458 | yes |
| chapter-016 | chapter | Chapter 16 | Diana Is Invited to Tea with Tragic Results | 4137 | yes |
| chapter-017 | chapter | Chapter 17 | A New Interest in Life | 2090 | yes |
| chapter-018 | chapter | Chapter 18 | Anne to the Rescue | 3564 | yes |
| chapter-019 | chapter | Chapter 19 | A Concert, a Catastrophe, and a Confession | 4189 | yes |
| chapter-020 | chapter | Chapter 20 | A Good Imagination Gone Wrong | 2314 | yes |
| chapter-021 | chapter | Chapter 21 | A New Departure in Flavorings | 3786 | yes |
| chapter-022 | chapter | Chapter 22 | Anne Is Invited Out to Tea | 1527 | yes |
| chapter-023 | chapter | Chapter 23 | Anne Comes to Grief in an Affair of Honor | 2400 | yes |
| chapter-024 | chapter | Chapter 24 | Miss Stacy and Her Pupils Get Up a Concert | 1595 | yes |
| chapter-025 | chapter | Chapter 25 | Matthew Insists on Puffed Sleeves | 3616 | yes |
| chapter-026 | chapter | Chapter 26 | The Story Club Is Formed | 2754 | yes |
| chapter-027 | chapter | Chapter 27 | Vanity and Vexation of Spirit | 2623 | yes |
| chapter-028 | chapter | Chapter 28 | An Unfortunate Lily Maid | 2919 | yes |
| chapter-029 | chapter | Chapter 29 | An Epoch in Anne’s Life | 3324 | yes |
| chapter-030 | chapter | Chapter 30 | The Queen’s Class Is Organized | 4439 | yes |
| chapter-031 | chapter | Chapter 31 | Where the Brook and River Meet | 2377 | yes |
| chapter-032 | chapter | Chapter 32 | The Pass List Is Out | 2796 | yes |
| chapter-033 | chapter | Chapter 33 | The Hotel Concert | 3404 | yes |
| chapter-034 | chapter | Chapter 34 | A Queen’s Girl | 2617 | yes |
| chapter-035 | chapter | Chapter 35 | The Winter at Queen’s | 1661 | yes |
| chapter-036 | chapter | Chapter 36 | The Glory and the Dream | 2008 | yes |
| chapter-037 | chapter | Chapter 37 | The Reaper Whose Name Is Death | 2425 | yes |
| chapter-038 | chapter | Chapter 38 | The Bend in the Road | 3066 | yes |

## Suspicious Sections

- Suspiciously short sections: None
- Suspiciously long sections: None

## Cleanup Simulation

| Action | Count | Recommendation | Samples |
| --- | ---: | --- | --- |
| normalize-smart-quotes | 7478 | Normalize smart quotes to ASCII quotes only in candidate playback text. | ’<br>’<br>’<br>’<br>“ |

- Footnotes/references: No footnote/reference handling issue detected in the dry run.
- Illustration/image placeholders: No illustration/image placeholder issue detected in the dry run.
- Dash normalization: Normalize em/en dashes to simple spaced hyphens for Morse/audio playback in candidate output only.

## First-Hour Preview Candidate

- Feasible: yes
- Confidence: medium
- Sections used: chapter-001 Chapter 1
- Approximate word count: 2954
- Starts at real readable content: yes
- Snippet: CHAPTER I. Mrs. Rachel Lynde Is Surprised MRS. Rachel Lynde lived just where the Avonlea main road dipped down into a little hollow, fringed with alders and ladies’ eardrops and traversed by a brook that had its source away back in the woods of the old Cuthbert place; it was reputed to be an intricate, headlong brook in its earlier course through those wood...

## Existing Generated Output Comparison

- Manifest: app/client/assets/books/generated/anne-of-green-gables/manifest.json
- Section count: 39
- Default-included section count: 38
- First generated preview: ANNE OF GREEN GABLES By Lucy Maud Montgomery Table of Contents CHAPTER I Mrs. Rachel Lynde Is Surprised CHAPTER II Matthew Cuthbert Is Surprised CHAPTER III Ma...
- Last generated preview: CHAPTER XXXVIII. The Bend in the Road MARILLA went to town the next day and returned in the evening. Anne had gone over to Orchard Slope with Diana and came ba...
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
