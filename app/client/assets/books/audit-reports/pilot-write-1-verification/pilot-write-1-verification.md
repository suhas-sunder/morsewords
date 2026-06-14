# Pilot Write 1 Verification

Post-write QA pass for the seven approved pilot books. This report inspects raw source text, generated book output, preview assets, and the pilot write report. It does not process additional books.

## Summary

| Book | Status | Start | End | Sectioning | Cleanup | Preview | Accepted for main |
| --- | --- | --- | --- | --- | --- | --- | --- |
| almayer-s-folly-a-story-of-an-eastern-river | pass | pass | pass | pass | pass | pass | yes |
| the-house-without-a-key | pass | pass | pass | pass | pass | pass | yes |
| the-lerouge-case | pass | pass | pass | pass | pass | pass | yes |
| a-dream-of-armageddon | warn | pass | pass | warn | pass | pass | yes |
| a-journey-to-the-centre-of-the-earth | pass | pass | pass | pass | pass | pass | yes |
| a-journal-of-the-plague-year | warn | pass | pass | warn | pass | pass | yes |
| dracula | pass | pass | pass | pass | pass | pass | yes |

## Special Focus

- a-dream-of-armageddon: acceptable with warning. The source is a single story without internal headings, and the two fallback parts preserve the story from title through final sentence. A manual single-story sectioning rule would be nicer, but no correction is required before main.
- a-journal-of-the-plague-year: acceptable with warning. The source does not provide clean chapter headings; the 18 fallback parts are consecutive paragraph-boundary chunks and do not include front matter/footer boilerplate. Manual labels would improve polish before scaling.
- dracula: prior generated-output issue is corrected. The generated default playback starts at CHAPTER I, excludes title page/contents/source material, keeps the final note as non-default notes, excludes the publisher catalog after THE END, and the preview starts at real readable content.

## Corrections Observed

- Normalized generated title capitalization from "The house without a key" to "The House Without a Key".
- Corrected generated title from the Gutenberg collection header "Twelve Stories and a Dream" to the story title "A Dream of Armageddon".

## almayer-s-folly-a-story-of-an-eastern-river

- Status: pass
- Start: Generated output starts at the expected readable boundary.
- End: Generated output preserves the expected readable ending.
- Sectioning: Sectioning follows source headings with meaningful sections.
- Cleanup: Cleanup excludes boilerplate and obvious playback-hostile artifacts.
- Preview: Preview starts from generated readable content and matches manifest hashes.
- Accepted for main: yes
- Needs correction before main: no
- Should be reverted/skipped: no
- Remaining warnings: none
- Raw start snippet: CHAPTER I. "Kaspar! Makan!" The well-known shrill voice startled Almayer from his dream of splendid future into the unpleasant realities of the present hour. An unpleasant voice too. He had heard it for many years, and with every year he liked it less. No matter; there would be an end to all this soon.
- Generated start snippet: CHAPTER I. "Kaspar! Makan!" The well-known shrill voice startled Almayer from his dream of splendid future into the unpleasant realities of the present hour. An unpleasant voice too. He had heard it for many years, and with every year he liked it less. No matter; there would be an end to all this soon. He shuffled une...
- Raw end snippet: And as they passed through the crowd that fell back before them, the beads in Abdulla's hand clicked, while in a solemn whisper he breathed out piously the name of Allah! The Merciful! The Compassionate!
- Generated end snippet: he died. Abdulla looked down sadly at this Infidel he had fought so long and had bested so many times. Such was the reward of the Faithful! Yet in the Arab's old heart there was a feeling of regret for that thing gone out of his life. He was leaving fast behind him friendships, and enmities, successes, and disappointm...

## the-house-without-a-key

- Status: pass
- Start: Generated output starts at the expected readable boundary.
- End: Generated output preserves the expected readable ending.
- Sectioning: Sectioning follows source headings with meaningful sections.
- Cleanup: Cleanup excludes boilerplate and obvious playback-hostile artifacts.
- Preview: Preview starts from generated readable content and matches manifest hashes.
- Accepted for main: yes
- Needs correction before main: no
- Should be reverted/skipped: no
- Remaining warnings: Normalized generated title capitalization from "The house without a key" to "The House Without a Key".
- Raw start snippet: CHAPTER I KONA WEATHER Miss Minerva Winterslip was a Bostonian in good standing, and long past the romantic age. Yet beauty thrilled her still, even the semi-barbaric beauty of a Pacific island. As she walked slowly along the beach she felt the little catch in her throat that sometimes she had known in
- Generated start snippet: CHAPTER I KONA WEATHER Miss Minerva Winterslip was a Bostonian in good standing, and long past the romantic age. Yet beauty thrilled her still, even the semi-barbaric beauty of a Pacific island. As she walked slowly along the beach she felt the little catch in her throat that sometimes she had known in Symphony Hall,...
- Raw end snippet: 
- Generated end snippet: t the same instant John Quincy seized the girl's hands. "Listen to me. I can't wait another second. I want to tell you that I love you--" "You're mad," she cried. "Mad about you. Ever since that day on the ferry--" "But your people?" "What about my people? It's just you and I--we'll live in San Francisco--that is, if...

## the-lerouge-case

- Status: pass
- Start: Generated output starts at the expected readable boundary.
- End: Generated output preserves the expected readable ending.
- Sectioning: Sectioning follows source headings with meaningful sections.
- Cleanup: Cleanup excludes boilerplate and obvious playback-hostile artifacts.
- Preview: Preview starts from generated readable content and matches manifest hashes.
- Accepted for main: yes
- Needs correction before main: no
- Should be reverted/skipped: no
- Remaining warnings: none
- Raw start snippet: CHAPTER I. On Thursday, the 6th of March, 1862, two days after Shrove Tuesday, five women belonging to the village of La Jonchere presented themselves at the police station at Bougival. They stated that for two days past no one had seen the Widow Lerouge, one of their neighbours, who lived by herself in an isolated co...
- Generated start snippet: CHAPTER I. On Thursday, the 6th of March, 1862, two days after Shrove Tuesday, five women belonging to the village of La Jonchere presented themselves at the police station at Bougival. They stated that for two days past no one had seen the Widow Lerouge, one of their neighbours, who lived by herself in an isolated co...
- Raw end snippet: errors. The ex-amateur detective doubts the very existence of crime, and maintains that the evidence of one’s senses proves nothing. He circulates petitions for the abolition of capital punishment, and has organised a society for the defence of poor and innocent prisoners.
- Generated end snippet: ng against her son-in-law! Retiring to his father's home in Poitou, after sending in his resignation, M. Daburon has at length found rest; forgetfulness will come later on. His friends do not yet despair of inducing him to marry. Madame Juliette is quite consoled for the loss of Noel. The eighty thousand francs hidden...

## a-dream-of-armageddon

- Status: warn
- Start: Generated output starts at the expected readable boundary.
- End: Generated output preserves the expected readable ending.
- Sectioning: Source is a single story without internal headings; 2 fallback parts are acceptable for review.
- Cleanup: Cleanup excludes boilerplate and obvious playback-hostile artifacts.
- Preview: Preview starts from generated readable content and matches manifest hashes.
- Accepted for main: yes
- Needs correction before main: no
- Should be reverted/skipped: no
- Remaining warnings: No chapter headings were detected; generated fallback parts instead.; Corrected generated title from the Gutenberg collection header "Twelve Stories and a Dream" to the story title "A Dream of Armageddon".; Accepted with warning; review before larger scaling.
- Raw start snippet: A DREAM OF ARMAGEDDON The man with the white face entered the carriage at Rugby. He moved slowly in spite of the urgency of his porter, and even while he was still on the platform I noted how ill he seemed. He dropped into the corner over against me with a sigh, made an incomplete attempt to arrange his travelling sha...
- Generated start snippet: A DREAM OF ARMAGEDDON The man with the white face entered the carriage at Rugby. He moved slowly in spite of the urgency of his porter, and even while he was still on the platform I noted how ill he seemed. He dropped into the corner over against me with a sigh, made an incomplete attempt to arrange his travelling sha...
- Raw end snippet: “I couldn't get to her. She was there on the other side of the Temple—And then—” “Yes,” I insisted. “Yes?” “Nightmares,” he cried; “nightmares indeed! My God! Great birds that fought and tore.”
- Generated end snippet: rutal face before me, the face of the man who had killed me, seemed to recede. It swept out of existence-" "Euston!" clamoured the voices outside; "Euston!" The carriage door opened, admitting a flood of sound, and a porter stood regarding us. The sounds of doors slamming, and the hoof-clatter of cab-horses, and behin...

## a-journey-to-the-centre-of-the-earth

- Status: pass
- Start: Generated output starts at the expected readable boundary.
- End: Generated output preserves the expected readable ending.
- Sectioning: Sectioning follows source headings with meaningful sections.
- Cleanup: Cleanup excludes boilerplate and obvious playback-hostile artifacts.
- Preview: Preview starts from generated readable content and matches manifest hashes.
- Accepted for main: yes
- Needs correction before main: no
- Should be reverted/skipped: no
- Remaining warnings: none
- Raw start snippet: CHAPTER 1 MY UNCLE MAKES A GREAT DISCOVERY Looking back to all that has occurred to me since that eventful day, I am scarcely able to believe in the reality of my adventures. They were truly so wonderful that even now I am bewildered when I think of them.
- Generated start snippet: CHAPTER 1 MY UNCLE MAKES A GREAT DISCOVERY Looking back to all that has occurred to me since that eventful day, I am scarcely able to believe in the reality of my adventures. They were truly so wonderful that even now I am bewildered when I think of them. My uncle was a German, having married my mother's sister, an En...
- Raw end snippet: End of the Voyage Extraordinaire
- Generated end snippet: is now easily explained. But to what phenomenon do we owe this alteration in the needle?" "Nothing more simple." "Explain yourself, my boy. I am on thorns." "During the storm, upon the Central Sea, the ball of fire which made a magnet of the iron in our raft, turned our compass topsy-turvy." "Ah!" cried the Professor,...

## a-journal-of-the-plague-year

- Status: warn
- Start: Generated output starts at the expected readable boundary.
- End: Generated output preserves the expected readable ending.
- Sectioning: Source lacks clean chapter headings; 18 fallback parts are acceptable but manual section labels would improve polish before scaling.
- Cleanup: Cleanup excludes boilerplate and obvious playback-hostile artifacts.
- Preview: Preview starts from generated readable content and matches manifest hashes.
- Accepted for main: yes
- Needs correction before main: no
- Should be reverted/skipped: no
- Remaining warnings: No chapter headings were detected; generated fallback parts instead.; Accepted with warning; review before larger scaling.
- Raw start snippet: It was about the beginning of September, 1664, that I, among the rest of my neighbours, heard in ordinary discourse that the plague was returned again in Holland; for it had been very violent there, and particularly at Amsterdam and Rotterdam, in the year 1663, whither, they say, it was brought, some said from Italy,...
- Generated start snippet: It was about the beginning of September, 1664, that I, among the rest of my neighbours, heard in ordinary discourse that the plague was returned again in Holland; for it had been very violent there, and particularly at Amsterdam and Rotterdam, in the year 1663, whither, they say, it was brought, some said from Italy,...
- Raw end snippet: H. F. [Illustration] FINIS
- Generated end snippet: might too justly be said of them as was said of the children of Israel after their being delivered from the host of Pharaoh, when they passed the Red Sea, and looked back and saw the Egyptians overwhelmed in the water: viz., that they sang His praise, but they soon forgot His works. I can go no farther here. I should...

## dracula

- Status: pass
- Start: Generated output starts at the expected readable boundary.
- End: Generated output preserves the expected readable ending.
- Sectioning: Sectioning follows source headings with meaningful sections.
- Cleanup: Cleanup excludes boilerplate and obvious playback-hostile artifacts.
- Preview: Preview starts from generated readable content and matches manifest hashes.
- Accepted for main: yes
- Needs correction before main: no
- Should be reverted/skipped: no
- Remaining warnings: none
- Raw start snippet: CHAPTER I JONATHAN HARKER’S JOURNAL (_Kept in shorthand._) _3 May. Bistritz._--Left Munich at 8:35 P. M., on 1st May, arriving at Vienna early next morning; should have arrived at 6:46, but train was an
- Generated start snippet: CHAPTER I JONATHAN HARKER'S JOURNAL (_Kept in shorthand._) _3 May. Bistritz._--Left Munich at 8:35 P. M., on 1st May, arriving at Vienna early next morning; should have arrived at 6:46, but train was an hour late. Buda-Pesth seems a wonderful place, from the glimpse which I got of it from the train and the little I co...
- Raw end snippet: “We want no proofs; we ask none to believe us! This boy will some day know what a brave and gallant woman his mother is. Already he knows her sweetness and loving care; later on he will understand how some men so loved her, that they did dare much for her sake.” JONATHAN HARKER. THE END
- Generated end snippet: ch we could all look back on without despair, for Godalming and Seward are both happily married. I took the papers from the safe where they had been ever since our return so long ago. We were struck with the fact, that in all the mass of material of which the record is composed, there is hardly one authentic document;...


## Confirmations

- app/client/assets/temp-books was inspected only and not modified.
- app/client/assets/books/cloudflare-export was not modified.
- Only the seven pilot generated outputs and seven pilot preview assets were inspected.
- No additional books were processed.
- npm run books:build was not run.
