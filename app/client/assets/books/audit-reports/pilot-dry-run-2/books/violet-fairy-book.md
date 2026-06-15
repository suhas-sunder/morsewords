# Pilot Dry Run: violet-fairy-book

- Source file: `Violet Fairy Book.txt`
- Why selected: Medium-risk story collection with a real preface and many sections, selected to check collection-style section splitting without severe artifact risk.
- Pass-2 risk level: medium
- Existing generated output: no
- Candidate title: The Violet Fairy Book
- Candidate author: Andrew Lang
- Final dry-run recommendation: process later with warnings

## Boundary Decision

- Dry-run adjustment: none.

- Raw word count: 106431
- Kept word count estimate: 103256
- Removed front matter word count estimate: 170
- Removed end matter word count estimate: 3005
- Candidate start: line 53, index 1041
- Start snippet: PREFACE The Editor takes this opportunity to repeat what he has often said before, that he is not the author of the stories in the Fairy Books; that he did not invent them ‘out of his own head.’ He is accustomed to

### 10-20 Lines Before Start

- L33: 
- L34: 
- L35: 
- L36: 
- L37: 
- L38: THE VIOLET FAIRY BOOK
- L39: 
- L40: By Various
- L41: 
- L42: Edited By Andrew Lang
- L43: 
- L44: 
- L45: 
- L46: TO VIOLET MYERS
- L47: IS DEDICATED
- L48: THE VIOLET FAIRY BOOK
- L49: 
- L50: 
- L51: 
- L52: 

- Candidate end: line 11140, index 534262
- End snippet: as he wished. And they went together to the palace, where Mogarzea was still waiting for him, and the marriage was celebrated by the emperor himself. But every May they returned to the Milk Lake, they and their children, and bathed in its waters. (Olumanische Marchen.)

### 10-20 Lines After End

- L11141: 
- L11142: 
- L11143: 
- L11144: 
- L11145: 
- L11146: 
- L11147: 
- L11148: 
- L11149: *** END OF THE PROJECT GUTENBERG EBOOK THE VIOLET FAIRY BOOK ***
- L11150: 
- L11151: 
- L11152: 
- L11153: 
- L11154: Updated editions will replace the previous one—the old editions will
- L11155: be renamed.
- L11156: 
- L11157: Creating the works from print editions not protected by U.S. copyright
- L11158: law means that no one owns a United States copyright in these works,
- L11159: so the Foundation (and you!) can copy and distribute it in the United
- L11160: States without permission and without paying copyright

## Structure Detection

- Detected structural convention: isolated titled sections
- Selected heading strategy: isolated-title-case
- TOC entries detected: yes
- Body headings detected: yes
- Section count from selected strategy: 41
- Fallback used: no
- Fallback legitimacy: not required
- Fallback reason: not required
- Structure detection status: pass

### Candidate Heading Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| isolated-title-case | 70 | 41 | 29 | yes |  |
| all-caps-title | 35 | 34 | 1 | no | not selected because another strategy better spans the readable body |
| special-front-back | 2 | 1 | 1 | no | weaker than selected strategy isolated-title-case |

### Rejected Heading Strategies

| Pattern | Candidates | Body-like | TOC-like | Reason |
| --- | ---: | ---: | ---: | --- |
| all-caps-title | 35 | 34 | 1 | not selected because another strategy better spans the readable body |
| special-front-back | 2 | 1 | 1 | weaker than selected strategy isolated-title-case |

### Structure Warnings

- None.

## Proposed Sections

- Total proposed sections: 42

| ID | Kind | Label | Title | Words | Default |
| --- | --- | --- | --- | ---: | --- |
| title-page-001 | title-page | Opening section |  | 487 | no |
| chapter-001 | chapter | ‘The Wonderful Beggars,’ ‘The Lute Player,’ ‘Two In A Sack,’ And ‘The | ‘The Wonderful Beggars,’ ‘The Lute Player,’ ‘Two in a Sack,’ and ‘The | 4602 | yes |
| chapter-002 | chapter | (From Ehstnische Marchen.) | (From Ehstnische Marchen.) | 4338 | yes |
| chapter-003 | chapter | (From The Serbian.) | (From the Serbian.) | 10021 | yes |
| chapter-004 | chapter | (From The Russian.) | (From the Russian.) | 6300 | yes |
| chapter-005 | chapter | (Ehstnische Marchen.) | (Ehstnische Marchen.) | 3277 | yes |
| chapter-006 | chapter | (Ehstnische Marchen.) | (Ehstnische Marchen.) | 3690 | yes |
| chapter-007 | chapter | (Adapted From Rumanische Marchen.) | (Adapted from Rumanische Marchen.) | 599 | yes |
| chapter-008 | chapter | (Japanische Marchen.) | (Japanische Marchen.) | 5797 | yes |
| chapter-009 | chapter | (Swahili Tales.) | (Swahili Tales.) | 2273 | yes |
| chapter-010 | chapter | One--Two-- | One--two-- | 12 | yes |
| chapter-011 | chapter | One--Two--’ | One--two--’ | 134 | yes |
| chapter-012 | chapter | One--Two-- | One--two-- | 8 | yes |
| chapter-013 | chapter | One--Two--’ | One--two--’ | 66 | yes |
| chapter-014 | chapter | One--Two--’ | One--two--’ | 318 | yes |
| chapter-015 | chapter | Oh! Oh!’ | Oh! Oh!’ | 79 | yes |
| chapter-016 | chapter | One--Two--’ | One--two--’ | 57 | yes |
| chapter-017 | chapter | (From Russiche Marchen.) | (From Russiche Marchen.) | 1717 | yes |
| chapter-018 | chapter | (Japanische Marchen.) | (Japanische Marchen.) | 7781 | yes |
| chapter-019 | chapter | Dawn--The Fairy Of The Dawn--Herself! | Dawn--the Fairy of the Dawn--herself! | 961 | yes |
| chapter-020 | chapter | (From Rumanische Marchen.) | (From Rumanische Marchen.) | 872 | yes |
| chapter-021 | chapter | (Volksmarchen Der Serben.) | (Volksmarchen der Serben.) | 3677 | yes |
| chapter-022 | chapter | (Scandinavian.) | (Scandinavian.) | 2301 | yes |
| chapter-023 | chapter | (Ehstnische Marchen.) | (Ehstnische Marchen.) | 5282 | yes |
| chapter-024 | chapter | ‘Good Gracious!’ Said Long Nose. ‘So You Can Speak, Mistress Goose. I | ‘Good gracious!’ said Long Nose. ‘So you can speak, Mistress Goose. I | 6099 | yes |
| chapter-025 | chapter | (Adapted From Swahili Tales.) | (Adapted from Swahili Tales.) | 1861 | yes |
| chapter-026 | chapter | (Adapted From Swahili Tales,) | (Adapted from Swahili Tales,) | 1464 | yes |
| chapter-027 | chapter | (Japanische Marchen.) | (Japanische Marchen.) | 1303 | yes |
| chapter-028 | chapter | (Japanische Marchen.) | (Japanische Marchen.) | 2845 | yes |
| chapter-029 | chapter | (Ehstnische Marchen.) | (Ehstnische Marchen.) | 1311 | yes |
| chapter-030 | chapter | (Ehstnische Marchen.) | (Ehstnische Marchen.) | 2818 | yes |
| chapter-031 | chapter | (Rumanische Marchen.) | (Rumanische Marchen.) | 1378 | yes |
| chapter-032 | chapter | (From The Italian.) | (From the Italian.) | 1031 | yes |
| chapter-033 | chapter | (From The German.) | (From the German.) | 4068 | yes |
| chapter-034 | chapter | ‘Golden Hair | ‘Golden Hair | 3333 | yes |
| chapter-035 | chapter | (From Sept Contes Roumains, Jules Brun And Leo Bachelin.) | (From Sept Contes Roumains, Jules Brun and Leo Bachelin.) | 3650 | yes |
| chapter-036 | chapter | (Marchen Und Gedichte Aus Der Stadt Tripolis. Hans Von Stumme.) | (Marchen und Gedichte aus der Stadt Tripolis. Hans von Stumme.) | 2358 | yes |
| chapter-037 | chapter | (From The Portuguese.) | (From the Portuguese.) | 216 | yes |
| chapter-038 | chapter | Virgilius!’ | Virgilius!’ | 1524 | yes |
| chapter-039 | chapter | ‘Preservation Of Rome.’ | ‘Preservation of Rome.’ | 1462 | yes |
| chapter-040 | chapter | (Adapted From ‘Virgilius The Sorcerer.’) | (Adapted from ‘Virgilius the Sorcerer.’) | 1884 | yes |
| chapter-041 | chapter | (Olumanische Marchen.) | (Olumanische Marchen.) | 2 | yes |

## Suspicious Sections

- Suspiciously short sections: chapter-010 (12), chapter-012 (8), chapter-013 (66), chapter-015 (79), chapter-016 (57), chapter-041 (2)
- Suspiciously long sections: None

## Cleanup Simulation

| Action | Count | Recommendation | Samples |
| --- | ---: | --- | --- |
| normalize-smart-quotes | 4281 | Normalize smart quotes to ASCII quotes only in candidate playback text. | ‘<br>’<br>‘<br>’<br>‘ |

- Footnotes/references: No footnote/reference handling issue detected in the dry run.
- Illustration/image placeholders: No illustration/image placeholder issue detected in the dry run.
- Dash normalization: Normalize em/en dashes to simple spaced hyphens for Morse/audio playback in candidate output only.

## First-Hour Preview Candidate

- Feasible: yes
- Confidence: medium
- Sections used: chapter-001 ‘The Wonderful Beggars,’ ‘The Lute Player,’ ‘Two In A Sack,’ And ‘The
- Approximate word count: 4602
- Starts at real readable content: yes
- Snippet: ‘The Wonderful Beggars,’ ‘The Lute Player,’ ‘Two in a Sack,’ and ‘The Fish that swam in the Air.’ Mr. W. A. Craigie translated from the Scandinavian, ‘Jasper who herded the Hares.’ Mrs. Lang did the rest. Some of the most interesting are from the Roumanion, and three were previously published in the late Dr. Steere’s ‘Swahili Tales.’ By the permission of hi...

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
