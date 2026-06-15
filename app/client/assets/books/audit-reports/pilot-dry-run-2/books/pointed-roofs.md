# Pilot Dry Run: pointed-roofs

- Source file: `Pointed Roofs.txt`
- Why selected: Medium-risk book with high-confidence start/end boundaries and a useful transcriber/printer-note edge case to verify end-matter handling.
- Pass-2 risk level: medium
- Existing generated output: no
- Candidate title: Pointed roofs
- Candidate author: Dorothy M. Richardson
- Final dry-run recommendation: process later with warnings

## Boundary Decision

- Dry-run adjustment: none.

- Raw word count: 60960
- Kept word count estimate: 57428
- Removed front matter word count estimate: 229
- Removed end matter word count estimate: 3303
- Candidate start: line 74, index 1796
- Start snippet: INTRODUCTION I have read "Pointed Roofs" three times. The first time it came to me with its original wardrobe, a different

### 10-20 Lines Before Start

- L54: 
- L55: 
- L56: BY
- L57: DOROTHY M. RICHARDSON
- L58: 
- L59: 
- L60: LONDON: DUCKWORTH & CO.
- L61: 3, HENRIETTA STREET, COVENT GARDEN
- L62: 
- L63: 
- L64: TO
- L65: WINIFRED RAY
- L66: 
- L67: 
- L68: All rights reserved
- L69: Second Impression, 1921
- L70: 
- L71: 
- L72: 
- L73: 

- Candidate end: line 6870, index 336808
- End snippet: _The Mayflower Press, Plymouth, England._ William Brendon & Son, Ltd.

### 10-20 Lines After End

- L6871: Transcriber's Notes
- L6872: 
- L6873: 
- L6874: On page 113, "Marie" was changed into "Clara" in later editions but
- L6875: preserved here.
- L6876: 
- L6877: The original spelling and punctuation were mostly preserved. A few
- L6878: obvious typographical errors were silently corrected. Further careful
- L6879: corrections, some after consulting other editions, are listed here
- L6880: (before/after):
- L6881: 
- L6882: [p. 66]:
- L6883: ... "Wie gefällt's Innen?" with an upturned smile ...
- L6884: ... "Wie gefällt's Ihnen?" with an upturned smile ...
- L6885: 
- L6886: [p. 119]:
- L6887: ... thank, all, God!" ... Emma and Marie was ...
- L6888: ... thank, all, God!" ... Emma and Marie were ...
- L6889: 
- L6890: [p. 162]:

## Structure Detection

- Detected structural convention: standalone arabic-numbered sections
- Selected heading strategy: arabic-only
- TOC entries detected: yes
- Body headings detected: yes
- Section count from selected strategy: 80
- Fallback used: no
- Fallback legitimacy: not required
- Fallback reason: not required
- Structure detection status: warn

### Candidate Heading Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| arabic-only | 104 | 80 | 24 | yes |  |
| chapter-roman | 10 | 10 | 0 | no | weaker than selected strategy arabic-only |
| isolated-title-case | 67 | 66 | 1 | no | weaker than selected strategy arabic-only |
| all-caps-title | 2 | 2 | 0 | no | weaker than selected strategy arabic-only |
| special-front-back | 1 | 1 | 0 | no | weaker than selected strategy arabic-only |

### Rejected Heading Strategies

| Pattern | Candidates | Body-like | TOC-like | Reason |
| --- | ---: | ---: | ---: | --- |
| chapter-roman | 10 | 10 | 0 | weaker than selected strategy arabic-only |
| isolated-title-case | 67 | 66 | 1 | weaker than selected strategy arabic-only |
| all-caps-title | 2 | 2 | 0 | weaker than selected strategy arabic-only |
| special-front-back | 1 | 1 | 0 | weaker than selected strategy arabic-only |

### Structure Warnings

- body headings were found but rejected by the selected strategy

## Proposed Sections

- Total proposed sections: 81

| ID | Kind | Label | Title | Words | Default |
| --- | --- | --- | --- | ---: | --- |
| title-page-001 | title-page | Opening section |  | 13541 | no |
| chapter-001 | chapter | Section 15 |  | 810 | yes |
| chapter-002 | chapter | Section 16 |  | 681 | yes |
| chapter-003 | chapter | Section 17 |  | 375 | yes |
| chapter-004 | chapter | Section 18 |  | 470 | yes |
| chapter-005 | chapter | Section 19 |  | 682 | yes |
| chapter-006 | chapter | Section 20 |  | 1035 | yes |
| chapter-007 | chapter | Section 21 |  | 1443 | yes |
| chapter-008 | chapter | Section 1 |  | 776 | yes |
| chapter-009 | chapter | Section 2 |  | 67 | yes |
| chapter-010 | chapter | Section 3 |  | 488 | yes |
| chapter-011 | chapter | Section 4 |  | 645 | yes |
| chapter-012 | chapter | Section 5 |  | 389 | yes |
| chapter-013 | chapter | Section 1 |  | 516 | yes |
| chapter-014 | chapter | Section 2 |  | 330 | yes |
| chapter-015 | chapter | Section 3 |  | 244 | yes |
| chapter-016 | chapter | Section 4 |  | 516 | yes |
| chapter-017 | chapter | Section 5 |  | 445 | yes |
| chapter-018 | chapter | Section 6 |  | 98 | yes |
| chapter-019 | chapter | Section 7 |  | 504 | yes |
| chapter-020 | chapter | Section 8 |  | 636 | yes |
| chapter-021 | chapter | Section 9 |  | 389 | yes |
| chapter-022 | chapter | Section 10 |  | 90 | yes |
| chapter-023 | chapter | Section 11 |  | 660 | yes |
| chapter-024 | chapter | Section 12 |  | 86 | yes |
| chapter-025 | chapter | Section 13 |  | 585 | yes |
| chapter-026 | chapter | Section 14 |  | 776 | yes |
| chapter-027 | chapter | Section 15 |  | 340 | yes |
| chapter-028 | chapter | Section 16 |  | 88 | yes |
| chapter-029 | chapter | Section 17 |  | 199 | yes |
| chapter-030 | chapter | Section 1 |  | 440 | yes |
| chapter-031 | chapter | Section 2 |  | 748 | yes |
| chapter-032 | chapter | Section 3 |  | 318 | yes |
| chapter-033 | chapter | Section 4 |  | 178 | yes |
| chapter-034 | chapter | Section 5 |  | 585 | yes |
| chapter-035 | chapter | Section 6 |  | 613 | yes |
| chapter-036 | chapter | Section 7 |  | 463 | yes |
| chapter-037 | chapter | Section 8 |  | 541 | yes |
| chapter-038 | chapter | Section 9 |  | 713 | yes |
| chapter-039 | chapter | Section 10 |  | 763 | yes |
| chapter-040 | chapter | Section 11 |  | 576 | yes |
| chapter-041 | chapter | Section 12 |  | 122 | yes |
| chapter-042 | chapter | Section 13 |  | 263 | yes |
| chapter-043 | chapter | Section 14 |  | 343 | yes |
| chapter-044 | chapter | Section 15 |  | 753 | yes |
| chapter-045 | chapter | Section 16 |  | 781 | yes |
| chapter-046 | chapter | Section 17 |  | 197 | yes |
| chapter-047 | chapter | Section 18 |  | 604 | yes |
| chapter-048 | chapter | Section 19 |  | 240 | yes |
| chapter-049 | chapter | Section 20 |  | 737 | yes |
| chapter-050 | chapter | Section 21 |  | 377 | yes |
| chapter-051 | chapter | Section 22 |  | 1256 | yes |
| chapter-052 | chapter | Section 1 |  | 633 | yes |
| chapter-053 | chapter | Section 2 |  | 399 | yes |
| chapter-054 | chapter | Section 3 |  | 558 | yes |
| chapter-055 | chapter | Section 4 |  | 793 | yes |
| chapter-056 | chapter | Section 5 |  | 846 | yes |
| chapter-057 | chapter | Section 6 |  | 245 | yes |
| chapter-058 | chapter | Section 7 |  | 730 | yes |
| chapter-059 | chapter | Section 8 |  | 325 | yes |
| chapter-060 | chapter | Section 9 |  | 277 | yes |
| chapter-061 | chapter | Section 10 |  | 801 | yes |
| chapter-062 | chapter | Section 11 |  | 354 | yes |
| chapter-063 | chapter | Section 12 |  | 694 | yes |
| chapter-064 | chapter | Section 13 |  | 272 | yes |
| chapter-065 | chapter | Section 14 |  | 498 | yes |
| chapter-066 | chapter | Section 1 |  | 814 | yes |
| chapter-067 | chapter | Section 2 |  | 475 | yes |
| chapter-068 | chapter | Section 1 |  | 384 | yes |
| chapter-069 | chapter | Section 2 |  | 55 | yes |
| chapter-070 | chapter | Section 3 |  | 1009 | yes |
| chapter-071 | chapter | Section 4 |  | 876 | yes |
| chapter-072 | chapter | Section 5 |  | 1137 | yes |
| chapter-073 | chapter | Section 6 |  | 578 | yes |
| chapter-074 | chapter | Section 7 |  | 536 | yes |
| chapter-075 | chapter | Section 8 |  | 425 | yes |
| chapter-076 | chapter | Section 9 |  | 412 | yes |
| chapter-077 | chapter | Section 10 |  | 502 | yes |
| chapter-078 | chapter | Section 11 |  | 1242 | yes |
| chapter-079 | chapter | Section 12 |  | 1222 | yes |

## Suspicious Sections

- Suspiciously short sections: chapter-009 (67), chapter-069 (55)
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
- Sections used: chapter-001 Section 15, chapter-002 Section 16
- Approximate word count: 1491
- Starts at real readable content: yes
- Snippet: 15 At the end of twenty minutes, dismissed by Fräulein with a smiling recommendation to go and practise in the saal, Miriam had run upstairs for her music. "It's all right. I'm all right. I shall be able to do it," she said to herself as she ran. The ordeal was past. She was, she had learned, to talk English with the German girls, at table, during walks, wh...

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

- Structure warning: body headings were found but rejected by the selected strategy
- Transcriber/editor notes are present and should stay out of readable defaults.
