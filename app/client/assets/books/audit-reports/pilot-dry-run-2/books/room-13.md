# Pilot Dry Run: room-13

- Source file: `Room 13.txt`
- Why selected: Medium-risk novel with high-confidence boundaries and an end-note/correction edge case that should remain reviewable before writing.
- Pass-2 risk level: medium
- Existing generated output: no
- Candidate title: Room 13
- Candidate author: Edgar Wallace
- Final dry-run recommendation: needs individual review

## Boundary Decision

- Dry-run adjustment: none.

- Raw word count: 64632
- Kept word count estimate: 61369
- Removed front matter word count estimate: 260
- Removed end matter word count estimate: 3003
- Candidate start: line 115, index 1663
- Start snippet: CHAPTER I Over the grim stone archway was carved the words: PARCERE SUBJECTIS.

### 10-20 Lines Before Start

- L95: Chapter XX
- L96: Chapter XXI
- L97: Chapter XXII
- L98: Chapter XXIII
- L99: Chapter XXIV
- L100: Chapter XXV
- L101: Chapter XXVI
- L102: Chapter XXVII
- L103: Chapter XXVIII
- L104: Chapter XXIX
- L105: Chapter XXX
- L106: Chapter XXXI
- L107: Chapter XXXII
- L108: Chapter XXXIII
- L109: 
- L110: 
- L111: 
- L112: 
- L113: ROOM 13
- L114: 

- Candidate end: line 8287, index 330236
- End snippet: [Chapter XXXI] “_John_ listened at the door; he was coming alone” to _Johnny_. [End of text]

### 10-20 Lines After End

- L8288: 
- L8289: 
- L8290: 
- L8291: 
- L8292: 
- L8293: 
- L8294: 
- L8295: 
- L8296: *** END OF THE PROJECT GUTENBERG EBOOK ROOM 13 ***
- L8297: 
- L8298: 
- L8299: 
- L8300: 
- L8301: Updated editions will replace the previous one—the old editions will
- L8302: be renamed.
- L8303: 
- L8304: Creating the works from print editions not protected by U.S. copyright
- L8305: law means that no one owns a United States copyright in these works,
- L8306: so the Foundation (and you!) can copy and distribute it in the United
- L8307: States without permission and without paying copyright

## Proposed Sections

- Total proposed sections: 2

| ID | Kind | Label | Title | Words | Default |
| --- | --- | --- | --- | ---: | --- |
| chapter-001 | chapter | Chapter 1 |  | 61067 | yes |
| transcriber-note-001 | transcriber-note | Transcriber's Note |  | 302 | no |

## Suspicious Sections

- Suspiciously short sections: None
- Suspiciously long sections: chapter-001 (61067)

## Cleanup Simulation

| Action | Count | Recommendation | Samples |
| --- | ---: | --- | --- |
| remove-page-and-decorative-lines | 2 | Remove standalone page markers and decorative separators; do not remove prose punctuation. | candidate L903: * * * * *<br>candidate L3006: * * * * * |
| normalize-smart-quotes | 6112 | Normalize smart quotes to ASCII quotes only in candidate playback text. | “<br>”<br>“<br>”<br>’ |

- Footnotes/references: No footnote/reference handling issue detected in the dry run.
- Illustration/image placeholders: No illustration/image placeholder issue detected in the dry run.
- Dash normalization: Normalize em/en dashes to simple spaced hyphens for Morse/audio playback in candidate output only.

## First-Hour Preview Candidate

- Feasible: yes
- Confidence: medium
- Sections used: chapter-001 Chapter 1
- Approximate word count: 61067
- Starts at real readable content: yes
- Snippet: CHAPTER I Over the grim stone archway was carved the words: PARCERE SUBJECTIS. In cold weather, and employing the argot of his companions, Johnny Gray translated this as “Parky Subjects”--it certainly had no significance as “Spare the Vanquished,” for he had been neither vanquished nor spared. Day by day, harnessed to the shafts, he and Lal Morgon had pulle...

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

- Section detection collapsed 61369 words into only 2 sections; manual section logic is needed before writing.
