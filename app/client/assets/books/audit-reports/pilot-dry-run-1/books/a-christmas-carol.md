# Pilot Dry Run: a-christmas-carol

- Source file: `a-christmas-carol.txt`
- Pass-2 risk level: high
- Existing generated output: yes
- Candidate title: A Christmas Carol in Prose; Being a Ghost Story of Christmas
- Candidate author: Charles Dickens
- Final dry-run recommendation: needs individual review

## Boundary Decision

- Dry-run adjustment: Moved candidate end from line 3875 to 3869 so the Project Gutenberg end marker at line 3872 becomes end matter.

- Raw word count: 31819
- Kept word count estimate: 28607
- Removed front matter word count estimate: 200
- Removed end matter word count estimate: 3012
- Candidate start: line 44, index 1179
- Start snippet: readers out of humour with themselves, with each other, with the season, or with me. May it haunt their houses pleasantly, and no one wish to lay it. Their faithful Friend and Servant, C. D.

### 10-20 Lines Before Start

- L24: 
- L25: Credits: Jose Menendez and David Widger
- L26: 
- L27: 
- L28: *** START OF THE PROJECT GUTENBERG EBOOK A CHRISTMAS CAROL IN PROSE; BEING A GHOST STORY OF CHRISTMAS ***
- L29: 
- L30: 
- L31: A CHRISTMAS CAROL
- L32: 
- L33: IN PROSE
- L34: BEING
- L35: A Ghost Story of Christmas
- L36: 
- L37: by Charles Dickens
- L38: 
- L39: 
- L40: PREFACE
- L41: 
- L42: I HAVE endeavoured in this Ghostly little book,
- L43: to raise the Ghost of an Idea, which shall not put my

- Candidate end: line 3869, index 159396
- End snippet: He had no further intercourse with Spirits, but lived upon the Total Abstinence Principle, ever afterwards; and it was always said of him, that he knew how to keep Christmas well, if any man alive possessed the knowledge. May that be truly said of us, and all of us! And so, as Tiny Tim observed, God bless Us, Every One!

### 10-20 Lines After End

- L3870: 
- L3871: 
- L3872: *** END OF THE PROJECT GUTENBERG EBOOK A CHRISTMAS CAROL IN PROSE; BEING A GHOST STORY OF CHRISTMAS ***
- L3873: 
- L3874: 
- L3875: Updated editions will replace the previous one—the old editions will
- L3876: be renamed.
- L3877: 
- L3878: Creating the works from print editions not protected by U.S. copyright
- L3879: law means that no one owns a United States copyright in these works,
- L3880: so the Foundation (and you!) can copy and distribute it in the United
- L3881: States without permission and without paying copyright
- L3882: royalties. Special rules, set forth in the General Terms of Use part
- L3883: of this license, apply to copying and distributing Project
- L3884: Gutenberg™ electronic works to protect the PROJECT GUTENBERG™
- L3885: concept and trademark. Project Gutenberg is a registered trademark,
- L3886: and may not be used if you charge for an eBook, except by following
- L3887: the terms of the trademark license, including paying royalties for use
- L3888: of the Project Gutenberg trademark. If you do not charge anything for
- L3889: copies of this eBook, complying with the trademark license is very

## Proposed Sections

- Total proposed sections: 7

| ID | Kind | Label | Title | Words | Default |
| --- | --- | --- | --- | ---: | --- |
| part-001 | part | Part 1 |  | 5335 | yes |
| part-002 | part | Part 2 |  | 5340 | yes |
| part-003 | part | Part 3 |  | 5184 | yes |
| part-004 | part | Part 4 |  | 5389 | yes |
| part-005 | part | Part 5 |  | 5513 | yes |
| part-006 | part | Part 6 |  | 1786 | yes |
| part-007 | part | Part 7 |  | 60 | yes |

## Suspicious Sections

- Suspiciously short sections: part-007 (60)
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
- Confidence: low
- Sections used: part-001 Part 1
- Approximate word count: 5335
- Starts at real readable content: yes
- Snippet: readers out of humour with themselves, with each other, with the season, or with me. May it haunt their houses pleasantly, and no one wish to lay it. Their faithful Friend and Servant, C. D. December, 1843. CONTENTS Stave I: Marley's Ghost Stave II: The First of the Three Spirits Stave III: The Second of the Three Spirits Stave IV: The Last of the Spirits S...

## Existing Generated Output Comparison

- Manifest: app/client/assets/books/generated/a-christmas-carol/manifest.json
- Section count: 7
- Default-included section count: 0
- First generated preview: A CHRISTMAS CAROL IN PROSE BEING A Ghost Story of Christmas by Charles Dickens PREFACE I HAVE endeavoured in this Ghostly little book, to raise the Ghost of an...
- Last generated preview: He had no further intercourse with Spirits, but lived upon the Total Abstinence Principle, ever afterwards; and it was always said of him, that he knew how to...
- Apparent generated damage: starts too early; generated intro contains real chapter content; no default included sections; suspiciously short generated sections

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

- Existing generated output needs boundary/default-section correction later.
- Existing generated output warning: starts too early, generated intro contains real chapter content, no default included sections, suspiciously short generated sections.
