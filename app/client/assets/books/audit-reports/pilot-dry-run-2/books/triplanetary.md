# Pilot Dry Run: triplanetary

- Source file: `Triplanetary.txt`
- Why selected: Medium-risk science-fiction novel with high-confidence boundaries and illustration placeholder cleanup.
- Pass-2 risk level: medium
- Existing generated output: no
- Candidate title: Triplanetary
- Candidate author: E. E. Smith
- Final dry-run recommendation: process later with warnings

## Boundary Decision

- Dry-run adjustment: none.

- Raw word count: 60768
- Kept word count estimate: 57430
- Removed front matter word count estimate: 336
- Removed end matter word count estimate: 3002
- Candidate start: line 79, index 2144
- Start snippet: CHAPTER I Pirates of Space Apparently motionless to her passengers and crew, the Interplanetary

### 10-20 Lines Before Start

- L59: _Triplanetary_
- L60: 
- L61: By EDWARD E. SMITH, Ph.D.
- L62: 
- L63: 
- L64: We are sure that our readers will be highly pleased to have
- L65: us give the first installment of a story by Dr. Smith. It
- L66: will continue for several numbers and is a worthy follower
- L67: of the "Skylark" stories which were so much appreciated by
- L68: our readers. We think that they will find this story
- L69: superior to the earlier ones. Dr. Smith certainly has the
- L70: narrative power, and that, joined with his scientific
- L71: position, makes him an ideal author for our columns.
- L72: 
- L73: 
- L74: Illustrated by MOREY
- L75: 
- L76: 
- L77: 
- L78: 

- Candidate end: line 6286, index 339574
- End snippet: "You can talk all you want to, Conway, but I don't like them a bit. They give me the purple jitters! I suppose that they are really estimable folks; talented, cultured, and everything; but just the same I'll bet that it will be a long, long time before anybody on earth will really, truly _like_ them!"

### 10-20 Lines After End

- L6287: 
- L6288: 
- L6289: 
- L6290: 
- L6291: 
- L6292: 
- L6293: 
- L6294: *** END OF THE PROJECT GUTENBERG EBOOK TRIPLANETARY ***
- L6295: 
- L6296: 
- L6297: 
- L6298: 
- L6299: Updated editions will replace the previous one—the old editions will
- L6300: be renamed.
- L6301: 
- L6302: Creating the works from print editions not protected by U.S. copyright
- L6303: law means that no one owns a United States copyright in these works,
- L6304: so the Foundation (and you!) can copy and distribute it in the United
- L6305: States without permission and without paying copyright
- L6306: royalties. Special rules, set forth in the General Terms of Use part

## Structure Detection

- Detected structural convention: chapter-based roman numerals
- Selected heading strategy: chapter-roman
- TOC entries detected: no
- Body headings detected: yes
- Section count from selected strategy: 13
- Fallback used: no
- Fallback legitimacy: not required
- Fallback reason: not required
- Structure detection status: pass

### Candidate Heading Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| chapter-roman | 13 | 13 | 0 | yes |  |
| isolated-title-case | 37 | 36 | 1 | no | weaker than selected strategy chapter-roman |
| arabic-numbered-title | 1 | 1 | 0 | no | weaker than selected strategy chapter-roman |

### Rejected Heading Strategies

| Pattern | Candidates | Body-like | TOC-like | Reason |
| --- | ---: | ---: | ---: | --- |
| isolated-title-case | 37 | 36 | 1 | weaker than selected strategy chapter-roman |
| arabic-numbered-title | 1 | 1 | 0 | weaker than selected strategy chapter-roman |

### Structure Warnings

- None.

## Proposed Sections

- Total proposed sections: 13

| ID | Kind | Label | Title | Words | Default |
| --- | --- | --- | --- | ---: | --- |
| chapter-001 | chapter | Chapter 1 |  | 6234 | yes |
| chapter-002 | chapter | Chapter 2 |  | 5742 | yes |
| chapter-003 | chapter | Chapter 3 |  | 3680 | yes |
| chapter-004 | chapter | Chapter 4 |  | 5884 | yes |
| chapter-005 | chapter | Chapter 5 |  | 6169 | yes |
| chapter-006 | chapter | Chapter 6 |  | 2309 | yes |
| chapter-007 | chapter | Chapter 7 |  | 4102 | yes |
| chapter-008 | chapter | Chapter 8 |  | 1970 | yes |
| chapter-009 | chapter | Chapter 9 |  | 1420 | yes |
| chapter-010 | chapter | Chapter 10 |  | 4764 | yes |
| chapter-011 | chapter | Chapter 11 |  | 4803 | yes |
| chapter-012 | chapter | Chapter 12 |  | 6097 | yes |
| chapter-013 | chapter | Chapter 13 |  | 4256 | yes |

## Suspicious Sections

- Suspiciously short sections: None
- Suspiciously long sections: None

## Cleanup Simulation

| Action | Count | Recommendation | Samples |
| --- | ---: | --- | --- |
| remove-image-placeholders | 4 | Remove bracketed image placeholders from playback text; preserve nearby narrative captions only if meaningful. | [Illustration: Now, systematically and precisely, the great Cone of Battle was coming into being; a formation developed during the Jovian W...<br>[Illustration: Many bridges and more tubes extended through the air from building to building, and the watery "streets" teemed with surface...<br>[Illustration: Its atmosphere was withdrawn, the outer door opened, and he glanced across a bare hundred feet of space at the rocket-plane...<br>[Illustration: And through that terrific conduit came speeding package after package of destruction.] |
| remove-page-and-decorative-lines | 4 | Remove standalone page markers and decorative separators; do not remove prose punctuation. | candidate L73: * * * * *<br>candidate L92: * * * * *<br>candidate L3801: * * * * *<br>candidate L6147: * * * * * |

- Footnotes/references: No footnote/reference handling issue detected in the dry run.
- Illustration/image placeholders: Remove placeholder markers such as [Illustration] from playback text; preserve meaningful captions only after review.
- Dash normalization: Normalize em/en dashes to simple spaced hyphens for Morse/audio playback in candidate output only.

## First-Hour Preview Candidate

- Feasible: yes
- Confidence: medium
- Sections used: chapter-001 Chapter 1
- Approximate word count: 6234
- Starts at real readable content: yes
- Snippet: CHAPTER I Pirates of Space Apparently motionless to her passengers and crew, the Interplanetary liner _Hyperion_ bored serenely onward through space at normal acceleration. In the railed-off sanctum in one corner of the control room a bell tinkled, a smothered whirr was heard, and Captain Bradley frowned as he studied the brief message upon the tape of the...

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
