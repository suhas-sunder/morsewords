# Pilot Dry Run: four-day-planet

- Source file: `Four-Day Planet.txt`
- Why selected: Medium-risk science-fiction novel with dedication/TOC/transcriber-note cleanup signals and high-confidence boundaries.
- Pass-2 risk level: medium
- Existing generated output: no
- Candidate title: Four-Day Planet
- Candidate author: H. Beam Piper
- Final dry-run recommendation: process later with warnings

## Boundary Decision

- Dry-run adjustment: none.

- Raw word count: 61092
- Kept word count estimate: 57856
- Removed front matter word count estimate: 233
- Removed end matter word count estimate: 3003
- Candidate start: line 76, index 1784
- Start snippet: DEDICATION For Betty and Vall, with loving remembrance * * * * *

### 10-20 Lines Before Start

- L56: 
- L57: 
- L58: 
- L59: SF
- L60: ace books
- L61: A Division of Charter Communications Inc.
- L62: A GROSSET & DUNLAP COMPANY
- L63: 360 Park Avenue South
- L64: New York, New York 10010
- L65: 
- L66: 
- L67: 
- L68: Copyright © 1961 by H. Beam Piper
- L69: 
- L70: 
- L71: _Cover art by Michael Whelan_
- L72: 
- L73: * * * * *
- L74: 
- L75: 

- Candidate end: line 6710, index 318073
- End snippet: dangerous. Unfortunately it's common knowledge that the s'Srauff are evolved from canine ancestors--and not a Texan alive is about to be scared of a talking dog! But unless he can get them to act, and fast, there won't be a Texan alive, scared or otherwise! * * * * *

### 10-20 Lines After End

- L6711: 
- L6712: 
- L6713: 
- L6714: 
- L6715: 
- L6716: 
- L6717: 
- L6718: *** END OF THE PROJECT GUTENBERG EBOOK FOUR-DAY PLANET ***
- L6719: 
- L6720: 
- L6721: 
- L6722: 
- L6723: Updated editions will replace the previous one—the old editions will
- L6724: be renamed.
- L6725: 
- L6726: Creating the works from print editions not protected by U.S. copyright
- L6727: law means that no one owns a United States copyright in these works,
- L6728: so the Foundation (and you!) can copy and distribute it in the United
- L6729: States without permission and without paying copyright
- L6730: royalties. Special rules, set forth in the General Terms of Use part

## Structure Detection

- Detected structural convention: standalone arabic-numbered sections
- Selected heading strategy: arabic-only
- TOC entries detected: yes
- Body headings detected: yes
- Section count from selected strategy: 20
- Fallback used: no
- Fallback legitimacy: not required
- Fallback reason: not required
- Structure detection status: pass

### Candidate Heading Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| arabic-only | 20 | 20 | 0 | yes |  |
| isolated-title-case | 60 | 58 | 1 | no | weaker than selected strategy arabic-only |
| all-caps-title | 33 | 33 | 0 | no | weaker than selected strategy arabic-only |
| arabic-numbered-title | 20 | 2 | 18 | no | weaker than selected strategy arabic-only |
| special-front-back | 1 | 0 | 1 | no | rejected as TOC-like or front-matter-only evidence |

### Rejected Heading Strategies

| Pattern | Candidates | Body-like | TOC-like | Reason |
| --- | ---: | ---: | ---: | --- |
| isolated-title-case | 60 | 58 | 1 | weaker than selected strategy arabic-only |
| all-caps-title | 33 | 33 | 0 | weaker than selected strategy arabic-only |
| arabic-numbered-title | 20 | 2 | 18 | weaker than selected strategy arabic-only |
| special-front-back | 1 | 0 | 1 | rejected as TOC-like or front-matter-only evidence |

### Structure Warnings

- None.

## Proposed Sections

- Total proposed sections: 21

| ID | Kind | Label | Title | Words | Default |
| --- | --- | --- | --- | ---: | --- |
| title-page-001 | title-page | Opening section |  | 84 | no |
| chapter-001 | chapter | Section 1 |  | 3992 | yes |
| chapter-002 | chapter | Section 2 |  | 3492 | yes |
| chapter-003 | chapter | Section 3 |  | 3019 | yes |
| chapter-004 | chapter | Section 4 |  | 2926 | yes |
| chapter-005 | chapter | Section 5 |  | 3157 | yes |
| chapter-006 | chapter | Section 6 |  | 2406 | yes |
| chapter-007 | chapter | Section 7 |  | 2485 | yes |
| chapter-008 | chapter | Section 8 |  | 2568 | yes |
| chapter-009 | chapter | Section 9 |  | 2081 | yes |
| chapter-010 | chapter | Section 10 |  | 2578 | yes |
| chapter-011 | chapter | Section 11 |  | 2400 | yes |
| chapter-012 | chapter | Section 12 |  | 1967 | yes |
| chapter-013 | chapter | Section 13 |  | 1550 | yes |
| chapter-014 | chapter | Section 14 |  | 1954 | yes |
| chapter-015 | chapter | Section 15 |  | 3588 | yes |
| chapter-016 | chapter | Section 16 |  | 2327 | yes |
| chapter-017 | chapter | Section 17 |  | 3088 | yes |
| chapter-018 | chapter | Section 18 |  | 2916 | yes |
| chapter-019 | chapter | Section 19 |  | 4777 | yes |
| chapter-020 | chapter | Section 20 |  | 4501 | yes |

## Suspicious Sections

- Suspiciously short sections: None
- Suspiciously long sections: None

## Cleanup Simulation

| Action | Count | Recommendation | Samples |
| --- | ---: | --- | --- |
| remove-page-and-decorative-lines | 10 | Remove standalone page markers and decorative separators; do not remove prose punctuation. | candidate L6: * * * * *<br>candidate L52: * * * * *<br>candidate L2236: * * * * *<br>candidate L2534: * * * * *<br>candidate L6182: * * * * *<br>candidate L6336: * * * * *<br>candidate L6481: * * * * *<br>candidate L6533: * * * * * |

- Footnotes/references: No footnote/reference handling issue detected in the dry run.
- Illustration/image placeholders: No illustration/image placeholder issue detected in the dry run.
- Dash normalization: Normalize em/en dashes to simple spaced hyphens for Morse/audio playback in candidate output only.

## First-Hour Preview Candidate

- Feasible: yes
- Confidence: medium
- Sections used: chapter-001 Section 1
- Approximate word count: 3992
- Starts at real readable content: yes
- Snippet: 1 THE SHIP FROM TERRA I went through the gateway, towing my equipment in a contragravity hamper over my head. As usual, I was wondering what it would take, short of a revolution, to get the city of Port Sandor as clean and tidy and well lighted as the spaceport area. I knew Dad's editorials and my sarcastic news stories wouldn't do it. We'd been trying long...

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
- Transcriber/editor notes are present and should stay out of readable defaults.
- Decorative/page markers are cleanup candidates but not boundary blockers.
