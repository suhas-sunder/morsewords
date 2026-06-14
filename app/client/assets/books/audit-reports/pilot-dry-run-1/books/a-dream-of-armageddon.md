# Pilot Dry Run: a-dream-of-armageddon

- Source file: `A DREAM OF ARMAGEDDON.txt`
- Pass-2 risk level: medium
- Existing generated output: no
- Candidate title: Twelve Stories and a Dream
- Candidate author: H. G. Wells
- Final dry-run recommendation: process later with warnings

## Boundary Decision

- Dry-run adjustment: none.

- Raw word count: 10303
- Kept word count estimate: 10186
- Removed front matter word count estimate: 117
- Removed end matter word count estimate: 0
- Candidate start: line 29, index 704
- Start snippet: A DREAM OF ARMAGEDDON The man with the white face entered the carriage at Rugby. He moved slowly in spite of the urgency of his porter, and even while he was still on the platform I noted how ill he seemed. He dropped into the corner over against me with a sigh, made an incomplete attempt to arrange his travelling shawl, and became motionless, with his eyes staring vacantly. Presently he was moved by a sense of my observation, looked up at me, and put out a spiritless hand for his newspaper. Th...

### 10-20 Lines Before Start

- L9: 
- L10: Title: Twelve Stories and a Dream
- L11: 
- L12: Author: H. G. Wells
- L13: 
- L14: Release Date: September 21, 2008 [EBook #1743]
- L15: Last Updated: March 2, 2018
- L16: 
- L17: Language: English
- L18: 
- L19: Character set encoding: UTF-8
- L20: 
- L21: *** START OF THIS PROJECT GUTENBERG EBOOK TWELVE STORIES AND A DREAM ***
- L22: 
- L23: 
- L24: Produced by Aaron Cannon, Stephanie Johnson, and David Widger
- L25: 
- L26: 
- L27: https://www.gutenberg.org/files/1743/1743-h/1743-h.htm
- L28: 

- Candidate end: line 537, index 54576
- End snippet: “Nightmares,” he cried; “nightmares indeed! My God! Great birds that fought and tore.”

### 10-20 Lines After End

- None.

## Proposed Sections

- Total proposed sections: 3

| ID | Kind | Label | Title | Words | Default |
| --- | --- | --- | --- | ---: | --- |
| part-001 | part | Part 1 |  | 5618 | yes |
| part-002 | part | Part 2 |  | 4555 | yes |
| part-003 | part | Part 3 |  | 13 | yes |

## Suspicious Sections

- Suspiciously short sections: part-003 (13)
- Suspiciously long sections: None

## Cleanup Simulation

| Action | Count | Recommendation | Samples |
| --- | ---: | --- | --- |
| normalize-smart-quotes | 409 | Normalize smart quotes to ASCII quotes only in candidate playback text. | “<br>”<br>“<br>”<br>“ |
| normalize-em-en-dashes | 160 | Normalize em/en dashes to spaced hyphen for Morse/audio playback, preserving sentence flow. | —<br>—<br>—<br>—<br>—<br>—<br>—<br>— |

- Footnotes/references: No footnote/reference handling issue detected in the dry run.
- Illustration/image placeholders: No illustration/image placeholder issue detected in the dry run.
- Dash normalization: Normalize em/en dashes to simple spaced hyphens for Morse/audio playback in candidate output only.

## First-Hour Preview Candidate

- Feasible: yes
- Confidence: medium
- Sections used: part-001 Part 1
- Approximate word count: 5618
- Starts at real readable content: yes
- Snippet: A DREAM OF ARMAGEDDON The man with the white face entered the carriage at Rugby. He moved slowly in spite of the urgency of his porter, and even while he was still on the platform I noted how ill he seemed. He dropped into the corner over against me with a sigh, made an incomplete attempt to arrange his travelling shawl, and became motionless, with his eyes...

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
- Medium-confidence end boundary remains manageable but needs review.
