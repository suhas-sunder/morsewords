# Pilot Dry Run: the-call-of-the-wild

- Source file: `The call of the wild.txt`
- Why selected: Medium-risk generated-output comparison case with high-confidence boundaries and a feasible first-hour preview source.
- Pass-2 risk level: medium
- Existing generated output: yes
- Candidate title: The call of the wild
- Candidate author: Jack London
- Final dry-run recommendation: process later with warnings

## Boundary Decision

- Dry-run adjustment: none.

- Raw word count: 35327
- Kept word count estimate: 32114
- Removed front matter word count estimate: 207
- Removed end matter word count estimate: 3006
- Candidate start: line 57, index 1189
- Start snippet: Chapter I. Into the Primitive “Old longings nomadic leap, Chafing at custom’s chain; Again from its brumal sleep

### 10-20 Lines Before Start

- L37: The Call of the Wild
- L38: 
- L39: by Jack London
- L40: 
- L41: 
- L42: 
- L43: 
- L44: Contents
- L45: 
- L46: Chapter I. Into the Primitive
- L47: Chapter II. The Law of Club and Fang
- L48: Chapter III. The Dominant Primordial Beast
- L49: Chapter IV. Who Has Won to Mastership
- L50: Chapter V. The Toil of Trace and Trail
- L51: Chapter VI. For the Love of a Man
- L52: Chapter VII. The Sounding of the Call
- L53: 
- L54: 
- L55: 
- L56: 

- Candidate end: line 3097, index 176447
- End snippet: But he is not always alone. When the long winter nights come on and the wolves follow their meat into the lower valleys, he may be seen running at the head of the pack through the pale moonlight or glimmering borealis, leaping gigantic above his fellows, his great throat a-bellow as he sings a song of the younger world, which is the song of the pack.

### 10-20 Lines After End

- L3098: 
- L3099: 
- L3100: 
- L3101: 
- L3102: *** END OF THE PROJECT GUTENBERG EBOOK THE CALL OF THE WILD ***
- L3103: 
- L3104: 
- L3105: 
- L3106: 
- L3107: Updated editions will replace the previous one—the old editions will
- L3108: be renamed.
- L3109: 
- L3110: Creating the works from print editions not protected by U.S. copyright
- L3111: law means that no one owns a United States copyright in these works,
- L3112: so the Foundation (and you!) can copy and distribute it in the United
- L3113: States without permission and without paying copyright
- L3114: royalties. Special rules, set forth in the General Terms of Use part
- L3115: of this license, apply to copying and distributing Project
- L3116: Gutenberg™ electronic works to protect the PROJECT GUTENBERG™
- L3117: concept and trademark. Project Gutenberg is a registered trademark,

## Proposed Sections

- Total proposed sections: 7

| ID | Kind | Label | Title | Words | Default |
| --- | --- | --- | --- | ---: | --- |
| chapter-001 | chapter | Chapter 1 | Into the Primitive | 3791 | yes |
| chapter-002 | chapter | Chapter 2 | The Law of Club and Fang | 3356 | yes |
| chapter-003 | chapter | Chapter 3 | The Dominant Primordial Beast | 5211 | yes |
| chapter-004 | chapter | Chapter 4 | Who Has Won to Mastership | 3260 | yes |
| chapter-005 | chapter | Chapter 5 | The Toil of Trace and Trail | 5418 | yes |
| chapter-006 | chapter | Chapter 6 | For the Love of a Man | 4815 | yes |
| chapter-007 | chapter | Chapter 7 | The Sounding of the Call | 6263 | yes |

## Suspicious Sections

- Suspiciously short sections: None
- Suspiciously long sections: None

## Cleanup Simulation

| Action | Count | Recommendation | Samples |
| --- | ---: | --- | --- |
| normalize-smart-quotes | 569 | Normalize smart quotes to ASCII quotes only in candidate playback text. | “<br>’<br>”<br>’<br>’ |
| normalize-em-en-dashes | 41 | Normalize em/en dashes to spaced hyphen for Morse/audio playback, preserving sentence flow. | —<br>—<br>—<br>—<br>—<br>—<br>—<br>— |

- Footnotes/references: No footnote/reference handling issue detected in the dry run.
- Illustration/image placeholders: No illustration/image placeholder issue detected in the dry run.
- Dash normalization: Normalize em/en dashes to simple spaced hyphens for Morse/audio playback in candidate output only.

## First-Hour Preview Candidate

- Feasible: yes
- Confidence: medium
- Sections used: chapter-001 Chapter 1
- Approximate word count: 3791
- Starts at real readable content: yes
- Snippet: Chapter I. Into the Primitive “Old longings nomadic leap, Chafing at custom’s chain; Again from its brumal sleep Wakens the ferine strain.” Buck did not read the newspapers, or he would have known that trouble was brewing, not alone for himself, but for every tide-water dog, strong of muscle and with warm, long hair, from Puget Sound to San Diego. Because m...

## Existing Generated Output Comparison

- Manifest: app/client/assets/books/generated/the-call-of-the-wild/manifest.json
- Section count: 9
- Default-included section count: 7
- First generated preview: cover The Call of the Wild by Jack London
- Last generated preview: Chapter VII. The Sounding of the Call When Buck earned sixteen hundred dollars in five minutes for John Thornton, he made it possible for his master to pay off...
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
- Existing generated output warning: suspiciously short generated sections.
