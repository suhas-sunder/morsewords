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

## Proposed Sections

- Total proposed sections: 17

| ID | Kind | Label | Title | Words | Default |
| --- | --- | --- | --- | ---: | --- |
| book-001 | book | Book 1 |  | 2 | yes |
| chapter-001 | chapter | Chapter 1 |  | 15240 | yes |
| chapter-002 | chapter | Chapter 2 |  | 13151 | yes |
| chapter-003 | chapter | Chapter 3 |  | 8997 | yes |
| chapter-004 | chapter | Chapter 4 |  | 10854 | yes |
| chapter-005 | chapter | Chapter 5 |  | 16117 | yes |
| chapter-006 | chapter | Chapter 6 |  | 21717 | yes |
| book-002 | book | Book 2 |  | 2 | yes |
| chapter-007 | chapter | Chapter 1 |  | 11543 | yes |
| chapter-008 | chapter | Chapter 2 |  | 14299 | yes |
| chapter-009 | chapter | Chapter 3 |  | 7538 | yes |
| chapter-010 | chapter | Chapter 4 |  | 16657 | yes |
| chapter-011 | chapter | Chapter 5 |  | 11596 | yes |
| chapter-012 | chapter | Chapter 6 |  | 10068 | yes |
| chapter-013 | chapter | Chapter 7 |  | 11627 | yes |
| chapter-014 | chapter | Chapter 8 |  | 15888 | yes |
| chapter-015 | chapter | Chapter 9 |  | 11567 | yes |

## Suspicious Sections

- Suspiciously short sections: book-001 (2), book-002 (2)
- Suspiciously long sections: chapter-006 (21717)

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
- Sections used: book-001 Book 1, chapter-001 Chapter 1
- Approximate word count: 15242
- Starts at real readable content: yes
- Snippet: BOOK 1 CHAPTER I Just after passing Caraher's saloon, on the County Road that ran south from Bonneville, and that divided the Broderson ranch from that of Los Muertos, Presley was suddenly aware of the faint and prolonged blowing of a steam whistle that he knew must come from the railroad shops near the depot at Bonneville. In starting out from the ranch ho...

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

- Decorative/page markers are cleanup candidates but not boundary blockers.
