# Pilot Dry Run: the-lerouge-case

- Source file: `The Lerouge Case.txt`
- Pass-2 risk level: low
- Existing generated output: no
- Candidate title: The Lerouge Case
- Candidate author: Emile Gaboriau
- Final dry-run recommendation: safe to process later

## Boundary Decision

- Dry-run adjustment: Moved candidate end from line 14326 to 14304 so the Project Gutenberg end marker at line 14307 becomes end matter.

- Raw word count: 127811
- Kept word count estimate: 124646
- Removed front matter word count estimate: 161
- Removed end matter word count estimate: 3004
- Candidate start: line 35, index 968
- Start snippet: women belonging to the village of La Jonchere presented themselves at the police station at Bougival. They stated that for two days past no one had seen the Widow Lerouge, one of their neighbours, who lived by herself in an isolated cottage. They had several times knocked at the door, but all in vain. The

### 10-20 Lines Before Start

- L15: 
- L16: Release date: April 13, 2006 [eBook #3802]
- L17: Most recently updated: October 19, 2024
- L18: 
- L19: Language: English
- L20: 
- L21: Other information and formats: www.gutenberg.org/ebooks/3802
- L22: 
- L23: Credits: Produced by David Moynihan; Dagny; David Widger
- L24: 
- L25: 
- L26: *** START OF THE PROJECT GUTENBERG EBOOK THE LEROUGE CASE ***
- L27: THE LEROUGE CASE
- L28: 
- L29: By Emile Gaboriau
- L30: 
- L31: 
- L32: CHAPTER I.
- L33: 
- L34: On Thursday, the 6th of March, 1862, two days after Shrove Tuesday, five

- Candidate end: line 14304, index 695490
- End snippet: errors. The ex-amateur detective doubts the very existence of crime, and maintains that the evidence of one’s senses proves nothing. He circulates petitions for the abolition of capital punishment, and has organised a society for the defence of poor and innocent prisoners.

### 10-20 Lines After End

- L14305: 
- L14306: 
- L14307: *** END OF THE PROJECT GUTENBERG EBOOK THE LEROUGE CASE ***
- L14308: 
- L14309: 
- L14310: Updated editions will replace the previous one—the old editions will
- L14311: be renamed.
- L14312: 
- L14313: Creating the works from print editions not protected by U.S. copyright
- L14314: law means that no one owns a United States copyright in these works,
- L14315: so the Foundation (and you!) can copy and distribute it in the United
- L14316: States without permission and without paying copyright
- L14317: royalties. Special rules, set forth in the General Terms of Use part
- L14318: of this license, apply to copying and distributing Project
- L14319: Gutenberg™ electronic works to protect the PROJECT GUTENBERG™
- L14320: concept and trademark. Project Gutenberg is a registered trademark,
- L14321: and may not be used if you charge for an eBook, except by following
- L14322: the terms of the trademark license, including paying royalties for use
- L14323: of the Project Gutenberg trademark. If you do not charge anything for
- L14324: copies of this eBook, complying with the trademark license is very

## Proposed Sections

- Total proposed sections: 20

| ID | Kind | Label | Title | Words | Default |
| --- | --- | --- | --- | ---: | --- |
| title-page-001 | title-page | Opening section |  | 6169 | no |
| chapter-001 | chapter | Chapter 2 |  | 5232 | yes |
| chapter-002 | chapter | Chapter 3 |  | 4012 | yes |
| chapter-003 | chapter | Chapter 4 |  | 9104 | yes |
| chapter-004 | chapter | Chapter 5 |  | 6818 | yes |
| chapter-005 | chapter | Chapter 6 |  | 9974 | yes |
| chapter-006 | chapter | Chapter 7 |  | 6105 | yes |
| chapter-007 | chapter | Chapter 8 |  | 3256 | yes |
| chapter-008 | chapter | Chapter 9 |  | 8224 | yes |
| chapter-009 | chapter | Chapter 10 |  | 5113 | yes |
| chapter-010 | chapter | Chapter 11 |  | 6016 | yes |
| chapter-011 | chapter | Chapter 12 |  | 7379 | yes |
| chapter-012 | chapter | Chapter 13 |  | 8803 | yes |
| chapter-013 | chapter | Chapter 14 |  | 5940 | yes |
| chapter-014 | chapter | Chapter 15 |  | 7140 | yes |
| chapter-015 | chapter | Chapter 16 |  | 5890 | yes |
| chapter-016 | chapter | Chapter 17 |  | 7492 | yes |
| chapter-017 | chapter | Chapter 18 |  | 6075 | yes |
| chapter-018 | chapter | Chapter 19 |  | 5318 | yes |
| chapter-019 | chapter | Chapter 20 |  | 586 | yes |

## Suspicious Sections

- Suspiciously short sections: None
- Suspiciously long sections: None

## Cleanup Simulation

| Action | Count | Recommendation | Samples |
| --- | ---: | --- | --- |
| normalize-smart-quotes | 6612 | Normalize smart quotes to ASCII quotes only in candidate playback text. | ’<br>“<br>”<br>“<br>” |

- Footnotes/references: No footnote/reference handling issue detected in the dry run.
- Illustration/image placeholders: No illustration/image placeholder issue detected in the dry run.
- Dash normalization: Normalize em/en dashes to simple spaced hyphens for Morse/audio playback in candidate output only.

## First-Hour Preview Candidate

- Feasible: yes
- Confidence: high
- Sections used: chapter-001 Chapter 2
- Approximate word count: 5232
- Starts at real readable content: yes
- Snippet: CHAPTER II. The two last depositions awakened in M. Daburon’s mind some slight gleams of hope. In the midst of darkness, the humblest rush-light acquires brilliancy. “I will go at once to Bougival, sir, if you approve of this step,” suggested Gevrol. “Perhaps you would do well to wait a little,” answered M. Daburon. “This man was seen on Sunday morning; we...

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

- Pass 2 verified high-confidence boundaries and this dry run found no blocking issue.
