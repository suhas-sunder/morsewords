# Pilot Dry Run 23: the-jilting-of-jane

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE JILTING OF JANE.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only Project Gutenberg source with reuse/source evidence present; no generated publish status exists yet
- Expected title: The Jilting of Jane
- Title evidence: source body heading line 18 - THE JILTING OF JANE
- Expected author: H. G. Wells
- Author evidence: visible title-page author line line 7 - H. G. WELLS
- Expected author/compiler/collector/translator/reteller role: author as identified by the source
- Metadata evidence: visible title-page author line line 7: H. G. WELLS
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: The Jilting of Jane
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg or source-site footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: As I sit writing in my study, I can hear our Jane bumping
- Expected end boundary: end before Project Gutenberg or source-site footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: As I sit writing in my study, I can hear our Jane bumping her way downstairs with a brush and dustpan. She used in the old days to sing hymn tunes, or the British national song for the time being, to these instruments, but latterly she has been silent and even careful over her work. Time was when I prayed with fervo...
- Duplicate/near-duplicate slug check: No exact or close generated slug match detected among current generated books.
- Current status: needs first-time controlled processing
- Recommendation for next pass: controlled first-time processing

## Cleanup Risks

- title page, byline, publication, or copyright material appears before body content
- Project Gutenberg/source/license material must be removed

## Title/Default-Start Risks

- write pass must keep title/byline material out of default playback

## Segmentation Risks

- dry-run filtered at least one detector-selected wrapper heading; write pass must keep wrapper/source material out of playable sections

## Author Metadata Risks

- author did not come from a Gutenberg Author line; verify byline directly

## Collection-Title Leakage Risks

- ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback

## Illustration/Page/Footnote Risks

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: THE JILTING OF JANE
- Author: H. G. WELLS
- Metadata: H. G. WELLS
- Start: The Jilting of Jane As I sit writing in my study, I can hear our Jane bumping her way downstairs with a brush and dustpan. She used in the old days to sing hymn tunes, or the British national song for the time being, to these instruments, but latterly she has been silent and even careful over her work. Time was when I prayed with fervo...
- End: ...one out of Jane’s scrubbing and brush work. Indeed, something passed the other day with the butcher-boy—but that scarcely belongs to this story. However, Jane is young still, and time and change are at work with her. We all have our sorrows, but I do not believe very much in the existence of sorrows that never heal.

## Heading Examples

- Source tale heading: THE JILTING OF JANE
- First readable prose: As I sit writing in my study, I can hear our Jane bumping
