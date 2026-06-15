# Pilot Dry Run: moby-dick

- Source file: `Moby Dick.txt`
- Why selected: Medium-confidence chapter-Arabic structure with major divisions, selected for dry-run-only review of a large but structured book.
- Pass-2 risk level: medium
- Existing generated output: no
- Candidate title: Moby Dick; Or, The Whale
- Candidate author: Herman Melville
- Final dry-run recommendation: process later with warnings

## Boundary Decision

- Dry-run adjustment: none.

- Raw word count: 220105
- Kept word count estimate: 212512
- Removed front matter word count estimate: 4587
- Removed end matter word count estimate: 3006
- Candidate start: line 844, index 28020
- Start snippet: CHAPTER 1. Loomings. Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world. It is a way I have of driving off the spleen and

### 10-20 Lines Before Start

- L824: stone’s throw of the shore” (Terra Del Fuego), “over which the beech
- L825: tree extended its branches.” —_Darwin’s Voyage of a Naturalist_.
- L826: [blank]
- L827: “‘Stern all!’ exclaimed the mate, as upon turning his head, he saw
- L828: the distended jaws of a large Sperm Whale close to the head of the
- L829: boat, threatening it with instant destruction;—‘Stern all, for your
- L830: lives!’” —_Wharton the Whale Killer_.
- L831: [blank]
- L832: “So be cheery, my lads, let your hearts never fail, While the bold
- L833: harpooneer is striking the whale!” —_Nantucket Song_.
- L834: [blank]
- L835: [blank]
- L836: “Oh, the rare old Whale, mid storm and gale In his ocean home will be
- L837: A giant in might, where might is right, And King of the boundless
- L838: sea.” —_Whale Song_.
- L839: [blank]
- L840: [blank]
- L841: [blank]
- L842: [blank]
- L843: [blank]

- Candidate end: line 21959, index 1219806
- End snippet: one whole day and night, I floated on a soft and dirgelike main. The unharming sharks, they glided by as if with padlocks on their mouths; the savage sea-hawks sailed with sheathed beaks. On the second day, a sail drew near, nearer, and picked me up at last. It was the devious-cruising Rachel, that in her retracing search after her missing children, only found another orphan.

### 10-20 Lines After End

- L21960: [blank]
- L21961: [blank]
- L21962: [blank]
- L21963: [blank]
- L21964: *** END OF THE PROJECT GUTENBERG EBOOK MOBY DICK; OR, THE WHALE ***
- L21965: [blank]
- L21966: [blank]
- L21967: [blank]
- L21968: [blank]
- L21969: Updated editions will replace the previous one—the old editions will
- L21970: be renamed.
- L21971: [blank]
- L21972: Creating the works from print editions not protected by U.S. copyright
- L21973: law means that no one owns a United States copyright in these works,
- L21974: so the Foundation (and you!) can copy and distribute it in the United
- L21975: States without permission and without paying copyright
- L21976: royalties. Special rules, set forth in the General Terms of Use part
- L21977: of this license, apply to copying and distributing Project
- L21978: Gutenberg™ electronic works to protect the PROJECT GUTENBERG™
- L21979: concept and trademark. Project Gutenberg is a registered trademark,

## Structure Detection

- Detected structural convention: chapter-based arabic numbers with book divisions
- Selected heading strategy: chapter-arabic
- TOC entries detected: yes
- Body headings detected: yes
- Section count from selected strategy: 135
- Fallback used: no
- Fallback legitimacy: not required
- Fallback reason: not required
- Structure detection status: pass

### Candidate Heading Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-arabic | 135 | 135 | 0 | yes |  |
| all-caps-title | 5 | 5 | 0 | no | weaker than selected strategy chapter-arabic |
| roman-numbered-title | 6 | 6 | 0 | no | weaker than selected strategy chapter-arabic |
| isolated-title-case | 63 | 63 | 0 | no | weaker than selected strategy chapter-arabic |
| book-division | 14 | 14 | 0 | no | weaker than selected strategy chapter-arabic |
| special-front-back | 1 | 1 | 0 | no | weaker than selected strategy chapter-arabic |

### Rejected Heading Strategies

| Pattern | Candidates | Body-like | TOC-like | Reason |
| --- | ---: | ---: | ---: | --- |
| all-caps-title | 5 | 5 | 0 | weaker than selected strategy chapter-arabic |
| roman-numbered-title | 6 | 6 | 0 | weaker than selected strategy chapter-arabic |
| isolated-title-case | 63 | 63 | 0 | weaker than selected strategy chapter-arabic |
| book-division | 14 | 14 | 0 | weaker than selected strategy chapter-arabic |
| special-front-back | 1 | 1 | 0 | weaker than selected strategy chapter-arabic |

### Structure Warnings

- None.

## Proposed Sections

- Total proposed sections: 135

| ID | Kind | Label | Title | Words | Default |
| --- | --- | --- | --- | ---: | --- |
| chapter-001 | chapter | Chapter 1 | Loomings | 2227 | yes |
| chapter-002 | chapter | Chapter 2 | The Carpet-Bag | 1444 | yes |
| chapter-003 | chapter | Chapter 3 | The Spouter-Inn | 5950 | yes |
| chapter-004 | chapter | Chapter 4 | The Counterpane | 1671 | yes |
| chapter-005 | chapter | Chapter 5 | Breakfast | 749 | yes |
| chapter-006 | chapter | Chapter 6 | The Street | 816 | yes |
| chapter-007 | chapter | Chapter 7 | The Chapel | 951 | yes |
| chapter-008 | chapter | Chapter 8 | The Pulpit | 961 | yes |
| chapter-009 | chapter | Chapter 9 | The Sermon | 3622 | yes |
| chapter-010 | chapter | Chapter 10 | A Bosom Friend | 1567 | yes |
| chapter-011 | chapter | Chapter 11 | Nightgown | 727 | yes |
| chapter-012 | chapter | Chapter 12 | Biographical | 891 | yes |
| chapter-013 | chapter | Chapter 13 | Wheelbarrow | 1714 | yes |
| chapter-014 | chapter | Chapter 14 | Nantucket | 763 | yes |
| chapter-015 | chapter | Chapter 15 | Chowder | 1205 | yes |
| chapter-016 | chapter | Chapter 16 | The Ship | 5547 | yes |
| chapter-017 | chapter | Chapter 17 | The Ramadan | 2325 | yes |
| chapter-018 | chapter | Chapter 18 | His Mark | 1384 | yes |
| chapter-019 | chapter | Chapter 19 | The Prophet | 1256 | yes |
| chapter-020 | chapter | Chapter 20 | All Astir | 930 | yes |
| chapter-021 | chapter | Chapter 21 | Going Aboard | 1096 | yes |
| chapter-022 | chapter | Chapter 22 | Merry Christmas | 1659 | yes |
| chapter-023 | chapter | Chapter 23 | The Lee Shore | 371 | yes |
| chapter-024 | chapter | Chapter 24 | The Advocate | 1667 | yes |
| chapter-025 | chapter | Chapter 25 | Postscript | 286 | yes |
| chapter-026 | chapter | Chapter 26 | Knights and Squires | 1225 | yes |
| chapter-027 | chapter | Chapter 27 | Knights and Squires | 1684 | yes |
| chapter-028 | chapter | Chapter 28 | Ahab | 1408 | yes |
| chapter-029 | chapter | Chapter 29 | Enter Ahab; to Him, Stubb | 1234 | yes |
| chapter-030 | chapter | Chapter 30 | The Pipe | 293 | yes |
| chapter-031 | chapter | Chapter 31 | Queen Mab | 886 | yes |
| chapter-032 | chapter | Chapter 32 | Cetology | 5159 | yes |
| chapter-033 | chapter | Chapter 33 | The Specksnyder | 975 | yes |
| chapter-034 | chapter | Chapter 34 | The Cabin-Table | 2219 | yes |
| chapter-035 | chapter | Chapter 35 | The Mast-Head | 2564 | yes |
| chapter-036 | chapter | Chapter 36 | The Quarter-Deck | 2819 | yes |
| chapter-037 | chapter | Chapter 37 | Sunset | 525 | yes |
| chapter-038 | chapter | Chapter 38 | Dusk | 399 | yes |
| chapter-039 | chapter | Chapter 39 | First Night-Watch | 284 | yes |
| chapter-040 | chapter | Chapter 40 | Midnight, Forecastle | 1608 | yes |
| chapter-041 | chapter | Chapter 41 | Moby Dick | 3791 | yes |
| chapter-042 | chapter | Chapter 42 | The Whiteness of the Whale | 3636 | yes |
| chapter-043 | chapter | Chapter 43 | Hark! | 313 | yes |
| chapter-044 | chapter | Chapter 44 | The Chart | 2042 | yes |
| chapter-045 | chapter | Chapter 45 | The Affidavit | 3566 | yes |
| chapter-046 | chapter | Chapter 46 | Surmises | 1006 | yes |
| chapter-047 | chapter | Chapter 47 | The Mat-Maker | 931 | yes |
| chapter-048 | chapter | Chapter 48 | The First Lowering | 4002 | yes |
| chapter-049 | chapter | Chapter 49 | The Hyena | 845 | yes |
| chapter-050 | chapter | Chapter 50 | Ahab’s Boat and Crew. Fedallah | 1022 | yes |
| chapter-051 | chapter | Chapter 51 | The Spirit-Spout | 1508 | yes |
| chapter-052 | chapter | Chapter 52 | The Albatross | 720 | yes |
| chapter-053 | chapter | Chapter 53 | The Gam | 1632 | yes |
| chapter-054 | chapter | Chapter 54 | The Town-Ho’s Story | 8031 | yes |
| chapter-055 | chapter | Chapter 55 | Of the Monstrous Pictures of Whales | 1907 | yes |
| chapter-056 | chapter | Chapter 56 | Of the Less Erroneous Pictures of Whales, and the True | 1315 | yes |
| chapter-057 | chapter | Chapter 57 | Of Whales in Paint; in Teeth; in Wood; in Sheet-Iron; in | 950 | yes |
| chapter-058 | chapter | Chapter 58 | Brit | 1011 | yes |
| chapter-059 | chapter | Chapter 59 | Squid | 924 | yes |
| chapter-060 | chapter | Chapter 60 | The Line | 1467 | yes |
| chapter-061 | chapter | Chapter 61 | Stubb Kills a Whale | 1981 | yes |
| chapter-062 | chapter | Chapter 62 | The Dart | 571 | yes |
| chapter-063 | chapter | Chapter 63 | The Crotch | 476 | yes |
| chapter-064 | chapter | Chapter 64 | Stubb’s Supper | 3046 | yes |
| chapter-065 | chapter | Chapter 65 | The Whale as a Dish | 997 | yes |
| chapter-066 | chapter | Chapter 66 | The Shark Massacre | 635 | yes |
| chapter-067 | chapter | Chapter 67 | Cutting In | 733 | yes |
| chapter-068 | chapter | Chapter 68 | The Blanket | 1203 | yes |
| chapter-069 | chapter | Chapter 69 | The Funeral | 442 | yes |
| chapter-070 | chapter | Chapter 70 | The Sphynx | 887 | yes |
| chapter-071 | chapter | Chapter 71 | The Jeroboam’s Story | 2288 | yes |
| chapter-072 | chapter | Chapter 72 | The Monkey-Rope | 1654 | yes |
| chapter-073 | chapter | Chapter 73 | Stubb and Flask kill a Right Whale; and Then Have a Talk | 2233 | yes |
| chapter-074 | chapter | Chapter 74 | The Sperm Whale’s Head—Contrasted View | 1656 | yes |
| chapter-075 | chapter | Chapter 75 | The Right Whale’s Head—Contrasted View | 1243 | yes |
| chapter-076 | chapter | Chapter 76 | The Battering-Ram | 874 | yes |
| chapter-077 | chapter | Chapter 77 | The Great Heidelburgh Tun | 647 | yes |
| chapter-078 | chapter | Chapter 78 | Cistern and Buckets | 1657 | yes |
| chapter-079 | chapter | Chapter 79 | The Prairie | 944 | yes |
| chapter-080 | chapter | Chapter 80 | The Nut | 912 | yes |

## Suspicious Sections

- Suspiciously short sections: chapter-122 (55)
- Suspiciously long sections: None

## Cleanup Simulation

| Action | Count | Recommendation | Samples |
| --- | ---: | --- | --- |
| remove-page-and-decorative-lines | 2 | Remove standalone page markers and decorative separators; do not remove prose punctuation. | candidate L5206: * * * * * *<br>candidate L9648: * * * * * * |
| normalize-smart-quotes | 5729 | Normalize smart quotes to ASCII quotes only in candidate playback text. | ’<br>’<br>’<br>’<br>’ |
| normalize-em-en-dashes | 1623 | Normalize em/en dashes to spaced hyphen for Morse/audio playback, preserving sentence flow. | —<br>—<br>—<br>—<br>—<br>—<br>—<br>— |

- Footnotes/references: No footnote/reference handling issue detected in the dry run.
- Illustration/image placeholders: No illustration/image placeholder issue detected in the dry run.
- Dash normalization: Normalize em/en dashes to simple spaced hyphens for Morse/audio playback in candidate output only.

## First-Hour Preview Candidate

- Feasible: yes
- Confidence: medium
- Sections used: chapter-001 Chapter 1
- Approximate word count: 2227
- Starts at real readable content: yes
- Snippet: CHAPTER 1. Loomings. Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim...

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

- Table of contents appears isolated before readable content.
- Non-prose structure signals need section parsing review.
