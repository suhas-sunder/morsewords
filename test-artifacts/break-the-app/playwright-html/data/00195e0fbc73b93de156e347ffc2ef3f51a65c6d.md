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
      - navigation [ref=e10]:
        - link "All tools" [ref=e11] [cursor=pointer]:
          - /url: "#morse-code-navigation"
        - link "Translator" [ref=e12] [cursor=pointer]:
          - /url: /
        - link "Audio" [ref=e13] [cursor=pointer]:
          - /url: /audio
        - link "Practice" [ref=e14] [cursor=pointer]:
          - /url: /practice
        - link "Worksheets" [ref=e15] [cursor=pointer]:
          - /url: /morse-code-printable-chart
        - link "Typing" [ref=e16] [cursor=pointer]:
          - /url: /typing
        - link "How to use" [ref=e17] [cursor=pointer]:
          - /url: /how-to-use
        - button "More" [ref=e19] [cursor=pointer]:
          - text: More
          - generic [ref=e20]: ▾
  - generic [ref=e21]:
    - generic:
      - generic:
        - generic:
          - generic: MorseWords
          - generic: "-- --- .-. ... . .-- --- .-. -.. ..."
        - generic:
          - generic: text to morse
          - generic: "- . -..- - - --- -- --- .-. ... ."
        - generic:
          - generic: morse code translator
          - generic: "-- --- .-. ... . -.-. --- -.. . - .-. .- -. ... .-.. .- - --- .-."
        - generic:
          - generic: decode morse code
          - generic: "-.. . -.-. --- -.. . -- --- .-. ... . -.-. --- -.. ."
        - generic:
          - generic: international morse
          - generic: .. -. - . .-. -. .- - .. --- -. .- .-.. -- --- .-. ... .
        - generic:
          - generic: hello world
          - generic: .... . .-.. .-.. --- .-- --- .-. .-.. -..
        - generic:
          - generic: cq cq
          - generic: "-.-. --.- -.-. --.-"
        - generic:
          - generic: sos
          - generic: ... --- ...
      - generic:
        - generic:
          - generic: made with love
          - generic: "-- .- -.. . .-- .. - .... .-.. --- ...- ."
        - generic:
          - generic: built by Suhas Sunder
          - generic: "-... ..- .. .-.. - -... -.-- ... ..- .... .- ... ... ..- -. -.. . .-."
        - generic:
          - generic: morse to text
          - generic: "-- --- .-. ... . - --- - . -..- -"
        - generic:
          - generic: learn morse code
          - generic: .-.. . .- .-. -. -- --- .-. ... . -.-. --- -.. .
        - generic:
          - generic: morse code decoder
          - generic: "-- --- .-. ... . -.-. --- -.. . -.. . -.-. --- -.. . .-."
        - generic:
          - generic: practice morse
          - generic: .--. .-. .- -.-. - .. -.-. . -- --- .-. ... .
        - generic:
          - generic: dit dah
          - generic: "-.. .. - -.. .- ...."
        - generic:
          - generic: seventy three
          - generic: "--... ...--"
    - generic [ref=e22]:
      - main [ref=e24]:
        - generic [ref=e27]:
          - generic [ref=e28]:
            - generic [ref=e31]: Printable puzzle
            - heading "Morse code word search builder" [level=1] [ref=e32]
            - paragraph [ref=e33]: Create a classroom-ready Morse word search where the clues are Morse code and the grid is alphabet letters. Print a student copy, reveal the solved grid, or print a separate answer key.
            - generic [ref=e35]:
              - link "Word trainer" [ref=e36] [cursor=pointer]:
                - /url: /morse-code-word-trainer
              - link "Worksheet builder" [ref=e37] [cursor=pointer]:
                - /url: /morse-code-printable-chart
              - link "Alphabet chart" [ref=e38] [cursor=pointer]:
                - /url: /morse-code-alphabet
          - complementary [ref=e40]:
            - paragraph [ref=e41]: Puzzle status
            - paragraph [ref=e42]: 8/8 PLACED
            - generic [ref=e43]: Clues print in Morse. Plain answer words stay hidden unless you choose to show them or print the answered version.
        - generic [ref=e44]:
          - generic [ref=e45]:
            - generic [ref=e46]:
              - generic [ref=e47]:
                - generic [ref=e50]: Puzzle builder
                - heading "Build, preview, and print" [level=2] [ref=e51]
              - generic [ref=e52]:
                - button "Generate new puzzle Generate new puzzle" [ref=e53] [cursor=pointer]:
                  - img "Generate new puzzle" [ref=e54]
                  - text: Generate new puzzle
                - button "Reveal answer Reveal answer" [ref=e56] [cursor=pointer]:
                  - img "Reveal answer" [ref=e57]
                  - text: Reveal answer
            - generic [ref=e59]:
              - generic [ref=e60]:
                - paragraph [ref=e61]: Valid words
                - paragraph [ref=e62]: "8"
              - generic [ref=e63]:
                - paragraph [ref=e64]: Placed
                - paragraph [ref=e65]: "8"
              - generic [ref=e66]:
                - paragraph [ref=e67]: Skipped
                - paragraph [ref=e68]: "0"
              - generic [ref=e69]:
                - paragraph [ref=e70]: Grid
                - paragraph [ref=e71]: 12 x 12
              - generic [ref=e72]:
                - paragraph [ref=e73]: Difficulty
                - paragraph [ref=e74]: standard
          - generic [ref=e75]:
            - complementary [ref=e76]:
              - generic [ref=e77]:
                - generic [ref=e78]:
                  - img "Word list" [ref=e79]
                  - heading "Word list" [level=3] [ref=e81]
                - generic [ref=e82]:
                  - generic [ref=e83]:
                    - text: Plain words
                    - textbox "Plain words" [active] [ref=e84]: MORSE SIGNAL RADIO TEACHER PRACTICE COPY AUDIO LIGHT
                  - paragraph [ref=e85]: Use A-Z words separated by commas or new lines. Numbers and punctuation are removed from puzzle words. Up to 20 unique words and 700 characters are used.
                  - paragraph [ref=e86]: 52/700 characters - 8/20 valid words
              - generic [ref=e87]:
                - generic [ref=e88]:
                  - img "Puzzle details" [ref=e89]
                  - heading "Puzzle details" [level=3] [ref=e91]
                - generic [ref=e92]:
                  - generic [ref=e93]:
                    - text: Title
                    - textbox "Title" [ref=e94]: Morse Code Word Search
                  - generic [ref=e95]:
                    - text: Instructions
                    - textbox "Instructions" [ref=e96]: Translate each Morse clue into a word, then find that word in the letter grid.
                  - paragraph [ref=e97]: 78/220 characters
                  - generic [ref=e98]:
                    - button "Name line Name line enabled" [pressed] [ref=e99] [cursor=pointer]:
                      - generic [ref=e100]: Name line
                      - img "Name line enabled" [ref=e101]
                    - button "Date line Date line enabled" [pressed] [ref=e103] [cursor=pointer]:
                      - generic [ref=e104]: Date line
                      - img "Date line enabled" [ref=e105]
              - generic [ref=e107]:
                - generic [ref=e108]:
                  - img "Grid settings" [ref=e109]
                  - heading "Grid and difficulty" [level=3] [ref=e111]
                - generic [ref=e112]:
                  - generic [ref=e113]:
                    - generic [ref=e114]:
                      - text: Grid size
                      - generic [ref=e115]: 12 x 12
                    - slider "Grid size 12 x 12" [ref=e116] [cursor=pointer]: "12"
                  - generic [ref=e117]:
                    - button "easy" [ref=e118] [cursor=pointer]
                    - button "standard" [ref=e119] [cursor=pointer]
                    - button "challenge" [ref=e120] [cursor=pointer]
                  - button "Allow backwards words Allow backwards words disabled" [ref=e121] [cursor=pointer]:
                    - generic [ref=e122]: Allow backwards words
                    - img "Allow backwards words disabled" [ref=e123]
              - generic [ref=e125]:
                - generic [ref=e126]:
                  - img "Answers" [ref=e127]
                  - heading "Answers and print" [level=3] [ref=e129]
                - generic [ref=e130]:
                  - button "Show plain answers on student copy Show plain answers on student copy disabled" [ref=e131] [cursor=pointer]:
                    - generic [ref=e132]: Show plain answers on student copy
                    - img "Show plain answers on student copy disabled" [ref=e133]
                  - radiogroup "Print output" [ref=e135]:
                    - paragraph [ref=e136]: Print output
                    - generic [ref=e137]:
                      - button "Question sheet" [pressed] [ref=e138] [cursor=pointer]
                      - button "Answer sheet" [ref=e139] [cursor=pointer]
                      - button "Question + answer" [ref=e140] [cursor=pointer]
                  - generic [ref=e141]:
                    - button "Print selected output Print selected output" [ref=e142] [cursor=pointer]:
                      - img "Print selected output" [ref=e143]
                      - text: Print selected output
                    - button "Share puzzle Share puzzle" [ref=e145] [cursor=pointer]:
                      - img "Share puzzle" [ref=e146]
                      - text: Share puzzle
              - generic [ref=e148]:
                - generic [ref=e149]:
                  - img "Branding and QR" [ref=e150]
                  - heading "Branding and QR" [level=3] [ref=e152]
                - generic [ref=e153]:
                  - button "Include MorseWords branding Include MorseWords branding enabled" [pressed] [ref=e154] [cursor=pointer]:
                    - generic [ref=e155]: Include MorseWords branding
                    - img "Include MorseWords branding enabled" [ref=e156]
                  - button "Include QR code Include QR code enabled" [pressed] [ref=e158] [cursor=pointer]:
                    - generic [ref=e159]: Include QR code
                    - img "Include QR code enabled" [ref=e160]
                  - generic [ref=e162]:
                    - text: Brand name
                    - textbox "Brand name" [ref=e163]: MorseWords
            - article [ref=e165]:
              - generic [ref=e166]:
                - generic [ref=e167]:
                  - paragraph [ref=e168]: Student preview
                  - heading "Morse Code Word Search" [level=2] [ref=e169]
                  - paragraph [ref=e170]: Translate each Morse clue into a word, then find that word in the letter grid.
                - img "QR code to MorseWords" [ref=e171]
              - generic [ref=e172]:
                - generic [ref=e173]: "Name: __________________________"
                - generic [ref=e174]: "Date: _______________"
              - generic [ref=e175]:
                - heading "Morse clues" [level=3] [ref=e176]
                - list [ref=e177]:
                  - listitem [ref=e178]: .--. .-. .- -.-. - .. -.-. .
                  - listitem [ref=e179]: "- . .- -.-. .... . .-."
                  - listitem [ref=e180]: ... .. --. -. .- .-..
                  - listitem [ref=e181]: "-- --- .-. ... ."
                  - listitem [ref=e182]: .-. .- -.. .. ---
                  - listitem [ref=e183]: .- ..- -.. .. ---
                  - listitem [ref=e184]: .-.. .. --. .... -
                  - listitem [ref=e185]: "-.-. --- .--. -.--"
              - generic [ref=e186]:
                - generic [ref=e187]: P
                - generic [ref=e188]: Z
                - generic [ref=e189]: F
                - generic [ref=e190]: E
                - generic [ref=e191]: U
                - generic [ref=e192]: H
                - generic [ref=e193]: O
                - generic [ref=e194]: A
                - generic [ref=e195]: G
                - generic [ref=e196]: R
                - generic [ref=e197]: T
                - generic [ref=e198]: T
                - generic [ref=e199]: B
                - generic [ref=e200]: P
                - generic [ref=e201]: J
                - generic [ref=e202]: B
                - generic [ref=e203]: H
                - generic [ref=e204]: F
                - generic [ref=e205]: F
                - generic [ref=e206]: Q
                - generic [ref=e207]: E
                - generic [ref=e208]: B
                - generic [ref=e209]: C
                - generic [ref=e210]: F
                - generic [ref=e211]: "N"
                - generic [ref=e212]: R
                - generic [ref=e213]: V
                - generic [ref=e214]: E
                - generic [ref=e215]: J
                - generic [ref=e216]: G
                - generic [ref=e217]: E
                - generic [ref=e218]: H
                - generic [ref=e219]: K
                - generic [ref=e220]: D
                - generic [ref=e221]: D
                - generic [ref=e222]: C
                - generic [ref=e223]: C
                - generic [ref=e224]: A
                - generic [ref=e225]: Q
                - generic [ref=e226]: E
                - generic [ref=e227]: W
                - generic [ref=e228]: Q
                - generic [ref=e229]: C
                - generic [ref=e230]: P
                - generic [ref=e231]: K
                - generic [ref=e232]: R
                - generic [ref=e233]: D
                - generic [ref=e234]: R
                - generic [ref=e235]: A
                - generic [ref=e236]: C
                - generic [ref=e237]: I
                - generic [ref=e238]: C
                - generic [ref=e239]: R
                - generic [ref=e240]: A
                - generic [ref=e241]: K
                - generic [ref=e242]: D
                - generic [ref=e243]: U
                - generic [ref=e244]: A
                - generic [ref=e245]: T
                - generic [ref=e246]: L
                - generic [ref=e247]: A
                - generic [ref=e248]: T
                - generic [ref=e249]: C
                - generic [ref=e250]: B
                - generic [ref=e251]: E
                - generic [ref=e252]: "N"
                - generic [ref=e253]: S
                - generic [ref=e254]: W
                - generic [ref=e255]: M
                - generic [ref=e256]: D
                - generic [ref=e257]: A
                - generic [ref=e258]: I
                - generic [ref=e259]: "Y"
                - generic [ref=e260]: I
                - generic [ref=e261]: Q
                - generic [ref=e262]: T
                - generic [ref=e263]: H
                - generic [ref=e264]: O
                - generic [ref=e265]: I
                - generic [ref=e266]: "N"
                - generic [ref=e267]: E
                - generic [ref=e268]: I
                - generic [ref=e269]: Z
                - generic [ref=e270]: G
                - generic [ref=e271]: A
                - generic [ref=e272]: C
                - generic [ref=e273]: U
                - generic [ref=e274]: "N"
                - generic [ref=e275]: I
                - generic [ref=e276]: P
                - generic [ref=e277]: G
                - generic [ref=e278]: M
                - generic [ref=e279]: E
                - generic [ref=e280]: O
                - generic [ref=e281]: "N"
                - generic [ref=e282]: H
                - generic [ref=e283]: S
                - generic [ref=e284]: E
                - generic [ref=e285]: B
                - generic [ref=e286]: D
                - generic [ref=e287]: S
                - generic [ref=e288]: R
                - generic [ref=e289]: "N"
                - generic [ref=e290]: R
                - generic [ref=e291]: I
                - generic [ref=e292]: M
                - generic [ref=e293]: R
                - generic [ref=e294]: T
                - generic [ref=e295]: F
                - generic [ref=e296]: E
                - generic [ref=e297]: U
                - generic [ref=e298]: F
                - generic [ref=e299]: "N"
                - generic [ref=e300]: V
                - generic [ref=e301]: A
                - generic [ref=e302]: G
                - generic [ref=e303]: W
                - generic [ref=e304]: Z
                - generic [ref=e305]: P
                - generic [ref=e306]: B
                - generic [ref=e307]: D
                - generic [ref=e308]: A
                - generic [ref=e309]: "Y"
                - generic [ref=e310]: J
                - generic [ref=e311]: X
                - generic [ref=e312]: "N"
                - generic [ref=e313]: L
                - generic [ref=e314]: I
                - generic [ref=e315]: "N"
                - generic [ref=e316]: I
                - generic [ref=e317]: "N"
                - generic [ref=e318]: V
                - generic [ref=e319]: C
                - generic [ref=e320]: O
                - generic [ref=e321]: P
                - generic [ref=e322]: "Y"
                - generic [ref=e323]: M
                - generic [ref=e324]: O
                - generic [ref=e325]: R
                - generic [ref=e326]: S
                - generic [ref=e327]: E
                - generic [ref=e328]: U
                - generic [ref=e329]: J
                - generic [ref=e330]: H
              - generic [ref=e331]:
                - generic [ref=e332]:
                  - strong [ref=e333]: MorseWords
                  - paragraph [ref=e334]: www.morsewords.com/morse-code-word-search-builder
                - generic [ref=e335]:
                  - img "QR code" [ref=e336]
                  - text: QR links to MorseWords
        - generic [ref=e338]:
          - generic [ref=e339]:
            - generic [ref=e340]:
              - generic [ref=e341]:
                - generic [ref=e344]: Puzzle spec
                - heading "How this Morse code word search works" [level=2] [ref=e345]
                - paragraph [ref=e346]: "This builder makes a Morse-specific puzzle: clues are Morse code, the grid is alphabet letters, and students solve it by translating each clue before searching the grid."
              - generic [ref=e347]:
                - paragraph [ref=e348]: Student task
                - paragraph [ref=e349]: "-- --- .-. ... ."
                - paragraph [ref=e350]: Translate the clue first, then find MORSE in the letter grid.
            - navigation "Puzzle spec notes" [ref=e351]:
              - link "Clues" [ref=e352] [cursor=pointer]:
                - /url: "#word-search-clues"
              - link "Grid" [ref=e353] [cursor=pointer]:
                - /url: "#word-search-grid"
              - link "Difficulty" [ref=e354] [cursor=pointer]:
                - /url: "#word-search-difficulty"
              - link "Printing" [ref=e355] [cursor=pointer]:
                - /url: "#word-search-printing"
          - generic [ref=e356]:
            - generic [ref=e357]:
              - generic [ref=e358]:
                - term [ref=e359]: Morse clues
                - definition [ref=e360]: The clue list uses dots and dashes instead of plain answer words.
              - generic [ref=e361]:
                - term [ref=e362]: Alphabet grid
                - definition [ref=e363]: The grid stays A-Z only, so students must decode before searching.
              - generic [ref=e364]:
                - term [ref=e365]: Teacher key
                - definition [ref=e366]: Reveal or print the answered version with highlighted cells and placements.
            - generic [ref=e367]:
              - generic [ref=e369]:
                - generic [ref=e370]:
                  - paragraph [ref=e371]: Decode first
                  - heading "Clues" [level=3] [ref=e372]
                - paragraph [ref=e374]: Students translate each Morse clue into a word, then search for that word in the grid. This makes the activity useful Morse practice instead of a plain vocabulary puzzle.
              - generic [ref=e376]:
                - generic [ref=e377]:
                  - paragraph [ref=e378]: Letter search
                  - heading "Grid" [level=3] [ref=e379]
                - paragraph [ref=e381]: The board contains alphabet letters only. Unsupported characters are removed from the source words, and words that do not fit are reported instead of being silently cut off.
              - generic [ref=e383]:
                - generic [ref=e384]:
                  - paragraph [ref=e385]: Placement rules
                  - heading "Difficulty" [level=3] [ref=e386]
                - paragraph [ref=e388]: Easy uses across and down words. Standard adds diagonals. Challenge includes reverse directions. Larger grids make long words easier to place and easier to read in print.
              - generic [ref=e390]:
                - generic [ref=e391]:
                  - paragraph [ref=e392]: Classroom copies
                  - heading "Printing" [level=3] [ref=e393]
                - paragraph [ref=e395]: Print the student copy without answers, or print an answered version with highlighted cells and a placement table. Branding and QR controls stay local to the browser.
        - generic [ref=e396]:
          - generic [ref=e399]:
            - generic [ref=e402]: Teaching flow
            - heading "Pair word searches with real Morse practice" [level=2] [ref=e403]
            - paragraph [ref=e404]: Use the puzzle as a warm-up, station activity, homework sheet, sub plan, or review task, then connect the same words to active practice.
          - generic [ref=e406]:
            - paragraph [ref=e407]:
              - text: For beginners, start with the
              - link "Morse code alphabet" [ref=e408] [cursor=pointer]:
                - /url: /morse-code-alphabet
              - text: and a short grid. For classroom review, paste vocabulary into the
              - link "word trainer" [ref=e409] [cursor=pointer]:
                - /url: /morse-code-word-trainer
              - text: first, then turn those same words into a printable puzzle.
            - paragraph [ref=e410]:
              - text: If students need listening practice, send the word list into
              - link "audio practice" [ref=e411] [cursor=pointer]:
                - /url: /morse-code-audio-practice
              - text: . If they need a printable reference or answer sheet, use the
              - link "printable worksheet builder" [ref=e412] [cursor=pointer]:
                - /url: /morse-code-printable-chart
              - text: . For a longer routine, fold the puzzle into the
              - link "Morse code practice plan" [ref=e413] [cursor=pointer]:
                - /url: /morse-code-practice-plan
              - text: .
        - generic [ref=e414]:
          - generic [ref=e415]:
            - generic [ref=e418]: FAQ
            - heading "Word search FAQ" [level=2] [ref=e419]
          - generic [ref=e420]:
            - group [ref=e421]:
              - generic "> How does a Morse code word search work?" [ref=e422] [cursor=pointer]:
                - generic [ref=e423]: ">"
                - generic [ref=e424]: How does a Morse code word search work?
            - group [ref=e425]:
              - generic "> Are the plain answers shown on the student copy?" [ref=e426] [cursor=pointer]:
                - generic [ref=e427]: ">"
                - generic [ref=e428]: Are the plain answers shown on the student copy?
            - group [ref=e429]:
              - generic "> Can I make a new puzzle from the same words?" [ref=e430] [cursor=pointer]:
                - generic [ref=e431]: ">"
                - generic [ref=e432]: Can I make a new puzzle from the same words?
            - group [ref=e433]:
              - generic "> What words work best?" [ref=e434] [cursor=pointer]:
                - generic [ref=e435]: ">"
                - generic [ref=e436]: What words work best?
      - generic [ref=e437]:
        - generic [ref=e439]:
          - generic [ref=e440]:
            - generic [ref=e443]: Morse code navigation
            - heading "Explore the Morse code toolkit" [level=2] [ref=e444]
            - paragraph [ref=e445]: Jump between the translator, encoder, decoder, practice pages, printable charts, audio tools, and Morse code reference guides.
          - complementary [ref=e446]:
            - paragraph [ref=e447]: Quick access
            - generic [ref=e448]:
              - link "Translator Text ↔ Morse" [ref=e449] [cursor=pointer]:
                - /url: /
                - generic [ref=e450]: Translator
                - generic [ref=e451]: Text ↔ Morse
              - link "Practice Drills" [ref=e452] [cursor=pointer]:
                - /url: /practice
                - generic [ref=e453]: Practice
                - generic [ref=e454]: Drills
              - link "Printable chart Worksheets" [ref=e455] [cursor=pointer]:
                - /url: /morse-code-printable-chart
                - generic [ref=e456]: Printable chart
                - generic [ref=e457]: Worksheets
              - link "Audio Audio" [ref=e458] [cursor=pointer]:
                - /url: /audio
                - generic [ref=e459]: Audio
                - generic [ref=e460]: Audio
        - generic [ref=e462]:
          - generic [ref=e464]:
            - generic [ref=e465]:
              - paragraph [ref=e466]: Start here
              - heading "Core Morse tools" [level=3] [ref=e467]
              - paragraph [ref=e468]: Translate, encode, decode, and look up Morse code from the main learning tools.
              - paragraph [ref=e469]: 5 pages
            - generic [ref=e470]:
              - link "Morse Code Translator Main tool Convert text to Morse code and Morse code back to text. Open page" [ref=e471] [cursor=pointer]:
                - /url: /
                - generic [ref=e472]:
                  - heading "Morse Code Translator" [level=4] [ref=e473]
                  - generic [ref=e474]: Main tool
                - paragraph [ref=e475]: Convert text to Morse code and Morse code back to text.
                - generic [ref=e476]:
                  - text: Open page
                  - generic [ref=e477]: →
              - link "Morse Code Encoder Encode Turn regular text into clean Morse code output. Open page" [ref=e478] [cursor=pointer]:
                - /url: /morse-code-encoder
                - generic [ref=e479]:
                  - heading "Morse Code Encoder" [level=4] [ref=e480]
                  - generic [ref=e481]: Encode
                - paragraph [ref=e482]: Turn regular text into clean Morse code output.
                - generic [ref=e483]:
                  - text: Open page
                  - generic [ref=e484]: →
              - link "Morse Code Decoder Decode Decode dots, dashes, spaces, and separators into text. Open page" [ref=e485] [cursor=pointer]:
                - /url: /morse-code-decoder
                - generic [ref=e486]:
                  - heading "Morse Code Decoder" [level=4] [ref=e487]
                  - generic [ref=e488]: Decode
                - paragraph [ref=e489]: Decode dots, dashes, spaces, and separators into text.
                - generic [ref=e490]:
                  - text: Open page
                  - generic [ref=e491]: →
              - link "Morse Code Dictionary Reference Look up letters, numbers, punctuation, and common signals. Open page" [ref=e492] [cursor=pointer]:
                - /url: /dictionary
                - generic [ref=e493]:
                  - heading "Morse Code Dictionary" [level=4] [ref=e494]
                  - generic [ref=e495]: Reference
                - paragraph [ref=e496]: Look up letters, numbers, punctuation, and common signals.
                - generic [ref=e497]:
                  - text: Open page
                  - generic [ref=e498]: →
              - link "International Morse Reference Reference Browse letters, digits, punctuation, prosigns, Q-codes, and standards notes. Open page" [ref=e499] [cursor=pointer]:
                - /url: /international-morse-code-reference
                - generic [ref=e500]:
                  - heading "International Morse Reference" [level=4] [ref=e501]
                  - generic [ref=e502]: Reference
                - paragraph [ref=e503]: Browse letters, digits, punctuation, prosigns, Q-codes, and standards notes.
                - generic [ref=e504]:
                  - text: Open page
                  - generic [ref=e505]: →
          - generic [ref=e507]:
            - generic [ref=e508]:
              - paragraph [ref=e509]: Practice
              - heading "Learn by doing" [level=3] [ref=e510]
              - paragraph [ref=e511]: Use these pages for drills, typing practice, sentence work, and guided learning.
              - paragraph [ref=e512]: 8 pages
            - generic [ref=e513]:
              - link "Learn Morse Code Learn Follow a practical path through alphabet, words, audio, sentences, and worksheets. Open page" [ref=e514] [cursor=pointer]:
                - /url: /learn-morse-code
                - generic [ref=e515]:
                  - heading "Learn Morse Code" [level=4] [ref=e516]
                  - generic [ref=e517]: Learn
                - paragraph [ref=e518]: Follow a practical path through alphabet, words, audio, sentences, and worksheets.
                - generic [ref=e519]:
                  - text: Open page
                  - generic [ref=e520]: →
              - link "Practice Plan Plan Use a 2-week or 6-week routine across the MorseWords tools. Open page" [ref=e521] [cursor=pointer]:
                - /url: /morse-code-practice-plan
                - generic [ref=e522]:
                  - heading "Practice Plan" [level=4] [ref=e523]
                  - generic [ref=e524]: Plan
                - paragraph [ref=e525]: Use a 2-week or 6-week routine across the MorseWords tools.
                - generic [ref=e526]:
                  - text: Open page
                  - generic [ref=e527]: →
              - link "Morse Code Practice Practice Practice reading, writing, and recognizing Morse patterns. Open page" [ref=e528] [cursor=pointer]:
                - /url: /practice
                - generic [ref=e529]:
                  - heading "Morse Code Practice" [level=4] [ref=e530]
                  - generic [ref=e531]: Practice
                - paragraph [ref=e532]: Practice reading, writing, and recognizing Morse patterns.
                - generic [ref=e533]:
                  - text: Open page
                  - generic [ref=e534]: →
              - link "Morse Code Typing Typing Build speed and accuracy with typing-based Morse drills. Open page" [ref=e535] [cursor=pointer]:
                - /url: /typing
                - generic [ref=e536]:
                  - heading "Morse Code Typing" [level=4] [ref=e537]
                  - generic [ref=e538]: Typing
                - paragraph [ref=e539]: Build speed and accuracy with typing-based Morse drills.
                - generic [ref=e540]:
                  - text: Open page
                  - generic [ref=e541]: →
              - link "Sentence Practice Sentences Work with full sentence examples instead of single letters. Open page" [ref=e542] [cursor=pointer]:
                - /url: /morse-code-sentence-practice
                - generic [ref=e543]:
                  - heading "Sentence Practice" [level=4] [ref=e544]
                  - generic [ref=e545]: Sentences
                - paragraph [ref=e546]: Work with full sentence examples instead of single letters.
                - generic [ref=e547]:
                  - text: Open page
                  - generic [ref=e548]: →
              - link "Word Trainer Words Practice built-in and custom Morse word lists. Open page" [ref=e549] [cursor=pointer]:
                - /url: /morse-code-word-trainer
                - generic [ref=e550]:
                  - heading "Word Trainer" [level=4] [ref=e551]
                  - generic [ref=e552]: Words
                - paragraph [ref=e553]: Practice built-in and custom Morse word lists.
                - generic [ref=e554]:
                  - text: Open page
                  - generic [ref=e555]: →
              - link "Audio Practice Listen Practice copying Morse by ear with focused prompts. Open page" [ref=e556] [cursor=pointer]:
                - /url: /morse-code-audio-practice
                - generic [ref=e557]:
                  - heading "Audio Practice" [level=4] [ref=e558]
                  - generic [ref=e559]: Listen
                - paragraph [ref=e560]: Practice copying Morse by ear with focused prompts.
                - generic [ref=e561]:
                  - text: Open page
                  - generic [ref=e562]: →
              - link "Morse Code Words Words Practice common words and word-level Morse patterns. Open page" [ref=e563] [cursor=pointer]:
                - /url: /morse-code-words
                - generic [ref=e564]:
                  - heading "Morse Code Words" [level=4] [ref=e565]
                  - generic [ref=e566]: Words
                - paragraph [ref=e567]: Practice common words and word-level Morse patterns.
                - generic [ref=e568]:
                  - text: Open page
                  - generic [ref=e569]: →
          - generic [ref=e571]:
            - generic [ref=e572]:
              - paragraph [ref=e573]: Charts + audio
              - heading "Reference and output tools" [level=3] [ref=e574]
              - paragraph [ref=e575]: Print charts, hear Morse audio, and understand formatting rules used in Morse code.
              - paragraph [ref=e576]: 5 pages
            - generic [ref=e577]:
              - link "Morse Code Alphabet Alphabet View the full A-Z Morse code alphabet in one place. Open page" [ref=e578] [cursor=pointer]:
                - /url: /morse-code-alphabet
                - generic [ref=e579]:
                  - heading "Morse Code Alphabet" [level=4] [ref=e580]
                  - generic [ref=e581]: Alphabet
                - paragraph [ref=e582]: View the full A-Z Morse code alphabet in one place.
                - generic [ref=e583]:
                  - text: Open page
                  - generic [ref=e584]: →
              - link "Printable Morse Worksheets Worksheets Build printable charts, learner templates, and teacher-ready handouts. Open page" [ref=e585] [cursor=pointer]:
                - /url: /morse-code-printable-chart
                - generic [ref=e586]:
                  - heading "Printable Morse Worksheets" [level=4] [ref=e587]
                  - generic [ref=e588]: Worksheets
                - paragraph [ref=e589]: Build printable charts, learner templates, and teacher-ready handouts.
                - generic [ref=e590]:
                  - text: Open page
                  - generic [ref=e591]: →
              - link "Morse Code Audio Generator Listen Generate Morse audio for listening, practice, and downloadable clips. Open page" [ref=e592] [cursor=pointer]:
                - /url: /audio
                - generic [ref=e593]:
                  - heading "Morse Code Audio Generator" [level=4] [ref=e594]
                  - generic [ref=e595]: Listen
                - paragraph [ref=e596]: Generate Morse audio for listening, practice, and downloadable clips.
                - generic [ref=e597]:
                  - text: Open page
                  - generic [ref=e598]: →
              - link "Word Search Builder Puzzle Create printable Morse vocabulary puzzles from custom word lists. Open page" [ref=e599] [cursor=pointer]:
                - /url: /morse-code-word-search-builder
                - generic [ref=e600]:
                  - heading "Word Search Builder" [level=4] [ref=e601]
                  - generic [ref=e602]: Puzzle
                - paragraph [ref=e603]: Create printable Morse vocabulary puzzles from custom word lists.
                - generic [ref=e604]:
                  - text: Open page
                  - generic [ref=e605]: →
              - link "Morse Code Word Separator Formatting Understand spaces, slashes, and word breaks in pasted Morse. Open page" [ref=e606] [cursor=pointer]:
                - /url: /morse-code-word-separator
                - generic [ref=e607]:
                  - heading "Morse Code Word Separator" [level=4] [ref=e608]
                  - generic [ref=e609]: Formatting
                - paragraph [ref=e610]: Understand spaces, slashes, and word breaks in pasted Morse.
                - generic [ref=e611]:
                  - text: Open page
                  - generic [ref=e612]: →
          - generic [ref=e614]:
            - generic [ref=e615]:
              - paragraph [ref=e616]: Guides
              - heading "Helpful Morse code pages" [level=3] [ref=e617]
              - paragraph [ref=e618]: Extra pages for common examples, separators, and basic site guidance.
              - paragraph [ref=e619]: 10 pages
            - generic [ref=e620]:
              - link "Morse Code Timing Timing Understand dot, dash, WPM, PARIS, and spacing ratios. Open page" [ref=e621] [cursor=pointer]:
                - /url: /morse-code-timing
                - generic [ref=e622]:
                  - heading "Morse Code Timing" [level=4] [ref=e623]
                  - generic [ref=e624]: Timing
                - paragraph [ref=e625]: Understand dot, dash, WPM, PARIS, and spacing ratios.
                - generic [ref=e626]:
                  - text: Open page
                  - generic [ref=e627]: →
              - link "Farnsworth Timing Audio Learn character speed, effective speed, and learner spacing. Open page" [ref=e628] [cursor=pointer]:
                - /url: /farnsworth-timing
                - generic [ref=e629]:
                  - heading "Farnsworth Timing" [level=4] [ref=e630]
                  - generic [ref=e631]: Audio
                - paragraph [ref=e632]: Learn character speed, effective speed, and learner spacing.
                - generic [ref=e633]:
                  - text: Open page
                  - generic [ref=e634]: →
              - link "Morse Code Prosigns Signals Look up SOS, AR, SK, BT, KN, and other operating signs. Open page" [ref=e635] [cursor=pointer]:
                - /url: /morse-code-prosigns
                - generic [ref=e636]:
                  - heading "Morse Code Prosigns" [level=4] [ref=e637]
                  - generic [ref=e638]: Signals
                - paragraph [ref=e639]: Look up SOS, AR, SK, BT, KN, and other operating signs.
                - generic [ref=e640]:
                  - text: Open page
                  - generic [ref=e641]: →
              - link "Morse Code Q-Codes Q-code Browse common Q-codes with meanings and examples. Open page" [ref=e642] [cursor=pointer]:
                - /url: /morse-code-q-codes
                - generic [ref=e643]:
                  - heading "Morse Code Q-Codes" [level=4] [ref=e644]
                  - generic [ref=e645]: Q-code
                - paragraph [ref=e646]: Browse common Q-codes with meanings and examples.
                - generic [ref=e647]:
                  - text: Open page
                  - generic [ref=e648]: →
              - link "Morse Punctuation Symbols Find period, comma, question mark, slash, and symbols. Open page" [ref=e649] [cursor=pointer]:
                - /url: /morse-code-punctuation
                - generic [ref=e650]:
                  - heading "Morse Punctuation" [level=4] [ref=e651]
                  - generic [ref=e652]: Symbols
                - paragraph [ref=e653]: Find period, comma, question mark, slash, and symbols.
                - generic [ref=e654]:
                  - text: Open page
                  - generic [ref=e655]: →
              - link "How to Use Guide Learn how to use the Morse code tools effectively. Open page" [ref=e656] [cursor=pointer]:
                - /url: /how-to-use
                - generic [ref=e657]:
                  - heading "How to Use" [level=4] [ref=e658]
                  - generic [ref=e659]: Guide
                - paragraph [ref=e660]: Learn how to use the Morse code tools effectively.
                - generic [ref=e661]:
                  - text: Open page
                  - generic [ref=e662]: →
              - link "The Quick Brown Fox in Morse Code Example See a full pangram example converted into Morse code. Open page" [ref=e663] [cursor=pointer]:
                - /url: /the-quick-brown-fox-morse-code
                - generic [ref=e664]:
                  - heading "The Quick Brown Fox in Morse Code" [level=4] [ref=e665]
                  - generic [ref=e666]: Example
                - paragraph [ref=e667]: See a full pangram example converted into Morse code.
                - generic [ref=e668]:
                  - text: Open page
                  - generic [ref=e669]: →
              - link "Morse Code Word Separator Formatting Understand spacing, slashes, and word separation in Morse code. Open page" [ref=e670] [cursor=pointer]:
                - /url: /morse-code-word-separator
                - generic [ref=e671]:
                  - heading "Morse Code Word Separator" [level=4] [ref=e672]
                  - generic [ref=e673]: Formatting
                - paragraph [ref=e674]: Understand spacing, slashes, and word separation in Morse code.
                - generic [ref=e675]:
                  - text: Open page
                  - generic [ref=e676]: →
              - link "Sources Trust See the standards and references used by MorseWords pages. Open page" [ref=e677] [cursor=pointer]:
                - /url: /sources
                - generic [ref=e678]:
                  - heading "Sources" [level=4] [ref=e679]
                  - generic [ref=e680]: Trust
                - paragraph [ref=e681]: See the standards and references used by MorseWords pages.
                - generic [ref=e682]:
                  - text: Open page
                  - generic [ref=e683]: →
              - link "About Site info Learn more about the site and its Morse code tools. Open page" [ref=e684] [cursor=pointer]:
                - /url: /about
                - generic [ref=e685]:
                  - heading "About" [level=4] [ref=e686]
                  - generic [ref=e687]: Site info
                - paragraph [ref=e688]: Learn more about the site and its Morse code tools.
                - generic [ref=e689]:
                  - text: Open page
                  - generic [ref=e690]: →
  - generic [ref=e691]:
    - generic [ref=e693]:
      - generic [ref=e697]: MorseWords social links
      - list [ref=e699]:
        - listitem [ref=e700]:
          - link "Open MorseWords on Facebook" [ref=e701] [cursor=pointer]:
            - /url: https://www.facebook.com/profile.php?id=61566613301910
            - generic [ref=e703]:
              - generic [ref=e704]: Facebook
              - generic [ref=e705]: Updates
            - generic [ref=e706]: →
        - listitem [ref=e707]:
          - link "Open MorseWords on Twitter / X" [ref=e708] [cursor=pointer]:
            - /url: https://x.com/WordSkullGame
            - generic [ref=e710]:
              - generic [ref=e711]: Twitter / X
              - generic [ref=e712]: Short posts
            - generic [ref=e713]: →
        - listitem [ref=e714]:
          - link "Open MorseWords on Pinterest" [ref=e715] [cursor=pointer]:
            - /url: https://ca.pinterest.com/WordSkull
            - generic [ref=e717]:
              - generic [ref=e718]: Pinterest
              - generic [ref=e719]: Reference boards
            - generic [ref=e720]: →
        - listitem [ref=e721]:
          - link "Open MorseWords on LinkedIn" [ref=e722] [cursor=pointer]:
            - /url: https://www.linkedin.com/company/104154929/
            - generic [ref=e724]:
              - generic [ref=e725]: LinkedIn
              - generic [ref=e726]: Company page
            - generic [ref=e727]: →
        - listitem [ref=e728]:
          - link "Open MorseWords on Instructables" [ref=e729] [cursor=pointer]:
            - /url: https://www.instructables.com/member/SunderOrigami/
            - generic [ref=e731]:
              - generic [ref=e732]: Instructables
              - generic [ref=e733]: Guides
            - generic [ref=e734]: →
        - listitem [ref=e735]:
          - link "Open MorseWords on Reddit" [ref=e736] [cursor=pointer]:
            - /url: https://www.reddit.com/r/WordSkull/
            - generic [ref=e738]:
              - generic [ref=e739]: Reddit
              - generic [ref=e740]: Community
            - generic [ref=e741]: →
        - listitem [ref=e742]:
          - link "Open MorseWords on TikTok" [ref=e743] [cursor=pointer]:
            - /url: https://www.tiktok.com/@wordskull
            - generic [ref=e745]:
              - generic [ref=e746]: TikTok
              - generic [ref=e747]: Short videos
            - generic [ref=e748]: →
        - listitem [ref=e749]:
          - link "Open MorseWords on YouTube" [ref=e750] [cursor=pointer]:
            - /url: https://www.youtube.com/@WordSkullYT
            - generic [ref=e752]:
              - generic [ref=e753]: YouTube
              - generic [ref=e754]: Videos
            - generic [ref=e755]: →
        - listitem [ref=e756]:
          - link "Open MorseWords on Dev.to" [ref=e757] [cursor=pointer]:
            - /url: https://dev.to/productivitygarden
            - generic [ref=e759]:
              - generic [ref=e760]: Dev.to
              - generic [ref=e761]: Build notes
            - generic [ref=e762]: →
        - listitem [ref=e763]:
          - link "Open MorseWords on GitHub" [ref=e764] [cursor=pointer]:
            - /url: https://github.com/suhas-sunder/EmojiKitchenGame
            - generic [ref=e766]:
              - generic [ref=e767]: GitHub
              - generic [ref=e768]: Code
            - generic [ref=e769]: →
        - listitem [ref=e770]:
          - link "Open MorseWords on Instagram" [ref=e771] [cursor=pointer]:
            - /url: https://www.instagram.com/productivitygarden/
            - generic [ref=e773]:
              - generic [ref=e774]: Instagram
              - generic [ref=e775]: Posts
            - generic [ref=e776]: →
    - contentinfo [ref=e777]:
      - generic [ref=e778]:
        - navigation "Footer navigation" [ref=e779]:
          - link "Home" [ref=e780] [cursor=pointer]:
            - /url: /
          - link "Learn" [ref=e781] [cursor=pointer]:
            - /url: /learn-morse-code
          - link "Worksheets" [ref=e782] [cursor=pointer]:
            - /url: /morse-code-printable-chart
          - link "Sources" [ref=e783] [cursor=pointer]:
            - /url: /sources
          - link "Sitemap" [ref=e784] [cursor=pointer]:
            - /url: /sitemap
          - link "Privacy Policy" [ref=e785] [cursor=pointer]:
            - /url: /misc/privacy-policy
          - link "Terms of Service" [ref=e786] [cursor=pointer]:
            - /url: /misc/terms-of-service
          - link "Cookies Policy" [ref=e787] [cursor=pointer]:
            - /url: /misc/cookies-policy
          - link "Socials" [ref=e788] [cursor=pointer]:
            - /url: /misc/socials
          - link "About" [ref=e789] [cursor=pointer]:
            - /url: /about
        - generic [ref=e790]:
          - generic [ref=e791]: © 2025 - 2026 MorseWords ~ By Suhas Sunder
          - generic [ref=e792]: Fast, practical tools for translating, listening to, and practicing Morse code.
          - generic [ref=e793]: "-- .- -.. . / .-- .. - .... / 💖"
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