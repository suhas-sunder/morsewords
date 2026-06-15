# Pilot Dry Run: the-door-in-the-wall

- Source file: `THE DOOR IN THE WALL.txt`
- Why selected: High-confidence standalone Roman sections in a short collection-like source, selected to test titled/numbered short-work handling.
- Pass-2 risk level: medium
- Existing generated output: no
- Candidate title: The Door in the Wall And Other Stories
- Candidate author: H. G. Wells
- Final dry-run recommendation: process later with warnings

## Boundary Decision

- Dry-run adjustment: none.

- Raw word count: 6992
- Kept word count estimate: 6824
- Removed front matter word count estimate: 168
- Removed end matter word count estimate: 0
- Candidate start: line 19, index 925
- Start snippet: One confidential evening, not three months ago, Lionel Wallace told me this story of the Door in the Wall. And at the time I thought that so far as he was concerned it was a true story. He told it me with such a direct simplicity of conviction that I could not do otherwise than believe in him. But in the morning, in my own flat, I woke to a different atmosphere, and as I lay in bed and recalled the things he had told me, stripped of the glamour of his earnest slow voice, denuded of the focussed...

### 10-20 Lines Before Start

- L1: The Project Gutenberg eBook of The Door in the Wall And Other Stories, by H. G. Wells
- L2: This eBook is for the use of anyone anywhere in the United States and most other parts of the world at no cost and with almost no restrictions whatsoever. You may copy it, give it...
- L3: Title: The Door in the Wall And Other Stories
- L4: Author: H. G. Wells
- L5: Release Date: March, 1996 [eBook #456]
- L6: [Most recently updated: April 12, 2021]
- L7: Language: English
- L8: Character set encoding: UTF-8
- L9: Produced by: Judith Boss
- L10: [blank]
- L11: https://www.gutenberg.org/files/456/456-h/456-h.htm#link2H_4_0001
- L12: [blank]
- L13: *** START OF THE PROJECT GUTENBERG EBOOK THE DOOR IN THE WALL AND OTHER STORIES ***
- L14: [blank]
- L15: [blank]
- L16: [blank]
- L17: THE DOOR IN THE WALL
- L18: I

- Candidate end: line 218, index 37187
- End snippet: It would seem he walked all the way from the House that night—he has frequently walked home during the past Session—and so it is I figure his dark form coming along the late and empty streets, wrapped up, intent. And then did the pale electric lights near the station cheat the rough planking into a semblance of white? Did that fatal unfastened door awaken some memory? Was there, after all, ever any green door in the wall at all? I do not know. I have told his story as he told it to me. There ar...

### 10-20 Lines After End

- L219: [blank]

## Structure Detection

- Detected structural convention: standalone roman numeral sections
- Selected heading strategy: roman-only
- TOC entries detected: no
- Body headings detected: yes
- Section count from selected strategy: 3
- Fallback used: no
- Fallback legitimacy: not required
- Fallback reason: not required
- Structure detection status: warn

### Candidate Heading Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| roman-only | 3 | 3 | 0 | yes |  |
| isolated-title-case | 1 | 1 | 0 | no | weaker than selected strategy roman-only |

### Rejected Heading Strategies

| Pattern | Candidates | Body-like | TOC-like | Reason |
| --- | ---: | ---: | ---: | --- |
| isolated-title-case | 1 | 1 | 0 | weaker than selected strategy roman-only |

### Structure Warnings

- None.

## Proposed Sections

- Total proposed sections: 4

| ID | Kind | Label | Title | Words | Default |
| --- | --- | --- | --- | ---: | --- |
| title-page-001 | title-page | Opening section |  | 3397 | no |
| chapter-001 | chapter | Chapter 2 |  | 1255 | yes |
| chapter-002 | chapter | Chapter 3 |  | 1749 | yes |
| chapter-003 | chapter | Chapter 4 |  | 423 | yes |

## Suspicious Sections

- Suspiciously short sections: None
- Suspiciously long sections: None

## Cleanup Simulation

| Action | Count | Recommendation | Samples |
| --- | ---: | --- | --- |
| normalize-smart-quotes | 263 | Normalize smart quotes to ASCII quotes only in candidate playback text. | “<br>”<br>“<br>’<br>” |
| normalize-em-en-dashes | 111 | Normalize em/en dashes to spaced hyphen for Morse/audio playback, preserving sentence flow. | —<br>—<br>—<br>—<br>—<br>—<br>—<br>— |

- Footnotes/references: No footnote/reference handling issue detected in the dry run.
- Illustration/image placeholders: No illustration/image placeholder issue detected in the dry run.
- Dash normalization: Normalize em/en dashes to simple spaced hyphens for Morse/audio playback in candidate output only.

## First-Hour Preview Candidate

- Feasible: yes
- Confidence: medium
- Sections used: chapter-001 Chapter 2
- Approximate word count: 1255
- Starts at real readable content: yes
- Snippet: II He looked up with a sudden smile. “Did you ever play North-West Passage with me? . . . . . No, of course you didn’t come my way!” “It was the sort of game,” he went on, “that every imaginative child plays all day. The idea was the discovery of a North-West Passage to school. The way to school was plain enough; the game consisted in finding some way that...

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
- Review the structure-detection warnings and confirm TOC entries were not selected as body sections.

## Recommendation Reasons

- Medium-confidence start boundary remains manageable but needs review.
- Medium-confidence end boundary remains manageable but needs review.
