# Pilot Dry Run: dracula

- Source file: `Dracula.txt`
- Pass-2 risk level: medium
- Existing generated output: yes
- Candidate title: Dracula
- Candidate author: Bram Stoker
- Final dry-run recommendation: process later with warnings

## Boundary Decision

- Dry-run adjustment: Moved candidate end from line 15498 to 15430 so the Project Gutenberg end marker at line 15433 becomes end matter.

- Raw word count: 165910
- Kept word count estimate: 162386
- Removed front matter word count estimate: 522
- Removed end matter word count estimate: 3002
- Candidate start: line 116, index 3527
- Start snippet: impression I had was that we were leaving the West and entering the East; the most western of splendid bridges over the Danube, which is here of noble width and depth, took us among the traditions of Turkish rule. We left in pretty good time, and came after nightfall to Klausenburgh.

### 10-20 Lines Before Start

- L96: exactly contemporary, given from the standpoints and within the range
- L97: of knowledge of those who made them.
- L98: 
- L99: 
- L100: DRACULA
- L101: 
- L102: 
- L103: CHAPTER I
- L104: 
- L105: JONATHAN HARKER’S JOURNAL
- L106: 
- L107: (_Kept in shorthand._)
- L108: 
- L109: 
- L110: _3 May. Bistritz._--Left Munich at 8:35 P. M., on 1st May, arriving at
- L111: Vienna early next morning; should have arrived at 6:46, but train was an
- L112: hour late. Buda-Pesth seems a wonderful place, from the glimpse which I
- L113: got of it from the train and the little I could walk through the
- L114: streets. I feared to go very far from the station, as we had arrived
- L115: late and would start as near the correct time as possible. The

- Candidate end: line 15430, index 846683
- End snippet: THE VALLEY OF HEADSTRONG MEN _Ask for Complete free list of G. & D. Popular Copyrighted Fiction_ GROSSET & DUNLAP, _Publishers_, NEW YORK

### 10-20 Lines After End

- L15431: 
- L15432: 
- L15433: *** END OF THE PROJECT GUTENBERG EBOOK DRACULA ***
- L15434: 
- L15435: 
- L15436: Updated editions will replace the previous one—the old editions will
- L15437: be renamed.
- L15438: 
- L15439: Creating the works from print editions not protected by U.S. copyright
- L15440: law means that no one owns a United States copyright in these works,
- L15441: so the Foundation (and you!) can copy and distribute it in the United
- L15442: States without permission and without paying copyright
- L15443: royalties. Special rules, set forth in the General Terms of Use part
- L15444: of this license, apply to copying and distributing Project
- L15445: Gutenberg™ electronic works to protect the PROJECT GUTENBERG™
- L15446: concept and trademark. Project Gutenberg is a registered trademark,
- L15447: and may not be used if you charge for an eBook, except by following
- L15448: the terms of the trademark license, including paying royalties for use
- L15449: of the Project Gutenberg trademark. If you do not charge anything for
- L15450: copies of this eBook, complying with the trademark license is very

## Proposed Sections

- Total proposed sections: 28

| ID | Kind | Label | Title | Words | Default |
| --- | --- | --- | --- | ---: | --- |
| title-page-001 | title-page | Opening section |  | 5659 | no |
| chapter-001 | chapter | Chapter 2 |  | 5527 | yes |
| chapter-002 | chapter | Chapter 3 |  | 5742 | yes |
| chapter-003 | chapter | Chapter 4 |  | 5873 | yes |
| chapter-004 | chapter | Chapter 5 |  | 3633 | yes |
| chapter-005 | chapter | Chapter 6 |  | 5780 | yes |
| chapter-006 | chapter | Chapter 7 |  | 5620 | yes |
| chapter-007 | chapter | Chapter 8 |  | 6353 | yes |
| chapter-008 | chapter | Chapter 9 |  | 5969 | yes |
| chapter-009 | chapter | Chapter 10 |  | 5995 | yes |
| chapter-010 | chapter | Chapter 11 |  | 5246 | yes |
| chapter-011 | chapter | Chapter 12 |  | 7374 | yes |
| chapter-012 | chapter | Chapter 13 |  | 6672 | yes |
| chapter-013 | chapter | Chapter 14 |  | 6512 | yes |
| chapter-014 | chapter | Chapter 15 |  | 5868 | yes |
| chapter-015 | chapter | Chapter 16 |  | 4616 | yes |
| chapter-016 | chapter | Chapter 17 |  | 5654 | yes |
| chapter-017 | chapter | Chapter 18 |  | 7000 | yes |
| chapter-018 | chapter | Chapter 19 |  | 5728 | yes |
| chapter-019 | chapter | Chapter 20 |  | 6007 | yes |
| chapter-020 | chapter | Chapter 21 |  | 6249 | yes |
| chapter-021 | chapter | Chapter 22 |  | 5501 | yes |
| chapter-022 | chapter | Chapter 23 |  | 5727 | yes |
| chapter-023 | chapter | Chapter 24 |  | 6350 | yes |
| chapter-024 | chapter | Chapter 25 |  | 6312 | yes |
| chapter-025 | chapter | Chapter 26 |  | 7196 | yes |
| chapter-026 | chapter | Chapter 27 |  | 7642 | yes |
| notes-001 | notes | Notes |  | 581 | no |

## Suspicious Sections

- Suspiciously short sections: None
- Suspiciously long sections: None

## Cleanup Simulation

| Action | Count | Recommendation | Samples |
| --- | ---: | --- | --- |
| remove-page-and-decorative-lines | 130 | Remove standalone page markers and decorative separators; do not remove prose punctuation. | candidate L169: * * * * *<br>candidate L677: * * * * *<br>candidate L925: * * * * *<br>candidate L1042: * * * * *<br>candidate L1111: * * * * *<br>candidate L1241: * * * * *<br>candidate L1291: * * * * *<br>candidate L1347: * * * * * |
| normalize-smart-quotes | 4541 | Normalize smart quotes to ASCII quotes only in candidate playback text. | “<br>”<br>’<br>“<br>” |

- Footnotes/references: Review footnote/reference markers before processing; remove orphan inline markers from playback, and include note prose only if needed for comprehension.
- Illustration/image placeholders: Remove placeholder markers such as [Illustration] from playback text; preserve meaningful captions only after review.
- Dash normalization: Normalize em/en dashes to simple spaced hyphens for Morse/audio playback in candidate output only.

## First-Hour Preview Candidate

- Feasible: yes
- Confidence: medium
- Sections used: chapter-001 Chapter 2
- Approximate word count: 5527
- Starts at real readable content: yes
- Snippet: CHAPTER II JONATHAN HARKER’S JOURNAL--_continued_ _5 May._--I must have been asleep, for certainly if I had been fully awake I must have noticed the approach of such a remarkable place. In the gloom the courtyard looked of considerable size, and as several dark ways led from it under great round arches, it perhaps seemed bigger than it really is. I have not...

## Existing Generated Output Comparison

- Manifest: app/client/assets/books/generated/dracula/manifest.json
- Section count: 30
- Default-included section count: 27
- First generated preview: DRACULA _by_ Bram Stoker [Illustration: colophon] NEW YORK GROSSET & DUNLAP _Publishers_ Copyright, 1897, in the United States of America, according to Act of...
- Last generated preview: NOTE Seven years ago we all went through the flames; and the happiness of some of us since then is, we think, well worth the pain we endured. It is an added jo...
- Apparent generated damage: suspiciously short generated sections

## Manual Review Checklist

- Confirm the first kept line is real readable content, not source metadata or a TOC entry.
- Confirm the final kept line is real book content and the Gutenberg/license footer is excluded.
- Confirm default-readable sections exclude TOC, transcriber notes, source/license text, and publisher catalog material.
- Check suspiciously short or long proposed sections before a real write pass.
- Verify cleanup removes playback-hostile artifacts without deleting dialogue, punctuation, paragraph structure, or headings.
- Confirm the first-hour preview candidate starts with real readable content.
- Compare candidate output against existing generated output because pass 2 flagged generated-output damage.

## Recommendation Reasons

- Table of contents appears isolated before readable content.
- Footnote/reference section detected.
- Illustration/image placeholders should be cleaned or suppressed later.
- Decorative/page markers are cleanup candidates but not boundary blockers.
- Existing generated output warning: suspiciously short generated sections.
