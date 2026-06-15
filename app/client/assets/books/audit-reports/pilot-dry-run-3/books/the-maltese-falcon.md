# Pilot Dry Run: the-maltese-falcon

- Source file: `The Maltese falcon.txt`
- Why selected: High-confidence standalone Arabic-numbered sections with clear body divisions and no blocked-source signal.
- Pass-2 risk level: medium
- Existing generated output: no
- Candidate title: The Maltese falcon
- Candidate author: Dashiell Hammett
- Final dry-run recommendation: process later with warnings

## Boundary Decision

- Dry-run adjustment: none.

- Raw word count: 72883
- Kept word count estimate: 69724
- Removed front matter word count estimate: 155
- Removed end matter word count estimate: 3004
- Candidate start: line 33, index 942
- Start snippet: * * * * * [Cover Illustration]

### 10-20 Lines Before Start

- L13: Author: Dashiell Hammett
- L14: [blank]
- L15: [blank]
- L16: [blank]
- L17: Release date: January 1, 2026 [eBook #77600]
- L18: [blank]
- L19: Language: English
- L20: [blank]
- L21: Original publication: New York: Alfred A. Knopf, 1930
- L22: [blank]
- L23: Other information and formats: www.gutenberg.org/ebooks/77600
- L24: [blank]
- L25: Credits: This ebook was produced by: Al Haines, Cindy Beyer & the online Distributed Proofreaders Canada team at http://www.pgdpcanada.net
- L26: [blank]
- L27: [blank]
- L28: *** START OF THE PROJECT GUTENBERG EBOOK THE MALTESE FALCON ***
- L29: [blank]
- L30: [blank]
- L31: [blank]
- L32: [blank]

- Candidate end: line 8842, index 374000
- End snippet: Misspelled words and printer errors have been corrected. Where multiple spellings occur, majority use has been employed. Punctuation has been maintained except where obvious printer errors occur.

### 10-20 Lines After End

- L8843: [blank]
- L8844: [blank]
- L8845: [blank]
- L8846: [blank]
- L8847: [blank]
- L8848: *** END OF THE PROJECT GUTENBERG EBOOK THE MALTESE FALCON ***
- L8849: [blank]
- L8850: [blank]
- L8851: [blank]
- L8852: [blank]
- L8853: Updated editions will replace the previous one—the old editions will
- L8854: be renamed.
- L8855: [blank]
- L8856: Creating the works from print editions not protected by U.S. copyright
- L8857: law means that no one owns a United States copyright in these works,
- L8858: so the Foundation (and you!) can copy and distribute it in the United
- L8859: States without permission and without paying copyright
- L8860: royalties. Special rules, set forth in the General Terms of Use part
- L8861: of this license, apply to copying and distributing Project
- L8862: Gutenberg™ electronic works to protect the PROJECT GUTENBERG™

## Structure Detection

- Detected structural convention: standalone arabic-numbered sections
- Selected heading strategy: arabic-only
- TOC entries detected: no
- Body headings detected: yes
- Section count from selected strategy: 20
- Fallback used: no
- Fallback legitimacy: not required
- Fallback reason: not required
- Structure detection status: pass

### Candidate Heading Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| arabic-only | 20 | 20 | 0 | yes |  |
| all-caps-title | 29 | 26 | 3 | no | weaker than selected strategy arabic-only |
| isolated-title-case | 128 | 127 | 0 | no | weaker than selected strategy arabic-only |
| roman-numbered-title | 1 | 1 | 0 | no | weaker than selected strategy arabic-only |
| special-front-back | 1 | 1 | 0 | no | weaker than selected strategy arabic-only |

### Rejected Heading Strategies

| Pattern | Candidates | Body-like | TOC-like | Reason |
| --- | ---: | ---: | ---: | --- |
| all-caps-title | 29 | 26 | 3 | weaker than selected strategy arabic-only |
| isolated-title-case | 128 | 127 | 0 | weaker than selected strategy arabic-only |
| roman-numbered-title | 1 | 1 | 0 | weaker than selected strategy arabic-only |
| special-front-back | 1 | 1 | 0 | weaker than selected strategy arabic-only |

### Structure Warnings

- None.

## Proposed Sections

- Total proposed sections: 21

| ID | Kind | Label | Title | Words | Default |
| --- | --- | --- | --- | ---: | --- |
| title-page-001 | title-page | Opening section |  | 63 | no |
| chapter-001 | chapter | Section 1 |  | 2474 | yes |
| chapter-002 | chapter | Section 2 |  | 3998 | yes |
| chapter-003 | chapter | Section 3 |  | 2360 | yes |
| chapter-004 | chapter | Section 4 |  | 4175 | yes |
| chapter-005 | chapter | Section 5 |  | 2092 | yes |
| chapter-006 | chapter | Section 6 |  | 2793 | yes |
| chapter-007 | chapter | Section 7 |  | 3926 | yes |
| chapter-008 | chapter | Section 8 |  | 2712 | yes |
| chapter-009 | chapter | Section 9 |  | 2413 | yes |
| chapter-010 | chapter | Section 10 |  | 3414 | yes |
| chapter-011 | chapter | Section 11 |  | 3571 | yes |
| chapter-012 | chapter | Section 12 |  | 2976 | yes |
| chapter-013 | chapter | Section 13 |  | 3086 | yes |
| chapter-014 | chapter | Section 14 |  | 2793 | yes |
| chapter-015 | chapter | Section 15 |  | 3361 | yes |
| chapter-016 | chapter | Section 16 |  | 3473 | yes |
| chapter-017 | chapter | Section 17 |  | 3481 | yes |
| chapter-018 | chapter | Section 18 |  | 5451 | yes |
| chapter-019 | chapter | Section 19 |  | 6550 | yes |
| chapter-020 | chapter | Section 20 |  | 4562 | yes |

## Suspicious Sections

- Suspiciously short sections: title-page-001 (63)
- Suspiciously long sections: None

## Cleanup Simulation

| Action | Count | Recommendation | Samples |
| --- | ---: | --- | --- |
| remove-page-and-decorative-lines | 38 | Remove standalone page markers and decorative separators; do not remove prose punctuation. | candidate L1: * * * * *<br>candidate L185: * * * * *<br>candidate L321: * * * * *<br>candidate L391: * * * * *<br>candidate L548: * * * * *<br>candidate L561: * * * * *<br>candidate L996: * * * * *<br>candidate L1121: * * * * * |
| normalize-smart-quotes | 7663 | Normalize smart quotes to ASCII quotes only in candidate playback text. | ’<br>“<br>”<br>“<br>’ |
| normalize-em-en-dashes | 562 | Normalize em/en dashes to spaced hyphen for Morse/audio playback, preserving sentence flow. | —<br>—<br>—<br>—<br>—<br>—<br>—<br>— |

- Footnotes/references: No footnote/reference handling issue detected in the dry run.
- Illustration/image placeholders: No illustration/image placeholder issue detected in the dry run.
- Dash normalization: Normalize em/en dashes to simple spaced hyphens for Morse/audio playback in candidate output only.

## First-Hour Preview Candidate

- Feasible: yes
- Confidence: medium
- Sections used: chapter-001 Section 1
- Approximate word count: 2474
- Starts at real readable content: yes
- Snippet: 1 SPADE & ARCHER SAMUEL SPADE’S jaw was long and bony, his chin a jutting v under the more flexible v of his mouth. His nostrils curved back to make another, smaller, v. His yellow-grey eyes were horizontal. The v _motif_ was picked up again by thickish brows rising outward from twin creases above a hooked nose, and his pale brown hair grew down—from high f...

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
- Decorative/page markers are cleanup candidates but not boundary blockers.
