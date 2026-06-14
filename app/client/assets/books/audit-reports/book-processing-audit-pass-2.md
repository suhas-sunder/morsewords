# Book Processing Audit Pass 2

Generated: 2026-06-14T07:40:18.111Z

This is a read-only deeper verification pass. It inspects the current source text, pass-1 findings, and existing generated manifests/sections where warnings exist. It does not rewrite raw books, generated outputs, or Cloudflare exports.

## Totals

- Total source books/files found: 508
- Text sources found: 507
- Non-text sources found: 1
- Existing generated book manifests found: 74
- Existing generated-output warnings inspected: 28

## Risk Counts

| Risk | Pass 1 | Pass 2 |
| --- | ---: | ---: |
| low | 16 | 3 |
| medium | 179 | 105 |
| high | 311 | 398 |
| blocked | 2 | 2 |

## Risk Changes From Pass 1

| Change | Count | Examples |
| --- | ---: | --- |
| low -> medium | 4 | an-ideal-husband, pygmalion, the-divine-comedy, the-importance-of-being-earnest-a-trivial-comedy-for-serious-people |
| low -> high | 9 | despair-s-last-journey, father-goriot, lord-jim, metamorphosis, the-adventures-of-pinocchio, the-shoes-of-fortune, the-two-magics-the-turn-of-the-screw-covering-end, the-virginian-a-horseman-of-the-plains |
| medium -> high | 79 | a-story-of-the-days-to-come, a-study-in-scarlet, at-the-earth-s-core, at-the-mountains-of-madness, botchan, cool-air, deep-sea-plunderings, five-little-peppers-at-school |
| high -> medium | 1 | dracula |

## Blocked Files

- new-text-document - New Text Document (app/client/assets/temp-books/New Text Document.txt). Source has fewer than 100 words and no coherent book body.
- screenshot-2026-06-13-014010 - Screenshot 2026-06-13 014010 (app/client/assets/temp-books/Screenshot 2026-06-13 014010.png). Source is not a text file and cannot be verified as a book.

## High-Risk Files Needing Manual Review

- moti - The Lilac Fairy Book (app/client/assets/temp-books/‘Moti’.txt). boundary-uncertainty; Start or end boundary still has low confidence after context inspection.
- a-bread-and-butter-miss - The Toys of Peace, and Other Papers (app/client/assets/temp-books/A BREAD AND BUTTER MISS.txt). boundary-uncertainty; Start or end boundary still has low confidence after context inspection.
- a-catastrophe - A CATASTROPHE (app/client/assets/temp-books/A CATASTROPHE.txt). real-content-boundary-risk; boundary-uncertainty; Real opening or ending content may be at risk around the audited boundary.; Start or end boundary still has low confidence after context inspection.
- a-deal-in-ostriches - The Stolen Bacillus and Other Incidents (app/client/assets/temp-books/A DEAL IN OSTRICHES.txt). boundary-uncertainty; Start or end boundary still has low confidence after context inspection.
- a-fish-story - The Lilac Fairy Book (app/client/assets/temp-books/A Fish Story.txt). boundary-uncertainty; Start or end boundary still has low confidence after context inspection.
- a-french-puck - The Lilac Fairy Book (app/client/assets/temp-books/A French Puck.txt). boundary-uncertainty; Start or end boundary still has low confidence after context inspection.
- a-japanese-blossom - A Japanese Blossom (app/client/assets/temp-books/A Japanese Blossom.txt). real-content-boundary-risk; artifact-cleanup; Real opening or ending content may be at risk around the audited boundary.; Many illustration/image placeholders need cleanup review.
- a-lost-paradise - The Lilac Fairy Book (app/client/assets/temp-books/A Lost Paradise.txt). boundary-uncertainty; Start or end boundary still has low confidence after context inspection.
- a-moonlight-fable - The Door in the Wall And Other Stories (app/client/assets/temp-books/A MOONLIGHT FABLE.txt). boundary-uncertainty; Start or end boundary still has low confidence after context inspection.
- a-moth-genus-novo - The Stolen Bacillus and Other Incidents (app/client/assets/temp-books/A MOTH--GENUS NOVO.txt). boundary-uncertainty; Start or end boundary still has low confidence after context inspection.
- a-slip-under-the-microscope - A SLIP UNDER THE MICROSCOPE (app/client/assets/temp-books/A SLIP UNDER THE MICROSCOPE.txt). real-content-boundary-risk; boundary-uncertainty; Real opening or ending content may be at risk around the audited boundary.; Start or end boundary still has low confidence after context inspection.
- a-story-of-the-days-to-come - Tales of Space and Time (app/client/assets/temp-books/A Story of the Days to Come.txt). real-content-boundary-risk; Real opening or ending content may be at risk around the audited boundary.
- a-story-of-the-stone-age - Tales of Space and Time (app/client/assets/temp-books/A Story of the Stone Age.txt). real-content-boundary-risk; artifact-cleanup; Real opening or ending content may be at risk around the audited boundary.; Dense numbered bracket references indicate footnote-heavy or parser-junk risk.
- a-study-in-scarlet - A Study in Scarlet (app/client/assets/temp-books/A Study in Scarlet.txt). real-content-boundary-risk; Real opening or ending content may be at risk around the audited boundary.
- a-tale-of-the-tontlawald - The Violet Fairy Book (app/client/assets/temp-books/A TALE OF THE TONTLAWALD.txt). boundary-uncertainty; Start or end boundary still has low confidence after context inspection.
- a-childs-garden-of-verses - A Child's Garden of Verses (app/client/assets/temp-books/a-childs-garden-of-verses.txt). real-content-boundary-risk; generated-output-warning; artifact-cleanup; Real opening or ending content may be at risk around the audited boundary.
- a-christmas-carol - A Christmas Carol in Prose; Being a Ghost Story of Christmas (app/client/assets/temp-books/a-christmas-carol.txt). generated-output-warning; Existing generated output needs boundary/default-section correction later.
- aepyornis-island - The Stolen Bacillus and Other Incidents (app/client/assets/temp-books/AEPYORNIS ISLAND.txt). boundary-uncertainty; Start or end boundary still has low confidence after context inspection.
- an-enquiry-concerning-human-understanding - An Enquiry Concerning Human Understanding (app/client/assets/temp-books/An Enquiry Concerning Human Understanding.txt). real-content-boundary-risk; artifact-cleanup; Real opening or ending content may be at risk around the audited boundary.; Dense numbered bracket references indicate footnote-heavy or parser-junk risk.
- anna-karenina - Anna Karenina (app/client/assets/temp-books/Anna Karenina.txt). structural-complexity; Possible malformed or out-of-order chapter numbering.
- ashputtel - Grimms' Fairy Tales (app/client/assets/temp-books/ASHPUTTEL.txt). boundary-uncertainty; Start or end boundary still has low confidence after context inspection.
- astounding-stories-of-super-science - Astounding Stories of Super-Science, October, 1930 (app/client/assets/temp-books/Astounding Stories of Super-Science.txt). real-content-boundary-risk; structural-complexity; artifact-cleanup; Real opening or ending content may be at risk around the audited boundary.
- at-the-earth-s-core - At the Earth's Core (app/client/assets/temp-books/At the Earth's Core.txt). real-content-boundary-risk; Real opening or ending content may be at risk around the audited boundary.
- at-the-mountains-of-madness - At the mountains of madness (app/client/assets/temp-books/At the mountains of madness.txt). real-content-boundary-risk; Real opening or ending content may be at risk around the audited boundary.
- beowulf-an-anglo-saxon-epic-poem - Beowulf: An Anglo-Saxon Epic Poem (app/client/assets/temp-books/Beowulf - An Anglo-Saxon Epic Poem.txt). artifact-cleanup; Dense numbered bracket references indicate footnote-heavy or parser-junk risk.
- bertie-s-christmas-eve - The Toys of Peace, and Other Papers (app/client/assets/temp-books/BERTIE’S CHRISTMAS EVE.txt). boundary-uncertainty; Start or end boundary still has low confidence after context inspection.
- beyond-the-wall-of-sleep - Beyond the Wall of Sleep (app/client/assets/temp-books/Beyond the Wall of Sleep.txt). real-content-boundary-risk; boundary-uncertainty; Real opening or ending content may be at risk around the audited boundary.; Start or end boundary still has low confidence after context inspection.
- black-beauty - Black Beauty The autobiography of a horse (app/client/assets/temp-books/black-beauty.txt). generated-output-warning; Existing generated output needs boundary/default-section correction later.
- botchan - Botchan (Master Darling) (app/client/assets/temp-books/Botchan.txt). real-content-boundary-risk; Real opening or ending content may be at risk around the audited boundary.
- briar-rose - Grimms' Fairy Tales (app/client/assets/temp-books/BRIAR ROSE.txt). boundary-uncertainty; Start or end boundary still has low confidence after context inspection.
- can-you-forgive-her - Can You Forgive Her? (app/client/assets/temp-books/Can You Forgive Her.txt). real-content-boundary-risk; artifact-cleanup; Real opening or ending content may be at risk around the audited boundary.; Many illustration/image placeholders need cleanup review.
- candide - Candide (app/client/assets/temp-books/Candide.txt). real-content-boundary-risk; generated-output-warning; artifact-cleanup; Real opening or ending content may be at risk around the audited boundary.
- canossa - The Toys of Peace, and Other Papers (app/client/assets/temp-books/CANOSSA.txt). boundary-uncertainty; Start or end boundary still has low confidence after context inspection.
- cat-and-mouse-in-partnership - Grimms' Fairy Tales (app/client/assets/temp-books/CAT AND MOUSE IN PARTNERSHIP.txt). boundary-uncertainty; Start or end boundary still has low confidence after context inspection.
- cat-skin - Grimms' Fairy Tales (app/client/assets/temp-books/CAT-SKIN.txt). boundary-uncertainty; Start or end boundary still has low confidence after context inspection.
- celephais - Celephaïs (app/client/assets/temp-books/Celephaïs.txt). real-content-boundary-risk; boundary-uncertainty; Real opening or ending content may be at risk around the audited boundary.; Start or end boundary still has low confidence after context inspection.
- clever-elsie - Grimms' Fairy Tales (app/client/assets/temp-books/CLEVER ELSIE.txt). boundary-uncertainty; Start or end boundary still has low confidence after context inspection.
- clever-gretel - Grimms' Fairy Tales (app/client/assets/temp-books/CLEVER GRETEL.txt). boundary-uncertainty; Start or end boundary still has low confidence after context inspection.
- clever-hans - Grimms' Fairy Tales (app/client/assets/temp-books/CLEVER HANS.txt). boundary-uncertainty; Start or end boundary still has low confidence after context inspection.
- cool-air - Cool air (app/client/assets/temp-books/Cool air.txt). real-content-boundary-risk; Real opening or ending content may be at risk around the audited boundary.
- crime-and-punishment - Crime and Punishment (app/client/assets/temp-books/Crime and Punishment.txt). real-content-boundary-risk; generated-output-warning; Real opening or ending content may be at risk around the audited boundary.; Existing generated output needs boundary/default-section correction later.
- dagon - Dagon (app/client/assets/temp-books/Dagon.txt). boundary-uncertainty; Start or end boundary still has low confidence after context inspection.
- deep-sea-plunderings - Deep-Sea Plunderings (app/client/assets/temp-books/Deep-Sea Plunderings.txt). real-content-boundary-risk; Real opening or ending content may be at risk around the audited boundary.
- despair-s-last-journey - Despair's Last Journey (app/client/assets/temp-books/Despair's Last Journey.txt). real-content-boundary-risk; Real opening or ending content may be at risk around the audited boundary.
- doctor-knowall - Grimms' Fairy Tales (app/client/assets/temp-books/DOCTOR KNOWALL.txt). boundary-uncertainty; Start or end boundary still has low confidence after context inspection.
- don-quixote - Don Quixote (app/client/assets/temp-books/Don Quixote.txt). generated-output-warning; Existing generated output needs boundary/default-section correction later.
- dr-jekyll-and-mr-hyde - The strange case of Dr. Jekyll and Mr. Hyde (app/client/assets/temp-books/Dr. Jekyll and Mr. Hyde.txt). real-content-boundary-risk; generated-output-warning; Real opening or ending content may be at risk around the audited boundary.; Existing generated output needs boundary/default-section correction later.
- elder-tree-mother - Hans Andersen's Fairy Tales. First Series (app/client/assets/temp-books/ELDER-TREE MOTHER.txt). boundary-uncertainty; Start or end boundary still has low confidence after context inspection.
- emma - Emma (app/client/assets/temp-books/Emma.txt). real-content-boundary-risk; boundary-uncertainty; Real opening or ending content may be at risk around the audited boundary.; Start or end boundary still has low confidence after context inspection.
- erewhon-or-over-the-range - Erewhon; Or, Over the Range (app/client/assets/temp-books/Erewhon; Or, Over the Range.txt). boundary-uncertainty; Start or end boundary still has low confidence after context inspection.
- excepting-mrs-pentherby - The Toys of Peace, and Other Papers (app/client/assets/temp-books/EXCEPTING MRS. PENTHERBY.txt). boundary-uncertainty; Start or end boundary still has low confidence after context inspection.
- fate - The Toys of Peace, and Other Papers (app/client/assets/temp-books/FATE.txt). boundary-uncertainty; Start or end boundary still has low confidence after context inspection.
- father-goriot - Father Goriot (app/client/assets/temp-books/Father Goriot.txt). real-content-boundary-risk; Real opening or ending content may be at risk around the audited boundary.
- figures-of-earth-a-comedy-of-appearances - Figures of Earth: A Comedy of Appearances (app/client/assets/temp-books/Figures of Earth - A Comedy of Appearances.txt). boundary-uncertainty; artifact-cleanup; Start or end boundary still has low confidence after context inspection.; Many illustration/image placeholders need cleanup review.
- filmer - Twelve Stories and a Dream (app/client/assets/temp-books/FILMER.txt). boundary-uncertainty; Start or end boundary still has low confidence after context inspection.
- five-children-and-it - Five Children and It (app/client/assets/temp-books/Five Children and It.txt). real-content-boundary-risk; artifact-cleanup; Real opening or ending content may be at risk around the audited boundary.; Many illustration/image placeholders need cleanup review.
- five-little-friends - Five Little Friends (app/client/assets/temp-books/Five Little Friends.txt). real-content-boundary-risk; artifact-cleanup; Real opening or ending content may be at risk around the audited boundary.; Many illustration/image placeholders need cleanup review.
- five-little-peppers-at-school - Five Little Peppers at School (app/client/assets/temp-books/Five Little Peppers at School.txt). real-content-boundary-risk; Real opening or ending content may be at risk around the audited boundary.
- five-little-peppers-and-how-they-grew - Five Little Peppers and How They Grew (app/client/assets/temp-books/five-little-peppers-and-how-they-grew.txt). generated-output-warning; Existing generated output needs boundary/default-section correction later.
- flatland-a-romance-of-many-dimensions - Flatland: A Romance of Many Dimensions (app/client/assets/temp-books/Flatland - A Romance of Many Dimensions.txt). real-content-boundary-risk; Real opening or ending content may be at risk around the audited boundary.
- forewarned - The Toys of Peace, and Other Papers (app/client/assets/temp-books/FOREWARNED.txt). boundary-uncertainty; Start or end boundary still has low confidence after context inspection.
- frederick-and-catherine - Grimms' Fairy Tales (app/client/assets/temp-books/FREDERICK AND CATHERINE.txt). boundary-uncertainty; Start or end boundary still has low confidence after context inspection.
- from-beyond - From Beyond (app/client/assets/temp-books/From Beyond.txt). real-content-boundary-risk; boundary-uncertainty; Real opening or ending content may be at risk around the audited boundary.; Start or end boundary still has low confidence after context inspection.
- fundevogel - Grimms' Fairy Tales (app/client/assets/temp-books/FUNDEVOGEL.txt). boundary-uncertainty; Start or end boundary still has low confidence after context inspection.
- goblin-tales-of-lancashire - Goblin Tales of Lancashire (app/client/assets/temp-books/Goblin Tales of Lancashire.txt). real-content-boundary-risk; Real opening or ending content may be at risk around the audited boundary.
- great-expectations - Great Expectations (app/client/assets/temp-books/Great Expectations.txt). boundary-uncertainty; Start or end boundary still has low confidence after context inspection.
- grimm-s-fairy-tales - Grimm's Fairy Tales (app/client/assets/temp-books/Grimm's Fairy Tales.txt). real-content-boundary-risk; generated-output-warning; Real opening or ending content may be at risk around the audited boundary.; Existing generated output needs boundary/default-section correction later.
- gulliver-s-travels - Gulliver's Travels into Several Remote Nations of the World (app/client/assets/temp-books/Gulliver's Travels.txt). generated-output-warning; Existing generated output needs boundary/default-section correction later.
- hamlet - Hamlet (app/client/assets/temp-books/Hamlet.txt). artifact-cleanup; structural-complexity; Dense numbered bracket references indicate footnote-heavy or parser-junk risk.; Multiple footnote/reference sections need manual section handling.
- hans-in-luck - Grimms' Fairy Tales (app/client/assets/temp-books/HANS IN LUCK.txt). boundary-uncertainty; Start or end boundary still has low confidence after context inspection.
- hansel-and-gretel - Grimms' Fairy Tales (app/client/assets/temp-books/HANSEL AND GRETEL.txt). boundary-uncertainty; Start or end boundary still has low confidence after context inspection.
- herland - Herland (app/client/assets/temp-books/Herland.txt). boundary-uncertainty; Start or end boundary still has low confidence after context inspection.
- hero-myths-and-legends-of-the-british-race - Hero-Myths & Legends of the British Race (app/client/assets/temp-books/Hero-Myths & Legends of the British Race.txt). real-content-boundary-risk; artifact-cleanup; structural-complexity; Real opening or ending content may be at risk around the audited boundary.
- history-of-tom-jones - History of Tom Jones, a Foundling (app/client/assets/temp-books/History of Tom Jones.txt). real-content-boundary-risk; Real opening or ending content may be at risk around the audited boundary.
- how-a-fish-swam-in-the-air-and-a-hare-in-the-water - The Violet Fairy Book (app/client/assets/temp-books/HOW A FISH SWAM IN THE AIR AND A HARE IN THE WATER.txt). boundary-uncertainty; Start or end boundary still has low confidence after context inspection.
- how-an-old-man-lost-his-wen - Japanese Fairy Tales (app/client/assets/temp-books/HOW AN OLD MAN LOST HIS WEN.txt). real-content-boundary-risk; boundary-uncertainty; Real opening or ending content may be at risk around the audited boundary.; Start or end boundary still has low confidence after context inspection.
- how-brave-walter-hunted-wolves - The Lilac Fairy Book (app/client/assets/temp-books/How Brave Walter Hunted Wolves.txt). boundary-uncertainty; Start or end boundary still has low confidence after context inspection.
- howards-end - Howards End (app/client/assets/temp-books/Howards End.txt). boundary-uncertainty; Start or end boundary still has low confidence after context inspection.
- hyacinth - The Toys of Peace, and Other Papers (app/client/assets/temp-books/HYACINTH.txt). boundary-uncertainty; Start or end boundary still has low confidence after context inspection.
- hypnos - Hypnos (app/client/assets/temp-books/Hypnos.txt). real-content-boundary-risk; boundary-uncertainty; Real opening or ending content may be at risk around the audited boundary.; Start or end boundary still has low confidence after context inspection.
- ...and 318 more in the JSON report.

## Existing Generated-Output Warning Summary

| Suspected issue type | Count | Examples |
| --- | ---: | --- |
| generated intro contains real chapter content | 24 | a-childs-garden-of-verses<br>a-christmas-carol<br>black-beauty<br>candide<br>crime-and-punishment<br>don-quixote<br>dr-jekyll-and-mr-hyde<br>five-little-peppers-and-how-they-grew |
| starts too early | 18 | a-childs-garden-of-verses<br>a-christmas-carol<br>black-beauty<br>candide<br>dr-jekyll-and-mr-hyde<br>five-little-peppers-and-how-they-grew<br>grimm-s-fairy-tales<br>gulliver-s-travels |
| real opening content missing | 12 | crime-and-punishment<br>don-quixote<br>gulliver-s-travels<br>jane-eyre<br>les-miserables<br>little-women<br>new-treasure-seekers<br>rainbow-valley |
| starts too late | 12 | crime-and-punishment<br>don-quixote<br>gulliver-s-travels<br>jane-eyre<br>les-miserables<br>little-women<br>new-treasure-seekers<br>rainbow-valley |
| generated output corrupted or too short | 2 | screenshot-2026-06-13-014010<br>the-happy-family |
| ends too early | 1 | the-happy-family |

The full JSON report includes one inspection object for each generated-output warning, with manifest path, evidence, confidence, later fix recommendation, and pilot-batch inclusion.

## Top Cleanup Artifacts

| Category | Books | Examples |
| --- | ---: | --- |
| dash-normalization-candidates | 331 | a-bread-and-butter-miss<br>a-catastrophe<br>a-dream-of-armageddon<br>a-japanese-blossom<br>a-journal-of-the-plague-year<br>a-journey-to-the-centre-of-the-earth<br>a-midsummer-night-s-dream<br>a-moonlight-fable |
| decorative-page-markers | 242 | moti<br>a-deal-in-ostriches<br>a-fish-story<br>a-french-puck<br>a-journal-of-the-plague-year<br>a-journey-to-the-centre-of-the-earth<br>a-lost-paradise<br>a-moth-genus-novo |
| decorative-markers-near-boundaries | 216 | a-bread-and-butter-miss<br>a-catastrophe<br>a-japanese-blossom<br>a-midsummer-night-s-dream<br>a-room-with-a-view<br>a-study-in-scarlet<br>a-christmas-carol<br>almayer-s-folly-a-story-of-an-eastern-river |
| possible-real-content-boundary-risk | 176 | a-catastrophe<br>a-japanese-blossom<br>a-slip-under-the-microscope<br>a-story-of-the-days-to-come<br>a-story-of-the-stone-age<br>a-study-in-scarlet<br>a-childs-garden-of-verses<br>an-enquiry-concerning-human-understanding |
| isolated-table-of-contents | 142 | a-journey-to-the-centre-of-the-earth<br>a-midsummer-night-s-dream<br>a-room-with-a-view<br>a-study-in-scarlet<br>a-tale-of-two-cities<br>a-childs-garden-of-verses<br>a-christmas-carol<br>alices-adventures-in-wonderland |
| illustration-image-placeholders | 96 | a-japanese-blossom<br>a-journal-of-the-plague-year<br>a-journey-to-the-centre-of-the-earth<br>a-room-with-a-view<br>a-childs-garden-of-verses<br>agamemnon-of-aeschylus<br>alices-adventures-in-wonderland<br>anna-karenina |
| numbered-bracket-references | 42 | a-journal-of-the-plague-year<br>a-journey-to-the-centre-of-the-earth<br>a-story-of-the-stone-age<br>a-study-in-scarlet<br>agamemnon-of-aeschylus<br>an-enquiry-concerning-human-understanding<br>around-the-world-in-eighty-days<br>beowulf-an-anglo-saxon-epic-poem |
| nonstandard-structure-signals | 29 | a-midsummer-night-s-dream<br>an-enquiry-concerning-human-understanding<br>an-ideal-husband<br>anna-karenina<br>hamlet<br>history-of-tom-jones<br>les-miserables<br>macbeth |
| generated-output-warning | 28 | a-childs-garden-of-verses<br>a-christmas-carol<br>black-beauty<br>candide<br>crime-and-punishment<br>don-quixote<br>dr-jekyll-and-mr-hyde<br>five-little-peppers-and-how-they-grew |
| unicode-ocr-copy-paste-artifacts | 2 | agamemnon-of-aeschylus<br>the-colour-out-of-space |

## Recommended Pilot Batch

| Slug | Title | Risk | Boundary challenge | Cleanup challenge |
| --- | --- | --- | --- | --- |
| almayer-s-folly-a-story-of-an-eastern-river | Almayer's Folly: A Story of an Eastern River | low | Confirm clean Gutenberg header/footer exclusion and first/last readable lines. | Review decorative/page markers, dash normalization. |
| the-house-without-a-key | The house without a key | low | Confirm clean Gutenberg header/footer exclusion and first/last readable lines. | Review decorative/page markers, dash normalization. |
| the-lerouge-case | The Lerouge Case | low | Confirm clean Gutenberg header/footer exclusion and first/last readable lines. | Review decorative/page markers, dash normalization. |
| a-dream-of-armageddon | Twelve Stories and a Dream | medium | Verify medium start and medium end boundaries. | Review dash normalization. |
| a-journey-to-the-centre-of-the-earth | A Journey to the Centre of the Earth | medium | Confirm isolated TOC stays excluded from readable defaults. | Review image placeholders, numbered references, decorative/page markers, dash normalization. |
| a-journal-of-the-plague-year | A Journal of the Plague Year | medium | Confirm clean Gutenberg header/footer exclusion and first/last readable lines. | Review image placeholders, numbered references, decorative/page markers, dash normalization. |
| dracula | Dracula | medium | Confirm isolated TOC stays excluded from readable defaults. | Review image placeholders, decorative/page markers, dash normalization. |
| a-christmas-carol | A Christmas Carol in Prose; Being a Ghost Story of Christmas | high | Generated-output warning: starts too early, generated intro contains real chapter content. | Review decorative/page markers, dash normalization. |
| dr-jekyll-and-mr-hyde | The strange case of Dr. Jekyll and Mr. Hyde | high | Generated-output warning: starts too early, generated intro contains real chapter content. | Review decorative/page markers, dash normalization. |
| a-catastrophe | A CATASTROPHE | high | Verify low start and low end boundaries. | Review decorative/page markers, dash normalization. |

Do not process this pilot in this audit pass. Use it later as a reviewable first processing batch.

## Books Safe For Later Larger Low-Risk Batches

- almayer-s-folly-a-story-of-an-eastern-river - Almayer's Folly: A Story of an Eastern River (app/client/assets/temp-books/Almayer's Folly - A Story of an Eastern River.txt).
- the-house-without-a-key - The house without a key (app/client/assets/temp-books/The house without a key.txt).
- the-lerouge-case - The Lerouge Case (app/client/assets/temp-books/The Lerouge Case.txt).

## Books That Should Not Be Processed Yet

- new-text-document - New Text Document (app/client/assets/temp-books/New Text Document.txt). Source has fewer than 100 words and no coherent book body.
- screenshot-2026-06-13-014010 - Screenshot 2026-06-13 014010 (app/client/assets/temp-books/Screenshot 2026-06-13 014010.png). Source is not a text file and cannot be verified as a book.
- a-bread-and-butter-miss - The Toys of Peace, and Other Papers (app/client/assets/temp-books/A BREAD AND BUTTER MISS.txt). Start or end boundary still has low confidence after context inspection.
- a-catastrophe - A CATASTROPHE (app/client/assets/temp-books/A CATASTROPHE.txt). Real opening or ending content may be at risk around the audited boundary.; Start or end boundary still has low confidence after context inspection.
- a-childs-garden-of-verses - A Child's Garden of Verses (app/client/assets/temp-books/a-childs-garden-of-verses.txt). Real opening or ending content may be at risk around the audited boundary.; Existing generated output needs boundary/default-section correction later.; Many illustration/image placeholders need cleanup review.
- a-christmas-carol - A Christmas Carol in Prose; Being a Ghost Story of Christmas (app/client/assets/temp-books/a-christmas-carol.txt). Existing generated output needs boundary/default-section correction later.
- a-deal-in-ostriches - The Stolen Bacillus and Other Incidents (app/client/assets/temp-books/A DEAL IN OSTRICHES.txt). Start or end boundary still has low confidence after context inspection.
- a-fish-story - The Lilac Fairy Book (app/client/assets/temp-books/A Fish Story.txt). Start or end boundary still has low confidence after context inspection.
- a-french-puck - The Lilac Fairy Book (app/client/assets/temp-books/A French Puck.txt). Start or end boundary still has low confidence after context inspection.
- a-japanese-blossom - A Japanese Blossom (app/client/assets/temp-books/A Japanese Blossom.txt). Real opening or ending content may be at risk around the audited boundary.; Many illustration/image placeholders need cleanup review.
- a-lost-paradise - The Lilac Fairy Book (app/client/assets/temp-books/A Lost Paradise.txt). Start or end boundary still has low confidence after context inspection.
- a-moonlight-fable - The Door in the Wall And Other Stories (app/client/assets/temp-books/A MOONLIGHT FABLE.txt). Start or end boundary still has low confidence after context inspection.
- a-moth-genus-novo - The Stolen Bacillus and Other Incidents (app/client/assets/temp-books/A MOTH--GENUS NOVO.txt). Start or end boundary still has low confidence after context inspection.
- a-slip-under-the-microscope - A SLIP UNDER THE MICROSCOPE (app/client/assets/temp-books/A SLIP UNDER THE MICROSCOPE.txt). Real opening or ending content may be at risk around the audited boundary.; Start or end boundary still has low confidence after context inspection.
- a-story-of-the-days-to-come - Tales of Space and Time (app/client/assets/temp-books/A Story of the Days to Come.txt). Real opening or ending content may be at risk around the audited boundary.
- a-story-of-the-stone-age - Tales of Space and Time (app/client/assets/temp-books/A Story of the Stone Age.txt). Real opening or ending content may be at risk around the audited boundary.; Dense numbered bracket references indicate footnote-heavy or parser-junk risk.
- a-study-in-scarlet - A Study in Scarlet (app/client/assets/temp-books/A Study in Scarlet.txt). Real opening or ending content may be at risk around the audited boundary.
- a-tale-of-the-tontlawald - The Violet Fairy Book (app/client/assets/temp-books/A TALE OF THE TONTLAWALD.txt). Start or end boundary still has low confidence after context inspection.
- aepyornis-island - The Stolen Bacillus and Other Incidents (app/client/assets/temp-books/AEPYORNIS ISLAND.txt). Start or end boundary still has low confidence after context inspection.
- an-enquiry-concerning-human-understanding - An Enquiry Concerning Human Understanding (app/client/assets/temp-books/An Enquiry Concerning Human Understanding.txt). Real opening or ending content may be at risk around the audited boundary.; Dense numbered bracket references indicate footnote-heavy or parser-junk risk.
- anna-karenina - Anna Karenina (app/client/assets/temp-books/Anna Karenina.txt). Possible malformed or out-of-order chapter numbering.
- ashputtel - Grimms' Fairy Tales (app/client/assets/temp-books/ASHPUTTEL.txt). Start or end boundary still has low confidence after context inspection.
- astounding-stories-of-super-science - Astounding Stories of Super-Science, October, 1930 (app/client/assets/temp-books/Astounding Stories of Super-Science.txt). Real opening or ending content may be at risk around the audited boundary.; Possible malformed or out-of-order chapter numbering.; Many decorative/page markers appear close enough to boundaries to affect splitting.
- at-the-earth-s-core - At the Earth's Core (app/client/assets/temp-books/At the Earth's Core.txt). Real opening or ending content may be at risk around the audited boundary.
- at-the-mountains-of-madness - At the mountains of madness (app/client/assets/temp-books/At the mountains of madness.txt). Real opening or ending content may be at risk around the audited boundary.
- beowulf-an-anglo-saxon-epic-poem - Beowulf: An Anglo-Saxon Epic Poem (app/client/assets/temp-books/Beowulf - An Anglo-Saxon Epic Poem.txt). Dense numbered bracket references indicate footnote-heavy or parser-junk risk.
- bertie-s-christmas-eve - The Toys of Peace, and Other Papers (app/client/assets/temp-books/BERTIE’S CHRISTMAS EVE.txt). Start or end boundary still has low confidence after context inspection.
- beyond-the-wall-of-sleep - Beyond the Wall of Sleep (app/client/assets/temp-books/Beyond the Wall of Sleep.txt). Real opening or ending content may be at risk around the audited boundary.; Start or end boundary still has low confidence after context inspection.
- black-beauty - Black Beauty The autobiography of a horse (app/client/assets/temp-books/black-beauty.txt). Existing generated output needs boundary/default-section correction later.
- botchan - Botchan (Master Darling) (app/client/assets/temp-books/Botchan.txt). Real opening or ending content may be at risk around the audited boundary.
- briar-rose - Grimms' Fairy Tales (app/client/assets/temp-books/BRIAR ROSE.txt). Start or end boundary still has low confidence after context inspection.
- can-you-forgive-her - Can You Forgive Her? (app/client/assets/temp-books/Can You Forgive Her.txt). Real opening or ending content may be at risk around the audited boundary.; Many illustration/image placeholders need cleanup review.
- candide - Candide (app/client/assets/temp-books/Candide.txt). Real opening or ending content may be at risk around the audited boundary.; Existing generated output needs boundary/default-section correction later.; Dense numbered bracket references indicate footnote-heavy or parser-junk risk.
- canossa - The Toys of Peace, and Other Papers (app/client/assets/temp-books/CANOSSA.txt). Start or end boundary still has low confidence after context inspection.
- cat-and-mouse-in-partnership - Grimms' Fairy Tales (app/client/assets/temp-books/CAT AND MOUSE IN PARTNERSHIP.txt). Start or end boundary still has low confidence after context inspection.
- cat-skin - Grimms' Fairy Tales (app/client/assets/temp-books/CAT-SKIN.txt). Start or end boundary still has low confidence after context inspection.
- celephais - Celephaïs (app/client/assets/temp-books/Celephaïs.txt). Real opening or ending content may be at risk around the audited boundary.; Start or end boundary still has low confidence after context inspection.
- clever-elsie - Grimms' Fairy Tales (app/client/assets/temp-books/CLEVER ELSIE.txt). Start or end boundary still has low confidence after context inspection.
- clever-gretel - Grimms' Fairy Tales (app/client/assets/temp-books/CLEVER GRETEL.txt). Start or end boundary still has low confidence after context inspection.
- clever-hans - Grimms' Fairy Tales (app/client/assets/temp-books/CLEVER HANS.txt). Start or end boundary still has low confidence after context inspection.
- cool-air - Cool air (app/client/assets/temp-books/Cool air.txt). Real opening or ending content may be at risk around the audited boundary.
- crime-and-punishment - Crime and Punishment (app/client/assets/temp-books/Crime and Punishment.txt). Real opening or ending content may be at risk around the audited boundary.; Existing generated output needs boundary/default-section correction later.
- dagon - Dagon (app/client/assets/temp-books/Dagon.txt). Start or end boundary still has low confidence after context inspection.
- deep-sea-plunderings - Deep-Sea Plunderings (app/client/assets/temp-books/Deep-Sea Plunderings.txt). Real opening or ending content may be at risk around the audited boundary.
- despair-s-last-journey - Despair's Last Journey (app/client/assets/temp-books/Despair's Last Journey.txt). Real opening or ending content may be at risk around the audited boundary.
- doctor-knowall - Grimms' Fairy Tales (app/client/assets/temp-books/DOCTOR KNOWALL.txt). Start or end boundary still has low confidence after context inspection.
- don-quixote - Don Quixote (app/client/assets/temp-books/Don Quixote.txt). Existing generated output needs boundary/default-section correction later.
- dr-jekyll-and-mr-hyde - The strange case of Dr. Jekyll and Mr. Hyde (app/client/assets/temp-books/Dr. Jekyll and Mr. Hyde.txt). Real opening or ending content may be at risk around the audited boundary.; Existing generated output needs boundary/default-section correction later.
- elder-tree-mother - Hans Andersen's Fairy Tales. First Series (app/client/assets/temp-books/ELDER-TREE MOTHER.txt). Start or end boundary still has low confidence after context inspection.
- emma - Emma (app/client/assets/temp-books/Emma.txt). Real opening or ending content may be at risk around the audited boundary.; Start or end boundary still has low confidence after context inspection.
- erewhon-or-over-the-range - Erewhon; Or, Over the Range (app/client/assets/temp-books/Erewhon; Or, Over the Range.txt). Start or end boundary still has low confidence after context inspection.
- excepting-mrs-pentherby - The Toys of Peace, and Other Papers (app/client/assets/temp-books/EXCEPTING MRS. PENTHERBY.txt). Start or end boundary still has low confidence after context inspection.
- fate - The Toys of Peace, and Other Papers (app/client/assets/temp-books/FATE.txt). Start or end boundary still has low confidence after context inspection.
- father-goriot - Father Goriot (app/client/assets/temp-books/Father Goriot.txt). Real opening or ending content may be at risk around the audited boundary.
- figures-of-earth-a-comedy-of-appearances - Figures of Earth: A Comedy of Appearances (app/client/assets/temp-books/Figures of Earth - A Comedy of Appearances.txt). Start or end boundary still has low confidence after context inspection.; Many illustration/image placeholders need cleanup review.
- filmer - Twelve Stories and a Dream (app/client/assets/temp-books/FILMER.txt). Start or end boundary still has low confidence after context inspection.
- five-children-and-it - Five Children and It (app/client/assets/temp-books/Five Children and It.txt). Real opening or ending content may be at risk around the audited boundary.; Many illustration/image placeholders need cleanup review.
- five-little-friends - Five Little Friends (app/client/assets/temp-books/Five Little Friends.txt). Real opening or ending content may be at risk around the audited boundary.; Many illustration/image placeholders need cleanup review.
- five-little-peppers-and-how-they-grew - Five Little Peppers and How They Grew (app/client/assets/temp-books/five-little-peppers-and-how-they-grew.txt). Existing generated output needs boundary/default-section correction later.
- five-little-peppers-at-school - Five Little Peppers at School (app/client/assets/temp-books/Five Little Peppers at School.txt). Real opening or ending content may be at risk around the audited boundary.
- flatland-a-romance-of-many-dimensions - Flatland: A Romance of Many Dimensions (app/client/assets/temp-books/Flatland - A Romance of Many Dimensions.txt). Real opening or ending content may be at risk around the audited boundary.
- forewarned - The Toys of Peace, and Other Papers (app/client/assets/temp-books/FOREWARNED.txt). Start or end boundary still has low confidence after context inspection.
- frederick-and-catherine - Grimms' Fairy Tales (app/client/assets/temp-books/FREDERICK AND CATHERINE.txt). Start or end boundary still has low confidence after context inspection.
- from-beyond - From Beyond (app/client/assets/temp-books/From Beyond.txt). Real opening or ending content may be at risk around the audited boundary.; Start or end boundary still has low confidence after context inspection.
- fundevogel - Grimms' Fairy Tales (app/client/assets/temp-books/FUNDEVOGEL.txt). Start or end boundary still has low confidence after context inspection.
- goblin-tales-of-lancashire - Goblin Tales of Lancashire (app/client/assets/temp-books/Goblin Tales of Lancashire.txt). Real opening or ending content may be at risk around the audited boundary.
- great-expectations - Great Expectations (app/client/assets/temp-books/Great Expectations.txt). Start or end boundary still has low confidence after context inspection.
- grimm-s-fairy-tales - Grimm's Fairy Tales (app/client/assets/temp-books/Grimm's Fairy Tales.txt). Real opening or ending content may be at risk around the audited boundary.; Existing generated output needs boundary/default-section correction later.
- gulliver-s-travels - Gulliver's Travels into Several Remote Nations of the World (app/client/assets/temp-books/Gulliver's Travels.txt). Existing generated output needs boundary/default-section correction later.
- hamlet - Hamlet (app/client/assets/temp-books/Hamlet.txt). Dense numbered bracket references indicate footnote-heavy or parser-junk risk.; Multiple footnote/reference sections need manual section handling.
- hans-in-luck - Grimms' Fairy Tales (app/client/assets/temp-books/HANS IN LUCK.txt). Start or end boundary still has low confidence after context inspection.
- hansel-and-gretel - Grimms' Fairy Tales (app/client/assets/temp-books/HANSEL AND GRETEL.txt). Start or end boundary still has low confidence after context inspection.
- herland - Herland (app/client/assets/temp-books/Herland.txt). Start or end boundary still has low confidence after context inspection.
- hero-myths-and-legends-of-the-british-race - Hero-Myths & Legends of the British Race (app/client/assets/temp-books/Hero-Myths & Legends of the British Race.txt). Real opening or ending content may be at risk around the audited boundary.; Many illustration/image placeholders need cleanup review.; Multiple footnote/reference sections need manual section handling.
- history-of-tom-jones - History of Tom Jones, a Foundling (app/client/assets/temp-books/History of Tom Jones.txt). Real opening or ending content may be at risk around the audited boundary.
- how-a-fish-swam-in-the-air-and-a-hare-in-the-water - The Violet Fairy Book (app/client/assets/temp-books/HOW A FISH SWAM IN THE AIR AND A HARE IN THE WATER.txt). Start or end boundary still has low confidence after context inspection.
- how-an-old-man-lost-his-wen - Japanese Fairy Tales (app/client/assets/temp-books/HOW AN OLD MAN LOST HIS WEN.txt). Real opening or ending content may be at risk around the audited boundary.; Start or end boundary still has low confidence after context inspection.
- how-brave-walter-hunted-wolves - The Lilac Fairy Book (app/client/assets/temp-books/How Brave Walter Hunted Wolves.txt). Start or end boundary still has low confidence after context inspection.
- howards-end - Howards End (app/client/assets/temp-books/Howards End.txt). Start or end boundary still has low confidence after context inspection.
- hyacinth - The Toys of Peace, and Other Papers (app/client/assets/temp-books/HYACINTH.txt). Start or end boundary still has low confidence after context inspection.
- ...and 320 more in the JSON report.

## Protected Folder Confirmation

- `app/client/assets/temp-books` was read but not modified.
- `app/client/assets/books/generated` was read for comparison but not modified.
- `app/client/assets/books/cloudflare-export` was not modified.

## Next Processing Strategy

- Start with the exact pilot batch above and produce a per-book processing report before any larger batch.
- Low-risk books can later be processed in larger batches, around 20-50, after the pilot succeeds.
- Medium-risk books should remain in smaller batches, around 5-10, with explicit boundary and cleanup checks.
- High-risk books should be individual or near-individual until their structural issues are intentionally handled.
- Blocked books should not be processed until manually reviewed or replaced with valid source text.
- Continue audit passes until major red flags are fixed, quarantined, or intentionally accepted with documented rules.

## Machine-Readable Details

See `book-processing-audit-pass-2.json` for per-book start/end context, real-content risk flags, artifact verification, generated-output warning inspections, and pilot rationale.
