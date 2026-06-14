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

## Proposed Sections

- Total proposed sections: 12

| ID | Kind | Label | Title | Words | Default |
| --- | --- | --- | --- | ---: | --- |
| part-001 | part | Part 1 |  | 5366 | yes |
| part-002 | part | Part 2 |  | 5344 | yes |
| part-003 | part | Part 3 |  | 5397 | yes |
| part-004 | part | Part 4 |  | 5458 | yes |
| part-005 | part | Part 5 |  | 5499 | yes |
| part-006 | part | Part 6 |  | 5499 | yes |
| part-007 | part | Part 7 |  | 5484 | yes |
| part-008 | part | Part 8 |  | 5442 | yes |
| part-009 | part | Part 9 |  | 5555 | yes |
| part-010 | part | Part 10 |  | 5396 | yes |
| part-011 | part | Part 11 |  | 3416 | yes |
| part-012 | part | Part 12 |  | 0 | yes |

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
- Sections used: part-001 Part 1
- Approximate word count: 5366
- Starts at real readable content: yes
- Snippet: DEDICATION For Betty and Vall, with loving remembrance * * * * * CONTENTS 1. The Ship from Terra 2. Reporter Working 3. Bottom Level 4. Main City Level 5. Meeting Out of Order 6. Elementary, My Dear Kivelson 7. Aboard the _Javelin_ 8. Practice, 50-MM Gun 9. Monster Killing 10. Mayday, Mayday 11. Darkness and Cold 12. Castaways Working 13. The Beacon Light 1...

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
