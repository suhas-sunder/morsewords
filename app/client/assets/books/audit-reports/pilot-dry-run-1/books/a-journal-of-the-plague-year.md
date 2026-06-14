# Pilot Dry Run: a-journal-of-the-plague-year

- Source file: `A Journal of the Plague Year.txt`
- Pass-2 risk level: medium
- Existing generated output: no
- Candidate title: A Journal of the Plague Year
- Candidate author: Daniel Defoe
- Final dry-run recommendation: process later with warnings

## Boundary Decision

- Dry-run adjustment: Moved candidate end from line 9521 to 9508 so the Project Gutenberg end marker at line 9511 becomes end matter.

- Raw word count: 98135
- Kept word count estimate: 68606
- Removed front matter word count estimate: 26522
- Removed end matter word count estimate: 3007
- Candidate start: line 2752, index 160707
- Start snippet: they had no better, ‘Well,’ says he, ‘I must make shift; this is a dreadful time; but it is but for one night.’ So he sat down upon the bedside, and bade the maid, I think it was, fetch him up a pint of warm ale. Accordingly the servant went for the ale, but some hurry in the house, which perhaps employed her other ways, put it out of her head, and she went up no more to him.

### 10-20 Lines Before Start

- L2732: I remember one citizen who, having thus broken out of his house
- L2733: in Aldersgate Street or thereabout, went along the road to
- L2734: Islington; he attempted to have gone in at the Angel Inn, and
- L2735: after that the White Horse, two inns known still by the same
- L2736: signs, but was refused; after which he came to the Pied Bull, an
- L2737: inn also still continuing the same sign. He asked them for
- L2738: lodging for one night only, pretending to be going into
- L2739: Lincolnshire, and assuring them of his being very sound and free
- L2740: from the infection, which also at that time had not reached much
- L2741: that way.
- L2742: 
- L2743: They told him they had no lodging that they could spare but one
- L2744: bed up in the garret, and that they could spare that bed for one
- L2745: night, some drovers being expected the next day with cattle; so,
- L2746: if he would accept of that lodging, he might have it, which he
- L2747: did. So a servant was sent up with a candle with him to show him
- L2748: the room. He was very well dressed, and looked like a person not
- L2749: used to lie in a garret; and when he came to the room he fetched
- L2750: a deep sigh, and said to the servant, ‘I have seldom lain in such
- L2751: a lodging as this. ‘However, the servant assuring him again that

- Candidate end: line 9508, index 571190
- End snippet: H. F. [Illustration] FINIS

### 10-20 Lines After End

- L9509: 
- L9510: 
- L9511: *** END OF THE PROJECT GUTENBERG EBOOK A JOURNAL OF THE PLAGUE YEAR ***
- L9512: 
- L9513: 
- L9514: Updated editions will replace the previous one—the old editions will
- L9515: be renamed.
- L9516: 
- L9517: Creating the works from print editions not protected by U.S. copyright
- L9518: law means that no one owns a United States copyright in these works,
- L9519: so the Foundation (and you!) can copy and distribute it in the United
- L9520: States without permission and without paying copyright
- L9521: royalties. Special rules, set forth in the General Terms of Use part
- L9522: of this license, apply to copying and distributing Project
- L9523: Gutenberg™ electronic works to protect the PROJECT GUTENBERG™
- L9524: concept and trademark. Project Gutenberg is a registered trademark,
- L9525: and may not be used if you charge for an eBook, except by following
- L9526: the terms of the trademark license, including paying royalties for use
- L9527: of the Project Gutenberg trademark. If you do not charge anything for
- L9528: copies of this eBook, complying with the trademark license is very

## Proposed Sections

- Total proposed sections: 15

| ID | Kind | Label | Title | Words | Default |
| --- | --- | --- | --- | ---: | --- |
| part-001 | part | Part 1 |  | 4952 | yes |
| part-002 | part | Part 2 |  | 4991 | yes |
| part-003 | part | Part 3 |  | 5115 | yes |
| part-004 | part | Part 4 |  | 4878 | yes |
| part-005 | part | Part 5 |  | 5217 | yes |
| part-006 | part | Part 6 |  | 5059 | yes |
| part-007 | part | Part 7 |  | 4511 | yes |
| part-008 | part | Part 8 |  | 5034 | yes |
| part-009 | part | Part 9 |  | 4942 | yes |
| part-010 | part | Part 10 |  | 4595 | yes |
| part-011 | part | Part 11 |  | 4869 | yes |
| part-012 | part | Part 12 |  | 4911 | yes |
| part-013 | part | Part 13 |  | 5050 | yes |
| part-014 | part | Part 14 |  | 4481 | yes |
| part-015 | part | Part 15 |  | 1 | yes |

## Suspicious Sections

- Suspiciously short sections: part-015 (1)
- Suspiciously long sections: None

## Cleanup Simulation

| Action | Count | Recommendation | Samples |
| --- | ---: | --- | --- |
| remove-image-placeholders | 1 | Remove bracketed image placeholders from playback text; preserve nearby narrative captions only if meaningful. | [Illustration] |
| remove-numbered-reference-markers | 10 | Remove inline numeric reference markers from playback text; keep footnote prose only after manual review. | [1]<br>[1]<br>[2]<br>[2]<br>[3]<br>[3]<br>[4]<br>[4] |
| remove-page-and-decorative-lines | 10 | Remove standalone page markers and decorative separators; do not remove prose punctuation. | candidate L1024: - ——- ——-<br>candidate L1726: - —- —- ——<br>candidate L1738: - —- — —-<br>candidate L1752: - —— ——<br>candidate L4154: ————<br>candidate L4460: - ——-<br>candidate L4509: - ————<br>candidate L4533: - ———— |
| normalize-smart-quotes | 641 | Normalize smart quotes to ASCII quotes only in candidate playback text. | ‘<br>’<br>‘<br>’<br>‘ |
| normalize-em-en-dashes | 172 | Normalize em/en dashes to spaced hyphen for Morse/audio playback, preserving sentence flow. | —<br>—<br>—<br>—<br>—<br>—<br>—<br>— |

- Footnotes/references: Review footnote/reference markers before processing; remove orphan inline markers from playback, and include note prose only if needed for comprehension.
- Illustration/image placeholders: Remove placeholder markers such as [Illustration] from playback text; preserve meaningful captions only after review.
- Dash normalization: Normalize em/en dashes to simple spaced hyphens for Morse/audio playback in candidate output only.

## First-Hour Preview Candidate

- Feasible: yes
- Confidence: medium
- Sections used: part-001 Part 1
- Approximate word count: 4952
- Starts at real readable content: yes
- Snippet: they had no better, ‘Well,’ says he, ‘I must make shift; this is a dreadful time; but it is but for one night.’ So he sat down upon the bedside, and bade the maid, I think it was, fetch him up a pint of warm ale. Accordingly the servant went for the ale, but some hurry in the house, which perhaps employed her other ways, put it out of her head, and she went...

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

- Illustration/image placeholders should be cleaned or suppressed later.
- Decorative/page markers are cleanup candidates but not boundary blockers.
