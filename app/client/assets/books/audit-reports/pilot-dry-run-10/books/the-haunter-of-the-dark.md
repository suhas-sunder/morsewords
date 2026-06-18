# Pilot Dry Run 10: the-haunter-of-the-dark

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/The haunter of the dark.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The haunter of the dark
- Title evidence: Gutenberg Title line line 11 - Title: The haunter of the dark
- Expected author: H. P. Lovecraft
- Author evidence: Gutenberg Author line line 13 - Author: H. P. Lovecraft
- Apparent work type: individual story
- Detected structural convention: isolated titled sections
- Structure confidence: high
- Meaningful headings exist: yes
- Expected first default section: The Haunter of the Dark
- Front matter to exclude/preserve non-default: No leading front matter detected before the first selected body section.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at cleaned-body line 1: The Haunter of the Dark
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use Isolated title-case heading boundaries; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 7 planned isolated titled sections sections unless a future write inspection demotes true front/back matter
- Likely section count: 7
- Expected preview start: _A powerful story about an old church in Providence, Rhode Island, that was shunned and feared by all who knew it._ (Dedicated to Robert Bloch) I have seen the dark universe yawning Where the black planets roll without aim-- Where they roll in their horror unheeded, Without knowledge or luster or name. --_Nemesis._...
- Duplicate/near-duplicate slug check: No exact or close generated slug match detected among current generated books.
- Current status: needs first-time controlled processing
- Recommendation for next pass: controlled first-time processing

## Cleanup Risks

- title page, byline, publication, or copyright material appears before body content
- Project Gutenberg/source/license material must be removed
- contributor or transcriber notes must be removed or preserved only as non-default

## Title/Default-Start Risks

- write pass must keep title/byline material out of default playback
- first default section is meaningful but should be verified manually in write pass

## Segmentation Risks

- structure audit recommends processing with warnings; write pass must verify boundaries directly from raw source

## Author Metadata Risks

- None.

## Collection-Title Leakage Risks

- None.

## Illustration/Page/Footnote Risks

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: Title: The haunter of the dark
- Author: Author: H. P. Lovecraft
- Start: The Haunter of the Dark _A powerful story about an old church in Providence, Rhode Island, that was shunned and feared by all who knew it._ (Dedicated to Robert Bloch) I have seen the dark universe yawning Where the black planets roll without aim-- Where they roll in their horror unheeded, Without knowledge or luster or name. --_Nemesis._...
- End: tower--window--can hear--Roderick Usher--am mad or going mad--the thing is stirring and fumbling in the tower--I am it and it is I--I want to get out ... must get out and unify the forces.... It knows where I am.... "I am Robert Blake, but I see the tower in the dark. There is a monstrous odor ... senses transfigure...

## Heading Examples

- L1: The Haunter of the Dark
- L22: --_Nemesis._
- L107: the Crypt_, _Shaggai_, _In the Vale of Pnath_, and _The Feaster from
- L445: "Prof. Enoch Bowen home from Egypt May 1844--buys old Free-Will
- L450: Dec. 29, 1844."
- L483: "Gang--Federal Hill Boys--threaten Dr. ---- and vestrymen in May."
