# Pilot Dry Run: the-king-in-yellow

- Source file: `The King in Yellow.txt`
- Why selected: High-confidence standalone Roman sections, selected to test story/section boundaries in a collection-shaped work.
- Pass-2 risk level: medium
- Existing generated output: no
- Candidate title: The King in Yellow
- Candidate author: Robert W. Chambers
- Final dry-run recommendation: process later with warnings

## Boundary Decision

- Dry-run adjustment: none.

- Raw word count: 75998
- Kept word count estimate: 71271
- Removed front matter word count estimate: 1722
- Removed end matter word count estimate: 3005
- Candidate start: line 231, index 10373
- Start snippet: allowed the blow to fall afterward with more awful effect. It was, I remember, the 13th day of April, 1920, that the first Government Lethal Chamber was established on the south side of Washington Square, between Wooster Street and South Fifth Avenue. The block which had formerly consisted of a lot of shabby old buildings,

### 10-20 Lines Before Start

- L211: and laughed and trembled with a horror which at times assails me yet.
- L212: This is the thing that troubles me, for I cannot forget Carcosa where
- L213: black stars hang in the heavens; where the shadows of men’s thoughts
- L214: lengthen in the afternoon, when the twin suns sink into the lake of
- L215: Hali; and my mind will bear for ever the memory of the Pallid Mask.
- L216: I pray God will curse the writer, as the writer has cursed the world
- L217: with this beautiful, stupendous creation, terrible in its simplicity,
- L218: irresistible in its truth—a world which now trembles before the King
- L219: in Yellow. When the French Government seized the translated copies
- L220: which had just arrived in Paris, London, of course, became eager to
- L221: read it. It is well known how the book spread like an infectious
- L222: disease, from city to city, from continent to continent, barred out
- L223: here, confiscated there, denounced by Press and pulpit, censured even
- L224: by the most advanced of literary anarchists. No definite principles
- L225: had been violated in those wicked pages, no doctrine promulgated, no
- L226: convictions outraged. It could not be judged by any known standard,
- L227: yet, although it was acknowledged that the supreme note of art had been
- L228: struck in _The King in Yellow_, all felt that human nature could not
- L229: bear the strain, nor thrive on words in which the essence of purest
- L230: poison lurked. The very banality and innocence of the first act only

- Candidate end: line 8823, index 403566
- End snippet: room, opened the door. The landing was dark and silent, but the girl lifted the lamp and gliding past him slipped down the polished stairs to the hallway. Then unchaining the bolts, she drew open the iron wicket. Through this he passed with his rose.

### 10-20 Lines After End

- L8824: [blank]
- L8825: [blank]
- L8826: [blank]
- L8827: [blank]
- L8828: *** END OF THE PROJECT GUTENBERG EBOOK THE KING IN YELLOW ***
- L8829: [blank]
- L8830: [blank]
- L8831: [blank]
- L8832: [blank]
- L8833: Updated editions will replace the previous one—the old editions will
- L8834: be renamed.
- L8835: [blank]
- L8836: Creating the works from print editions not protected by U.S. copyright
- L8837: law means that no one owns a United States copyright in these works,
- L8838: so the Foundation (and you!) can copy and distribute it in the United
- L8839: States without permission and without paying copyright
- L8840: royalties. Special rules, set forth in the General Terms of Use part
- L8841: of this license, apply to copying and distributing Project
- L8842: Gutenberg™ electronic works to protect the PROJECT GUTENBERG™
- L8843: concept and trademark. Project Gutenberg is a registered trademark,

## Structure Detection

- Detected structural convention: standalone roman numeral sections
- Selected heading strategy: roman-only
- TOC entries detected: no
- Body headings detected: yes
- Section count from selected strategy: 28
- Fallback used: no
- Fallback legitimacy: not required
- Fallback reason: not required
- Structure detection status: pass

### Candidate Heading Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| roman-only | 28 | 28 | 0 | yes |  |
| all-caps-title | 34 | 34 | 0 | no | weaker than selected strategy roman-only |
| isolated-title-case | 106 | 106 | 0 | no | weaker than selected strategy roman-only |
| arabic-numbered-title | 3 | 3 | 0 | no | weaker than selected strategy roman-only |

### Rejected Heading Strategies

| Pattern | Candidates | Body-like | TOC-like | Reason |
| --- | ---: | ---: | ---: | --- |
| all-caps-title | 34 | 34 | 0 | weaker than selected strategy roman-only |
| isolated-title-case | 106 | 106 | 0 | weaker than selected strategy roman-only |
| arabic-numbered-title | 3 | 3 | 0 | weaker than selected strategy roman-only |

### Structure Warnings

- None.

## Proposed Sections

- Total proposed sections: 29

| ID | Kind | Label | Title | Words | Default |
| --- | --- | --- | --- | ---: | --- |
| title-page-001 | title-page | Opening section |  | 1873 | no |
| chapter-001 | chapter | Chapter 2 |  | 4127 | yes |
| chapter-002 | chapter | Chapter 3 |  | 4976 | yes |
| chapter-003 | chapter | Chapter 1 |  | 1575 | yes |
| chapter-004 | chapter | Chapter 2 |  | 1199 | yes |
| chapter-005 | chapter | Chapter 3 |  | 2610 | yes |
| chapter-006 | chapter | Chapter 4 |  | 4736 | yes |
| chapter-007 | chapter | Chapter 1 |  | 1884 | yes |
| chapter-008 | chapter | Chapter 2 |  | 3987 | yes |
| chapter-009 | chapter | Chapter 3 |  | 1615 | yes |
| chapter-010 | chapter | Chapter 1 |  | 2484 | yes |
| chapter-011 | chapter | Chapter 2 |  | 4430 | yes |
| chapter-012 | chapter | Chapter 1 |  | 1077 | yes |
| chapter-013 | chapter | Chapter 2 |  | 1266 | yes |
| chapter-014 | chapter | Chapter 1 |  | 2461 | yes |
| chapter-015 | chapter | Chapter 2 |  | 4609 | yes |
| chapter-016 | chapter | Chapter 3 |  | 3292 | yes |
| chapter-017 | chapter | Chapter 4 |  | 1757 | yes |
| chapter-018 | chapter | Chapter 1 |  | 978 | yes |
| chapter-019 | chapter | Chapter 2 |  | 1202 | yes |
| chapter-020 | chapter | Chapter 3 |  | 2518 | yes |
| chapter-021 | chapter | Chapter 4 |  | 4631 | yes |
| chapter-022 | chapter | Chapter 5 |  | 1474 | yes |
| chapter-023 | chapter | Chapter 6 |  | 2520 | yes |
| chapter-024 | chapter | Chapter 1 |  | 1556 | yes |
| chapter-025 | chapter | Chapter 2 |  | 1134 | yes |
| chapter-026 | chapter | Chapter 3 |  | 991 | yes |
| chapter-027 | chapter | Chapter 4 |  | 1982 | yes |
| chapter-028 | chapter | Chapter 5 |  | 2327 | yes |

## Suspicious Sections

- Suspiciously short sections: None
- Suspiciously long sections: None

## Cleanup Simulation

| Action | Count | Recommendation | Samples |
| --- | ---: | --- | --- |
| remove-page-and-decorative-lines | 12 | Remove standalone page markers and decorative separators; do not remove prose punctuation. | candidate L2241: * * * * *<br>candidate L3044: * * * * *<br>candidate L3113: * * * * *<br>candidate L3751: * * * * *<br>candidate L3974: * * * *<br>candidate L4285: +-------------------------+<br>candidate L4289: +-------------------------+<br>candidate L6602: +---------------------------+ |
| normalize-smart-quotes | 4295 | Normalize smart quotes to ASCII quotes only in candidate playback text. | “<br>”<br>’<br>“<br>” |
| normalize-em-en-dashes | 522 | Normalize em/en dashes to spaced hyphen for Morse/audio playback, preserving sentence flow. | —<br>—<br>—<br>—<br>—<br>—<br>—<br>— |

- Footnotes/references: No footnote/reference handling issue detected in the dry run.
- Illustration/image placeholders: No illustration/image placeholder issue detected in the dry run.
- Dash normalization: Normalize em/en dashes to simple spaced hyphens for Morse/audio playback in candidate output only.

## First-Hour Preview Candidate

- Feasible: yes
- Confidence: medium
- Sections used: chapter-001 Chapter 2
- Approximate word count: 4127
- Starts at real readable content: yes
- Snippet: II I climbed the three dilapidated flights of stairs, which I had so often climbed before, and knocked at a small door at the end of the corridor. Mr. Wilde opened the door and I walked in. When he had double-locked the door and pushed a heavy chest against it, he came and sat down beside me, peering up into my face with his little light-coloured eyes. Half...

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
- Table of contents appears isolated before readable content.
- Decorative/page markers are cleanup candidates but not boundary blockers.
