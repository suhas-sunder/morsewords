# Pilot write batch 12

Controlled first-time processing pass for the exact raw-only books selected by pilot dry-run batch 12.

## Totals

- Selected: 20
- First-time processed: 20
- Skipped: 0
- Unresolved-source generated left untouched: 11

## Accepted Exclusion Count Clarification

- Dry-run accepted/corrected/verified exclusion count: 222
- Known duplicate/manual/boundary exclusions left unprocessed: the-wind-in-the-willows, the-two-magics-the-turn-of-the-screw-covering-end, the-works-of-edgar-allan-poe
- Selected books intersecting accepted exclusions: none
- Note: This write pass uses only the exact selected list from pilot-dry-run-12.json. Known duplicate/manual/boundary exclusions and unresolved-source generated books remain untouched.

## Unresolved-source generated books left untouched

- a-princess-of-mars: Left untouched because no exact raw source was safely resolved from temp-books for this dry-run.
- doctor-dolittle: Left untouched because no exact raw source was safely resolved from temp-books for this dry-run.
- heidi: Left untouched because no exact raw source was safely resolved from temp-books for this dry-run.
- jabberwocky: Left untouched because no exact raw source was safely resolved from temp-books for this dry-run.
- nights-with-uncle-remus: Left untouched because no exact raw source was safely resolved from temp-books for this dry-run.
- peter-pan: Left untouched because no exact raw source was safely resolved from temp-books for this dry-run.
- tarzan-of-the-apes: Left untouched because no exact raw source was safely resolved from temp-books for this dry-run.
- the-great-gatsby: Left untouched because no exact raw source was safely resolved from temp-books for this dry-run.
- the-picture-of-dorian-gray: Left untouched because no exact raw source was safely resolved from temp-books for this dry-run.
- the-thirty-nine-steps: Left untouched because no exact raw source was safely resolved from temp-books for this dry-run.
- wood-folk-at-school: Left untouched because no exact raw source was safely resolved from temp-books for this dry-run.

## Books

### ole-luk-oie-the-dream-god

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/OLE-LUK-OIE THE DREAM GOD.txt
- Expected/generated title: Ole-Luk-Oie, the Dream-God / Ole-Luk-Oie, the Dream-God
- Expected/generated author: H. C. Andersen / H. C. Andersen
- Author evidence: Gutenberg Author line - Author: H. C. Andersen
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 86 - start at first readable prose after source/title/byline wrapper: THERE is nobody in the whole world who knows so many stories as; write pass starts at first selected/default section
- End boundary: cleaned line 550 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: Ole-Luk-Oie, the Dream-God (3951 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run cleanup risk: illustration captions/placeholders must be removed from default playback; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: illustration captions/placeholders detected

All sections:

- chapter-001: Ole-Luk-Oie, the Dream-God (3951 words)

Supporting snippets:

- Title: OLE-LUK-OIE THE DREAM GOD
- Author: Author: H. C. Andersen
- Start: THERE is nobody in the whole world who knows so many stories as Ole-Luk-Oie, or who can relate them so nicely. In the evening while the children are seated at the tea table or in their little chairs, very softly he comes up the stairs, for he walks in his soc
- End: ery instructive," murmured the great-grandfather's portrait. "It is useful sometimes to express an opinion." So he was quite satisfied. These are some of the doings and sayings of Ole-Luk-Oie. I hope he may visit you himself this evening and relate some more.

### clever-hans

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/CLEVER HANS.txt
- Expected/generated title: Clever Hans / Clever Hans
- Expected/generated author: Jacob Grimm; Wilhelm Grimm / Jacob Grimm; Wilhelm Grimm
- Author evidence: Gutenberg Author line - Author: Jacob Grimm; Wilhelm Grimm
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 9 - start at first readable prose after source/title/byline wrapper: The mother of Hans said; write pass starts at first selected/default section
- End boundary: cleaned line 92 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: Clever Hans (906 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: Clever Hans (906 words)

Supporting snippets:

- Title: CLEVER HANS
- Author: Author: Jacob Grimm; Wilhelm Grimm
- Start: The mother of Hans said: Whither away, Hans? Hans answered: To Gretel. Behave well, Hans. Oh, I ll behave well. Goodbye, mother. Goodbye, Hans. Hans comes to Gretel. Good day, Gretel. Good day, Hans. What do you bring that is good? I bring nothi
- End: ave cast friendly eyes on her.’ ‘Never mind, will do better.’ Hans went into the stable, cut out all the calves’ and sheep’s eyes, and threw them in Gretel’s face. Then Gretel became angry, tore herself loose and ran away, and was no longer the bride of Hans.

### the-fisherman-and-his-wife

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE FISHERMAN AND HIS WIFE.txt
- Expected/generated title: The Fisherman and His Wife / The Fisherman and His Wife
- Expected/generated author: Jacob Grimm; Wilhelm Grimm / Jacob Grimm; Wilhelm Grimm
- Author evidence: Gutenberg Author line - Author: Jacob Grimm; Wilhelm Grimm
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 9 - start at first readable prose after source/title/byline wrapper: There was once a fisherman who lived with his wife in a pigsty; write pass starts at first selected/default section
- End boundary: cleaned line 205 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: The Fisherman and His Wife (2106 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: The Fisherman and His Wife (2106 words)

Supporting snippets:

- Title: THE FISHERMAN AND HIS WIFE
- Author: Author: Jacob Grimm; Wilhelm Grimm
- Start: There was once a fisherman who lived with his wife in a pigsty, close by the seaside. The fisherman used to go out all day long a-fishing; and one day, as he sat on the shore with his rod, looking at the sparkling waves and watching his line, all on a sudden h
- End: l Will have her own will, And hath sent me to beg a boon of thee!’ ‘What does she want now?’ said the fish. ‘Ah!’ said he, ‘she wants to be lord of the sun and moon.’ ‘Go home,’ said the fish, ‘to your pigsty again.’ And there they live to this very day.

### the-story-of-the-old-man-who-made-withered-trees-to-flower

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE STORY OF THE OLD MAN WHO MADE WITHERED TREES TO FLOWER.txt
- Expected/generated title: The Story of the Old Man Who Made Withered Trees to Flower / The Story of the Old Man Who Made Withered Trees to Flower
- Expected/generated author: Yei Theodora Ozaki / Yei Theodora Ozaki
- Author evidence: Gutenberg Author line - Author: Yei Theodora Ozaki
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 13 - start at first readable prose after source/title/byline wrapper: Long, long ago there lived an old man and his wife; write pass starts at first selected/default section
- End boundary: cleaned line 294 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: The Story of the Old Man Who Made Withered Trees to Flower (2754 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run cleanup risk: illustration captions/placeholders must be removed from default playback; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: illustration captions/placeholders detected

All sections:

- chapter-001: The Story of the Old Man Who Made Withered Trees to Flower (2754 words)

Supporting snippets:

- Title: THE STORY OF THE OLD MAN WHO MADE WITHERED TREES TO FLOWER
- Author: Author: Yei Theodora Ozaki
- Start: Long, long ago there lived an old man and his wife who supported themselves by cultivating a small plot of land. Their life had been a very happy and peaceful one save for one great sorrow, and this was they had no child. Their only pet was a dog named Shiro,
- End: , however, with the treasure of gold coins which Shiro had found for him, and with all the gold and the silver which the Daimio had showered on him, became a rich and prosperous man in his old age, and lived a long and happy life, beloved and respected by all.

### the-story-of-urashima-taro-the-fisher-lad

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE STORY OF URASHIMA TARO, THE FISHER LAD.txt
- Expected/generated title: The Story of Urashima Taro, the Fisher Lad / The Story of Urashima Taro, the Fisher Lad
- Expected/generated author: Yei Theodora Ozaki / Yei Theodora Ozaki
- Author evidence: Gutenberg Author line - Author: Yei Theodora Ozaki
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 13 - start at first readable prose after source/title/byline wrapper: Long, long ago in the province of Tango; write pass starts at first selected/default section
- End boundary: cleaned line 474 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: The Story of Urashima Taro, the Fisher Lad (4251 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run cleanup risk: illustration captions/placeholders must be removed from default playback; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: illustration captions/placeholders detected

All sections:

- chapter-001: The Story of Urashima Taro, the Fisher Lad (4251 words)

Supporting snippets:

- Title: THE STORY OF URASHIMA TARO, THE FISHER LAD
- Author: Author: Yei Theodora Ozaki
- Start: Long, long ago in the province of Tango there lived on the shore of Japan in the little fishing village of Mizu-no-ye a young fisherman named Urashima Taro. His father had been a fisherman before him, and his skill had more than doubly descended to his son, fo
- End: because of his disobedience he could never return to the Sea King’s realm or the lovely Princess beyond the sea. Little children, never be disobedient to those who are wiser than you for disobedience was the beginning of all the miseries and sorrows of life.

### the-story-of-the-man-who-did-not-wish-to-die

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE STORY OF THE MAN WHO DID NOT WISH TO DIE.txt
- Expected/generated title: The Story of the Man Who Did Not Wish to Die / The Story of the Man Who Did Not Wish to Die
- Expected/generated author: Yei Theodora Ozaki / Yei Theodora Ozaki
- Author evidence: Gutenberg Author line - Author: Yei Theodora Ozaki
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 13 - start at first readable prose after source/title/byline wrapper: Long, long ago there lived a man called Sentaro; write pass starts at first selected/default section
- End boundary: cleaned line 280 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: The Story of the Man Who Did Not Wish to Die (2620 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run cleanup risk: illustration captions/placeholders must be removed from default playback; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: illustration captions/placeholders detected

All sections:

- chapter-001: The Story of the Man Who Did Not Wish to Die (2620 words)

Supporting snippets:

- Title: THE STORY OF THE MAN WHO DID NOT WISH TO DIE
- Author: Author: Yei Theodora Ozaki
- Start: Long, long ago there lived a man called Sentaro. His surname meant Millionaire, but although he was not so rich as all that, he was still very far removed from being poor. He had inherited a small fortune from his father and lived on this, spending his time
- End: d Sentaro took the lesson to heart. With the book in his hand he returned to his old home, and giving up all his old vain wishes, tried to live a good and useful life and to observe the lessons taught him in the book, and he and his house prospered henceforth.

### the-happy-hunter-and-the-skillful-fisher

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE HAPPY HUNTER AND THE SKILLFUL FISHER.txt
- Expected/generated title: The Happy Hunter and the Skillful Fisher / The Happy Hunter and the Skillful Fisher
- Expected/generated author: Yei Theodora Ozaki / Yei Theodora Ozaki
- Author evidence: Gutenberg Author line - Author: Yei Theodora Ozaki
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 13 - start at first readable prose after source/title/byline wrapper: Long, long ago Japan was governed by Hohodemi; write pass starts at first selected/default section
- End boundary: cleaned line 631 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: The Happy Hunter and the Skillful Fisher (6317 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run cleanup risk: illustration captions/placeholders must be removed from default playback; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: illustration captions/placeholders detected

All sections:

- chapter-001: The Happy Hunter and the Skillful Fisher (6317 words)

Supporting snippets:

- Title: THE HAPPY HUNTER AND THE SKILLFUL FISHER
- Author: Author: Yei Theodora Ozaki
- Start: Long, long ago Japan was governed by Hohodemi, the fourth Mikoto (or Augustness) in descent from the illustrious Amaterasu, the Sun Goddess. He was not only as handsome as his ancestress was beautiful, but he was also very strong and brave, and was famous for
- End: ong, long time. Above all the treasures in his house he prized the wonderful Jewels of the Flow and Ebb of the Tide which had been given him by Ryn Jin, the Dragon King of the Sea. This is the congratulatory ending of the Happy Hunter and the Skillful Fisher.

### the-conceited-apple-branch

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE CONCEITED APPLE BRANCH.txt
- Expected/generated title: The Conceited Apple Branch / The Conceited Apple Branch
- Expected/generated author: H. C. Andersen / H. C. Andersen
- Author evidence: Gutenberg Author line - Author: H. C. Andersen
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 86 - start at first readable prose after source/title/byline wrapper: IT WAS the month of May; write pass starts at first selected/default section
- End boundary: cleaned line 221 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: The Conceited Apple Branch (1341 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run cleanup risk: illustration captions/placeholders must be removed from default playback; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: illustration captions/placeholders detected

All sections:

- chapter-001: The Conceited Apple Branch (1341 words)

Supporting snippets:

- Title: THE CONCEITED APPLE BRANCH
- Author: Author: H. C. Andersen
- Start: IT WAS the month of May. The wind still blew cold, but from bush and tree, field and flower, came the welcome sound, "Spring is come." Wild flowers in profusion covered the hedges. Under the little apple tree Spring seemed busy, and he told his tale from one
- End: ry one admires the beauty of the apple bough, but this humble flower has been endowed appearance both are children of the realms of beauty." Then the sunbeam kissed both the lowly flower and the blooming apple branch, upon whose leaves appeared a rosy blush.

### the-darning-needle

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE DARNING-NEEDLE.txt
- Expected/generated title: The Darning-Needle / The Darning-Needle
- Expected/generated author: H. C. Andersen / H. C. Andersen
- Author evidence: Gutenberg Author line - Author: H. C. Andersen
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 86 - start at first readable prose after source/title/byline wrapper: THERE was once a Darning-needle; write pass starts at first selected/default section
- End boundary: cleaned line 232 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: The Darning-Needle (1344 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run cleanup risk: illustration captions/placeholders must be removed from default playback; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: illustration captions/placeholders detected

All sections:

- chapter-001: The Darning-Needle (1344 words)

Supporting snippets:

- Title: THE DARNING-NEEDLE
- Author: Author: H. C. Andersen
- Start: THERE was once a Darning-needle who thought herself so fine that she came at last to believe that she was fit for embroidery. "Mind now that you hold me fast," she said to the Fingers that took her up. "Pray don't lose me. If I should fall on the ground I sho
- End: . "Mercy, what a crushing weight!" said the Darning-needle. "I'm growing seasick, after all. I'm going to break!" But she was not sick, and she did not break, though the wagon wheels rolled over her. She lay at full length in the road, and there let her lie.

### the-greenies

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE GREENIES.txt
- Expected/generated title: The Greenies / The Greenies
- Expected/generated author: H. C. Andersen / H. C. Andersen
- Author evidence: Gutenberg Author line - Author: H. C. Andersen
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 86 - start at first readable prose after source/title/byline wrapper: A ROSE TREE stood in the window; write pass starts at first selected/default section
- End boundary: cleaned line 143 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: The Greenies (726 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run cleanup risk: illustration captions/placeholders must be removed from default playback; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: illustration captions/placeholders detected

All sections:

- chapter-001: The Greenies (726 words)

Supporting snippets:

- Title: THE GREENIES
- Author: Author: H. C. Andersen
- Start: A ROSE TREE stood in the window. But a little while ago it had been green and fresh, and now it looked sickly--it was in poor health, no doubt. A whole regiment was quartered on it and was eating it up; yet, notwithstanding this seeming greediness, the regimen
- End: han I can about (I will not say the name) the little green things of the rosebush. "Plant lice!" said Dame Fairytale. One must call things by their right names. And if one may not do so always, one must at least have the privilege of doing so in a fairy tale.

### the-loving-pair

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE LOVING PAIR.txt
- Expected/generated title: The Loving Pair / The Loving Pair
- Expected/generated author: H. C. Andersen / H. C. Andersen
- Author evidence: Gutenberg Author line - Author: H. C. Andersen
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 86 - start at first readable prose after source/title/byline wrapper: A WHIPPING Top and a Ball lay close together; write pass starts at first selected/default section
- End boundary: cleaned line 175 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: The Loving Pair (915 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run cleanup risk: illustration captions/placeholders must be removed from default playback; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: illustration captions/placeholders detected

All sections:

- chapter-001: The Loving Pair (915 words)

Supporting snippets:

- Title: THE LOVING PAIR
- Author: Author: H. C. Andersen
- Start: A WHIPPING Top and a Ball lay close together in a drawer among other playthings. One day the Top said to the Ball, "Since we are living so much together, why should we not be lovers?" But the Ball, being made of morocco leather, thought herself a very high-br
- End: eard of the Ball. And the Top never spoke again of his old love--the feeling must have passed away. And it is not strange, when the object of it has lain five years in a gutter, and been drenched through and through, and when one meets her again in a dustbin.

### little-ida-s-flowers

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/LITTLE IDA'S FLOWERS.txt
- Expected/generated title: Little Ida's Flowers / Little Ida's Flowers
- Expected/generated author: H. C. Andersen / H. C. Andersen
- Author evidence: Gutenberg Author line - Author: H. C. Andersen
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 86 - start at first readable prose after source/title/byline wrapper: "MY POOR flowers are quite faded; write pass starts at first selected/default section
- End boundary: cleaned line 349 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: Little Ida's Flowers (2661 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run cleanup risk: illustration captions/placeholders must be removed from default playback; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: illustration captions/placeholders detected

All sections:

- chapter-001: Little Ida's Flowers (2661 words)

Supporting snippets:

- Title: LITTLE IDA'S FLOWERS
- Author: Author: H. C. Andersen
- Start: MY POOR flowers are quite faded!" said little Ida. "Only yesterday evening they were so pretty, and now all the leaves are drooping. Why do they do that?" she asked of the student, who sat on the sofa. He was a great favorite with her, because he used to tell
- End: rying the dead flowers in their pretty coffin. A little grave was dug for them in the garden. Ida first kissed the flowers and then laid them in the earth, and Adolphe and Gustave shot with their crossbows over the grave, for they had neither guns nor cannons.

### the-roses-and-the-sparrows

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE ROSES AND THE SPARROWS.txt
- Expected/generated title: The Roses and the Sparrows / The Roses and the Sparrows
- Expected/generated author: H. C. Andersen / H. C. Andersen
- Author evidence: Gutenberg Author line - Author: H. C. Andersen
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 86 - start at first readable prose after source/title/byline wrapper: IT really appeared as if something very important were going on by the; write pass starts at first selected/default section
- End boundary: cleaned line 470 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: The Roses and the Sparrows (3889 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run cleanup risk: illustration captions/placeholders must be removed from default playback; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: illustration captions/placeholders detected

All sections:

- chapter-001: The Roses and the Sparrows (3889 words)

Supporting snippets:

- Title: THE ROSES AND THE SPARROWS
- Author: Author: H. C. Andersen
- Start: IT really appeared as if something very important were going on by the duck pond, but this was not the case. A few minutes before, all the ducks had been resting on the water or standing on their heads--for that they can do--and then they all swam in a bustle
- End: ! there's a withered leaf. I can see it quite plainly." And they pecked at the leaf till it fell, but the rosebush continued fresher and greener than ever. The roses bloomed in the sunshine on Thorwaldsen's grave and thus became linked with his immortal name.

### the-steadfast-tin-soldier

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE STEADFAST TIN SOLDIER.txt
- Expected/generated title: The Steadfast Tin Soldier / The Steadfast Tin Soldier
- Expected/generated author: H. C. Andersen / H. C. Andersen
- Author evidence: Gutenberg Author line - Author: H. C. Andersen
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 86 - start at first readable prose after source/title/byline wrapper: THERE were once five and twenty tin soldiers; write pass starts at first selected/default section
- End boundary: cleaned line 256 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: The Steadfast Tin Soldier (1691 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run cleanup risk: illustration captions/placeholders must be removed from default playback; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: illustration captions/placeholders detected

All sections:

- chapter-001: The Steadfast Tin Soldier (1691 words)

Supporting snippets:

- Title: THE STEADFAST TIN SOLDIER
- Author: Author: H. C. Andersen
- Start: THERE were once five and twenty tin soldiers. They were brothers, for they had all been made out of the same old tin spoon. They all shouldered their bayonets, held themselves upright, and looked straight before them. Their uniforms were very smart-looking--re
- End: ldier, flashed up in a flame, and was gone! The Tin Soldier melted into a lump; and in the ashes the maid found him next day, in the shape of a little tin heart, while of the Dancer nothing remained save the tinsel rose, and that was burned as black as a coal.

### shock-tactics

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/SHOCK TACTICS.txt
- Expected/generated title: Shock Tactics / Shock Tactics
- Expected/generated author: Saki / Saki
- Author evidence: Gutenberg Author line - Author: Saki
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 29 - start at first readable prose after source/title/byline wrapper: On a late spring afternoon Ella McCarthy; write pass starts at first selected/default section
- End boundary: cleaned line 248 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: Shock Tactics (1766 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: contents or list material must not enter default playback; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: Shock Tactics (1766 words)

Supporting snippets:

- Title: SHOCK TACTICS
- Author: Author: Saki
- Start: On a late spring afternoon Ella McCarthy sat on a green-painted chair in Kensington Gardens, staring listlessly at an uninteresting stretch of park landscape, that blossomed suddenly into tropical radiance as an expected figure appeared in the middle distance.
- End: he knew it. His mother was conscious of the fact that she would look rather ridiculous if the story got about. She was willing to pay hush-money. “I’ll never open your letters again,” she promised. And Clovis has no more devoted slave than Bertie Heasant.

### canossa

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/CANOSSA.txt
- Expected/generated title: Canossa / Canossa
- Expected/generated author: Saki / Saki
- Author evidence: Gutenberg Author line - Author: Saki
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 29 - start at first readable prose after source/title/byline wrapper: Demosthenes Platterbaff; write pass starts at first selected/default section
- End boundary: cleaned line 205 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: Canossa (1423 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: Canossa (1423 words)

Supporting snippets:

- Title: CANOSSA
- Author: Author: Saki
- Start: Demosthenes Platterbaff, the eminent Unrest Inducer, stood on his trial for a serious offence, and the eyes of the political world were focussed on the jury. The offence, it should be stated, was serious for the Government rather than for the prisoner. He ha
- End: offence at the fact of Cabinet Ministers having personally acted as strike-breakers, and even the release of Platterbaff failed to pacify them. The seat was lost, but Ministers had scored a moral victory. They had shown that they knew when and how to yield.

### the-oversight

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE OVERSIGHT.txt
- Expected/generated title: The Oversight / The Oversight
- Expected/generated author: Saki / Saki
- Author evidence: Gutenberg Author line - Author: Saki
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 29 - start at first readable prose after source/title/byline wrapper: “It’s like a Chinese puzzle; write pass starts at first selected/default section
- End boundary: cleaned line 218 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: The Oversight (1710 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: The Oversight (1710 words)

Supporting snippets:

- Title: THE OVERSIGHT
- Author: Author: Saki
- Start: It s like a Chinese puzzle, said Lady Prowche resentfully, staring at a scribbled list of names that spread over two or three loose sheets of notepaper on her writing-table. Most of the names had a pencil mark running through them. What is like a Chinese p
- End: t one could violently disagree about—religion, politics, vivisection, the Derby decision, the Falconer Report; what else was there left to quarrel about?” “My dear, we were fools not to have thought of it. One of them was Pro-Greek and the other Pro-Bulgar.”

### the-penance

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE PENANCE.txt
- Expected/generated title: The Penance / The Penance
- Expected/generated author: Saki / Saki
- Author evidence: Gutenberg Author line - Author: Saki
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 29 - start at first readable prose after source/title/byline wrapper: Octavian Ruttle; write pass starts at first selected/default section
- End boundary: cleaned line 251 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: The Penance (2174 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: contents or list material must not enter default playback; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: The Penance (2174 words)

Supporting snippets:

- Title: THE PENANCE
- Author: Author: Saki
- Start: Octavian Ruttle was one of those lively cheerful individuals on whom amiability had set its unmistakable stamp, and, like most of his kind, his soul s peace depended in large measure on the unstinted approval of his fellows. In hunting to death a small tabby
- End: he formula of his penance he felt certain that three pairs of solemn eyes were watching his moth-shared vigil. And the next morning his eyes were gladdened by a sheet of copy-book paper lying beside the blank wall, on which was written the message “Un-Beast.”

### mark

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/MARK.txt
- Expected/generated title: Mark / Mark
- Expected/generated author: Saki / Saki
- Author evidence: Gutenberg Author line - Author: Saki
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 29 - start at first readable prose after source/title/byline wrapper: Augustus Mellowkent was a novelist; write pass starts at first selected/default section
- End boundary: cleaned line 208 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: Mark (1680 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: Mark (1680 words)

Supporting snippets:

- Title: MARK
- Author: Author: Saki
- Start: Augustus Mellowkent was a novelist with a future; that is to say, a limited but increasing number of people read his books, and there seemed good reason to suppose that if he steadily continued to turn out novels year by year a progressively increasing circle
- End: ed remark about having no time to waste on monkey-talk, he gathered up his slighted volume and departed. He made no audible reply to Mellowkent’s cheerful “Good morning,” but the latter fancied that a look of respectful hatred flickered in the cold grey eyes.

### quail-seed

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/QUAIL SEED.txt
- Expected/generated title: Quail Seed / Quail Seed
- Expected/generated author: Saki / Saki
- Author evidence: Gutenberg Author line - Author: Saki
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 29 - start at first readable prose after source/title/byline wrapper: “The outlook is not encouraging for us smaller businesses; write pass starts at first selected/default section
- End boundary: cleaned line 266 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: Quail Seed (2210 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run collection-title risk: ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

All sections:

- chapter-001: Quail Seed (2210 words)

Supporting snippets:

- Title: QUAIL SEED
- Author: Author: Saki
- Start: The outlook is not encouraging for us smaller businesses, said Mr. Scarrick to the artist and his sister, who had taken rooms over his suburban grocery store. These big concerns are offering all sorts of attractions to the shopping public which we couldn t
- End: iently,” said the grocer. “We enjoyed the fun of it,” said the artist modestly, “and as for the model, it was a welcome variation on posing for hours for ‘The Lost Hylas’.” “At any rate,” said the grocer, “I insist on paying for the hire of the black beard.”

## Future-batch rule

- valid generated readable content
- correct generated title
- correct author metadata or documented unresolved-author policy
- no duplicate generated work under a slightly different slug unless intentionally documented
- first default section from real readable content
- all main readable sections included by default
- meaningful source-based segmentation
- valid book-specific startup preview
- no SOS Help!
- no generic preview fallback
- no title/TOC/source/license/contributor/transcriber/byline material as default playback
- selected/default source order begins from the first selected/default section

## Later-phase requirements

- after all books are processed, run an independent second-pass audit using a different strategy
- after books and second-pass audit, add original non-spoiler 300-500+ word SEO summaries for each accepted book page
- after summaries, perform full site SEO/meta review using GSC data and route-level intent
- after books/SEO, run a focused rage-click UX pass for /audio, /practice, homepage, and related utility pages
- final cleanup should remove temporary audit scripts/reports and code bloat only after everything is stable
