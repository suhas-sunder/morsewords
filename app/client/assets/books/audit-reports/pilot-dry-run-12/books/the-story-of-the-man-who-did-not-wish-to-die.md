# Pilot Dry Run 12: the-story-of-the-man-who-did-not-wish-to-die

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE STORY OF THE MAN WHO DID NOT WISH TO DIE.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Story of the Man Who Did Not Wish to Die
- Title evidence: source body heading line 49 - THE STORY OF THE MAN WHO DID NOT WISH TO DIE
- Expected author: Yei Theodora Ozaki
- Author evidence: Gutenberg Author line line 13 - Author: Yei Theodora Ozaki
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: medium
- Meaningful headings exist: yes
- Expected first default section: The Story of the Man Who Did Not Wish to Die
- Front matter to exclude/preserve non-default: No leading front matter detected before the first selected body section.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: Long, long ago there lived a man called Sentaro
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: Long, long ago there lived a man called Sentaro. His surname meant ?Millionaire,? but although he was not so rich as all that, he was still very far removed from being poor. He had inherited a small fortune from his father and lived on this, spending his time carelessly, without any serious thoughts of work, till he...
- Duplicate/near-duplicate slug check: No exact or close generated slug match detected among current generated books.
- Current status: needs first-time controlled processing
- Recommendation for next pass: controlled first-time processing

## Cleanup Risks

- title page, byline, publication, or copyright material appears before body content
- Project Gutenberg/source/license material must be removed
- contributor or transcriber notes must be removed or preserved only as non-default
- illustration captions/placeholders must be removed from default playback

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

- illustration captions/placeholders detected

## Supporting Snippets

- Title: THE STORY OF THE MAN WHO DID NOT WISH TO DIE
- Author: Author: Yei Theodora Ozaki
- Start: The Story of the Man Who Did Not Wish to Die Long, long ago there lived a man called Sentaro. His surname meant ?Millionaire,? but although he was not so rich as all that, he was still very far removed from being poor. He had inherited a small fortune from his father and lived on this, spending his time carelessly, without any serious thoughts of work, till he...
- End: desires are granted they do not bring happiness.? ?In this book I give you there are many precepts good for you to know?if you study them, you will be guided in the way I have pointed out to you.? The angel disappeared as soon as he had finished speaking, and Sentaro took the lesson to heart. With the book in his ha...

## Heading Examples

- First readable prose: Long, long ago there lived a man called Sentaro
