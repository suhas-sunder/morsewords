# Pilot Dry Run: wuthering-heights

- Source file: `Wuthering Heights.txt`
- Why selected: High-confidence chapter-Roman structure with regular sections and useful comparison against any existing generated output.
- Pass-2 risk level: medium
- Existing generated output: no
- Candidate title: Wuthering Heights
- Candidate author: Emily Brontë
- Final dry-run recommendation: process later with warnings

## Boundary Decision

- Dry-run adjustment: none.

- Raw word count: 121975
- Kept word count estimate: 118835
- Removed front matter word count estimate: 137
- Removed end matter word count estimate: 3003
- Candidate start: line 39, index 849
- Start snippet: CHAPTER I 1801—I have just returned from a visit to my landlord—the solitary neighbour that I shall be troubled with. This is certainly a beautiful country! In all England, I do not believe that I could have fixed on a

### 10-20 Lines Before Start

- L19: [blank]
- L20: Language: English
- L21: [blank]
- L22: Other information and formats: www.gutenberg.org/ebooks/768
- L23: [blank]
- L24: Credits: David Price
- L25: [blank]
- L26: [blank]
- L27: *** START OF THE PROJECT GUTENBERG EBOOK WUTHERING HEIGHTS ***
- L28: [blank]
- L29: [blank]
- L30: [blank]
- L31: [blank]
- L32: Wuthering Heights
- L33: [blank]
- L34: by Emily Brontë
- L35: [blank]
- L36: [blank]
- L37: [blank]
- L38: [blank]

- Candidate end: line 12373, index 646415
- End snippet: still bare. I lingered round them, under that benign sky: watched the moths fluttering among the heath and harebells, listened to the soft wind breathing through the grass, and wondered how any one could ever imagine unquiet slumbers for the sleepers in that quiet earth.

### 10-20 Lines After End

- L12374: [blank]
- L12375: [blank]
- L12376: [blank]
- L12377: [blank]
- L12378: *** END OF THE PROJECT GUTENBERG EBOOK WUTHERING HEIGHTS ***
- L12379: [blank]
- L12380: [blank]
- L12381: [blank]
- L12382: [blank]
- L12383: Updated editions will replace the previous one—the old editions will
- L12384: be renamed.
- L12385: [blank]
- L12386: Creating the works from print editions not protected by U.S. copyright
- L12387: law means that no one owns a United States copyright in these works,
- L12388: so the Foundation (and you!) can copy and distribute it in the United
- L12389: States without permission and without paying copyright
- L12390: royalties. Special rules, set forth in the General Terms of Use part
- L12391: of this license, apply to copying and distributing Project
- L12392: Gutenberg™ electronic works to protect the PROJECT GUTENBERG™
- L12393: concept and trademark. Project Gutenberg is a registered trademark,

## Structure Detection

- Detected structural convention: chapter-based roman numerals
- Selected heading strategy: chapter-roman
- TOC entries detected: no
- Body headings detected: yes
- Section count from selected strategy: 34
- Fallback used: no
- Fallback legitimacy: not required
- Fallback reason: not required
- Structure detection status: pass

### Candidate Heading Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 34 | 34 | 0 | yes |  |
| isolated-title-case | 21 | 21 | 0 | no | weaker than selected strategy chapter-roman |
| roman-numbered-title | 3 | 3 | 0 | no | weaker than selected strategy chapter-roman |

### Rejected Heading Strategies

| Pattern | Candidates | Body-like | TOC-like | Reason |
| --- | ---: | ---: | ---: | --- |
| isolated-title-case | 21 | 21 | 0 | weaker than selected strategy chapter-roman |
| roman-numbered-title | 3 | 3 | 0 | weaker than selected strategy chapter-roman |

### Structure Warnings

- None.

## Proposed Sections

- Total proposed sections: 34

| ID | Kind | Label | Title | Words | Default |
| --- | --- | --- | --- | ---: | --- |
| chapter-001 | chapter | Chapter 1 |  | 1940 | yes |
| chapter-002 | chapter | Chapter 2 |  | 3407 | yes |
| chapter-003 | chapter | Chapter 3 |  | 4884 | yes |
| chapter-004 | chapter | Chapter 4 |  | 2746 | yes |
| chapter-005 | chapter | Chapter 5 |  | 1430 | yes |
| chapter-006 | chapter | Chapter 6 |  | 2620 | yes |
| chapter-007 | chapter | Chapter 7 |  | 4091 | yes |
| chapter-008 | chapter | Chapter 8 |  | 3474 | yes |
| chapter-009 | chapter | Chapter 9 |  | 6260 | yes |
| chapter-010 | chapter | Chapter 10 |  | 6466 | yes |
| chapter-011 | chapter | Chapter 11 |  | 4168 | yes |
| chapter-012 | chapter | Chapter 12 |  | 5075 | yes |
| chapter-013 | chapter | Chapter 13 |  | 4375 | yes |
| chapter-014 | chapter | Chapter 14 |  | 3444 | yes |
| chapter-015 | chapter | Chapter 15 |  | 3204 | yes |
| chapter-016 | chapter | Chapter 16 |  | 1794 | yes |
| chapter-017 | chapter | Chapter 17 |  | 6977 | yes |
| chapter-018 | chapter | Chapter 18 |  | 3652 | yes |
| chapter-019 | chapter | Chapter 19 |  | 1634 | yes |
| chapter-020 | chapter | Chapter 20 |  | 2237 | yes |
| chapter-021 | chapter | Chapter 21 |  | 6506 | yes |
| chapter-022 | chapter | Chapter 22 |  | 2400 | yes |
| chapter-023 | chapter | Chapter 23 |  | 2985 | yes |
| chapter-024 | chapter | Chapter 24 |  | 3978 | yes |
| chapter-025 | chapter | Chapter 25 |  | 1453 | yes |
| chapter-026 | chapter | Chapter 26 |  | 1524 | yes |
| chapter-027 | chapter | Chapter 27 |  | 4668 | yes |
| chapter-028 | chapter | Chapter 28 |  | 2699 | yes |
| chapter-029 | chapter | Chapter 29 |  | 2341 | yes |
| chapter-030 | chapter | Chapter 30 |  | 2449 | yes |
| chapter-031 | chapter | Chapter 31 |  | 2125 | yes |
| chapter-032 | chapter | Chapter 32 |  | 4165 | yes |
| chapter-033 | chapter | Chapter 33 |  | 3209 | yes |
| chapter-034 | chapter | Chapter 34 |  | 4455 | yes |

## Suspicious Sections

- Suspiciously short sections: None
- Suspiciously long sections: None

## Cleanup Simulation

| Action | Count | Recommendation | Samples |
| --- | ---: | --- | --- |
| remove-page-and-decorative-lines | 11 | Remove standalone page markers and decorative separators; do not remove prose punctuation. | candidate L733: * * * * * *<br>candidate L748: * * * * * *<br>candidate L1233: * * * * *<br>candidate L2090: * * * * *<br>candidate L3205: * * * * *<br>candidate L3266: * * * * *<br>candidate L4914: * * * * *<br>candidate L5595: * * * * * |
| normalize-smart-quotes | 7362 | Normalize smart quotes to ASCII quotes only in candidate playback text. | ’<br>“<br>”<br>“<br>” |
| normalize-em-en-dashes | 689 | Normalize em/en dashes to spaced hyphen for Morse/audio playback, preserving sentence flow. | —<br>—<br>—<br>—<br>—<br>—<br>—<br>— |

- Footnotes/references: No footnote/reference handling issue detected in the dry run.
- Illustration/image placeholders: No illustration/image placeholder issue detected in the dry run.
- Dash normalization: Normalize em/en dashes to simple spaced hyphens for Morse/audio playback in candidate output only.

## First-Hour Preview Candidate

- Feasible: yes
- Confidence: medium
- Sections used: chapter-001 Chapter 1
- Approximate word count: 1940
- Starts at real readable content: yes
- Snippet: CHAPTER I 1801—I have just returned from a visit to my landlord—the solitary neighbour that I shall be troubled with. This is certainly a beautiful country! In all England, I do not believe that I could have fixed on a situation so completely removed from the stir of society. A perfect misanthropist’s Heaven—and Mr. Heathcliff and I are such a suitable pair...

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
