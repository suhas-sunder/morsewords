# Pilot Dry Run: the-octopus-a-story-of-california

- Source file: `The Octopus - A Story of California.txt`
- Why selected: Medium-risk long novel with clear book/chapter structure, selected to test large but structured processing.
- Pass-2 risk level: medium
- Existing generated output: no
- Candidate title: The Octopus : A Story of California
- Candidate author: Frank Norris
- Final dry-run recommendation: process later with warnings

## Boundary Decision

- Dry-run adjustment: none.

- Raw word count: 200032
- Kept word count estimate: 196863
- Removed front matter word count estimate: 162
- Removed end matter word count estimate: 3007
- Candidate start: line 48, index 976
- Start snippet: BOOK 1 CHAPTER I

### 10-20 Lines Before Start

- L28: 
- L29: 
- L30: 
- L31: 
- L32: Produced by John Hamm
- L33: 
- L34: 
- L35: 
- L36: 
- L37: 
- L38: THE OCTOPUS
- L39: 
- L40: A Story of California
- L41: 
- L42: by Frank Norris
- L43: 
- L44: 
- L45: 
- L46: 
- L47: 

- Candidate end: line 21245, index 1118037
- End snippet: fade and vanish away. Greed, cruelty, selfishness, and inhumanity are short-lived; the individual suffers, but the race goes on. Annixter dies, but in a far distant corner of the world a thousand lives are saved. The larger view always and through all shams, all wickednesses, discovers the Truth that will, in the end, prevail, and all things, surely, inevitably, resistlessly work together for good.

### 10-20 Lines After End

- L21246: 
- L21247: 
- L21248: 
- L21249: 
- L21250: 
- L21251: 
- L21252: 
- L21253: *** END OF THE PROJECT GUTENBERG EBOOK THE OCTOPUS : A STORY OF CALIFORNIA ***
- L21254: 
- L21255: 
- L21256: 
- L21257: 
- L21258: Updated editions will replace the previous one—the old editions will
- L21259: be renamed.
- L21260: 
- L21261: Creating the works from print editions not protected by U.S. copyright
- L21262: law means that no one owns a United States copyright in these works,
- L21263: so the Foundation (and you!) can copy and distribute it in the United
- L21264: States without permission and without paying copyright
- L21265: royalties. Special rules, set forth in the General Terms of Use part

## Structure Detection

- Detected structural convention: chapter-based roman numerals with book divisions
- Selected heading strategy: chapter-roman
- TOC entries detected: yes
- Body headings detected: yes
- Section count from selected strategy: 11
- Fallback used: no
- Fallback legitimacy: not required
- Fallback reason: not required
- Structure detection status: warn

### Candidate Heading Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 15 | 11 | 4 | yes |  |
| all-caps-title | 10 | 10 | 0 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 135 | 134 | 1 | no | weaker than selected strategy chapter-roman |
| book-division | 2 | 2 | 0 | no | weaker than selected strategy chapter-roman |

### Rejected Heading Strategies

| Pattern | Candidates | Body-like | TOC-like | Reason |
| --- | ---: | ---: | ---: | --- |
| all-caps-title | 10 | 10 | 0 | weaker than selected strategy chapter-roman |
| isolated-title-case | 135 | 134 | 1 | weaker than selected strategy chapter-roman |
| book-division | 2 | 2 | 0 | weaker than selected strategy chapter-roman |

### Structure Warnings

- long book has huge sections despite detected headings

## Proposed Sections

- Total proposed sections: 12

| ID | Kind | Label | Title | Words | Default |
| --- | --- | --- | --- | ---: | --- |
| title-page-001 | title-page | Opening section |  | 48244 | no |
| chapter-001 | chapter | Chapter 5 |  | 16117 | yes |
| chapter-002 | chapter | Chapter 6 |  | 21719 | yes |
| chapter-003 | chapter | Chapter 1 |  | 11543 | yes |
| chapter-004 | chapter | Chapter 2 |  | 14299 | yes |
| chapter-005 | chapter | Chapter 3 |  | 7538 | yes |
| chapter-006 | chapter | Chapter 4 |  | 16657 | yes |
| chapter-007 | chapter | Chapter 5 |  | 11596 | yes |
| chapter-008 | chapter | Chapter 6 |  | 10068 | yes |
| chapter-009 | chapter | Chapter 7 |  | 11627 | yes |
| chapter-010 | chapter | Chapter 8 |  | 15888 | yes |
| chapter-011 | chapter | Chapter 9 |  | 11567 | yes |

## Suspicious Sections

- Suspiciously short sections: None
- Suspiciously long sections: title-page-001 (48244), chapter-002 (21719)

## Cleanup Simulation

| Action | Count | Recommendation | Samples |
| --- | ---: | --- | --- |
| remove-page-and-decorative-lines | 15 | Remove standalone page markers and decorative separators; do not remove prose punctuation. | candidate L19160: *****<br>candidate L19480: *****<br>candidate L19562: *****<br>candidate L19600: *****<br>candidate L19634: *****<br>candidate L19671: *****<br>candidate L19724: *****<br>candidate L19805: ***** |
| normalize-smart-quotes | 6162 | Normalize smart quotes to ASCII quotes only in candidate playback text. | “<br>”<br>“<br>”<br>“ |

- Footnotes/references: No footnote/reference handling issue detected in the dry run.
- Illustration/image placeholders: No illustration/image placeholder issue detected in the dry run.
- Dash normalization: Normalize em/en dashes to simple spaced hyphens for Morse/audio playback in candidate output only.

## First-Hour Preview Candidate

- Feasible: yes
- Confidence: medium
- Sections used: chapter-001 Chapter 5
- Approximate word count: 16117
- Starts at real readable content: yes
- Snippet: CHAPTER V At seven o'clock, in the bedroom of his ranch house, in the white-painted iron bedstead with its blue-grey army blankets and red counterpane, Annixter was still asleep, his face red, his mouth open, his stiff yellow hair in wild disorder. On the wooden chair at the bed-head, stood the kerosene lamp, by the light of which he had been reading the pr...

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

- Structure warning: long book has huge sections despite detected headings
- Decorative/page markers are cleanup candidates but not boundary blockers.
