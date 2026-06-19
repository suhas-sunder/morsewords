# Title/Start/Default Content Audit 1

Focused false-positive audit for generated book title identity, first default content, startup preview starts, and selected-source runtime consistency.

## Summary

- Generated books audited: 252
- Accepted/generated books audited: 117
- Corrections applied: 12
- Accepted books corrected: 12
- Acceptance revoked pending correction after this pass: 0

## Runtime Consistency

- the-call-of-the-wild: generated data and preview asset are correct; manual Chapter II observation exposed a runtime selected-source ordering bug
- Evidence: chapter-001 is default included and starts with Chapter I. Into the Primitive. startup preview defaultSectionId is chapter-001. targeted regression seeds saved progress/active section at chapter-002 and verifies selected-source preview still starts at Chapter I. selected loaded sections now preserve the selected/default section id order rather than re-sorting by section payload order.
- Runtime fix: The cleaned reading preview pre element now resets scrollTop when selected source text/book changes so stale scroll position cannot make the panel appear to start later.

## Corrections

### the-bell

- Correction: generated title and default-start correction
- Source: app/client/assets/temp-books/The Bell.txt
- Before title: The Bell
- After title: The Bell
- Before first default: chapter-001 The Bell
- After first default: chapter-001 The Bell
- Before preview start: THE BELL People said "The Evening Bell is sounding, the sun is setting." For a strange wondrous tone was heard in the narrow streets of a large town. It was like the sound of a church-bell: but it was only heard for a m...
- After preview start: THE BELL People said "The Evening Bell is sounding, the sun is setting." For a strange wondrous tone was heard in the narrow streets of a large town. It was like the sound of a church-bell: but it was only heard for a m...
- Removed/fixed: parent collection title/byline removed from default playback

### the-elderbush

- Correction: generated title and default-start correction
- Source: app/client/assets/temp-books/The Elderbush.txt
- Before title: The Elderbush
- After title: The Elderbush
- Before first default: chapter-001 The Elderbush
- After first default: chapter-001 The Elderbush
- Before preview start: THE ELDERBUSH Once upon a time there was a little boy who had taken cold. He had gone out and got his feet wet; though nobody could imagine how it had happened, for it was quite dry weather. So his mother undressed him,...
- After preview start: THE ELDERBUSH Once upon a time there was a little boy who had taken cold. He had gone out and got his feet wet; though nobody could imagine how it had happened, for it was quite dry weather. So his mother undressed him,...
- Removed/fixed: parent collection title/byline removed from default playback

### the-emperor-s-new-clothes

- Correction: generated title and default-start correction
- Source: app/client/assets/temp-books/THE EMPEROR'S NEW CLOTHES.txt
- Before title: The Emperor's New Clothes
- After title: The Emperor's New Clothes
- Before first default: chapter-001 The Emperor's New Clothes
- After first default: chapter-001 The Emperor's New Clothes
- Before preview start: THE EMPEROR'S NEW CLOTHES Many years ago, there was an Emperor, who was so excessively fond of new clothes, that he spent all his money in dress. He did not trouble himself in the least about his soldiers; nor did he ca...
- After preview start: THE EMPEROR'S NEW CLOTHES Many years ago, there was an Emperor, who was so excessively fond of new clothes, that he spent all his money in dress. He did not trouble himself in the least about his soldiers; nor did he ca...
- Removed/fixed: parent collection title/byline removed from default playback

### the-fir-tree

- Correction: generated title and default-start correction
- Source: app/client/assets/temp-books/The Fir Tree.txt
- Before title: The Fir Tree
- After title: The Fir Tree
- Before first default: chapter-001 The Fir Tree
- After first default: chapter-001 The Fir Tree
- Before preview start: THE FIR TREE Out in the woods stood a nice little Fir Tree. The place he had was a very good one: the sun shone on him: as to fresh air, there was enough of that, and round him grew many large-sized comrades, pines as w...
- After preview start: THE FIR TREE Out in the woods stood a nice little Fir Tree. The place he had was a very good one: the sun shone on him: as to fresh air, there was enough of that, and round him grew many large-sized comrades, pines as w...
- Removed/fixed: parent collection title/byline removed from default playback

### the-leap-frog

- Correction: generated title and default-start correction
- Source: app/client/assets/temp-books/The Leap-Frog.txt
- Before title: The Leap-Frog
- After title: The Leap-Frog
- Before first default: chapter-001 The Leap-Frog
- After first default: chapter-001 The Leap-Frog
- Before preview start: THE LEAP-FROG A Flea, a Grasshopper, and a Leap-frog once wanted to see which could jump highest; and they invited the whole world, and everybody else besides who chose to come to see the festival. Three famous jumpers...
- After preview start: THE LEAP-FROG A Flea, a Grasshopper, and a Leap-frog once wanted to see which could jump highest; and they invited the whole world, and everybody else besides who chose to come to see the festival. Three famous jumpers...
- Removed/fixed: parent collection title/byline removed from default playback

### the-real-princess

- Correction: generated title and default-start correction
- Source: app/client/assets/temp-books/The Real Princess.txt
- Before title: The Real Princess
- After title: The Real Princess
- Before first default: chapter-001 The Real Princess
- After first default: chapter-001 The Real Princess
- Before preview start: THE REAL PRINCESS There was once a Prince who wished to marry a Princess; but then she must be a real Princess. He travelled all over the world in hopes of finding such a lady; but there was always something wrong. Prin...
- After preview start: THE REAL PRINCESS There was once a Prince who wished to marry a Princess; but then she must be a real Princess. He travelled all over the world in hopes of finding such a lady; but there was always something wrong. Prin...
- Removed/fixed: parent collection title/byline removed from default playback

### the-old-house

- Correction: generated title and default-start correction
- Source: app/client/assets/temp-books/The Old House.txt
- Before title: The Old House
- After title: The Old House
- Before first default: chapter-001 The Old House
- After first default: chapter-001 The Old House
- Before preview start: THE OLD HOUSE In the street, up there, was an old, a very old house--it was almost three hundred years old, for that might be known by reading the great beam on which the date of the year was carved: together with tulip...
- After preview start: THE OLD HOUSE In the street, up there, was an old, a very old house--it was almost three hundred years old, for that might be known by reading the great beam on which the date of the year was carved: together with tulip...
- Removed/fixed: parent collection title/byline removed from default playback; unrelated later Andersen stories removed from this individual story output

### the-shoes-of-fortune

- Correction: generated title and sectioning correction
- Source: app/client/assets/temp-books/The Shoes of Fortune.txt
- Before title: The Shoes of Fortune
- After title: The Shoes of Fortune
- Before first default: chapter-001 Part 1
- After first default: chapter-001 Part 1
- Before preview start: I. A Beginning Every author has some peculiarity in his descriptions or in his style of writing. Those who do not like him, magnify it, shrug up their shoulders, and exclaim--there he is again! I, for my part, know very...
- After preview start: I. A Beginning Every author has some peculiarity in his descriptions or in his style of writing. Those who do not like him, magnify it, shrug up their shoulders, and exclaim--there he is again! I, for my part, know very...
- Removed/fixed: parent collection title/byline removed from default playback; fallback part blobs replaced with source numbered sections

### the-money-box

- Correction: generated title correction
- Source: app/client/assets/temp-books/THE MONEY BOX.txt
- Before title: The Money Box
- After title: The Money Box
- Before first default: chapter-001 The Money Box
- After first default: chapter-001 The Money Box
- Before preview start: IN a nursery where a number of toys lay scattered about, a money box stood on the top of a very high wardrobe. It was made of clay in the shape of a pig and had been bought of the potter. In the back of the pig was a sl...
- After preview start: IN a nursery where a number of toys lay scattered about, a money box stood on the top of a very high wardrobe. It was made of clay in the shape of a pig and had been bought of the potter. In the back of the pig was a sl...
- Removed/fixed: parent collection title removed from generated title/cover metadata

### the-snow-queen

- Correction: generated title correction
- Source: app/client/assets/temp-books/THE SNOW QUEEN.txt
- Before title: The Snow Queen
- After title: The Snow Queen
- Before first default: chapter-001 Story 1
- After first default: chapter-001 Story 1
- Before preview start: STORY THE FIRST WHICH DESCRIBES A LOOKING-GLASS AND ITS BROKEN FRAGMENTS YOU must attend to the beginning of this story, for when we get to the end we shall know more than we now do about a very wicked hobgoblin; he was...
- After preview start: STORY THE FIRST WHICH DESCRIBES A LOOKING-GLASS AND ITS BROKEN FRAGMENTS YOU must attend to the beginning of this story, for when we get to the end we shall know more than we now do about a very wicked hobgoblin; he was...
- Removed/fixed: parent collection title removed from generated title/cover metadata

### the-swineherd

- Correction: generated title correction
- Source: app/client/assets/temp-books/The Swineherd.txt
- Before title: The Swineherd
- After title: The Swineherd
- Before first default: chapter-001 The Swineherd
- After first default: chapter-001 The Swineherd
- Before preview start: THE SWINEHERD There was once a poor Prince, who had a kingdom. His kingdom was very small, but still quite large enough to marry upon; and he wished to marry. It was certainly rather cool of him to say to the Emperor's...
- After preview start: THE SWINEHERD There was once a poor Prince, who had a kingdom. His kingdom was very small, but still quite large enough to marry upon; and he wished to marry. It was certainly rather cool of him to say to the Emperor's...
- Removed/fixed: parent collection title removed from generated title/cover metadata

### the-winning-of-olwen

- Correction: generated title correction
- Source: app/client/assets/temp-books/The Winning of Olwen.txt
- Before title: The Winning of Olwen
- After title: The Winning of Olwen
- Before first default: chapter-001 The Winning of Olwen
- After first default: chapter-001 The Winning of Olwen
- Before preview start: There was once a king and queen who had a little boy, and they called his name Kilweh. The queen, his mother, fell ill soon after his birth, and as she could not take care of him herself she sent him to a woman she knew...
- After preview start: There was once a king and queen who had a little boy, and they called his name Kilweh. The queen, his mother, fell ill soon after his birth, and as she could not take care of him herself she sent him to a woman she knew...
- Removed/fixed: parent collection title removed from generated title/cover metadata

## Critical Examples

| Slug | Accepted before audit | Verdict | Classifications | First default | Preview start |
| --- | --- | --- | --- | --- | --- |
| the-call-of-the-wild | yes | still acceptable | still acceptable | chapter-001 Into the Primitive | Chapter I. Into the Primitive "Old longings nomadic leap, Chafing at custom's chain; Again from its brumal sleep Wakens the ferine strain." Buck did not read the newspapers, or he would have known that trouble was brewi... |
| the-elderbush | yes | corrected in this pass | still acceptable | chapter-001 The Elderbush | THE ELDERBUSH Once upon a time there was a little boy who had taken cold. He had gone out and got his feet wet; though nobody could imagine how it had happened, for it was quite dry weather. So his mother undressed him,... |
| the-emperor-s-new-clothes | yes | corrected in this pass | still acceptable | chapter-001 The Emperor's New Clothes | THE EMPEROR'S NEW CLOTHES Many years ago, there was an Emperor, who was so excessively fond of new clothes, that he spent all his money in dress. He did not trouble himself in the least about his soldiers; nor did he ca... |
| the-fir-tree | yes | corrected in this pass | still acceptable | chapter-001 The Fir Tree | THE FIR TREE Out in the woods stood a nice little Fir Tree. The place he had was a very good one: the sun shone on him: as to fresh air, there was enough of that, and round him grew many large-sized comrades, pines as w... |
| the-leap-frog | yes | corrected in this pass | still acceptable | chapter-001 The Leap-Frog | THE LEAP-FROG A Flea, a Grasshopper, and a Leap-frog once wanted to see which could jump highest; and they invited the whole world, and everybody else besides who chose to come to see the festival. Three famous jumpers... |
| the-real-princess | yes | corrected in this pass | still acceptable | chapter-001 The Real Princess | THE REAL PRINCESS There was once a Prince who wished to marry a Princess; but then she must be a real Princess. He travelled all over the world in hopes of finding such a lady; but there was always something wrong. Prin... |
| the-shoes-of-fortune | yes | corrected in this pass | still acceptable | chapter-001 A Beginning | I. A Beginning Every author has some peculiarity in his descriptions or in his style of writing. Those who do not like him, magnify it, shrug up their shoulders, and exclaim--there he is again! I, for my part, know very... |
| the-snow-queen | yes | corrected in this pass | still acceptable | chapter-001 Which Describes A Looking-Glass and Its Broken Fragments | STORY THE FIRST WHICH DESCRIBES A LOOKING-GLASS AND ITS BROKEN FRAGMENTS YOU must attend to the beginning of this story, for when we get to the end we shall know more than we now do about a very wicked hobgoblin; he was... |
| the-swineherd | yes | corrected in this pass | still acceptable | chapter-001 The Swineherd | THE SWINEHERD There was once a poor Prince, who had a kingdom. His kingdom was very small, but still quite large enough to marry upon; and he wished to marry. It was certainly rather cool of him to say to the Emperor's... |
| the-emerald-city-of-oz | yes | still acceptable | still acceptable | chapter-001 How the Nome King Became Angry | The Nome King was in an angry mood, and at such times he was very disagreeable. Every one kept away from him, even his Chief Steward Kaliko. Therefore the King stormed and raved all by himself, walking up and down in hi... |
| romeo-and-juliet | yes | still acceptable | still acceptable | prologue-001 The Prologue | THE PROLOGUE Enter Chorus. CHORUS. Two households, both alike in dignity, In fair Verona, where we lay our scene, From ancient grudge break to new mutiny, Where civil blood makes civil hands unclean. From forth the fata... |

## Flagged Accepted Books

- None remain after the focused corrections in this pass.

## Full Generated Book Audit

| Slug | Accepted | Generated title | Expected title | Source | Classifications | Verdict |
| --- | --- | --- | --- | --- | --- | --- |
| a-childs-garden-of-verses | yes | A Child's Garden of Verses | A Childs Garden of Verses | a-childs-garden-of-verses.txt | still acceptable | still acceptable |
| a-christmas-carol | no | A Christmas Carol in Prose; Being a Ghost Story of Christmas | A Christmas Carol | a-christmas-carol.txt | needs generated start/default correction | not previously accepted |
| a-dream-of-armageddon | yes | A Dream of Armageddon | A Dream of Armageddon | A DREAM OF ARMAGEDDON.txt | still acceptable | still acceptable |
| a-japanese-blossom | no | A Japanese Blossom | A Japanese Blossom | A Japanese Blossom.txt | still acceptable | not previously accepted |
| a-journal-of-the-plague-year | yes | A Journal of the Plague Year | A Journal of the Plague Year | A Journal of the Plague Year.txt | still acceptable | still acceptable |
| a-journey-to-the-centre-of-the-earth | yes | A Journey to the Centre of the Earth | A Journey to the Centre of the Earth | A Journey to the Centre of the Earth.txt | still acceptable | still acceptable |
| a-midsummer-night-s-dream | yes | A Midsummer Night's Dream | A Midsummer Night's Dream | A Midsummer Night's Dream.txt | still acceptable | still acceptable |
| a-princess-of-mars | no | A princess of Mars | A Princess of Mars | unresolved | still acceptable | not previously accepted |
| a-room-with-a-view | yes | A Room with a View | A Room with a View | A Room with a View.txt | still acceptable | still acceptable |
| a-story-of-the-stone-age | no | A Story of the Stone Age | A Story of the Stone Age | A Story of the Stone Age.txt | still acceptable | not previously accepted |
| a-study-in-scarlet | no | A Study in Scarlet | A Study in Scarlet | A Study in Scarlet.txt | still acceptable | not previously accepted |
| a-tale-of-two-cities | yes | A Tale of Two Cities | A Tale of Two Cities | A Tale of Two Cities.txt | still acceptable | still acceptable |
| agamemnon-of-aeschylus | yes | The Agamemnon of Aeschylus | Agamemnon of Aeschylus | Agamemnon of Aeschylus.txt | still acceptable | still acceptable |
| alices-adventures-in-wonderland | yes | Alice's Adventures in Wonderland | Alices Adventures in Wonderland | alices-adventures-in-wonderland.txt | still acceptable | still acceptable |
| almayer-s-folly-a-story-of-an-eastern-river | yes | Almayer's Folly: A Story of an Eastern River | Almayer s Folly a Story of an Eastern River | Almayer's Folly - A Story of an Eastern River.txt | still acceptable | still acceptable |
| an-ideal-husband | yes | An Ideal Husband | An Ideal Husband | An Ideal Husband.txt | still acceptable | still acceptable |
| anna-karenina | yes | Anna Karenina | Anna Karenina | Anna Karenina.txt | still acceptable | still acceptable |
| anne-of-avonlea | yes | Anne of Avonlea | Anne of Avonlea | Anne of Avonlea.txt | still acceptable | still acceptable |
| anne-of-green-gables | yes | Anne of Green Gables | Anne of Green Gables | Anne of Green Gables.txt | still acceptable | still acceptable |
| anne-of-green-gables-gutenberg-45 | yes | Anne of Green Gables | Anne of Green Gables 45 | unresolved | still acceptable | still acceptable |
| around-the-world-in-eighty-days | yes | Around the World in Eighty Days | Around the World in Eighty Days | around-the-world-in-eighty-days.txt | still acceptable | still acceptable |
| astounding-stories-of-super-science | no | Astounding Stories of Super-Science, October, 1930 | Astounding Stories of Super Science | Astounding Stories of Super-Science.txt | still acceptable | not previously accepted |
| at-the-earth-s-core | no | At the Earth's Core | At the Earth s Core | At the Earth's Core.txt | still acceptable | not previously accepted |
| at-the-mountains-of-madness | no | At the Mountains of Madness | At the Mountains of Madness | At the mountains of madness.txt | still acceptable | not previously accepted |
| black-beauty | yes | Black Beauty The autobiography of a horse | Black Beauty | black-beauty.txt | still acceptable | still acceptable |
| botchan | yes | Botchan (Master Darling) | Botchan | Botchan.txt | still acceptable | still acceptable |
| can-you-forgive-her | no | Can You Forgive Her? | Can You Forgive Her | Can You Forgive Her.txt | still acceptable | not previously accepted |
| candide | yes | Candide | Candide | Candide.txt | still acceptable | still acceptable |
| canossa | no | Canossa | Canossa | CANOSSA.txt | still acceptable | not previously accepted |
| catriona | yes | Catriona | Catriona | Catriona.txt | still acceptable | still acceptable |
| clever-hans | no | Clever Hans | Clever Hans | CLEVER HANS.txt | still acceptable | not previously accepted |
| cool-air | no | Cool Air | Cool Air | Cool air.txt | still acceptable | not previously accepted |
| cranford | yes | Cranford | Cranford | Cranford.txt | still acceptable | still acceptable |
| crime-and-punishment | yes | Crime and Punishment | Crime and Punishment | Crime and Punishment.txt | still acceptable | still acceptable |
| dagon | no | Dagon | Dagon | Dagon.txt | still acceptable | not previously accepted |
| deep-sea-plunderings | no | Deep-Sea Plunderings | Deep Sea Plunderings | Deep-Sea Plunderings.txt | still acceptable | not previously accepted |
| despair-s-last-journey | no | Despair's Last Journey | Despair s Last Journey | Despair's Last Journey.txt | still acceptable | not previously accepted |
| doctor-dolittle | no | The Story of Doctor Dolittle | Doctor Dolittle | unresolved | needs generated start/default correction | not previously accepted |
| don-quixote | yes | Don Quixote | Don Quixote | Don Quixote.txt | still acceptable | still acceptable |
| dr-jekyll-and-mr-hyde | no | The strange case of Dr. Jekyll and Mr. Hyde | Dr Jekyll and Mr Hyde | Dr. Jekyll and Mr. Hyde.txt | needs generated start/default correction | not previously accepted |
| dracula | yes | Dracula | Dracula | Dracula.txt | still acceptable | still acceptable |
| filmer | no | Filmer | Filmer | FILMER.txt | still acceptable | not previously accepted |
| five-children-and-it | no | Five Children and It | Five Children and It | Five Children and It.txt | still acceptable | not previously accepted |
| five-little-peppers-and-how-they-grew | yes | Five Little Peppers and How They Grew | Five Little Peppers and How They Grew | five-little-peppers-and-how-they-grew.txt | still acceptable | still acceptable |
| five-little-peppers-at-school | no | Five Little Peppers at School | Five Little Peppers At School | Five Little Peppers at School.txt | still acceptable | not previously accepted |
| five-weeks-in-a-balloon | yes | Five Weeks in a Balloon | Five Weeks in a Balloon | Five Weeks in a Balloon.txt | still acceptable | still acceptable |
| flatland-a-romance-of-many-dimensions | no | Flatland: A Romance of Many Dimensions | Flatland a Romance of Many Dimensions | Flatland - A Romance of Many Dimensions.txt | still acceptable | not previously accepted |
| for-the-duration-of-the-war | yes | The Toys of Peace, and Other Papers | For the Duration of the War | FOR THE DURATION OF THE WAR.txt | still acceptable | still acceptable |
| four-day-planet | yes | Four-Day Planet | Four Day Planet | Four-Day Planet.txt | still acceptable | still acceptable |
| frankenstein | yes | Frankenstein; or, the Modern Prometheus | Frankenstein | Frankenstein.txt | still acceptable | still acceptable |
| from-beyond | no | From Beyond | From Beyond | From Beyond.txt | still acceptable | not previously accepted |
| grimm-s-fairy-tales | yes | Grimm's Fairy Tales | Grimm s Fairy Tales | Grimm's Fairy Tales.txt | still acceptable | still acceptable |
| gulliver-s-travels | yes | Gulliver's Travels into Several Remote Nations of the World | Gulliver s Travels | Gulliver's Travels.txt | still acceptable | still acceptable |
| heidi | no | Heidi | Heidi | unresolved | needs generated start/default correction | not previously accepted |
| herland | no | Herland | Herland | Herland.txt | still acceptable | not previously accepted |
| hero-myths-and-legends-of-the-british-race | no | Hero-Myths & Legends of the British Race | Hero Myths and Legends of the British Race | Hero-Myths & Legends of the British Race.txt | still acceptable | not previously accepted |
| howards-end | no | Howards End | Howards End | Howards End.txt | still acceptable | not previously accepted |
| jabberwocky | no | Jabberwocky | Jabberwocky | unresolved | needs generated start/default correction | not previously accepted |
| jack-and-jill | yes | Jack and Jill | Jack and Jill | jack-and-jill.txt | still acceptable | still acceptable |
| jane-eyre | yes | Jane Eyre: An Autobiography | Jane Eyre | Jane Eyre.txt | still acceptable | still acceptable |
| jorinda-and-jorindel | no | Jorinda and Jorindel | Jorinda and Jorindel | JORINDA AND JORINDEL.txt | still acceptable | not previously accepted |
| kidnapped | no | Kidnapped | Kidnapped | Kidnapped.txt | still acceptable | not previously accepted |
| king-arthur-and-the-knights-of-the-round-table | no | King Arthur and the Knights of the Round Table | King Arthur and the Knights of the Round Table | King Arthur and the Knights of the Round Table.txt | still acceptable | not previously accepted |
| les-miserables | yes | Les Misérables | Les Miserables | Les Misérables.txt | still acceptable | still acceptable |
| little-fuzzy | yes | Little Fuzzy | Little Fuzzy | Little Fuzzy.txt | still acceptable | still acceptable |
| little-ida-s-flowers | no | Little Ida's Flowers | Little Ida s Flowers | LITTLE IDA'S FLOWERS.txt | still acceptable | not previously accepted |
| little-women | yes | Little Women; Or, Meg, Jo, Beth, and Amy | Little Women | Little Women.txt | still acceptable | still acceptable |
| lord-jim | no | Lord Jim | Lord Jim | Lord Jim.txt | still acceptable | not previously accepted |
| love-among-the-chickens | no | Love Among the Chickens | Love Among the Chickens | Love Among the Chickens.txt | still acceptable | not previously accepted |
| macbeth | yes | Macbeth | Macbeth | Macbeth.txt | still acceptable | still acceptable |
| mark | no | Mark | Mark | MARK.txt | still acceptable | not previously accepted |
| metamorphosis | no | Metamorphosis | Metamorphosis | Metamorphosis.txt | still acceptable | not previously accepted |
| moby-dick | yes | Moby-Dick; or, The Whale | Moby Dick | Moby Dick.txt | still acceptable | still acceptable |
| mother-holle | no | Mother Holle | Mother Holle | MOTHER HOLLE.txt | still acceptable | not previously accepted |
| murder-in-the-maze | no | Murder in the Maze | Murder in the Maze | Murder in the Maze.txt | still acceptable | not previously accepted |
| new-treasure-seekers | yes | New Treasure Seekers; Or, The Bastable Children in Search of a Fortune | New Treasure Seekers | new-treasure-seekers.txt | still acceptable | still acceptable |
| nights-with-uncle-remus | no | Nights With Uncle Remus | Nights with Uncle Remus | unresolved | needs generated start/default correction | not previously accepted |
| ole-luk-oie-the-dream-god | no | Ole-Luk-Oie, the Dream-God | Ole Luk Oie the Dream God | OLE-LUK-OIE THE DREAM GOD.txt | still acceptable | not previously accepted |
| oliver-twist | no | Oliver Twist | Oliver Twist | Oliver Twist.txt | still acceptable | not previously accepted |
| parnassus-on-wheels | no | Parnassus on Wheels | Parnassus On Wheels | Parnassus on Wheels.txt | still acceptable | not previously accepted |
| persuasion | yes | Persuasion | Persuasion | Persuasion.txt | still acceptable | still acceptable |
| peter-pan | no | Peter Pan [Peter and Wendy] | Peter Pan | unresolved | still acceptable | not previously accepted |
| pickman-s-model | no | Pickman's Model | Pickman s Model | Pickman's Model.txt | still acceptable | not previously accepted |
| pointed-roofs | yes | Pointed Roofs | Pointed Roofs | Pointed Roofs.txt | still acceptable | still acceptable |
| pollyanna | no | Pollyanna | Pollyanna | Pollyanna.txt | still acceptable | not previously accepted |
| pride-and-prejudice | yes | Pride and Prejudice | Pride and Prejudice | Pride and Prejudice.txt | still acceptable | still acceptable |
| pygmalion | yes | Pygmalion | Pygmalion | Pygmalion.txt | still acceptable | still acceptable |
| quail-seed | no | Quail Seed | Quail Seed | QUAIL SEED.txt | still acceptable | not previously accepted |
| quo-vadis | no | Quo Vadis: A Narrative of the Time of Nero | Quo Vadis | Quo Vadis.txt | still acceptable | not previously accepted |
| rainbow-valley | yes | Rainbow Valley | Rainbow Valley | rainbow-valley.txt | still acceptable | still acceptable |
| rapunzel | no | Rapunzel | Rapunzel | RAPUNZEL.txt | still acceptable | not previously accepted |
| rinkitink-in-oz | yes | Rinkitink in Oz | Rinkitink in Oz | rinkitink-in-oz.txt | still acceptable | still acceptable |
| robert-orange | no | Robert Orange | Robert Orange | Robert Orange.txt | still acceptable | not previously accepted |
| romeo-and-juliet | yes | Romeo and Juliet | Romeo and Juliet | Romeo and Juliet.txt | still acceptable | still acceptable |
| room-13 | yes | Room 13 | Room 13 | Room 13.txt | still acceptable | still acceptable |
| sense-and-sensibility | yes | Sense and Sensibility | Sense and Sensibility | Sense and Sensibility.txt | still acceptable | still acceptable |
| shen-of-the-sea-a-book-for-children | no | Shen of the Sea: A Book for Children | Shen of the Sea a Book for Children | Shen of the Sea - A Book for Children.txt | still acceptable | not previously accepted |
| shock-tactics | no | Shock Tactics | Shock Tactics | SHOCK TACTICS.txt | still acceptable | not previously accepted |
| six-girls-a-home-story | no | Six Girls: A Home Story | Six Girls a Home Story | Six Girls - A Home Story.txt | still acceptable | not previously accepted |
| spoon-river-anthology | yes | Spoon River Anthology | Spoon River Anthology | Spoon River Anthology.txt | still acceptable | still acceptable |
| sun-tzu-on-the-art-of-war | yes | Sun Tzŭ on the Art of War: The Oldest Military Treatise in the World | Sun Tzu On the Art of War | Sun Tzŭ on the Art of War.txt | still acceptable | still acceptable |
| tales-of-war | yes | Tales of War | Tales of War | Tales of War.txt | still acceptable | still acceptable |
| tarzan-of-the-apes | no | Tarzan of the Apes | Tarzan of the Apes | unresolved | still acceptable | not previously accepted |
| the-adventures-of-chanticleer-and-partlet | no | The Adventures of Chanticleer and Partlet | The Adventures of Chanticleer and Partlet | THE ADVENTURES OF CHANTICLEER AND PARTLET.txt | still acceptable | not previously accepted |
| the-adventures-of-ferdinand-count-fathom | yes | The Adventures of Ferdinand Count Fathom — Complete | The Adventures of Ferdinand Count Fathom | The Adventures of Ferdinand Count Fathom.txt | still acceptable | still acceptable |
| the-adventures-of-kintaro-the-golden-boy | no | The Adventures of Kintaro, the Golden Boy | The Adventures of Kintaro the Golden Boy | THE ADVENTURES OF KINTARO, THE GOLDEN BOY.txt | still acceptable | not previously accepted |
| the-adventures-of-pinocchio | no | The Adventures of Pinocchio | The Adventures of Pinocchio | The Adventures of Pinocchio.txt | still acceptable | not previously accepted |
| the-adventures-of-roderick-random | yes | The Adventures of Roderick Random | The Adventures of Roderick Random | The Adventures of Roderick Random.txt | still acceptable | still acceptable |
| the-adventures-of-tom-sawyer | yes | The Adventures of Tom Sawyer | The Adventures of Tom Sawyer | The Adventures of Tom Sawyer.txt | still acceptable | still acceptable |
| the-amateur-cracksman | no | The Amateur Cracksman | The Amateur Cracksman | The Amateur Cracksman.txt | still acceptable | not previously accepted |
| the-arabian-nights | yes | The Arabian Nights: Their Best-known Tales | The Arabian Nights | the-arabian-nights.txt | still acceptable | still acceptable |
| the-art-of-war | yes | The Art of War | The Art of War | The Art of War.txt | still acceptable | still acceptable |
| the-bamboo-cutter-and-the-moon-child | no | The Bamboo-Cutter and the Moon-Child | The Bamboo Cutter and the Moon Child | THE BAMBOO-CUTTER AND THE MOON-CHILD.txt | still acceptable | not previously accepted |
| the-bell | yes | The Bell | The Bell | The Bell.txt | still acceptable | corrected in this pass |
| the-benson-murder-case | no | The Benson Murder Case | The Benson Murder Case | The Benson Murder Case.txt | still acceptable | not previously accepted |
| the-black-star-passes | no | The Black Star Passes | The Black Star Passes | The Black Star Passes.txt | still acceptable | not previously accepted |
| the-blue-castle | no | The Blue Castle: a novel | The Blue Castle | The Blue Castle.txt | still acceptable | not previously accepted |
| the-book-of-dragons | yes | The Book of Dragons | The Book of Dragons | the-book-of-dragons.txt | still acceptable | still acceptable |
| the-brothers-karamazov | no | The Brothers Karamazov | The Brothers Karamazov | The Brothers Karamazov.txt | still acceptable | not previously accepted |
| the-buccaneer | no | The Buccaneer: A Tale | The Buccaneer | The Buccaneer.txt | still acceptable | not previously accepted |
| the-call-of-cthulhu | yes | The call of Cthulhu | The Call of Cthulhu | The call of Cthulhu.txt | still acceptable | still acceptable |
| the-call-of-the-wild | yes | The Call of the Wild | The Call of the Wild | The call of the wild.txt | still acceptable | still acceptable |
| the-cats-of-ulthar | no | The Cats of Ulthar | The Cats of Ulthar | The Cats of Ulthar.txt | still acceptable | not previously accepted |
| the-conceited-apple-branch | no | The Conceited Apple Branch | The Conceited Apple Branch | THE CONCEITED APPLE BRANCH.txt | still acceptable | not previously accepted |
| the-count-of-monte-cristo | yes | The Count of Monte Cristo | The Count of Monte Cristo | The Count of Monte Cristo.txt | still acceptable | still acceptable |
| the-count-of-monte-cristo-gutenberg-1184 | yes | The Count of Monte Cristo | The Count of Monte Cristo 1184 | unresolved | still acceptable | still acceptable |
| the-darning-needle | no | The Darning-Needle | The Darning Needle | THE DARNING-NEEDLE.txt | still acceptable | not previously accepted |
| the-divine-comedy | yes | The divine comedy | The Divine Comedy | The Divine Comedy.txt | still acceptable | still acceptable |
| the-door-in-the-wall | yes | The Door in the Wall | The Door in the Wall | THE DOOR IN THE WALL.txt | still acceptable | still acceptable |
| the-dream-of-little-tuk | no | The Dream of Little Tuk | The Dream of Little Tuk | The Dream of Little Tuk.txt | still acceptable | not previously accepted |
| the-dunwich-horror | no | The Dunwich horror | The Dunwich Horror | The Dunwich horror.txt | still acceptable | not previously accepted |
| the-elderbush | yes | The Elderbush | The Elderbush | The Elderbush.txt | still acceptable | corrected in this pass |
| the-elements-of-style | yes | The Elements of Style | The Elements of Style | The Elements of Style.txt | still acceptable | still acceptable |
| the-emerald-city-of-oz | yes | The Emerald City of Oz | The Emerald City of Oz | the-emerald-city-of-oz.txt | still acceptable | still acceptable |
| the-emperor-s-new-clothes | yes | The Emperor's New Clothes | The Emperor's New Clothes | THE EMPEROR'S NEW CLOTHES.txt | still acceptable | corrected in this pass |
| the-expedition-of-humphry-clinker | yes | The Expedition of Humphry Clinker | The Expedition of Humphry Clinker | The Expedition of Humphry Clinker.txt | still acceptable | still acceptable |
| the-false-collar | no | The False Collar | The False Collar | The False Collar.txt | still acceptable | not previously accepted |
| the-federalist-papers | yes | The Federalist Papers | The Federalist Papers | The Federalist Papers.txt | still acceptable | still acceptable |
| the-festival | no | The Festival | The Festival | The festival.txt | still acceptable | not previously accepted |
| the-fir-tree | yes | The Fir Tree | The Fir Tree | The Fir Tree.txt | still acceptable | corrected in this pass |
| the-fisherman-and-his-wife | no | The Fisherman and His Wife | The Fisherman and His Wife | THE FISHERMAN AND HIS WIFE.txt | still acceptable | not previously accepted |
| the-goblin-of-adachigahara | no | The Goblin of Adachigahara | The Goblin of Adachigahara | THE GOBLIN OF ADACHIGAHARA.txt | still acceptable | not previously accepted |
| the-great-gatsby | no | The Great Gatsby | The Great Gatsby | unresolved | needs generated start/default correction | not previously accepted |
| the-green-mummy | no | The Green Mummy | The Green Mummy | The Green Mummy.txt | still acceptable | not previously accepted |
| the-greenies | no | The Greenies | The Greenies | THE GREENIES.txt | still acceptable | not previously accepted |
| the-happy-family | yes | The Happy Family | The Happy Family | The Happy Family.txt | still acceptable | still acceptable |
| the-happy-hunter-and-the-skillful-fisher | no | The Happy Hunter and the Skillful Fisher | The Happy Hunter and the Skillful Fisher | THE HAPPY HUNTER AND THE SKILLFUL FISHER.txt | still acceptable | not previously accepted |
| the-haunter-of-the-dark | no | The Haunter of the Dark | The Haunter of the Dark | The haunter of the dark.txt | still acceptable | not previously accepted |
| the-history-of-sir-richard-calmady-a-romance | no | The History of Sir Richard Calmady: A Romance | The History of Sir Richard Calmady a Romance | The History of Sir Richard Calmady - A Romance.txt | still acceptable | not previously accepted |
| the-hound | no | The Hound | The Hound | The Hound.txt | still acceptable | not previously accepted |
| the-hound-of-the-baskervilles | yes | The Hound of the Baskervilles | The Hound of the Baskervilles | The Hound of the Baskervilles.txt | still acceptable | still acceptable |
| the-house-of-arden-a-story-for-children | no | The House of Arden: A Story for Children | The House of Arden a Story for Children | The House of Arden - A Story for Children.txt | still acceptable | not previously accepted |
| the-house-without-a-key | yes | The House Without a Key | The House Without a Key | The house without a key.txt | still acceptable | still acceptable |
| the-importance-of-being-earnest-a-trivial-comedy-for-serious-people | yes | The Importance of Being Earnest: A Trivial Comedy for Serious People | The Importance of Being Earnest a Trivial Comedy for Serious People | The Importance of Being Earnest - A Trivial Comedy for Serious People.txt | still acceptable | still acceptable |
| the-innocence-of-father-brown | no | The Innocence of Father Brown | The Innocence of Father Brown | The innocence of Father Brown.txt | still acceptable | not previously accepted |
| the-inspector-french-s-greatest-case | no | The Inspector French's Greatest Case | The Inspector French s Greatest Case | The Inspector French’s Greatest Case.txt | still acceptable | not previously accepted |
| the-invisible-man-a-grotesque-romance | no | The Invisible Man: A Grotesque Romance | The Invisible Man a Grotesque Romance | The Invisible Man - A Grotesque Romance.txt | still acceptable | not previously accepted |
| the-jelly-fish-and-the-monkey | no | The Jelly Fish and the Monkey | The Jelly Fish and the Monkey | THE JELLY FISH AND THE MONKEY.txt | still acceptable | not previously accepted |
| the-jungle-book | yes | The Jungle Book | The Jungle Book | The Jungle Book.txt | still acceptable | still acceptable |
| the-juniper-tree | no | The Juniper-Tree | The Juniper Tree | THE JUNIPER-TREE.txt | still acceptable | not previously accepted |
| the-king-in-yellow | yes | The King in Yellow | The King in Yellow | The King in Yellow.txt | still acceptable | still acceptable |
| the-lady-of-the-lake | no | The Lady of the Lake | The Lady of the Lake | The Lady of the Lake.txt | still acceptable | not previously accepted |
| the-laughing-cavalier-the-story-of-the-ancestor-of-the-scarlet-pimpernel | no | The Laughing Cavalier: The Story of the Ancestor of the Scarlet Pimpernel | The Laughing Cavalier the Story of the Ancestor of the Scarlet Pimpernel | The Laughing Cavalier - The Story of the Ancestor of the Scarlet Pimpernel.txt | still acceptable | not previously accepted |
| the-leap-frog | yes | The Leap-Frog | The Leap-Frog | The Leap-Frog.txt | still acceptable | corrected in this pass |
| the-legend-of-sleepy-hollow | yes | The Legend of Sleepy Hollow | The Legend of Sleepy Hollow | the-legend-of-sleepy-hollow.txt | still acceptable | still acceptable |
| the-lerouge-case | yes | The Lerouge Case | The Lerouge Case | The Lerouge Case.txt | still acceptable | still acceptable |
| the-life-and-adventures-of-robinson-crusoe | yes | The Life and Adventures of Robinson Crusoe | The Life and Adventures of Robinson Crusoe | The Life and Adventures of Robinson Crusoe.txt | still acceptable | still acceptable |
| the-lost-world | yes | The Lost World | The Lost World | The Lost World.txt | still acceptable | still acceptable |
| the-loving-pair | no | The Loving Pair | The Loving Pair | THE LOVING PAIR.txt | still acceptable | not previously accepted |
| the-lurking-fear | no | The lurking fear | The Lurking Fear | The lurking fear.txt | still acceptable | not previously accepted |
| the-magic-shop | no | The Magic Shop | The Magic Shop | THE MAGIC SHOP.txt | still acceptable | not previously accepted |
| the-maltese-falcon | yes | The Maltese Falcon | The Maltese Falcon | The Maltese falcon.txt | still acceptable | still acceptable |
| the-man-who-could-work-miracles | no | The Man Who Could Work Miracles | The Man Who Could Work Miracles | The Man Who Could Work Miracles.txt | still acceptable | not previously accepted |
| the-man-who-was-thursday-a-nightmare | yes | The Man Who Was Thursday: A Nightmare | The Man Who Was Thursday a Nightmare | The Man Who Was Thursday - A Nightmare.txt | still acceptable | still acceptable |
| the-mark-of-zorro | no | The mark of Zorro | The Mark of Zorro | The mark of Zorro.txt | still acceptable | not previously accepted |
| the-masque-of-the-red-death | no | The Masque of the Red Death | The Masque of the Red Death | The Masque of the Red Death.txt | still acceptable | not previously accepted |
| the-money-box | yes | The Money Box | The Money Box | THE MONEY BOX.txt | still acceptable | corrected in this pass |
| the-monkey-s-paw | no | The Monkey's Paw | The Monkey s Paw | The Monkey's Paw.txt | still acceptable | not previously accepted |
| the-mystery-of-edwin-drood | yes | The Mystery of Edwin Drood | The Mystery of Edwin Drood | The Mystery of Edwin Drood.txt | still acceptable | still acceptable |
| the-nameless-city | no | The Nameless City | The Nameless City | The Nameless City.txt | still acceptable | not previously accepted |
| the-naughty-boy | no | The Naughty Boy | The Naughty Boy | The Naughty Boy.txt | still acceptable | not previously accepted |
| the-octopus-a-story-of-california | yes | The Octopus: A Story of California | The Octopus a Story of California | The Octopus - A Story of California.txt | still acceptable | still acceptable |
| the-old-house | yes | The Old House | The Old House | The Old House.txt | still acceptable | corrected in this pass |
| the-other-gods | no | The Other Gods | The Other Gods | The Other Gods.txt | still acceptable | not previously accepted |
| the-oversight | no | The Oversight | The Oversight | THE OVERSIGHT.txt | still acceptable | not previously accepted |
| the-penance | no | The Penance | The Penance | THE PENANCE.txt | still acceptable | not previously accepted |
| the-picture-of-dorian-gray | no | The Picture of Dorian Gray | The Picture of Dorian Gray | unresolved | still acceptable | not previously accepted |
| the-prince-and-the-pauper | yes | The Prince and the Pauper | The Prince and the Pauper | The Prince and the Pauper.txt | still acceptable | still acceptable |
| the-princess-and-the-goblin | yes | The Princess and the Goblin | The Princess and the Goblin | the-princess-and-the-goblin.txt | still acceptable | still acceptable |
| the-railway-children | yes | The Railway Children | The Railway Children | the-railway-children.txt | still acceptable | still acceptable |
| the-real-princess | yes | The Real Princess | The Real Princess | The Real Princess.txt | still acceptable | corrected in this pass |
| the-red-room | no | The Red Room | The Red Room | The Red Room.txt | still acceptable | not previously accepted |
| the-red-shoes | no | The Red Shoes | The Red Shoes | The Red Shoes.txt | still acceptable | not previously accepted |
| the-red-thumb-mark | yes | The Red Thumb Mark | The Red Thumb Mark | The Red Thumb Mark.txt | still acceptable | still acceptable |
| the-regent-s-daughter | no | The regent's daughter | The Regent s Daughter | The regent's daughter.txt | still acceptable | not previously accepted |
| the-remarkable-case-of-davidson-s-eyes | no | The Remarkable Case of Davidson's Eyes | The Remarkable Case of Davidson s Eyes | THE REMARKABLE CASE OF DAVIDSON'S EYES.txt | still acceptable | not previously accepted |
| the-roses-and-the-sparrows | no | The Roses and the Sparrows | The Roses and the Sparrows | THE ROSES AND THE SPARROWS.txt | still acceptable | not previously accepted |
| the-scarlet-letter | no | The Scarlet Letter | The Scarlet Letter | The Scarlet Letter.txt | still acceptable | not previously accepted |
| the-sea-lady | no | The Sea Lady | The Sea Lady | The Sea Lady.txt | still acceptable | not previously accepted |
| the-sea-wolf | yes | The Sea-Wolf | The Sea Wolf | the sea-wolf.txt | still acceptable | still acceptable |
| the-secret-garden | yes | The Secret Garden | The Secret Garden | The Secret Garden.txt | still acceptable | still acceptable |
| the-secret-garden-gutenberg-113 | yes | The Secret Garden | The Secret Garden 113 | unresolved | still acceptable | still acceptable |
| the-seven-ravens | no | The Seven Ravens | The Seven Ravens | THE SEVEN RAVENS.txt | still acceptable | not previously accepted |
| the-shadow | no | The Shadow | The Shadow | The Shadow.txt | still acceptable | not previously accepted |
| the-shadow-over-innsmouth | no | The Shadow over Innsmouth | The Shadow Over Innsmouth | The shadow over Innsmouth.txt | still acceptable | not previously accepted |
| the-shoes-of-fortune | yes | The Shoes of Fortune | The Shoes of Fortune | The Shoes of Fortune.txt | still acceptable | corrected in this pass |
| the-shunned-house | yes | The Shunned House | The Shunned House | The Shunned House.txt | still acceptable | still acceptable |
| the-silver-key | no | The silver key | The Silver Key | The silver key.txt | still acceptable | not previously accepted |
| the-snow-queen | yes | The Snow Queen | The Snow Queen | THE SNOW QUEEN.txt | still acceptable | corrected in this pass |
| the-statement-of-randolph-carter | no | The Statement of Randolph Carter | The Statement of Randolph Carter | The Statement of Randolph Carter.txt | still acceptable | not previously accepted |
| the-steadfast-tin-soldier | no | The Steadfast Tin Soldier | The Steadfast Tin Soldier | THE STEADFAST TIN SOLDIER.txt | still acceptable | not previously accepted |
| the-story-of-a-mother | no | The Story of a Mother | The Story of a Mother | The Story of a Mother.txt | still acceptable | not previously accepted |
| the-story-of-the-inexperienced-ghost | yes | Twelve Stories and a Dream | The Story of the Inexperienced Ghost | THE STORY OF THE INEXPERIENCED GHOST.txt | still acceptable | still acceptable |
| the-story-of-the-man-who-did-not-wish-to-die | no | The Story of the Man Who Did Not Wish to Die | The Story of the Man Who Did Not Wish to Die | THE STORY OF THE MAN WHO DID NOT WISH TO DIE.txt | still acceptable | not previously accepted |
| the-story-of-the-old-man-who-made-withered-trees-to-flower | no | The Story of the Old Man Who Made Withered Trees to Flower | The Story of the Old Man Who Made Withered Trees to Flower | THE STORY OF THE OLD MAN WHO MADE WITHERED TREES TO FLOWER.txt | still acceptable | not previously accepted |
| the-story-of-urashima-taro-the-fisher-lad | no | The Story of Urashima Taro, the Fisher Lad | The Story of Urashima Taro the Fisher Lad | THE STORY OF URASHIMA TARO, THE FISHER LAD.txt | still acceptable | not previously accepted |
| the-swineherd | yes | The Swineherd | The Swineherd | The Swineherd.txt | still acceptable | corrected in this pass |
| the-tempest | yes | The Tempest | The Tempest | The Tempest.txt | still acceptable | still acceptable |
| the-thing-on-the-door-step | no | The Thing on the Door-Step | The Thing On the Door Step | The thing on the door-step.txt | still acceptable | not previously accepted |
| the-thirty-nine-steps | no | The Thirty-Nine Steps | The Thirty Nine Steps | unresolved | still acceptable | not previously accepted |
| the-three-musketeers | yes | The Three Musketeers | The Three Musketeers | the-three-musketeers.txt | still acceptable | still acceptable |
| the-three-taps-a-detective-story-without-a-moral | no | The Three Taps | The Three Taps a Detective Story Without a Moral | The three taps - A detective story without a moral.txt | still acceptable | not previously accepted |
| the-time-machine | no | The Time Machine | The Time Machine | The Time Machine.txt | still acceptable | not previously accepted |
| the-tongue-cut-sparrow | no | The Tongue-Cut Sparrow | The Tongue Cut Sparrow | THE TONGUE-CUT SPARROW.txt | still acceptable | not previously accepted |
| the-tower-treasure | no | The tower treasure | The Tower Treasure | The tower treasure.txt | still acceptable | not previously accepted |
| the-truth-about-pyecraft | no | The Truth About Pyecraft | The Truth About Pyecraft | THE TRUTH ABOUT PYECRAFT.txt | still acceptable | not previously accepted |
| the-turmoil | no | The Turmoil: A Novel | The Turmoil | The Turmoil.txt | still acceptable | not previously accepted |
| the-turn-of-the-screw | yes | The Turn of the Screw | The Turn of the Screw | The Turn of the Screw.txt | still acceptable | still acceptable |
| the-ugly-duckling | no | The Ugly Duckling | The Ugly Duckling | THE UGLY DUCKLING.txt | still acceptable | not previously accepted |
| the-virginian-a-horseman-of-the-plains | no | The Virginian: A Horseman of the Plains | The Virginian a Horseman of the Plains | The Virginian - A Horseman of the Plains.txt | still acceptable | not previously accepted |
| the-wailing-octopus-a-rick-brant-science-adventure-story | no | The Wailing Octopus: A Rick Brant Science-Adventure Story | The Wailing Octopus a Rick Brant Science Adventure Story | The Wailing Octopus - A Rick Brant Science-Adventure Story.txt | still acceptable | not previously accepted |
| the-war-of-the-worlds | yes | The War of the Worlds | The War of the Worlds | The War of the Worlds.txt | still acceptable | still acceptable |
| the-warden | no | The Warden | The Warden | The Warden.txt | still acceptable | not previously accepted |
| the-water-babies | yes | The Water-Babies: A Fairy Tale for a Land-Baby | The Water Babies | the-water-babies.txt | still acceptable | still acceptable |
| the-wedding-of-mrs-fox | no | The Wedding of Mrs Fox | The Wedding of Mrs Fox | THE WEDDING OF MRS FOX.txt | still acceptable | not previously accepted |
| the-wendigo | yes | The Wendigo | The Wendigo | The Wendigo.txt | still acceptable | still acceptable |
| the-winning-of-olwen | yes | The Winning of Olwen | The Winning of Olwen | The Winning of Olwen.txt | still acceptable | corrected in this pass |
| the-wonderful-wizard-of-oz | yes | The Wonderful Wizard of Oz | The Wonderful Wizard of Oz | the-wonderful-wizard-of-oz.txt | still acceptable | still acceptable |
| through-the-looking-glass | yes | Through the Looking-Glass | Through the Looking Glass | Through the Looking-Glass.txt | still acceptable | still acceptable |
| treasure-island | yes | Treasure Island | Treasure Island | treasure-island.txt | still acceptable | still acceptable |
| triplanetary | yes | Triplanetary | Triplanetary | Triplanetary.txt | still acceptable | still acceptable |
| twenty-thousand-leagues-under-the-sea | yes | Twenty Thousand Leagues under the Sea | Twenty Thousand Leagues Under the Sea | Twenty Thousand Leagues under the Sea.txt | still acceptable | still acceptable |
| two-in-a-sack | no | Two in a Sack | Two in a Sack | TWO IN A SACK.txt | still acceptable | not previously accepted |
| typhoon | no | Typhoon | Typhoon | Typhoon.txt | still acceptable | not previously accepted |
| under-the-red-dragon | no | Under the Red Dragon: A Novel | Under the Red Dragon | Under the Red Dragon.txt | still acceptable | not previously accepted |
| unicorns | no | Unicorns | Unicorns | Unicorns.txt | still acceptable | not previously accepted |
| violet-fairy-book | yes | The Violet Fairy Book | Violet Fairy Book | Violet Fairy Book.txt | still acceptable | still acceptable |
| wind-in-the-willows | yes | The Wind in the Willows | Wind in the Willows | unresolved | still acceptable | still acceptable |
| winnie-the-pooh | no | Winnie-the-Pooh | Winnie the Pooh | Winnie-the-Pooh.txt | still acceptable | not previously accepted |
| with-fire-and-sword | yes | With Fire and Sword: An Historical Novel of Poland and Russia | With Fire and Sword | With Fire and Sword.txt | still acceptable | still acceptable |
| wood-folk-at-school | no | Wood folk at school | Wood Folk At School | unresolved | needs generated start/default correction | not previously accepted |
| wuthering-heights | yes | Wuthering Heights | Wuthering Heights | Wuthering Heights.txt | still acceptable | still acceptable |

## Future Batch Rule

- valid generated readable content
- first default section from real readable content
- all main readable sections included by default
- valid book-specific startup preview
- no SOS Help!
- no generic preview fallback
- no title/TOC/source/license/contributor/transcriber material as default playback

Cloudflare export files were intentionally not modified in this audit; corrected generated output must go through a later controlled export step before public export JSON is refreshed.
