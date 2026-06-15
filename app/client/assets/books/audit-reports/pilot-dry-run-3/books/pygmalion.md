# Pilot Dry Run: pygmalion

- Source file: `Pygmalion.txt`
- Why selected: High-confidence play structure with explicit acts, selected to test dramatic text parsing without expanding to chaotic plays.
- Pass-2 risk level: medium
- Existing generated output: no
- Candidate title: Pygmalion
- Candidate author: Bernard Shaw
- Final dry-run recommendation: process later with warnings

## Boundary Decision

- Dry-run adjustment: none.

- Raw word count: 37941
- Kept word count estimate: 34762
- Removed front matter word count estimate: 177
- Removed end matter word count estimate: 3002
- Candidate start: line 49, index 1089
- Start snippet: PREFACE TO PYGMALION. A Professor of Phonetics. As will be seen later on, Pygmalion needs, not a preface, but a sequel, which I have supplied in its due place. The English have no respect for

### 10-20 Lines Before Start

- L29: [blank]
- L30: [blank]
- L31: [blank]
- L32: TRANSCRIBER’S NOTE: In the printed version of this text, all
- L33: apostrophes for contractions such as “can’t”, “wouldn’t” and “he’d”
- L34: were omitted, to read as “cant”, “wouldnt”, and “hed”. This etext
- L35: edition restores the omitted apostrophes.
- L36: [blank]
- L37: [blank]
- L38: [blank]
- L39: [blank]
- L40: PYGMALION
- L41: [blank]
- L42: BERNARD SHAW
- L43: [blank]
- L44: 1912
- L45: [blank]
- L46: [blank]
- L47: [blank]
- L48: [blank]

- Candidate end: line 4379, index 189120
- End snippet: private imaginations of that sort. But when it comes to business, to the life that she really leads as distinguished from the life of dreams and fancies, she likes Freddy and she likes the Colonel; and she does not like Higgins and Mr. Doolittle. Galatea never does quite like Pygmalion: his relation to her is too godlike to be altogether agreeable.

### 10-20 Lines After End

- L4380: [blank]
- L4381: [blank]
- L4382: [blank]
- L4383: [blank]
- L4384: [blank]
- L4385: [blank]
- L4386: *** END OF THE PROJECT GUTENBERG EBOOK PYGMALION ***
- L4387: [blank]
- L4388: [blank]
- L4389: [blank]
- L4390: [blank]
- L4391: Updated editions will replace the previous one—the old editions will
- L4392: be renamed.
- L4393: [blank]
- L4394: Creating the works from print editions not protected by U.S. copyright
- L4395: law means that no one owns a United States copyright in these works,
- L4396: so the Foundation (and you!) can copy and distribute it in the United
- L4397: States without permission and without paying copyright
- L4398: royalties. Special rules, set forth in the General Terms of Use part
- L4399: of this license, apply to copying and distributing Project

## Structure Detection

- Detected structural convention: play acts
- Selected heading strategy: act-prefixed
- TOC entries detected: no
- Body headings detected: yes
- Section count from selected strategy: 5
- Fallback used: no
- Fallback legitimacy: not required
- Fallback reason: not required
- Structure detection status: pass

### Candidate Heading Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| act-prefixed | 5 | 5 | 0 | yes |  |
| all-caps-title | 12 | 12 | 0 | no | weaker than selected strategy act-prefixed |
| isolated-title-case | 63 | 63 | 0 | no | weaker than selected strategy act-prefixed |

### Rejected Heading Strategies

| Pattern | Candidates | Body-like | TOC-like | Reason |
| --- | ---: | ---: | ---: | --- |
| all-caps-title | 12 | 12 | 0 | weaker than selected strategy act-prefixed |
| isolated-title-case | 63 | 63 | 0 | weaker than selected strategy act-prefixed |

### Structure Warnings

- None.

## Proposed Sections

- Total proposed sections: 6

| ID | Kind | Label | Title | Words | Default |
| --- | --- | --- | --- | ---: | --- |
| title-page-001 | title-page | Opening section |  | 1514 | no |
| part-001 | part | Act 1 |  | 3676 | yes |
| part-002 | part | Act 2 |  | 9273 | yes |
| part-003 | part | Act 3 |  | 4847 | yes |
| part-004 | part | Act 4 |  | 2795 | yes |
| part-005 | part | Act 5 |  | 12657 | yes |

## Suspicious Sections

- Suspiciously short sections: None
- Suspiciously long sections: None

## Cleanup Simulation

| Action | Count | Recommendation | Samples |
| --- | ---: | --- | --- |
| remove-page-and-decorative-lines | 1 | Remove standalone page markers and decorative separators; do not remove prose punctuation. | candidate L3871: *********************** |
| normalize-smart-quotes | 1152 | Normalize smart quotes to ASCII quotes only in candidate playback text. | ’<br>“<br>”<br>’<br>’ |
| normalize-em-en-dashes | 169 | Normalize em/en dashes to spaced hyphen for Morse/audio playback, preserving sentence flow. | —<br>—<br>—<br>—<br>—<br>—<br>—<br>— |

- Footnotes/references: No footnote/reference handling issue detected in the dry run.
- Illustration/image placeholders: No illustration/image placeholder issue detected in the dry run.
- Dash normalization: Normalize em/en dashes to simple spaced hyphens for Morse/audio playback in candidate output only.

## First-Hour Preview Candidate

- Feasible: yes
- Confidence: medium
- Sections used: part-001 Act 1
- Approximate word count: 3676
- Starts at real readable content: yes
- Snippet: ACT I Covent Garden at 11.15 p.m. Torrents of heavy summer rain. Cab whistles blowing frantically in all directions. Pedestrians running for shelter into the market and under the portico of St. Paul’s Church, where there are already several people, among them a lady and her daughter in evening dress. They are all peering out gloomily at the rain, except one...

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

- Non-prose structure signals need section parsing review.
