# Metadata/Segmentation Correctness Audit 1

Focused audit for generated title identity, author metadata, first default content, segmentation, startup previews, and selected-source runtime ordering.

## Summary

- Generated books audited: 130
- Accepted books audited: 117
- Books with Unknown author display: 1
- Unknown author with clear source author: 0
- Unknown author remaining with documented source limitation: 1
- Author corrections applied: 2
- Acceptance revoked pending correction: 0

## Runtime Consistency

- Selected-source runtime assembly preserves selected/default section ID order and no longer re-sorts by section payload order.
- Call of the Wild Playwright regression seeds saved progress at chapter-002 and verifies the selected source starts at Chapter I.
- Elderbush Playwright regression verifies individual-story title/default content and author metadata on generated preview routes.

## Author Corrections

### the-count-of-monte-cristo-gutenberg-1184

- Title: The Count of Monte Cristo
- Before author: Unknown author
- After author: Alexandre Dumas, Auguste Maquet
- Source: app/client/assets/temp-books/The Count of Monte Cristo.txt
- Evidence: gutenberg Author line: Author: Alexandre Dumas / Auguste Maquet

### the-happy-family

- Title: The Happy Family
- Before author: Unknown author
- After author: H. C. Andersen
- Source: app/client/assets/temp-books/The Happy Family.txt
- Evidence: gutenberg Author line: Author: H. C. Andersen

## Unknown Author Review

- the-arabian-nights: Unknown author; source=the-arabian-nights.txt; justified=true; warnings=Raw source has editor metadata but no source-identified author; this needs manual metadata policy before replacing author with editor.

## Acceptance Revoked Pending Correction

- None.

## Future Verification Rules

- Future batch verification must fail generated books whose author display is Unknown author while raw source evidence contains a clear Author/byline.
- Future batch verification must flag Unknown author cases with no clear source author as documented manual metadata review, not silent acceptance.
- Future batch verification must fail suspicious parent collection titles, parent collection metadata in default playback, metadata/default-start leaks, generic fallback chunks where source headings are clear, and selected-source output that does not start from the first selected/default section.
- This npm command is a reusable verification gate: npm run books:metadata-segmentation-audit.

## Books

| Slug | Accepted before | Author | Expected author | Source | Verdict | Warnings |
| --- | --- | --- | --- | --- | --- | --- |
| a-childs-garden-of-verses | yes | Robert Louis Stevenson | Robert Louis Stevenson | a-childs-garden-of-verses.txt | accepted remains valid | none |
| a-christmas-carol | no | Charles Dickens | Charles Dickens | a-christmas-carol.txt | not accepted | Preview does not clearly start from the first real default section. |
| a-dream-of-armageddon | yes | H. G. Wells | H. G. Wells | A DREAM OF ARMAGEDDON.txt | accepted remains valid | none |
| a-journal-of-the-plague-year | yes | Daniel Defoe | Daniel Defoe | A Journal of the Plague Year.txt | accepted remains valid | none |
| a-journey-to-the-centre-of-the-earth | yes | Jules Verne | Jules Verne | A Journey to the Centre of the Earth.txt | accepted remains valid | none |
| a-midsummer-night-s-dream | yes | William Shakespeare | William Shakespeare | A Midsummer Night's Dream.txt | accepted remains valid | none |
| a-princess-of-mars | no | Edgar Rice Burroughs | Unknown author | unresolved | not accepted | none |
| a-room-with-a-view | yes | E. M. Forster | E. M. Forster | A Room with a View.txt | accepted remains valid | none |
| a-tale-of-two-cities | yes | Charles Dickens | Charles Dickens | A Tale of Two Cities.txt | accepted remains valid | none |
| agamemnon-of-aeschylus | yes | Aeschylus | Aeschylus | Agamemnon of Aeschylus.txt | accepted remains valid | none |
| alices-adventures-in-wonderland | yes | Lewis Carroll | Lewis Carroll | alices-adventures-in-wonderland.txt | accepted remains valid | none |
| almayer-s-folly-a-story-of-an-eastern-river | yes | Joseph Conrad | Joseph Conrad | Almayer's Folly - A Story of an Eastern River.txt | accepted remains valid | none |
| an-ideal-husband | yes | Oscar Wilde | Oscar Wilde | An Ideal Husband.txt | accepted remains valid | none |
| anna-karenina | yes | graf Leo Tolstoy | graf Leo Tolstoy | Anna Karenina.txt | accepted remains valid | none |
| anne-of-avonlea | yes | L. M. Montgomery | L. M. Montgomery | Anne of Avonlea.txt | accepted remains valid | none |
| anne-of-green-gables | yes | L. M. Montgomery | L. M. Montgomery | Anne of Green Gables.txt | accepted remains valid | none |
| anne-of-green-gables-gutenberg-45 | yes | L. M. Montgomery | L. M. Montgomery | Anne of Green Gables.txt | accepted remains valid | none |
| around-the-world-in-eighty-days | yes | Jules Verne | Jules Verne | around-the-world-in-eighty-days.txt | accepted remains valid | none |
| black-beauty | yes | Anna Sewell | Anna Sewell | black-beauty.txt | accepted remains valid | none |
| botchan | yes | Soseki Natsume | Soseki Natsume | Botchan.txt | accepted remains valid | none |
| candide | yes | Voltaire | Voltaire | Candide.txt | accepted remains valid | none |
| catriona | yes | Robert Louis Stevenson | Robert Louis Stevenson | Catriona.txt | accepted remains valid | none |
| cranford | yes | Elizabeth Cleghorn Gaskell | Elizabeth Cleghorn Gaskell | Cranford.txt | accepted remains valid | none |
| crime-and-punishment | yes | Fyodor Dostoyevsky | Fyodor Dostoyevsky | Crime and Punishment.txt | accepted remains valid | none |
| doctor-dolittle | no | Hugh Lofting | Unknown author | unresolved | not accepted | Preview does not clearly start from the first real default section. |
| don-quixote | yes | Miguel de Cervantes Saavedra | Miguel de Cervantes Saavedra | Don Quixote.txt | accepted remains valid | none |
| dr-jekyll-and-mr-hyde | no | Robert Louis Stevenson | Robert Louis Stevenson | Dr. Jekyll and Mr. Hyde.txt | not accepted | Preview does not clearly start from the first real default section. |
| dracula | yes | Bram Stoker | Bram Stoker | Dracula.txt | accepted remains valid | none |
| five-little-peppers-and-how-they-grew | yes | Margaret Sidney | Margaret Sidney | five-little-peppers-and-how-they-grew.txt | accepted remains valid | none |
| five-weeks-in-a-balloon | yes | Jules Verne | Jules Verne | Five Weeks in a Balloon.txt | accepted remains valid | none |
| for-the-duration-of-the-war | yes | Saki | Saki | FOR THE DURATION OF THE WAR.txt | accepted remains valid | none |
| four-day-planet | yes | H. Beam Piper | H. Beam Piper | Four-Day Planet.txt | accepted remains valid | none |
| frankenstein | yes | Mary Wollstonecraft Shelley | Mary Wollstonecraft Shelley | Frankenstein.txt | accepted remains valid | none |
| grimm-s-fairy-tales | yes | Jacob Grimm Wilhelm Grimm | Jacob Grimm, Wilhelm Grimm | Grimm's Fairy Tales.txt | accepted remains valid | none |
| gulliver-s-travels | yes | Jonathan Swift | Jonathan Swift | Gulliver's Travels.txt | accepted remains valid | none |
| heidi | no | Johanna Spyri | Unknown author | unresolved | not accepted | Preview does not clearly start from the first real default section. |
| jabberwocky | no | Lewis Carroll | Unknown author | unresolved | not accepted | Preview does not clearly start from the first real default section. |
| jack-and-jill | yes | Louisa May Alcott | Louisa May Alcott | jack-and-jill.txt | accepted remains valid | none |
| jane-eyre | yes | Charlotte Brontë | Charlotte Brontë | Jane Eyre.txt | accepted remains valid | none |
| les-miserables | yes | Victor Hugo | Victor Hugo | Les Misérables.txt | accepted remains valid | none |
| little-fuzzy | yes | H. Beam Piper | H. Beam Piper | Little Fuzzy.txt | accepted remains valid | none |
| little-women | yes | Louisa May Alcott | Louisa May Alcott | Little Women.txt | accepted remains valid | none |
| macbeth | yes | William Shakespeare | William Shakespeare | Macbeth.txt | accepted remains valid | none |
| moby-dick | yes | Herman Melville | Herman Melville | Moby Dick.txt | accepted remains valid | none |
| new-treasure-seekers | yes | E. Nesbit | E. Nesbit | new-treasure-seekers.txt | accepted remains valid | none |
| nights-with-uncle-remus | no | Joel Chandler Harris | Unknown author | unresolved | not accepted | Preview does not clearly start from the first real default section. |
| persuasion | yes | Jane Austen | Jane Austen | Persuasion.txt | accepted remains valid | none |
| peter-pan | no | J. M. Barrie | Unknown author | unresolved | not accepted | none |
| pointed-roofs | yes | Dorothy M. Richardson | Dorothy M. Richardson | Pointed Roofs.txt | accepted remains valid | none |
| pride-and-prejudice | yes | Jane Austen | Jane Austen | Pride and Prejudice.txt | accepted remains valid | none |
| pygmalion | yes | Bernard Shaw | Bernard Shaw | Pygmalion.txt | accepted remains valid | none |
| rainbow-valley | yes | L. M. Montgomery | L. M. Montgomery | rainbow-valley.txt | accepted remains valid | none |
| rinkitink-in-oz | yes | L. Frank Baum | L. Frank Baum | rinkitink-in-oz.txt | accepted remains valid | none |
| romeo-and-juliet | yes | William Shakespeare | William Shakespeare | Romeo and Juliet.txt | accepted remains valid | none |
| room-13 | yes | Edgar Wallace | Edgar Wallace | Room 13.txt | accepted remains valid | none |
| sense-and-sensibility | yes | Jane Austen | Jane Austen | Sense and Sensibility.txt | accepted remains valid | none |
| spoon-river-anthology | yes | Edgar Lee Masters | Edgar Lee Masters | Spoon River Anthology.txt | accepted remains valid | none |
| sun-tzu-on-the-art-of-war | yes | active 6th century B.C. Sunzi | active 6th century B.C. Sunzi | Sun Tzŭ on the Art of War.txt | accepted remains valid | none |
| tales-of-war | yes | Lord Dunsany | Lord Dunsany | Tales of War.txt | accepted remains valid | none |
| tarzan-of-the-apes | no | Edgar Rice Burroughs | Unknown author | unresolved | not accepted | none |
| the-adventures-of-ferdinand-count-fathom | yes | T. Smollett | T. Smollett | The Adventures of Ferdinand Count Fathom.txt | accepted remains valid | none |
| the-adventures-of-roderick-random | yes | T. Smollett | T. Smollett | The Adventures of Roderick Random.txt | accepted remains valid | none |
| the-adventures-of-tom-sawyer | yes | Mark Twain | Mark Twain | The Adventures of Tom Sawyer.txt | accepted remains valid | none |
| the-arabian-nights | yes | Unknown author | Unknown author | the-arabian-nights.txt | accepted remains valid | Raw source has editor metadata but no source-identified author; this needs manual metadata policy before replacing author with editor. |
| the-art-of-war | yes | active 6th century B.C. Sunzi | active 6th century B.C. Sunzi | The Art of War.txt | accepted remains valid | none |
| the-bell | yes | H. C. Andersen | H. C. Andersen | The Bell.txt | accepted remains valid | none |
| the-book-of-dragons | yes | E. Nesbit | E. Nesbit | the-book-of-dragons.txt | accepted remains valid | none |
| the-call-of-cthulhu | yes | H. P. Lovecraft | H. P. Lovecraft | The call of Cthulhu.txt | accepted remains valid | none |
| the-call-of-the-wild | yes | Jack London | Jack London | The call of the wild.txt | accepted remains valid | none |
| the-count-of-monte-cristo | yes | Alexandre Dumas Auguste Maquet | Alexandre Dumas, Auguste Maquet | The Count of Monte Cristo.txt | accepted remains valid | none |
| the-count-of-monte-cristo-gutenberg-1184 | yes | Alexandre Dumas, Auguste Maquet | Alexandre Dumas, Auguste Maquet | The Count of Monte Cristo.txt | accepted remains valid | none |
| the-divine-comedy | yes | Dante Alighieri | Dante Alighieri | The Divine Comedy.txt | accepted remains valid | none |
| the-door-in-the-wall | yes | H. G. Wells | H. G. Wells | THE DOOR IN THE WALL.txt | accepted remains valid | none |
| the-elderbush | yes | H. C. Andersen | H. C. Andersen | The Elderbush.txt | accepted remains valid | none |
| the-elements-of-style | yes | William Strunk | William Strunk | The Elements of Style.txt | accepted remains valid | none |
| the-emerald-city-of-oz | yes | L. Frank Baum | L. Frank Baum | the-emerald-city-of-oz.txt | accepted remains valid | none |
| the-emperor-s-new-clothes | yes | H. C. Andersen | H. C. Andersen | THE EMPEROR'S NEW CLOTHES.txt | accepted remains valid | none |
| the-expedition-of-humphry-clinker | yes | T. Smollett | T. Smollett | The Expedition of Humphry Clinker.txt | accepted remains valid | none |
| the-federalist-papers | yes | Alexander Hamilton John Jay James Madison | Alexander Hamilton, John Jay, James Madison | The Federalist Papers.txt | accepted remains valid | none |
| the-fir-tree | yes | H. C. Andersen | H. C. Andersen | The Fir Tree.txt | accepted remains valid | none |
| the-great-gatsby | no | F. Scott Fitzgerald | Unknown author | unresolved | not accepted | Preview does not clearly start from the first real default section. |
| the-happy-family | yes | H. C. Andersen | H. C. Andersen | The Happy Family.txt | accepted remains valid | none |
| the-hound-of-the-baskervilles | yes | Arthur Conan Doyle | Arthur Conan Doyle | The Hound of the Baskervilles.txt | accepted remains valid | none |
| the-house-without-a-key | yes | Earl Derr Biggers | Earl Derr Biggers | The house without a key.txt | accepted remains valid | none |
| the-importance-of-being-earnest-a-trivial-comedy-for-serious-people | yes | Oscar Wilde | Oscar Wilde | The Importance of Being Earnest - A Trivial Comedy for Serious People.txt | accepted remains valid | none |
| the-jungle-book | yes | Rudyard Kipling | Rudyard Kipling | The Jungle Book.txt | accepted remains valid | none |
| the-king-in-yellow | yes | Robert W. Chambers | Robert W. Chambers | The King in Yellow.txt | accepted remains valid | none |
| the-leap-frog | yes | H. C. Andersen | H. C. Andersen | The Leap-Frog.txt | accepted remains valid | none |
| the-legend-of-sleepy-hollow | yes | Washington Irving | Washington Irving | the-legend-of-sleepy-hollow.txt | accepted remains valid | none |
| the-lerouge-case | yes | Emile Gaboriau | Emile Gaboriau | The Lerouge Case.txt | accepted remains valid | none |
| the-life-and-adventures-of-robinson-crusoe | yes | Daniel Defoe | Daniel Defoe | The Life and Adventures of Robinson Crusoe.txt | accepted remains valid | none |
| the-lost-world | yes | Arthur Conan Doyle | Arthur Conan Doyle | The Lost World.txt | accepted remains valid | none |
| the-maltese-falcon | yes | Dashiell Hammett | Dashiell Hammett | The Maltese falcon.txt | accepted remains valid | none |
| the-man-who-was-thursday-a-nightmare | yes | G. K. Chesterton | G. K. Chesterton | The Man Who Was Thursday - A Nightmare.txt | accepted remains valid | none |
| the-money-box | yes | H. C. Andersen | H. C. Andersen | THE MONEY BOX.txt | accepted remains valid | none |
| the-mystery-of-edwin-drood | yes | Charles Dickens | Charles Dickens | The Mystery of Edwin Drood.txt | accepted remains valid | none |
| the-octopus-a-story-of-california | yes | Frank Norris | Frank Norris | The Octopus - A Story of California.txt | accepted remains valid | none |
| the-old-house | yes | H. C. Andersen | H. C. Andersen | The Old House.txt | accepted remains valid | none |
| the-picture-of-dorian-gray | no | Oscar Wilde | Unknown author | unresolved | not accepted | none |
| the-prince-and-the-pauper | yes | Mark Twain | Mark Twain | The Prince and the Pauper.txt | accepted remains valid | none |
| the-princess-and-the-goblin | yes | George MacDonald | George MacDonald | the-princess-and-the-goblin.txt | accepted remains valid | none |
| the-railway-children | yes | E. Nesbit | E. Nesbit | the-railway-children.txt | accepted remains valid | none |
| the-real-princess | yes | H. C. Andersen | H. C. Andersen | The Real Princess.txt | accepted remains valid | none |
| the-red-thumb-mark | yes | R. Austin Freeman | R. Austin Freeman | The Red Thumb Mark.txt | accepted remains valid | none |
| the-sea-wolf | yes | Jack London | Jack London | the sea-wolf.txt | accepted remains valid | none |
| the-secret-garden | yes | Frances Hodgson Burnett | Frances Hodgson Burnett | The Secret Garden.txt | accepted remains valid | none |
| the-secret-garden-gutenberg-113 | yes | Frances Hodgson Burnett | Frances Hodgson Burnett | The Secret Garden.txt | accepted remains valid | none |
| the-shoes-of-fortune | yes | H. C. Andersen | H. C. Andersen | The Shoes of Fortune.txt | accepted remains valid | none |
| the-shunned-house | yes | H. P. Lovecraft | H. P. Lovecraft | The Shunned House.txt | accepted remains valid | none |
| the-snow-queen | yes | H. C. Andersen | H. C. Andersen | THE SNOW QUEEN.txt | accepted remains valid | none |
| the-story-of-the-inexperienced-ghost | yes | H. G. Wells | H. G. Wells | THE STORY OF THE INEXPERIENCED GHOST.txt | accepted remains valid | none |
| the-swineherd | yes | H. C. Andersen | H. C. Andersen | The Swineherd.txt | accepted remains valid | none |
| the-tempest | yes | William Shakespeare | William Shakespeare | The Tempest.txt | accepted remains valid | none |
| the-thirty-nine-steps | no | John Buchan | Unknown author | unresolved | not accepted | none |
| the-three-musketeers | yes | Alexandre Dumas Auguste Maquet | Alexandre Dumas, Auguste Maquet | the-three-musketeers.txt | accepted remains valid | none |
| the-turn-of-the-screw | yes | Henry James | Henry James | The Turn of the Screw.txt | accepted remains valid | none |
| the-war-of-the-worlds | yes | H. G. Wells | H. G. Wells | The War of the Worlds.txt | accepted remains valid | none |
| the-water-babies | yes | Charles Kingsley | Charles Kingsley | the-water-babies.txt | accepted remains valid | none |
| the-wendigo | yes | Algernon Blackwood | Algernon Blackwood | The Wendigo.txt | accepted remains valid | none |
| the-winning-of-olwen | yes | Andrew Lang | Andrew Lang | The Winning of Olwen.txt | accepted remains valid | none |
| the-wonderful-wizard-of-oz | yes | L. Frank Baum | L. Frank Baum | the-wonderful-wizard-of-oz.txt | accepted remains valid | none |
| through-the-looking-glass | yes | Lewis Carroll | Lewis Carroll | Through the Looking-Glass.txt | accepted remains valid | none |
| treasure-island | yes | Robert Louis Stevenson | Robert Louis Stevenson | treasure-island.txt | accepted remains valid | none |
| triplanetary | yes | E. E. Smith | E. E. Smith | Triplanetary.txt | accepted remains valid | none |
| twenty-thousand-leagues-under-the-sea | yes | Jules Verne | Jules Verne | Twenty Thousand Leagues under the Sea.txt | accepted remains valid | none |
| violet-fairy-book | yes | Andrew Lang | Andrew Lang | Violet Fairy Book.txt | accepted remains valid | none |
| wind-in-the-willows | yes | Kenneth Grahame | Kenneth Grahame | The Wind in the Willows.txt | accepted remains valid | none |
| with-fire-and-sword | yes | Henryk Sienkiewicz | Henryk Sienkiewicz | With Fire and Sword.txt | accepted remains valid | none |
| wood-folk-at-school | no | William J. Long | Unknown author | unresolved | not accepted | Preview does not clearly start from the first real default section. |
| wuthering-heights | yes | Emily Brontë | Emily Brontë | Wuthering Heights.txt | accepted remains valid | none |

Raw source files and Cloudflare exports were not modified.

