# Pilot write batch 11

Controlled first-time processing pass for the exact raw-only books selected by pilot dry-run batch 11.

## Totals

- Selected: 20
- First-time processed: 20
- Skipped: 0
- Unresolved-source generated left untouched: 11

## Accepted Exclusion Count Clarification

- Dry-run accepted/corrected/verified exclusion count: 202
- Known duplicate/manual/boundary exclusions left unprocessed: the-wind-in-the-willows, the-two-magics-the-turn-of-the-screw-covering-end, the-works-of-edgar-allan-poe
- Selected books intersecting accepted exclusions: none
- Note: This write pass uses only the exact selected list from pilot-dry-run-11.json. Known duplicate/manual/boundary exclusions and unresolved-source generated books remain untouched.

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

### cool-air

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/Cool air.txt
- Expected/generated title: Cool Air / Cool Air
- Expected/generated author: H. P. Lovecraft / H. P. Lovecraft
- Author evidence: Gutenberg Author line - Author: H. P. Lovecraft
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 15 - start at first readable prose after source/title/byline wrapper: You ask me to explain why I am afraid of a draft of cool air; write pass starts at first selected/default section
- End boundary: cleaned line 345 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: Cool Air (3413 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

First 5 sections:

- chapter-001: Cool Air (3413 words)

Last 5 sections:

- chapter-001: Cool Air (3413 words)

Supporting snippets:

- Title: Cool Air
- Author: Author: H. P. Lovecraft
- Start: You ask me to explain why I am afraid of a draft of cool air; why I shiver more than others upon entering a cold room, and seem nauseated and repelled when the chill of evening creeps through the heat of a mild autumn day. There are those who say I respond to
- End: ldn't stand what he had to do; he had to get me in a strange, dark place, when he minded my letter and nursed me back. And the organs never would work again. It had to be done my way--artificial preservation--_for you see I died that time eighteen years ago_."

### the-dream-of-little-tuk

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/The Dream of Little Tuk.txt
- Expected/generated title: The Dream of Little Tuk / The Dream of Little Tuk
- Expected/generated author: H. C. Andersen / H. C. Andersen
- Author evidence: Gutenberg Author line - Author: H. C. Andersen
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 8 - start at first readable prose after source/title/byline wrapper: Ah! yes, that was little Tuk; write pass starts at first selected/default section
- End boundary: cleaned line 188 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: The Dream of Little Tuk (1892 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

First 5 sections:

- chapter-001: The Dream of Little Tuk (1892 words)

Last 5 sections:

- chapter-001: The Dream of Little Tuk (1892 words)

Supporting snippets:

- Title: THE DREAM OF LITTLE TUK
- Author: Author: H. C. Andersen
- Start: Ah! yes, that was little Tuk: in reality his name was not Tuk, but that was what he called himself before he could speak plain: he meant it for Charles, and it is all well enough if one does but know it. He had now to take care of his little sister Augusta, wh
- End: popped her head in at the door, nodded to him friendly, and said, “Thanks, many thanks, my good child, for your help! May the good ever-loving God fulfil your loveliest dream!” Little Tukey did not at all know what he had dreamed, but the loving God knew it.

### the-false-collar

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/The False Collar.txt
- Expected/generated title: The False Collar / The False Collar
- Expected/generated author: H. C. Andersen / H. C. Andersen
- Author evidence: Gutenberg Author line - Author: H. C. Andersen
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 8 - start at first readable prose after source/title/byline wrapper: There was once a fine gentleman; write pass starts at first selected/default section
- End boundary: cleaned line 104 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: The False Collar (894 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

First 5 sections:

- chapter-001: The False Collar (894 words)

Last 5 sections:

- chapter-001: The False Collar (894 words)

Supporting snippets:

- Title: THE FALSE COLLAR
- Author: Author: H. C. Andersen
- Start: There was once a fine gentleman, all of whose moveables were a boot-jack and a hair-comb: but he had the finest false collars in the world; and it is about one of these collars that we are now to hear a story. It was so old, that it began to think of marriage
- End: n never know if we may not, in the course of time, also come into the rag chest, and be made into white paper, and then have our whole life's history printed on it, even the most secret, and be obliged to run about and tell it ourselves, just like this collar.

### the-naughty-boy

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/The Naughty Boy.txt
- Expected/generated title: The Naughty Boy / The Naughty Boy
- Expected/generated author: H. C. Andersen / H. C. Andersen
- Author evidence: Gutenberg Author line - Author: H. C. Andersen
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 8 - start at first readable prose after source/title/byline wrapper: Along time ago, there lived an old poet; write pass starts at first selected/default section
- End boundary: cleaned line 83 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: The Naughty Boy (835 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

First 5 sections:

- chapter-001: The Naughty Boy (835 words)

Last 5 sections:

- chapter-001: The Naughty Boy (835 words)

Supporting snippets:

- Title: THE NAUGHTY BOY
- Author: Author: H. C. Andersen
- Start: Along time ago, there lived an old poet, a thoroughly kind old poet. As he was sitting one evening in his room, a dreadful storm arose without, and the rain streamed down from heaven; but the old poet sat warm and comfortable in his chimney-corner, where the f
- End: fter everybody. Only think, he shot an arrow once at your old grandmother! But that is a long time ago, and it is all past now; however, a thing of that sort she never forgets. Fie, naughty Cupid! But now you know him, and you know, too, how ill-behaved he is!

### the-red-shoes

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/The Red Shoes.txt
- Expected/generated title: The Red Shoes / The Red Shoes
- Expected/generated author: H. C. Andersen / H. C. Andersen
- Author evidence: Gutenberg Author line - Author: H. C. Andersen
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 8 - start at first readable prose after source/title/byline wrapper: There was once a little girl who was very pretty and delicate; write pass starts at first selected/default section
- End boundary: cleaned line 231 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: The Red Shoes (2235 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

First 5 sections:

- chapter-001: The Red Shoes (2235 words)

Last 5 sections:

- chapter-001: The Red Shoes (2235 words)

Supporting snippets:

- Title: THE RED SHOES
- Author: Author: H. C. Andersen
- Start: There was once a little girl who was very pretty and delicate, but in summer she was forced to run about with bare feet, she was so poor, and in winter wear very large wooden shoes, which made her little insteps quite red, and that looked so dangerous! In the
- End: ounded so sweet and soft! The clear sunshine streamed so warmly through the window into the pew where Karen sat! Her heart was so full of sunshine, peace, and joy, that it broke. Her soul flew on the sunshine to God, and there no one asked after the RED SHOES.

### the-shadow

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/The Shadow.txt
- Expected/generated title: The Shadow / The Shadow
- Expected/generated author: H. C. Andersen / H. C. Andersen
- Author evidence: Gutenberg Author line - Author: H. C. Andersen
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 8 - start at first readable prose after source/title/byline wrapper: It is in the hot lands that the sun burns; write pass starts at first selected/default section
- End boundary: cleaned line 504 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: The Shadow (5019 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

First 5 sections:

- chapter-001: The Shadow (5019 words)

Last 5 sections:

- chapter-001: The Shadow (5019 words)

Supporting snippets:

- Title: THE SHADOW
- Author: Author: H. C. Andersen
- Start: It is in the hot lands that the sun burns, sure enough! there the people become quite a mahogany brown, ay, and in the HOTTEST lands they are burnt to Negroes. But now it was only to the HOT lands that a learned man had come from the cold; there he thought tha
- End: nnons went off with a bum! bum! and the soldiers presented arms. That was a marriage! The princess and the shadow went out on the balcony to show themselves, and get another hurrah! The learned man heard nothing of all this--for they had deprived him of life.

### the-story-of-a-mother

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/The Story of a Mother.txt
- Expected/generated title: The Story of a Mother / The Story of a Mother
- Expected/generated author: H. C. Andersen / H. C. Andersen
- Author evidence: Gutenberg Author line - Author: H. C. Andersen
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 8 - start at first readable prose after source/title/byline wrapper: A mother sat there with her little child; write pass starts at first selected/default section
- End boundary: cleaned line 214 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: The Story of a Mother (1948 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

First 5 sections:

- chapter-001: The Story of a Mother (1948 words)

Last 5 sections:

- chapter-001: The Story of a Mother (1948 words)

Supporting snippets:

- Title: THE STORY OF A MOTHER
- Author: Author: H. C. Andersen
- Start: A mother sat there with her little child. She was so downcast, so afraid that it should die! It was so pale, the small eyes had closed themselves, and it drew its breath so softly, now and then, with a deep respiration, as if it sighed; and the mother looked s
- End: r wrung her hands, fell on her knees, and prayed to our Lord: “Oh, hear me not when I pray against Thy will, which is the best! hear me not! hear me not!” And she bowed her head down in her lap, and Death took her child and went with it into the unknown land.

### the-ugly-duckling

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE UGLY DUCKLING.txt
- Expected/generated title: The Ugly Duckling / The Ugly Duckling
- Expected/generated author: H. C. Andersen / H. C. Andersen
- Author evidence: Gutenberg Author line - Author: H. C. Andersen
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 86 - start at first readable prose after source/title/byline wrapper: IT was so beautiful in the country; write pass starts at first selected/default section
- End boundary: cleaned line 470 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: The Ugly Duckling (3931 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run cleanup risk: illustration captions/placeholders must be removed from default playback; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run artifact risk: illustration captions/placeholders detected

First 5 sections:

- chapter-001: The Ugly Duckling (3931 words)

Last 5 sections:

- chapter-001: The Ugly Duckling (3931 words)

Supporting snippets:

- Title: THE UGLY DUCKLING
- Author: Author: H. C. Andersen
- Start: IT was so beautiful in the country. It was the summer time. The wheat fields were golden, the oats were green, and the hay stood in great stacks in the green meadows. The stork paraded about among them on his long red legs, chattering away in Egyptian, the lan
- End: ts boughs into the water before him, and the sun shone warm and bright. Then he rustled his feathers, curved his slender neck, and cried joyfully, from the depths of his heart, "I never dreamed of such happiness as this while I was the despised ugly duckling."

### the-adventures-of-chanticleer-and-partlet

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE ADVENTURES OF CHANTICLEER AND PARTLET.txt
- Expected/generated title: The Adventures of Chanticleer and Partlet / The Adventures of Chanticleer and Partlet
- Expected/generated author: Jacob Grimm; Wilhelm Grimm / Jacob Grimm; Wilhelm Grimm
- Author evidence: Gutenberg Author line - Author: Jacob Grimm; Wilhelm Grimm
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: three source-numbered tale sections after parent Grimm collection title and byline
- Start boundary: cleaned line 10 - start at 1. HOW THEY WENT TO THE MOUNTAINS TO EAT NUTS: The nuts are quite ripe now; write pass starts at first selected/default section
- End boundary: cleaned line 173 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: 1. How They Went to the Mountains to Eat Nuts (854 words)
- Section count: 3
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001, chapter-002, chapter-003
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass preserved the three numbered Chanticleer and Partlet body headings and excluded the parent Grimm collection wrapper from playable text.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

First 5 sections:

- chapter-001: 1. How They Went to the Mountains to Eat Nuts (854 words)
- chapter-002: 2. How Chanticleer and Partlet Went to Visit Mr Korbes (368 words)
- chapter-003: 3. How Partlet Died and Was Buried, and How Chanticleer Died of Grief (647 words)

Last 5 sections:

- chapter-001: 1. How They Went to the Mountains to Eat Nuts (854 words)
- chapter-002: 2. How Chanticleer and Partlet Went to Visit Mr Korbes (368 words)
- chapter-003: 3. How Partlet Died and Was Buried, and How Chanticleer Died of Grief (647 words)

Supporting snippets:

- Title: THE ADVENTURES OF CHANTICLEER AND PARTLET
- Author: Author: Jacob Grimm; Wilhelm Grimm
- Start: The nuts are quite ripe now, said Chanticleer to his wife Partlet, suppose we go together to the mountains, and eat as many as we can, before the squirrel takes them all away. With all my heart, said Partlet, let us go and make a holiday of it together
- End: eam and drowned. Thus Chanticleer was left alone with his dead Partlet; and having dug a grave for her, he laid her in it, and made a little hillock over her. Then he sat down by the grave, and wept and mourned, till at last he died too; and so all were dead.

### jorinda-and-jorindel

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/JORINDA AND JORINDEL.txt
- Expected/generated title: Jorinda and Jorindel / Jorinda and Jorindel
- Expected/generated author: Jacob Grimm; Wilhelm Grimm / Jacob Grimm; Wilhelm Grimm
- Author evidence: Gutenberg Author line - Author: Jacob Grimm; Wilhelm Grimm
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 9 - start at first readable prose after source/title/byline wrapper: There was once an old castle; write pass starts at first selected/default section
- End boundary: cleaned line 116 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: Jorinda and Jorindel (1141 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

First 5 sections:

- chapter-001: Jorinda and Jorindel (1141 words)

Last 5 sections:

- chapter-001: Jorinda and Jorindel (1141 words)

Supporting snippets:

- Title: JORINDA AND JORINDEL
- Author: Author: Jacob Grimm; Wilhelm Grimm
- Start: There was once an old castle, that stood in the middle of a deep gloomy wood, and in the castle lived an old fairy. Now this fairy could take any shape she pleased. All the day long she flew about in the form of an owl, or crept about the country like a cat; b
- End: took their old forms again; and he took Jorinda home, where they were married, and lived happily together many years: and so did a good many other lads, whose maidens had been forced to sing in the old fairy’s cages by themselves, much longer than they liked.

### mother-holle

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/MOTHER HOLLE.txt
- Expected/generated title: Mother Holle / Mother Holle
- Expected/generated author: Jacob Grimm; Wilhelm Grimm / Jacob Grimm; Wilhelm Grimm
- Author evidence: Gutenberg Author line - Author: Jacob Grimm; Wilhelm Grimm
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 9 - start at first readable prose after source/title/byline wrapper: Once upon a time there was a widow; write pass starts at first selected/default section
- End boundary: cleaned line 127 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: Mother Holle (1276 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

First 5 sections:

- chapter-001: Mother Holle (1276 words)

Last 5 sections:

- chapter-001: Mother Holle (1276 words)

Supporting snippets:

- Title: MOTHER HOLLE
- Author: Author: Jacob Grimm; Wilhelm Grimm
- Start: Once upon a time there was a widow who had two daughters; one of them was beautiful and industrious, the other ugly and lazy. The mother, however, loved the ugly and lazy one best, because she was her own daughter, and so the other, who was only her stepdaught
- End: azy girl had to go home covered with pitch, and the cock on the well called out as she saw her: ‘Cock-a-doodle-doo! Your dirty daughter’s come back to you.’ But, try what she would, she could not get the pitch off and it stuck to her as long as she lived.

### rapunzel

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/RAPUNZEL.txt
- Expected/generated title: Rapunzel / Rapunzel
- Expected/generated author: Jacob Grimm; Wilhelm Grimm / Jacob Grimm; Wilhelm Grimm
- Author evidence: Gutenberg Author line - Author: Jacob Grimm; Wilhelm Grimm
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 9 - start at first readable prose after source/title/byline wrapper: There were once a man and a woman; write pass starts at first selected/default section
- End boundary: cleaned line 128 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: Rapunzel (1413 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

First 5 sections:

- chapter-001: Rapunzel (1413 words)

Last 5 sections:

- chapter-001: Rapunzel (1413 words)

Supporting snippets:

- Title: RAPUNZEL
- Author: Author: Jacob Grimm; Wilhelm Grimm
- Start: There were once a man and a woman who had long in vain wished for a child. At length the woman hoped that God was about to grant her desire. These people had a little window at the back of their house from which a splendid garden could be seen, which was full
- End: knew him and fell on his neck and wept. Two of her tears wetted his eyes and they grew clear again, and he could see with them as before. He led her to his kingdom where he was joyfully received, and they lived for a long time afterwards, happy and contented.

### the-juniper-tree

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE JUNIPER-TREE.txt
- Expected/generated title: The Juniper-Tree / The Juniper-Tree
- Expected/generated author: Jacob Grimm; Wilhelm Grimm / Jacob Grimm; Wilhelm Grimm
- Author evidence: Gutenberg Author line - Author: Jacob Grimm; Wilhelm Grimm
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 9 - start at first readable prose after source/title/byline wrapper: Long, long ago, some two thousand years or so; write pass starts at first selected/default section
- End boundary: cleaned line 383 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: The Juniper-Tree (3088 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

First 5 sections:

- chapter-001: The Juniper-Tree (3088 words)

Last 5 sections:

- chapter-001: The Juniper-Tree (3088 words)

Supporting snippets:

- Title: THE JUNIPER-TREE
- Author: Author: Jacob Grimm; Wilhelm Grimm
- Start: Long, long ago, some two thousand years or so, there lived a rich man with a good and beautiful wife. They loved each other dearly, but sorrowed much that they had no children. So greatly did they desire to have one, that the wife prayed for it day and night,
- End: ly saw mist and flame and fire rising from the spot, and when these had passed, there stood the little brother, and he took the father and little Marleen by the hand; then they all three rejoiced, and went inside together and sat down to their dinners and ate.

### the-seven-ravens

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE SEVEN RAVENS.txt
- Expected/generated title: The Seven Ravens / The Seven Ravens
- Expected/generated author: Jacob Grimm; Wilhelm Grimm / Jacob Grimm; Wilhelm Grimm
- Author evidence: Gutenberg Author line - Author: Jacob Grimm; Wilhelm Grimm
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 9 - start at first readable prose after source/title/byline wrapper: There was once a man who had seven sons; write pass starts at first selected/default section
- End boundary: cleaned line 90 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: The Seven Ravens (1011 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

First 5 sections:

- chapter-001: The Seven Ravens (1011 words)

Last 5 sections:

- chapter-001: The Seven Ravens (1011 words)

Supporting snippets:

- Title: THE SEVEN RAVENS
- Author: Author: Jacob Grimm; Wilhelm Grimm
- Start: There was once a man who had seven sons, and last of all one daughter. Although the little girl was very pretty, she was so weak and small that they thought she could not live; but they said she should at once be christened. So the father sent one of his sons
- End: ome! then we should be free.’ When the little girl heard this (for she stood behind the door all the time and listened), she ran forward, and in an instant all the ravens took their right form again; and all hugged and kissed each other, and went merrily home.

### the-wedding-of-mrs-fox

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE WEDDING OF MRS FOX.txt
- Expected/generated title: The Wedding of Mrs Fox / The Wedding of Mrs Fox
- Expected/generated author: Jacob Grimm; Wilhelm Grimm / Jacob Grimm; Wilhelm Grimm
- Author evidence: Gutenberg Author line - Author: Jacob Grimm; Wilhelm Grimm
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 11 - start at first readable prose after source/title/byline wrapper: There was once upon a time an old fox; write pass starts at first selected/default section
- End boundary: cleaned line 115 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: The Wedding of Mrs Fox (787 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run artifact risk: no obvious illustration/page-marker/footnote risk in snippets

First 5 sections:

- chapter-001: The Wedding of Mrs Fox (787 words)

Last 5 sections:

- chapter-001: The Wedding of Mrs Fox (787 words)

Supporting snippets:

- Title: THE WEDDING OF MRS FOX
- Author: Author: Jacob Grimm; Wilhelm Grimm
- Start: There was once upon a time an old fox with nine tails, who believed that his wife was not faithful to him, and wished to put her to the test. He stretched himself out under the bench, did not move a limb, and behaved as if he were stone dead. Mrs Fox went up t
- End: For many a fine fat mouse he brought, Yet of his wife he never thought, But ate up every one he caught.’ Then the wedding was solemnized with young Mr Fox, and there was much rejoicing and dancing; and if they have not left off, they are dancing still.

### the-adventures-of-kintaro-the-golden-boy

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE ADVENTURES OF KINTARO, THE GOLDEN BOY.txt
- Expected/generated title: The Adventures of Kintaro, the Golden Boy / The Adventures of Kintaro, the Golden Boy
- Expected/generated author: Yei Theodora Ozaki / Yei Theodora Ozaki
- Author evidence: Gutenberg Author line - Author: Yei Theodora Ozaki
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 13 - start at first readable prose after source/title/byline wrapper: Long, long ago there lived in Kyoto; write pass starts at first selected/default section
- End boundary: cleaned line 367 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: The Adventures of Kintaro, the Golden Boy (3127 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run cleanup risk: illustration captions/placeholders must be removed from default playback; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run artifact risk: illustration captions/placeholders detected

First 5 sections:

- chapter-001: The Adventures of Kintaro, the Golden Boy (3127 words)

Last 5 sections:

- chapter-001: The Adventures of Kintaro, the Golden Boy (3127 words)

Supporting snippets:

- Title: THE ADVENTURES OF KINTARO, THE GOLDEN BOY
- Author: Author: Yei Theodora Ozaki
- Start: Long, long ago there lived in Kyoto a brave soldier named Kintoki. Now he fell in love with a beautiful lady and married her. Not long after this, through the malice of some of his friends, he fell into disgrace at Court and was dismissed. This misfortune so p
- End: ro of his country, and great was the power and honor and wealth that came to him. He now kept his promise and built a comfortable home for his old mother, who lived happily with him in the Capital to the end of her days. Is not this the story of a great hero?

### the-bamboo-cutter-and-the-moon-child

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE BAMBOO-CUTTER AND THE MOON-CHILD.txt
- Expected/generated title: The Bamboo-Cutter and the Moon-Child / The Bamboo-Cutter and the Moon-Child
- Expected/generated author: Yei Theodora Ozaki / Yei Theodora Ozaki
- Author evidence: Gutenberg Author line - Author: Yei Theodora Ozaki
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 13 - start at first readable prose after source/title/byline wrapper: Long, long ago, there lived an old bamboo wood-cutter; write pass starts at first selected/default section
- End boundary: cleaned line 566 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: The Bamboo-Cutter and the Moon-Child (5747 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run cleanup risk: illustration captions/placeholders must be removed from default playback; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run artifact risk: illustration captions/placeholders detected

First 5 sections:

- chapter-001: The Bamboo-Cutter and the Moon-Child (5747 words)

Last 5 sections:

- chapter-001: The Bamboo-Cutter and the Moon-Child (5747 words)

Supporting snippets:

- Title: THE BAMBOO-CUTTER AND THE MOON-CHILD
- Author: Author: Yei Theodora Ozaki
- Start: Long, long ago, there lived an old bamboo wood-cutter. He was very poor and sad also, for no child had Heaven sent to cheer his old age, and in his heart there was no hope of rest from work till he died and was laid in the quiet grave. Every morning he went fo
- End: so he sent it with the letter to the top of the most sacred mountain in the land. Mount Fuji, and there the Royal emissaries burnt it on the summit at sunrise. So to this day people say there is smoke to be seen rising from the top of Mount Fuji to the clouds.

### the-goblin-of-adachigahara

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE GOBLIN OF ADACHIGAHARA.txt
- Expected/generated title: The Goblin of Adachigahara / The Goblin of Adachigahara
- Expected/generated author: Yei Theodora Ozaki / Yei Theodora Ozaki
- Author evidence: Gutenberg Author line - Author: Yei Theodora Ozaki
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 13 - start at first readable prose after source/title/byline wrapper: Long, long ago there was a large plain called Adachigahara; write pass starts at first selected/default section
- End boundary: cleaned line 185 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: The Goblin of Adachigahara (1726 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run cleanup risk: illustration captions/placeholders must be removed from default playback; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run artifact risk: illustration captions/placeholders detected

First 5 sections:

- chapter-001: The Goblin of Adachigahara (1726 words)

Last 5 sections:

- chapter-001: The Goblin of Adachigahara (1726 words)

Supporting snippets:

- Title: THE GOBLIN OF ADACHIGAHARA
- Author: Author: Yei Theodora Ozaki
- Start: Long, long ago there was a large plain called Adachigahara, in the province of Mutsu in Japan. This place was said to be haunted by a cannibal goblin who took the form of an old woman. From time to time many travelers disappeared and were never heard of more,
- End: dha to whom he had prayed for help, so he took out his rosary and bowing his head as the sun rose he said his prayers and made his thanksgiving earnestly. He then set forward for another part of the country, only too glad to leave the haunted plain behind him.

### the-jelly-fish-and-the-monkey

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE JELLY FISH AND THE MONKEY.txt
- Expected/generated title: The Jelly Fish and the Monkey / The Jelly Fish and the Monkey
- Expected/generated author: Yei Theodora Ozaki / Yei Theodora Ozaki
- Author evidence: Gutenberg Author line - Author: Yei Theodora Ozaki
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 13 - start at first readable prose after source/title/byline wrapper: Long, long ago, in old Japan, the Kingdom of the Sea; write pass starts at first selected/default section
- End boundary: cleaned line 367 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: The Jelly Fish and the Monkey (3201 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run cleanup risk: illustration captions/placeholders must be removed from default playback; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run artifact risk: illustration captions/placeholders detected

First 5 sections:

- chapter-001: The Jelly Fish and the Monkey (3201 words)

Last 5 sections:

- chapter-001: The Jelly Fish and the Monkey (3201 words)

Supporting snippets:

- Title: THE JELLY FISH AND THE MONKEY
- Author: Author: Yei Theodora Ozaki
- Start: Long, long ago, in old Japan, the Kingdom of the Sea was governed by a wonderful King. He was called Rin Jin, or the Dragon King of the Sea. His power was immense, for he was the ruler of all sea creatures both great and small, and in his keeping were the Jewe
- End: d bones something like a tortoise, but, ever since the Dragon King’s sentence was carried out on the ancestor of the jelly fishes, his descendants have all been soft and boneless just as you see them to-day thrown up by the waves high upon the shores of Japan.

### the-tongue-cut-sparrow

- Dry-run status: needs first-time controlled processing
- Final action: first-time processed
- Source: app/client/assets/temp-books/THE TONGUE-CUT SPARROW.txt
- Expected/generated title: The Tongue-Cut Sparrow / The Tongue-Cut Sparrow
- Expected/generated author: Yei Theodora Ozaki / Yei Theodora Ozaki
- Author evidence: Gutenberg Author line - Author: Yei Theodora Ozaki
- Duplicate/near-duplicate slug check: passed: no existing generated slug matched the normalized title/author identity
- Structure: one contiguous story section starting at dry-run verified first readable prose phrase
- Start boundary: cleaned line 13 - start at first readable prose after source/title/byline wrapper: Long, long ago in Japan there lived an old man; write pass starts at first selected/default section
- End boundary: cleaned line 343 - end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes; write pass keeps the final readable section and trims trailing source noise
- First default section after: The Tongue-Cut Sparrow (3393 words)
- Section count: 1
- Title/default-start verdict: passed: generated title and first default section match audited source identity
- Author metadata verdict: passed: author metadata comes from Gutenberg Author line
- Segmentation verdict: passed: source-based heading strategy preserved; no vague fallback Part 1 / Part 2 chunks used
- Preview verdict: valid book-specific preview from chapter-001
- Startup preview valid: yes
- All-main-readable-default verdict: all generated readable sections included by default
- Final recommendation: accepted for review
- Remaining warnings: Missing Project Gutenberg end marker; footer text was not destructively stripped.; Write pass created one contiguous story section at the dry-run verified first readable prose phrase, excluding source, title, byline, publication, and transcriber wrapper lines.; dry-run cleanup risk: title page, byline, publication, or copyright material appears before body content; dry-run cleanup risk: Project Gutenberg/source/license material must be removed; dry-run cleanup risk: contributor or transcriber notes must be removed or preserved only as non-default; dry-run cleanup risk: illustration captions/placeholders must be removed from default playback; dry-run title/default-start risk: write pass must keep title/byline material out of default playback; dry-run artifact risk: illustration captions/placeholders detected

First 5 sections:

- chapter-001: The Tongue-Cut Sparrow (3393 words)

Last 5 sections:

- chapter-001: The Tongue-Cut Sparrow (3393 words)

Supporting snippets:

- Title: THE TONGUE-CUT SPARROW
- Author: Author: Yei Theodora Ozaki
- Start: Long, long ago in Japan there lived an old man and his wife. The old man was a good, kind-hearted, hard-working old fellow, but his wife was a regular cross-patch, who spoiled the happiness of her home by her scolding tongue. She was always grumbling about som
- End: degrees became a good old woman, so that her husband hardly knew her to be the same person, and they spent their last days together happily, free from want or care, spending carefully the treasure the old man had received from his pet, the tongue-cut sparrow.

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
