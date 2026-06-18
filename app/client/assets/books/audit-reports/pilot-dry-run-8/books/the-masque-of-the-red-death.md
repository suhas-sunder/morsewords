# Pilot Dry Run 8: the-masque-of-the-red-death

- Candidate type: raw-only
- Source file used: `app/client/assets/temp-books/The Masque of the Red Death.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: review-only raw source; no generated publish/restricted status exists yet
- Expected title: The Masque of the Red Death
- Title evidence: Gutenberg Title line line 11 - Title: The Masque of the Red Death
- Expected author: Edgar Allan Poe
- Author evidence: Gutenberg Author line line 13 - Author: Edgar Allan Poe
- Apparent work type: standalone book
- Detected structural convention: isolated titled sections; dry-run treats non-body wrapper headings as cleanup artifacts
- Structure confidence: low
- Meaningful headings exist: yes
- Expected first default section: The Masque of the Red Death
- Expected start boundary: start at cleaned-body line 1: The Masque of the Red Death
- Expected end boundary: end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes
- Expected sectioning strategy: use one contiguous story section after excluding title/byline/source-site/transcriber/footer wrapper lines; never replace meaningful headings with vague Part 1 / Part 2 chunks
- Expected default-readable sections: all 1 planned isolated titled sections; dry-run treats non-body wrapper headings as cleanup artifacts sections unless a future write inspection demotes true front/back matter
- Likely section count: 1
- Expected preview start: The ?Red Death? had long devastated the country. No pestilence had ever been so fatal, or so hideous. Blood was its Avatar and its seal?the redness and the horror of blood. There were sharp pains, and sudden dizziness, and then profuse bleeding at the pores, with dissolution. The scarlet stains upon the body and esp...
- Current status: needs first-time controlled processing
- Recommendation for next pass: controlled first-time processing

## Cleanup Risks

- title page, byline, publication, or copyright material appears before body content
- Project Gutenberg/source/license material must be removed
- contributor or transcriber notes must be removed or preserved only as non-default

## Title/Default-Start Risks

- write pass must keep title/byline material out of default playback
- first default section is meaningful but should be verified manually in write pass

## Author Metadata Risks

- None.

## Collection-Title Leakage Risks

- None.

## Illustration/Page/Footnote Risks

- no obvious illustration/page-marker/footnote risk in snippets

## Supporting Snippets

- Title: Title: The Masque of the Red Death
- Author: Author: Edgar Allan Poe
- Start: The Masque of the Red Death The ?Red Death? had long devastated the country. No pestilence had ever been so fatal, or so hideous. Blood was its Avatar and its seal?the redness and the horror of blood. There were sharp pains, and sudden dizziness, and then profuse bleeding at the pores, with dissolution. The scarlet stains upon the body and esp...
- End: nd corpse-like mask, which they handled with so violent a rudeness, untenanted by any tangible form. And now was acknowledged the presence of the Red Death. He had come like a thief in the night. And one by one dropped the revellers in the blood-bedewed halls of their revel, and died each in the despairing posture o...

## Heading Examples

- L1: The Masque of the Red Death
