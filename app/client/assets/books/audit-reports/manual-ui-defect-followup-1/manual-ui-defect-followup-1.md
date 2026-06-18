# Manual UI Defect Follow-up 1

Focused follow-up for manual UI reports involving title/default content, illustration artifacts, generic section labels, preview start, and selected-source order.

## Summary

- Checked: 8
- Acceptable: 8
- Corrected: 0
- Acceptance revoked pending correction: 0
- Needs manual review: 0

## Checked Books

| Slug | Verdict | First default | Preview/default order | Generic Part labels | Warnings |
| --- | --- | --- | --- | --- | --- |
| the-book-of-dragons | acceptable | chapter-001 Story 1: The Book of Beasts | correct | No generic Part labels remain in checked generated output. | none |
| the-emerald-city-of-oz | acceptable | chapter-001 Chapter 1: How the Nome King Became Angry | correct | No generic Part labels remain in checked generated output. | none |
| the-call-of-the-wild | acceptable | chapter-001 Chapter 1: Into the Primitive | correct | No generic Part labels remain in checked generated output. | none |
| the-elderbush | acceptable | chapter-001 The Elderbush | correct | No generic Part labels remain in checked generated output. | none |
| the-old-house | acceptable | chapter-001 The Old House | correct | No generic Part labels remain in checked generated output. | none |
| the-snow-queen | acceptable | chapter-001 Story 1: Which Describes A Looking-Glass and Its Broken Fragments | correct | No generic Part labels remain in checked generated output. | none |
| the-swineherd | acceptable | chapter-001 The Swineherd | correct | No generic Part labels remain in checked generated output. | none |
| the-winning-of-olwen | acceptable | chapter-001 The Winning of Olwen | correct | No generic Part labels remain in checked generated output. | none |

## Evidence Details

### the-book-of-dragons

- Raw source: app/client/assets/temp-books/the-book-of-dragons.txt
- Generated title: The Book of Dragons
- Generated author: E. Nesbit
- Current section labels: Story 1: The Book of Beasts; Story 2: Uncle James, or The Purple Stranger; Story 3: The Deliverers of Their Country; Story 4: The Ice Dragon, or Do as You Are Told; Story 5: The Island of the Nine Whirlpools; Story 6: The Dragon Tamers; Story 7: The Fiery Dragon; Story 8: Kind Little Edmund, or The Caves and the Cockatrice
- First default snippet: I. The Book of Beasts He happened to be building a Palace when the news came, and he left all the bricks kicking about the floor for Nurse to clear up--but then the news was rather remarkable news. You see, there was a knock at the front door and voices tal...
- Preview start snippet: I. The Book of Beasts He happened to be building a Palace when the news came, and he left all the bricks kicking about the floor for Nurse to clear up--but then the news was rather remarkable news. You see, there was a knock at the front door and voices tal...
- Meaningful source headings: 68: I. The Book of Beasts                                   1; 70: II. Uncle James, or The Purple Stranger                 19; 72: III. The Deliverers of Their Country                     39; 74: IV. The Ice Dragon, or Do as You Are Told               57; 76: V. The Island of the Nine Whirlpools                   79; 78: VI. The Dragon Tamers                                   99; 80: VII. The Fiery Dragon, or The Heart of Stone; 83: VIII. Kind Little Edmund, or The Caves and the; 170: I. The Book of Beasts; 700: II. Uncle James, or The Purple Stranger; 1255: III. The Deliverers of Their Country; 1782: IV. The Ice Dragon, or Do as You Are Told
- Metadata/artifact leak into default playback: no
- Selected-source order: correct
- Evidence: Raw source contains title page and illustration captions before the first story; generated default starts at Story 1: The Book of Beasts. Generated sections use story-level labels/titles and no generic Part labels.

### the-emerald-city-of-oz

- Raw source: app/client/assets/temp-books/the-emerald-city-of-oz.txt
- Generated title: The Emerald City of Oz
- Generated author: L. Frank Baum
- Current section labels: Chapter 1: How the Nome King Became Angry; Chapter 2: How Uncle Henry Got Into Trouble; Chapter 3: How Ozma Granted Dorothy's Request; Chapter 4: How The Nome King Planned Revenge; Chapter 5: How Dorothy Became a Princess; Chapter 6: How Guph Visited the Whimsies; Chapter 7: How Aunt Em Conquered the Lion; Chapter 8: How the Grand Gallipoot Joined The Nomes; Chapter 9: How the Wogglebug Taught Athletics; Chapter 10: How the Cuttenclips Lived; Chapter 11: How the General Met the First and Foremost; Chapter 12: How they Matched the Fuddles; Chapter 13: How the General Talked to the King; Chapter 14: How the Wizard Practiced Sorcery; Chapter 15: How Dorothy Happened to Get Lost; Chapter 16: How Dorothy Visited Utensia; Chapter 17: How They Came to Bunbury; Chapter 18: How Ozma Looked into the Magic Picture; Chapter 19: How Bunnybury Welcomed the Strangers; Chapter 20: How Dorothy Lunched With a King; Chapter 21: How the King Changed His Mind; Chapter 22: How the Wizard Found Dorothy; Chapter 23: How They Encountered the Flutterbudgets; Chapter 24: How the Tin Woodman Told the Sad News; Chapter 25: How the Scarecrow Displayed His Wisdom; Chapter 26: How Ozma Refused to Fight for Her Kingdom; Chapter 27: How the Fierce Warriors Invaded Oz; Chapter 28: How They Drank at the Forbidden Fountain; Chapter 29: How Glinda Worked a Magic Spell; Chapter 30: How the Story of Oz Came to an End
- First default snippet: The Nome King was in an angry mood, and at such times he was very disagreeable. Every one kept away from him, even his Chief Steward Kaliko. Therefore the King stormed and raved all by himself, walking up and down in his jewel-studded cavern and getting ang...
- Preview start snippet: The Nome King was in an angry mood, and at such times he was very disagreeable. Every one kept away from him, even his Chief Steward Kaliko. Therefore the King stormed and raved all by himself, walking up and down in his jewel-studded cavern and getting ang...
- Meaningful source headings: 50: 1.  How the Nome King Became Angry; 51: 2.  How Uncle Henry Got Into Trouble; 52: 3.  How Ozma Granted Dorothy's Request; 53: 4.  How The Nome King Planned Revenge; 54: 5.  How Dorothy Became a Princess; 55: 6.  How Guph Visited the Whimsies; 56: 7.  How Aunt Em Conquered the Lion; 57: 8.  How the Grand Gallipoot Joined The Nomes; 58: 9.  How the Wogglebug Taught Athletics; 59: 10.  How the Cuttenclips Lived; 60: 11.  How the General Met the First and Foremost; 61: 12.  How they Matched the Fuddles
- Metadata/artifact leak into default playback: no
- Selected-source order: correct
- Evidence: Generated default starts at chapter-001, Chapter 1: How the Nome King Became Angry.

### the-call-of-the-wild

- Raw source: app/client/assets/temp-books/The call of the wild.txt
- Generated title: The Call of the Wild
- Generated author: Jack London
- Current section labels: Chapter 1: Into the Primitive; Chapter 2: The Law of Club and Fang; Chapter 3: The Dominant Primordial Beast; Chapter 4: Who Has Won to Mastership; Chapter 5: The Toil of Trace and Trail; Chapter 6: For the Love of a Man; Chapter 7: The Sounding of the Call
- First default snippet: Chapter I. Into the Primitive "Old longings nomadic leap, Chafing at custom's chain; Again from its brumal sleep Wakens the ferine strain." Buck did not read the newspapers, or he would have known that trouble was brewing, not alone for himself, but for eve...
- Preview start snippet: Chapter I. Into the Primitive "Old longings nomadic leap, Chafing at custom's chain; Again from its brumal sleep Wakens the ferine strain." Buck did not read the newspapers, or he would have known that trouble was brewing, not alone for himself, but for eve...
- Meaningful source headings: 46: Chapter I. Into the Primitive; 47: Chapter II. The Law of Club and Fang; 48: Chapter III. The Dominant Primordial Beast; 49: Chapter IV. Who Has Won to Mastership; 50: Chapter V. The Toil of Trace and Trail; 51: Chapter VI. For the Love of a Man; 52: Chapter VII. The Sounding of the Call; 57: Chapter I. Into the Primitive; 436: Chapter II. The Law of Club and Fang; 742: Chapter III. The Dominant Primordial Beast; 1219: Chapter IV. Who Has Won to Mastership; 1527: Chapter V. The Toil of Trace and Trail
- Metadata/artifact leak into default playback: no
- Selected-source order: correct
- Evidence: Runtime selected-source ordering is covered by the Call of the Wild saved-progress Playwright test.

### the-elderbush

- Raw source: app/client/assets/temp-books/The Elderbush.txt
- Generated title: The Elderbush
- Generated author: H. C. Andersen
- Current section labels: The Elderbush
- First default snippet: THE ELDERBUSH Once upon a time there was a little boy who had taken cold. He had gone out and got his feet wet; though nobody could imagine how it had happened, for it was quite dry weather. So his mother undressed him, put him to bed, and had the tea-pot b...
- Preview start snippet: THE ELDERBUSH Once upon a time there was a little boy who had taken cold. He had gone out and got his feet wet; though nobody could imagine how it had happened, for it was quite dry weather. So his mother undressed him, put him to bed, and had the tea-pot b...
- Meaningful source headings: none detected
- Metadata/artifact leak into default playback: no
- Selected-source order: correct
- Evidence: Generated title/default content use the individual story identity rather than parent collection title metadata.

### the-old-house

- Raw source: app/client/assets/temp-books/The Old House.txt
- Generated title: The Old House
- Generated author: H. C. Andersen
- Current section labels: The Old House
- First default snippet: THE OLD HOUSE In the street, up there, was an old, a very old house--it was almost three hundred years old, for that might be known by reading the great beam on which the date of the year was carved: together with tulips and hop-binds there were whole verse...
- Preview start snippet: THE OLD HOUSE In the street, up there, was an old, a very old house--it was almost three hundred years old, for that might be known by reading the great beam on which the date of the year was carved: together with tulips and hop-binds there were whole verse...
- Meaningful source headings: none detected
- Metadata/artifact leak into default playback: no
- Selected-source order: correct
- Evidence: Generated title/default content use the individual story identity rather than parent collection title metadata.

### the-snow-queen

- Raw source: app/client/assets/temp-books/THE SNOW QUEEN.txt
- Generated title: The Snow Queen
- Generated author: H. C. Andersen
- Current section labels: Story 1: Which Describes A Looking-Glass and Its Broken Fragments; Story 2: A Little Boy and A Little Girl; Story 3: The Enchanted Flower Garden; Story 4: The Prince and Princess; Story 5: The Little Robber Girl; Story 6: The Lapland Woman and the Finland Woman; Story 7: Of the Palace Of the Snow Queen and What Happened There At Last
- First default snippet: STORY THE FIRST WHICH DESCRIBES A LOOKING-GLASS AND ITS BROKEN FRAGMENTS YOU must attend to the beginning of this story, for when we get to the end we shall know more than we now do about a very wicked hobgoblin; he was one of the most mischievous of all sp...
- Preview start snippet: STORY THE FIRST WHICH DESCRIBES A LOOKING-GLASS AND ITS BROKEN FRAGMENTS YOU must attend to the beginning of this story, for when we get to the end we shall know more than we now do about a very wicked hobgoblin; he was one of the most mischievous of all sp...
- Meaningful source headings: 194: SECOND STORY; 414: THIRD STORY; 588: FOURTH STORY; 867: FIFTH STORY; 1035: SIXTH STORY; 1152: SEVENTH STORY
- Metadata/artifact leak into default playback: no
- Selected-source order: correct
- Evidence: Generated title/default content use the individual story identity rather than parent collection title metadata.

### the-swineherd

- Raw source: app/client/assets/temp-books/The Swineherd.txt
- Generated title: The Swineherd
- Generated author: H. C. Andersen
- Current section labels: The Swineherd
- First default snippet: THE SWINEHERD There was once a poor Prince, who had a kingdom. His kingdom was very small, but still quite large enough to marry upon; and he wished to marry. It was certainly rather cool of him to say to the Emperor's daughter, "Will you have me?" But so h...
- Preview start snippet: THE SWINEHERD There was once a poor Prince, who had a kingdom. His kingdom was very small, but still quite large enough to marry upon; and he wished to marry. It was certainly rather cool of him to say to the Emperor's daughter, "Will you have me?" But so h...
- Meaningful source headings: none detected
- Metadata/artifact leak into default playback: no
- Selected-source order: correct
- Evidence: Generated title/default content use the individual story identity rather than parent collection title metadata.

### the-winning-of-olwen

- Raw source: app/client/assets/temp-books/The Winning of Olwen.txt
- Generated title: The Winning of Olwen
- Generated author: Andrew Lang
- Current section labels: The Winning of Olwen
- First default snippet: There was once a king and queen who had a little boy, and they called his name Kilweh. The queen, his mother, fell ill soon after his birth, and as she could not take care of him herself she sent him to a woman she knew up in the mountains, so that he might...
- Preview start snippet: There was once a king and queen who had a little boy, and they called his name Kilweh. The queen, his mother, fell ill soon after his birth, and as she could not take care of him herself she sent him to a woman she knew up in the mountains, so that he might...
- Meaningful source headings: none detected
- Metadata/artifact leak into default playback: no
- Selected-source order: correct
- Evidence: Generated title/default content use the individual story identity rather than parent collection title metadata.
