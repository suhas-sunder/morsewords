# Pilot Dry Run: almayer-s-folly-a-story-of-an-eastern-river

- Source file: `Almayer's Folly - A Story of an Eastern River.txt`
- Pass-2 risk level: low
- Existing generated output: no
- Candidate title: Almayer's Folly: A Story of an Eastern River
- Candidate author: Joseph Conrad
- Final dry-run recommendation: safe to process later

## Boundary Decision

- Dry-run adjustment: Moved candidate end from line 6315 to 6284 so the Project Gutenberg end marker at line 6287 becomes end matter.

- Raw word count: 66097
- Kept word count estimate: 62806
- Removed front matter word count estimate: 282
- Removed end matter word count estimate: 3009
- Candidate start: line 63, index 1683
- Start snippet: He shuffled uneasily, but took no further notice of the call. Leaning with both his elbows on the balustrade of the verandah, he went on looking fixedly at the great river that flowed--indifferent and hurried--before his eyes. He liked to look at it about the time of sunset; perhaps because at that time the sinking sun would spread a

### 10-20 Lines Before Start

- L43: _First Edition_ . . . 1895
- L44: 
- L45: _Second Impression_, 1907
- L46: 
- L47: _Third_ ,, 1914
- L48: 
- L49: _Fourth_ ,, 1915
- L50: 
- L51: To the memory of T. B.
- L52: 
- L53: 
- L54: CHAPTER I.
- L55: 
- L56: 
- L57: "Kaspar! Makan!"
- L58: 
- L59: The well-known shrill voice startled Almayer from his dream of splendid
- L60: future into the unpleasant realities of the present hour. An unpleasant
- L61: voice too. He had heard it for many years, and with every year he liked
- L62: it less. No matter; there would be an end to all this soon.

- Candidate end: line 6284, index 355795
- End snippet: "Let us go," he said, addressing Reshid. And as they passed through the crowd that fell back before them, the beads in Abdulla's hand clicked, while in a solemn whisper he breathed out piously the name of Allah! The Merciful! The Compassionate!

### 10-20 Lines After End

- L6285: 
- L6286: 
- L6287: *** END OF THE PROJECT GUTENBERG EBOOK ALMAYER'S FOLLY: A STORY OF AN EASTERN RIVER ***
- L6288: 
- L6289: 
- L6290: Updated editions will replace the previous one—the old editions will
- L6291: be renamed.
- L6292: 
- L6293: Creating the works from print editions not protected by U.S. copyright
- L6294: law means that no one owns a United States copyright in these works,
- L6295: so the Foundation (and you!) can copy and distribute it in the United
- L6296: States without permission and without paying copyright
- L6297: royalties. Special rules, set forth in the General Terms of Use part
- L6298: of this license, apply to copying and distributing Project
- L6299: Gutenberg™ electronic works to protect the PROJECT GUTENBERG™
- L6300: concept and trademark. Project Gutenberg is a registered trademark,
- L6301: and may not be used if you charge for an eBook, except by following
- L6302: the terms of the trademark license, including paying royalties for use
- L6303: of the Project Gutenberg trademark. If you do not charge anything for
- L6304: copies of this eBook, complying with the trademark license is very

## Proposed Sections

- Total proposed sections: 12

| ID | Kind | Label | Title | Words | Default |
| --- | --- | --- | --- | ---: | --- |
| title-page-001 | title-page | Opening section |  | 5209 | no |
| chapter-001 | chapter | Chapter 2 |  | 4091 | yes |
| chapter-002 | chapter | Chapter 3 |  | 4326 | yes |
| chapter-003 | chapter | Chapter 4 |  | 3615 | yes |
| chapter-004 | chapter | Chapter 5 |  | 4783 | yes |
| chapter-005 | chapter | Chapter 6 |  | 4222 | yes |
| chapter-006 | chapter | Chapter 7 |  | 5315 | yes |
| chapter-007 | chapter | Chapter 8 |  | 6003 | yes |
| chapter-008 | chapter | Chapter 9 |  | 5891 | yes |
| chapter-009 | chapter | Chapter 10 |  | 5417 | yes |
| chapter-010 | chapter | Chapter 11 |  | 6771 | yes |
| chapter-011 | chapter | Chapter 12 |  | 7163 | yes |

## Suspicious Sections

- Suspiciously short sections: None
- Suspiciously long sections: None

## Cleanup Simulation

| Action | Count | Recommendation | Samples |
| --- | ---: | --- | --- |
| remove-page-and-decorative-lines | 4 | Remove standalone page markers and decorative separators; do not remove prose punctuation. | candidate L541: * * * * *<br>candidate L4347: * * * * *<br>candidate L5838: * * * * *<br>candidate L6177: * * * * * |

- Footnotes/references: No footnote/reference handling issue detected in the dry run.
- Illustration/image placeholders: No illustration/image placeholder issue detected in the dry run.
- Dash normalization: Normalize em/en dashes to simple spaced hyphens for Morse/audio playback in candidate output only.

## First-Hour Preview Candidate

- Feasible: yes
- Confidence: high
- Sections used: chapter-001 Chapter 2
- Approximate word count: 4091
- Starts at real readable content: yes
- Snippet: CHAPTER II. When, in compliance with Lingard's abrupt demand, Almayer consented to wed the Malay girl, no one knew that on the day when the interesting young convert had lost all her natural relations and found a white father, she had been fighting desperately like the rest of them on board the prau, and was only prevented from leaping overboard, like the f...

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
