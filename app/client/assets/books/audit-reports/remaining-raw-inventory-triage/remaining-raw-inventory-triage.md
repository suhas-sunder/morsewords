# Remaining Raw Inventory Triage

Generated: 2026-06-21T09:18:25.478Z

This is a report-only inventory/triage pass. It did not write generated books, create preview assets, modify raw sources, modify Cloudflare exports, process all books, create write batch 24, or start dry-run batch 25.

## Executive Summary

- Total live raw files inspected under `app/client/assets/temp-books`: 507
- Live raw text files with structure audit records: 506
- Live non-book/invalid raw files: 1
- Prior known invalid item absent from live raw inventory: 1
- Total generated books from `library-manifest.json`: 465
- Total valid startup previews from preview manifest: 465
- Accepted/generated live raw count: 450
- Dry-run 24 accepted/corrected/verified exclusion count: 455
- Unresolved-source generated books left untouched: 11
- Known duplicate/near-duplicate live raw count: 3
- Known boundary-defect live raw count: 2
- Manual-review-required live raw count: 5
- Blocked/source-or-rights-risk live raw count: 3
- Non-book/invalid count: 1 live raw, 2 including the stale prior placeholder
- Future bespoke/manual candidate count: 4
- Dry-run 24 skipped/unsafe raw-only candidates: 46
- Classified raw-only unsafe count by this triage: 46

Dry-run 24 remains authoritative for normal batching: selected count 0, first-time controlled processing count 0, skipped/unsafe raw-only candidates 46, fewer than 20 safe candidates remain yes, and zero safe deterministic candidates remain yes. This report does not select or process any books.

## Unsafe Automation Count By Reason

- blocked-source-or-rights-risk: 3
- unsafe-automation-structure: 8
- unsafe-title-or-parent-collection-risk: 2
- unsafe-start-or-end-boundary-risk: 26
- unsafe-metadata-risk: 3
- unsafe-prose-preservation-risk: 0
- candidate-for-future-manual-processing: 4

## Category Counts

Live raw category counts:

- accepted-already-generated: 450
- blocked-source-or-rights-risk: 3
- candidate-for-future-manual-processing: 4
- known-boundary-defect: 2
- known-duplicate-or-near-duplicate: 3
- manual-review-required: 5
- non-book-or-invalid-file: 1
- unsafe-automation-structure: 8
- unsafe-metadata-risk: 3
- unsafe-start-or-end-boundary-risk: 26
- unsafe-title-or-parent-collection-risk: 2

Combined report category counts, including unresolved generated books and the stale prior invalid placeholder:

- accepted-already-generated: 450
- blocked-source-or-rights-risk: 3
- candidate-for-future-manual-processing: 4
- known-boundary-defect: 2
- known-duplicate-or-near-duplicate: 3
- manual-review-required: 5
- non-book-or-invalid-file: 2
- unresolved-source-generated-book: 11
- unsafe-automation-structure: 8
- unsafe-metadata-risk: 3
- unsafe-start-or-end-boundary-risk: 26
- unsafe-title-or-parent-collection-risk: 2

## Known Items Preserved

Unresolved-source generated books:

- a-princess-of-mars: unresolved-source-generated-book; no live raw source; leave unresolved
- doctor-dolittle: unresolved-source-generated-book; no live raw source; leave unresolved
- heidi: unresolved-source-generated-book; no live raw source; leave unresolved
- jabberwocky: unresolved-source-generated-book; no live raw source; leave unresolved
- nights-with-uncle-remus: unresolved-source-generated-book; no live raw source; leave unresolved
- peter-pan: unresolved-source-generated-book; no live raw source; leave unresolved
- tarzan-of-the-apes: unresolved-source-generated-book; no live raw source; leave unresolved
- the-great-gatsby: unresolved-source-generated-book; no live raw source; leave unresolved
- the-picture-of-dorian-gray: unresolved-source-generated-book; no live raw source; leave unresolved
- the-thirty-nine-steps: unresolved-source-generated-book; no live raw source; leave unresolved
- wood-folk-at-school: unresolved-source-generated-book; no live raw source; leave unresolved

Known duplicate/near-duplicate skips:

- the-wind-in-the-willows: known-duplicate-or-near-duplicate; app/client/assets/temp-books/The Wind in the Willows.txt; keep duplicate skipped
- the-two-magics-the-turn-of-the-screw-covering-end: known-duplicate-or-near-duplicate; app/client/assets/temp-books/The Two Magics - The Turn of the Screw, Covering End.txt; keep duplicate skipped
- japanese-fairy-tales: known-duplicate-or-near-duplicate; app/client/assets/temp-books/Japanese Fairy Tales.txt; keep duplicate skipped

Known boundary-defect skips:

- the-works-of-edgar-allan-poe: known-boundary-defect; app/client/assets/temp-books/The Works of Edgar Allan Poe.txt; keep boundary skipped
- snow-white-and-rose-red: known-boundary-defect; app/client/assets/temp-books/SNOW-WHITE AND ROSE-RED.txt; keep boundary skipped

Known manual/blocked/suspicious list:

- a-christmas-carol: accepted-already-generated; app/client/assets/temp-books/a-christmas-carol.txt; no action
- dr-jekyll-and-mr-hyde: accepted-already-generated; app/client/assets/temp-books/Dr. Jekyll and Mr. Hyde.txt; no action
- a-catastrophe: manual-review-required; app/client/assets/temp-books/A CATASTROPHE.txt; manual boundary plan
- new-text-document: non-book-or-invalid-file; app/client/assets/temp-books/New Text Document.txt; remove/ignore invalid file
- screenshot-2026-06-13-014010: non-book-or-invalid-file; app/client/assets/temp-books/Screenshot 2026-06-13 014010.png; remove/ignore invalid file
- in-the-abyss: manual-review-required; app/client/assets/temp-books/IN THE ABYSS.txt; manual boundary plan
- pollock-and-the-porroh-man: manual-review-required; app/client/assets/temp-books/POLLOCK AND THE PORROH MAN.txt; manual boundary plan
- the-colour-out-of-space: manual-review-required; app/client/assets/temp-books/The colour out of space.txt; manual boundary plan
- the-plattner-story: manual-review-required; app/client/assets/temp-books/THE PLATTNER STORY.txt; manual boundary plan

## Remaining Items By Category

### accepted-already-generated

- a-bread-and-butter-miss (A BREAD AND BUTTER MISS.txt)
- a-childs-garden-of-verses (a-childs-garden-of-verses.txt)
- a-christmas-carol (a-christmas-carol.txt)
- a-deal-in-ostriches (A DEAL IN OSTRICHES.txt)
- a-dream-of-armageddon (A DREAM OF ARMAGEDDON.txt)
- a-fish-story (A Fish Story.txt)
- a-french-puck (A French Puck.txt)
- a-japanese-blossom (A Japanese Blossom.txt)
- a-journal-of-the-plague-year (A Journal of the Plague Year.txt)
- a-journey-to-the-centre-of-the-earth (A Journey to the Centre of the Earth.txt)
- a-lost-paradise (A Lost Paradise.txt)
- a-midsummer-night-s-dream (A Midsummer Night's Dream.txt)
- a-moonlight-fable (A MOONLIGHT FABLE.txt)
- a-moth-genus-novo (A MOTH--GENUS NOVO.txt)
- a-room-with-a-view (A Room with a View.txt)
- a-slip-under-the-microscope (A SLIP UNDER THE MICROSCOPE.txt)
- a-story-of-the-days-to-come (A Story of the Days to Come.txt)
- a-story-of-the-stone-age (A Story of the Stone Age.txt)
- a-study-in-scarlet (A Study in Scarlet.txt)
- a-tale-of-the-tontlawald (A TALE OF THE TONTLAWALD.txt)
- a-tale-of-two-cities (A Tale of Two Cities.txt)
- aepyornis-island (AEPYORNIS ISLAND.txt)
- agamemnon-of-aeschylus (Agamemnon of Aeschylus.txt)
- alices-adventures-in-wonderland (alices-adventures-in-wonderland.txt)
- almayer-s-folly-a-story-of-an-eastern-river (Almayer's Folly - A Story of an Eastern River.txt)
- an-ideal-husband (An Ideal Husband.txt)
- anna-karenina (Anna Karenina.txt)
- anne-of-avonlea (Anne of Avonlea.txt)
- anne-of-green-gables (Anne of Green Gables.txt)
- around-the-world-in-eighty-days (around-the-world-in-eighty-days.txt)
- ashputtel (ASHPUTTEL.txt)
- astounding-stories-of-super-science (Astounding Stories of Super-Science.txt)
- at-the-earth-s-core (At the Earth's Core.txt)
- at-the-mountains-of-madness (At the mountains of madness.txt)
- bertie-s-christmas-eve (BERTIE’S CHRISTMAS EVE.txt)
- beyond-the-wall-of-sleep (Beyond the Wall of Sleep.txt)
- black-beauty (black-beauty.txt)
- botchan (Botchan.txt)
- briar-rose (BRIAR ROSE.txt)
- can-you-forgive-her (Can You Forgive Her.txt)
- candide (Candide.txt)
- canossa (CANOSSA.txt)
- cat-and-mouse-in-partnership (CAT AND MOUSE IN PARTNERSHIP.txt)
- cat-skin (CAT-SKIN.txt)
- catriona (Catriona.txt)
- celephais (Celephaïs.txt)
- clever-elsie (CLEVER ELSIE.txt)
- clever-gretel (CLEVER GRETEL.txt)
- clever-hans (CLEVER HANS.txt)
- cool-air (Cool air.txt)
- cranford (Cranford.txt)
- crime-and-punishment (Crime and Punishment.txt)
- dagon (Dagon.txt)
- deep-sea-plunderings (Deep-Sea Plunderings.txt)
- despair-s-last-journey (Despair's Last Journey.txt)
- doctor-knowall (DOCTOR KNOWALL.txt)
- don-quixote (Don Quixote.txt)
- dr-jekyll-and-mr-hyde (Dr. Jekyll and Mr. Hyde.txt)
- dracula (Dracula.txt)
- elder-tree-mother (ELDER-TREE MOTHER.txt)
- excepting-mrs-pentherby (EXCEPTING MRS. PENTHERBY.txt)
- fate (FATE.txt)
- filmer (FILMER.txt)
- five-children-and-it (Five Children and It.txt)
- five-little-peppers-and-how-they-grew (five-little-peppers-and-how-they-grew.txt)
- five-little-peppers-at-school (Five Little Peppers at School.txt)
- five-weeks-in-a-balloon (Five Weeks in a Balloon.txt)
- flatland-a-romance-of-many-dimensions (Flatland - A Romance of Many Dimensions.txt)
- for-the-duration-of-the-war (FOR THE DURATION OF THE WAR.txt)
- forewarned (FOREWARNED.txt)
- four-day-planet (Four-Day Planet.txt)
- frankenstein (Frankenstein.txt)
- frederick-and-catherine (FREDERICK AND CATHERINE.txt)
- from-beyond (From Beyond.txt)
- fundevogel (FUNDEVOGEL.txt)
- grimm-s-fairy-tales (Grimm's Fairy Tales.txt)
- gulliver-s-travels (Gulliver's Travels.txt)
- hans-in-luck (HANS IN LUCK.txt)
- hansel-and-gretel (HANSEL AND GRETEL.txt)
- herland (Herland.txt)
- hero-myths-and-legends-of-the-british-race (Hero-Myths & Legends of the British Race.txt)
- how-a-fish-swam-in-the-air-and-a-hare-in-the-water (HOW A FISH SWAM IN THE AIR AND A HARE IN THE WATER.txt)
- how-an-old-man-lost-his-wen (HOW AN OLD MAN LOST HIS WEN.txt)
- how-brave-walter-hunted-wolves (How Brave Walter Hunted Wolves.txt)
- howards-end (Howards End.txt)
- hyacinth (HYACINTH.txt)
- hypnos (Hypnos.txt)
- ibid (Ibid.txt)
- in-the-avu-observatory (IN THE AVU OBSERVATORY.txt)
- in-the-modern-vein (IN THE MODERN VEIN.txt)
- in-the-vault (In the Vault.txt)
- iron-hans (IRON HANS.txt)
- jack-and-jill (jack-and-jill.txt)
- jane-eyre (Jane Eyre.txt)
- jesper-who-herded-the-hares (JESPER WHO HERDED THE HARES.txt)
- jimmy-goggles-the-god (JIMMY GOGGLES THE GOD.txt)
- jorinda-and-jorindel (JORINDA AND JORINDEL.txt)
- kidnapped (Kidnapped.txt)
- king-arthur-and-the-knights-of-the-round-table (King Arthur and the Knights of the Round Table.txt)
- king-grisly-beard (KING GRISLY-BEARD.txt)
- les-miserables (Les Misérables.txt)
- lily-and-the-lion (LILY AND THE LION.txt)
- little-fuzzy (Little Fuzzy.txt)
- little-ida-s-flowers (LITTLE IDA'S FLOWERS.txt)
- little-lasse (Little Lasse.txt)
- little-red-riding-hood (LITTLE RED RIDING HOOD.txt)
- little-thumbelina (LITTLE THUMBELINA.txt)
- little-women (Little Women.txt)
- lord-jim (Lord Jim.txt)
- louis (LOUIS.txt)
- louise (Louise.txt)
- love-among-the-chickens (Love Among the Chickens.txt)
- macbeth (Macbeth.txt)
- mark (MARK.txt)
- metamorphosis (Metamorphosis.txt)
- miss-winchelsea-s-heart (MISS WINCHELSEA'S HEART.txt)
- moby-dick (Moby Dick.txt)
- mogarzea-and-his-son (MOGARZEA AND HIS SON.txt)
- momotaro-or-the-story-of-the-son-of-a-peach (MOMOTARO, OR THE STORY OF THE SON OF A PEACH.txt)
- morlvera (MORLVERA.txt)
- mother-holle (MOTHER HOLLE.txt)
- moti (‘Moti’.txt)
- mr-brisher-s-treasure (MR. BRISHER'S TREASURE.txt)
- mr-ledbetter-s-vacation (MR. LEDBETTER'S VACATION.txt)
- mr-skelmersdale-in-fairyland (MR. SKELMERSDALE IN FAIRYLAND.txt)
- murder-in-the-maze (Murder in the Maze.txt)
- my-lord-bag-of-rice (MY LORD BAG OF RICE.txt)
- new-treasure-seekers (new-treasure-seekers.txt)
- nyarlathotep (Nyarlathotep.txt)
- old-sultan (OLD SULTAN.txt)
- ole-luk-oie-the-dream-god (OLE-LUK-OIE THE DREAM GOD.txt)
- oliver-twist (Oliver Twist.txt)
- parnassus-on-wheels (Parnassus on Wheels.txt)
- persuasion (Persuasion.txt)
- pickman-s-model (Pickman's Model.txt)
- pointed-roofs (Pointed Roofs.txt)
- polaris (Polaris.txt)
- pollyanna (Pollyanna.txt)
- pride-and-prejudice (Pride and Prejudice.txt)
- pygmalion (Pygmalion.txt)
- quail-seed (QUAIL SEED.txt)
- quo-vadis (Quo Vadis.txt)
- rainbow-valley (rainbow-valley.txt)
- rapunzel (RAPUNZEL.txt)
- rinkitink-in-oz (rinkitink-in-oz.txt)
- robert-orange (Robert Orange.txt)
- romeo-and-juliet (Romeo and Juliet.txt)
- room-13 (Room 13.txt)
- rumpelstiltskin (RUMPELSTILTSKIN.txt)
- schippeitaro (SCHIPPEITARO.txt)
- sense-and-sensibility (Sense and Sensibility.txt)
- shen-of-the-sea-a-book-for-children (Shen of the Sea - A Book for Children.txt)
- shock-tactics (SHOCK TACTICS.txt)
- six-girls-a-home-story (Six Girls - A Home Story.txt)
- snowdrop (SNOWDROP.txt)
- spoon-river-anthology (Spoon River Anthology.txt)
- stan-bolovan (STAN BOLOVAN.txt)
- sun-tzu-on-the-art-of-war (Sun Tzŭ on the Art of War.txt)
- sunshine-stories (SUNSHINE STORIES.txt)
- sweetheart-roland (SWEETHEART ROLAND.txt)
- tales-of-war (Tales of War.txt)
- tea (Tea.txt)
- the-adventures-of-chanticleer-and-partlet (THE ADVENTURES OF CHANTICLEER AND PARTLET.txt)
- the-adventures-of-ferdinand-count-fathom (The Adventures of Ferdinand Count Fathom.txt)
- the-adventures-of-kintaro-the-golden-boy (THE ADVENTURES OF KINTARO, THE GOLDEN BOY.txt)
- the-adventures-of-pinocchio (The Adventures of Pinocchio.txt)
- the-adventures-of-roderick-random (The Adventures of Roderick Random.txt)
- the-adventures-of-tom-sawyer (The Adventures of Tom Sawyer.txt)
- the-alchemist (The Alchemist.txt)
- the-amateur-cracksman (The Amateur Cracksman.txt)
- the-arabian-nights (the-arabian-nights.txt)
- the-argonauts-of-the-air (THE ARGONAUTS OF THE AIR.txt)
- the-art-of-war (The Art of War.txt)
- the-bamboo-cutter-and-the-moon-child (THE BAMBOO-CUTTER AND THE MOON-CHILD.txt)
- the-battle-of-the-birds (The Battle of the Birds.txt)
- the-beast-in-the-cave (The Beast in the Cave.txt)
- the-believing-husbands (The Believing Husbands.txt)
- the-bell (The Bell.txt)
- the-benson-murder-case (The Benson Murder Case.txt)
- the-black-star-passes (The Black Star Passes.txt)
- the-blue-castle (The Blue Castle.txt)
- the-blue-light (THE BLUE LIGHT.txt)
- the-bones-of-djulung (The Bones of Djulung.txt)
- the-book-of-dragons (the-book-of-dragons.txt)
- the-boys-with-the-golden-stars (THE BOYS WITH THE GOLDEN STARS.txt)
- the-brothers-karamazov (The Brothers Karamazov.txt)
- the-brown-bear-of-norway (The Brown Bear of Norway.txt)
- the-brownie-of-the-lake (The Brownie of the Lake.txt)
- the-buccaneer (The Buccaneer.txt)
- the-bull (THE BULL.txt)
- the-call-of-cthulhu (The call of Cthulhu.txt)
- the-call-of-the-wild (The call of the wild.txt)
- the-castle-of-kerglas (The Castle of Kerglas.txt)
- the-cats-of-ulthar (The Cats of Ulthar.txt)
- the-child-who-came-from-an-egg (THE CHILD WHO CAME FROM AN EGG.txt)
- the-conceited-apple-branch (THE CONCEITED APPLE BRANCH.txt)
- the-cone (THE CONE.txt)
- the-count-of-monte-cristo (The Count of Monte Cristo.txt)
- the-country-of-the-blind (THE COUNTRY OF THE BLIND.txt)
- the-crystal-egg (THE CRYSTAL EGG.txt)
- the-cupboard-of-the-yesterdays (THE CUPBOARD OF THE YESTERDAYS.txt)
- the-darning-needle (THE DARNING-NEEDLE.txt)
- the-diamond-maker (THE DIAMOND MAKER.txt)
- the-disappearance-of-crispina-umberleigh (THE DISAPPEARANCE OF CRISPINA UMBERLEIGH.txt)
- the-divine-comedy (The Divine Comedy.txt)
- the-dog-and-the-sparrow (THE DOG AND THE SPARROW.txt)
- the-doom-that-came-to-sarnath (The Doom That Came to Sarnath.txt)
- the-door-in-the-wall (THE DOOR IN THE WALL.txt)
- the-dream-of-little-tuk (The Dream of Little Tuk.txt)
- the-dreams-in-the-witch-house (The Dreams in the Witch-House.txt)
- the-dunwich-horror (The Dunwich horror.txt)
- the-elderbush (The Elderbush.txt)
- the-elements-of-style (The Elements of Style.txt)
- the-elves-and-the-shoemaker (THE ELVES AND THE SHOEMAKER.txt)
- the-emerald-city-of-oz (the-emerald-city-of-oz.txt)
- the-emperor-s-new-clothes (THE EMPEROR'S NEW CLOTHES.txt)
- the-enchanted-deer (The Enchanted Deer.txt)
- the-enchanted-knife (THE ENCHANTED KNIFE.txt)
- the-envious-neighbour (THE ENVIOUS NEIGHBOUR.txt)
- the-escape-of-the-mouse (The Escape of the Mouse.txt)
- the-expedition-of-humphry-clinker (The Expedition of Humphry Clinker.txt)
- the-fairy-nurse (The Fairy Nurse.txt)
- the-fairy-of-the-dawn (THE FAIRY OF THE DAWN.txt)
- the-false-collar (The False Collar.txt)
- the-false-prince-and-the-true (The False Prince and the True.txt)
- the-federalist-papers (The Federalist Papers.txt)
- the-festival (The festival.txt)
- the-finest-liar-in-the-world (THE FINEST LIAR IN THE WORLD.txt)
- the-fir-tree (The Fir Tree.txt)
- the-fisherman-and-his-wife (THE FISHERMAN AND HIS WIFE.txt)
- the-flowering-of-the-strange-orchid (THE FLOWERING OF THE STRANGE ORCHID.txt)
- the-flying-man (THE FLYING MAN.txt)
- the-four-clever-brothers (THE FOUR CLEVER BROTHERS.txt)
- the-four-gifts (The Four Gifts.txt)
- the-fox-and-the-cat (THE FOX AND THE CAT.txt)
- the-fox-and-the-horse (THE FOX AND THE HORSE.txt)
- the-frog (THE FROG.txt)
- the-frog-prince (THE FROG-PRINCE.txt)
- the-girl-who-pretended-to-be-a-boy (THE GIRL WHO PRETENDED TO BE A BOY.txt)
- the-goat-s-ears-of-the-emperor-trojan (THE GOAT’S EARS OF THE EMPEROR TROJAN.txt)
- the-goblin-of-adachigahara (THE GOBLIN OF ADACHIGAHARA.txt)
- the-golden-bird (THE GOLDEN BIRD.txt)
- the-golden-goose (THE GOLDEN GOOSE.txt)
- the-goose-girl (THE GOOSE-GIRL.txt)
- the-grateful-prince (THE GRATEFUL PRINCE.txt)
- the-green-mummy (The Green Mummy.txt)
- the-greenies (THE GREENIES.txt)
- the-groac-h-of-the-isle-of-lok (The Groac’h of the Isle of Lok.txt)
- the-guests (THE GUESTS.txt)
- the-hammerpond-park-burglary (THE HAMMERPOND PARK BURGLARY.txt)
- the-happy-family (The Happy Family.txt)
- the-happy-hunter-and-the-skillful-fisher (THE HAPPY HUNTER AND THE SKILLFUL FISHER.txt)
- the-haunter-of-the-dark (The haunter of the dark.txt)
- the-headless-dwarfs (THE HEADLESS DWARFS.txt)
- the-heart-of-a-monkey (The Heart of a Monkey.txt)
- the-hedgehog (THE HEDGEHOG.txt)
- the-history-of-sir-richard-calmady-a-romance (The History of Sir Richard Calmady - A Romance.txt)
- the-hoodie-crow (The Hoodie-Crow.txt)
- the-hound (The Hound.txt)
- the-hound-of-the-baskervilles (The Hound of the Baskervilles.txt)
- the-house-of-arden-a-story-for-children (The House of Arden - A Story for Children.txt)
- the-house-without-a-key (The house without a key.txt)
- the-image-of-the-lost-soul (THE IMAGE OF THE LOST SOUL.txt)
- the-importance-of-being-earnest-a-trivial-comedy-for-serious-people (The Importance of Being Earnest - A Trivial Comedy for Serious People.txt)
- the-innocence-of-father-brown (The innocence of Father Brown.txt)
- the-inspector-french-s-greatest-case (The Inspector French’s Greatest Case.txt)
- the-interlopers (THE INTERLOPERS.txt)
- the-invisible-man-a-grotesque-romance (The Invisible Man - A Grotesque Romance.txt)
- the-jelly-fish-and-the-monkey (THE JELLY FISH AND THE MONKEY.txt)
- the-jilting-of-jane (THE JILTING OF JANE.txt)
- the-jogi-s-punishment (The Jogi’s Punishment.txt)
- the-jungle-book (The Jungle Book.txt)
- the-juniper-tree (THE JUNIPER-TREE.txt)
- the-king-in-yellow (The King in Yellow.txt)
- the-king-of-the-golden-mountain (THE KING OF THE GOLDEN MOUNTAIN.txt)
- the-king-of-the-waterfalls (The King of the Waterfalls.txt)
- the-lady-of-the-fountain (The Lady of the Fountain.txt)
- the-lady-of-the-lake (The Lady of the Lake.txt)
- the-laughing-cavalier-the-story-of-the-ancestor-of-the-scarlet-pimpernel (The Laughing Cavalier - The Story of the Ancestor of the Scarlet Pimpernel.txt)
- the-leap-frog (The Leap-Frog.txt)
- the-leaping-match (THE LEAPING MATCH.txt)
- the-legend-of-sleepy-hollow (the-legend-of-sleepy-hollow.txt)
- the-lerouge-case (The Lerouge Case.txt)
- the-life-and-adventures-of-robinson-crusoe (The Life and Adventures of Robinson Crusoe.txt)
- the-little-peasant (THE LITTLE PEASANT.txt)
- the-lord-of-the-dynamos (THE LORD OF THE DYNAMOS.txt)
- the-lost-inheritance (THE LOST INHERITANCE.txt)
- the-lost-world (The Lost World.txt)
- the-loving-pair (THE LOVING PAIR.txt)
- the-lurking-fear (The lurking fear.txt)
- the-lute-player (THE LUTE PLAYER.txt)
- the-magic-shop (THE MAGIC SHOP.txt)
- the-maiden-with-the-wooden-helmet (THE MAIDEN WITH THE WOODEN HELMET.txt)
- the-maltese-falcon (The Maltese falcon.txt)
- the-man-who-could-work-miracles (The Man Who Could Work Miracles.txt)
- the-man-who-was-thursday-a-nightmare (The Man Who Was Thursday - A Nightmare.txt)
- the-mappined-life (THE MAPPINED LIFE.txt)
- the-mark-of-zorro (The mark of Zorro.txt)
- the-masque-of-the-red-death (The Masque of the Red Death.txt)
- the-mirror-of-matsuyama (THE MIRROR OF MATSUYAMA.txt)
- the-miser-in-the-bush (THE MISER IN THE BUSH.txt)
- the-money-box (THE MONEY BOX.txt)
- the-monkey-and-the-jelly-fish (THE MONKEY AND THE JELLY-FISH.txt)
- the-monkey-s-paw (The Monkey's Paw.txt)
- the-moon-bog (The Moon-Bog.txt)
- the-mouse-the-bird-and-the-sausage (THE MOUSE, THE BIRD, AND THE SAUSAGE.txt)
- the-mystery-of-edwin-drood (The Mystery of Edwin Drood.txt)
- the-nameless-city (The Nameless City.txt)
- the-naughty-boy (The Naughty Boy.txt)
- the-new-accelerator (THE NEW ACCELERATOR.txt)
- the-nine-pea-hens-and-the-golden-apples (THE NINE PEA-HENS AND THE GOLDEN APPLES.txt)
- the-nunda-eater-of-people (THE NUNDA, EATER OF PEOPLE.txt)
- the-occasional-garden (THE OCCASIONAL GARDEN.txt)
- the-octopus-a-story-of-california (The Octopus - A Story of California.txt)
- the-ogre-of-rashomon (THE OGRE OF RASHOMON.txt)
- the-old-house (The Old House.txt)
- the-old-man-and-his-grandson (THE OLD MAN AND HIS GRANDSON.txt)
- the-one-handed-girl (The One-Handed Girl.txt)
- the-other-gods (The Other Gods.txt)
- the-outsider (The Outsider.txt)
- the-oversight (THE OVERSIGHT.txt)
- the-penance (THE PENANCE.txt)
- the-phantom-luncheon (THE PHANTOM LUNCHEON.txt)
- the-pink (THE PINK.txt)
- the-prince-and-the-pauper (The Prince and the Pauper.txt)
- the-prince-who-wanted-to-see-the-world (THE PRINCE WHO WANTED TO SEE THE WORLD.txt)
- the-princess-and-the-goblin (the-princess-and-the-goblin.txt)
- the-princess-who-was-hidden-underground (THE PRINCESS WHO WAS HIDDEN UNDERGROUND.txt)
- the-purple-of-the-balkan-kings (THE PURPLE OF THE BALKAN KINGS.txt)
- the-purple-pileus (THE PURPLE PILEUS.txt)
- the-quarrel-of-the-monkey-and-the-crab (THE QUARREL OF THE MONKEY AND THE CRAB.txt)
- the-queen-bee (THE QUEEN BEE.txt)
- the-railway-children (the-railway-children.txt)
- the-raspberry-worm (The Raspberry Worm.txt)
- the-raven (THE RAVEN.txt)
- the-real-princess (The Real Princess.txt)
- the-red-room (The Red Room.txt)
- the-red-shoes (The Red Shoes.txt)
- the-red-thumb-mark (The Red Thumb Mark.txt)
- the-regent-s-daughter (The regent's daughter.txt)
- the-remarkable-case-of-davidson-s-eyes (THE REMARKABLE CASE OF DAVIDSON'S EYES.txt)
- the-rich-brother-and-the-poor-brother (The Rich Brother and the Poor Brother.txt)
- the-robber-bridegroom (THE ROBBER BRIDEGROOM.txt)
- the-roses-and-the-sparrows (THE ROSES AND THE SPARROWS.txt)
- the-sagacious-monkey-and-the-boar (THE SAGACIOUS MONKEY AND THE BOAR.txt)
- the-salad (THE SALAD.txt)
- the-scarlet-letter (The Scarlet Letter.txt)
- the-sea-king-s-gift (The Sea King’s Gift.txt)
- the-sea-lady (The Sea Lady.txt)
- the-sea-wolf (the sea-wolf.txt)
- the-secret-garden (The Secret Garden.txt)
- the-seven-cream-jugs (THE SEVEN CREAM JUGS.txt)
- the-seven-ravens (THE SEVEN RAVENS.txt)
- the-shadow (The Shadow.txt)
- the-shadow-out-of-time (The Shadow Out of Time.txt)
- the-shadow-over-innsmouth (The shadow over Innsmouth.txt)
- the-sheep (THE SHEEP.txt)
- the-shifty-lad (The Shifty Lad.txt)
- the-shinansha-or-the-south-pointing-carriage (THE “SHINANSHA,” OR THE SOUTH POINTING CARRIAGE.txt)
- the-shoes-of-fortune (The Shoes of Fortune.txt)
- the-shunned-house (The Shunned House.txt)
- the-silver-key (The silver key.txt)
- the-snow-queen (THE SNOW QUEEN.txt)
- the-star (THE STAR.txt)
- the-statement-of-randolph-carter (The Statement of Randolph Carter.txt)
- the-steadfast-tin-soldier (THE STEADFAST TIN SOLDIER.txt)
- the-stolen-bacillus (THE STOLEN BACILLUS.txt)
- the-stolen-body (THE STOLEN BODY.txt)
- the-stones-of-five-colors-and-the-empress-jokwa (THE STONES OF FIVE COLORS AND THE EMPRESS JOKWA.txt)
- the-story-of-a-gazelle (THE STORY OF A GAZELLE.txt)
- the-story-of-a-mother (The Story of a Mother.txt)
- the-story-of-a-very-bad-boy (The Story of a Very Bad Boy.txt)
- the-story-of-halfman (THE STORY OF HALFMAN.txt)
- the-story-of-hassebu (THE STORY OF HASSEBU.txt)
- the-story-of-prince-yamato-take (THE STORY OF PRINCE YAMATO TAKE.txt)
- the-story-of-princess-hase (THE STORY OF PRINCESS HASE.txt)
- the-story-of-the-inexperienced-ghost (THE STORY OF THE INEXPERIENCED GHOST.txt)
- the-story-of-the-man-who-did-not-wish-to-die (THE STORY OF THE MAN WHO DID NOT WISH TO DIE.txt)
- the-story-of-the-old-man-who-made-withered-trees-to-flower (THE STORY OF THE OLD MAN WHO MADE WITHERED TREES TO FLOWER.txt)
- the-story-of-the-youth-who-went-forth-to-learn-what-fear-was (THE STORY OF THE YOUTH WHO WENT FORTH TO LEARN WHAT FEAR WAS.txt)
- the-story-of-three-wonderful-beggars (THE STORY OF THREE WONDERFUL BEGGARS.txt)
- the-story-of-urashima-taro-the-fisher-lad (THE STORY OF URASHIMA TARO, THE FISHER LAD.txt)
- the-strange-high-house-in-the-mist (The Strange High House in the Mist.txt)
- the-straw-the-coal-and-the-bean (THE STRAW, THE COAL, AND THE BEAN.txt)
- the-swineherd (The Swineherd.txt)
- the-tempest (The Tempest.txt)
- the-temple (The Temple.txt)
- the-temptation-of-harringay (THE TEMPTATION OF HARRINGAY.txt)
- the-thing-on-the-door-step (The thing on the door-step.txt)
- the-threat (THE THREAT.txt)
- the-three-crowns (The Three Crowns.txt)
- the-three-languages (THE THREE LANGUAGES.txt)
- the-three-musketeers (the-three-musketeers.txt)
- the-three-princes-and-their-beasts (THE THREE PRINCES AND THEIR BEASTS.txt)
- the-three-taps-a-detective-story-without-a-moral (The three taps - A detective story without a moral.txt)
- the-time-machine (The Time Machine.txt)
- the-tomb (The Tomb.txt)
- the-tongue-cut-sparrow (THE TONGUE-CUT SPARROW.txt)
- the-tower-treasure (The tower treasure.txt)
- the-toys-of-peace (THE TOYS OF PEACE.txt)
- the-travelling-musicians (THE TRAVELLING MUSICIANS.txt)
- the-treasure-in-the-forest (THE TREASURE IN THE FOREST.txt)
- the-tree (The Tree.txt)
- the-triumphs-of-a-taxidermist (THE TRIUMPHS OF A TAXIDERMIST.txt)
- the-truth-about-pyecraft (THE TRUTH ABOUT PYECRAFT.txt)
- the-turmoil (The Turmoil.txt)
- the-turn-of-the-screw (The Turn of the Screw.txt)
- the-turnip (THE TURNIP.txt)
- the-twelve-dancing-princesses (THE TWELVE DANCING PRINCESSES.txt)
- the-twelve-huntsmen (THE TWELVE HUNTSMEN.txt)
- the-two-frogs (THE TWO FROGS.txt)
- the-ugly-duckling (THE UGLY DUCKLING.txt)
- the-underground-workers (THE UNDERGROUND WORKERS.txt)
- the-unnamable (The Unnamable.txt)
- the-valiant-little-tailor (THE VALIANT LITTLE TAILOR.txt)
- the-valley-of-spiders (THE VALLEY OF SPIDERS.txt)
- the-virginian-a-horseman-of-the-plains (The Virginian - A Horseman of the Plains.txt)
- the-wailing-octopus-a-rick-brant-science-adventure-story (The Wailing Octopus - A Rick Brant Science-Adventure Story.txt)
- the-war-of-the-worlds (The War of the Worlds.txt)
- the-warden (The Warden.txt)
- the-water-babies (the-water-babies.txt)
- the-water-of-life (THE WATER OF LIFE.txt)
- the-wedding-of-mrs-fox (THE WEDDING OF MRS FOX.txt)
- the-wendigo (The Wendigo.txt)
- the-whisperer-in-darkness (The Whisperer in Darkness.txt)
- the-white-hare-and-the-crocodiles (THE WHITE HARE AND THE CROCODILES.txt)
- the-white-ship (The White Ship.txt)
- the-white-snake (THE WHITE SNAKE.txt)
- the-willow-wren-and-the-bear (THE WILLOW-WREN AND THE BEAR.txt)
- the-winning-of-olwen (The Winning of Olwen.txt)
- the-wolf-and-the-seven-little-kids (THE WOLF AND THE SEVEN LITTLE KIDS.txt)
- the-wolves-of-cernogratz (THE WOLVES OF CERNOGRATZ.txt)
- the-wonderful-tune (The Wonderful Tune.txt)
- the-wonderful-wizard-of-oz (the-wonderful-wizard-of-oz.txt)
- the-young-man-who-would-have-his-eyes-opened (THE YOUNG MAN WHO WOULD HAVE HIS EYES OPENED.txt)
- through-a-window (THROUGH A WINDOW.txt)
- through-the-looking-glass (Through the Looking-Glass.txt)
- tom-thumb (TOM THUMB.txt)
- treasure-island (treasure-island.txt)
- triplanetary (Triplanetary.txt)
- twenty-thousand-leagues-under-the-sea (Twenty Thousand Leagues under the Sea.txt)
- two-in-a-sack (TWO IN A SACK.txt)
- typhoon (Typhoon.txt)
- under-the-red-dragon (Under the Red Dragon.txt)
- unicorns (Unicorns.txt)
- violet-fairy-book (Violet Fairy Book.txt)
- virgilius-the-sorcerer (VIRGILIUS THE SORCERER.txt)
- winnie-the-pooh (Winnie-the-Pooh.txt)
- with-fire-and-sword (With Fire and Sword.txt)
- wuthering-heights (Wuthering Heights.txt)

### unresolved-source-generated-book

- a-princess-of-mars
- doctor-dolittle
- heidi
- jabberwocky
- nights-with-uncle-remus
- peter-pan
- tarzan-of-the-apes
- the-great-gatsby
- the-picture-of-dorian-gray
- the-thirty-nine-steps
- wood-folk-at-school

### known-duplicate-or-near-duplicate

- japanese-fairy-tales (Japanese Fairy Tales.txt)
- the-two-magics-the-turn-of-the-screw-covering-end (The Two Magics - The Turn of the Screw, Covering End.txt)
- the-wind-in-the-willows (The Wind in the Willows.txt)

### known-boundary-defect

- snow-white-and-rose-red (SNOW-WHITE AND ROSE-RED.txt)
- the-works-of-edgar-allan-poe (The Works of Edgar Allan Poe.txt)

### manual-review-required

- a-catastrophe (A CATASTROPHE.txt)
- in-the-abyss (IN THE ABYSS.txt)
- pollock-and-the-porroh-man (POLLOCK AND THE PORROH MAN.txt)
- the-colour-out-of-space (The colour out of space.txt)
- the-plattner-story (THE PLATTNER STORY.txt)

### blocked-source-or-rights-risk

- the-apple (THE APPLE.txt)
- the-dream-quest-of-unknown-kadath (The Dream-Quest of Unknown Kadath.txt)
- the-story-of-the-late-mr-elvesham (THE STORY OF THE LATE MR. ELVESHAM.txt)

### unsafe-automation-structure

- middlemarch (Middlemarch.txt)
- the-countess-of-pembroke-s-arcadia (The Countess of Pembroke's Arcadia.txt)
- the-financier (The Financier.txt)
- the-leavenworth-case (The Leavenworth Case.txt)
- the-mysterious-affair-at-styles (The Mysterious Affair at Styles.txt)
- the-sign-of-the-four (The Sign of the Four.txt)
- war-and-peace (War and Peace.txt)
- yellow-gentians-and-blue (Yellow gentians and blue.txt)

### unsafe-title-or-parent-collection-risk

- the-history-of-dwarf-long-nose (THE HISTORY OF DWARF LONG NOSE.txt)
- the-little-match-girl (The Little Match Girl.txt)

### unsafe-start-or-end-boundary-risk

- an-enquiry-concerning-human-understanding (An Enquiry Concerning Human Understanding.txt)
- emma (Emma.txt)
- erewhon-or-over-the-range (Erewhon; Or, Over the Range.txt)
- father-goriot (Father Goriot.txt)
- figures-of-earth-a-comedy-of-appearances (Figures of Earth - A Comedy of Appearances.txt)
- five-little-friends (Five Little Friends.txt)
- goblin-tales-of-lancashire (Goblin Tales of Lancashire.txt)
- great-expectations (Great Expectations.txt)
- history-of-tom-jones (History of Tom Jones.txt)
- island-nights-entertainments (Island Nights' Entertainments.txt)
- north-and-south (North and South.txt)
- northern-lights (Northern Lights.txt)
- siddhartha (Siddhartha.txt)
- the-adventures-of-sherlock-holmes (The Adventures of Sherlock Holmes.txt)
- the-arabian-nights-entertainments (The Arabian Nights Entertainments.txt)
- the-case-of-charles-dexter-ward (The case of Charles Dexter Ward.txt)
- the-happy-prince-and-other-tales (The Happy Prince, and Other Tales.txt)
- the-iliad (The Iliad.txt)
- the-moonstone (The Moonstone.txt)
- the-mysteries-of-udolpho (The Mysteries of Udolpho.txt)
- the-private-memoirs-and-confessions-of-a-justified-sinner (The Private Memoirs and Confessions of a Justified Sinner.txt)
- the-willows (The Willows.txt)
- the-woman-in-white (The Woman in White.txt)
- the-works-of-edgar-allan-poe-the-raven-edition (The Works of Edgar Allan Poe, The Raven Edition.txt)
- travelers-five-along-life-s-highway (Travelers Five Along Life's Highway.txt)
- walden-and-on-the-duty-of-civil-disobedience (Walden, and On The Duty Of Civil Disobedience.txt)

### unsafe-metadata-risk

- beowulf-an-anglo-saxon-epic-poem (Beowulf - An Anglo-Saxon Epic Poem.txt)
- the-sad-story-of-a-dramatic-critic (THE SAD STORY OF A DRAMATIC CRITIC.txt)
- under-the-knife (UNDER THE KNIFE.txt)

### unsafe-prose-preservation-risk

- None.

### non-book-or-invalid-file

- new-text-document (New Text Document.txt)
- screenshot-2026-06-13-014010 (Screenshot 2026-06-13 014010.png)

### needs-human-policy-decision

- None.

### candidate-for-future-manual-processing

- hamlet (Hamlet.txt)
- plays-of-sophocles-oedipus-the-king-oedipus-at-colonus-antigone (Plays of Sophocles - Oedipus the King; Oedipus at Colonus; Antigone.txt)
- the-odyssey (The Odyssey.txt)
- twenty-years-after (Twenty years after.txt)

## Manual And Future Bespoke Candidates

Manual-review-required live raw items:

- a-catastrophe (A CATASTROPHE.txt)
- in-the-abyss (IN THE ABYSS.txt)
- pollock-and-the-porroh-man (POLLOCK AND THE PORROH MAN.txt)
- the-colour-out-of-space (The colour out of space.txt)
- the-plattner-story (THE PLATTNER STORY.txt)

Future bespoke/manual candidates:

- hamlet (Hamlet.txt)
- plays-of-sophocles-oedipus-the-king-oedipus-at-colonus-antigone (Plays of Sophocles - Oedipus the King; Oedipus at Colonus; Antigone.txt)
- the-odyssey (The Odyssey.txt)
- twenty-years-after (Twenty years after.txt)

## Generated Variants Without One-To-One Live Raw Slug

- anne-of-green-gables-gutenberg-45
- the-count-of-monte-cristo-gutenberg-1184
- the-secret-garden-gutenberg-113
- wind-in-the-willows

These generated variants are not new raw-processing candidates in this branch; they are noted only to reconcile the generated-book count against live raw filename slugs.

## Recommended Next Phase

Recommendation: `Stop book ingestion and move to second-pass audit`.

All live raw files are now classified, dry-run 24 selected zero safe deterministic candidates, and the remaining raw-only pool is dominated by boundary, structure, metadata, source/provenance, duplicate, invalid, or bespoke-only cases.

Do not start the recommended phase in this branch.

## Later-Phase Requirements Restated Only

- independent second-pass audit using a different strategy
- original non-spoiler 300-500+ word SEO summaries after books and second-pass audit
- full site SEO/meta review using GSC data and route intent after summaries
- focused rage-click UX pass for /audio, /practice, homepage, and related utility pages after books/SEO
- SSR heap OOM investigation separately
- in-app Browser sandbox issue investigation separately
- intermittent fullscreen Playwright/UI behavior investigation separately
- final cleanup only after the system is stable

## Inputs Used

- `app/client/assets/books/audit-reports/pilot-dry-run-24/pilot-dry-run-24.json`
- `app/client/assets/books/audit-reports/pilot-dry-run-24/pilot-dry-run-24.md`
- `app/client/assets/books/audit-reports/pilot-dry-run-23/pilot-dry-run-23.json`
- `app/client/assets/books/audit-reports/pilot-write-23-verification/pilot-write-23-verification.json`
- `app/client/assets/books/audit-reports/pilot-write-23/pilot-write-23.json`
- `app/client/assets/books/audit-reports/pilot-write-22-verification/pilot-write-22-verification.json`
- `app/client/assets/books/audit-reports/batch-12-prose-restoration/batch-12-prose-restoration.json`
- `app/client/assets/books/audit-reports/title-start-default-content-audit-1/title-start-default-content-audit-1.json`
- `app/client/assets/books/audit-reports/metadata-segmentation-correctness-audit-1/metadata-segmentation-correctness-audit-1.json`
- `app/client/assets/books/audit-reports/manual-ui-defect-followup-1/manual-ui-defect-followup-1.json`
- `app/client/assets/books/audit-reports/book-processing-audit-pass-1.json`
- `app/client/assets/books/audit-reports/book-processing-audit-pass-2.json`
- `app/client/assets/books/audit-reports/book-structure-audit-1/book-structure-audit-1.json`
- `app/client/assets/books/audit-reports/pilot-write-1/pilot-write-1.json`
- `app/client/assets/books/audit-reports/pilot-write-1-verification/pilot-write-1-verification.json`
- `app/client/assets/books/audit-reports/pilot-write-2/pilot-write-2.json`
- `app/client/assets/books/audit-reports/pilot-write-2-verification/pilot-write-2-verification.json`
- `app/client/assets/books/audit-reports/pilot-write-3/pilot-write-3.json`
- `app/client/assets/books/audit-reports/pilot-write-3-verification/pilot-write-3-verification.json`
- `app/client/assets/books/audit-reports/pilot-write-4/pilot-write-4.json`
- `app/client/assets/books/audit-reports/pilot-write-4-verification/pilot-write-4-verification.json`
- `app/client/assets/books/audit-reports/pilot-write-5/pilot-write-5.json`
- `app/client/assets/books/audit-reports/pilot-write-5-verification/pilot-write-5-verification.json`
- `app/client/assets/books/audit-reports/pilot-write-6/pilot-write-6.json`
- `app/client/assets/books/audit-reports/pilot-write-6-verification/pilot-write-6-verification.json`
- `app/client/assets/books/audit-reports/pilot-write-7/pilot-write-7.json`
- `app/client/assets/books/audit-reports/pilot-write-7-verification/pilot-write-7-verification.json`
- `app/client/assets/books/audit-reports/pilot-write-8/pilot-write-8.json`
- `app/client/assets/books/audit-reports/pilot-write-8-verification/pilot-write-8-verification.json`
- `app/client/assets/books/audit-reports/pilot-write-9/pilot-write-9.json`
- `app/client/assets/books/audit-reports/pilot-write-9-verification/pilot-write-9-verification.json`
- `app/client/assets/books/audit-reports/pilot-write-10/pilot-write-10.json`
- `app/client/assets/books/audit-reports/pilot-write-10-verification/pilot-write-10-verification.json`
- `app/client/assets/books/audit-reports/pilot-write-11/pilot-write-11.json`
- `app/client/assets/books/audit-reports/pilot-write-11-verification/pilot-write-11-verification.json`
- `app/client/assets/books/audit-reports/pilot-write-12/pilot-write-12.json`
- `app/client/assets/books/audit-reports/pilot-write-12-verification/pilot-write-12-verification.json`
- `app/client/assets/books/audit-reports/pilot-write-13/pilot-write-13.json`
- `app/client/assets/books/audit-reports/pilot-write-13-verification/pilot-write-13-verification.json`
- `app/client/assets/books/audit-reports/pilot-write-14/pilot-write-14.json`
- `app/client/assets/books/audit-reports/pilot-write-14-verification/pilot-write-14-verification.json`
- `app/client/assets/books/audit-reports/pilot-write-15/pilot-write-15.json`
- `app/client/assets/books/audit-reports/pilot-write-15-verification/pilot-write-15-verification.json`
- `app/client/assets/books/audit-reports/pilot-write-16/pilot-write-16.json`
- `app/client/assets/books/audit-reports/pilot-write-16-verification/pilot-write-16-verification.json`
- `app/client/assets/books/audit-reports/pilot-write-17/pilot-write-17.json`
- `app/client/assets/books/audit-reports/pilot-write-17-verification/pilot-write-17-verification.json`
- `app/client/assets/books/audit-reports/pilot-write-18/pilot-write-18.json`
- `app/client/assets/books/audit-reports/pilot-write-18-verification/pilot-write-18-verification.json`
- `app/client/assets/books/audit-reports/pilot-write-19/pilot-write-19.json`
- `app/client/assets/books/audit-reports/pilot-write-19-verification/pilot-write-19-verification.json`
- `app/client/assets/books/audit-reports/pilot-write-20/pilot-write-20.json`
- `app/client/assets/books/audit-reports/pilot-write-20-verification/pilot-write-20-verification.json`
- `app/client/assets/books/audit-reports/pilot-write-21/pilot-write-21.json`
- `app/client/assets/books/audit-reports/pilot-write-21-verification/pilot-write-21-verification.json`
- `app/client/assets/books/audit-reports/pilot-write-22/pilot-write-22.json`

## Protected Folder Confirmation

- No generated books were modified.
- No preview assets were modified.
- No raw sources were modified.
- No Cloudflare exports were modified.
- No write batch was created.
- No dry-run batch 25 was created.
