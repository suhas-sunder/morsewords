# Pilot Dry Run 15: the-bull

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE BULL.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Bull
- Title evidence: source body heading line 63 - THE BULL
- Expected author: Saki
- Author evidence: Gutenberg Author line line 13 - Author: Saki
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: The Bull
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: Tom Yorkfield had always regarded his half-brother, Laurence, with a lazy
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: Tom Yorkfield had always regarded his half-brother, Laurence, with a lazy instinct of dislike, toned down, as years went on, to a tolerant feeling of indifference. There was nothing very tangible to dislike him for; he was just a blood-relation, with whom Tom had no single taste or interest in common, and with whom,...
- Duplicate/near-duplicate slug check: No exact or close generated slug match detected among current generated books.
- Current status: needs first-time controlled processing
- Recommendation for next pass: controlled first-time processing

## Cleanup Risks

- title page, byline, publication, or copyright material appears before body content
- Project Gutenberg/source/license material must be removed

## Title/Default-Start Risks

- write pass must keep title/byline material out of default playback

## Segmentation Risks

- structure audit recommends processing with warnings; write pass must verify boundaries directly from raw source
- dry-run filtered at least one detector-selected wrapper heading; write pass must keep wrapper/source material out of playable sections

## Author Metadata Risks

- None.

## Collection-Title Leakage Risks

- ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback

## Illustration/Page/Footnote Risks

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: THE BULL
- Author: Author: Saki
- Start: The Bull Tom Yorkfield had always regarded his half-brother, Laurence, with a lazy instinct of dislike, toned down, as years went on, to a tolerant feeling of indifference. There was nothing very tangible to dislike him for; he was just a blood-relation, with whom Tom had no single taste or interest in common, and with whom,...
- End: ...er toss a man over one shoulder and catch him a jab in the ribs before he had fallen on the other side. That was Clover Fairy’s noteworthy achievement, which could never be taken away from him. Laurence continues to be popular as an animal artist, but his subjects are always kittens or fawns or lambkins—never bulls.

## Heading Examples

- Source tale heading: THE BULL
- First readable prose: Tom Yorkfield had always regarded his half-brother, Laurence, with a lazy
