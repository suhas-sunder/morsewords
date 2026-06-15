# Pilot Dry Run: the-wendigo

- Source file: `The Wendigo.txt`
- Why selected: High-confidence standalone Roman sections in a shorter work with feasible preview boundaries.
- Pass-2 risk level: medium
- Existing generated output: no
- Candidate title: The Wendigo
- Candidate author: Algernon Blackwood
- Final dry-run recommendation: process later with warnings

## Boundary Decision

- Dry-run adjustment: none.

- Raw word count: 21797
- Kept word count estimate: 18644
- Removed front matter word count estimate: 150
- Removed end matter word count estimate: 3003
- Candidate start: line 42, index 950
- Start snippet: A considerable number of hunting parties were out that year without finding so much as a fresh trail; for the moose were uncommonly shy, and the various Nimrods returned to the bosoms of their respective families with the best excuses the facts of their imaginations could suggest. Dr. Cathcart, among others, came back without a trophy; but he brought instead the memory of an experience which he declares was worth all the

### 10-20 Lines Before Start

- L22: Other information and formats: www.gutenberg.org/ebooks/10897
- L23: [blank]
- L24: Credits: Produced by Suzanne Shell, Beginners Projects, Dave Morgan and the
- L25: Online Distributed Proofreading Team.
- L26: [blank]
- L27: [blank]
- L28: *** START OF THE PROJECT GUTENBERG EBOOK THE WENDIGO ***
- L29: [blank]
- L30: THE WENDIGO
- L31: [blank]
- L32: Algernon Blackwood
- L33: [blank]
- L34: 1910
- L35: [blank]
- L36: [blank]
- L37: [blank]
- L38: [blank]
- L39: I
- L40: [blank]
- L41: [blank]

- Candidate end: line 1959, index 107395
- End snippet: odour. That same instant old Punk started for home. He covered the entire journey of three days as only Indian blood could have covered it. The terror of a whole race drove him. He knew what it all meant. Défago had "seen the Wendigo."

### 10-20 Lines After End

- L1960: [blank]
- L1961: [blank]
- L1962: [blank]
- L1963: [blank]
- L1964: [blank]
- L1965: [blank]
- L1966: [blank]
- L1967: [blank]
- L1968: *** END OF THE PROJECT GUTENBERG EBOOK THE WENDIGO ***
- L1969: [blank]
- L1970: [blank]
- L1971: [blank]
- L1972: [blank]
- L1973: Updated editions will replace the previous one—the old editions will
- L1974: be renamed.
- L1975: [blank]
- L1976: Creating the works from print editions not protected by U.S. copyright
- L1977: law means that no one owns a United States copyright in these works,
- L1978: so the Foundation (and you!) can copy and distribute it in the United
- L1979: States without permission and without paying copyright

## Structure Detection

- Detected structural convention: standalone roman numeral sections
- Selected heading strategy: roman-only
- TOC entries detected: no
- Body headings detected: yes
- Section count from selected strategy: 8
- Fallback used: no
- Fallback legitimacy: not required
- Fallback reason: not required
- Structure detection status: pass

### Candidate Heading Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| roman-only | 8 | 8 | 0 | yes |  |

### Rejected Heading Strategies

| Pattern | Candidates | Body-like | TOC-like | Reason |
| --- | ---: | ---: | ---: | --- |
| None | 0 | 0 | 0 | |

### Structure Warnings

- None.

## Proposed Sections

- Total proposed sections: 9

| ID | Kind | Label | Title | Words | Default |
| --- | --- | --- | --- | ---: | --- |
| title-page-001 | title-page | Opening section |  | 2573 | no |
| chapter-001 | chapter | Chapter 2 |  | 4230 | yes |
| chapter-002 | chapter | Chapter 3 |  | 566 | yes |
| chapter-003 | chapter | Chapter 4 |  | 2830 | yes |
| chapter-004 | chapter | Chapter 5 |  | 1635 | yes |
| chapter-005 | chapter | Chapter 6 |  | 2395 | yes |
| chapter-006 | chapter | Chapter 7 |  | 1308 | yes |
| chapter-007 | chapter | Chapter 8 |  | 2142 | yes |
| chapter-008 | chapter | Chapter 9 |  | 965 | yes |

## Suspicious Sections

- Suspiciously short sections: None
- Suspiciously long sections: None

## Cleanup Simulation

| Action | Count | Recommendation | Samples |
| --- | ---: | --- | --- |
| remove-page-and-decorative-lines | 6 | Remove standalone page markers and decorative separators; do not remove prose punctuation. | candidate L557: * * * * *<br>candidate L996: * * * * *<br>candidate L1126: * * * * *<br>candidate L1295: * * * * *<br>candidate L1342: * * * * *<br>candidate L1842: * * * * * |

- Footnotes/references: No footnote/reference handling issue detected in the dry run.
- Illustration/image placeholders: No illustration/image placeholder issue detected in the dry run.
- Dash normalization: Normalize em/en dashes to simple spaced hyphens for Morse/audio playback in candidate output only.

## First-Hour Preview Candidate

- Feasible: yes
- Confidence: medium
- Sections used: chapter-001 Chapter 2
- Approximate word count: 4230
- Starts at real readable content: yes
- Snippet: II In the morning the camp was astir before the sun. There had been a light fall of snow during the night and the air was sharp. Punk had done his duty betimes, for the odors of coffee and fried bacon reached every tent. All were in good spirits. "Wind's shifted!" cried Hank vigorously, watching Simpson and his guide already loading the small canoe. "It's a...

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
