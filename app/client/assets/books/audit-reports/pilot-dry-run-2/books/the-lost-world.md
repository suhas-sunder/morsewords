# Pilot Dry Run: the-lost-world

- Source file: `The Lost World.txt`
- Why selected: Medium-risk prose novel with high-confidence boundaries, isolated TOC handling, no existing generated output, and a feasible preview source.
- Pass-2 risk level: medium
- Existing generated output: no
- Candidate title: The Lost World
- Candidate author: Arthur Conan Doyle
- Final dry-run recommendation: process later with warnings

## Boundary Decision

- Dry-run adjustment: none.

- Raw word count: 79252
- Kept word count estimate: 76065
- Removed front matter word count estimate: 183
- Removed end matter word count estimate: 3004
- Candidate start: line 49, index 1250
- Start snippet: Foreword Mr. E. D. Malone desires to state that both the injunction for restraint and the libel action have been withdrawn unreservedly by Professor G. E. Challenger, who, being

### 10-20 Lines Before Start

- L29: THE LOST WORLD
- L30: 
- L31: I have wrought my simple plan
- L32: If I give one hour of joy
- L33: To the boy who's half a man,
- L34: Or the man who's half a boy.
- L35: 
- L36: 
- L37: 
- L38: The Lost World
- L39: 
- L40: 
- L41: By
- L42: 
- L43: SIR ARTHUR CONAN DOYLE
- L44: 
- L45: COPYRIGHT, 1912
- L46: 
- L47: 
- L48: 

- Candidate end: line 8005, index 424883
- End snippet: "Not just yet," said I, with a rueful smile. "I think, if you will have me, that I would rather go with you." Lord Roxton said nothing, but a brown hand was stretched out to me across the table.

### 10-20 Lines After End

- L8006: 
- L8007: 
- L8008: 
- L8009: 
- L8010: 
- L8011: 
- L8012: 
- L8013: 
- L8014: 
- L8015: 
- L8016: 
- L8017: *** END OF THE PROJECT GUTENBERG EBOOK THE LOST WORLD ***
- L8018: 
- L8019: 
- L8020: 
- L8021: 
- L8022: Updated editions will replace the previous one—the old editions will
- L8023: be renamed.
- L8024: 
- L8025: Creating the works from print editions not protected by U.S. copyright

## Structure Detection

- Detected structural convention: chapter-based roman numerals
- Selected heading strategy: chapter-roman
- TOC entries detected: yes
- Body headings detected: yes
- Section count from selected strategy: 16
- Fallback used: no
- Fallback legitimacy: not required
- Fallback reason: not required
- Structure detection status: pass

### Candidate Heading Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 16 | 16 | 0 | yes |  |
| all-caps-title | 11 | 9 | 2 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 57 | 55 | 2 | no | weaker than selected strategy chapter-roman |
| roman-numbered-title | 17 | 1 | 16 | no | weaker than selected strategy chapter-roman |
| special-front-back | 2 | 1 | 1 | no | weaker than selected strategy chapter-roman |

### Rejected Heading Strategies

| Pattern | Candidates | Body-like | TOC-like | Reason |
| --- | ---: | ---: | ---: | --- |
| all-caps-title | 11 | 9 | 2 | weaker than selected strategy chapter-roman |
| isolated-title-case | 57 | 55 | 2 | weaker than selected strategy chapter-roman |
| roman-numbered-title | 17 | 1 | 16 | weaker than selected strategy chapter-roman |
| special-front-back | 2 | 1 | 1 | weaker than selected strategy chapter-roman |

### Structure Warnings

- None.

## Proposed Sections

- Total proposed sections: 17

| ID | Kind | Label | Title | Words | Default |
| --- | --- | --- | --- | ---: | --- |
| title-page-001 | title-page | Opening section |  | 173 | no |
| chapter-001 | chapter | Chapter 1 |  | 2109 | yes |
| chapter-002 | chapter | Chapter 2 |  | 2337 | yes |
| chapter-003 | chapter | Chapter 3 |  | 2421 | yes |
| chapter-004 | chapter | Chapter 4 |  | 5450 | yes |
| chapter-005 | chapter | Chapter 5 |  | 4453 | yes |
| chapter-006 | chapter | Chapter 6 |  | 3470 | yes |
| chapter-007 | chapter | Chapter 7 |  | 3468 | yes |
| chapter-008 | chapter | Chapter 8 |  | 4445 | yes |
| chapter-009 | chapter | Chapter 9 |  | 8223 | yes |
| chapter-010 | chapter | Chapter 10 |  | 4978 | yes |
| chapter-011 | chapter | Chapter 11 |  | 5608 | yes |
| chapter-012 | chapter | Chapter 12 |  | 5703 | yes |
| chapter-013 | chapter | Chapter 13 |  | 5482 | yes |
| chapter-014 | chapter | Chapter 14 |  | 5409 | yes |
| chapter-015 | chapter | Chapter 15 |  | 6008 | yes |
| chapter-016 | chapter | Chapter 16 |  | 6328 | yes |

## Suspicious Sections

- Suspiciously short sections: None
- Suspiciously long sections: None

## Cleanup Simulation

| Action | Count | Recommendation | Samples |
| --- | ---: | --- | --- |
| None | 0 | No simulated cleanup needed. | |

- Footnotes/references: No footnote/reference handling issue detected in the dry run.
- Illustration/image placeholders: No illustration/image placeholder issue detected in the dry run.
- Dash normalization: Normalize em/en dashes to simple spaced hyphens for Morse/audio playback in candidate output only.

## First-Hour Preview Candidate

- Feasible: yes
- Confidence: medium
- Sections used: chapter-001 Chapter 1
- Approximate word count: 2109
- Starts at real readable content: yes
- Snippet: CHAPTER I "There Are Heroisms All Round Us" Mr. Hungerton, her father, really was the most tactless person upon earth,--a fluffy, feathery, untidy cockatoo of a man, perfectly good-natured, but absolutely centered upon his own silly self. If anything could have driven me from Gladys, it would have been the thought of such a father-in-law. I am convinced tha...

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
