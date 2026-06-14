# Pilot Dry Run: a-catastrophe

- Source file: `A CATASTROPHE.txt`
- Pass-2 risk level: high
- Existing generated output: no
- Candidate title: A CATASTROPHE
- Candidate author: H. G. WELLS
- Final dry-run recommendation: needs individual review

## Boundary Decision

- Dry-run adjustment: Moved candidate start from line 3 to 16 to skip source/URL/start-marker noise.

- Raw word count: 3217
- Kept word count estimate: 3189
- Removed front matter word count estimate: 28
- Removed end matter word count estimate: 0
- Candidate start: line 16, index 171
- Start snippet: The little shop was not paying. The realisation came insensibly. Winslow was not the man for definite addition and subtraction and sudden discovery. He became aware of the truth in his mind gradually, as though it had always been there. A lot of facts had converged and led him there. There was that line of cretonnes—four half-pieces—untouched, save for half a yard sold to cover a stool. There were those shirtings at 4¾d.—Bandersnatch, in the Broadway, was selling them at 2¾d.—under cost, in fac...

### 10-20 Lines Before Start

- L1: PROJECT GUTENBERG EBOOK 42989
- L2: 
- L3: https://www.gutenberg.org/files/42989/42989-h/42989-h.htm
- L4: 
- L5: 
- L6: BY
- L7: H. G. WELLS
- L8: 
- L9: METHUEN & CO.
- L10: 36 ESSEX STREET, W.C.
- L11: LONDON
- L12: 1897
- L13: 
- L14: 
- L15: A CATASTROPHE

- Candidate end: line 135, index 18117
- End snippet: [251] Presently he was carrying in the shutters, and in the briskest way, the fire in the kitchen was crackling exhilaratingly, with a little saucepan walloping above it, for Minnie was boiling two eggs,—one for herself this morning, as well as one for him,—and Minnie herself was audible, laying breakfast with the greatest éclat. The blow was a sudden and terrible one—but it behoves us to face such things bravely in this sad, unaccountable world. It was quite midday before either of them mentio...

### 10-20 Lines After End

- None.

## Proposed Sections

- Total proposed sections: 2

| ID | Kind | Label | Title | Words | Default |
| --- | --- | --- | --- | ---: | --- |
| part-001 | part | Part 1 |  | 3101 | yes |
| part-002 | part | Part 2 |  | 88 | yes |

## Suspicious Sections

- Suspiciously short sections: None
- Suspiciously long sections: None

## Cleanup Simulation

| Action | Count | Recommendation | Samples |
| --- | ---: | --- | --- |
| remove-numbered-reference-markers | 12 | Remove inline numeric reference markers from playback text; keep footnote prose only after manual review. | [240]<br>[241]<br>[242]<br>[243]<br>[244]<br>[245]<br>[246]<br>[247] |
| remove-page-and-decorative-lines | 1 | Remove standalone page markers and decorative separators; do not remove prose punctuation. | candidate L115: [251] |
| normalize-smart-quotes | 194 | Normalize smart quotes to ASCII quotes only in candidate playback text. | ’<br>’<br>’<br>“<br>’ |
| normalize-em-en-dashes | 50 | Normalize em/en dashes to spaced hyphen for Morse/audio playback, preserving sentence flow. | —<br>—<br>—<br>—<br>—<br>—<br>—<br>— |

- Footnotes/references: No footnote/reference handling issue detected in the dry run.
- Illustration/image placeholders: No illustration/image placeholder issue detected in the dry run.
- Dash normalization: Normalize em/en dashes to simple spaced hyphens for Morse/audio playback in candidate output only.

## First-Hour Preview Candidate

- Feasible: yes
- Confidence: low
- Sections used: part-001 Part 1
- Approximate word count: 3101
- Starts at real readable content: yes
- Snippet: The little shop was not paying. The realisation came insensibly. Winslow was not the man for definite addition and subtraction and sudden discovery. He became aware of the truth in his mind gradually, as though it had always been there. A lot of facts had converged and led him there. There was that line of cretonnes—four half-pieces—untouched, save for half...

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
- Resolve pass-2 high-risk boundary/content flags before automated processing.

## Recommendation Reasons

- Real opening or ending content may be at risk around the audited boundary.
- Start or end boundary still has low confidence after context inspection.
