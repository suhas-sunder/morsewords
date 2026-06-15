# Pilot Dry Run: macbeth

- Source file: `Macbeth.txt`
- Why selected: High-confidence play structure, selected as a cautious act/scene case after audit data indicated safe enough boundaries.
- Pass-2 risk level: medium
- Existing generated output: no
- Candidate title: Macbeth
- Candidate author: William Shakespeare
- Final dry-run recommendation: process later with warnings

## Boundary Decision

- Dry-run adjustment: none.

- Raw word count: 22227
- Kept word count estimate: 19029
- Removed front matter word count estimate: 196
- Removed end matter word count estimate: 3002
- Candidate start: line 52, index 1167
- Start snippet: Scene I. Inverness. Court within the Castle. Scene II. The same. Scene III. The same. Scene IV. The same. Without the Castle.

### 10-20 Lines Before Start

- L32: MACBETH
- L33: [blank]
- L34: by William Shakespeare
- L35: [blank]
- L36: [blank]
- L37: [blank]
- L38: [blank]
- L39: Contents
- L40: [blank]
- L41: ACT I
- L42: Scene I. An open Place.
- L43: Scene II. A Camp near Forres.
- L44: Scene III. A heath.
- L45: Scene IV. Forres. A Room in the Palace.
- L46: Scene V. Inverness. A Room in Macbeth’s Castle.
- L47: Scene VI. The same. Before the Castle.
- L48: Scene VII. The same. A Lobby in the Castle.
- L49: [blank]
- L50: [blank]
- L51: ACT II

- Candidate end: line 4194, index 105335
- End snippet: That calls upon us, by the grace of Grace, We will perform in measure, time, and place. So thanks to all at once, and to each one, Whom we invite to see us crown’d at Scone. [_Flourish. Exeunt._]

### 10-20 Lines After End

- L4195: [blank]
- L4196: [blank]
- L4197: [blank]
- L4198: [blank]
- L4199: *** END OF THE PROJECT GUTENBERG EBOOK MACBETH ***
- L4200: [blank]
- L4201: [blank]
- L4202: [blank]
- L4203: [blank]
- L4204: Updated editions will replace the previous one—the old editions will
- L4205: be renamed.
- L4206: [blank]
- L4207: Creating the works from print editions not protected by U.S. copyright
- L4208: law means that no one owns a United States copyright in these works,
- L4209: so the Foundation (and you!) can copy and distribute it in the United
- L4210: States without permission and without paying copyright
- L4211: royalties. Special rules, set forth in the General Terms of Use part
- L4212: of this license, apply to copying and distributing Project
- L4213: Gutenberg™ electronic works to protect the PROJECT GUTENBERG™
- L4214: concept and trademark. Project Gutenberg is a registered trademark,

## Structure Detection

- Detected structural convention: play acts
- Selected heading strategy: act-prefixed
- TOC entries detected: yes
- Body headings detected: yes
- Section count from selected strategy: 6
- Fallback used: no
- Fallback legitimacy: not required
- Fallback reason: not required
- Structure detection status: pass

### Candidate Heading Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| act-prefixed | 8 | 6 | 2 | yes |  |
| all-caps-title | 651 | 546 | 105 | no | weaker than selected strategy act-prefixed |
| isolated-title-case | 104 | 79 | 25 | no | weaker than selected strategy act-prefixed |

### Rejected Heading Strategies

| Pattern | Candidates | Body-like | TOC-like | Reason |
| --- | ---: | ---: | ---: | --- |
| all-caps-title | 651 | 546 | 105 | weaker than selected strategy act-prefixed |
| isolated-title-case | 104 | 79 | 25 | weaker than selected strategy act-prefixed |

### Structure Warnings

- None.

## Proposed Sections

- Total proposed sections: 7

| ID | Kind | Label | Title | Words | Default |
| --- | --- | --- | --- | ---: | --- |
| title-page-001 | title-page | Opening section |  | 79 | no |
| part-001 | part | Act 4 |  | 239 | yes |
| part-002 | part | Act 1 |  | 4159 | yes |
| part-003 | part | Act 2 |  | 3015 | yes |
| part-004 | part | Act 3 |  | 4104 | yes |
| part-005 | part | Act 4 |  | 4118 | yes |
| part-006 | part | Act 5 |  | 3315 | yes |

## Suspicious Sections

- Suspiciously short sections: title-page-001 (79)
- Suspiciously long sections: None

## Cleanup Simulation

| Action | Count | Recommendation | Samples |
| --- | ---: | --- | --- |
| normalize-smart-quotes | 807 | Normalize smart quotes to ASCII quotes only in candidate playback text. | ’<br>’<br>’<br>’<br>’ |
| normalize-em-en-dashes | 135 | Normalize em/en dashes to spaced hyphen for Morse/audio playback, preserving sentence flow. | —<br>—<br>—<br>—<br>—<br>—<br>—<br>— |

- Footnotes/references: No footnote/reference handling issue detected in the dry run.
- Illustration/image placeholders: No illustration/image placeholder issue detected in the dry run.
- Dash normalization: Normalize em/en dashes to simple spaced hyphens for Morse/audio playback in candidate output only.

## First-Hour Preview Candidate

- Feasible: yes
- Confidence: medium
- Sections used: part-001 Act 4, part-002 Act 1
- Approximate word count: 4398
- Starts at real readable content: yes
- Snippet: ACT IV Scene I. A dark Cave. In the middle, a Cauldron Boiling. Scene II. Fife. A Room in Macduff’s Castle. Scene III. England. Before the King’s Palace. ACT V Scene I. Dunsinane. A Room in the Castle. Scene II. The Country near Dunsinane. Scene III. Dunsinane. A Room in the Castle. Scene IV. Country near Dunsinane: a Wood in view. Scene V. Dunsinane. Withi...

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

- Table of contents appears isolated before readable content.
- Non-prose structure signals need section parsing review.
