# Pilot Dry Run 8: the-lurking-fear

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/The lurking fear.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The lurking fear
- Title evidence: Gutenberg Title line line 11 - Title: The lurking fear
- Expected author: H. P. Lovecraft
- Author evidence: Gutenberg Author line line 13 - Author: H. P. Lovecraft
- Apparent work type: standalone book
- Detected structural convention: isolated titled sections; dry-run filters one false sentence-fragment heading
- Structure confidence: medium
- Meaningful headings exist: yes
- Expected first default section: _1. The Shadow on the Chimney_
- Expected start boundary: start at cleaned-body line 11: _1. The Shadow on the Chimney_
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use the four numbered story sections; ignore the sentence-fragment false positive inside section 2; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 4 planned isolated titled sections; dry-run filters one false sentence-fragment heading sections unless a future write inspection demotes true front/back matter
- Likely section count: 4
- Expected preview start: There was thunder in the air on the night I went to the deserted mansion atop Tempest Mountain to find the lurking fear. I was not alone, for foolhardiness was not then mixed with that love of the grotesque and the terrible which has made my career a series of quests for strange horrors in literature and in life. Wi...
- Current status: needs first-time controlled processing
- Recommendation for next pass: controlled first-time processing

## Cleanup Risks

- title page, byline, publication, or copyright material appears before body content
- Project Gutenberg/source/license material must be removed
- contributor or transcriber notes must be removed or preserved only as non-default
- illustration captions/placeholders must be removed from default playback

## Title/Default-Start Risks

- write pass must keep title/byline material out of default playback
- first default section is meaningful but should be verified manually in write pass

## Author Metadata Risks

- None.

## Collection-Title Leakage Risks

- None.

## Illustration/Page/Footnote Risks

- illustration captions/placeholders detected

## Supporting Snippets

- Title: Title: The lurking fear
- Author: Author: H. P. Lovecraft
- Start: _1. The Shadow on the Chimney_ There was thunder in the air on the night I went to the deserted mansion atop Tempest Mountain to find the lurking fear. I was not alone, for foolhardiness was not then mixed with that love of the grotesque and the terrible which has made my career a series of quests for strange horrors in literature and in life. Wi...
- End: ove and below the ground; the embodiment of all the snarling chaos and grinning fear that lurk behind life. It had looked at me as it died, and its eyes had the same odd quality that marked those other eyes which had stared at me underground and excited cloudy recollections. One eye was blue, the other brown. They w...

## Heading Examples

- L11: _1. The Shadow on the Chimney_
- L218: _2. A Passer in the Storm_
- L420: _3. What the Red Glare Meant_
- L623: _4. The Horror in the Eyes_
