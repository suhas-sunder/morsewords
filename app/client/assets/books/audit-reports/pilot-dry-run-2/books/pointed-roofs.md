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

## Proposed Sections

- Total proposed sections: 13

| ID | Kind | Label | Title | Words | Default |
| --- | --- | --- | --- | ---: | --- |
| part-001 | part | Part 1 |  | 5156 | yes |
| part-002 | part | Part 2 |  | 4919 | yes |
| part-003 | part | Part 3 |  | 5146 | yes |
| part-004 | part | Part 4 |  | 5148 | yes |
| part-005 | part | Part 5 |  | 4926 | yes |
| part-006 | part | Part 6 |  | 5104 | yes |
| part-007 | part | Part 7 |  | 4925 | yes |
| part-008 | part | Part 8 |  | 5171 | yes |
| part-009 | part | Part 9 |  | 4982 | yes |
| part-010 | part | Part 10 |  | 5148 | yes |
| part-011 | part | Part 11 |  | 5071 | yes |
| part-012 | part | Part 12 |  | 1723 | yes |
| part-013 | part | Part 13 |  | 9 | yes |

## Suspicious Sections

- Suspiciously short sections: part-013 (9)
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
- Sections used: part-001 Part 1
- Approximate word count: 5156
- Starts at real readable content: yes
- Snippet: INTRODUCTION I have read "Pointed Roofs" three times. The first time it came to me with its original wardrobe, a different dress for every mood; and in some places the handwriting of the manuscript clothed the thought with the ragged urgency of haste; and in others it wore an aspect incredibly delicate and neat, as if the writer had caressed each word befor...

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

- Transcriber/editor notes are present and should stay out of readable defaults.
