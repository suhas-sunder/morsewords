# Pilot Dry Run: the-tempest

- Source file: `The Tempest.txt`
- Why selected: High-confidence play structure, selected as a second controlled act/scene case with clear source formatting.
- Pass-2 risk level: medium
- Existing generated output: no
- Candidate title: The Tempest
- Candidate author: William Shakespeare
- Final dry-run recommendation: process later with warnings

## Boundary Decision

- Dry-run adjustment: none.

- Raw word count: 27160
- Kept word count estimate: 23639
- Removed front matter word count estimate: 518
- Removed end matter word count estimate: 3003
- Candidate start: line 142, index 3424
- Start snippet: ACT I. SCENE I. _On a ship at sea: a tempestuous noise of thunder and lightning heard._

### 10-20 Lines Before Start

- L122: Other Spirits attending on Prospero[3].
- L123: [blank]
- L124: SCENE--_A ship at sea[4]: an uninhabited island._
- L125: [blank]
- L126: [blank]
- L127: Footnotes:
- L128: [blank]
- L129: 1: DRAMATIS PERSONÆ] NAMES OF THE ACTORS F1 at the end of the Play.
- L130: 2: _presented by_] Edd.
- L131: 3: _Other ... Prospero_] Theobald.
- L132: 4: A ship at sea:] At sea: Capell.]
- L133: [blank]
- L134: [blank]
- L135: [blank]
- L136: [blank]
- L137: THE TEMPEST.
- L138: [blank]
- L139: [blank]
- L140: [blank]
- L141: [blank]

- Candidate end: line 4134, index 149337
- End snippet: [Endnotes] I: I. 1. 15. [I. 1. 16] V: 377, 378. [376-377] XVI: IV. 1. 146 [IV. 1. 147]

### 10-20 Lines After End

- L4135: [blank]
- L4136: [blank]
- L4137: [blank]
- L4138: *** END OF THE PROJECT GUTENBERG EBOOK THE TEMPEST ***
- L4139: [blank]
- L4140: [blank]
- L4141: [blank]
- L4142: [blank]
- L4143: Updated editions will replace the previous one—the old editions will
- L4144: be renamed.
- L4145: [blank]
- L4146: Creating the works from print editions not protected by U.S. copyright
- L4147: law means that no one owns a United States copyright in these works,
- L4148: so the Foundation (and you!) can copy and distribute it in the United
- L4149: States without permission and without paying copyright
- L4150: royalties. Special rules, set forth in the General Terms of Use part
- L4151: of this license, apply to copying and distributing Project
- L4152: Gutenberg™ electronic works to protect the PROJECT GUTENBERG™
- L4153: concept and trademark. Project Gutenberg is a registered trademark,
- L4154: and may not be used if you charge for an eBook, except by following

## Structure Detection

- Detected structural convention: play acts
- Selected heading strategy: act-prefixed
- TOC entries detected: no
- Body headings detected: yes
- Section count from selected strategy: 5
- Fallback used: no
- Fallback legitimacy: not required
- Fallback reason: not required
- Structure detection status: pass

### Candidate Heading Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| act-prefixed | 5 | 5 | 0 | yes |  |
| all-caps-title | 29 | 29 | 0 | no | weaker than selected strategy act-prefixed |
| isolated-title-case | 144 | 129 | 15 | no | weaker than selected strategy act-prefixed |
| roman-numbered-title | 22 | 22 | 0 | no | weaker than selected strategy act-prefixed |

### Rejected Heading Strategies

| Pattern | Candidates | Body-like | TOC-like | Reason |
| --- | ---: | ---: | ---: | --- |
| all-caps-title | 29 | 29 | 0 | weaker than selected strategy act-prefixed |
| isolated-title-case | 144 | 129 | 15 | weaker than selected strategy act-prefixed |
| roman-numbered-title | 22 | 22 | 0 | weaker than selected strategy act-prefixed |

### Structure Warnings

- None.

## Proposed Sections

- Total proposed sections: 5

| ID | Kind | Label | Title | Words | Default |
| --- | --- | --- | --- | ---: | --- |
| part-001 | part | Act 1 |  | 6509 | yes |
| part-002 | part | Act 2 |  | 5226 | yes |
| part-003 | part | Act 3 |  | 3913 | yes |
| part-004 | part | Act 4 |  | 2759 | yes |
| part-005 | part | Act 5 |  | 5232 | yes |

## Suspicious Sections

- Suspiciously short sections: None
- Suspiciously long sections: None

## Cleanup Simulation

| Action | Count | Recommendation | Samples |
| --- | ---: | --- | --- |
| remove-page-and-decorative-lines | 3 | Remove standalone page markers and decorative separators; do not remove prose punctuation. | candidate L3912: * * * * *<br>candidate L3913: * * * *<br>candidate L3914: * * * * * |
| normalize-smart-quotes | 870 | Normalize smart quotes to ASCII quotes only in candidate playback text. | ’<br>’<br>’<br>’<br>’ |

- Footnotes/references: Review footnote/reference markers before processing; remove orphan inline markers from playback, and include note prose only if needed for comprehension.
- Illustration/image placeholders: No illustration/image placeholder issue detected in the dry run.
- Dash normalization: Normalize em/en dashes to simple spaced hyphens for Morse/audio playback in candidate output only.

## First-Hour Preview Candidate

- Feasible: yes
- Confidence: medium
- Sections used: part-001 Act 1
- Approximate word count: 6509
- Starts at real readable content: yes
- Snippet: ACT I. SCENE I. _On a ship at sea: a tempestuous noise of thunder and lightning heard._ _Enter _a Ship-Master_ and _a Boatswain_._ _Mast._ Boatswain! _Boats._ Here, master: what cheer? _Mast._ Good, speak to the mariners: fall to’t, yarely, or we run ourselves aground: bestir, bestir. [_Exit._ _Enter _Mariners_._ _Boats._ Heigh, my hearts! cheerly, cheerly,...

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

- Footnote/reference section detected.
- Non-prose structure signals need section parsing review.
