# Pilot Dry Run: the-legend-of-sleepy-hollow

- Source file: `the-legend-of-sleepy-hollow.txt`
- Why selected: Medium-risk short work with a medium-confidence opening epigraph, selected as a controlled boundary review case.
- Pass-2 risk level: medium
- Existing generated output: yes
- Candidate title: The Legend of Sleepy Hollow
- Candidate author: Washington Irving
- Final dry-run recommendation: process later with warnings

## Boundary Decision

- Dry-run adjustment: none.

- Raw word count: 15429
- Kept word count estimate: 12260
- Removed front matter word count estimate: 163
- Removed end matter word count estimate: 3006
- Candidate start: line 42, index 990
- Start snippet: A pleasing land of drowsy head it was, Of dreams that wave before the half-shut eye; And of gay castles in the clouds that pass, Forever flushing round a summer sky. CASTLE OF INDOLENCE.

### 10-20 Lines Before Start

- L22: Other information and formats: www.gutenberg.org/ebooks/41
- L23: 
- L24: Credits: Ilana M. (Kingsley) Newby and Greg Newby
- L25: 
- L26: 
- L27: *** START OF THE PROJECT GUTENBERG EBOOK THE LEGEND OF SLEEPY HOLLOW ***
- L28: 
- L29: 
- L30: 
- L31: 
- L32: The Legend of Sleepy Hollow
- L33: 
- L34: by Washington Irving
- L35: 
- L36: 
- L37: 
- L38: 
- L39: FOUND AMONG THE PAPERS OF THE LATE DIEDRICH KNICKERBOCKER.
- L40: 
- L41: 

- Candidate end: line 1157, index 70633
- End snippet: extravagant--there were one or two points on which he had his doubts. “Faith, sir,” replied the story-teller, “as to that matter, I don’t believe one-half of it myself.” D. K. THE END.

### 10-20 Lines After End

- L1158: 
- L1159: 
- L1160: 
- L1161: 
- L1162: 
- L1163: *** END OF THE PROJECT GUTENBERG EBOOK THE LEGEND OF SLEEPY HOLLOW ***
- L1164: 
- L1165: 
- L1166: 
- L1167: 
- L1168: Updated editions will replace the previous one—the old editions will
- L1169: be renamed.
- L1170: 
- L1171: Creating the works from print editions not protected by U.S. copyright
- L1172: law means that no one owns a United States copyright in these works,
- L1173: so the Foundation (and you!) can copy and distribute it in the United
- L1174: States without permission and without paying copyright
- L1175: royalties. Special rules, set forth in the General Terms of Use part
- L1176: of this license, apply to copying and distributing Project
- L1177: Gutenberg™ electronic works to protect the PROJECT GUTENBERG™

## Structure Detection

- Detected structural convention: story or titled-section headings
- Selected heading strategy: all-caps-title
- TOC entries detected: no
- Body headings detected: yes
- Section count from selected strategy: 4
- Fallback used: no
- Fallback legitimacy: not required
- Fallback reason: not required
- Structure detection status: warn

### Candidate Heading Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| all-caps-title | 4 | 4 | 0 | yes |  |
| isolated-title-case | 1 | 1 | 0 | no | weaker than selected strategy all-caps-title |

### Rejected Heading Strategies

| Pattern | Candidates | Body-like | TOC-like | Reason |
| --- | ---: | ---: | ---: | --- |
| isolated-title-case | 1 | 1 | 0 | weaker than selected strategy all-caps-title |

### Structure Warnings

- None.

## Proposed Sections

- Total proposed sections: 5

| ID | Kind | Label | Title | Words | Default |
| --- | --- | --- | --- | ---: | --- |
| title-page-001 | title-page | Opening section |  | 31 | no |
| chapter-001 | chapter | Castle Of Indolence. | CASTLE OF INDOLENCE. | 11789 | yes |
| chapter-002 | chapter | Postscript. | POSTSCRIPT. | 1 | yes |
| chapter-003 | chapter | Found In The Handwriting Of Mr. Knickerbocker. | FOUND IN THE HANDWRITING OF MR. KNICKERBOCKER. | 437 | yes |
| chapter-004 | chapter | The End. | THE END. | 2 | yes |

## Suspicious Sections

- Suspiciously short sections: title-page-001 (31), chapter-002 (1), chapter-004 (2)
- Suspiciously long sections: None

## Cleanup Simulation

| Action | Count | Recommendation | Samples |
| --- | ---: | --- | --- |
| normalize-smart-quotes | 81 | Normalize smart quotes to ASCII quotes only in candidate playback text. | “<br>”<br>’<br>’<br>“ |

- Footnotes/references: No footnote/reference handling issue detected in the dry run.
- Illustration/image placeholders: No illustration/image placeholder issue detected in the dry run.
- Dash normalization: Normalize em/en dashes to simple spaced hyphens for Morse/audio playback in candidate output only.

## First-Hour Preview Candidate

- Feasible: yes
- Confidence: medium
- Sections used: chapter-001 Castle Of Indolence.
- Approximate word count: 11789
- Starts at real readable content: yes
- Snippet: CASTLE OF INDOLENCE. In the bosom of one of those spacious coves which indent the eastern shore of the Hudson, at that broad expansion of the river denominated by the ancient Dutch navigators the Tappan Zee, and where they always prudently shortened sail and implored the protection of St. Nicholas when they crossed, there lies a small market town or rural p...

## Existing Generated Output Comparison

- Manifest: app/client/assets/books/generated/the-legend-of-sleepy-hollow/manifest.json
- Section count: 4
- Default-included section count: 0
- First generated preview: The Legend of Sleepy Hollow by Washington Irving FOUND AMONG THE PAPERS OF THE LATE DIEDRICH KNICKERBOCKER. A pleasing land of drowsy head it was, Of dreams th...
- Last generated preview: THE END.
- Apparent generated damage: no default included sections; suspiciously short generated sections

## Manual Review Checklist

- Confirm the first kept line is real readable content, not source metadata or a TOC entry.
- Confirm the final kept line is real book content and the Gutenberg/license footer is excluded.
- Confirm default-readable sections exclude TOC, transcriber notes, source/license text, and publisher catalog material.
- Check suspiciously short or long proposed sections before a real write pass.
- Verify cleanup removes playback-hostile artifacts without deleting dialogue, punctuation, paragraph structure, or headings.
- Confirm the first-hour preview candidate starts with real readable content.
- Compare candidate output against existing generated output because pass 2 flagged generated-output damage.
- Review the structure-detection warnings and confirm TOC entries were not selected as body sections.

## Recommendation Reasons

- Medium-confidence start boundary remains manageable but needs review.
- Existing generated output warning: no default included sections, suspiciously short generated sections.
