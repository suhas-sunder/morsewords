# Pilot Dry Run 20: mr-ledbetter-s-vacation

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/MR. LEDBETTER'S VACATION.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: Mr. Ledbetter’s Vacation
- Title evidence: source body heading line 32 - MR. LEDBETTER'S VACATION
- Expected author: H. G. Wells
- Author evidence: Gutenberg Author line line 12 - Author: H. G. Wells
- Expected author/compiler/collector/translator/reteller role: author as identified by the source
- Metadata evidence: Gutenberg Author line line 12: Author: H. G. Wells
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: Mr. Ledbetter’s Vacation
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: My friend, Mr. Ledbetter, is a round-faced little man
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: My friend, Mr. Ledbetter, is a round-faced little man, whose natural mildness of eye is gigantically exaggerated when you catch the beam through his glasses, and whose deep, deliberate voice irritates irritable people. A certain elaborate clearness of enunciation has come with him to his present vicarage from his sc...
- Duplicate/near-duplicate slug check: No exact or close generated slug match detected among current generated books.
- Current status: needs first-time controlled processing
- Recommendation for next pass: controlled first-time processing

## Cleanup Risks

- title page, byline, publication, or copyright material appears before body content
- Project Gutenberg/source/license material must be removed
- contributor or transcriber notes must be removed or preserved only as non-default

## Title/Default-Start Risks

- write pass must keep title/byline material out of default playback

## Segmentation Risks

- structure audit recommends processing with warnings; write pass must verify boundaries directly from raw source

## Author Metadata Risks

- None.

## Collection-Title Leakage Risks

- ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback

## Illustration/Page/Footnote Risks

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: MR. LEDBETTER'S VACATION
- Author: Author: H. G. Wells
- Metadata: Author: H. G. Wells
- Start: Mr. Ledbetter’s Vacation My friend, Mr. Ledbetter, is a round-faced little man, whose natural mildness of eye is gigantically exaggerated when you catch the beam through his glasses, and whose deep, deliberate voice irritates irritable people. A certain elaborate clearness of enunciation has come with him to his present vicarage from his sc...
- End: ...igation to you—a load that I fear I can never fully repay. Although if gratitude...” And so forth. At the end he repeated his request for me to burn the letter. So the remarkable story of Mr. Ledbetter's Vacation ends. That breach with his aunt was not of long duration. The old lady had forgiven him before she died.

## Heading Examples

- Source tale heading: MR. LEDBETTER'S VACATION
- First readable prose: My friend, Mr. Ledbetter, is a round-faced little man
