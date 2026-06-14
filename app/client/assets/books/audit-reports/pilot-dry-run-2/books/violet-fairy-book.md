# Pilot Dry Run: violet-fairy-book

- Source file: `Violet Fairy Book.txt`
- Why selected: Medium-risk story collection with a real preface and many sections, selected to check collection-style section splitting without severe artifact risk.
- Pass-2 risk level: medium
- Existing generated output: no
- Candidate title: The Violet Fairy Book
- Candidate author: Andrew Lang
- Final dry-run recommendation: process later with warnings

## Boundary Decision

- Dry-run adjustment: none.

- Raw word count: 106431
- Kept word count estimate: 103256
- Removed front matter word count estimate: 170
- Removed end matter word count estimate: 3005
- Candidate start: line 53, index 1041
- Start snippet: PREFACE The Editor takes this opportunity to repeat what he has often said before, that he is not the author of the stories in the Fairy Books; that he did not invent them ‘out of his own head.’ He is accustomed to

### 10-20 Lines Before Start

- L33: 
- L34: 
- L35: 
- L36: 
- L37: 
- L38: THE VIOLET FAIRY BOOK
- L39: 
- L40: By Various
- L41: 
- L42: Edited By Andrew Lang
- L43: 
- L44: 
- L45: 
- L46: TO VIOLET MYERS
- L47: IS DEDICATED
- L48: THE VIOLET FAIRY BOOK
- L49: 
- L50: 
- L51: 
- L52: 

- Candidate end: line 11140, index 534262
- End snippet: as he wished. And they went together to the palace, where Mogarzea was still waiting for him, and the marriage was celebrated by the emperor himself. But every May they returned to the Milk Lake, they and their children, and bathed in its waters. (Olumanische Marchen.)

### 10-20 Lines After End

- L11141: 
- L11142: 
- L11143: 
- L11144: 
- L11145: 
- L11146: 
- L11147: 
- L11148: 
- L11149: *** END OF THE PROJECT GUTENBERG EBOOK THE VIOLET FAIRY BOOK ***
- L11150: 
- L11151: 
- L11152: 
- L11153: 
- L11154: Updated editions will replace the previous one—the old editions will
- L11155: be renamed.
- L11156: 
- L11157: Creating the works from print editions not protected by U.S. copyright
- L11158: law means that no one owns a United States copyright in these works,
- L11159: so the Foundation (and you!) can copy and distribute it in the United
- L11160: States without permission and without paying copyright

## Proposed Sections

- Total proposed sections: 19

| ID | Kind | Label | Title | Words | Default |
| --- | --- | --- | --- | ---: | --- |
| part-001 | part | Part 1 |  | 5625 | yes |
| part-002 | part | Part 2 |  | 5845 | yes |
| part-003 | part | Part 3 |  | 5838 | yes |
| part-004 | part | Part 4 |  | 5780 | yes |
| part-005 | part | Part 5 |  | 5779 | yes |
| part-006 | part | Part 6 |  | 5864 | yes |
| part-007 | part | Part 7 |  | 5909 | yes |
| part-008 | part | Part 8 |  | 5714 | yes |
| part-009 | part | Part 9 |  | 5803 | yes |
| part-010 | part | Part 10 |  | 5770 | yes |
| part-011 | part | Part 11 |  | 5811 | yes |
| part-012 | part | Part 12 |  | 5841 | yes |
| part-013 | part | Part 13 |  | 5835 | yes |
| part-014 | part | Part 14 |  | 5739 | yes |
| part-015 | part | Part 15 |  | 5693 | yes |
| part-016 | part | Part 16 |  | 5677 | yes |
| part-017 | part | Part 17 |  | 5892 | yes |
| part-018 | part | Part 18 |  | 4839 | yes |
| part-019 | part | Part 19 |  | 2 | yes |

## Suspicious Sections

- Suspiciously short sections: part-019 (2)
- Suspiciously long sections: None

## Cleanup Simulation

| Action | Count | Recommendation | Samples |
| --- | ---: | --- | --- |
| normalize-smart-quotes | 4281 | Normalize smart quotes to ASCII quotes only in candidate playback text. | ‘<br>’<br>‘<br>’<br>‘ |

- Footnotes/references: No footnote/reference handling issue detected in the dry run.
- Illustration/image placeholders: No illustration/image placeholder issue detected in the dry run.
- Dash normalization: Normalize em/en dashes to simple spaced hyphens for Morse/audio playback in candidate output only.

## First-Hour Preview Candidate

- Feasible: yes
- Confidence: medium
- Sections used: part-001 Part 1
- Approximate word count: 5625
- Starts at real readable content: yes
- Snippet: PREFACE The Editor takes this opportunity to repeat what he has often said before, that he is not the author of the stories in the Fairy Books; that he did not invent them ‘out of his own head.’ He is accustomed to being asked, by ladies, ‘Have you written anything else except the Fairy Books?’ He is then obliged to explain that he has NOT written the Fairy...

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

- Table of contents detected near readable content.
