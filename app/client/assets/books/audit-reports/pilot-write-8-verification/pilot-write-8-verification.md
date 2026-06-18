# Pilot write batch 8 verification

Post-write QA pass for the 19 processed batch-8 books plus the duplicate skip.

## Totals

- Processed books verified: 19
- Pass: 19
- Warn accepted: 0
- Fail: 0
- Accepted for main: 19
- Corrections applied during verification: 10

## Active quality-gate reports read

```json
{
  "pathsRead": [
    "app/client/assets/books/audit-reports/book-startup-preview-audit-1/book-startup-preview-audit-1.json",
    "app/client/assets/books/audit-reports/title-start-default-content-audit-1/title-start-default-content-audit-1.json",
    "app/client/assets/books/audit-reports/metadata-segmentation-correctness-audit-1/metadata-segmentation-correctness-audit-1.json",
    "app/client/assets/books/audit-reports/manual-ui-defect-followup-1/manual-ui-defect-followup-1.json"
  ],
  "startup": {
    "generatedBookCount": 174,
    "validStartupPreviewCount": 174,
    "previewAssetsUpdated": [],
    "invalidOrMissing": []
  },
  "titleStartDefault": {
    "generatedBooksAudited": 174,
    "acceptedGeneratedBooksAudited": 117,
    "correctionsApplied": 12,
    "acceptedBooksCorrected": 12,
    "acceptanceRevokedPendingCorrection": 0
  },
  "metadataSegmentation": {
    "generatedBooksAudited": 174,
    "acceptedBooksAudited": 117,
    "booksWithUnknownAuthor": 1,
    "unknownAuthorWithClearSourceAuthor": 0,
    "unknownAuthorRemainingJustified": 1,
    "authorCorrectionsApplied": 0,
    "titleCorrectionsApplied": 0,
    "defaultStartOrSegmentationCorrectionsApplied": 0,
    "acceptanceRevokedPendingCorrection": 0
  },
  "manualUiDefectFollowup": {
    "checked": 8,
    "acceptable": 8,
    "corrected": 0,
    "acceptanceRevokedPendingCorrection": 0,
    "needsManualReview": 0
  }
}
```

## Duplicate skip: the-wind-in-the-willows

- Skipped as duplicate: yes
- No generated output created: yes
- No preview asset created: yes
- Existing generated duplicate target unchanged: yes
- Accepted for skip: yes
- Accepted as newly processed: no
- Skip reason: blocked: existing generated slug wind-in-the-willows already has title "The Wind in the Willows" and author Kenneth Grahame; dry-run 8 did not document a distinct-version reason for creating the-wind-in-the-willows

## Unresolved-source generated books left untouched

```json
[
  {
    "slug": "a-princess-of-mars",
    "title": "A princess of Mars",
    "candidateType": "unresolved-source generated, report-only",
    "generatedSectionCount": 30,
    "reason": "Left untouched because no exact raw source was safely resolved from temp-books for this dry-run."
  },
  {
    "slug": "doctor-dolittle",
    "title": "The Story of Doctor Dolittle",
    "candidateType": "unresolved-source generated, report-only",
    "generatedSectionCount": 6,
    "reason": "Left untouched because no exact raw source was safely resolved from temp-books for this dry-run."
  },
  {
    "slug": "heidi",
    "title": "Heidi",
    "candidateType": "unresolved-source generated, report-only",
    "generatedSectionCount": 11,
    "reason": "Left untouched because no exact raw source was safely resolved from temp-books for this dry-run."
  },
  {
    "slug": "jabberwocky",
    "title": "Jabberwocky",
    "candidateType": "unresolved-source generated, report-only",
    "generatedSectionCount": 2,
    "reason": "Left untouched because no exact raw source was safely resolved from temp-books for this dry-run."
  },
  {
    "slug": "nights-with-uncle-remus",
    "title": "Nights With Uncle Remus",
    "candidateType": "unresolved-source generated, report-only",
    "generatedSectionCount": 21,
    "reason": "Left untouched because no exact raw source was safely resolved from temp-books for this dry-run."
  },
  {
    "slug": "peter-pan",
    "title": "Peter Pan [Peter and Wendy]",
    "candidateType": "unresolved-source generated, report-only",
    "generatedSectionCount": 20,
    "reason": "Left untouched because no exact raw source was safely resolved from temp-books for this dry-run."
  },
  {
    "slug": "tarzan-of-the-apes",
    "title": "Tarzan of the Apes",
    "candidateType": "unresolved-source generated, report-only",
    "generatedSectionCount": 30,
    "reason": "Left untouched because no exact raw source was safely resolved from temp-books for this dry-run."
  },
  {
    "slug": "the-great-gatsby",
    "title": "The Great Gatsby",
    "candidateType": "unresolved-source generated, report-only",
    "generatedSectionCount": 11,
    "reason": "Left untouched because no exact raw source was safely resolved from temp-books for this dry-run."
  },
  {
    "slug": "the-picture-of-dorian-gray",
    "title": "The Picture of Dorian Gray",
    "candidateType": "unresolved-source generated, report-only",
    "generatedSectionCount": 23,
    "reason": "Left untouched because no exact raw source was safely resolved from temp-books for this dry-run."
  },
  {
    "slug": "the-thirty-nine-steps",
    "title": "The Thirty-Nine Steps",
    "candidateType": "unresolved-source generated, report-only",
    "generatedSectionCount": 12,
    "reason": "Left untouched because no exact raw source was safely resolved from temp-books for this dry-run."
  },
  {
    "slug": "wood-folk-at-school",
    "title": "Wood folk at school",
    "candidateType": "unresolved-source generated, report-only",
    "generatedSectionCount": 10,
    "reason": "Left untouched because no exact raw source was safely resolved from temp-books for this dry-run."
  }
]
```

Git status for unresolved-source generated books/previews: clean.

## Books

### unicorns

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 35 files
- Preview asset inspected: public/book-previews/unicorns.preview.json
- Generated title verdict: pass: generated title is Unicorns
- Generated author verdict: pass: generated author is James Huneker
- Selected structural convention: chapter-based roman numerals with explicit CHAPTER I-XXX safeguard
- Start boundary verdict: pass: first default is Chapter 1 - In Praise Of Unicorns and starts from real readable content
- End boundary verdict: pass: generated output ends at Chapter 30 - Prayers For The Living with source/license/end-matter tails removed
- Sectioning verdict: pass: 30 sections preserve chapter-based roman numerals with explicit CHAPTER I-XXX safeguard
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: Trimmed a trailing decorative asterisk divider from the final chapter.
- Remaining warnings: none

Supporting snippets:

- Title evidence: Title: Unicorns
- Author evidence: Author: James Huneker
- Raw start: CHAPTER I IN PRAISE OF UNICORNS "The Lion and the Unicorn were fighting for the crown: The Lion beat the Unicorn all round the town." ... In the golden book of wit and wisdom, Through the Looking-Glass, the Unicorn rather disdainfully remarks that he had be...
- Generated first section: CHAPTER I IN PRAISE OF UNICORNS "The Lion and the Unicorn were fighting for the crown: The Lion beat the Unicorn all round the town." ... In the golden book of wit and wisdom, Through the Looking-Glass, the Unicorn rather disdainfully remarks that he had be...
- Generated first default: CHAPTER I IN PRAISE OF UNICORNS "The Lion and the Unicorn were fighting for the crown: The Lion beat the Unicorn all round the town." ... In the golden book of wit and wisdom, Through the Looking-Glass, the Unicorn rather disdainfully remarks that he had be...
- Preview start: CHAPTER I IN PRAISE OF UNICORNS "The Lion and the Unicorn were fighting for the crown: The Lion beat the Unicorn all round the town." ... In the golden book of wit and wisdom, Through the Looking-Glass, the Unicorn rather disdainfully remarks that he had be...
- Raw end: RANK JEWETT MATHER, Jr., in _New York Nation_ and _Evening Post_. * * * * * EGOISTS _WITH PORTRAIT AND FACSIMILE REPRODUCTIONS_ 12mo. $1.50 net "Closely and yet lightly written, full of facts, yet as amusing as a bit of discursive talk, penetrating, candid,...
- Generated end: ht like patriotic Americans, and not gently coo, like pacifists and other sultry south winds. A billion for "preparedness," but not a penny for "pork," say we. And by the same token let us pray that those thundering humbugs and parasites who call themselves...

### six-girls-a-home-story

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 30 files
- Preview asset inspected: public/book-previews/six-girls-a-home-story.preview.json
- Generated title verdict: pass: generated title is Six Girls: A Home Story
- Generated author verdict: pass: generated author is Fannie Belle Irving
- Selected structural convention: chapter-based roman numerals
- Start boundary verdict: pass: first default is Chapter 1 and starts from real readable content
- End boundary verdict: pass: generated output ends at Chapter 25 with source/license/end-matter tails removed
- Sectioning verdict: pass: 25 sections preserve chapter-based roman numerals
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: Trimmed a trailing decorative ASCII box from the final chapter.
- Remaining warnings: none

Supporting snippets:

- Title evidence: Title: Six Girls: A Home Story
- Author evidence: Author: Fannie Belle Irving
- Raw start: CHAPTER I. UNDER THE TREES. There were ripples of sunshine all tangled in the glowing scarlet of the geranium bed and dancing blithely over the grass. A world of melody in quivering bursts of happy song came from the spreading canopy of leaves overhead, and...
- Generated first section: CHAPTER I. UNDER THE TREES. There were ripples of sunshine all tangled in the glowing scarlet of the geranium bed and dancing blithely over the grass. A world of melody in quivering bursts of happy song came from the spreading canopy of leaves overhead, and...
- Generated first default: CHAPTER I. UNDER THE TREES. There were ripples of sunshine all tangled in the glowing scarlet of the geranium bed and dancing blithely over the grass. A world of melody in quivering bursts of happy song came from the spreading canopy of leaves overhead, and...
- Preview start: CHAPTER I. UNDER THE TREES. There were ripples of sunshine all tangled in the glowing scarlet of the geranium bed and dancing blithely over the grass. A world of melody in quivering bursts of happy song came from the spreading canopy of leaves overhead, and...
- Raw end: The feeblest strength could no longer lift the frail form, and all the patient sufferer said when lifted or moved was, "I'm so tired; that will do; it is quite easy." Then the short breath would give out, and she could only thank them with her eyes, that da...
- Generated end: eally wished that I would come, Olive?" "Yes; neither my work nor my life is perfect without you, Roger, and I think that I have known it for some time, though I never so fully confessed it to myself as to-night. I honestly sent you from me, and I honestly...

### the-dunwich-horror

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 15 files
- Preview asset inspected: public/book-previews/the-dunwich-horror.preview.json
- Generated title verdict: pass: generated title is The Dunwich horror
- Generated author verdict: pass: generated author is H. P. Lovecraft
- Selected structural convention: standalone arabic-numbered sections
- Start boundary verdict: pass: first default is Section 1 and starts from real readable content
- End boundary verdict: pass: generated output ends at Section 10 with source/license/end-matter tails removed
- Sectioning verdict: pass: 10 sections preserve standalone arabic-numbered sections
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: Title: The Dunwich horror
- Author evidence: Author: H. P. Lovecraft
- Raw start: 1 When a traveler in north central Massachusetts takes the wrong fork at the junction of the Aylesbury pike just beyond Dean's Corners he comes upon a lonely and curious country. The ground gets higher, and the brier-bordered stone walls press closer and cl...
- Generated first section: 1 When a traveler in north central Massachusetts takes the wrong fork at the junction of the Aylesbury pike just beyond Dean's Corners he comes upon a lonely and curious country. The ground gets higher, and the brier-bordered stone walls press closer and cl...
- Generated first default: 1 When a traveler in north central Massachusetts takes the wrong fork at the junction of the Aylesbury pike just beyond Dean's Corners he comes upon a lonely and curious country. The ground gets higher, and the brier-bordered stone walls press closer and cl...
- Preview start: 1 When a traveler in north central Massachusetts takes the wrong fork at the junction of the Aylesbury pike just beyond Dean's Corners he comes upon a lonely and curious country. The ground gets higher, and the brier-bordered stone walls press closer and cl...
- Raw end: ter the top this minute, heaven only knows what fer!" Then the germ of panic seemed to spread among the seekers. It was one thing to chase the nameless entity, but quite another to find it. Spells might be all right--but suppose they weren't? Voices began q...
- Generated end: down all the rings of standing stones on the other hills. Things like that brought down the beings those Whateleys were so fond of--the beings they were going to let in tangibly to wipe out the human race and drag the earth off to some nameless place for so...

### the-regent-s-daughter

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 43 files
- Preview asset inspected: public/book-previews/the-regent-s-daughter.preview.json
- Generated title verdict: pass: generated title is The regent's daughter
- Generated author verdict: pass: generated author is Alexandre Dumas
- Selected structural convention: chapter-based roman numerals with volume divisions
- Start boundary verdict: pass: first default is Chapter 1 and starts from real readable content
- End boundary verdict: pass: generated output ends at Chapter 38 with source/license/end-matter tails removed
- Sectioning verdict: pass: 38 sections preserve chapter-based roman numerals with volume divisions
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: Trimmed a redundant END OF title marker after the final sentence.
- Remaining warnings: none

Supporting snippets:

- Title evidence: Title: The regent's daughter
- Author evidence: Author: Alexandre Dumas
- Raw start: CHAPTER I. AN ABBESS OF THE EIGHTEENTH CENTURY. On the 8th February, 1719, a carriage, bearing the fleur-de-lis of France, with the motto of Orleans, preceded by two outriders and a page, entered the porch of the Abbey of Chelles, precisely as the clock str...
- Generated first section: CHAPTER I. AN ABBESS OF THE EIGHTEENTH CENTURY. On the 8th February, 1719, a carriage, bearing the fleur-de-lis of France, with the motto of Orleans, preceded by two outriders and a page, entered the porch of the Abbey of Chelles, precisely as the clock str...
- Generated first default: CHAPTER I. AN ABBESS OF THE EIGHTEENTH CENTURY. On the 8th February, 1719, a carriage, bearing the fleur-de-lis of France, with the motto of Orleans, preceded by two outriders and a page, entered the porch of the Abbey of Chelles, precisely as the clock str...
- Preview start: CHAPTER I. AN ABBESS OF THE EIGHTEENTH CENTURY. On the 8th February, 1719, a carriage, bearing the fleur-de-lis of France, with the motto of Orleans, preceded by two outriders and a page, entered the porch of the Abbey of Chelles, precisely as the clock str...
- Raw end: ng for the carriage a little beyond Rambouillet. He was wrapped in a large cloak which left nothing visible but his eyes. Near him was another man also enveloped in a cloak. When the carriage passed, he heaved a deep sigh, and two silent tears fell from his...
- Generated end: dying girl. It contained only these words: "My mother--obtain from your daughter her pardon for the regent." Helene, implored by the superior, grew paler than ever at that name, but she answered: "Yes, my mother, I forgive him. But it is because I go to rej...

### the-scarlet-letter

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 29 files
- Preview asset inspected: public/book-previews/the-scarlet-letter.preview.json
- Generated title verdict: pass: generated title is The Scarlet Letter
- Generated author verdict: pass: generated author is Nathaniel Hawthorne
- Selected structural convention: standalone roman numeral sections
- Start boundary verdict: pass: first default is Chapter 1 and starts from real readable content
- End boundary verdict: pass: generated output ends at Chapter 24 with source/license/end-matter tails removed
- Sectioning verdict: pass: 24 sections preserve standalone roman numeral sections
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: Trimmed a printer/imprint line after the final readable paragraph.
- Remaining warnings: none

Supporting snippets:

- Title evidence: Title: The Scarlet Letter
- Author evidence: Author: Nathaniel Hawthorne
- Raw start: I. THE PRISON-DOOR. [Illustration] A throng of bearded men, in sad-colored garments, and gray, steeple-crowned hats, intermixed with women, some wearing hoods and others bareheaded, was assembled in front of a wooden edifice, the door of which was heavily t...
- Generated first section: I. THE PRISON-DOOR. A throng of bearded men, in sad-colored garments, and gray, steeple-crowned hats, intermixed with women, some wearing hoods and others bareheaded, was assembled in front of a wooden edifice, the door of which was heavily timbered with oa...
- Generated first default: I. THE PRISON-DOOR. A throng of bearded men, in sad-colored garments, and gray, steeple-crowned hats, intermixed with women, some wearing hoods and others bareheaded, was assembled in front of a wooden edifice, the door of which was heavily timbered with oa...
- Preview start: I. THE PRISON-DOOR. A throng of bearded men, in sad-colored garments, and gray, steeple-crowned hats, intermixed with women, some wearing hoods and others bareheaded, was assembled in front of a wooden edifice, the door of which was heavily timbered with oa...
- Raw end: ge 132?inserted a missing closing quote after ?a child of her age? page 137?spelling normalized: changed ?careworn? to ?care-worn? page 147?typo fixed: changed ?physican? to ?physician? page 171?typo fixed: changed ?vocies? to ?voices? page 262?removed an e...
- Generated end: Chapel has since been built. It was near that old and sunken grave, yet with a space between, as if the dust of the two sleepers had no right to mingle. Yet one tombstone served for both. All around, there were monuments carved with armorial bearings; and o...

### the-tower-treasure

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 29 files
- Preview asset inspected: public/book-previews/the-tower-treasure.preview.json
- Generated title verdict: pass: generated title is The tower treasure
- Generated author verdict: pass: generated author is Franklin W. Dixon
- Selected structural convention: chapter-based roman numerals
- Start boundary verdict: pass: first default is Chapter 1 and starts from real readable content
- End boundary verdict: pass: generated output ends at Chapter 24 with source/license/end-matter tails removed
- Sectioning verdict: pass: 24 sections preserve chapter-based roman numerals
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: Trimmed a trailing Hardy Boys series advertisement from the final chapter.
- Remaining warnings: none

Supporting snippets:

- Title evidence: Title: The tower treasure
- Author evidence: Author: Franklin W. Dixon
- Raw start: CHAPTER I THE SPEED DEMON "After the help we gave dad on that forgery case I guess he'll begin to think we _could_ be detectives when we grow up." "Why shouldn't we? Isn't he one of the most famous detectives in the country? And aren't we his sons? If the p...
- Generated first section: CHAPTER I THE SPEED DEMON "After the help we gave dad on that forgery case I guess he'll begin to think we _could_ be detectives when we grow up." "Why shouldn't we? Isn't he one of the most famous detectives in the country? And aren't we his sons? If the p...
- Generated first default: CHAPTER I THE SPEED DEMON "After the help we gave dad on that forgery case I guess he'll begin to think we _could_ be detectives when we grow up." "Why shouldn't we? Isn't he one of the most famous detectives in the country? And aren't we his sons? If the p...
- Preview start: CHAPTER I THE SPEED DEMON "After the help we gave dad on that forgery case I guess he'll begin to think we _could_ be detectives when we grow up." "Why shouldn't we? Isn't he one of the most famous detectives in the country? And aren't we his sons? If the p...
- Raw end: 's been a long time since there's been a crowd of boys in Tower Mansion," he said. "I've been in danger of forgetting that I was ever young once myself. So I want you to come back--often. I want you to know that Tower Mansion is always open to the Hardy boy...
- Generated end: es in this case will be told in the next volume of this series, entitled "The Hardy Boys: The House on the Cliff." "Speech! Speech!" the boys were shouting to Hurd Applegate. The old stamp collector got up, smiling. "It's been a long time since there's been...

### the-wailing-octopus-a-rick-brant-science-adventure-story

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 25 files
- Preview asset inspected: public/book-previews/the-wailing-octopus-a-rick-brant-science-adventure-story.preview.json
- Generated title verdict: pass: generated title is The Wailing Octopus: A Rick Brant Science-Adventure Story
- Generated author verdict: pass: generated author is Harold L. Goodwin
- Selected structural convention: chapter-based roman numerals
- Start boundary verdict: pass: first default is Chapter 1 and starts from real readable content
- End boundary verdict: pass: generated output ends at Chapter 20 with source/license/end-matter tails removed
- Sectioning verdict: pass: 20 sections preserve chapter-based roman numerals
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: Trimmed a trailing Rick Brant series advertisement from the final chapter.
- Remaining warnings: none

Supporting snippets:

- Title evidence: Title: The Wailing Octopus: A Rick Brant Science-Adventure Story
- Author evidence: Author: Harold L. Goodwin
- Raw start: CHAPTER I Destination: Clipper Cay The Sky Wagon droned through Caribbean skies, following a compass course that led to Charlotte Amalie, capital city of the Virgin Islands. With eager interest, the four people in the small plane watched the blue water belo...
- Generated first section: CHAPTER I Destination: Clipper Cay The Sky Wagon droned through Caribbean skies, following a compass course that led to Charlotte Amalie, capital city of the Virgin Islands. With eager interest, the four people in the small plane watched the blue water belo...
- Generated first default: CHAPTER I Destination: Clipper Cay The Sky Wagon droned through Caribbean skies, following a compass course that led to Charlotte Amalie, capital city of the Virgin Islands. With eager interest, the four people in the small plane watched the blue water belo...
- Preview start: CHAPTER I Destination: Clipper Cay The Sky Wagon droned through Caribbean skies, following a compass course that led to Charlotte Amalie, capital city of the Virgin Islands. With eager interest, the four people in the small plane watched the blue water belo...
- Raw end: nce and electronics. You can share every one of these adventures in the pages of Rick's books. They are available at your book store in handsome, low-priced editions. THE ROCKET'S SHADOW THE LOST CITY SEA GOLD 100 FATHOMS UNDER THE WHISPERING BOX MYSTERY TH...
- Generated end: so that he could present it to Hartson Brant. A few quick dives the following morning disclosed nothing of interest around the first wreck they had found, but Jimmy identified it as a common type of small cargo vessel. Then the destroyer escort sailed for S...

### winnie-the-pooh

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 15 files
- Preview asset inspected: public/book-previews/winnie-the-pooh.preview.json
- Generated title verdict: pass: generated title is Winnie-the-Pooh
- Generated author verdict: pass: generated author is A. A. Milne
- Selected structural convention: chapter-based roman numerals
- Start boundary verdict: pass: first default is Chapter 1 and starts from real readable content
- End boundary verdict: pass: generated output ends at Chapter 10 with source/license/end-matter tails removed
- Sectioning verdict: pass: 10 sections preserve chapter-based roman numerals
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: Title: Winnie-the-Pooh
- Author evidence: Author: A. A. Milne
- Raw start: CHAPTER I IN WHICH WE ARE INTRODUCED TO WINNIE-THE-POOH AND SOME BEES, AND THE STORIES BEGIN Here is Edward Bear, coming downstairs now, bump, bump, bump, on the back of his head, behind Christopher Robin. It is, as far as he knows, the only way of coming d...
- Generated first section: CHAPTER I IN WHICH WE ARE INTRODUCED TO WINNIE-THE-POOH AND SOME BEES, AND THE STORIES BEGIN Here is Edward Bear, coming downstairs now, bump, bump, bump, on the back of his head, behind Christopher Robin. It is, as far as he knows, the only way of coming d...
- Generated first default: CHAPTER I IN WHICH WE ARE INTRODUCED TO WINNIE-THE-POOH AND SOME BEES, AND THE STORIES BEGIN Here is Edward Bear, coming downstairs now, bump, bump, bump, on the back of his head, behind Christopher Robin. It is, as far as he knows, the only way of coming d...
- Preview start: CHAPTER I IN WHICH WE ARE INTRODUCED TO WINNIE-THE-POOH AND SOME BEES, AND THE STORIES BEGIN Here is Edward Bear, coming downstairs now, bump, bump, bump, on the back of his head, behind Christopher Robin. It is, as far as he knows, the only way of coming d...
- Raw end: ind him. At the door he turned and said "Coming to see me have my bath?" "I might," I said. "Was Pooh's pencil case any better than mine?" "It was just the same," I said. He nodded and went out ... and in a moment I heard Winnie-the-Pooh--_bump, bump, bump_...
- Generated end: t's the same thing," he said. * * * * * "And what did happen?" asked Christopher Robin. "When?" "Next morning." "I don't know." "Could you think and tell me and Pooh some time?" "If you wanted it very much." "Pooh does," said Christopher Robin. He gave a de...

### the-lady-of-the-lake

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 11 files
- Preview asset inspected: public/book-previews/the-lady-of-the-lake.preview.json
- Generated title verdict: pass: generated title is The Lady of the Lake
- Generated author verdict: pass: generated author is Walter Scott
- Selected structural convention: six canto-based verse sections; editorial notes excluded from default playback
- Start boundary verdict: pass: first default is Canto 1 and starts from real readable content
- End boundary verdict: pass: generated output ends at Canto 6 with source/license/end-matter tails removed
- Sectioning verdict: pass: 6 sections preserve six canto-based verse sections; editorial notes excluded from default playback
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from poem-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: Title: The Lady of the Lake
- Author evidence: Author: Walter Scott
- Raw start: CANTO FIRST. The Chase. Harp of the North! that mouldering long hast hung On the witch-elm that shades Saint Fillan's spring And down the fitful breeze thy numbers flung, Till envious ivy did around thee cling, Muffling with verdant ringlet every string,--...
- Generated first section: CANTO FIRST. The Chase. Harp of the North! that mouldering long hast hung On the witch-elm that shades Saint Fillan's spring And down the fitful breeze thy numbers flung, Till envious ivy did around thee cling, Muffling with verdant ringlet every string,--...
- Generated first default: CANTO FIRST. The Chase. Harp of the North! that mouldering long hast hung On the witch-elm that shades Saint Fillan's spring And down the fitful breeze thy numbers flung, Till envious ivy did around thee cling, Muffling with verdant ringlet every string,--...
- Preview start: CANTO FIRST. The Chase. Harp of the North! that mouldering long hast hung On the witch-elm that shades Saint Fillan's spring And down the fitful breeze thy numbers flung, Till envious ivy did around thee cling, Muffling with verdant ringlet every string,--...
- Raw end: residing at Stirling, in Buchanan of Arnpryor's time, carriers were very frequently passing along the common road, being near Arnpryor's house, with necessaries for the use of the King's family; and he, having some extraordinary occasion, ordered one of the...
- Generated end: 's long way, Through secret woes the world has never known, When on the weary night dawned wearier day, And bitterer was the grief devoured alone.-- That I o'erlive such woes, Enchantress! is thine own. Hark! as my lingering footsteps slow retire, Some Spir...

### the-lurking-fear

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 9 files
- Preview asset inspected: public/book-previews/the-lurking-fear.preview.json
- Generated title verdict: pass: generated title is The lurking fear
- Generated author verdict: pass: generated author is H. P. Lovecraft
- Selected structural convention: four numbered story sections with sentence-fragment false-positive safeguard
- Start boundary verdict: pass: first default is Section 1 - The Shadow on the Chimney and starts from real readable content
- End boundary verdict: pass: generated output ends at Section 4 - The Horror in the Eyes with source/license/end-matter tails removed
- Sectioning verdict: pass: 4 sections preserve four numbered story sections with sentence-fragment false-positive safeguard
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: Title: The lurking fear
- Author evidence: Author: H. P. Lovecraft
- Raw start: _1. The Shadow on the Chimney_ There was thunder in the air on the night I went to the deserted mansion atop Tempest Mountain to find the lurking fear. I was not alone, for foolhardiness was not then mixed with that love of the grotesque and the terrible wh...
- Generated first section: _1. The Shadow on the Chimney_ There was thunder in the air on the night I went to the deserted mansion atop Tempest Mountain to find the lurking fear. I was not alone, for foolhardiness was not then mixed with that love of the grotesque and the terrible wh...
- Generated first default: _1. The Shadow on the Chimney_ There was thunder in the air on the night I went to the deserted mansion atop Tempest Mountain to find the lurking fear. I was not alone, for foolhardiness was not then mixed with that love of the grotesque and the terrible wh...
- Preview start: _1. The Shadow on the Chimney_ There was thunder in the air on the night I went to the deserted mansion atop Tempest Mountain to find the lurking fear. I was not alone, for foolhardiness was not then mixed with that love of the grotesque and the terrible wh...
- Raw end: ove and below the ground; the embodiment of all the snarling chaos and grinning fear that lurk behind life. It had looked at me as it died, and its eyes had the same odd quality that marked those other eyes which had stared at me underground and excited clo...
- Generated end: with sharp yellow fangs and matted fur. It was the ultimate product of mammalian degeneration; the frightful outcome of isolated spawning, multiplication, and cannibal nutrition above and below the ground; the embodiment of all the snarling chaos and grinni...

### metamorphosis

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 8 files
- Preview asset inspected: public/book-previews/metamorphosis.preview.json
- Generated title verdict: pass: generated title is Metamorphosis
- Generated author verdict: pass: generated author is Franz Kafka
- Selected structural convention: standalone roman numeral sections
- Start boundary verdict: pass: first default is Chapter 1 and starts from real readable content
- End boundary verdict: pass: generated output ends at Chapter 3 with source/license/end-matter tails removed
- Sectioning verdict: pass: 3 sections preserve standalone roman numeral sections
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: Title: Metamorphosis
- Author evidence: Author: Franz Kafka
- Raw start: I One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could see his brown belly, slightly domed and divided by arches...
- Generated first section: I One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could see his brown belly, slightly domed and divided by arches...
- Generated first default: I One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could see his brown belly, slightly domed and divided by arches...
- Preview start: I One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could see his brown belly, slightly domed and divided by arches...
- Raw end: indeed completely dried up and flat, they had not seen it until then, but now he was not lifted up on his little legs, nor did he do anything to make them look away. ?Grete, come with us in here for a little while?, said Mrs. Samsa with a pained smile, and...
- Generated end: by Gregor, one that was in a better location and, most of all, more practical. All the time, Grete was becoming livelier. With all the worry they had been having of late her cheeks had become pale, but, while they were talking, Mr. and Mrs. Samsa were struc...

### the-monkey-s-paw

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 8 files
- Preview asset inspected: public/book-previews/the-monkey-s-paw.preview.json
- Generated title verdict: pass: generated title is The Monkey's Paw
- Generated author verdict: pass: generated author is W. W. Jacobs
- Selected structural convention: standalone roman numeral sections
- Start boundary verdict: pass: first default is Chapter 1 and starts from real readable content
- End boundary verdict: pass: generated output ends at Chapter 3 with source/license/end-matter tails removed
- Sectioning verdict: pass: 3 sections preserve standalone roman numeral sections
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: Title: The Monkey's Paw
- Author evidence: Author: W. W. Jacobs
- Raw start: I. Without, the night was cold and wet, but in the small parlour of Laburnam Villa the blinds were drawn and the fire burned brightly. Father and son were at chess, the former, who possessed ideas about the game involving radical changes, putting his king i...
- Generated first section: I. Without, the night was cold and wet, but in the small parlour of Laburnam Villa the blinds were drawn and the fire burned brightly. Father and son were at chess, the former, who possessed ideas about the game involving radical changes, putting his king i...
- Generated first default: I. Without, the night was cold and wet, but in the small parlour of Laburnam Villa the blinds were drawn and the fire burned brightly. Father and son were at chess, the former, who possessed ideas about the game involving radical changes, putting his king i...
- Preview start: I. Without, the night was cold and wet, but in the small parlour of Laburnam Villa the blinds were drawn and the fire burned brightly. Father and son were at chess, the former, who possessed ideas about the game involving radical changes, putting his king i...
- Raw end: eaking of the bolt as it came slowly back, and at the same moment he found the monkey?s paw, and frantically breathed his third and last wish. The knocking ceased suddenly, although the echoes of it were still in the house. He heard the chair drawn back, an...
- Generated end: got in. A perfect fusillade of knocks reverberated through the house, and he heard the scraping of a chair as his wife put it down in the passage against the door. He heard the creaking of the bolt as it came slowly back, and at the same moment he found the...

### the-hound

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 7 files
- Preview asset inspected: public/book-previews/the-hound.preview.json
- Generated title verdict: pass: generated title is The Hound
- Generated author verdict: pass: generated author is H. P. Lovecraft
- Selected structural convention: standalone roman numeral sections
- Start boundary verdict: pass: first default is Chapter 1 and starts from real readable content
- End boundary verdict: pass: generated output ends at Chapter 2 with source/license/end-matter tails removed
- Sectioning verdict: pass: 2 sections preserve standalone roman numeral sections
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: Trimmed a source-site return/revision tail from the final section.
- Remaining warnings: none

Supporting snippets:

- Title evidence: The Hound
- Author evidence: By H. P. Lovecraft
- Raw start: I. In my tortured ears there sounds unceasingly a nightmare whirring and flapping, and a faint, distant baying as of some gigantic hound. It is not dream?it is not, I fear, even madness?for too much has already happened to give me these merciful doubts. St....
- Generated first section: I. In my tortured ears there sounds unceasingly a nightmare whirring and flapping, and a faint, distant baying as of some gigantic hound. It is not dream—it is not, I fear, even madness—for too much has already happened to give me these merciful doubts. St....
- Generated first default: I. In my tortured ears there sounds unceasingly a nightmare whirring and flapping, and a faint, distant baying as of some gigantic hound. It is not dream—it is not, I fear, even madness—for too much has already happened to give me these merciful doubts. St....
- Preview start: I. In my tortured ears there sounds unceasingly a nightmare whirring and flapping, and a faint, distant baying as of some gigantic hound. It is not dream—it is not, I fear, even madness—for too much has already happened to give me these merciful doubts. St....
- Raw end: ht-black ruins of buried temples of Belial. . . . Now, as the baying of that dead, fleshless monstrosity grows louder and louder, and the stealthy whirring and flapping of those accursed web-wings circles closer and closer, I shall seek with my revolver the...
- Generated end: ic bay as of some gigantic hound, and I saw that it held in its gory, filthy claw the lost and fateful amulet of green jade, I merely screamed and ran away idiotically, my screams soon dissolving into peals of hysterical laughter. Madness rides the star-win...

### the-masque-of-the-red-death

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 6 files
- Preview asset inspected: public/book-previews/the-masque-of-the-red-death.preview.json
- Generated title verdict: pass: generated title is The Masque of the Red Death
- Generated author verdict: pass: generated author is Edgar Allan Poe
- Selected structural convention: one contiguous story section after excluding title/byline/source-site/transcriber/footer wrapper lines
- Start boundary verdict: pass: first default is The Masque of the Red Death and starts from real readable content
- End boundary verdict: pass: generated output ends at The Masque of the Red Death with source/license/end-matter tails removed
- Sectioning verdict: pass: 1 sections preserve one contiguous story section after excluding title/byline/source-site/transcriber/footer wrapper lines
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: Title: The Masque of the Red Death
- Author evidence: Author: Edgar Allan Poe
- Raw start: The Masque of the Red Death The ?Red Death? had long devastated the country. No pestilence had ever been so fatal, or so hideous. Blood was its Avatar and its seal?the redness and the horror of blood. There were sharp pains, and sudden dizziness, and then p...
- Generated first section: The “Red Death” had long devastated the country. No pestilence had ever been so fatal, or so hideous. Blood was its Avatar and its seal—the redness and the horror of blood. There were sharp pains, and sudden dizziness, and then profuse bleeding at the pores...
- Generated first default: The “Red Death” had long devastated the country. No pestilence had ever been so fatal, or so hideous. Blood was its Avatar and its seal—the redness and the horror of blood. There were sharp pains, and sudden dizziness, and then profuse bleeding at the pores...
- Preview start: The “Red Death” had long devastated the country. No pestilence had ever been so fatal, or so hideous. Blood was its Avatar and its seal—the redness and the horror of blood. There were sharp pains, and sudden dizziness, and then profuse bleeding at the pores...
- Raw end: nd corpse-like mask, which they handled with so violent a rudeness, untenanted by any tangible form. And now was acknowledged the presence of the Red Death. He had come like a thief in the night. And one by one dropped the revellers in the blood-bedewed hal...
- Generated end: apartment, and, seizing the mummer, whose tall figure stood erect and motionless within the shadow of the ebony clock, gasped in unutterable horror at finding the grave cerements and corpse-like mask, which they handled with so violent a rudeness, untenante...

### the-red-room

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 6 files
- Preview asset inspected: public/book-previews/the-red-room.preview.json
- Generated title verdict: pass: generated title is The Red Room
- Generated author verdict: pass: generated author is H. G. Wells
- Selected structural convention: one contiguous story section after excluding title/byline/source-site/transcriber/footer wrapper lines
- Start boundary verdict: pass: first default is The Red Room and starts from real readable content
- End boundary verdict: pass: generated output ends at The Red Room with source/license/end-matter tails removed
- Sectioning verdict: pass: 1 sections preserve one contiguous story section after excluding title/byline/source-site/transcriber/footer wrapper lines
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: Title: The Red Room
- Author evidence: Author: H. G. Wells
- Raw start: THE RED ROOM ?I can assure you,? said I, ?that it will take a very tangible ghost to frighten me.? And I stood up before the fire with my glass in my hand. ?It is your own choosing,? said the man with the withered arm, and glanced at me askance. ?Eight-and-...
- Generated first section: “I can assure you,” said I, “that it will take a very tangible ghost to frighten me.” And I stood up before the fire with my glass in my hand. “It is your own choosing,” said the man with the withered arm, and glanced at me askance. “Eight-and-twenty years,...
- Generated first default: “I can assure you,” said I, “that it will take a very tangible ghost to frighten me.” And I stood up before the fire with my glass in my hand. “It is your own choosing,” said the man with the withered arm, and glanced at me askance. “Eight-and-twenty years,...
- Preview start: “I can assure you,” said I, “that it will take a very tangible ghost to frighten me.” And I stood up before the fire with my glass in my hand. “It is your own choosing,” said the man with the withered arm, and glanced at me askance. “Eight-and-twenty years,...
- Raw end: ed his face sideways to see me and spoke. ?That is it,? said he. ?I knew that was it. A Power of Darkness. To put such a curse upon a home! It lurks there always. You can feel it even in the daytime, even of a bright summer?s day, in the hangings, in the cu...
- Generated end: m--” I stopped abruptly. There was an interval of silence. My hand went up to my bandages. “The candles went out one after another, and I fled--” Then the man with the shade lifted his face sideways to see me and spoke. “That is it,” said he. “I knew that w...

### from-beyond

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 6 files
- Preview asset inspected: public/book-previews/from-beyond.preview.json
- Generated title verdict: pass: generated title is From Beyond
- Generated author verdict: pass: generated author is H. P. Lovecraft
- Selected structural convention: one contiguous story section after excluding title/byline/source-site/transcriber/footer wrapper lines
- Start boundary verdict: pass: first default is From Beyond and starts from real readable content
- End boundary verdict: pass: generated output ends at From Beyond with source/license/end-matter tails removed
- Sectioning verdict: pass: 1 sections preserve one contiguous story section after excluding title/byline/source-site/transcriber/footer wrapper lines
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: Trimmed a source-site return/revision tail from the story section.
- Remaining warnings: none

Supporting snippets:

- Title evidence: From Beyond
- Author evidence: By H. P. Lovecraft
- Raw start: From Beyond Horrible beyond conception was the change which had taken place in my best friend, Crawford Tillinghast. I had not seen him since that day, two months and a half before, when he had told me toward what goal his physical and metaphysical research...
- Generated first section: Horrible beyond conception was the change which had taken place in my best friend, Crawford Tillinghast. I had not seen him since that day, two months and a half before, when he had told me toward what goal his physical and metaphysical researches were lead...
- Generated first default: Horrible beyond conception was the change which had taken place in my best friend, Crawford Tillinghast. I had not seen him since that day, two months and a half before, when he had told me toward what goal his physical and metaphysical researches were lead...
- Preview start: Horrible beyond conception was the change which had taken place in my best friend, Crawford Tillinghast. I had not seen him since that day, two months and a half before, when he had told me toward what goal his physical and metaphysical researches were lead...
- Raw end: air and the sky about and above me. I never feel alone or comfortable, and a hideous sense of pursuit sometimes comes chillingly on me when I am weary. What prevents me from believing the doctor is this one simple fact?that the police never found the bodies...
- Generated end: red on the laboratory floor. I did not tell very much of what I had seen, for I feared the coroner would be sceptical; but from the evasive outline I did give, the doctor told me that I had undoubtedly been hypnotised by the vindictive and homicidal madman....

### the-other-gods

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 6 files
- Preview asset inspected: public/book-previews/the-other-gods.preview.json
- Generated title verdict: pass: generated title is The Other Gods
- Generated author verdict: pass: generated author is H. P. Lovecraft
- Selected structural convention: one contiguous story section after excluding title/byline/source-site/transcriber/footer wrapper lines
- Start boundary verdict: pass: first default is The Other Gods and starts from real readable content
- End boundary verdict: pass: generated output ends at The Other Gods with source/license/end-matter tails removed
- Sectioning verdict: pass: 1 sections preserve one contiguous story section after excluding title/byline/source-site/transcriber/footer wrapper lines
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: Trimmed a source-site return/revision tail from the story section.
- Remaining warnings: none

Supporting snippets:

- Title evidence: The Other Gods
- Author evidence: By H. P. Lovecraft
- Raw start: The Other Gods Atop the tallest of earth?s peaks dwell the gods of earth, and suffer no man to tell that he hath looked upon them. Lesser peaks they once inhabited; but ever the men from the plains would scale the slopes of rock and snow, driving the gods t...
- Generated first section: Atop the tallest of earth’s peaks dwell the gods of earth, and suffer no man to tell that he hath looked upon them. Lesser peaks they once inhabited; but ever the men from the plains would scale the slopes of rock and snow, driving the gods to higher and hi...
- Generated first default: Atop the tallest of earth’s peaks dwell the gods of earth, and suffer no man to tell that he hath looked upon them. Lesser peaks they once inhabited; but ever the men from the plains would scale the slopes of rock and snow, driving the gods to higher and hi...
- Preview start: Atop the tallest of earth’s peaks dwell the gods of earth, and suffer no man to tell that he hath looked upon them. Lesser peaks they once inhabited; but ever the men from the plains would scale the slopes of rock and snow, driving the gods to higher and hi...
- Raw end: urs hide the mountain-top and the moon. And above the mists on Hatheg-Kla earth?s gods sometimes dance reminiscently; for they know they are safe, and love to come from unknown Kadath in ships of cloud and play in the olden way, as they did when earth was n...
- Generated end: ol was like to one that learned men have discerned in those frightful parts of the Pnakotic Manuscripts which are too ancient to be read. This they found. Barzai the Wise they never found, nor could the holy priest Atal ever be persuaded to pray for his sou...

### the-statement-of-randolph-carter

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 6 files
- Preview asset inspected: public/book-previews/the-statement-of-randolph-carter.preview.json
- Generated title verdict: pass: generated title is The Statement of Randolph Carter
- Generated author verdict: pass: generated author is H. P. Lovecraft
- Selected structural convention: one contiguous story section after excluding title/byline/source-site/transcriber/footer wrapper lines
- Start boundary verdict: pass: first default is The Statement of Randolph Carter and starts from real readable content
- End boundary verdict: pass: generated output ends at The Statement of Randolph Carter with source/license/end-matter tails removed
- Sectioning verdict: pass: 1 sections preserve one contiguous story section after excluding title/byline/source-site/transcriber/footer wrapper lines
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: Trimmed a source-site return/revision tail from the story section.
- Remaining warnings: none

Supporting snippets:

- Title evidence: The Statement of Randolph Carter
- Author evidence: By H. P. Lovecraft
- Raw start: The Statement of Randolph Carter I repeat to you, gentlemen, that your inquisition is fruitless. Detain me here forever if you will; confine or execute me if you must have a victim to propitiate the illusion you call justice; but I can say no more than I ha...
- Generated first section: I repeat to you, gentlemen, that your inquisition is fruitless. Detain me here forever if you will; confine or execute me if you must have a victim to propitiate the illusion you call justice; but I can say no more than I have said already. Everything that...
- Generated first default: I repeat to you, gentlemen, that your inquisition is fruitless. Detain me here forever if you will; confine or execute me if you must have a victim to propitiate the illusion you call justice; but I can say no more than I have said already. Everything that...
- Preview start: I repeat to you, gentlemen, that your inquisition is fruitless. Detain me here forever if you will; confine or execute me if you must have a victim to propitiate the illusion you call justice; but I can say no more than I have said already. Everything that...
- Raw end: n I called down, ?Warren, are you there??, and in answer heard the thing which has brought this cloud over my mind. I do not try, gentlemen, to account for that thing?that voice?nor can I venture to describe it in detail, since the first words took away my...
- Generated end: ook away my consciousness and created a mental blank which reaches to the time of my awakening in the hospital. Shall I say that the voice was deep; hollow; gelatinous; remote; unearthly; inhuman; disembodied? What shall I say? It was the end of my experien...

### the-silver-key

- Write action: first-time processed
- Verification status: pass
- Generated output inspected: 6 files
- Preview asset inspected: public/book-previews/the-silver-key.preview.json
- Generated title verdict: pass: generated title is The silver key
- Generated author verdict: pass: generated author is H. P. Lovecraft
- Selected structural convention: one contiguous story section after excluding title/byline/source-site/transcriber/footer wrapper lines
- Start boundary verdict: pass: first default is The silver key and starts from real readable content
- End boundary verdict: pass: generated output ends at The silver key with source/license/end-matter tails removed
- Sectioning verdict: pass: 1 sections preserve one contiguous story section after excluding title/byline/source-site/transcriber/footer wrapper lines
- Cleanup verdict: pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected
- Preview verdict: pass: preview starts from chapter-001 and matches generated content hash
- All-main-readable-default verdict: pass: all generated main readable sections are included by default and source order starts at first default
- Startup preview valid: yes
- Accepted for main: yes
- Correction needed before main: no
- Correction applied during verification: none
- Remaining warnings: none

Supporting snippets:

- Title evidence: Title: The silver key
- Author evidence: Author: H. P. Lovecraft
- Raw start: The SILVER KEY When Randolph Carter was thirty he lost the key to the gate of dreams. Prior to that time he had made up for the prosiness of life by nightly excursions to strange and ancient cities beyond space, and lovely, unbelievable garden lands across...
- Generated first section: When Randolph Carter was thirty he lost the key to the gate of dreams. Prior to that time he had made up for the prosiness of life by nightly excursions to strange and ancient cities beyond space, and lovely, unbelievable garden lands across ethereal seas;...
- Generated first default: When Randolph Carter was thirty he lost the key to the gate of dreams. Prior to that time he had made up for the prosiness of life by nightly excursions to strange and ancient cities beyond space, and lovely, unbelievable garden lands across ethereal seas;...
- Preview start: When Randolph Carter was thirty he lost the key to the gate of dreams. Prior to that time he had made up for the prosiness of life by nightly excursions to strange and ancient cities beyond space, and lovely, unbelievable garden lands across ethereal seas;...
- Raw end: d to haunt. It is rumored in Ulthar, beyond the River Skai, that a new king reigns on the opal throne of Ilek-Vad, that fabulous town of turrets atop the hollow cliffs of glass overlooking the twilight sea wherein the bearded and finny Gnorri build their si...
- Generated end: ound a key, and I somehow believe he was able to use it to strange advantage. I shall ask him when I see him, for I expect to meet him shortly in a certain dream-city we both used to haunt. It is rumored in Ulthar, beyond the River Skai, that a new king rei...

## Future-batch rule

- valid generated readable content
- correct generated title
- correct author metadata or documented unresolved-author policy
- no duplicate generated work under a slightly different slug unless intentionally documented
- first default section from real readable content
- all main readable sections included by default
- meaningful source-based segmentation
- valid book-specific startup preview
- no SOS Help!
- no generic preview fallback
- no title/TOC/source/license/contributor/transcriber/byline material as default playback
- selected/default source order begins from the first selected/default section

## Later-phase requirements

- after all books are processed, run an independent second-pass audit using a different strategy
- after books and second-pass audit, add original non-spoiler 300-500+ word SEO summaries for each accepted book page
- after summaries, perform full site SEO/meta review using GSC data and route-level intent
- final cleanup should remove temporary audit scripts/reports and code bloat only after everything is stable
