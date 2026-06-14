# Pilot Dry Run: the-wonderful-wizard-of-oz

- Source file: `the-wonderful-wizard-of-oz.txt`
- Why selected: Medium-risk generated-output comparison case with image placeholder cleanup and high-confidence readable boundaries.
- Pass-2 risk level: medium
- Existing generated output: yes
- Candidate title: The Wonderful Wizard of Oz
- Candidate author: L. Frank Baum
- Final dry-run recommendation: process later with warnings

## Boundary Decision

- Dry-run adjustment: none.

- Raw word count: 43060
- Kept word count estimate: 39535
- Removed front matter word count estimate: 519
- Removed end matter word count estimate: 3006
- Candidate start: line 106, index 3144
- Start snippet: Chapter I The Cyclone Dorothy lived in the midst of the great Kansas prairies, with Uncle Henry, who was a farmer, and Aunt Em, who was the farmer’s wife. Their

### 10-20 Lines Before Start

- L86: and blood-curdling incidents devised by their authors to point a
- L87: fearsome moral to each tale. Modern education includes morality;
- L88: therefore the modern child seeks only entertainment in its wonder tales
- L89: and gladly dispenses with all disagreeable incident.
- L90: 
- L91: Having this thought in mind, the story of “The Wonderful Wizard of Oz”
- L92: was written solely to please children of today. It aspires to being a
- L93: modernized fairy tale, in which the wonderment and joy are retained and
- L94: the heartaches and nightmares are left out.
- L95: 
- L96: L. Frank Baum
- L97: Chicago, April, 1900.
- L98: 
- L99: 
- L100: 
- L101: The Wonderful Wizard of Oz
- L102: 
- L103: 
- L104: 
- L105: 

- Candidate end: line 4778, index 208634
- End snippet: “My darling child!” she cried, folding the little girl in her arms and covering her face with kisses. “Where in the world did you come from?” “From the Land of Oz,” said Dorothy gravely. “And here is Toto, too. And oh, Aunt Em! I’m so glad to be at home again!”

### 10-20 Lines After End

- L4779: 
- L4780: 
- L4781: 
- L4782: 
- L4783: *** END OF THE PROJECT GUTENBERG EBOOK THE WONDERFUL WIZARD OF OZ ***
- L4784: 
- L4785: 
- L4786: 
- L4787: 
- L4788: Updated editions will replace the previous one—the old editions will
- L4789: be renamed.
- L4790: 
- L4791: Creating the works from print editions not protected by U.S. copyright
- L4792: law means that no one owns a United States copyright in these works,
- L4793: so the Foundation (and you!) can copy and distribute it in the United
- L4794: States without permission and without paying copyright
- L4795: royalties. Special rules, set forth in the General Terms of Use part
- L4796: of this license, apply to copying and distributing Project
- L4797: Gutenberg™ electronic works to protect the PROJECT GUTENBERG™
- L4798: concept and trademark. Project Gutenberg is a registered trademark,

## Proposed Sections

- Total proposed sections: 24

| ID | Kind | Label | Title | Words | Default |
| --- | --- | --- | --- | ---: | --- |
| chapter-001 | chapter | Chapter 1 |  | 1152 | yes |
| chapter-002 | chapter | Chapter 2 |  | 2012 | yes |
| chapter-003 | chapter | Chapter 3 |  | 1978 | yes |
| chapter-004 | chapter | Chapter 4 |  | 1447 | yes |
| chapter-005 | chapter | Chapter 5 |  | 2066 | yes |
| chapter-006 | chapter | Chapter 6 |  | 1533 | yes |
| chapter-007 | chapter | Chapter 7 |  | 1819 | yes |
| chapter-008 | chapter | Chapter 8 |  | 1946 | yes |
| chapter-009 | chapter | Chapter 9 |  | 1394 | yes |
| chapter-010 | chapter | Chapter 10 |  | 1962 | yes |
| chapter-011 | chapter | Chapter 11 |  | 3621 | yes |
| chapter-012 | chapter | Chapter 12 |  | 3688 | yes |
| chapter-013 | chapter | Chapter 13 |  | 1201 | yes |
| chapter-014 | chapter | Chapter 14 |  | 1897 | yes |
| chapter-015 | chapter | Chapter 15 |  | 2798 | yes |
| chapter-016 | chapter | Chapter 16 |  | 944 | yes |
| chapter-017 | chapter | Chapter 17 |  | 1167 | yes |
| chapter-018 | chapter | Chapter 18 |  | 1175 | yes |
| chapter-019 | chapter | Chapter 19 |  | 1021 | yes |
| chapter-020 | chapter | Chapter 20 |  | 1524 | yes |
| chapter-021 | chapter | Chapter 21 |  | 903 | yes |
| chapter-022 | chapter | Chapter 22 |  | 946 | yes |
| chapter-023 | chapter | Chapter 23 |  | 1262 | yes |
| chapter-024 | chapter | Chapter 24 |  | 79 | yes |

## Suspicious Sections

- Suspiciously short sections: chapter-024 (79)
- Suspiciously long sections: None

## Cleanup Simulation

| Action | Count | Recommendation | Samples |
| --- | ---: | --- | --- |
| normalize-smart-quotes | 2404 | Normalize smart quotes to ASCII quotes only in candidate playback text. | ’<br>’<br>’<br>“<br>’ |
| normalize-em-en-dashes | 31 | Normalize em/en dashes to spaced hyphen for Morse/audio playback, preserving sentence flow. | —<br>—<br>—<br>—<br>—<br>—<br>—<br>— |

- Footnotes/references: No footnote/reference handling issue detected in the dry run.
- Illustration/image placeholders: Remove placeholder markers such as [Illustration] from playback text; preserve meaningful captions only after review.
- Dash normalization: Normalize em/en dashes to simple spaced hyphens for Morse/audio playback in candidate output only.

## First-Hour Preview Candidate

- Feasible: yes
- Confidence: medium
- Sections used: chapter-001 Chapter 1
- Approximate word count: 1152
- Starts at real readable content: yes
- Snippet: Chapter I The Cyclone Dorothy lived in the midst of the great Kansas prairies, with Uncle Henry, who was a farmer, and Aunt Em, who was the farmer’s wife. Their house was small, for the lumber to build it had to be carried by wagon many miles. There were four walls, a floor and a roof, which made one room; and this room contained a rusty looking cookstove,...

## Existing Generated Output Comparison

- Manifest: app/client/assets/books/generated/the-wonderful-wizard-of-oz/manifest.json
- Section count: 28
- Default-included section count: 24
- First generated preview: [Illustration] The Wonderful Wizard of Oz by L. Frank Baum This book is dedicated to my good friend & comrade My Wife L.F.B.
- Last generated preview: Chapter XXIV Home Again Aunt Em had just come out of the house to water the cabbages when she looked up and saw Dorothy running toward her. “My darling child!”...
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
