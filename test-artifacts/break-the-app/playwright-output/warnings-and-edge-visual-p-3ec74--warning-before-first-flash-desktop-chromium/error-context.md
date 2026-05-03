# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: warnings-and-edge.spec.ts >> visual practice does not show strobe warning before first flash
- Location: tests\break-the-app\warnings-and-edge.spec.ts:38:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Strobe warning:').filter({ visible: true })
Expected: visible
Timeout: 7500ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 7500ms
  - waiting for getByText('Strobe warning:').filter({ visible: true })

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
            - generic [ref=e31]: Visual practice
            - heading "Visual Morse code practice" [level=1] [ref=e32]
            - paragraph [ref=e33]: Practice reading Morse as flashes instead of tones. Choose a short message, watch the bulb, then reveal the text and Morse when you are ready.
            - generic [ref=e35]:
              - link "Take visual quiz" [ref=e36] [cursor=pointer]:
                - /url: /morse-code-visual-quiz
              - link "Audio practice" [ref=e37] [cursor=pointer]:
                - /url: /morse-code-audio-practice
              - link "SOS signal" [ref=e38] [cursor=pointer]:
                - /url: /morse-code-sos
          - complementary [ref=e40]:
            - paragraph [ref=e41]: Flash mode
            - paragraph [ref=e42]: READY
            - generic [ref=e43]: Use short messages at first. Visual Morse is easiest when the spacing is clean and the message is not too long.
        - generic [ref=e45]:
          - generic [ref=e46]:
            - generic "Morse light off" [ref=e47]
            - button "Flash message Flash message" [active] [ref=e48] [cursor=pointer]:
              - img "Flash message" [ref=e49]
              - text: Flash message
          - generic [ref=e51]:
            - generic [ref=e52]:
              - text: Message
              - textbox "Message" [ref=e53]: sos
            - generic [ref=e54]:
              - generic [ref=e55]:
                - generic [ref=e56]:
                  - generic [ref=e57]: Character speed
                  - generic [ref=e58]: 14 WPM
                - slider [ref=e59] [cursor=pointer]: "14"
              - generic [ref=e60]:
                - generic [ref=e61]:
                  - generic [ref=e62]: Farnsworth spacing
                  - generic [ref=e63]: 10 WPM
                - paragraph [ref=e64]: Slows spacing only.
                - slider [ref=e65] [cursor=pointer]: "10"
            - button "Reveal answer Reveal answer" [ref=e66] [cursor=pointer]:
              - img "Reveal answer" [ref=e67]
              - text: Reveal answer
        - generic [ref=e69]:
          - generic [ref=e70]:
            - generic [ref=e71]:
              - generic [ref=e72]:
                - generic [ref=e75]: Visual practice spec
                - heading "How this visual Morse practice tool works" [level=2] [ref=e76]
                - paragraph [ref=e77]: Visual practice turns the Morse message into timed flashes. Character speed controls the flash lengths, and Farnsworth spacing stretches only the gaps so you have more time to recognize the next character.
              - generic [ref=e78]:
                - paragraph [ref=e79]: Flash signal
                - paragraph [ref=e80]: ... --- ...
                - paragraph [ref=e81]: Use short messages first. Clean spacing matters as much as the flashes.
            - navigation "Visual practice spec notes" [ref=e82]:
              - link "Message" [ref=e83] [cursor=pointer]:
                - /url: "#visual-practice-message"
              - link "Speed" [ref=e84] [cursor=pointer]:
                - /url: "#visual-practice-speed"
              - link "Farnsworth" [ref=e85] [cursor=pointer]:
                - /url: "#visual-practice-farnsworth"
              - link "Quiz next" [ref=e86] [cursor=pointer]:
                - /url: "#visual-practice-quiz"
          - generic [ref=e87]:
            - generic [ref=e88]:
              - generic [ref=e89]:
                - term [ref=e90]: Light-based copy
                - definition [ref=e91]: The page uses the same dots, dashes, and gaps, but renders them as flashes.
              - generic [ref=e92]:
                - term [ref=e93]: Stacked controls
                - definition [ref=e94]: Speed and Farnsworth settings are kept vertical so each slider is easy to read.
              - generic [ref=e95]:
                - term [ref=e96]: Answer reveal
                - definition [ref=e97]: Reveal the message only after watching the full flash sequence.
            - generic [ref=e98]:
              - generic [ref=e100]:
                - generic [ref=e101]:
                  - paragraph [ref=e102]: Prompt setup
                  - heading "Message" [level=3] [ref=e103]
                - paragraph [ref=e105]: Type a short word, Q-code, or phrase. The tool converts it to Morse and flashes the signal with standard dot, dash, letter-gap, and word-gap timing.
              - generic [ref=e107]:
                - generic [ref=e108]:
                  - paragraph [ref=e109]: Flash length
                  - heading "Speed" [level=3] [ref=e110]
                - paragraph [ref=e112]: Character speed controls how long each dit and dah stays on. Higher WPM means shorter flashes and a faster signal.
              - generic [ref=e114]:
                - generic [ref=e115]:
                  - paragraph [ref=e116]: Learner gaps
                  - heading "Farnsworth" [level=3] [ref=e117]
                - generic [ref=e118]:
                  - paragraph [ref=e119]: Farnsworth spacing gives you more time between characters and words without changing the shape of each flashed character.
                  - list [ref=e120]:
                    - listitem [ref=e121]: Use lower Farnsworth spacing for early practice.
                    - listitem [ref=e122]: Raise it as visual recall improves.
                    - listitem [ref=e123]: Keep messages short to avoid memory overload.
              - generic [ref=e125]:
                - generic [ref=e126]:
                  - paragraph [ref=e127]: Test mode
                  - heading "Quiz next" [level=3] [ref=e128]
                - paragraph [ref=e130]: The visual quiz uses the same speed and Farnsworth controls, but hides the prompt and tracks score, attempts, accuracy, and streaks.
        - generic [ref=e131]:
          - generic [ref=e134]:
            - generic [ref=e137]: Visual flow
            - heading "Practice flashes, then test recall" [level=2] [ref=e138]
          - generic [ref=e140]:
            - link "Visual quiz" [ref=e141] [cursor=pointer]:
              - /url: /morse-code-visual-quiz
            - link "Timing guide" [ref=e142] [cursor=pointer]:
              - /url: /morse-code-timing
            - link "Print review" [ref=e143] [cursor=pointer]:
              - /url: /morse-code-printable-chart
        - generic [ref=e144]:
          - generic [ref=e145]:
            - generic [ref=e148]: FAQ
            - heading "Visual practice FAQ" [level=2] [ref=e149]
          - generic [ref=e150]:
            - group [ref=e151]:
              - generic "> What is visual Morse practice?" [ref=e152] [cursor=pointer]:
                - generic [ref=e153]: ">"
                - generic [ref=e154]: What is visual Morse practice?
            - group [ref=e155]:
              - generic "> Why does visual practice include Farnsworth spacing?" [ref=e156] [cursor=pointer]:
                - generic [ref=e157]: ">"
                - generic [ref=e158]: Why does visual practice include Farnsworth spacing?
            - group [ref=e159]:
              - generic "> Should I use short messages?" [ref=e160] [cursor=pointer]:
                - generic [ref=e161]: ">"
                - generic [ref=e162]: Should I use short messages?
            - group [ref=e163]:
              - generic "> Is flashing light safe for everyone?" [ref=e164] [cursor=pointer]:
                - generic [ref=e165]: ">"
                - generic [ref=e166]: Is flashing light safe for everyone?
      - generic [ref=e167]:
        - generic [ref=e169]:
          - generic [ref=e170]:
            - generic [ref=e173]: Morse code navigation
            - heading "Explore the Morse code toolkit" [level=2] [ref=e174]
            - paragraph [ref=e175]: Jump between the translator, encoder, decoder, practice pages, printable charts, audio tools, and Morse code reference guides.
          - complementary [ref=e176]:
            - paragraph [ref=e177]: Quick access
            - generic [ref=e178]:
              - link "Translator Text ↔ Morse" [ref=e179] [cursor=pointer]:
                - /url: /
                - generic [ref=e180]: Translator
                - generic [ref=e181]: Text ↔ Morse
              - link "Practice Drills" [ref=e182] [cursor=pointer]:
                - /url: /practice
                - generic [ref=e183]: Practice
                - generic [ref=e184]: Drills
              - link "Printable chart Worksheets" [ref=e185] [cursor=pointer]:
                - /url: /morse-code-printable-chart
                - generic [ref=e186]: Printable chart
                - generic [ref=e187]: Worksheets
              - link "Audio Audio" [ref=e188] [cursor=pointer]:
                - /url: /audio
                - generic [ref=e189]: Audio
                - generic [ref=e190]: Audio
        - generic [ref=e192]:
          - generic [ref=e194]:
            - generic [ref=e195]:
              - paragraph [ref=e196]: Start here
              - heading "Core Morse tools" [level=3] [ref=e197]
              - paragraph [ref=e198]: Translate, encode, decode, and look up Morse code from the main learning tools.
              - paragraph [ref=e199]: 5 pages
            - generic [ref=e200]:
              - link "Morse Code Translator Main tool Convert text to Morse code and Morse code back to text. Open page" [ref=e201] [cursor=pointer]:
                - /url: /
                - generic [ref=e202]:
                  - heading "Morse Code Translator" [level=4] [ref=e203]
                  - generic [ref=e204]: Main tool
                - paragraph [ref=e205]: Convert text to Morse code and Morse code back to text.
                - generic [ref=e206]:
                  - text: Open page
                  - generic [ref=e207]: →
              - link "Morse Code Encoder Encode Turn regular text into clean Morse code output. Open page" [ref=e208] [cursor=pointer]:
                - /url: /morse-code-encoder
                - generic [ref=e209]:
                  - heading "Morse Code Encoder" [level=4] [ref=e210]
                  - generic [ref=e211]: Encode
                - paragraph [ref=e212]: Turn regular text into clean Morse code output.
                - generic [ref=e213]:
                  - text: Open page
                  - generic [ref=e214]: →
              - link "Morse Code Decoder Decode Decode dots, dashes, spaces, and separators into text. Open page" [ref=e215] [cursor=pointer]:
                - /url: /morse-code-decoder
                - generic [ref=e216]:
                  - heading "Morse Code Decoder" [level=4] [ref=e217]
                  - generic [ref=e218]: Decode
                - paragraph [ref=e219]: Decode dots, dashes, spaces, and separators into text.
                - generic [ref=e220]:
                  - text: Open page
                  - generic [ref=e221]: →
              - link "Morse Code Dictionary Reference Look up letters, numbers, punctuation, and common signals. Open page" [ref=e222] [cursor=pointer]:
                - /url: /dictionary
                - generic [ref=e223]:
                  - heading "Morse Code Dictionary" [level=4] [ref=e224]
                  - generic [ref=e225]: Reference
                - paragraph [ref=e226]: Look up letters, numbers, punctuation, and common signals.
                - generic [ref=e227]:
                  - text: Open page
                  - generic [ref=e228]: →
              - link "International Morse Reference Reference Browse letters, digits, punctuation, prosigns, Q-codes, and standards notes. Open page" [ref=e229] [cursor=pointer]:
                - /url: /international-morse-code-reference
                - generic [ref=e230]:
                  - heading "International Morse Reference" [level=4] [ref=e231]
                  - generic [ref=e232]: Reference
                - paragraph [ref=e233]: Browse letters, digits, punctuation, prosigns, Q-codes, and standards notes.
                - generic [ref=e234]:
                  - text: Open page
                  - generic [ref=e235]: →
          - generic [ref=e237]:
            - generic [ref=e238]:
              - paragraph [ref=e239]: Practice
              - heading "Learn by doing" [level=3] [ref=e240]
              - paragraph [ref=e241]: Use these pages for drills, typing practice, sentence work, and guided learning.
              - paragraph [ref=e242]: 8 pages
            - generic [ref=e243]:
              - link "Learn Morse Code Learn Follow a practical path through alphabet, words, audio, sentences, and worksheets. Open page" [ref=e244] [cursor=pointer]:
                - /url: /learn-morse-code
                - generic [ref=e245]:
                  - heading "Learn Morse Code" [level=4] [ref=e246]
                  - generic [ref=e247]: Learn
                - paragraph [ref=e248]: Follow a practical path through alphabet, words, audio, sentences, and worksheets.
                - generic [ref=e249]:
                  - text: Open page
                  - generic [ref=e250]: →
              - link "Practice Plan Plan Use a 2-week or 6-week routine across the MorseWords tools. Open page" [ref=e251] [cursor=pointer]:
                - /url: /morse-code-practice-plan
                - generic [ref=e252]:
                  - heading "Practice Plan" [level=4] [ref=e253]
                  - generic [ref=e254]: Plan
                - paragraph [ref=e255]: Use a 2-week or 6-week routine across the MorseWords tools.
                - generic [ref=e256]:
                  - text: Open page
                  - generic [ref=e257]: →
              - link "Morse Code Practice Practice Practice reading, writing, and recognizing Morse patterns. Open page" [ref=e258] [cursor=pointer]:
                - /url: /practice
                - generic [ref=e259]:
                  - heading "Morse Code Practice" [level=4] [ref=e260]
                  - generic [ref=e261]: Practice
                - paragraph [ref=e262]: Practice reading, writing, and recognizing Morse patterns.
                - generic [ref=e263]:
                  - text: Open page
                  - generic [ref=e264]: →
              - link "Morse Code Typing Typing Build speed and accuracy with typing-based Morse drills. Open page" [ref=e265] [cursor=pointer]:
                - /url: /typing
                - generic [ref=e266]:
                  - heading "Morse Code Typing" [level=4] [ref=e267]
                  - generic [ref=e268]: Typing
                - paragraph [ref=e269]: Build speed and accuracy with typing-based Morse drills.
                - generic [ref=e270]:
                  - text: Open page
                  - generic [ref=e271]: →
              - link "Sentence Practice Sentences Work with full sentence examples instead of single letters. Open page" [ref=e272] [cursor=pointer]:
                - /url: /morse-code-sentence-practice
                - generic [ref=e273]:
                  - heading "Sentence Practice" [level=4] [ref=e274]
                  - generic [ref=e275]: Sentences
                - paragraph [ref=e276]: Work with full sentence examples instead of single letters.
                - generic [ref=e277]:
                  - text: Open page
                  - generic [ref=e278]: →
              - link "Word Trainer Words Practice built-in and custom Morse word lists. Open page" [ref=e279] [cursor=pointer]:
                - /url: /morse-code-word-trainer
                - generic [ref=e280]:
                  - heading "Word Trainer" [level=4] [ref=e281]
                  - generic [ref=e282]: Words
                - paragraph [ref=e283]: Practice built-in and custom Morse word lists.
                - generic [ref=e284]:
                  - text: Open page
                  - generic [ref=e285]: →
              - link "Audio Practice Listen Practice copying Morse by ear with focused prompts. Open page" [ref=e286] [cursor=pointer]:
                - /url: /morse-code-audio-practice
                - generic [ref=e287]:
                  - heading "Audio Practice" [level=4] [ref=e288]
                  - generic [ref=e289]: Listen
                - paragraph [ref=e290]: Practice copying Morse by ear with focused prompts.
                - generic [ref=e291]:
                  - text: Open page
                  - generic [ref=e292]: →
              - link "Morse Code Words Words Practice common words and word-level Morse patterns. Open page" [ref=e293] [cursor=pointer]:
                - /url: /morse-code-words
                - generic [ref=e294]:
                  - heading "Morse Code Words" [level=4] [ref=e295]
                  - generic [ref=e296]: Words
                - paragraph [ref=e297]: Practice common words and word-level Morse patterns.
                - generic [ref=e298]:
                  - text: Open page
                  - generic [ref=e299]: →
          - generic [ref=e301]:
            - generic [ref=e302]:
              - paragraph [ref=e303]: Charts + audio
              - heading "Reference and output tools" [level=3] [ref=e304]
              - paragraph [ref=e305]: Print charts, hear Morse audio, and understand formatting rules used in Morse code.
              - paragraph [ref=e306]: 5 pages
            - generic [ref=e307]:
              - link "Morse Code Alphabet Alphabet View the full A-Z Morse code alphabet in one place. Open page" [ref=e308] [cursor=pointer]:
                - /url: /morse-code-alphabet
                - generic [ref=e309]:
                  - heading "Morse Code Alphabet" [level=4] [ref=e310]
                  - generic [ref=e311]: Alphabet
                - paragraph [ref=e312]: View the full A-Z Morse code alphabet in one place.
                - generic [ref=e313]:
                  - text: Open page
                  - generic [ref=e314]: →
              - link "Printable Morse Worksheets Worksheets Build printable charts, learner templates, and teacher-ready handouts. Open page" [ref=e315] [cursor=pointer]:
                - /url: /morse-code-printable-chart
                - generic [ref=e316]:
                  - heading "Printable Morse Worksheets" [level=4] [ref=e317]
                  - generic [ref=e318]: Worksheets
                - paragraph [ref=e319]: Build printable charts, learner templates, and teacher-ready handouts.
                - generic [ref=e320]:
                  - text: Open page
                  - generic [ref=e321]: →
              - link "Morse Code Audio Generator Listen Generate Morse audio for listening, practice, and downloadable clips. Open page" [ref=e322] [cursor=pointer]:
                - /url: /audio
                - generic [ref=e323]:
                  - heading "Morse Code Audio Generator" [level=4] [ref=e324]
                  - generic [ref=e325]: Listen
                - paragraph [ref=e326]: Generate Morse audio for listening, practice, and downloadable clips.
                - generic [ref=e327]:
                  - text: Open page
                  - generic [ref=e328]: →
              - link "Word Search Builder Puzzle Create printable Morse vocabulary puzzles from custom word lists. Open page" [ref=e329] [cursor=pointer]:
                - /url: /morse-code-word-search-builder
                - generic [ref=e330]:
                  - heading "Word Search Builder" [level=4] [ref=e331]
                  - generic [ref=e332]: Puzzle
                - paragraph [ref=e333]: Create printable Morse vocabulary puzzles from custom word lists.
                - generic [ref=e334]:
                  - text: Open page
                  - generic [ref=e335]: →
              - link "Morse Code Word Separator Formatting Understand spaces, slashes, and word breaks in pasted Morse. Open page" [ref=e336] [cursor=pointer]:
                - /url: /morse-code-word-separator
                - generic [ref=e337]:
                  - heading "Morse Code Word Separator" [level=4] [ref=e338]
                  - generic [ref=e339]: Formatting
                - paragraph [ref=e340]: Understand spaces, slashes, and word breaks in pasted Morse.
                - generic [ref=e341]:
                  - text: Open page
                  - generic [ref=e342]: →
          - generic [ref=e344]:
            - generic [ref=e345]:
              - paragraph [ref=e346]: Guides
              - heading "Helpful Morse code pages" [level=3] [ref=e347]
              - paragraph [ref=e348]: Extra pages for common examples, separators, and basic site guidance.
              - paragraph [ref=e349]: 10 pages
            - generic [ref=e350]:
              - link "Morse Code Timing Timing Understand dot, dash, WPM, PARIS, and spacing ratios. Open page" [ref=e351] [cursor=pointer]:
                - /url: /morse-code-timing
                - generic [ref=e352]:
                  - heading "Morse Code Timing" [level=4] [ref=e353]
                  - generic [ref=e354]: Timing
                - paragraph [ref=e355]: Understand dot, dash, WPM, PARIS, and spacing ratios.
                - generic [ref=e356]:
                  - text: Open page
                  - generic [ref=e357]: →
              - link "Farnsworth Timing Audio Learn character speed, effective speed, and learner spacing. Open page" [ref=e358] [cursor=pointer]:
                - /url: /farnsworth-timing
                - generic [ref=e359]:
                  - heading "Farnsworth Timing" [level=4] [ref=e360]
                  - generic [ref=e361]: Audio
                - paragraph [ref=e362]: Learn character speed, effective speed, and learner spacing.
                - generic [ref=e363]:
                  - text: Open page
                  - generic [ref=e364]: →
              - link "Morse Code Prosigns Signals Look up SOS, AR, SK, BT, KN, and other operating signs. Open page" [ref=e365] [cursor=pointer]:
                - /url: /morse-code-prosigns
                - generic [ref=e366]:
                  - heading "Morse Code Prosigns" [level=4] [ref=e367]
                  - generic [ref=e368]: Signals
                - paragraph [ref=e369]: Look up SOS, AR, SK, BT, KN, and other operating signs.
                - generic [ref=e370]:
                  - text: Open page
                  - generic [ref=e371]: →
              - link "Morse Code Q-Codes Q-code Browse common Q-codes with meanings and examples. Open page" [ref=e372] [cursor=pointer]:
                - /url: /morse-code-q-codes
                - generic [ref=e373]:
                  - heading "Morse Code Q-Codes" [level=4] [ref=e374]
                  - generic [ref=e375]: Q-code
                - paragraph [ref=e376]: Browse common Q-codes with meanings and examples.
                - generic [ref=e377]:
                  - text: Open page
                  - generic [ref=e378]: →
              - link "Morse Punctuation Symbols Find period, comma, question mark, slash, and symbols. Open page" [ref=e379] [cursor=pointer]:
                - /url: /morse-code-punctuation
                - generic [ref=e380]:
                  - heading "Morse Punctuation" [level=4] [ref=e381]
                  - generic [ref=e382]: Symbols
                - paragraph [ref=e383]: Find period, comma, question mark, slash, and symbols.
                - generic [ref=e384]:
                  - text: Open page
                  - generic [ref=e385]: →
              - link "How to Use Guide Learn how to use the Morse code tools effectively. Open page" [ref=e386] [cursor=pointer]:
                - /url: /how-to-use
                - generic [ref=e387]:
                  - heading "How to Use" [level=4] [ref=e388]
                  - generic [ref=e389]: Guide
                - paragraph [ref=e390]: Learn how to use the Morse code tools effectively.
                - generic [ref=e391]:
                  - text: Open page
                  - generic [ref=e392]: →
              - link "The Quick Brown Fox in Morse Code Example See a full pangram example converted into Morse code. Open page" [ref=e393] [cursor=pointer]:
                - /url: /the-quick-brown-fox-morse-code
                - generic [ref=e394]:
                  - heading "The Quick Brown Fox in Morse Code" [level=4] [ref=e395]
                  - generic [ref=e396]: Example
                - paragraph [ref=e397]: See a full pangram example converted into Morse code.
                - generic [ref=e398]:
                  - text: Open page
                  - generic [ref=e399]: →
              - link "Morse Code Word Separator Formatting Understand spacing, slashes, and word separation in Morse code. Open page" [ref=e400] [cursor=pointer]:
                - /url: /morse-code-word-separator
                - generic [ref=e401]:
                  - heading "Morse Code Word Separator" [level=4] [ref=e402]
                  - generic [ref=e403]: Formatting
                - paragraph [ref=e404]: Understand spacing, slashes, and word separation in Morse code.
                - generic [ref=e405]:
                  - text: Open page
                  - generic [ref=e406]: →
              - link "Sources Trust See the standards and references used by MorseWords pages. Open page" [ref=e407] [cursor=pointer]:
                - /url: /sources
                - generic [ref=e408]:
                  - heading "Sources" [level=4] [ref=e409]
                  - generic [ref=e410]: Trust
                - paragraph [ref=e411]: See the standards and references used by MorseWords pages.
                - generic [ref=e412]:
                  - text: Open page
                  - generic [ref=e413]: →
              - link "About Site info Learn more about the site and its Morse code tools. Open page" [ref=e414] [cursor=pointer]:
                - /url: /about
                - generic [ref=e415]:
                  - heading "About" [level=4] [ref=e416]
                  - generic [ref=e417]: Site info
                - paragraph [ref=e418]: Learn more about the site and its Morse code tools.
                - generic [ref=e419]:
                  - text: Open page
                  - generic [ref=e420]: →
  - generic [ref=e421]:
    - generic [ref=e423]:
      - generic [ref=e427]: MorseWords social links
      - list [ref=e429]:
        - listitem [ref=e430]:
          - link "Open MorseWords on Facebook" [ref=e431] [cursor=pointer]:
            - /url: https://www.facebook.com/profile.php?id=61566613301910
            - generic [ref=e433]:
              - generic [ref=e434]: Facebook
              - generic [ref=e435]: Updates
            - generic [ref=e436]: →
        - listitem [ref=e437]:
          - link "Open MorseWords on Twitter / X" [ref=e438] [cursor=pointer]:
            - /url: https://x.com/WordSkullGame
            - generic [ref=e440]:
              - generic [ref=e441]: Twitter / X
              - generic [ref=e442]: Short posts
            - generic [ref=e443]: →
        - listitem [ref=e444]:
          - link "Open MorseWords on Pinterest" [ref=e445] [cursor=pointer]:
            - /url: https://ca.pinterest.com/WordSkull
            - generic [ref=e447]:
              - generic [ref=e448]: Pinterest
              - generic [ref=e449]: Reference boards
            - generic [ref=e450]: →
        - listitem [ref=e451]:
          - link "Open MorseWords on LinkedIn" [ref=e452] [cursor=pointer]:
            - /url: https://www.linkedin.com/company/104154929/
            - generic [ref=e454]:
              - generic [ref=e455]: LinkedIn
              - generic [ref=e456]: Company page
            - generic [ref=e457]: →
        - listitem [ref=e458]:
          - link "Open MorseWords on Instructables" [ref=e459] [cursor=pointer]:
            - /url: https://www.instructables.com/member/SunderOrigami/
            - generic [ref=e461]:
              - generic [ref=e462]: Instructables
              - generic [ref=e463]: Guides
            - generic [ref=e464]: →
        - listitem [ref=e465]:
          - link "Open MorseWords on Reddit" [ref=e466] [cursor=pointer]:
            - /url: https://www.reddit.com/r/WordSkull/
            - generic [ref=e468]:
              - generic [ref=e469]: Reddit
              - generic [ref=e470]: Community
            - generic [ref=e471]: →
        - listitem [ref=e472]:
          - link "Open MorseWords on TikTok" [ref=e473] [cursor=pointer]:
            - /url: https://www.tiktok.com/@wordskull
            - generic [ref=e475]:
              - generic [ref=e476]: TikTok
              - generic [ref=e477]: Short videos
            - generic [ref=e478]: →
        - listitem [ref=e479]:
          - link "Open MorseWords on YouTube" [ref=e480] [cursor=pointer]:
            - /url: https://www.youtube.com/@WordSkullYT
            - generic [ref=e482]:
              - generic [ref=e483]: YouTube
              - generic [ref=e484]: Videos
            - generic [ref=e485]: →
        - listitem [ref=e486]:
          - link "Open MorseWords on Dev.to" [ref=e487] [cursor=pointer]:
            - /url: https://dev.to/productivitygarden
            - generic [ref=e489]:
              - generic [ref=e490]: Dev.to
              - generic [ref=e491]: Build notes
            - generic [ref=e492]: →
        - listitem [ref=e493]:
          - link "Open MorseWords on GitHub" [ref=e494] [cursor=pointer]:
            - /url: https://github.com/suhas-sunder/EmojiKitchenGame
            - generic [ref=e496]:
              - generic [ref=e497]: GitHub
              - generic [ref=e498]: Code
            - generic [ref=e499]: →
        - listitem [ref=e500]:
          - link "Open MorseWords on Instagram" [ref=e501] [cursor=pointer]:
            - /url: https://www.instagram.com/productivitygarden/
            - generic [ref=e503]:
              - generic [ref=e504]: Instagram
              - generic [ref=e505]: Posts
            - generic [ref=e506]: →
    - contentinfo [ref=e507]:
      - generic [ref=e508]:
        - navigation "Footer navigation" [ref=e509]:
          - link "Home" [ref=e510] [cursor=pointer]:
            - /url: /
          - link "Learn" [ref=e511] [cursor=pointer]:
            - /url: /learn-morse-code
          - link "Worksheets" [ref=e512] [cursor=pointer]:
            - /url: /morse-code-printable-chart
          - link "Sources" [ref=e513] [cursor=pointer]:
            - /url: /sources
          - link "Sitemap" [ref=e514] [cursor=pointer]:
            - /url: /sitemap
          - link "Privacy Policy" [ref=e515] [cursor=pointer]:
            - /url: /misc/privacy-policy
          - link "Terms of Service" [ref=e516] [cursor=pointer]:
            - /url: /misc/terms-of-service
          - link "Cookies Policy" [ref=e517] [cursor=pointer]:
            - /url: /misc/cookies-policy
          - link "Socials" [ref=e518] [cursor=pointer]:
            - /url: /misc/socials
          - link "About" [ref=e519] [cursor=pointer]:
            - /url: /about
        - generic [ref=e520]:
          - generic [ref=e521]: © 2025 - 2026 MorseWords ~ By Suhas Sunder
          - generic [ref=e522]: Fast, practical tools for translating, listening to, and practicing Morse code.
          - generic [ref=e523]: "-- .- -.. . / .-- .. - .... / 💖"
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
> 45 |   ).toBeVisible();
     |     ^ Error: expect(locator).toBeVisible() failed
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
  61 |   await expect(page.getByText("Some words are too long for the current grid and were left out.")).toBeVisible();
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