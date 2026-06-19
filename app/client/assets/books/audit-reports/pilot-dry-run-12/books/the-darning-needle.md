# Pilot Dry Run 12: the-darning-needle

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/THE DARNING-NEEDLE.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Darning-Needle
- Title evidence: source body heading line 137 - THE DARNING-NEEDLE
- Expected author: H. C. Andersen
- Author evidence: Gutenberg Author line line 13 - Author: H. C. Andersen
- Apparent work type: individual story
- Detected structural convention: single contiguous story section
- Structure confidence: medium
- Meaningful headings exist: yes
- Expected first default section: The Darning-Needle
- Front matter to exclude/preserve non-default: Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional.
- End matter to exclude: Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.
- Expected start boundary: start at first readable prose after source/title/byline wrapper: THERE was once a Darning-needle
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned single contiguous story section sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: THERE was once a Darning-needle who thought herself so fine that she came at last to believe that she was fit for embroidery. "Mind now that you hold me fast," she said to the Fingers that took her up. "Pray don't lose me. If I should fall on the ground I should certainly be lost, I am so fine." "That's more than yo...
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

- Title: THE DARNING-NEEDLE
- Author: Author: H. C. Andersen
- Start: The Darning-Needle THERE was once a Darning-needle who thought herself so fine that she came at last to believe that she was fit for embroidery. "Mind now that you hold me fast," she said to the Fingers that took her up. "Pray don't lose me. If I should fall on the ground I should certainly be lost, I am so fine." "That's more than yo...
- End: that one is something a little more than an ordinary person. My seasickness is all over now. The more genteel and honorable one is, the more one can endure." Crash went the eggshell, as a wagon rolled over both of them. It was a wonder that she did not break. "Mercy, what a crushing weight!" said the Darning-needle....

## Heading Examples

- First readable prose: THERE was once a Darning-needle
