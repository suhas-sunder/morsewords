# Pilot Dry Run 16: the-wolves-of-cernogratz

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE WOLVES OF CERNOGRATZ.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Wolves of Cernogratz
- Title evidence: source body heading line 63 - THE WOLVES OF CERNOGRATZ
- Expected author: Saki
- Author evidence: Gutenberg Author line line 13 - Author: Saki
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: The Wolves of Cernogratz
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: “Are there any old legends attached to the castle?” asked Conrad of his
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: ?Are there any old legends attached to the castle?? asked Conrad of his sister. Conrad was a prosperous Hamburg merchant, but he was the one poetically-dispositioned member of an eminently practical family. The Baroness Gruebel shrugged her plump shoulders. ?There are always legends hanging about these old places. T...
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

- Title: THE WOLVES OF CERNOGRATZ
- Author: Author: Saki
- Start: The Wolves of Cernogratz ?Are there any old legends attached to the castle?? asked Conrad of his sister. Conrad was a prosperous Hamburg merchant, but he was the one poetically-dispositioned member of an eminently practical family. The Baroness Gruebel shrugged her plump shoulders. ?There are always legends hanging about these old places. T...
- End: ... the cold of the open window, too, which caused the heart failure that made the doctor’s ministrations unnecessary for the old Fraulein. But the notice in the newspapers looked very well— “On December 29th, at Schloss Cernogratz, Amalie von Cernogratz, for many years the valued friend of Baron and Baroness Gruebel.”

## Heading Examples

- Source tale heading: THE WOLVES OF CERNOGRATZ
- First readable prose: ?Are there any old legends attached to the castle?? asked Conrad of his
