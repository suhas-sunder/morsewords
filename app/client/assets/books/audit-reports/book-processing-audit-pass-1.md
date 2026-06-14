# Book Processing Audit Pass 1

Generated: 2026-06-14T07:16:03.664Z

This is a read-only audit of the current raw/source book set. It does not rewrite processed books, raw source books, generated outputs, or Cloudflare exports.

## Totals

- Total source books/files found: 508
- Text sources found: 507
- Non-text sources found: 1
- Existing generated book manifests found: 74

## Risk Counts

| Risk | Count |
| --- | ---: |
| low | 16 |
| medium | 179 |
| high | 311 |
| blocked | 2 |

## Top Red-Flag Categories

| Category | Count | Examples |
| --- | ---: | --- |
| decorative-page-markers | 458 | moti: The Lilac Fairy Book<br>a-bread-and-butter-miss: The Toys of Peace, and Other Papers<br>a-catastrophe: A CATASTROPHE<br>a-deal-in-ostriches: The Stolen Bacillus and Other Incidents<br>a-fish-story: The Lilac Fairy Book<br>a-french-puck: The Lilac Fairy Book |
| dash-normalization-candidates | 331 | a-bread-and-butter-miss: The Toys of Peace, and Other Papers<br>a-catastrophe: A CATASTROPHE<br>a-dream-of-armageddon: Twelve Stories and a Dream<br>a-japanese-blossom: A Japanese Blossom<br>a-journal-of-the-plague-year: A Journal of the Plague Year<br>a-journey-to-the-centre-of-the-earth: A Journey to the Centre of the Earth |
| uncertain-end-boundary | 234 | moti: The Lilac Fairy Book<br>a-bread-and-butter-miss: The Toys of Peace, and Other Papers<br>a-catastrophe: A CATASTROPHE<br>a-deal-in-ostriches: The Stolen Bacillus and Other Incidents<br>a-fish-story: The Lilac Fairy Book<br>a-french-puck: The Lilac Fairy Book |
| table-of-contents | 142 | a-journey-to-the-centre-of-the-earth: A Journey to the Centre of the Earth<br>a-midsummer-night-s-dream: A Midsummer Night's Dream<br>a-room-with-a-view: A Room with a View<br>a-study-in-scarlet: A Study in Scarlet<br>a-tale-of-two-cities: A Tale of Two Cities<br>a-childs-garden-of-verses: A Child's Garden of Verses |
| illustration-image-placeholders | 96 | a-japanese-blossom: A Japanese Blossom<br>a-journal-of-the-plague-year: A Journal of the Plague Year<br>a-journey-to-the-centre-of-the-earth: A Journey to the Centre of the Earth<br>a-room-with-a-view: A Room with a View<br>a-childs-garden-of-verses: A Child's Garden of Verses<br>agamemnon-of-aeschylus: The Agamemnon of Aeschylus |
| footnote-reference-sections | 59 | a-bread-and-butter-miss: The Toys of Peace, and Other Papers<br>bertie-s-christmas-eve: The Toys of Peace, and Other Papers<br>candide: Candide<br>canossa: The Toys of Peace, and Other Papers<br>catriona: Catriona<br>dracula: Dracula |
| uncertain-start-boundary | 46 | a-catastrophe: A CATASTROPHE<br>a-slip-under-the-microscope: A SLIP UNDER THE MICROSCOPE<br>beyond-the-wall-of-sleep: Beyond the Wall of Sleep<br>celephais: Celephaïs<br>dagon: Dagon<br>from-beyond: From Beyond |
| numbered-bracket-references | 42 | a-journal-of-the-plague-year: A Journal of the Plague Year<br>a-journey-to-the-centre-of-the-earth: A Journey to the Centre of the Earth<br>a-story-of-the-stone-age: Tales of Space and Time<br>a-study-in-scarlet: A Study in Scarlet<br>agamemnon-of-aeschylus: The Agamemnon of Aeschylus<br>an-enquiry-concerning-human-understanding: An Enquiry Concerning Human Understanding |
| generated-output-warning | 28 | a-childs-garden-of-verses: A Child's Garden of Verses<br>a-christmas-carol: A Christmas Carol in Prose; Being a Ghost Story of Christmas<br>black-beauty: Black Beauty The autobiography of a horse<br>candide: Candide<br>crime-and-punishment: Crime and Punishment<br>don-quixote: Don Quixote |
| transcriber-editor-notes | 21 | a-childs-garden-of-verses: A Child's Garden of Verses<br>five-children-and-it: Five Children and It<br>four-day-planet: Four-Day Planet<br>goblin-tales-of-lancashire: Goblin Tales of Lancashire<br>hamlet: Hamlet<br>hero-myths-and-legends-of-the-british-race: Hero-Myths & Legends of the British Race |
| chapter-numbering-warning | 5 | anna-karenina: Anna Karenina<br>astounding-stories-of-super-science: Astounding Stories of Super-Science, October, 1930<br>quo-vadis: Quo Vadis: A Narrative of the Time of Nero<br>the-turmoil: The Turmoil: A Novel<br>twenty-years-after: Twenty years after |
| unicode-ocr-copy-paste-artifacts | 2 | agamemnon-of-aeschylus: The Agamemnon of Aeschylus<br>the-colour-out-of-space: The colour out of space |
| non-text-source | 1 | screenshot-2026-06-13-014010: Screenshot 2026-06-13 014010 |

## Blocked Books

- new-text-document - New Text Document (app/client/assets/temp-books/New Text Document.txt). Reasons: Source has fewer than 100 words.; Start or end boundary could not be identified.
- screenshot-2026-06-13-014010 - Screenshot 2026-06-13 014010 (app/client/assets/temp-books/Screenshot 2026-06-13 014010.png). Reasons: Source is not a text file.

## High-Risk Books

- moti - The Lilac Fairy Book (app/client/assets/temp-books/‘Moti’.txt). Reasons: Low-confidence end boundary.
- a-bread-and-butter-miss - The Toys of Peace, and Other Papers (app/client/assets/temp-books/A BREAD AND BUTTER MISS.txt). Reasons: Low-confidence end boundary.
- a-catastrophe - A CATASTROPHE (app/client/assets/temp-books/A CATASTROPHE.txt). Reasons: Low-confidence start boundary.; Low-confidence end boundary.
- a-deal-in-ostriches - The Stolen Bacillus and Other Incidents (app/client/assets/temp-books/A DEAL IN OSTRICHES.txt). Reasons: Low-confidence end boundary.
- a-fish-story - The Lilac Fairy Book (app/client/assets/temp-books/A Fish Story.txt). Reasons: Low-confidence end boundary.
- a-french-puck - The Lilac Fairy Book (app/client/assets/temp-books/A French Puck.txt). Reasons: Low-confidence end boundary.
- a-japanese-blossom - A Japanese Blossom (app/client/assets/temp-books/A Japanese Blossom.txt). Reasons: Many illustration/image placeholders.
- a-lost-paradise - The Lilac Fairy Book (app/client/assets/temp-books/A Lost Paradise.txt). Reasons: Low-confidence end boundary.
- a-moonlight-fable - The Door in the Wall And Other Stories (app/client/assets/temp-books/A MOONLIGHT FABLE.txt). Reasons: Low-confidence end boundary.
- a-moth-genus-novo - The Stolen Bacillus and Other Incidents (app/client/assets/temp-books/A MOTH--GENUS NOVO.txt). Reasons: Low-confidence end boundary.
- a-slip-under-the-microscope - A SLIP UNDER THE MICROSCOPE (app/client/assets/temp-books/A SLIP UNDER THE MICROSCOPE.txt). Reasons: Low-confidence start boundary.; Low-confidence end boundary.
- a-story-of-the-stone-age - Tales of Space and Time (app/client/assets/temp-books/A Story of the Stone Age.txt). Reasons: Dense numbered bracket references or footnote markers.
- a-tale-of-the-tontlawald - The Violet Fairy Book (app/client/assets/temp-books/A TALE OF THE TONTLAWALD.txt). Reasons: Low-confidence end boundary.
- a-childs-garden-of-verses - A Child's Garden of Verses (app/client/assets/temp-books/a-childs-garden-of-verses.txt). Reasons: Many illustration/image placeholders.; Existing generated output has possible boundary or footer damage.
- a-christmas-carol - A Christmas Carol in Prose; Being a Ghost Story of Christmas (app/client/assets/temp-books/a-christmas-carol.txt). Reasons: Existing generated output has possible boundary or footer damage.
- aepyornis-island - The Stolen Bacillus and Other Incidents (app/client/assets/temp-books/AEPYORNIS ISLAND.txt). Reasons: Low-confidence end boundary.
- an-enquiry-concerning-human-understanding - An Enquiry Concerning Human Understanding (app/client/assets/temp-books/An Enquiry Concerning Human Understanding.txt). Reasons: Dense numbered bracket references or footnote markers.
- anna-karenina - Anna Karenina (app/client/assets/temp-books/Anna Karenina.txt). Reasons: Possible malformed chapter numbering.
- ashputtel - Grimms' Fairy Tales (app/client/assets/temp-books/ASHPUTTEL.txt). Reasons: Low-confidence end boundary.
- astounding-stories-of-super-science - Astounding Stories of Super-Science, October, 1930 (app/client/assets/temp-books/Astounding Stories of Super-Science.txt). Reasons: Many decorative separators or page markers.; Possible malformed chapter numbering.
- beowulf-an-anglo-saxon-epic-poem - Beowulf: An Anglo-Saxon Epic Poem (app/client/assets/temp-books/Beowulf - An Anglo-Saxon Epic Poem.txt). Reasons: Dense numbered bracket references or footnote markers.
- bertie-s-christmas-eve - The Toys of Peace, and Other Papers (app/client/assets/temp-books/BERTIE’S CHRISTMAS EVE.txt). Reasons: Low-confidence end boundary.
- beyond-the-wall-of-sleep - Beyond the Wall of Sleep (app/client/assets/temp-books/Beyond the Wall of Sleep.txt). Reasons: Low-confidence start boundary.
- black-beauty - Black Beauty The autobiography of a horse (app/client/assets/temp-books/black-beauty.txt). Reasons: Existing generated output has possible boundary or footer damage.
- briar-rose - Grimms' Fairy Tales (app/client/assets/temp-books/BRIAR ROSE.txt). Reasons: Low-confidence end boundary.
- can-you-forgive-her - Can You Forgive Her? (app/client/assets/temp-books/Can You Forgive Her.txt). Reasons: Many illustration/image placeholders.
- candide - Candide (app/client/assets/temp-books/Candide.txt). Reasons: Dense numbered bracket references or footnote markers.; Existing generated output has possible boundary or footer damage.
- canossa - The Toys of Peace, and Other Papers (app/client/assets/temp-books/CANOSSA.txt). Reasons: Low-confidence end boundary.
- cat-and-mouse-in-partnership - Grimms' Fairy Tales (app/client/assets/temp-books/CAT AND MOUSE IN PARTNERSHIP.txt). Reasons: Low-confidence end boundary.
- cat-skin - Grimms' Fairy Tales (app/client/assets/temp-books/CAT-SKIN.txt). Reasons: Low-confidence end boundary.
- celephais - Celephaïs (app/client/assets/temp-books/Celephaïs.txt). Reasons: Low-confidence start boundary.
- clever-elsie - Grimms' Fairy Tales (app/client/assets/temp-books/CLEVER ELSIE.txt). Reasons: Low-confidence end boundary.
- clever-gretel - Grimms' Fairy Tales (app/client/assets/temp-books/CLEVER GRETEL.txt). Reasons: Low-confidence end boundary.
- clever-hans - Grimms' Fairy Tales (app/client/assets/temp-books/CLEVER HANS.txt). Reasons: Low-confidence end boundary.
- crime-and-punishment - Crime and Punishment (app/client/assets/temp-books/Crime and Punishment.txt). Reasons: Existing generated output has possible boundary or footer damage.
- dagon - Dagon (app/client/assets/temp-books/Dagon.txt). Reasons: Low-confidence start boundary.
- doctor-knowall - Grimms' Fairy Tales (app/client/assets/temp-books/DOCTOR KNOWALL.txt). Reasons: Low-confidence end boundary.
- don-quixote - Don Quixote (app/client/assets/temp-books/Don Quixote.txt). Reasons: Existing generated output has possible boundary or footer damage.
- dr-jekyll-and-mr-hyde - The strange case of Dr. Jekyll and Mr. Hyde (app/client/assets/temp-books/Dr. Jekyll and Mr. Hyde.txt). Reasons: Existing generated output has possible boundary or footer damage.
- dracula - Dracula (app/client/assets/temp-books/Dracula.txt). Reasons: Many decorative separators or page markers.
- elder-tree-mother - Hans Andersen's Fairy Tales. First Series (app/client/assets/temp-books/ELDER-TREE MOTHER.txt). Reasons: Low-confidence end boundary.
- emma - Emma (app/client/assets/temp-books/Emma.txt). Reasons: Low-confidence end boundary.
- erewhon-or-over-the-range - Erewhon; Or, Over the Range (app/client/assets/temp-books/Erewhon; Or, Over the Range.txt). Reasons: Low-confidence end boundary.
- excepting-mrs-pentherby - The Toys of Peace, and Other Papers (app/client/assets/temp-books/EXCEPTING MRS. PENTHERBY.txt). Reasons: Low-confidence end boundary.
- fate - The Toys of Peace, and Other Papers (app/client/assets/temp-books/FATE.txt). Reasons: Low-confidence end boundary.
- figures-of-earth-a-comedy-of-appearances - Figures of Earth: A Comedy of Appearances (app/client/assets/temp-books/Figures of Earth - A Comedy of Appearances.txt). Reasons: Low-confidence end boundary.; Many illustration/image placeholders.
- filmer - Twelve Stories and a Dream (app/client/assets/temp-books/FILMER.txt). Reasons: Low-confidence end boundary.
- five-children-and-it - Five Children and It (app/client/assets/temp-books/Five Children and It.txt). Reasons: Many illustration/image placeholders.
- five-little-friends - Five Little Friends (app/client/assets/temp-books/Five Little Friends.txt). Reasons: Many illustration/image placeholders.
- five-little-peppers-and-how-they-grew - Five Little Peppers and How They Grew (app/client/assets/temp-books/five-little-peppers-and-how-they-grew.txt). Reasons: Existing generated output has possible boundary or footer damage.
- flatland-a-romance-of-many-dimensions - Flatland: A Romance of Many Dimensions (app/client/assets/temp-books/Flatland - A Romance of Many Dimensions.txt). Reasons: Many decorative separators or page markers.
- forewarned - The Toys of Peace, and Other Papers (app/client/assets/temp-books/FOREWARNED.txt). Reasons: Low-confidence end boundary.
- frederick-and-catherine - Grimms' Fairy Tales (app/client/assets/temp-books/FREDERICK AND CATHERINE.txt). Reasons: Low-confidence end boundary.
- from-beyond - From Beyond (app/client/assets/temp-books/From Beyond.txt). Reasons: Low-confidence start boundary.
- fundevogel - Grimms' Fairy Tales (app/client/assets/temp-books/FUNDEVOGEL.txt). Reasons: Low-confidence end boundary.
- great-expectations - Great Expectations (app/client/assets/temp-books/Great Expectations.txt). Reasons: Low-confidence end boundary.
- grimm-s-fairy-tales - Grimm's Fairy Tales (app/client/assets/temp-books/Grimm's Fairy Tales.txt). Reasons: Existing generated output has possible boundary or footer damage.
- gulliver-s-travels - Gulliver's Travels into Several Remote Nations of the World (app/client/assets/temp-books/Gulliver's Travels.txt). Reasons: Existing generated output has possible boundary or footer damage.
- hamlet - Hamlet (app/client/assets/temp-books/Hamlet.txt). Reasons: Dense numbered bracket references or footnote markers.; Multiple footnote/reference sections.
- hans-in-luck - Grimms' Fairy Tales (app/client/assets/temp-books/HANS IN LUCK.txt). Reasons: Low-confidence end boundary.
- hansel-and-gretel - Grimms' Fairy Tales (app/client/assets/temp-books/HANSEL AND GRETEL.txt). Reasons: Low-confidence end boundary.
- herland - Herland (app/client/assets/temp-books/Herland.txt). Reasons: Low-confidence end boundary.
- hero-myths-and-legends-of-the-british-race - Hero-Myths & Legends of the British Race (app/client/assets/temp-books/Hero-Myths & Legends of the British Race.txt). Reasons: Many illustration/image placeholders.; Multiple footnote/reference sections.; Multiple transcriber/editor note ranges.
- how-a-fish-swam-in-the-air-and-a-hare-in-the-water - The Violet Fairy Book (app/client/assets/temp-books/HOW A FISH SWAM IN THE AIR AND A HARE IN THE WATER.txt). Reasons: Low-confidence end boundary.
- how-an-old-man-lost-his-wen - Japanese Fairy Tales (app/client/assets/temp-books/HOW AN OLD MAN LOST HIS WEN.txt). Reasons: Low-confidence end boundary.
- how-brave-walter-hunted-wolves - The Lilac Fairy Book (app/client/assets/temp-books/How Brave Walter Hunted Wolves.txt). Reasons: Low-confidence end boundary.
- howards-end - Howards End (app/client/assets/temp-books/Howards End.txt). Reasons: Low-confidence end boundary.
- hyacinth - The Toys of Peace, and Other Papers (app/client/assets/temp-books/HYACINTH.txt). Reasons: Low-confidence end boundary.
- hypnos - Hypnos (app/client/assets/temp-books/Hypnos.txt). Reasons: Low-confidence start boundary.
- ibid - Ibid (app/client/assets/temp-books/Ibid.txt). Reasons: Low-confidence start boundary.; Low-confidence end boundary.
- in-the-abyss - IN THE ABYSS (app/client/assets/temp-books/IN THE ABYSS.txt). Reasons: Low-confidence start boundary.
- in-the-avu-observatory - The Stolen Bacillus and Other Incidents (app/client/assets/temp-books/IN THE AVU OBSERVATORY.txt). Reasons: Low-confidence end boundary.
- in-the-modern-vein - IN THE MODERN VEIN (app/client/assets/temp-books/IN THE MODERN VEIN.txt). Reasons: Low-confidence start boundary.
- in-the-vault - In the Vault (app/client/assets/temp-books/In the Vault.txt). Reasons: Low-confidence start boundary.; Low-confidence end boundary.
- iron-hans - Grimms' Fairy Tales (app/client/assets/temp-books/IRON HANS.txt). Reasons: Low-confidence end boundary.
- jane-eyre - Jane Eyre: An Autobiography (app/client/assets/temp-books/Jane Eyre.txt). Reasons: Existing generated output has possible boundary or footer damage.
- jesper-who-herded-the-hares - The Violet Fairy Book (app/client/assets/temp-books/JESPER WHO HERDED THE HARES.txt). Reasons: Low-confidence end boundary.
- jorinda-and-jorindel - Grimms' Fairy Tales (app/client/assets/temp-books/JORINDA AND JORINDEL.txt). Reasons: Low-confidence end boundary.
- kidnapped - Kidnapped (app/client/assets/temp-books/Kidnapped.txt). Reasons: Dense numbered bracket references or footnote markers.
- king-grisly-beard - Grimms' Fairy Tales (app/client/assets/temp-books/KING GRISLY-BEARD.txt). Reasons: Low-confidence end boundary.
- les-miserables - Les Misérables (app/client/assets/temp-books/Les Misérables.txt). Reasons: Many illustration/image placeholders.; Multiple footnote/reference sections.; Existing generated output has possible boundary or footer damage.
- little-ida-s-flowers - Hans Andersen's Fairy Tales. First Series (app/client/assets/temp-books/LITTLE IDA'S FLOWERS.txt). Reasons: Low-confidence end boundary.
- little-lasse - The Lilac Fairy Book (app/client/assets/temp-books/Little Lasse.txt). Reasons: Low-confidence end boundary.
- little-red-riding-hood - Grimms' Fairy Tales (app/client/assets/temp-books/LITTLE RED RIDING HOOD.txt). Reasons: Low-confidence end boundary.
- little-thumbelina - Hans Andersen's Fairy Tales. First Series (app/client/assets/temp-books/LITTLE THUMBELINA.txt). Reasons: Low-confidence end boundary.
- little-women - Little Women; Or, Meg, Jo, Beth, and Amy (app/client/assets/temp-books/Little Women.txt). Reasons: Many illustration/image placeholders.; Existing generated output has possible boundary or footer damage.
- louis - The Toys of Peace, and Other Papers (app/client/assets/temp-books/LOUIS.txt). Reasons: Low-confidence end boundary.
- louise - The Toys of Peace, and Other Papers (app/client/assets/temp-books/Louise.txt). Reasons: Low-confidence end boundary.
- mark - The Toys of Peace, and Other Papers (app/client/assets/temp-books/MARK.txt). Reasons: Low-confidence end boundary.
- mogarzea-and-his-son - The Violet Fairy Book (app/client/assets/temp-books/MOGARZEA AND HIS SON.txt). Reasons: Low-confidence end boundary.
- morlvera - The Toys of Peace, and Other Papers (app/client/assets/temp-books/MORLVERA.txt). Reasons: Low-confidence end boundary.
- mother-holle - Grimms' Fairy Tales (app/client/assets/temp-books/MOTHER HOLLE.txt). Reasons: Low-confidence end boundary.
- mr-brisher-s-treasure - Twelve Stories and a Dream (app/client/assets/temp-books/MR. BRISHER'S TREASURE.txt). Reasons: Low-confidence end boundary.
- mr-skelmersdale-in-fairyland - Twelve Stories and a Dream (app/client/assets/temp-books/MR. SKELMERSDALE IN FAIRYLAND.txt). Reasons: Low-confidence end boundary.
- murder-in-the-maze - Murder in the maze (app/client/assets/temp-books/Murder in the Maze.txt). Reasons: Low-confidence end boundary.
- my-lord-bag-of-rice - Japanese Fairy Tales (app/client/assets/temp-books/MY LORD BAG OF RICE.txt). Reasons: Low-confidence end boundary.
- new-treasure-seekers - New Treasure Seekers; Or, The Bastable Children in Search of a Fortune (app/client/assets/temp-books/new-treasure-seekers.txt). Reasons: Many illustration/image placeholders.; Existing generated output has possible boundary or footer damage.
- north-and-south - North and South (app/client/assets/temp-books/North and South.txt). Reasons: Low-confidence end boundary.
- nyarlathotep - Nyarlathotep (app/client/assets/temp-books/Nyarlathotep.txt). Reasons: Low-confidence start boundary.; Low-confidence end boundary.
- old-sultan - Grimms' Fairy Tales (app/client/assets/temp-books/OLD SULTAN.txt). Reasons: Low-confidence end boundary.
- ole-luk-oie-the-dream-god - Hans Andersen's Fairy Tales. First Series (app/client/assets/temp-books/OLE-LUK-OIE THE DREAM GOD.txt). Reasons: Low-confidence end boundary.
- parnassus-on-wheels - Parnassus on Wheels (app/client/assets/temp-books/Parnassus on Wheels.txt). Reasons: Low-confidence end boundary.
- pickman-s-model - Pickman's Model (app/client/assets/temp-books/Pickman's Model.txt). Reasons: Low-confidence start boundary.
- plays-of-sophocles-oedipus-the-king-oedipus-at-colonus-antigone - Plays of Sophocles: Oedipus the King; Oedipus at Colonus; Antigone (app/client/assets/temp-books/Plays of Sophocles - Oedipus the King; Oedipus at Colonus; Antigone.txt). Reasons: Multiple footnote/reference sections.
- polaris - Polaris (app/client/assets/temp-books/Polaris.txt). Reasons: Low-confidence start boundary.; Low-confidence end boundary.
- pollock-and-the-porroh-man - POLLOCK AND THE PORROH MAN (app/client/assets/temp-books/POLLOCK AND THE PORROH MAN.txt). Reasons: Low-confidence start boundary.
- pride-and-prejudice - Pride and Prejudice (app/client/assets/temp-books/Pride and Prejudice.txt). Reasons: Many illustration/image placeholders.
- quail-seed - The Toys of Peace, and Other Papers (app/client/assets/temp-books/QUAIL SEED.txt). Reasons: Low-confidence end boundary.
- quo-vadis - Quo Vadis: A Narrative of the Time of Nero (app/client/assets/temp-books/Quo Vadis.txt). Reasons: Possible malformed chapter numbering.
- rainbow-valley - Rainbow Valley (app/client/assets/temp-books/rainbow-valley.txt). Reasons: Existing generated output has possible boundary or footer damage.
- rapunzel - Grimms' Fairy Tales (app/client/assets/temp-books/RAPUNZEL.txt). Reasons: Low-confidence end boundary.
- rinkitink-in-oz - Rinkitink in Oz (app/client/assets/temp-books/rinkitink-in-oz.txt). Reasons: Many illustration/image placeholders.; Existing generated output has possible boundary or footer damage.
- rumpelstiltskin - Grimms' Fairy Tales (app/client/assets/temp-books/RUMPELSTILTSKIN.txt). Reasons: Low-confidence end boundary.
- shen-of-the-sea-a-book-for-children - Shen of the Sea: A Book for Children (app/client/assets/temp-books/Shen of the Sea - A Book for Children.txt). Reasons: Many illustration/image placeholders.
- shock-tactics - The Toys of Peace, and Other Papers (app/client/assets/temp-books/SHOCK TACTICS.txt). Reasons: Low-confidence end boundary.
- snow-white-and-rose-red - Grimms' Fairy Tales (app/client/assets/temp-books/SNOW-WHITE AND ROSE-RED.txt). Reasons: Low-confidence end boundary.
- snowdrop - Grimms' Fairy Tales (app/client/assets/temp-books/SNOWDROP.txt). Reasons: Low-confidence end boundary.
- stan-bolovan - The Violet Fairy Book (app/client/assets/temp-books/STAN BOLOVAN.txt). Reasons: Low-confidence end boundary.
- sun-tzu-on-the-art-of-war - Sun Tzŭ on the Art of War: The Oldest Military Treatise in the World (app/client/assets/temp-books/Sun Tzŭ on the Art of War.txt). Reasons: Dense numbered bracket references or footnote markers.; Existing generated output has possible boundary or footer damage.
- sunshine-stories - Hans Andersen's Fairy Tales. First Series (app/client/assets/temp-books/SUNSHINE STORIES.txt). Reasons: Low-confidence end boundary.
- sweetheart-roland - Grimms' Fairy Tales (app/client/assets/temp-books/SWEETHEART ROLAND.txt). Reasons: Low-confidence end boundary.
- tea - The Toys of Peace, and Other Papers (app/client/assets/temp-books/Tea.txt). Reasons: Low-confidence end boundary.
- the-shinansha-or-the-south-pointing-carriage - Japanese Fairy Tales (app/client/assets/temp-books/THE “SHINANSHA,” OR THE SOUTH POINTING CARRIAGE.txt). Reasons: Low-confidence end boundary.
- the-adventures-of-chanticleer-and-partlet - Grimms' Fairy Tales (app/client/assets/temp-books/THE ADVENTURES OF CHANTICLEER AND PARTLET.txt). Reasons: Low-confidence end boundary.
- the-alchemist - The Alchemist (app/client/assets/temp-books/The Alchemist.txt). Reasons: Low-confidence start boundary.; Low-confidence end boundary.
- the-apple - THE APPLE (app/client/assets/temp-books/THE APPLE.txt). Reasons: Low-confidence start boundary.
- the-arabian-nights-entertainments - The Arabian Nights Entertainments (app/client/assets/temp-books/The Arabian Nights Entertainments.txt). Reasons: Low-confidence end boundary.
- the-argonauts-of-the-air - THE ARGONAUTS OF THE AIR (app/client/assets/temp-books/THE ARGONAUTS OF THE AIR.txt). Reasons: Low-confidence start boundary.
- the-art-of-war - The Art of War (app/client/assets/temp-books/The Art of War.txt). Reasons: Dense numbered bracket references or footnote markers.; Multiple footnote/reference sections.; Existing generated output has possible boundary or footer damage.
- the-bamboo-cutter-and-the-moon-child - Japanese Fairy Tales (app/client/assets/temp-books/THE BAMBOO-CUTTER AND THE MOON-CHILD.txt). Reasons: Low-confidence end boundary.
- the-battle-of-the-birds - The Lilac Fairy Book (app/client/assets/temp-books/The Battle of the Birds.txt). Reasons: Low-confidence end boundary.
- the-beast-in-the-cave - The Beast in the Cave (app/client/assets/temp-books/The Beast in the Cave.txt). Reasons: Low-confidence start boundary.; Low-confidence end boundary.
- the-believing-husbands - The Lilac Fairy Book (app/client/assets/temp-books/The Believing Husbands.txt). Reasons: Low-confidence end boundary.
- the-blue-light - Grimms' Fairy Tales (app/client/assets/temp-books/THE BLUE LIGHT.txt). Reasons: Low-confidence end boundary.
- the-bones-of-djulung - The Lilac Fairy Book (app/client/assets/temp-books/The Bones of Djulung.txt). Reasons: Low-confidence end boundary.
- the-brothers-karamazov - The Brothers Karamazov (app/client/assets/temp-books/The Brothers Karamazov.txt). Reasons: Multiple footnote/reference sections.
- the-brown-bear-of-norway - The Lilac Fairy Book (app/client/assets/temp-books/The Brown Bear of Norway.txt). Reasons: Low-confidence end boundary.
- the-brownie-of-the-lake - The Lilac Fairy Book (app/client/assets/temp-books/The Brownie of the Lake.txt). Reasons: Low-confidence end boundary.
- the-bull - The Toys of Peace, and Other Papers (app/client/assets/temp-books/THE BULL.txt). Reasons: Low-confidence end boundary.
- the-call-of-cthulhu - The call of Cthulhu (app/client/assets/temp-books/The call of Cthulhu.txt). Reasons: Existing generated output has possible boundary or footer damage.
- the-castle-of-kerglas - The Lilac Fairy Book (app/client/assets/temp-books/The Castle of Kerglas.txt). Reasons: Low-confidence end boundary.
- the-cats-of-ulthar - The Cats of Ulthar (app/client/assets/temp-books/The Cats of Ulthar.txt). Reasons: Low-confidence start boundary.
- the-conceited-apple-branch - Hans Andersen's Fairy Tales. First Series (app/client/assets/temp-books/THE CONCEITED APPLE BRANCH.txt). Reasons: Low-confidence end boundary.
- the-cone - The Door in the Wall And Other Stories (app/client/assets/temp-books/THE CONE.txt). Reasons: Low-confidence end boundary.
- the-countess-of-pembroke-s-arcadia - The Countess of Pembroke's Arcadia (app/client/assets/temp-books/The Countess of Pembroke's Arcadia.txt). Reasons: Multiple footnote/reference sections.
- the-country-of-the-blind - The Door in the Wall And Other Stories (app/client/assets/temp-books/THE COUNTRY OF THE BLIND.txt). Reasons: Low-confidence end boundary.
- the-crystal-egg - Tales of Space and Time (app/client/assets/temp-books/THE CRYSTAL EGG.txt). Reasons: Low-confidence end boundary.; Dense numbered bracket references or footnote markers.
- the-darning-needle - Hans Andersen's Fairy Tales. First Series (app/client/assets/temp-books/THE DARNING-NEEDLE.txt). Reasons: Low-confidence end boundary.
- the-diamond-maker - The Stolen Bacillus and Other Incidents (app/client/assets/temp-books/THE DIAMOND MAKER.txt). Reasons: Low-confidence end boundary.
- the-disappearance-of-crispina-umberleigh - The Toys of Peace, and Other Papers (app/client/assets/temp-books/THE DISAPPEARANCE OF CRISPINA UMBERLEIGH.txt). Reasons: Low-confidence end boundary.
- the-doom-that-came-to-sarnath - The Doom That Came to Sarnath (app/client/assets/temp-books/The Doom That Came to Sarnath.txt). Reasons: Low-confidence start boundary.; Low-confidence end boundary.
- the-dream-quest-of-unknown-kadath - The Dream-Quest of Unknown Kadath (app/client/assets/temp-books/The Dream-Quest of Unknown Kadath.txt). Reasons: Low-confidence start boundary.; Low-confidence end boundary.
- the-dreams-in-the-witch-house - The Dreams in the Witch-House (app/client/assets/temp-books/The Dreams in the Witch-House.txt). Reasons: Low-confidence start boundary.
- the-elements-of-style - The Elements of Style (app/client/assets/temp-books/The Elements of Style.txt). Reasons: Existing generated output has possible boundary or footer damage.
- the-elves-and-the-shoemaker - Grimms' Fairy Tales (app/client/assets/temp-books/THE ELVES AND THE SHOEMAKER.txt). Reasons: Low-confidence end boundary.
- the-enchanted-deer - The Lilac Fairy Book (app/client/assets/temp-books/The Enchanted Deer.txt). Reasons: Low-confidence end boundary.
- the-enchanted-knife - The Violet Fairy Book (app/client/assets/temp-books/THE ENCHANTED KNIFE.txt). Reasons: Low-confidence end boundary.
- the-envious-neighbour - The Violet Fairy Book (app/client/assets/temp-books/THE ENVIOUS NEIGHBOUR.txt). Reasons: Low-confidence end boundary.
- the-escape-of-the-mouse - The Lilac Fairy Book (app/client/assets/temp-books/The Escape of the Mouse.txt). Reasons: Low-confidence end boundary.
- the-fairy-nurse - The Lilac Fairy Book (app/client/assets/temp-books/The Fairy Nurse.txt). Reasons: Low-confidence end boundary.
- the-fairy-of-the-dawn - The Violet Fairy Book (app/client/assets/temp-books/THE FAIRY OF THE DAWN.txt). Reasons: Low-confidence end boundary.
- the-false-prince-and-the-true - The Lilac Fairy Book (app/client/assets/temp-books/The False Prince and the True.txt). Reasons: Low-confidence end boundary.
- the-federalist-papers - The Federalist Papers (app/client/assets/temp-books/The Federalist Papers.txt). Reasons: Dense numbered bracket references or footnote markers.; Existing generated output has possible boundary or footer damage.
- the-finest-liar-in-the-world - The Violet Fairy Book (app/client/assets/temp-books/THE FINEST LIAR IN THE WORLD.txt). Reasons: Low-confidence end boundary.
- the-fisherman-and-his-wife - Grimms' Fairy Tales (app/client/assets/temp-books/THE FISHERMAN AND HIS WIFE.txt). Reasons: Low-confidence end boundary.
- the-flowering-of-the-strange-orchid - The Stolen Bacillus and Other Incidents (app/client/assets/temp-books/THE FLOWERING OF THE STRANGE ORCHID.txt). Reasons: Low-confidence end boundary.
- the-flying-man - The Stolen Bacillus and Other Incidents (app/client/assets/temp-books/THE FLYING MAN.txt). Reasons: Low-confidence end boundary.
- the-four-clever-brothers - Grimms' Fairy Tales (app/client/assets/temp-books/THE FOUR CLEVER BROTHERS.txt). Reasons: Low-confidence end boundary.
- the-four-gifts - The Lilac Fairy Book (app/client/assets/temp-books/The Four Gifts.txt). Reasons: Low-confidence end boundary.
- the-fox-and-the-cat - Grimms' Fairy Tales (app/client/assets/temp-books/THE FOX AND THE CAT.txt). Reasons: Low-confidence end boundary.
- the-fox-and-the-horse - Grimms' Fairy Tales (app/client/assets/temp-books/THE FOX AND THE HORSE.txt). Reasons: Low-confidence end boundary.
- the-frog-prince - Grimms' Fairy Tales (app/client/assets/temp-books/THE FROG-PRINCE.txt). Reasons: Low-confidence end boundary.
- the-frog - The Violet Fairy Book (app/client/assets/temp-books/THE FROG.txt). Reasons: Low-confidence end boundary.
- the-girl-who-pretended-to-be-a-boy - The Violet Fairy Book (app/client/assets/temp-books/THE GIRL WHO PRETENDED TO BE A BOY.txt). Reasons: Low-confidence end boundary.
- the-goat-s-ears-of-the-emperor-trojan - The Violet Fairy Book (app/client/assets/temp-books/THE GOAT’S EARS OF THE EMPEROR TROJAN.txt). Reasons: Low-confidence end boundary.
- the-goblin-of-adachigahara - Japanese Fairy Tales (app/client/assets/temp-books/THE GOBLIN OF ADACHIGAHARA.txt). Reasons: Low-confidence end boundary.
- the-golden-bird - Grimms' Fairy Tales (app/client/assets/temp-books/THE GOLDEN BIRD.txt). Reasons: Low-confidence end boundary.
- the-goose-girl - Grimms' Fairy Tales (app/client/assets/temp-books/THE GOOSE-GIRL.txt). Reasons: Low-confidence end boundary.
- the-greenies - Hans Andersen's Fairy Tales. First Series (app/client/assets/temp-books/THE GREENIES.txt). Reasons: Low-confidence end boundary.
- the-guests - The Toys of Peace, and Other Papers (app/client/assets/temp-books/THE GUESTS.txt). Reasons: Low-confidence end boundary.
- the-hammerpond-park-burglary - The Stolen Bacillus and Other Incidents (app/client/assets/temp-books/THE HAMMERPOND PARK BURGLARY.txt). Reasons: Low-confidence end boundary.
- the-happy-family - The Happy Family (app/client/assets/temp-books/The Happy Family.txt). Reasons: Existing generated output has possible boundary or footer damage.
- the-happy-hunter-and-the-skillful-fisher - Japanese Fairy Tales (app/client/assets/temp-books/THE HAPPY HUNTER AND THE SKILLFUL FISHER.txt). Reasons: Low-confidence end boundary.
- the-heart-of-a-monkey - The Lilac Fairy Book (app/client/assets/temp-books/The Heart of a Monkey.txt). Reasons: Low-confidence end boundary.
- the-hedgehog - The Toys of Peace, and Other Papers (app/client/assets/temp-books/THE HEDGEHOG.txt). Reasons: Low-confidence end boundary.
- the-history-of-dwarf-long-nose - The Violet Fairy Book (app/client/assets/temp-books/THE HISTORY OF DWARF LONG NOSE.txt). Reasons: Low-confidence end boundary.
- the-hoodie-crow - The Lilac Fairy Book (app/client/assets/temp-books/The Hoodie-Crow.txt). Reasons: Low-confidence end boundary.
- the-hound - The Hound (app/client/assets/temp-books/The Hound.txt). Reasons: Low-confidence start boundary.; Low-confidence end boundary.
- the-house-of-arden-a-story-for-children - The House of Arden: A Story for Children (app/client/assets/temp-books/The House of Arden - A Story for Children.txt). Reasons: Many illustration/image placeholders.
- the-iliad - The Iliad (app/client/assets/temp-books/The Iliad.txt). Reasons: Many illustration/image placeholders.; Dense numbered bracket references or footnote markers.
- the-image-of-the-lost-soul - The Toys of Peace, and Other Papers (app/client/assets/temp-books/THE IMAGE OF THE LOST SOUL.txt). Reasons: Low-confidence end boundary.
- the-interlopers - The Toys of Peace, and Other Papers (app/client/assets/temp-books/THE INTERLOPERS.txt). Reasons: Low-confidence end boundary.
- the-jelly-fish-and-the-monkey - Japanese Fairy Tales (app/client/assets/temp-books/THE JELLY FISH AND THE MONKEY.txt). Reasons: Low-confidence end boundary.
- the-jilting-of-jane - THE JILTING OF JANE (app/client/assets/temp-books/THE JILTING OF JANE.txt). Reasons: Low-confidence start boundary.; Low-confidence end boundary.
- the-jogi-s-punishment - The Lilac Fairy Book (app/client/assets/temp-books/The Jogi’s Punishment.txt). Reasons: Low-confidence end boundary.
- the-jungle-book - The Jungle Book (app/client/assets/temp-books/The Jungle Book.txt). Reasons: Existing generated output has possible boundary or footer damage.
- the-juniper-tree - Grimms' Fairy Tales (app/client/assets/temp-books/THE JUNIPER-TREE.txt). Reasons: Low-confidence end boundary.
- the-king-of-the-golden-mountain - Grimms' Fairy Tales (app/client/assets/temp-books/THE KING OF THE GOLDEN MOUNTAIN.txt). Reasons: Low-confidence end boundary.
- the-king-of-the-waterfalls - The Lilac Fairy Book (app/client/assets/temp-books/The King of the Waterfalls.txt). Reasons: Low-confidence end boundary.
- the-lady-of-the-fountain - The Lilac Fairy Book (app/client/assets/temp-books/The Lady of the Fountain.txt). Reasons: Low-confidence end boundary.
- the-leaping-match - Hans Andersen's Fairy Tales. First Series (app/client/assets/temp-books/THE LEAPING MATCH.txt). Reasons: Low-confidence end boundary.
- the-little-peasant - Grimms' Fairy Tales (app/client/assets/temp-books/THE LITTLE PEASANT.txt). Reasons: Low-confidence end boundary.
- the-lord-of-the-dynamos - The Stolen Bacillus and Other Incidents (app/client/assets/temp-books/THE LORD OF THE DYNAMOS.txt). Reasons: Low-confidence end boundary.
- the-lost-inheritance - THE LOST INHERITANCE (app/client/assets/temp-books/THE LOST INHERITANCE.txt). Reasons: Low-confidence start boundary.
- the-loving-pair - Hans Andersen's Fairy Tales. First Series (app/client/assets/temp-books/THE LOVING PAIR.txt). Reasons: Low-confidence end boundary.
- the-lute-player - The Violet Fairy Book (app/client/assets/temp-books/THE LUTE PLAYER.txt). Reasons: Low-confidence end boundary.
- the-magic-shop - Twelve Stories and a Dream (app/client/assets/temp-books/THE MAGIC SHOP.txt). Reasons: Low-confidence end boundary.
- the-maiden-with-the-wooden-helmet - The Violet Fairy Book (app/client/assets/temp-books/THE MAIDEN WITH THE WOODEN HELMET.txt). Reasons: Low-confidence end boundary.
- the-man-who-could-work-miracles - Tales of Space and Time (app/client/assets/temp-books/The Man Who Could Work Miracles.txt). Reasons: Low-confidence end boundary.
- the-mappined-life - The Toys of Peace, and Other Papers (app/client/assets/temp-books/THE MAPPINED LIFE.txt). Reasons: Low-confidence end boundary.
- the-mirror-of-matsuyama - Japanese Fairy Tales (app/client/assets/temp-books/THE MIRROR OF MATSUYAMA.txt). Reasons: Low-confidence end boundary.
- the-miser-in-the-bush - Grimms' Fairy Tales (app/client/assets/temp-books/THE MISER IN THE BUSH.txt). Reasons: Low-confidence end boundary.
- the-monkey-and-the-jelly-fish - The Violet Fairy Book (app/client/assets/temp-books/THE MONKEY AND THE JELLY-FISH.txt). Reasons: Low-confidence end boundary.
- the-moon-bog - The Moon-Bog (app/client/assets/temp-books/The Moon-Bog.txt). Reasons: Low-confidence start boundary.; Low-confidence end boundary.
- the-mouse-the-bird-and-the-sausage - Grimms' Fairy Tales (app/client/assets/temp-books/THE MOUSE, THE BIRD, AND THE SAUSAGE.txt). Reasons: Low-confidence end boundary.
- the-nameless-city - The Nameless City (app/client/assets/temp-books/The Nameless City.txt). Reasons: Low-confidence start boundary.
- the-new-accelerator - Twelve Stories and a Dream (app/client/assets/temp-books/THE NEW ACCELERATOR.txt). Reasons: Low-confidence end boundary.
- the-nine-pea-hens-and-the-golden-apples - The Violet Fairy Book (app/client/assets/temp-books/THE NINE PEA-HENS AND THE GOLDEN APPLES.txt). Reasons: Low-confidence end boundary.
- the-nunda-eater-of-people - The Violet Fairy Book (app/client/assets/temp-books/THE NUNDA, EATER OF PEOPLE.txt). Reasons: Low-confidence end boundary.
- the-occasional-garden - The Toys of Peace, and Other Papers (app/client/assets/temp-books/THE OCCASIONAL GARDEN.txt). Reasons: Low-confidence end boundary.
- the-odyssey - The Odyssey (app/client/assets/temp-books/The Odyssey.txt). Reasons: Dense numbered bracket references or footnote markers.; Multiple footnote/reference sections.
- the-ogre-of-rashomon - Japanese Fairy Tales (app/client/assets/temp-books/THE OGRE OF RASHOMON.txt). Reasons: Low-confidence end boundary.
- the-old-man-and-his-grandson - Grimms' Fairy Tales (app/client/assets/temp-books/THE OLD MAN AND HIS GRANDSON.txt). Reasons: Low-confidence end boundary.
- the-one-handed-girl - The Lilac Fairy Book (app/client/assets/temp-books/The One-Handed Girl.txt). Reasons: Low-confidence end boundary.
- the-other-gods - The Other Gods (app/client/assets/temp-books/The Other Gods.txt). Reasons: Low-confidence start boundary.; Low-confidence end boundary.
- the-outsider - The Outsider (app/client/assets/temp-books/The Outsider.txt). Reasons: Low-confidence start boundary.; Low-confidence end boundary.
- the-oversight - The Toys of Peace, and Other Papers (app/client/assets/temp-books/THE OVERSIGHT.txt). Reasons: Low-confidence end boundary.
- the-penance - The Toys of Peace, and Other Papers (app/client/assets/temp-books/THE PENANCE.txt). Reasons: Low-confidence end boundary.
- the-phantom-luncheon - The Toys of Peace, and Other Papers (app/client/assets/temp-books/THE PHANTOM LUNCHEON.txt). Reasons: Low-confidence end boundary.
- the-pink - Grimms' Fairy Tales (app/client/assets/temp-books/THE PINK.txt). Reasons: Low-confidence end boundary.
- the-plattner-story - THE PLATTNER STORY (app/client/assets/temp-books/THE PLATTNER STORY.txt). Reasons: Low-confidence start boundary.
- the-princess-who-was-hidden-underground - The Violet Fairy Book (app/client/assets/temp-books/THE PRINCESS WHO WAS HIDDEN UNDERGROUND.txt). Reasons: Low-confidence end boundary.
- the-purple-of-the-balkan-kings - The Toys of Peace, and Other Papers (app/client/assets/temp-books/THE PURPLE OF THE BALKAN KINGS.txt). Reasons: Low-confidence end boundary.
- the-purple-pileus - THE PURPLE PILEUS (app/client/assets/temp-books/THE PURPLE PILEUS.txt). Reasons: Low-confidence start boundary.; Low-confidence end boundary.
- the-queen-bee - Grimms' Fairy Tales (app/client/assets/temp-books/THE QUEEN BEE.txt). Reasons: Low-confidence end boundary.
- the-raspberry-worm - The Lilac Fairy Book (app/client/assets/temp-books/The Raspberry Worm.txt). Reasons: Low-confidence end boundary.
- the-raven - Grimms' Fairy Tales (app/client/assets/temp-books/THE RAVEN.txt). Reasons: Low-confidence end boundary.
- the-remarkable-case-of-davidson-s-eyes - The Stolen Bacillus and Other Incidents (app/client/assets/temp-books/THE REMARKABLE CASE OF DAVIDSON'S EYES.txt). Reasons: Low-confidence end boundary.
- the-robber-bridegroom - Grimms' Fairy Tales (app/client/assets/temp-books/THE ROBBER BRIDEGROOM.txt). Reasons: Low-confidence end boundary.
- the-roses-and-the-sparrows - Hans Andersen's Fairy Tales. First Series (app/client/assets/temp-books/THE ROSES AND THE SPARROWS.txt). Reasons: Low-confidence end boundary.
- the-sad-story-of-a-dramatic-critic - THE SAD STORY OF A DRAMATIC CRITIC (app/client/assets/temp-books/THE SAD STORY OF A DRAMATIC CRITIC.txt). Reasons: Low-confidence start boundary.
- the-sagacious-monkey-and-the-boar - Japanese Fairy Tales (app/client/assets/temp-books/THE SAGACIOUS MONKEY AND THE BOAR.txt). Reasons: Low-confidence end boundary.
- the-salad - Grimms' Fairy Tales (app/client/assets/temp-books/THE SALAD.txt). Reasons: Low-confidence end boundary.
- the-scarlet-letter - The Scarlet Letter (app/client/assets/temp-books/The Scarlet Letter.txt). Reasons: Many illustration/image placeholders.
- the-sea-king-s-gift - The Lilac Fairy Book (app/client/assets/temp-books/The Sea King’s Gift.txt). Reasons: Low-confidence end boundary.
- the-sea-lady - The Sea Lady (app/client/assets/temp-books/The Sea Lady.txt). Reasons: Dense numbered bracket references or footnote markers.
- the-seven-cream-jugs - The Toys of Peace, and Other Papers (app/client/assets/temp-books/THE SEVEN CREAM JUGS.txt). Reasons: Low-confidence end boundary.
- the-seven-ravens - Grimms' Fairy Tales (app/client/assets/temp-books/THE SEVEN RAVENS.txt). Reasons: Low-confidence end boundary.
- the-shadow-out-of-time - The Shadow Out of Time (app/client/assets/temp-books/The Shadow Out of Time.txt). Reasons: Low-confidence start boundary.
- the-sheep - The Toys of Peace, and Other Papers (app/client/assets/temp-books/THE SHEEP.txt). Reasons: Low-confidence end boundary.
- the-shifty-lad - The Lilac Fairy Book (app/client/assets/temp-books/The Shifty Lad.txt). Reasons: Low-confidence end boundary.
- the-snow-queen - Andersen's Fairy Tales (app/client/assets/temp-books/THE SNOW QUEEN.txt). Reasons: Low-confidence end boundary.
- the-statement-of-randolph-carter - The Statement of Randolph Carter (app/client/assets/temp-books/The Statement of Randolph Carter.txt). Reasons: Low-confidence start boundary.
- the-steadfast-tin-soldier - Hans Andersen's Fairy Tales. First Series (app/client/assets/temp-books/THE STEADFAST TIN SOLDIER.txt). Reasons: Low-confidence end boundary.
- the-stolen-bacillus - The Stolen Bacillus and Other Incidents (app/client/assets/temp-books/THE STOLEN BACILLUS.txt). Reasons: Low-confidence end boundary.
- the-stolen-body - Twelve Stories and a Dream (app/client/assets/temp-books/THE STOLEN BODY.txt). Reasons: Low-confidence end boundary.
- the-stones-of-five-colors-and-the-empress-jokwa - Japanese Fairy Tales (app/client/assets/temp-books/THE STONES OF FIVE COLORS AND THE EMPRESS JOKWA.txt). Reasons: Low-confidence end boundary.
- the-story-of-a-gazelle - The Violet Fairy Book (app/client/assets/temp-books/THE STORY OF A GAZELLE.txt). Reasons: Low-confidence end boundary.
- the-story-of-a-very-bad-boy - The Lilac Fairy Book (app/client/assets/temp-books/The Story of a Very Bad Boy.txt). Reasons: Low-confidence end boundary.
- the-story-of-halfman - The Violet Fairy Book (app/client/assets/temp-books/THE STORY OF HALFMAN.txt). Reasons: Low-confidence end boundary.
- the-story-of-hassebu - The Violet Fairy Book (app/client/assets/temp-books/THE STORY OF HASSEBU.txt). Reasons: Low-confidence end boundary.
- the-story-of-prince-yamato-take - Japanese Fairy Tales (app/client/assets/temp-books/THE STORY OF PRINCE YAMATO TAKE.txt). Reasons: Low-confidence end boundary.
- the-story-of-the-late-mr-elvesham - THE STORY OF THE LATE MR. ELVESHAM (app/client/assets/temp-books/THE STORY OF THE LATE MR. ELVESHAM.txt). Reasons: Low-confidence start boundary.; Low-confidence end boundary.
- the-story-of-the-man-who-did-not-wish-to-die - Japanese Fairy Tales (app/client/assets/temp-books/THE STORY OF THE MAN WHO DID NOT WISH TO DIE.txt). Reasons: Low-confidence end boundary.
- the-story-of-the-old-man-who-made-withered-trees-to-flower - Japanese Fairy Tales (app/client/assets/temp-books/THE STORY OF THE OLD MAN WHO MADE WITHERED TREES TO FLOWER.txt). Reasons: Low-confidence end boundary.
- the-story-of-the-youth-who-went-forth-to-learn-what-fear-was - Grimms' Fairy Tales (app/client/assets/temp-books/THE STORY OF THE YOUTH WHO WENT FORTH TO LEARN WHAT FEAR WAS.txt). Reasons: Low-confidence end boundary.
- the-story-of-three-wonderful-beggars - The Violet Fairy Book (app/client/assets/temp-books/THE STORY OF THREE WONDERFUL BEGGARS.txt). Reasons: Low-confidence end boundary.
- the-story-of-urashima-taro-the-fisher-lad - Japanese Fairy Tales (app/client/assets/temp-books/THE STORY OF URASHIMA TARO, THE FISHER LAD.txt). Reasons: Low-confidence end boundary.
- the-strange-high-house-in-the-mist - The Strange High House in the Mist (app/client/assets/temp-books/The Strange High House in the Mist.txt). Reasons: Low-confidence start boundary.
- the-straw-the-coal-and-the-bean - Grimms' Fairy Tales (app/client/assets/temp-books/THE STRAW, THE COAL, AND THE BEAN.txt). Reasons: Low-confidence end boundary.
- the-temple - The Temple (app/client/assets/temp-books/The Temple.txt). Reasons: Low-confidence start boundary.
- the-threat - The Toys of Peace, and Other Papers (app/client/assets/temp-books/THE THREAT.txt). Reasons: Low-confidence end boundary.
- the-three-crowns - The Lilac Fairy Book (app/client/assets/temp-books/The Three Crowns.txt). Reasons: Low-confidence end boundary.
- the-three-languages - Grimms' Fairy Tales (app/client/assets/temp-books/THE THREE LANGUAGES.txt). Reasons: Low-confidence end boundary.
- the-three-princes-and-their-beasts - The Violet Fairy Book (app/client/assets/temp-books/THE THREE PRINCES AND THEIR BEASTS.txt). Reasons: Low-confidence end boundary.
- the-tomb - The Tomb (app/client/assets/temp-books/The Tomb.txt). Reasons: Low-confidence start boundary.
- the-tongue-cut-sparrow - Japanese Fairy Tales (app/client/assets/temp-books/THE TONGUE-CUT SPARROW.txt). Reasons: Low-confidence end boundary.
- the-toys-of-peace - The Toys of Peace, and Other Papers (app/client/assets/temp-books/THE TOYS OF PEACE.txt). Reasons: Low-confidence end boundary.
- the-travelling-musicians - Grimms' Fairy Tales (app/client/assets/temp-books/THE TRAVELLING MUSICIANS.txt). Reasons: Low-confidence end boundary.
- the-treasure-in-the-forest - The Stolen Bacillus and Other Incidents (app/client/assets/temp-books/THE TREASURE IN THE FOREST.txt). Reasons: Low-confidence end boundary.
- the-tree - The Tree (app/client/assets/temp-books/The Tree.txt). Reasons: Low-confidence start boundary.
- the-triumphs-of-a-taxidermist - The Stolen Bacillus and Other Incidents (app/client/assets/temp-books/THE TRIUMPHS OF A TAXIDERMIST.txt). Reasons: Low-confidence end boundary.
- the-truth-about-pyecraft - Twelve Stories and a Dream (app/client/assets/temp-books/THE TRUTH ABOUT PYECRAFT.txt). Reasons: Low-confidence end boundary.
- the-turmoil - The Turmoil: A Novel (app/client/assets/temp-books/The Turmoil.txt). Reasons: Possible malformed chapter numbering.
- the-turnip - Grimms' Fairy Tales (app/client/assets/temp-books/THE TURNIP.txt). Reasons: Low-confidence end boundary.
- the-twelve-dancing-princesses - Grimms' Fairy Tales (app/client/assets/temp-books/THE TWELVE DANCING PRINCESSES.txt). Reasons: Low-confidence end boundary.
- the-twelve-huntsmen - Grimms' Fairy Tales (app/client/assets/temp-books/THE TWELVE HUNTSMEN.txt). Reasons: Low-confidence end boundary.
- the-ugly-duckling - Hans Andersen's Fairy Tales. First Series (app/client/assets/temp-books/THE UGLY DUCKLING.txt). Reasons: Low-confidence end boundary.
- the-underground-workers - The Violet Fairy Book (app/client/assets/temp-books/THE UNDERGROUND WORKERS.txt). Reasons: Low-confidence end boundary.
- the-unnamable - The Unnamable (app/client/assets/temp-books/The Unnamable.txt). Reasons: Low-confidence start boundary.; Low-confidence end boundary.
- the-valley-of-spiders - Twelve Stories and a Dream (app/client/assets/temp-books/THE VALLEY OF SPIDERS.txt). Reasons: Low-confidence end boundary.
- the-water-of-life - Grimms' Fairy Tales (app/client/assets/temp-books/THE WATER OF LIFE.txt). Reasons: Low-confidence end boundary.
- the-wedding-of-mrs-fox - Grimms' Fairy Tales (app/client/assets/temp-books/THE WEDDING OF MRS FOX.txt). Reasons: Low-confidence end boundary.
- the-whisperer-in-darkness - The Whisperer in Darkness (app/client/assets/temp-books/The Whisperer in Darkness.txt). Reasons: Low-confidence start boundary.
- the-white-ship - The White Ship (app/client/assets/temp-books/The White Ship.txt). Reasons: Low-confidence start boundary.; Low-confidence end boundary.
- the-willow-wren-and-the-bear - Grimms' Fairy Tales (app/client/assets/temp-books/THE WILLOW-WREN AND THE BEAR.txt). Reasons: Low-confidence end boundary.
- the-wolf-and-the-seven-little-kids - Grimms' Fairy Tales (app/client/assets/temp-books/THE WOLF AND THE SEVEN LITTLE KIDS.txt). Reasons: Low-confidence end boundary.
- the-wolves-of-cernogratz - The Toys of Peace, and Other Papers (app/client/assets/temp-books/THE WOLVES OF CERNOGRATZ.txt). Reasons: Low-confidence end boundary.
- the-wonderful-tune - The Lilac Fairy Book (app/client/assets/temp-books/The Wonderful Tune.txt). Reasons: Low-confidence end boundary.
- the-works-of-edgar-allan-poe-the-raven-edition - The Works of Edgar Allan Poe, The Raven Edition (app/client/assets/temp-books/The Works of Edgar Allan Poe, The Raven Edition.txt). Reasons: Low-confidence end boundary.; Multiple footnote/reference sections.
- the-arabian-nights - The Arabian Nights: Their Best-known Tales (app/client/assets/temp-books/the-arabian-nights.txt). Reasons: Existing generated output has possible boundary or footer damage.
- the-book-of-dragons - The Book of Dragons (app/client/assets/temp-books/the-book-of-dragons.txt). Reasons: Many illustration/image placeholders.; Existing generated output has possible boundary or footer damage.
- the-emerald-city-of-oz - The Emerald City of Oz (app/client/assets/temp-books/the-emerald-city-of-oz.txt). Reasons: Existing generated output has possible boundary or footer damage.
- through-a-window - The Stolen Bacillus and Other Incidents (app/client/assets/temp-books/THROUGH A WINDOW.txt). Reasons: Low-confidence end boundary.
- tom-thumb - Grimms' Fairy Tales (app/client/assets/temp-books/TOM THUMB.txt). Reasons: Low-confidence end boundary.
- treasure-island - Treasure Island (app/client/assets/temp-books/treasure-island.txt). Reasons: Existing generated output has possible boundary or footer damage.
- twenty-years-after - Twenty years after (app/client/assets/temp-books/Twenty years after.txt). Reasons: Possible malformed chapter numbering.
- two-in-a-sack - The Violet Fairy Book (app/client/assets/temp-books/TWO IN A SACK.txt). Reasons: Low-confidence end boundary.
- under-the-knife - UNDER THE KNIFE (app/client/assets/temp-books/UNDER THE KNIFE.txt). Reasons: Low-confidence start boundary.; Low-confidence end boundary.
- unicorns - Unicorns (app/client/assets/temp-books/Unicorns.txt). Reasons: Multiple transcriber/editor note ranges.
- virgilius-the-sorcerer - The Violet Fairy Book (app/client/assets/temp-books/VIRGILIUS THE SORCERER.txt). Reasons: Low-confidence end boundary.

## Low-Risk Candidates For Later Larger Batches

- almayer-s-folly-a-story-of-an-eastern-river - Almayer's Folly: A Story of an Eastern River (app/client/assets/temp-books/Almayer's Folly - A Story of an Eastern River.txt).
- an-ideal-husband - An Ideal Husband (app/client/assets/temp-books/An Ideal Husband.txt).
- despair-s-last-journey - Despair's Last Journey (app/client/assets/temp-books/Despair's Last Journey.txt).
- father-goriot - Father Goriot (app/client/assets/temp-books/Father Goriot.txt).
- lord-jim - Lord Jim (app/client/assets/temp-books/Lord Jim.txt).
- metamorphosis - Metamorphosis (app/client/assets/temp-books/Metamorphosis.txt).
- pygmalion - Pygmalion (app/client/assets/temp-books/Pygmalion.txt).
- the-adventures-of-pinocchio - The Adventures of Pinocchio (app/client/assets/temp-books/The Adventures of Pinocchio.txt).
- the-divine-comedy - The divine comedy (app/client/assets/temp-books/The Divine Comedy.txt).
- the-house-without-a-key - The house without a key (app/client/assets/temp-books/The house without a key.txt).
- the-importance-of-being-earnest-a-trivial-comedy-for-serious-people - The Importance of Being Earnest: A Trivial Comedy for Serious People (app/client/assets/temp-books/The Importance of Being Earnest - A Trivial Comedy for Serious People.txt).
- the-lerouge-case - The Lerouge Case (app/client/assets/temp-books/The Lerouge Case.txt).
- the-shoes-of-fortune - Andersen's Fairy Tales (app/client/assets/temp-books/The Shoes of Fortune.txt).
- the-two-magics-the-turn-of-the-screw-covering-end - The Two Magics: The Turn of the Screw, Covering End (app/client/assets/temp-books/The Two Magics - The Turn of the Screw, Covering End.txt).
- the-virginian-a-horseman-of-the-plains - The Virginian: A Horseman of the Plains (app/client/assets/temp-books/The Virginian - A Horseman of the Plains.txt).
- typhoon - Typhoon (app/client/assets/temp-books/Typhoon.txt).

## Recommended Pilot Batch

- almayer-s-folly-a-story-of-an-eastern-river - Almayer's Folly: A Story of an Eastern River (low). Clear markers and low artifact counts.
- an-ideal-husband - An Ideal Husband (low). Clear markers and low artifact counts.
- despair-s-last-journey - Despair's Last Journey (low). Clear markers and low artifact counts.
- a-dream-of-armageddon - Twelve Stories and a Dream (medium). Medium-confidence start boundary.
- a-journal-of-the-plague-year - A Journal of the Plague Year (medium). Illustration/image placeholders present.
- a-journey-to-the-centre-of-the-earth - A Journey to the Centre of the Earth (medium). Illustration/image placeholders present.
- a-bread-and-butter-miss - The Toys of Peace, and Other Papers (high). Low-confidence end boundary.
- a-catastrophe - A CATASTROPHE (high). Low-confidence start boundary.

## Existing Generated Output Warnings

- a-childs-garden-of-verses - A Child's Garden of Verses (app/client/assets/temp-books/a-childs-garden-of-verses.txt). Reasons: First included/generated section appears to contain title-page, TOC, illustration, or source boilerplate text.
- a-christmas-carol - A Christmas Carol in Prose; Being a Ghost Story of Christmas (app/client/assets/temp-books/a-christmas-carol.txt). Reasons: First included/generated section appears to contain title-page, TOC, illustration, or source boilerplate text.
- black-beauty - Black Beauty The autobiography of a horse (app/client/assets/temp-books/black-beauty.txt). Reasons: First included/generated section appears to contain title-page, TOC, illustration, or source boilerplate text.
- candide - Candide (app/client/assets/temp-books/Candide.txt). Reasons: First included/generated section appears to contain title-page, TOC, illustration, or source boilerplate text.
- crime-and-punishment - Crime and Punishment (app/client/assets/temp-books/Crime and Punishment.txt). Reasons: Generated defaults may skip legitimate preface/introduction/prologue-style opening material.
- don-quixote - Don Quixote (app/client/assets/temp-books/Don Quixote.txt). Reasons: Generated defaults may skip legitimate preface/introduction/prologue-style opening material.
- dr-jekyll-and-mr-hyde - The strange case of Dr. Jekyll and Mr. Hyde (app/client/assets/temp-books/Dr. Jekyll and Mr. Hyde.txt). Reasons: First included/generated section appears to contain title-page, TOC, illustration, or source boilerplate text.
- five-little-peppers-and-how-they-grew - Five Little Peppers and How They Grew (app/client/assets/temp-books/five-little-peppers-and-how-they-grew.txt). Reasons: First included/generated section appears to contain title-page, TOC, illustration, or source boilerplate text.
- grimm-s-fairy-tales - Grimm's Fairy Tales (app/client/assets/temp-books/Grimm's Fairy Tales.txt). Reasons: First included/generated section appears to contain title-page, TOC, illustration, or source boilerplate text.
- gulliver-s-travels - Gulliver's Travels into Several Remote Nations of the World (app/client/assets/temp-books/Gulliver's Travels.txt). Reasons: Generated defaults may skip legitimate preface/introduction/prologue-style opening material.
- jane-eyre - Jane Eyre: An Autobiography (app/client/assets/temp-books/Jane Eyre.txt). Reasons: Generated defaults may skip legitimate preface/introduction/prologue-style opening material.
- les-miserables - Les Misérables (app/client/assets/temp-books/Les Misérables.txt). Reasons: Generated defaults may skip legitimate preface/introduction/prologue-style opening material.
- little-women - Little Women; Or, Meg, Jo, Beth, and Amy (app/client/assets/temp-books/Little Women.txt). Reasons: Generated defaults may skip legitimate preface/introduction/prologue-style opening material.
- new-treasure-seekers - New Treasure Seekers; Or, The Bastable Children in Search of a Fortune (app/client/assets/temp-books/new-treasure-seekers.txt). Reasons: First included/generated section appears to contain title-page, TOC, illustration, or source boilerplate text.; Generated defaults may skip legitimate preface/introduction/prologue-style opening material.
- rainbow-valley - Rainbow Valley (app/client/assets/temp-books/rainbow-valley.txt). Reasons: Generated defaults may skip legitimate preface/introduction/prologue-style opening material.
- rinkitink-in-oz - Rinkitink in Oz (app/client/assets/temp-books/rinkitink-in-oz.txt). Reasons: Generated defaults may skip legitimate preface/introduction/prologue-style opening material.
- screenshot-2026-06-13-014010 - Screenshot 2026-06-13 014010 (app/client/assets/temp-books/Screenshot 2026-06-13 014010.png). Reasons: Source file is not text and cannot be audited as a book.
- sun-tzu-on-the-art-of-war - Sun Tzŭ on the Art of War: The Oldest Military Treatise in the World (app/client/assets/temp-books/Sun Tzŭ on the Art of War.txt). Reasons: Generated defaults may skip legitimate preface/introduction/prologue-style opening material.
- the-art-of-war - The Art of War (app/client/assets/temp-books/The Art of War.txt). Reasons: Generated defaults may skip legitimate preface/introduction/prologue-style opening material.
- the-call-of-cthulhu - The call of Cthulhu (app/client/assets/temp-books/The call of Cthulhu.txt). Reasons: First included/generated section appears to contain title-page, TOC, illustration, or source boilerplate text.
- the-elements-of-style - The Elements of Style (app/client/assets/temp-books/The Elements of Style.txt). Reasons: First included/generated section appears to contain title-page, TOC, illustration, or source boilerplate text.
- the-federalist-papers - The Federalist Papers (app/client/assets/temp-books/The Federalist Papers.txt). Reasons: First included/generated section appears to contain title-page, TOC, illustration, or source boilerplate text.; Generated defaults may skip legitimate preface/introduction/prologue-style opening material.
- the-happy-family - The Happy Family (app/client/assets/temp-books/The Happy Family.txt). Reasons: Generated cleaned text is far shorter than the audited candidate body window.
- the-jungle-book - The Jungle Book (app/client/assets/temp-books/The Jungle Book.txt). Reasons: First included/generated section appears to contain title-page, TOC, illustration, or source boilerplate text.
- the-arabian-nights - The Arabian Nights: Their Best-known Tales (app/client/assets/temp-books/the-arabian-nights.txt). Reasons: First included/generated section appears to contain title-page, TOC, illustration, or source boilerplate text.
- the-book-of-dragons - The Book of Dragons (app/client/assets/temp-books/the-book-of-dragons.txt). Reasons: First included/generated section appears to contain title-page, TOC, illustration, or source boilerplate text.
- the-emerald-city-of-oz - The Emerald City of Oz (app/client/assets/temp-books/the-emerald-city-of-oz.txt). Reasons: First included/generated section appears to contain title-page, TOC, illustration, or source boilerplate text.
- treasure-island - Treasure Island (app/client/assets/temp-books/treasure-island.txt). Reasons: First included/generated section appears to contain title-page, TOC, illustration, or source boilerplate text.

## Protected Folder Confirmation

- `app/client/assets/temp-books` was read but not modified.
- `app/client/assets/books/generated` was read for comparison but not modified.
- `app/client/assets/books/cloudflare-export` was not modified.

## Next Processing Strategy

- Low-risk books can later be processed in larger batches, maybe 20-50 at a time, after a pilot batch succeeds.
- Medium-risk books should stay in smaller batches, maybe 5-10 at a time, with explicit boundary and artifact checks.
- High-risk books should be processed individually or in near-individual batches after manual review.
- Blocked books should not be processed until the source, boundary, or corruption issue is manually reviewed.
- Multiple audit passes should continue until major red flags are removed, intentionally handled, or quarantined.

## Machine-Readable Details

See `book-processing-audit-pass-1.json` for per-book boundary guesses, snippets, detected ranges, artifact counts, generated-output comparison, risk classification, and recommended next action.
