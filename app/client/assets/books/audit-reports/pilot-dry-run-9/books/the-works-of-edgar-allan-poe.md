# Pilot Dry Run 9: the-works-of-edgar-allan-poe

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/The Works of Edgar Allan Poe.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Works of Edgar Allan Poe ? Volume 2
- Title evidence: Gutenberg Title line line 11 - Title: The Works of Edgar Allan Poe ? Volume 2
- Expected author: Edgar Allan Poe
- Author evidence: Gutenberg Author line line 13 - Author: Edgar Allan Poe
- Apparent work type: story collection
- Detected structural convention: story or titled-section headings
- Structure confidence: high
- Meaningful headings exist: yes
- Expected first default section: THE THOUSAND-AND-SECOND TALE OF SCHEHERAZADE
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at cleaned-body line 861: THE THOUSAND-AND-SECOND TALE OF SCHEHERAZADE
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use All-caps story or titled-section heading boundaries; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 24 planned story or titled-section headings sections unless a future write inspection demotes true front/back matter
- Likely section count: 24
- Expected preview start: Truth is stranger than fiction.?_Old Saying_ Having had occasion, lately, in the course of some Oriental investigations, to consult the Tellmenow Isits?ornot, a work which (like the Zohar of Simeon Jochaides) is scarcely known at all, even in Europe; and which has never been quoted, to my knowledge, by any American?...
- Duplicate/near-duplicate slug check: No exact or close generated slug match detected among current generated books.
- Current status: needs first-time controlled processing
- Recommendation for next pass: controlled first-time processing

## Cleanup Risks

- title page, byline, publication, or copyright material appears before body content
- contents or list material must not enter default playback
- Project Gutenberg/source/license material must be removed

## Title/Default-Start Risks

- write pass must keep title/byline material out of default playback
- first default section is meaningful but should be verified manually in write pass

## Segmentation Risks

- structure audit recommends processing with warnings; write pass must verify boundaries directly from raw source

## Author Metadata Risks

- None.

## Collection-Title Leakage Risks

- ensure the generated title stays the collection title and individual story titles become sections

## Illustration/Page/Footnote Risks

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: Title: The Works of Edgar Allan Poe ? Volume 2
- Author: Author: Edgar Allan Poe
- Start: THE THOUSAND-AND-SECOND TALE OF SCHEHERAZADE Truth is stranger than fiction.?_Old Saying_ Having had occasion, lately, in the course of some Oriental investigations, to consult the Tellmenow Isits?ornot, a work which (like the Zohar of Simeon Jochaides) is scarcely known at all, even in Europe; and which has never been quoted, to my knowledge, by any American?...
- End: y repose. There will be frequent hours in which I shall need, too, the sympathy of the poetic in what I have done. Let me seek, then, a spot not far from a populous city?whose vicinity, also, will best enable me to execute my plans.? In search of a suitable place so situated, Ellison travelled for several years, and...

## Heading Examples

- L861: THE THOUSAND-AND-SECOND TALE OF SCHEHERAZADE
- L1479: A DESCENT INTO THE MAELSTROM.
- L2160: VON KEMPELEN AND HIS DISCOVERY
- L2440: MESMERIC REVELATION
- L2897: THE FACTS IN THE CASE OF M. VALDEMAR
- L2971: MY DEAR P??,
