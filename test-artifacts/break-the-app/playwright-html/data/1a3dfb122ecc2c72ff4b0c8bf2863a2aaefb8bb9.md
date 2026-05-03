# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: warnings-and-edge.spec.ts >> word search reports oversized words and reveal answer changes preview
- Location: tests\break-the-app\warnings-and-edge.spec.ts:57:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Some words are too long for the current grid and were left out.')
Expected: visible
Timeout: 7500ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 7500ms
  - waiting for getByText('Some words are too long for the current grid and were left out.')

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e4]:
      - link "MorseWords MorseWords Translate, listen, and practice Morse code" [ref=e5] [cursor=pointer]:
        - /url: /
        - img "MorseWords" [ref=e6]
        - generic [ref=e7]:
          - generic [ref=e8]: MorseWords
          - generic [ref=e9]: Translate, listen, and practice Morse code
      - button "Open navigation" [ref=e10] [cursor=pointer]
  - generic [ref=e16]:
    - main [ref=e18]:
      - generic [ref=e21]:
        - generic [ref=e22]:
          - generic [ref=e25]: Printable puzzle
          - heading "Morse code word search builder" [level=1] [ref=e26]
          - paragraph [ref=e27]: Create a classroom-ready Morse word search where the clues are Morse code and the grid is alphabet letters. Print a student copy, reveal the solved grid, or print a separate answer key.
          - generic [ref=e29]:
            - link "Word trainer" [ref=e30] [cursor=pointer]:
              - /url: /morse-code-word-trainer
            - link "Worksheet builder" [ref=e31] [cursor=pointer]:
              - /url: /morse-code-printable-chart
            - link "Alphabet chart" [ref=e32] [cursor=pointer]:
              - /url: /morse-code-alphabet
        - complementary [ref=e34]:
          - paragraph [ref=e35]: Puzzle status
          - paragraph [ref=e36]: 8/8 PLACED
          - generic [ref=e37]: Clues print in Morse. Plain answer words stay hidden unless you choose to show them or print the answered version.
      - generic [ref=e38]:
        - generic [ref=e39]:
          - generic [ref=e40]:
            - generic [ref=e41]:
              - generic [ref=e44]: Puzzle builder
              - heading "Build, preview, and print" [level=2] [ref=e45]
            - generic [ref=e46]:
              - button "Generate new puzzle Generate new puzzle" [ref=e47] [cursor=pointer]:
                - img "Generate new puzzle" [ref=e48]
                - text: Generate new puzzle
              - button "Reveal answer Reveal answer" [ref=e50] [cursor=pointer]:
                - img "Reveal answer" [ref=e51]
                - text: Reveal answer
          - generic [ref=e53]:
            - generic [ref=e54]:
              - paragraph [ref=e55]: Valid words
              - paragraph [ref=e56]: "8"
            - generic [ref=e57]:
              - paragraph [ref=e58]: Placed
              - paragraph [ref=e59]: "8"
            - generic [ref=e60]:
              - paragraph [ref=e61]: Skipped
              - paragraph [ref=e62]: "0"
            - generic [ref=e63]:
              - paragraph [ref=e64]: Grid
              - paragraph [ref=e65]: 12 x 12
            - generic [ref=e66]:
              - paragraph [ref=e67]: Difficulty
              - paragraph [ref=e68]: standard
        - generic [ref=e69]:
          - complementary [ref=e70]:
            - generic [ref=e71]:
              - generic [ref=e72]:
                - img "Word list" [ref=e73]
                - heading "Word list" [level=3] [ref=e75]
              - generic [ref=e76]:
                - generic [ref=e77]:
                  - text: Plain words
                  - textbox "Plain words" [active] [ref=e78]: MORSE SIGNAL RADIO TEACHER PRACTICE COPY AUDIO LIGHT
                - paragraph [ref=e79]: Use A-Z words separated by commas or new lines. Numbers and punctuation are removed from puzzle words. Up to 20 unique words and 700 characters are used.
                - paragraph [ref=e80]: 52/700 characters - 8/20 valid words
            - generic [ref=e81]:
              - generic [ref=e82]:
                - img "Puzzle details" [ref=e83]
                - heading "Puzzle details" [level=3] [ref=e85]
              - generic [ref=e86]:
                - generic [ref=e87]:
                  - text: Title
                  - textbox "Title" [ref=e88]: Morse Code Word Search
                - generic [ref=e89]:
                  - text: Instructions
                  - textbox "Instructions" [ref=e90]: Translate each Morse clue into a word, then find that word in the letter grid.
                - paragraph [ref=e91]: 78/220 characters
                - generic [ref=e92]:
                  - button "Name line Name line enabled" [pressed] [ref=e93] [cursor=pointer]:
                    - generic [ref=e94]: Name line
                    - img "Name line enabled" [ref=e95]
                  - button "Date line Date line enabled" [pressed] [ref=e97] [cursor=pointer]:
                    - generic [ref=e98]: Date line
                    - img "Date line enabled" [ref=e99]
            - generic [ref=e101]:
              - generic [ref=e102]:
                - img "Grid settings" [ref=e103]
                - heading "Grid and difficulty" [level=3] [ref=e105]
              - generic [ref=e106]:
                - generic [ref=e107]:
                  - generic [ref=e108]:
                    - text: Grid size
                    - generic [ref=e109]: 12 x 12
                  - slider "Grid size 12 x 12" [ref=e110] [cursor=pointer]: "12"
                - generic [ref=e111]:
                  - button "easy" [ref=e112] [cursor=pointer]
                  - button "standard" [ref=e113] [cursor=pointer]
                  - button "challenge" [ref=e114] [cursor=pointer]
                - button "Allow backwards words Allow backwards words disabled" [ref=e115] [cursor=pointer]:
                  - generic [ref=e116]: Allow backwards words
                  - img "Allow backwards words disabled" [ref=e117]
            - generic [ref=e119]:
              - generic [ref=e120]:
                - img "Answers" [ref=e121]
                - heading "Answers and print" [level=3] [ref=e123]
              - generic [ref=e124]:
                - button "Show plain answers on student copy Show plain answers on student copy disabled" [ref=e125] [cursor=pointer]:
                  - generic [ref=e126]: Show plain answers on student copy
                  - img "Show plain answers on student copy disabled" [ref=e127]
                - radiogroup "Print output" [ref=e129]:
                  - paragraph [ref=e130]: Print output
                  - generic [ref=e131]:
                    - button "Question sheet" [pressed] [ref=e132] [cursor=pointer]
                    - button "Answer sheet" [ref=e133] [cursor=pointer]
                    - button "Question + answer" [ref=e134] [cursor=pointer]
                - generic [ref=e135]:
                  - button "Print selected output Print selected output" [ref=e136] [cursor=pointer]:
                    - img "Print selected output" [ref=e137]
                    - text: Print selected output
                  - button "Share puzzle Share puzzle" [ref=e139] [cursor=pointer]:
                    - img "Share puzzle" [ref=e140]
                    - text: Share puzzle
            - generic [ref=e142]:
              - generic [ref=e143]:
                - img "Branding and QR" [ref=e144]
                - heading "Branding and QR" [level=3] [ref=e146]
              - generic [ref=e147]:
                - button "Include MorseWords branding Include MorseWords branding enabled" [pressed] [ref=e148] [cursor=pointer]:
                  - generic [ref=e149]: Include MorseWords branding
                  - img "Include MorseWords branding enabled" [ref=e150]
                - button "Include QR code Include QR code enabled" [pressed] [ref=e152] [cursor=pointer]:
                  - generic [ref=e153]: Include QR code
                  - img "Include QR code enabled" [ref=e154]
                - generic [ref=e156]:
                  - text: Brand name
                  - textbox "Brand name" [ref=e157]: MorseWords
          - article [ref=e159]:
            - generic [ref=e160]:
              - generic [ref=e161]:
                - paragraph [ref=e162]: Student preview
                - heading "Morse Code Word Search" [level=2] [ref=e163]
                - paragraph [ref=e164]: Translate each Morse clue into a word, then find that word in the letter grid.
              - img "QR code to MorseWords" [ref=e165]
            - generic [ref=e166]:
              - generic [ref=e167]: "Name: __________________________"
              - generic [ref=e168]: "Date: _______________"
            - generic [ref=e169]:
              - heading "Morse clues" [level=3] [ref=e170]
              - list [ref=e171]:
                - listitem [ref=e172]: .--. .-. .- -.-. - .. -.-. .
                - listitem [ref=e173]: "- . .- -.-. .... . .-."
                - listitem [ref=e174]: ... .. --. -. .- .-..
                - listitem [ref=e175]: "-- --- .-. ... ."
                - listitem [ref=e176]: .-. .- -.. .. ---
                - listitem [ref=e177]: .- ..- -.. .. ---
                - listitem [ref=e178]: .-.. .. --. .... -
                - listitem [ref=e179]: "-.-. --- .--. -.--"
            - generic [ref=e180]:
              - generic [ref=e181]: P
              - generic [ref=e182]: Z
              - generic [ref=e183]: F
              - generic [ref=e184]: E
              - generic [ref=e185]: U
              - generic [ref=e186]: H
              - generic [ref=e187]: O
              - generic [ref=e188]: A
              - generic [ref=e189]: G
              - generic [ref=e190]: R
              - generic [ref=e191]: T
              - generic [ref=e192]: T
              - generic [ref=e193]: B
              - generic [ref=e194]: P
              - generic [ref=e195]: J
              - generic [ref=e196]: B
              - generic [ref=e197]: H
              - generic [ref=e198]: F
              - generic [ref=e199]: F
              - generic [ref=e200]: Q
              - generic [ref=e201]: E
              - generic [ref=e202]: B
              - generic [ref=e203]: C
              - generic [ref=e204]: F
              - generic [ref=e205]: "N"
              - generic [ref=e206]: R
              - generic [ref=e207]: V
              - generic [ref=e208]: E
              - generic [ref=e209]: J
              - generic [ref=e210]: G
              - generic [ref=e211]: E
              - generic [ref=e212]: H
              - generic [ref=e213]: K
              - generic [ref=e214]: D
              - generic [ref=e215]: D
              - generic [ref=e216]: C
              - generic [ref=e217]: C
              - generic [ref=e218]: A
              - generic [ref=e219]: Q
              - generic [ref=e220]: E
              - generic [ref=e221]: W
              - generic [ref=e222]: Q
              - generic [ref=e223]: C
              - generic [ref=e224]: P
              - generic [ref=e225]: K
              - generic [ref=e226]: R
              - generic [ref=e227]: D
              - generic [ref=e228]: R
              - generic [ref=e229]: A
              - generic [ref=e230]: C
              - generic [ref=e231]: I
              - generic [ref=e232]: C
              - generic [ref=e233]: R
              - generic [ref=e234]: A
              - generic [ref=e235]: K
              - generic [ref=e236]: D
              - generic [ref=e237]: U
              - generic [ref=e238]: A
              - generic [ref=e239]: T
              - generic [ref=e240]: L
              - generic [ref=e241]: A
              - generic [ref=e242]: T
              - generic [ref=e243]: C
              - generic [ref=e244]: B
              - generic [ref=e245]: E
              - generic [ref=e246]: "N"
              - generic [ref=e247]: S
              - generic [ref=e248]: W
              - generic [ref=e249]: M
              - generic [ref=e250]: D
              - generic [ref=e251]: A
              - generic [ref=e252]: I
              - generic [ref=e253]: "Y"
              - generic [ref=e254]: I
              - generic [ref=e255]: Q
              - generic [ref=e256]: T
              - generic [ref=e257]: H
              - generic [ref=e258]: O
              - generic [ref=e259]: I
              - generic [ref=e260]: "N"
              - generic [ref=e261]: E
              - generic [ref=e262]: I
              - generic [ref=e263]: Z
              - generic [ref=e264]: G
              - generic [ref=e265]: A
              - generic [ref=e266]: C
              - generic [ref=e267]: U
              - generic [ref=e268]: "N"
              - generic [ref=e269]: I
              - generic [ref=e270]: P
              - generic [ref=e271]: G
              - generic [ref=e272]: M
              - generic [ref=e273]: E
              - generic [ref=e274]: O
              - generic [ref=e275]: "N"
              - generic [ref=e276]: H
              - generic [ref=e277]: S
              - generic [ref=e278]: E
              - generic [ref=e279]: B
              - generic [ref=e280]: D
              - generic [ref=e281]: S
              - generic [ref=e282]: R
              - generic [ref=e283]: "N"
              - generic [ref=e284]: R
              - generic [ref=e285]: I
              - generic [ref=e286]: M
              - generic [ref=e287]: R
              - generic [ref=e288]: T
              - generic [ref=e289]: F
              - generic [ref=e290]: E
              - generic [ref=e291]: U
              - generic [ref=e292]: F
              - generic [ref=e293]: "N"
              - generic [ref=e294]: V
              - generic [ref=e295]: A
              - generic [ref=e296]: G
              - generic [ref=e297]: W
              - generic [ref=e298]: Z
              - generic [ref=e299]: P
              - generic [ref=e300]: B
              - generic [ref=e301]: D
              - generic [ref=e302]: A
              - generic [ref=e303]: "Y"
              - generic [ref=e304]: J
              - generic [ref=e305]: X
              - generic [ref=e306]: "N"
              - generic [ref=e307]: L
              - generic [ref=e308]: I
              - generic [ref=e309]: "N"
              - generic [ref=e310]: I
              - generic [ref=e311]: "N"
              - generic [ref=e312]: V
              - generic [ref=e313]: C
              - generic [ref=e314]: O
              - generic [ref=e315]: P
              - generic [ref=e316]: "Y"
              - generic [ref=e317]: M
              - generic [ref=e318]: O
              - generic [ref=e319]: R
              - generic [ref=e320]: S
              - generic [ref=e321]: E
              - generic [ref=e322]: U
              - generic [ref=e323]: J
              - generic [ref=e324]: H
            - generic [ref=e325]:
              - generic [ref=e326]:
                - strong [ref=e327]: MorseWords
                - paragraph [ref=e328]: www.morsewords.com/morse-code-word-search-builder
              - generic [ref=e329]:
                - img "QR code" [ref=e330]
                - text: QR links to MorseWords
      - generic [ref=e332]:
        - generic [ref=e333]:
          - generic [ref=e334]:
            - generic [ref=e335]:
              - generic [ref=e338]: Puzzle spec
              - heading "How this Morse code word search works" [level=2] [ref=e339]
              - paragraph [ref=e340]: "This builder makes a Morse-specific puzzle: clues are Morse code, the grid is alphabet letters, and students solve it by translating each clue before searching the grid."
            - generic [ref=e341]:
              - paragraph [ref=e342]: Student task
              - paragraph [ref=e343]: "-- --- .-. ... ."
              - paragraph [ref=e344]: Translate the clue first, then find MORSE in the letter grid.
          - navigation "Puzzle spec notes" [ref=e345]:
            - link "Clues" [ref=e346] [cursor=pointer]:
              - /url: "#word-search-clues"
            - link "Grid" [ref=e347] [cursor=pointer]:
              - /url: "#word-search-grid"
            - link "Difficulty" [ref=e348] [cursor=pointer]:
              - /url: "#word-search-difficulty"
            - link "Printing" [ref=e349] [cursor=pointer]:
              - /url: "#word-search-printing"
        - generic [ref=e350]:
          - generic [ref=e351]:
            - generic [ref=e352]:
              - term [ref=e353]: Morse clues
              - definition [ref=e354]: The clue list uses dots and dashes instead of plain answer words.
            - generic [ref=e355]:
              - term [ref=e356]: Alphabet grid
              - definition [ref=e357]: The grid stays A-Z only, so students must decode before searching.
            - generic [ref=e358]:
              - term [ref=e359]: Teacher key
              - definition [ref=e360]: Reveal or print the answered version with highlighted cells and placements.
          - generic [ref=e361]:
            - generic [ref=e363]:
              - generic [ref=e364]:
                - paragraph [ref=e365]: Decode first
                - heading "Clues" [level=3] [ref=e366]
              - paragraph [ref=e368]: Students translate each Morse clue into a word, then search for that word in the grid. This makes the activity useful Morse practice instead of a plain vocabulary puzzle.
            - generic [ref=e370]:
              - generic [ref=e371]:
                - paragraph [ref=e372]: Letter search
                - heading "Grid" [level=3] [ref=e373]
              - paragraph [ref=e375]: The board contains alphabet letters only. Unsupported characters are removed from the source words, and words that do not fit are reported instead of being silently cut off.
            - generic [ref=e377]:
              - generic [ref=e378]:
                - paragraph [ref=e379]: Placement rules
                - heading "Difficulty" [level=3] [ref=e380]
              - paragraph [ref=e382]: Easy uses across and down words. Standard adds diagonals. Challenge includes reverse directions. Larger grids make long words easier to place and easier to read in print.
            - generic [ref=e384]:
              - generic [ref=e385]:
                - paragraph [ref=e386]: Classroom copies
                - heading "Printing" [level=3] [ref=e387]
              - paragraph [ref=e389]: Print the student copy without answers, or print an answered version with highlighted cells and a placement table. Branding and QR controls stay local to the browser.
      - generic [ref=e390]:
        - generic [ref=e393]:
          - generic [ref=e396]: Teaching flow
          - heading "Pair word searches with real Morse practice" [level=2] [ref=e397]
          - paragraph [ref=e398]: Use the puzzle as a warm-up, station activity, homework sheet, sub plan, or review task, then connect the same words to active practice.
        - generic [ref=e400]:
          - paragraph [ref=e401]:
            - text: For beginners, start with the
            - link "Morse code alphabet" [ref=e402] [cursor=pointer]:
              - /url: /morse-code-alphabet
            - text: and a short grid. For classroom review, paste vocabulary into the
            - link "word trainer" [ref=e403] [cursor=pointer]:
              - /url: /morse-code-word-trainer
            - text: first, then turn those same words into a printable puzzle.
          - paragraph [ref=e404]:
            - text: If students need listening practice, send the word list into
            - link "audio practice" [ref=e405] [cursor=pointer]:
              - /url: /morse-code-audio-practice
            - text: . If they need a printable reference or answer sheet, use the
            - link "printable worksheet builder" [ref=e406] [cursor=pointer]:
              - /url: /morse-code-printable-chart
            - text: . For a longer routine, fold the puzzle into the
            - link "Morse code practice plan" [ref=e407] [cursor=pointer]:
              - /url: /morse-code-practice-plan
            - text: .
      - generic [ref=e408]:
        - generic [ref=e409]:
          - generic [ref=e412]: FAQ
          - heading "Word search FAQ" [level=2] [ref=e413]
        - generic [ref=e414]:
          - group [ref=e415]:
            - generic "> How does a Morse code word search work?" [ref=e416] [cursor=pointer]:
              - generic [ref=e417]: ">"
              - generic [ref=e418]: How does a Morse code word search work?
          - group [ref=e419]:
            - generic "> Are the plain answers shown on the student copy?" [ref=e420] [cursor=pointer]:
              - generic [ref=e421]: ">"
              - generic [ref=e422]: Are the plain answers shown on the student copy?
          - group [ref=e423]:
            - generic "> Can I make a new puzzle from the same words?" [ref=e424] [cursor=pointer]:
              - generic [ref=e425]: ">"
              - generic [ref=e426]: Can I make a new puzzle from the same words?
          - group [ref=e427]:
            - generic "> What words work best?" [ref=e428] [cursor=pointer]:
              - generic [ref=e429]: ">"
              - generic [ref=e430]: What words work best?
    - generic [ref=e431]:
      - generic [ref=e433]:
        - generic [ref=e434]:
          - generic [ref=e437]: Morse code navigation
          - heading "Explore the Morse code toolkit" [level=2] [ref=e438]
          - paragraph [ref=e439]: Jump between the translator, encoder, decoder, practice pages, printable charts, audio tools, and Morse code reference guides.
        - complementary [ref=e440]:
          - paragraph [ref=e441]: Quick access
          - generic [ref=e442]:
            - link "Translator Text ↔ Morse" [ref=e443] [cursor=pointer]:
              - /url: /
              - generic [ref=e444]: Translator
              - generic [ref=e445]: Text ↔ Morse
            - link "Practice Drills" [ref=e446] [cursor=pointer]:
              - /url: /practice
              - generic [ref=e447]: Practice
              - generic [ref=e448]: Drills
            - link "Printable chart Worksheets" [ref=e449] [cursor=pointer]:
              - /url: /morse-code-printable-chart
              - generic [ref=e450]: Printable chart
              - generic [ref=e451]: Worksheets
            - link "Audio Audio" [ref=e452] [cursor=pointer]:
              - /url: /audio
              - generic [ref=e453]: Audio
              - generic [ref=e454]: Audio
      - generic [ref=e456]:
        - generic [ref=e458]:
          - generic [ref=e459]:
            - paragraph [ref=e460]: Start here
            - heading "Core Morse tools" [level=3] [ref=e461]
            - paragraph [ref=e462]: Translate, encode, decode, and look up Morse code from the main learning tools.
            - paragraph [ref=e463]: 5 pages
          - generic [ref=e464]:
            - link "Morse Code Translator Main tool Convert text to Morse code and Morse code back to text. Open page" [ref=e465] [cursor=pointer]:
              - /url: /
              - generic [ref=e466]:
                - heading "Morse Code Translator" [level=4] [ref=e467]
                - generic [ref=e468]: Main tool
              - paragraph [ref=e469]: Convert text to Morse code and Morse code back to text.
              - generic [ref=e470]:
                - text: Open page
                - generic [ref=e471]: →
            - link "Morse Code Encoder Encode Turn regular text into clean Morse code output. Open page" [ref=e472] [cursor=pointer]:
              - /url: /morse-code-encoder
              - generic [ref=e473]:
                - heading "Morse Code Encoder" [level=4] [ref=e474]
                - generic [ref=e475]: Encode
              - paragraph [ref=e476]: Turn regular text into clean Morse code output.
              - generic [ref=e477]:
                - text: Open page
                - generic [ref=e478]: →
            - link "Morse Code Decoder Decode Decode dots, dashes, spaces, and separators into text. Open page" [ref=e479] [cursor=pointer]:
              - /url: /morse-code-decoder
              - generic [ref=e480]:
                - heading "Morse Code Decoder" [level=4] [ref=e481]
                - generic [ref=e482]: Decode
              - paragraph [ref=e483]: Decode dots, dashes, spaces, and separators into text.
              - generic [ref=e484]:
                - text: Open page
                - generic [ref=e485]: →
            - link "Morse Code Dictionary Reference Look up letters, numbers, punctuation, and common signals. Open page" [ref=e486] [cursor=pointer]:
              - /url: /dictionary
              - generic [ref=e487]:
                - heading "Morse Code Dictionary" [level=4] [ref=e488]
                - generic [ref=e489]: Reference
              - paragraph [ref=e490]: Look up letters, numbers, punctuation, and common signals.
              - generic [ref=e491]:
                - text: Open page
                - generic [ref=e492]: →
            - link "International Morse Reference Reference Browse letters, digits, punctuation, prosigns, Q-codes, and standards notes. Open page" [ref=e493] [cursor=pointer]:
              - /url: /international-morse-code-reference
              - generic [ref=e494]:
                - heading "International Morse Reference" [level=4] [ref=e495]
                - generic [ref=e496]: Reference
              - paragraph [ref=e497]: Browse letters, digits, punctuation, prosigns, Q-codes, and standards notes.
              - generic [ref=e498]:
                - text: Open page
                - generic [ref=e499]: →
        - generic [ref=e501]:
          - generic [ref=e502]:
            - paragraph [ref=e503]: Practice
            - heading "Learn by doing" [level=3] [ref=e504]
            - paragraph [ref=e505]: Use these pages for drills, typing practice, sentence work, and guided learning.
            - paragraph [ref=e506]: 8 pages
          - generic [ref=e507]:
            - link "Learn Morse Code Learn Follow a practical path through alphabet, words, audio, sentences, and worksheets. Open page" [ref=e508] [cursor=pointer]:
              - /url: /learn-morse-code
              - generic [ref=e509]:
                - heading "Learn Morse Code" [level=4] [ref=e510]
                - generic [ref=e511]: Learn
              - paragraph [ref=e512]: Follow a practical path through alphabet, words, audio, sentences, and worksheets.
              - generic [ref=e513]:
                - text: Open page
                - generic [ref=e514]: →
            - link "Practice Plan Plan Use a 2-week or 6-week routine across the MorseWords tools. Open page" [ref=e515] [cursor=pointer]:
              - /url: /morse-code-practice-plan
              - generic [ref=e516]:
                - heading "Practice Plan" [level=4] [ref=e517]
                - generic [ref=e518]: Plan
              - paragraph [ref=e519]: Use a 2-week or 6-week routine across the MorseWords tools.
              - generic [ref=e520]:
                - text: Open page
                - generic [ref=e521]: →
            - link "Morse Code Practice Practice Practice reading, writing, and recognizing Morse patterns. Open page" [ref=e522] [cursor=pointer]:
              - /url: /practice
              - generic [ref=e523]:
                - heading "Morse Code Practice" [level=4] [ref=e524]
                - generic [ref=e525]: Practice
              - paragraph [ref=e526]: Practice reading, writing, and recognizing Morse patterns.
              - generic [ref=e527]:
                - text: Open page
                - generic [ref=e528]: →
            - link "Morse Code Typing Typing Build speed and accuracy with typing-based Morse drills. Open page" [ref=e529] [cursor=pointer]:
              - /url: /typing
              - generic [ref=e530]:
                - heading "Morse Code Typing" [level=4] [ref=e531]
                - generic [ref=e532]: Typing
              - paragraph [ref=e533]: Build speed and accuracy with typing-based Morse drills.
              - generic [ref=e534]:
                - text: Open page
                - generic [ref=e535]: →
            - link "Sentence Practice Sentences Work with full sentence examples instead of single letters. Open page" [ref=e536] [cursor=pointer]:
              - /url: /morse-code-sentence-practice
              - generic [ref=e537]:
                - heading "Sentence Practice" [level=4] [ref=e538]
                - generic [ref=e539]: Sentences
              - paragraph [ref=e540]: Work with full sentence examples instead of single letters.
              - generic [ref=e541]:
                - text: Open page
                - generic [ref=e542]: →
            - link "Word Trainer Words Practice built-in and custom Morse word lists. Open page" [ref=e543] [cursor=pointer]:
              - /url: /morse-code-word-trainer
              - generic [ref=e544]:
                - heading "Word Trainer" [level=4] [ref=e545]
                - generic [ref=e546]: Words
              - paragraph [ref=e547]: Practice built-in and custom Morse word lists.
              - generic [ref=e548]:
                - text: Open page
                - generic [ref=e549]: →
            - link "Audio Practice Listen Practice copying Morse by ear with focused prompts. Open page" [ref=e550] [cursor=pointer]:
              - /url: /morse-code-audio-practice
              - generic [ref=e551]:
                - heading "Audio Practice" [level=4] [ref=e552]
                - generic [ref=e553]: Listen
              - paragraph [ref=e554]: Practice copying Morse by ear with focused prompts.
              - generic [ref=e555]:
                - text: Open page
                - generic [ref=e556]: →
            - link "Morse Code Words Words Practice common words and word-level Morse patterns. Open page" [ref=e557] [cursor=pointer]:
              - /url: /morse-code-words
              - generic [ref=e558]:
                - heading "Morse Code Words" [level=4] [ref=e559]
                - generic [ref=e560]: Words
              - paragraph [ref=e561]: Practice common words and word-level Morse patterns.
              - generic [ref=e562]:
                - text: Open page
                - generic [ref=e563]: →
        - generic [ref=e565]:
          - generic [ref=e566]:
            - paragraph [ref=e567]: Charts + audio
            - heading "Reference and output tools" [level=3] [ref=e568]
            - paragraph [ref=e569]: Print charts, hear Morse audio, and understand formatting rules used in Morse code.
            - paragraph [ref=e570]: 5 pages
          - generic [ref=e571]:
            - link "Morse Code Alphabet Alphabet View the full A-Z Morse code alphabet in one place. Open page" [ref=e572] [cursor=pointer]:
              - /url: /morse-code-alphabet
              - generic [ref=e573]:
                - heading "Morse Code Alphabet" [level=4] [ref=e574]
                - generic [ref=e575]: Alphabet
              - paragraph [ref=e576]: View the full A-Z Morse code alphabet in one place.
              - generic [ref=e577]:
                - text: Open page
                - generic [ref=e578]: →
            - link "Printable Morse Worksheets Worksheets Build printable charts, learner templates, and teacher-ready handouts. Open page" [ref=e579] [cursor=pointer]:
              - /url: /morse-code-printable-chart
              - generic [ref=e580]:
                - heading "Printable Morse Worksheets" [level=4] [ref=e581]
                - generic [ref=e582]: Worksheets
              - paragraph [ref=e583]: Build printable charts, learner templates, and teacher-ready handouts.
              - generic [ref=e584]:
                - text: Open page
                - generic [ref=e585]: →
            - link "Morse Code Audio Generator Listen Generate Morse audio for listening, practice, and downloadable clips. Open page" [ref=e586] [cursor=pointer]:
              - /url: /audio
              - generic [ref=e587]:
                - heading "Morse Code Audio Generator" [level=4] [ref=e588]
                - generic [ref=e589]: Listen
              - paragraph [ref=e590]: Generate Morse audio for listening, practice, and downloadable clips.
              - generic [ref=e591]:
                - text: Open page
                - generic [ref=e592]: →
            - link "Word Search Builder Puzzle Create printable Morse vocabulary puzzles from custom word lists. Open page" [ref=e593] [cursor=pointer]:
              - /url: /morse-code-word-search-builder
              - generic [ref=e594]:
                - heading "Word Search Builder" [level=4] [ref=e595]
                - generic [ref=e596]: Puzzle
              - paragraph [ref=e597]: Create printable Morse vocabulary puzzles from custom word lists.
              - generic [ref=e598]:
                - text: Open page
                - generic [ref=e599]: →
            - link "Morse Code Word Separator Formatting Understand spaces, slashes, and word breaks in pasted Morse. Open page" [ref=e600] [cursor=pointer]:
              - /url: /morse-code-word-separator
              - generic [ref=e601]:
                - heading "Morse Code Word Separator" [level=4] [ref=e602]
                - generic [ref=e603]: Formatting
              - paragraph [ref=e604]: Understand spaces, slashes, and word breaks in pasted Morse.
              - generic [ref=e605]:
                - text: Open page
                - generic [ref=e606]: →
        - generic [ref=e608]:
          - generic [ref=e609]:
            - paragraph [ref=e610]: Guides
            - heading "Helpful Morse code pages" [level=3] [ref=e611]
            - paragraph [ref=e612]: Extra pages for common examples, separators, and basic site guidance.
            - paragraph [ref=e613]: 10 pages
          - generic [ref=e614]:
            - link "Morse Code Timing Timing Understand dot, dash, WPM, PARIS, and spacing ratios. Open page" [ref=e615] [cursor=pointer]:
              - /url: /morse-code-timing
              - generic [ref=e616]:
                - heading "Morse Code Timing" [level=4] [ref=e617]
                - generic [ref=e618]: Timing
              - paragraph [ref=e619]: Understand dot, dash, WPM, PARIS, and spacing ratios.
              - generic [ref=e620]:
                - text: Open page
                - generic [ref=e621]: →
            - link "Farnsworth Timing Audio Learn character speed, effective speed, and learner spacing. Open page" [ref=e622] [cursor=pointer]:
              - /url: /farnsworth-timing
              - generic [ref=e623]:
                - heading "Farnsworth Timing" [level=4] [ref=e624]
                - generic [ref=e625]: Audio
              - paragraph [ref=e626]: Learn character speed, effective speed, and learner spacing.
              - generic [ref=e627]:
                - text: Open page
                - generic [ref=e628]: →
            - link "Morse Code Prosigns Signals Look up SOS, AR, SK, BT, KN, and other operating signs. Open page" [ref=e629] [cursor=pointer]:
              - /url: /morse-code-prosigns
              - generic [ref=e630]:
                - heading "Morse Code Prosigns" [level=4] [ref=e631]
                - generic [ref=e632]: Signals
              - paragraph [ref=e633]: Look up SOS, AR, SK, BT, KN, and other operating signs.
              - generic [ref=e634]:
                - text: Open page
                - generic [ref=e635]: →
            - link "Morse Code Q-Codes Q-code Browse common Q-codes with meanings and examples. Open page" [ref=e636] [cursor=pointer]:
              - /url: /morse-code-q-codes
              - generic [ref=e637]:
                - heading "Morse Code Q-Codes" [level=4] [ref=e638]
                - generic [ref=e639]: Q-code
              - paragraph [ref=e640]: Browse common Q-codes with meanings and examples.
              - generic [ref=e641]:
                - text: Open page
                - generic [ref=e642]: →
            - link "Morse Punctuation Symbols Find period, comma, question mark, slash, and symbols. Open page" [ref=e643] [cursor=pointer]:
              - /url: /morse-code-punctuation
              - generic [ref=e644]:
                - heading "Morse Punctuation" [level=4] [ref=e645]
                - generic [ref=e646]: Symbols
              - paragraph [ref=e647]: Find period, comma, question mark, slash, and symbols.
              - generic [ref=e648]:
                - text: Open page
                - generic [ref=e649]: →
            - link "How to Use Guide Learn how to use the Morse code tools effectively. Open page" [ref=e650] [cursor=pointer]:
              - /url: /how-to-use
              - generic [ref=e651]:
                - heading "How to Use" [level=4] [ref=e652]
                - generic [ref=e653]: Guide
              - paragraph [ref=e654]: Learn how to use the Morse code tools effectively.
              - generic [ref=e655]:
                - text: Open page
                - generic [ref=e656]: →
            - link "The Quick Brown Fox in Morse Code Example See a full pangram example converted into Morse code. Open page" [ref=e657] [cursor=pointer]:
              - /url: /the-quick-brown-fox-morse-code
              - generic [ref=e658]:
                - heading "The Quick Brown Fox in Morse Code" [level=4] [ref=e659]
                - generic [ref=e660]: Example
              - paragraph [ref=e661]: See a full pangram example converted into Morse code.
              - generic [ref=e662]:
                - text: Open page
                - generic [ref=e663]: →
            - link "Morse Code Word Separator Formatting Understand spacing, slashes, and word separation in Morse code. Open page" [ref=e664] [cursor=pointer]:
              - /url: /morse-code-word-separator
              - generic [ref=e665]:
                - heading "Morse Code Word Separator" [level=4] [ref=e666]
                - generic [ref=e667]: Formatting
              - paragraph [ref=e668]: Understand spacing, slashes, and word separation in Morse code.
              - generic [ref=e669]:
                - text: Open page
                - generic [ref=e670]: →
            - link "Sources Trust See the standards and references used by MorseWords pages. Open page" [ref=e671] [cursor=pointer]:
              - /url: /sources
              - generic [ref=e672]:
                - heading "Sources" [level=4] [ref=e673]
                - generic [ref=e674]: Trust
              - paragraph [ref=e675]: See the standards and references used by MorseWords pages.
              - generic [ref=e676]:
                - text: Open page
                - generic [ref=e677]: →
            - link "About Site info Learn more about the site and its Morse code tools. Open page" [ref=e678] [cursor=pointer]:
              - /url: /about
              - generic [ref=e679]:
                - heading "About" [level=4] [ref=e680]
                - generic [ref=e681]: Site info
              - paragraph [ref=e682]: Learn more about the site and its Morse code tools.
              - generic [ref=e683]:
                - text: Open page
                - generic [ref=e684]: →
  - generic [ref=e685]:
    - generic [ref=e687]:
      - generic [ref=e691]: MorseWords social links
      - list [ref=e693]:
        - listitem [ref=e694]:
          - link "Open MorseWords on Facebook" [ref=e695] [cursor=pointer]:
            - /url: https://www.facebook.com/profile.php?id=61566613301910
            - generic [ref=e697]:
              - generic [ref=e698]: Facebook
              - generic [ref=e699]: Updates
            - generic [ref=e700]: →
        - listitem [ref=e701]:
          - link "Open MorseWords on Twitter / X" [ref=e702] [cursor=pointer]:
            - /url: https://x.com/WordSkullGame
            - generic [ref=e704]:
              - generic [ref=e705]: Twitter / X
              - generic [ref=e706]: Short posts
            - generic [ref=e707]: →
        - listitem [ref=e708]:
          - link "Open MorseWords on Pinterest" [ref=e709] [cursor=pointer]:
            - /url: https://ca.pinterest.com/WordSkull
            - generic [ref=e711]:
              - generic [ref=e712]: Pinterest
              - generic [ref=e713]: Reference boards
            - generic [ref=e714]: →
        - listitem [ref=e715]:
          - link "Open MorseWords on LinkedIn" [ref=e716] [cursor=pointer]:
            - /url: https://www.linkedin.com/company/104154929/
            - generic [ref=e718]:
              - generic [ref=e719]: LinkedIn
              - generic [ref=e720]: Company page
            - generic [ref=e721]: →
        - listitem [ref=e722]:
          - link "Open MorseWords on Instructables" [ref=e723] [cursor=pointer]:
            - /url: https://www.instructables.com/member/SunderOrigami/
            - generic [ref=e725]:
              - generic [ref=e726]: Instructables
              - generic [ref=e727]: Guides
            - generic [ref=e728]: →
        - listitem [ref=e729]:
          - link "Open MorseWords on Reddit" [ref=e730] [cursor=pointer]:
            - /url: https://www.reddit.com/r/WordSkull/
            - generic [ref=e732]:
              - generic [ref=e733]: Reddit
              - generic [ref=e734]: Community
            - generic [ref=e735]: →
        - listitem [ref=e736]:
          - link "Open MorseWords on TikTok" [ref=e737] [cursor=pointer]:
            - /url: https://www.tiktok.com/@wordskull
            - generic [ref=e739]:
              - generic [ref=e740]: TikTok
              - generic [ref=e741]: Short videos
            - generic [ref=e742]: →
        - listitem [ref=e743]:
          - link "Open MorseWords on YouTube" [ref=e744] [cursor=pointer]:
            - /url: https://www.youtube.com/@WordSkullYT
            - generic [ref=e746]:
              - generic [ref=e747]: YouTube
              - generic [ref=e748]: Videos
            - generic [ref=e749]: →
        - listitem [ref=e750]:
          - link "Open MorseWords on Dev.to" [ref=e751] [cursor=pointer]:
            - /url: https://dev.to/productivitygarden
            - generic [ref=e753]:
              - generic [ref=e754]: Dev.to
              - generic [ref=e755]: Build notes
            - generic [ref=e756]: →
        - listitem [ref=e757]:
          - link "Open MorseWords on GitHub" [ref=e758] [cursor=pointer]:
            - /url: https://github.com/suhas-sunder/EmojiKitchenGame
            - generic [ref=e760]:
              - generic [ref=e761]: GitHub
              - generic [ref=e762]: Code
            - generic [ref=e763]: →
        - listitem [ref=e764]:
          - link "Open MorseWords on Instagram" [ref=e765] [cursor=pointer]:
            - /url: https://www.instagram.com/productivitygarden/
            - generic [ref=e767]:
              - generic [ref=e768]: Instagram
              - generic [ref=e769]: Posts
            - generic [ref=e770]: →
    - contentinfo [ref=e771]:
      - generic [ref=e772]:
        - navigation "Footer navigation" [ref=e773]:
          - link "Home" [ref=e774] [cursor=pointer]:
            - /url: /
          - link "Learn" [ref=e775] [cursor=pointer]:
            - /url: /learn-morse-code
          - link "Worksheets" [ref=e776] [cursor=pointer]:
            - /url: /morse-code-printable-chart
          - link "Sources" [ref=e777] [cursor=pointer]:
            - /url: /sources
          - link "Sitemap" [ref=e778] [cursor=pointer]:
            - /url: /sitemap
          - link "Privacy Policy" [ref=e779] [cursor=pointer]:
            - /url: /misc/privacy-policy
          - link "Terms of Service" [ref=e780] [cursor=pointer]:
            - /url: /misc/terms-of-service
          - link "Cookies Policy" [ref=e781] [cursor=pointer]:
            - /url: /misc/cookies-policy
          - link "Socials" [ref=e782] [cursor=pointer]:
            - /url: /misc/socials
          - link "About" [ref=e783] [cursor=pointer]:
            - /url: /about
        - generic [ref=e784]:
          - generic [ref=e785]: © 2025 - 2026 MorseWords ~ By Suhas Sunder
          - generic [ref=e786]: Fast, practical tools for translating, listening to, and practicing Morse code.
          - generic [ref=e787]: "-- .- -.. . / .-- .. - .... / 💖"
```

# Test source

```ts
  1  | import { expect, test } from "@playwright/test";
  2  | import fs from "node:fs/promises";
  3  | import path from "node:path";
  4  | import { blockExternalNetwork, expectNoVisiblePrematureWarning } from "./helpers";
  5  | 
  6  | const fixtureDir = path.join("test-artifacts", "break-the-app", "upload-fixtures");
  7  | 
  8  | async function ensureUploadFixtures() {
  9  |   await fs.mkdir(fixtureDir, { recursive: true });
  10 |   await fs.writeFile(
  11 |     path.join(fixtureDir, "inert-logo.svg"),
  12 |     `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="80"><title>BTA inert SVG</title><desc>&lt;script&gt;BTA_CANARY&lt;/script&gt;</desc><rect width="120" height="80" fill="#e0f2fe"/><text x="8" y="45" font-size="16">BTA</text></svg>`,
  13 |   );
  14 |   await fs.writeFile(path.join(fixtureDir, "fake-image.png"), "BTA_NOT_AN_IMAGE");
  15 |   await fs.writeFile(path.join(fixtureDir, "oversized-logo.svg"), `<svg xmlns="http://www.w3.org/2000/svg" width="4000" height="80"><rect width="4000" height="80" fill="#fff"/></svg>`);
  16 | }
  17 | 
  18 | test.beforeEach(async ({ page }) => {
  19 |   await blockExternalNetwork(page);
  20 | });
  21 | 
  22 | test("flash/strobe warnings are hidden until the user enables flash", async ({ page }) => {
  23 |   await page.goto("/morse-code-audio-practice");
  24 |   await expectNoVisiblePrematureWarning(page);
  25 | 
  26 |   const showAdvanced = page.getByRole("button", { name: "Show advanced settings" });
  27 |   if ((await showAdvanced.count()) === 1) {
  28 |     await showAdvanced.click();
  29 |   }
  30 |   await expectNoVisiblePrematureWarning(page);
  31 | 
  32 |   await page.getByRole("button", { name: "Flash" }).click();
  33 |   await expect(
  34 |     page.getByText("Strobe warning:", { exact: false }).filter({ visible: true }),
  35 |   ).toBeVisible();
  36 | });
  37 | 
  38 | test("visual practice does not show strobe warning before first flash", async ({ page }) => {
  39 |   await page.goto("/morse-code-visual-practice");
  40 |   await expectNoVisiblePrematureWarning(page);
  41 | 
  42 |   await page.getByRole("button", { name: "Flash message" }).click();
  43 |   await expect(
  44 |     page.getByText("Strobe warning:", { exact: false }).filter({ visible: true }),
  45 |   ).toBeVisible();
  46 | });
  47 | 
  48 | test("printable chart content limits are hidden until content is actually omitted", async ({ page }) => {
  49 |   await page.goto("/morse-code-printable-chart");
  50 |   await expect(page.getByText("Content limits")).toHaveCount(0);
  51 | 
  52 |   const customWords = page.getByPlaceholder("RADIO, SIGNAL, CODE, MORSE");
  53 |   await customWords.fill("ALPHA, BRAVO, CHARLIE, DELTA, ECHO, FOXTROT, GOLF, HOTEL, INDIA, JULIET, KILO, LIMA");
  54 |   await expect(page.getByText("Content limits")).toBeVisible();
  55 | });
  56 | 
  57 | test("word search reports oversized words and reveal answer changes preview", async ({ page }) => {
  58 |   await page.goto("/morse-code-word-search-builder");
  59 |   await page.getByLabel("Plain words").fill("MORSE\nSIGNAL\nRADIO\nTHISWORDISTOOLONGFORATENGRID");
  60 | 
> 61 |   await expect(page.getByText("Some words are too long for the current grid and were left out.")).toBeVisible();
     |                                                                                                   ^ Error: expect(locator).toBeVisible() failed
  62 |   await expect(page.getByText("Student preview")).toBeVisible();
  63 |   await page.getByRole("button", { name: "Reveal answer" }).click();
  64 |   await expect(page.getByText("Answered preview")).toBeVisible();
  65 | });
  66 | 
  67 | test("word search Generate new puzzle changes the grid", async ({ page }) => {
  68 |   await page.goto("/morse-code-word-search-builder");
  69 |   const grid = page.locator('[style*="grid-template-columns"]').first();
  70 |   const before = await grid.innerText();
  71 |   await page.getByRole("button", { name: "Generate new puzzle" }).click();
  72 |   const after = await grid.innerText();
  73 |   expect(after).not.toEqual(before);
  74 | });
  75 | 
  76 | test("printable chart accepts SVG logo upload with no visible size/dimension warning", async ({ page }) => {
  77 |   await ensureUploadFixtures();
  78 |   await page.goto("/morse-code-printable-chart");
  79 |   await page.locator('input[type="file"]').setInputFiles({
  80 |     name: "inert-logo.svg",
  81 |     mimeType: "image/svg+xml",
  82 |     buffer: await fs.readFile(path.join(fixtureDir, "inert-logo.svg")),
  83 |   });
  84 |   await expect(page.locator('img[alt*="logo preview"]')).toBeVisible();
  85 |   await expect(page.getByText("Content limits")).toHaveCount(0);
  86 | });
  87 | 
```