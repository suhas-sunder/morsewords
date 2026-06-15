# Pilot Dry Run: tales-of-war

- Source file: `Tales of War.txt`
- Why selected: Medium-confidence isolated titled sections, selected to test story-level sectioning where audit data did not show severe ambiguity.
- Pass-2 risk level: medium
- Existing generated output: no
- Candidate title: Tales of War
- Candidate author: Lord Dunsany
- Final dry-run recommendation: process later with warnings

## Boundary Decision

- Dry-run adjustment: none.

- Raw word count: 29133
- Kept word count estimate: 25971
- Removed front matter word count estimate: 158
- Removed end matter word count estimate: 3004
- Candidate start: line 52, index 942
- Start snippet: He said: “There were only twenty houses in Daleswood. A place you would scarcely have heard of. A village up top of the hills. “When the war came there was no more than thirty men there between sixteen and forty-five. They all went.

### 10-20 Lines Before Start

- L32: Produced by William McClain
- L33: [blank]
- L34: [blank]
- L35: [blank]
- L36: [blank]
- L37: [blank]
- L38: [blank]
- L39: TALES OF WAR
- L40: [blank]
- L41: By Lord Dunsany
- L42: [blank]
- L43: [blank]
- L44: 1918
- L45: [blank]
- L46: [blank]
- L47: [blank]
- L48: [blank]
- L49: The Prayer of the Men of Daleswood
- L50: [blank]
- L51: [blank]

- Candidate end: line 2820, index 139333
- End snippet: had never heard them before. He thought of the accursed tyrant’s cruel might, and of the lads that had faced it. He saw the romantic splendour of England’s cause. He was old but had seen the glamour for which each generation looked. Satisfied in his heart and cheered with a new content he went on with his age-old task in the business of man with the hills.

### 10-20 Lines After End

- L2821: [blank]
- L2822: [blank]
- L2823: [blank]
- L2824: [blank]
- L2825: [blank]
- L2826: [blank]
- L2827: [blank]
- L2828: [blank]
- L2829: *** END OF THE PROJECT GUTENBERG EBOOK TALES OF WAR ***
- L2830: [blank]
- L2831: [blank]
- L2832: [blank]
- L2833: [blank]
- L2834: Updated editions will replace the previous one—the old editions will
- L2835: be renamed.
- L2836: [blank]
- L2837: Creating the works from print editions not protected by U.S. copyright
- L2838: law means that no one owns a United States copyright in these works,
- L2839: so the Foundation (and you!) can copy and distribute it in the United
- L2840: States without permission and without paying copyright

## Structure Detection

- Detected structural convention: isolated titled sections
- Selected heading strategy: isolated-title-case
- TOC entries detected: no
- Body headings detected: yes
- Section count from selected strategy: 31
- Fallback used: no
- Fallback legitimacy: not required
- Fallback reason: not required
- Structure detection status: pass

### Candidate Heading Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| isolated-title-case | 31 | 31 | 0 | yes |  |

### Rejected Heading Strategies

| Pattern | Candidates | Body-like | TOC-like | Reason |
| --- | ---: | ---: | ---: | --- |
| None | 0 | 0 | 0 | |

### Structure Warnings

- None.

## Proposed Sections

- Total proposed sections: 32

| ID | Kind | Label | Title | Words | Default |
| --- | --- | --- | --- | ---: | --- |
| title-page-001 | title-page | Opening section |  | 2370 | no |
| chapter-001 | chapter | The Road | The Road | 771 | yes |
| chapter-002 | chapter | An Imperial Monument | An Imperial Monument | 763 | yes |
| chapter-003 | chapter | A Walk To The Trenches | A Walk to the Trenches | 842 | yes |
| chapter-004 | chapter | A Walk In Picardy | A Walk in Picardy | 1751 | yes |
| chapter-005 | chapter | Standing To | Standing To | 446 | yes |
| chapter-006 | chapter | The Splendid Traveller | The Splendid Traveller | 539 | yes |
| chapter-007 | chapter | England | England | 788 | yes |
| chapter-008 | chapter | Shells | Shells | 869 | yes |
| chapter-009 | chapter | Two Degrees Of Envy | Two Degrees of Envy | 593 | yes |
| chapter-010 | chapter | The Master Of No Man’S Land | The Master of No Man’s Land | 435 | yes |
| chapter-011 | chapter | Weeds And Wire | Weeds and Wire | 557 | yes |
| chapter-012 | chapter | “Good Lord!” He Said. “Ville-En-Bois!” | “Good Lord!” he said. “Ville-en-Bois!” | 6 | yes |
| chapter-013 | chapter | Spring In England And Flanders | Spring in England and Flanders | 637 | yes |
| chapter-014 | chapter | The Nightmare Countries | The Nightmare Countries | 52 | yes |
| chapter-015 | chapter | Swinburne: | Swinburne: | 1126 | yes |
| chapter-016 | chapter | Two Songs | Two Songs | 439 | yes |
| chapter-017 | chapter | The Punishment | The Punishment | 1267 | yes |
| chapter-018 | chapter | The English Spirit | The English Spirit | 932 | yes |
| chapter-019 | chapter | An Investigation Into The Causes And Origin Of The War | An Investigation Into the Causes and Origin of the War | 1282 | yes |
| chapter-020 | chapter | Lost | Lost | 669 | yes |
| chapter-021 | chapter | The Last Mirage | The Last Mirage | 730 | yes |
| chapter-022 | chapter | A Famous Man | A Famous Man | 851 | yes |
| chapter-023 | chapter | The Oases Of Death | The Oases of Death | 353 | yes |
| chapter-024 | chapter | Anglo-Saxon Tyranny | Anglo-Saxon Tyranny | 808 | yes |
| chapter-025 | chapter | Memories | Memories | 733 | yes |
| chapter-026 | chapter | The Movement | The Movement | 921 | yes |
| chapter-027 | chapter | Nature’S Cad | Nature’s Cad | 1126 | yes |
| chapter-028 | chapter | The Home Of Herr Schnitzelhaaser | The Home of Herr Schnitzelhaaser | 1173 | yes |
| chapter-029 | chapter | A Deed Of Mercy | A Deed of Mercy | 691 | yes |
| chapter-030 | chapter | Last Scene Of All | Last Scene of All | 700 | yes |
| chapter-031 | chapter | Old England | Old England | 751 | yes |

## Suspicious Sections

- Suspiciously short sections: chapter-012 (6), chapter-014 (52)
- Suspiciously long sections: None

## Cleanup Simulation

| Action | Count | Recommendation | Samples |
| --- | ---: | --- | --- |
| normalize-smart-quotes | 634 | Normalize smart quotes to ASCII quotes only in candidate playback text. | “<br>“<br>“<br>“<br>’ |

- Footnotes/references: No footnote/reference handling issue detected in the dry run.
- Illustration/image placeholders: No illustration/image placeholder issue detected in the dry run.
- Dash normalization: Normalize em/en dashes to simple spaced hyphens for Morse/audio playback in candidate output only.

## First-Hour Preview Candidate

- Feasible: yes
- Confidence: medium
- Sections used: chapter-001 The Road, chapter-002 An Imperial Monument
- Approximate word count: 1534
- Starts at real readable content: yes
- Snippet: The Road The battery Sergeant-Major was practically asleep. He was all worn out by the continuous roar of bombardments that had been shaking the dugouts and dazing his brains for weeks. He was pretty well fed up. The officer commanding the battery, a young man in a very neat uniform and of particularly high birth, came up and spat in his face. The Sergeant-...

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
