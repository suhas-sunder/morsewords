# Pilot Dry Run: sense-and-sensibility

- Source file: `Sense and Sensibility.txt`
- Why selected: High-confidence chapter-Roman structure with regular boundaries and a useful existing-output comparison.
- Pass-2 risk level: medium
- Existing generated output: yes
- Candidate title: Sense and Sensibility
- Candidate author: Jane Austen
- Final dry-run recommendation: process later with warnings

## Boundary Decision

- Dry-run adjustment: none.

- Raw word count: 123681
- Kept word count estimate: 120436
- Removed front matter word count estimate: 241
- Removed end matter word count estimate: 3004
- Candidate start: line 95, index 1562
- Start snippet: CHAPTER I. The family of Dashwood had long been settled in Sussex. Their estate was large, and their residence was at Norland Park, in the centre of their property, where, for many generations, they had lived in so

### 10-20 Lines Before Start

- L75: CHAPTER XXXV
- L76: CHAPTER XXXVI
- L77: CHAPTER XXXVII
- L78: CHAPTER XXXVIII
- L79: CHAPTER XXXIX
- L80: CHAPTER XL
- L81: CHAPTER XLI
- L82: CHAPTER XLII
- L83: CHAPTER XLIII
- L84: CHAPTER XLIV
- L85: CHAPTER XLV
- L86: CHAPTER XLVI
- L87: CHAPTER XLVII
- L88: CHAPTER XLVIII
- L89: CHAPTER XLIX
- L90: CHAPTER L
- L91: [blank]
- L92: [blank]
- L93: [blank]
- L94: [blank]

- Candidate end: line 12699, index 671474
- End snippet: merits and the happiness of Elinor and Marianne, let it not be ranked as the least considerable, that though sisters, and living almost within sight of each other, they could live without disagreement between themselves, or producing coolness between their husbands. THE END

### 10-20 Lines After End

- L12700: [blank]
- L12701: [blank]
- L12702: [blank]
- L12703: [blank]
- L12704: [blank]
- L12705: [blank]
- L12706: *** END OF THE PROJECT GUTENBERG EBOOK SENSE AND SENSIBILITY ***
- L12707: [blank]
- L12708: [blank]
- L12709: [blank]
- L12710: [blank]
- L12711: Updated editions will replace the previous one—the old editions will
- L12712: be renamed.
- L12713: [blank]
- L12714: Creating the works from print editions not protected by U.S. copyright
- L12715: law means that no one owns a United States copyright in these works,
- L12716: so the Foundation (and you!) can copy and distribute it in the United
- L12717: States without permission and without paying copyright
- L12718: royalties. Special rules, set forth in the General Terms of Use part
- L12719: of this license, apply to copying and distributing Project

## Structure Detection

- Detected structural convention: chapter-based roman numerals
- Selected heading strategy: chapter-roman
- TOC entries detected: yes
- Body headings detected: yes
- Section count from selected strategy: 50
- Fallback used: no
- Fallback legitimacy: not required
- Fallback reason: not required
- Structure detection status: pass

### Candidate Heading Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 50 | 50 | 0 | yes |  |
| all-caps-title | 9 | 9 | 0 | no | weaker than selected strategy chapter-roman |
| isolated-title-case | 28 | 27 | 1 | no | weaker than selected strategy chapter-roman |

### Rejected Heading Strategies

| Pattern | Candidates | Body-like | TOC-like | Reason |
| --- | ---: | ---: | ---: | --- |
| all-caps-title | 9 | 9 | 0 | weaker than selected strategy chapter-roman |
| isolated-title-case | 28 | 27 | 1 | weaker than selected strategy chapter-roman |

### Structure Warnings

- None.

## Proposed Sections

- Total proposed sections: 50

| ID | Kind | Label | Title | Words | Default |
| --- | --- | --- | --- | ---: | --- |
| chapter-001 | chapter | Chapter 1 |  | 1573 | yes |
| chapter-002 | chapter | Chapter 2 |  | 1973 | yes |
| chapter-003 | chapter | Chapter 3 |  | 1546 | yes |
| chapter-004 | chapter | Chapter 4 |  | 1953 | yes |
| chapter-005 | chapter | Chapter 5 |  | 1031 | yes |
| chapter-006 | chapter | Chapter 6 |  | 1349 | yes |
| chapter-007 | chapter | Chapter 7 |  | 1297 | yes |
| chapter-008 | chapter | Chapter 8 |  | 1254 | yes |
| chapter-009 | chapter | Chapter 9 |  | 1868 | yes |
| chapter-010 | chapter | Chapter 10 |  | 2063 | yes |
| chapter-011 | chapter | Chapter 11 |  | 1443 | yes |
| chapter-012 | chapter | Chapter 12 |  | 1685 | yes |
| chapter-013 | chapter | Chapter 13 |  | 2120 | yes |
| chapter-014 | chapter | Chapter 14 |  | 1514 | yes |
| chapter-015 | chapter | Chapter 15 |  | 2534 | yes |
| chapter-016 | chapter | Chapter 16 |  | 1992 | yes |
| chapter-017 | chapter | Chapter 17 |  | 1631 | yes |
| chapter-018 | chapter | Chapter 18 |  | 1525 | yes |
| chapter-019 | chapter | Chapter 19 |  | 2948 | yes |
| chapter-020 | chapter | Chapter 20 |  | 2463 | yes |
| chapter-021 | chapter | Chapter 21 |  | 2976 | yes |
| chapter-022 | chapter | Chapter 22 |  | 2847 | yes |
| chapter-023 | chapter | Chapter 23 |  | 2395 | yes |
| chapter-024 | chapter | Chapter 24 |  | 2126 | yes |
| chapter-025 | chapter | Chapter 25 |  | 1955 | yes |
| chapter-026 | chapter | Chapter 26 |  | 2550 | yes |
| chapter-027 | chapter | Chapter 27 |  | 2505 | yes |
| chapter-028 | chapter | Chapter 28 |  | 1454 | yes |
| chapter-029 | chapter | Chapter 29 |  | 3854 | yes |
| chapter-030 | chapter | Chapter 30 |  | 3106 | yes |
| chapter-031 | chapter | Chapter 31 |  | 3818 | yes |
| chapter-032 | chapter | Chapter 32 |  | 2618 | yes |
| chapter-033 | chapter | Chapter 33 |  | 3061 | yes |
| chapter-034 | chapter | Chapter 34 |  | 2669 | yes |
| chapter-035 | chapter | Chapter 35 |  | 2367 | yes |
| chapter-036 | chapter | Chapter 36 |  | 3112 | yes |
| chapter-037 | chapter | Chapter 37 |  | 4525 | yes |
| chapter-038 | chapter | Chapter 38 |  | 3189 | yes |
| chapter-039 | chapter | Chapter 39 |  | 2010 | yes |
| chapter-040 | chapter | Chapter 40 |  | 2651 | yes |
| chapter-041 | chapter | Chapter 41 |  | 2645 | yes |
| chapter-042 | chapter | Chapter 42 |  | 1818 | yes |
| chapter-043 | chapter | Chapter 43 |  | 3432 | yes |
| chapter-044 | chapter | Chapter 44 |  | 5524 | yes |
| chapter-045 | chapter | Chapter 45 |  | 2139 | yes |
| chapter-046 | chapter | Chapter 46 |  | 2890 | yes |
| chapter-047 | chapter | Chapter 47 |  | 2375 | yes |
| chapter-048 | chapter | Chapter 48 |  | 1309 | yes |
| chapter-049 | chapter | Chapter 49 |  | 4269 | yes |
| chapter-050 | chapter | Chapter 50 |  | 2485 | yes |

## Suspicious Sections

- Suspiciously short sections: None
- Suspiciously long sections: None

## Cleanup Simulation

| Action | Count | Recommendation | Samples |
| --- | ---: | --- | --- |
| normalize-smart-quotes | 3997 | Normalize smart quotes to ASCII quotes only in candidate playback text. | ’<br>’<br>’<br>’<br>’ |
| normalize-em-en-dashes | 865 | Normalize em/en dashes to spaced hyphen for Morse/audio playback, preserving sentence flow. | —<br>—<br>—<br>—<br>—<br>—<br>—<br>— |

- Footnotes/references: No footnote/reference handling issue detected in the dry run.
- Illustration/image placeholders: Remove placeholder markers such as [Illustration] from playback text; preserve meaningful captions only after review.
- Dash normalization: Normalize em/en dashes to simple spaced hyphens for Morse/audio playback in candidate output only.

## First-Hour Preview Candidate

- Feasible: yes
- Confidence: medium
- Sections used: chapter-001 Chapter 1
- Approximate word count: 1573
- Starts at real readable content: yes
- Snippet: CHAPTER I. The family of Dashwood had long been settled in Sussex. Their estate was large, and their residence was at Norland Park, in the centre of their property, where, for many generations, they had lived in so respectable a manner as to engage the general good opinion of their surrounding acquaintance. The late owner of this estate was a single man, wh...

## Existing Generated Output Comparison

- Manifest: app/client/assets/books/generated/sense-and-sensibility/manifest.json
- Section count: 52
- Default-included section count: 50
- First generated preview: [Illustration] Sense and Sensibility by Jane Austen (1811)
- Last generated preview: CHAPTER L. After a proper resistance on the part of Mrs. Ferrars, just so violent and so steady as to preserve her from that reproach which she always seemed f...
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
- Illustration/image placeholders should be cleaned or suppressed later.
- Existing generated output warning: suspiciously short generated sections.
