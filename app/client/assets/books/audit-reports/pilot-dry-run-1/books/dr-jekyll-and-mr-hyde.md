# Pilot Dry Run: dr-jekyll-and-mr-hyde

- Source file: `Dr. Jekyll and Mr. Hyde.txt`
- Pass-2 risk level: high
- Existing generated output: yes
- Candidate title: The strange case of Dr. Jekyll and Mr. Hyde
- Candidate author: Robert Louis Stevenson
- Final dry-run recommendation: needs individual review

## Boundary Decision

- Dry-run adjustment: Moved candidate end from line 2579 to 2568 so the Project Gutenberg end marker at line 2571 becomes end matter.

- Raw word count: 29054
- Kept word count estimate: 25881
- Removed front matter word count estimate: 163
- Removed end matter word count estimate: 3010
- Candidate start: line 29, index 935
- Start snippet: by Robert Louis Stevenson Contents

### 10-20 Lines Before Start

- L9: before using this eBook.
- L10: 
- L11: Title: The strange case of Dr. Jekyll and Mr. Hyde
- L12: 
- L13: Author: Robert Louis Stevenson
- L14: 
- L15: 
- L16: Release date: June 27, 2008 [eBook #43]
- L17: Most recently updated: May 12, 2026
- L18: 
- L19: Language: English
- L20: 
- L21: Other information and formats: www.gutenberg.org/ebooks/43
- L22: 
- L23: Credits: David Widger
- L24: 
- L25: 
- L26: *** START OF THE PROJECT GUTENBERG EBOOK THE STRANGE CASE OF DR. JEKYLL AND MR. HYDE ***
- L27: 
- L28: The Strange Case Of Dr. Jekyll And Mr. Hyde

- Candidate end: line 2568, index 139695
- End snippet: down this room (my last earthly refuge) and give ear to every sound of menace. Will Hyde die upon the scaffold? or will he find courage to release himself at the last moment? God knows; I am careless; this is my true hour of death, and what is to follow concerns another than myself. Here then, as I lay down the pen and proceed to seal up my confession, I bring the life of that unhappy Henry Jekyll to an end.

### 10-20 Lines After End

- L2569: 
- L2570: 
- L2571: *** END OF THE PROJECT GUTENBERG EBOOK THE STRANGE CASE OF DR. JEKYLL AND MR. HYDE ***
- L2572: 
- L2573: 
- L2574: Updated editions will replace the previous one—the old editions will
- L2575: be renamed.
- L2576: 
- L2577: Creating the works from print editions not protected by U.S. copyright
- L2578: law means that no one owns a United States copyright in these works,
- L2579: so the Foundation (and you!) can copy and distribute it in the United
- L2580: States without permission and without paying copyright
- L2581: royalties. Special rules, set forth in the General Terms of Use part
- L2582: of this license, apply to copying and distributing Project
- L2583: Gutenberg™ electronic works to protect the PROJECT GUTENBERG™
- L2584: concept and trademark. Project Gutenberg is a registered trademark,
- L2585: and may not be used if you charge for an eBook, except by following
- L2586: the terms of the trademark license, including paying royalties for use
- L2587: of the Project Gutenberg trademark. If you do not charge anything for
- L2588: copies of this eBook, complying with the trademark license is very

## Proposed Sections

- Total proposed sections: 6

| ID | Kind | Label | Title | Words | Default |
| --- | --- | --- | --- | ---: | --- |
| part-001 | part | Part 1 |  | 5459 | yes |
| part-002 | part | Part 2 |  | 5463 | yes |
| part-003 | part | Part 3 |  | 5563 | yes |
| part-004 | part | Part 4 |  | 5388 | yes |
| part-005 | part | Part 5 |  | 3730 | yes |
| part-006 | part | Part 6 |  | 278 | yes |

## Suspicious Sections

- Suspiciously short sections: None
- Suspiciously long sections: None

## Cleanup Simulation

| Action | Count | Recommendation | Samples |
| --- | ---: | --- | --- |
| normalize-smart-quotes | 1057 | Normalize smart quotes to ASCII quotes only in candidate playback text. | ’<br>’<br>“<br>’<br>” |
| normalize-em-en-dashes | 71 | Normalize em/en dashes to spaced hyphen for Morse/audio playback, preserving sentence flow. | —<br>—<br>—<br>—<br>—<br>—<br>—<br>— |

- Footnotes/references: No footnote/reference handling issue detected in the dry run.
- Illustration/image placeholders: No illustration/image placeholder issue detected in the dry run.
- Dash normalization: Normalize em/en dashes to simple spaced hyphens for Morse/audio playback in candidate output only.

## First-Hour Preview Candidate

- Feasible: yes
- Confidence: low
- Sections used: part-001 Part 1
- Approximate word count: 5459
- Starts at real readable content: yes
- Snippet: by Robert Louis Stevenson Contents STORY OF THE DOOR SEARCH FOR MR. HYDE DR. JEKYLL WAS QUITE AT EASE THE CAREW MURDER CASE INCIDENT OF THE LETTER INCIDENT OF DR. LANYON INCIDENT AT THE WINDOW THE LAST NIGHT DR. LANYON’S NARRATIVE HENRY JEKYLL’S FULL STATEMENT OF THE CASE STORY OF THE DOOR Mr. Utterson the lawyer was a man of a rugged countenance that was n...

## Existing Generated Output Comparison

- Manifest: app/client/assets/books/generated/dr-jekyll-and-mr-hyde/manifest.json
- Section count: 6
- Default-included section count: 0
- First generated preview: The Strange Case Of Dr. Jekyll And Mr. Hyde by Robert Louis Stevenson Contents STORY OF THE DOOR SEARCH FOR MR. HYDE DR. JEKYLL WAS QUITE AT EASE THE CAREW MUR...
- Last generated preview: About a week has passed, and I am now finishing this statement under the influence of the last of the old powders. This, then, is the last time, short of a mir...
- Apparent generated damage: starts too early; generated intro contains real chapter content; no default included sections

## Manual Review Checklist

- Confirm the first kept line is real readable content, not source metadata or a TOC entry.
- Confirm the final kept line is real book content and the Gutenberg/license footer is excluded.
- Confirm default-readable sections exclude TOC, transcriber notes, source/license text, and publisher catalog material.
- Check suspiciously short or long proposed sections before a real write pass.
- Verify cleanup removes playback-hostile artifacts without deleting dialogue, punctuation, paragraph structure, or headings.
- Confirm the first-hour preview candidate starts with real readable content.
- Resolve pass-2 high-risk boundary/content flags before automated processing.
- Compare candidate output against existing generated output because pass 2 flagged generated-output damage.

## Recommendation Reasons

- Real opening or ending content may be at risk around the audited boundary.
- Existing generated output needs boundary/default-section correction later.
- Existing generated output warning: starts too early, generated intro contains real chapter content, no default included sections.
