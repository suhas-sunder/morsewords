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
      - button "Open navigation" [ref=e10] [cursor=pointer]
  - generic [ref=e16]:
    - main [ref=e18]:
      - generic [ref=e21]:
        - generic [ref=e22]:
          - generic [ref=e25]: Visual practice
          - heading "Visual Morse code practice" [level=1] [ref=e26]
          - paragraph [ref=e27]: Practice reading Morse as flashes instead of tones. Choose a short message, watch the bulb, then reveal the text and Morse when you are ready.
          - generic [ref=e29]:
            - link "Take visual quiz" [ref=e30] [cursor=pointer]:
              - /url: /morse-code-visual-quiz
            - link "Audio practice" [ref=e31] [cursor=pointer]:
              - /url: /morse-code-audio-practice
            - link "SOS signal" [ref=e32] [cursor=pointer]:
              - /url: /morse-code-sos
        - complementary [ref=e34]:
          - paragraph [ref=e35]: Flash mode
          - paragraph [ref=e36]: READY
          - generic [ref=e37]: Use short messages at first. Visual Morse is easiest when the spacing is clean and the message is not too long.
      - generic [ref=e39]:
        - generic [ref=e40]:
          - generic "Morse light off" [ref=e41]
          - button "Flash message Flash message" [active] [ref=e42] [cursor=pointer]:
            - img "Flash message" [ref=e43]
            - text: Flash message
        - generic [ref=e45]:
          - generic [ref=e46]:
            - text: Message
            - textbox "Message" [ref=e47]: sos
          - generic [ref=e48]:
            - generic [ref=e49]:
              - generic [ref=e50]:
                - generic [ref=e51]: Character speed
                - generic [ref=e52]: 14 WPM
              - slider [ref=e53] [cursor=pointer]: "14"
            - generic [ref=e54]:
              - generic [ref=e55]:
                - generic [ref=e56]: Farnsworth spacing
                - generic [ref=e57]: 10 WPM
              - paragraph [ref=e58]: Slows spacing only.
              - slider [ref=e59] [cursor=pointer]: "10"
          - button "Reveal answer Reveal answer" [ref=e60] [cursor=pointer]:
            - img "Reveal answer" [ref=e61]
            - text: Reveal answer
      - generic [ref=e63]:
        - generic [ref=e64]:
          - generic [ref=e65]:
            - generic [ref=e66]:
              - generic [ref=e69]: Visual practice spec
              - heading "How this visual Morse practice tool works" [level=2] [ref=e70]
              - paragraph [ref=e71]: Visual practice turns the Morse message into timed flashes. Character speed controls the flash lengths, and Farnsworth spacing stretches only the gaps so you have more time to recognize the next character.
            - generic [ref=e72]:
              - paragraph [ref=e73]: Flash signal
              - paragraph [ref=e74]: ... --- ...
              - paragraph [ref=e75]: Use short messages first. Clean spacing matters as much as the flashes.
          - navigation "Visual practice spec notes" [ref=e76]:
            - link "Message" [ref=e77] [cursor=pointer]:
              - /url: "#visual-practice-message"
            - link "Speed" [ref=e78] [cursor=pointer]:
              - /url: "#visual-practice-speed"
            - link "Farnsworth" [ref=e79] [cursor=pointer]:
              - /url: "#visual-practice-farnsworth"
            - link "Quiz next" [ref=e80] [cursor=pointer]:
              - /url: "#visual-practice-quiz"
        - generic [ref=e81]:
          - generic [ref=e82]:
            - generic [ref=e83]:
              - term [ref=e84]: Light-based copy
              - definition [ref=e85]: The page uses the same dots, dashes, and gaps, but renders them as flashes.
            - generic [ref=e86]:
              - term [ref=e87]: Stacked controls
              - definition [ref=e88]: Speed and Farnsworth settings are kept vertical so each slider is easy to read.
            - generic [ref=e89]:
              - term [ref=e90]: Answer reveal
              - definition [ref=e91]: Reveal the message only after watching the full flash sequence.
          - generic [ref=e92]:
            - generic [ref=e94]:
              - generic [ref=e95]:
                - paragraph [ref=e96]: Prompt setup
                - heading "Message" [level=3] [ref=e97]
              - paragraph [ref=e99]: Type a short word, Q-code, or phrase. The tool converts it to Morse and flashes the signal with standard dot, dash, letter-gap, and word-gap timing.
            - generic [ref=e101]:
              - generic [ref=e102]:
                - paragraph [ref=e103]: Flash length
                - heading "Speed" [level=3] [ref=e104]
              - paragraph [ref=e106]: Character speed controls how long each dit and dah stays on. Higher WPM means shorter flashes and a faster signal.
            - generic [ref=e108]:
              - generic [ref=e109]:
                - paragraph [ref=e110]: Learner gaps
                - heading "Farnsworth" [level=3] [ref=e111]
              - generic [ref=e112]:
                - paragraph [ref=e113]: Farnsworth spacing gives you more time between characters and words without changing the shape of each flashed character.
                - list [ref=e114]:
                  - listitem [ref=e115]: Use lower Farnsworth spacing for early practice.
                  - listitem [ref=e116]: Raise it as visual recall improves.
                  - listitem [ref=e117]: Keep messages short to avoid memory overload.
            - generic [ref=e119]:
              - generic [ref=e120]:
                - paragraph [ref=e121]: Test mode
                - heading "Quiz next" [level=3] [ref=e122]
              - paragraph [ref=e124]: The visual quiz uses the same speed and Farnsworth controls, but hides the prompt and tracks score, attempts, accuracy, and streaks.
      - generic [ref=e125]:
        - generic [ref=e128]:
          - generic [ref=e131]: Visual flow
          - heading "Practice flashes, then test recall" [level=2] [ref=e132]
        - generic [ref=e134]:
          - link "Visual quiz" [ref=e135] [cursor=pointer]:
            - /url: /morse-code-visual-quiz
          - link "Timing guide" [ref=e136] [cursor=pointer]:
            - /url: /morse-code-timing
          - link "Print review" [ref=e137] [cursor=pointer]:
            - /url: /morse-code-printable-chart
      - generic [ref=e138]:
        - generic [ref=e139]:
          - generic [ref=e142]: FAQ
          - heading "Visual practice FAQ" [level=2] [ref=e143]
        - generic [ref=e144]:
          - group [ref=e145]:
            - generic "> What is visual Morse practice?" [ref=e146] [cursor=pointer]:
              - generic [ref=e147]: ">"
              - generic [ref=e148]: What is visual Morse practice?
          - group [ref=e149]:
            - generic "> Why does visual practice include Farnsworth spacing?" [ref=e150] [cursor=pointer]:
              - generic [ref=e151]: ">"
              - generic [ref=e152]: Why does visual practice include Farnsworth spacing?
          - group [ref=e153]:
            - generic "> Should I use short messages?" [ref=e154] [cursor=pointer]:
              - generic [ref=e155]: ">"
              - generic [ref=e156]: Should I use short messages?
          - group [ref=e157]:
            - generic "> Is flashing light safe for everyone?" [ref=e158] [cursor=pointer]:
              - generic [ref=e159]: ">"
              - generic [ref=e160]: Is flashing light safe for everyone?
    - generic [ref=e161]:
      - generic [ref=e163]:
        - generic [ref=e164]:
          - generic [ref=e167]: Morse code navigation
          - heading "Explore the Morse code toolkit" [level=2] [ref=e168]
          - paragraph [ref=e169]: Jump between the translator, encoder, decoder, practice pages, printable charts, audio tools, and Morse code reference guides.
        - complementary [ref=e170]:
          - paragraph [ref=e171]: Quick access
          - generic [ref=e172]:
            - link "Translator Text ↔ Morse" [ref=e173] [cursor=pointer]:
              - /url: /
              - generic [ref=e174]: Translator
              - generic [ref=e175]: Text ↔ Morse
            - link "Practice Drills" [ref=e176] [cursor=pointer]:
              - /url: /practice
              - generic [ref=e177]: Practice
              - generic [ref=e178]: Drills
            - link "Printable chart Worksheets" [ref=e179] [cursor=pointer]:
              - /url: /morse-code-printable-chart
              - generic [ref=e180]: Printable chart
              - generic [ref=e181]: Worksheets
            - link "Audio Audio" [ref=e182] [cursor=pointer]:
              - /url: /audio
              - generic [ref=e183]: Audio
              - generic [ref=e184]: Audio
      - generic [ref=e186]:
        - generic [ref=e188]:
          - generic [ref=e189]:
            - paragraph [ref=e190]: Start here
            - heading "Core Morse tools" [level=3] [ref=e191]
            - paragraph [ref=e192]: Translate, encode, decode, and look up Morse code from the main learning tools.
            - paragraph [ref=e193]: 5 pages
          - generic [ref=e194]:
            - link "Morse Code Translator Main tool Convert text to Morse code and Morse code back to text. Open page" [ref=e195] [cursor=pointer]:
              - /url: /
              - generic [ref=e196]:
                - heading "Morse Code Translator" [level=4] [ref=e197]
                - generic [ref=e198]: Main tool
              - paragraph [ref=e199]: Convert text to Morse code and Morse code back to text.
              - generic [ref=e200]:
                - text: Open page
                - generic [ref=e201]: →
            - link "Morse Code Encoder Encode Turn regular text into clean Morse code output. Open page" [ref=e202] [cursor=pointer]:
              - /url: /morse-code-encoder
              - generic [ref=e203]:
                - heading "Morse Code Encoder" [level=4] [ref=e204]
                - generic [ref=e205]: Encode
              - paragraph [ref=e206]: Turn regular text into clean Morse code output.
              - generic [ref=e207]:
                - text: Open page
                - generic [ref=e208]: →
            - link "Morse Code Decoder Decode Decode dots, dashes, spaces, and separators into text. Open page" [ref=e209] [cursor=pointer]:
              - /url: /morse-code-decoder
              - generic [ref=e210]:
                - heading "Morse Code Decoder" [level=4] [ref=e211]
                - generic [ref=e212]: Decode
              - paragraph [ref=e213]: Decode dots, dashes, spaces, and separators into text.
              - generic [ref=e214]:
                - text: Open page
                - generic [ref=e215]: →
            - link "Morse Code Dictionary Reference Look up letters, numbers, punctuation, and common signals. Open page" [ref=e216] [cursor=pointer]:
              - /url: /dictionary
              - generic [ref=e217]:
                - heading "Morse Code Dictionary" [level=4] [ref=e218]
                - generic [ref=e219]: Reference
              - paragraph [ref=e220]: Look up letters, numbers, punctuation, and common signals.
              - generic [ref=e221]:
                - text: Open page
                - generic [ref=e222]: →
            - link "International Morse Reference Reference Browse letters, digits, punctuation, prosigns, Q-codes, and standards notes. Open page" [ref=e223] [cursor=pointer]:
              - /url: /international-morse-code-reference
              - generic [ref=e224]:
                - heading "International Morse Reference" [level=4] [ref=e225]
                - generic [ref=e226]: Reference
              - paragraph [ref=e227]: Browse letters, digits, punctuation, prosigns, Q-codes, and standards notes.
              - generic [ref=e228]:
                - text: Open page
                - generic [ref=e229]: →
        - generic [ref=e231]:
          - generic [ref=e232]:
            - paragraph [ref=e233]: Practice
            - heading "Learn by doing" [level=3] [ref=e234]
            - paragraph [ref=e235]: Use these pages for drills, typing practice, sentence work, and guided learning.
            - paragraph [ref=e236]: 8 pages
          - generic [ref=e237]:
            - link "Learn Morse Code Learn Follow a practical path through alphabet, words, audio, sentences, and worksheets. Open page" [ref=e238] [cursor=pointer]:
              - /url: /learn-morse-code
              - generic [ref=e239]:
                - heading "Learn Morse Code" [level=4] [ref=e240]
                - generic [ref=e241]: Learn
              - paragraph [ref=e242]: Follow a practical path through alphabet, words, audio, sentences, and worksheets.
              - generic [ref=e243]:
                - text: Open page
                - generic [ref=e244]: →
            - link "Practice Plan Plan Use a 2-week or 6-week routine across the MorseWords tools. Open page" [ref=e245] [cursor=pointer]:
              - /url: /morse-code-practice-plan
              - generic [ref=e246]:
                - heading "Practice Plan" [level=4] [ref=e247]
                - generic [ref=e248]: Plan
              - paragraph [ref=e249]: Use a 2-week or 6-week routine across the MorseWords tools.
              - generic [ref=e250]:
                - text: Open page
                - generic [ref=e251]: →
            - link "Morse Code Practice Practice Practice reading, writing, and recognizing Morse patterns. Open page" [ref=e252] [cursor=pointer]:
              - /url: /practice
              - generic [ref=e253]:
                - heading "Morse Code Practice" [level=4] [ref=e254]
                - generic [ref=e255]: Practice
              - paragraph [ref=e256]: Practice reading, writing, and recognizing Morse patterns.
              - generic [ref=e257]:
                - text: Open page
                - generic [ref=e258]: →
            - link "Morse Code Typing Typing Build speed and accuracy with typing-based Morse drills. Open page" [ref=e259] [cursor=pointer]:
              - /url: /typing
              - generic [ref=e260]:
                - heading "Morse Code Typing" [level=4] [ref=e261]
                - generic [ref=e262]: Typing
              - paragraph [ref=e263]: Build speed and accuracy with typing-based Morse drills.
              - generic [ref=e264]:
                - text: Open page
                - generic [ref=e265]: →
            - link "Sentence Practice Sentences Work with full sentence examples instead of single letters. Open page" [ref=e266] [cursor=pointer]:
              - /url: /morse-code-sentence-practice
              - generic [ref=e267]:
                - heading "Sentence Practice" [level=4] [ref=e268]
                - generic [ref=e269]: Sentences
              - paragraph [ref=e270]: Work with full sentence examples instead of single letters.
              - generic [ref=e271]:
                - text: Open page
                - generic [ref=e272]: →
            - link "Word Trainer Words Practice built-in and custom Morse word lists. Open page" [ref=e273] [cursor=pointer]:
              - /url: /morse-code-word-trainer
              - generic [ref=e274]:
                - heading "Word Trainer" [level=4] [ref=e275]
                - generic [ref=e276]: Words
              - paragraph [ref=e277]: Practice built-in and custom Morse word lists.
              - generic [ref=e278]:
                - text: Open page
                - generic [ref=e279]: →
            - link "Audio Practice Listen Practice copying Morse by ear with focused prompts. Open page" [ref=e280] [cursor=pointer]:
              - /url: /morse-code-audio-practice
              - generic [ref=e281]:
                - heading "Audio Practice" [level=4] [ref=e282]
                - generic [ref=e283]: Listen
              - paragraph [ref=e284]: Practice copying Morse by ear with focused prompts.
              - generic [ref=e285]:
                - text: Open page
                - generic [ref=e286]: →
            - link "Morse Code Words Words Practice common words and word-level Morse patterns. Open page" [ref=e287] [cursor=pointer]:
              - /url: /morse-code-words
              - generic [ref=e288]:
                - heading "Morse Code Words" [level=4] [ref=e289]
                - generic [ref=e290]: Words
              - paragraph [ref=e291]: Practice common words and word-level Morse patterns.
              - generic [ref=e292]:
                - text: Open page
                - generic [ref=e293]: →
        - generic [ref=e295]:
          - generic [ref=e296]:
            - paragraph [ref=e297]: Charts + audio
            - heading "Reference and output tools" [level=3] [ref=e298]
            - paragraph [ref=e299]: Print charts, hear Morse audio, and understand formatting rules used in Morse code.
            - paragraph [ref=e300]: 5 pages
          - generic [ref=e301]:
            - link "Morse Code Alphabet Alphabet View the full A-Z Morse code alphabet in one place. Open page" [ref=e302] [cursor=pointer]:
              - /url: /morse-code-alphabet
              - generic [ref=e303]:
                - heading "Morse Code Alphabet" [level=4] [ref=e304]
                - generic [ref=e305]: Alphabet
              - paragraph [ref=e306]: View the full A-Z Morse code alphabet in one place.
              - generic [ref=e307]:
                - text: Open page
                - generic [ref=e308]: →
            - link "Printable Morse Worksheets Worksheets Build printable charts, learner templates, and teacher-ready handouts. Open page" [ref=e309] [cursor=pointer]:
              - /url: /morse-code-printable-chart
              - generic [ref=e310]:
                - heading "Printable Morse Worksheets" [level=4] [ref=e311]
                - generic [ref=e312]: Worksheets
              - paragraph [ref=e313]: Build printable charts, learner templates, and teacher-ready handouts.
              - generic [ref=e314]:
                - text: Open page
                - generic [ref=e315]: →
            - link "Morse Code Audio Generator Listen Generate Morse audio for listening, practice, and downloadable clips. Open page" [ref=e316] [cursor=pointer]:
              - /url: /audio
              - generic [ref=e317]:
                - heading "Morse Code Audio Generator" [level=4] [ref=e318]
                - generic [ref=e319]: Listen
              - paragraph [ref=e320]: Generate Morse audio for listening, practice, and downloadable clips.
              - generic [ref=e321]:
                - text: Open page
                - generic [ref=e322]: →
            - link "Word Search Builder Puzzle Create printable Morse vocabulary puzzles from custom word lists. Open page" [ref=e323] [cursor=pointer]:
              - /url: /morse-code-word-search-builder
              - generic [ref=e324]:
                - heading "Word Search Builder" [level=4] [ref=e325]
                - generic [ref=e326]: Puzzle
              - paragraph [ref=e327]: Create printable Morse vocabulary puzzles from custom word lists.
              - generic [ref=e328]:
                - text: Open page
                - generic [ref=e329]: →
            - link "Morse Code Word Separator Formatting Understand spaces, slashes, and word breaks in pasted Morse. Open page" [ref=e330] [cursor=pointer]:
              - /url: /morse-code-word-separator
              - generic [ref=e331]:
                - heading "Morse Code Word Separator" [level=4] [ref=e332]
                - generic [ref=e333]: Formatting
              - paragraph [ref=e334]: Understand spaces, slashes, and word breaks in pasted Morse.
              - generic [ref=e335]:
                - text: Open page
                - generic [ref=e336]: →
        - generic [ref=e338]:
          - generic [ref=e339]:
            - paragraph [ref=e340]: Guides
            - heading "Helpful Morse code pages" [level=3] [ref=e341]
            - paragraph [ref=e342]: Extra pages for common examples, separators, and basic site guidance.
            - paragraph [ref=e343]: 10 pages
          - generic [ref=e344]:
            - link "Morse Code Timing Timing Understand dot, dash, WPM, PARIS, and spacing ratios. Open page" [ref=e345] [cursor=pointer]:
              - /url: /morse-code-timing
              - generic [ref=e346]:
                - heading "Morse Code Timing" [level=4] [ref=e347]
                - generic [ref=e348]: Timing
              - paragraph [ref=e349]: Understand dot, dash, WPM, PARIS, and spacing ratios.
              - generic [ref=e350]:
                - text: Open page
                - generic [ref=e351]: →
            - link "Farnsworth Timing Audio Learn character speed, effective speed, and learner spacing. Open page" [ref=e352] [cursor=pointer]:
              - /url: /farnsworth-timing
              - generic [ref=e353]:
                - heading "Farnsworth Timing" [level=4] [ref=e354]
                - generic [ref=e355]: Audio
              - paragraph [ref=e356]: Learn character speed, effective speed, and learner spacing.
              - generic [ref=e357]:
                - text: Open page
                - generic [ref=e358]: →
            - link "Morse Code Prosigns Signals Look up SOS, AR, SK, BT, KN, and other operating signs. Open page" [ref=e359] [cursor=pointer]:
              - /url: /morse-code-prosigns
              - generic [ref=e360]:
                - heading "Morse Code Prosigns" [level=4] [ref=e361]
                - generic [ref=e362]: Signals
              - paragraph [ref=e363]: Look up SOS, AR, SK, BT, KN, and other operating signs.
              - generic [ref=e364]:
                - text: Open page
                - generic [ref=e365]: →
            - link "Morse Code Q-Codes Q-code Browse common Q-codes with meanings and examples. Open page" [ref=e366] [cursor=pointer]:
              - /url: /morse-code-q-codes
              - generic [ref=e367]:
                - heading "Morse Code Q-Codes" [level=4] [ref=e368]
                - generic [ref=e369]: Q-code
              - paragraph [ref=e370]: Browse common Q-codes with meanings and examples.
              - generic [ref=e371]:
                - text: Open page
                - generic [ref=e372]: →
            - link "Morse Punctuation Symbols Find period, comma, question mark, slash, and symbols. Open page" [ref=e373] [cursor=pointer]:
              - /url: /morse-code-punctuation
              - generic [ref=e374]:
                - heading "Morse Punctuation" [level=4] [ref=e375]
                - generic [ref=e376]: Symbols
              - paragraph [ref=e377]: Find period, comma, question mark, slash, and symbols.
              - generic [ref=e378]:
                - text: Open page
                - generic [ref=e379]: →
            - link "How to Use Guide Learn how to use the Morse code tools effectively. Open page" [ref=e380] [cursor=pointer]:
              - /url: /how-to-use
              - generic [ref=e381]:
                - heading "How to Use" [level=4] [ref=e382]
                - generic [ref=e383]: Guide
              - paragraph [ref=e384]: Learn how to use the Morse code tools effectively.
              - generic [ref=e385]:
                - text: Open page
                - generic [ref=e386]: →
            - link "The Quick Brown Fox in Morse Code Example See a full pangram example converted into Morse code. Open page" [ref=e387] [cursor=pointer]:
              - /url: /the-quick-brown-fox-morse-code
              - generic [ref=e388]:
                - heading "The Quick Brown Fox in Morse Code" [level=4] [ref=e389]
                - generic [ref=e390]: Example
              - paragraph [ref=e391]: See a full pangram example converted into Morse code.
              - generic [ref=e392]:
                - text: Open page
                - generic [ref=e393]: →
            - link "Morse Code Word Separator Formatting Understand spacing, slashes, and word separation in Morse code. Open page" [ref=e394] [cursor=pointer]:
              - /url: /morse-code-word-separator
              - generic [ref=e395]:
                - heading "Morse Code Word Separator" [level=4] [ref=e396]
                - generic [ref=e397]: Formatting
              - paragraph [ref=e398]: Understand spacing, slashes, and word separation in Morse code.
              - generic [ref=e399]:
                - text: Open page
                - generic [ref=e400]: →
            - link "Sources Trust See the standards and references used by MorseWords pages. Open page" [ref=e401] [cursor=pointer]:
              - /url: /sources
              - generic [ref=e402]:
                - heading "Sources" [level=4] [ref=e403]
                - generic [ref=e404]: Trust
              - paragraph [ref=e405]: See the standards and references used by MorseWords pages.
              - generic [ref=e406]:
                - text: Open page
                - generic [ref=e407]: →
            - link "About Site info Learn more about the site and its Morse code tools. Open page" [ref=e408] [cursor=pointer]:
              - /url: /about
              - generic [ref=e409]:
                - heading "About" [level=4] [ref=e410]
                - generic [ref=e411]: Site info
              - paragraph [ref=e412]: Learn more about the site and its Morse code tools.
              - generic [ref=e413]:
                - text: Open page
                - generic [ref=e414]: →
  - generic [ref=e415]:
    - generic [ref=e417]:
      - generic [ref=e421]: MorseWords social links
      - list [ref=e423]:
        - listitem [ref=e424]:
          - link "Open MorseWords on Facebook" [ref=e425] [cursor=pointer]:
            - /url: https://www.facebook.com/profile.php?id=61566613301910
            - generic [ref=e427]:
              - generic [ref=e428]: Facebook
              - generic [ref=e429]: Updates
            - generic [ref=e430]: →
        - listitem [ref=e431]:
          - link "Open MorseWords on Twitter / X" [ref=e432] [cursor=pointer]:
            - /url: https://x.com/WordSkullGame
            - generic [ref=e434]:
              - generic [ref=e435]: Twitter / X
              - generic [ref=e436]: Short posts
            - generic [ref=e437]: →
        - listitem [ref=e438]:
          - link "Open MorseWords on Pinterest" [ref=e439] [cursor=pointer]:
            - /url: https://ca.pinterest.com/WordSkull
            - generic [ref=e441]:
              - generic [ref=e442]: Pinterest
              - generic [ref=e443]: Reference boards
            - generic [ref=e444]: →
        - listitem [ref=e445]:
          - link "Open MorseWords on LinkedIn" [ref=e446] [cursor=pointer]:
            - /url: https://www.linkedin.com/company/104154929/
            - generic [ref=e448]:
              - generic [ref=e449]: LinkedIn
              - generic [ref=e450]: Company page
            - generic [ref=e451]: →
        - listitem [ref=e452]:
          - link "Open MorseWords on Instructables" [ref=e453] [cursor=pointer]:
            - /url: https://www.instructables.com/member/SunderOrigami/
            - generic [ref=e455]:
              - generic [ref=e456]: Instructables
              - generic [ref=e457]: Guides
            - generic [ref=e458]: →
        - listitem [ref=e459]:
          - link "Open MorseWords on Reddit" [ref=e460] [cursor=pointer]:
            - /url: https://www.reddit.com/r/WordSkull/
            - generic [ref=e462]:
              - generic [ref=e463]: Reddit
              - generic [ref=e464]: Community
            - generic [ref=e465]: →
        - listitem [ref=e466]:
          - link "Open MorseWords on TikTok" [ref=e467] [cursor=pointer]:
            - /url: https://www.tiktok.com/@wordskull
            - generic [ref=e469]:
              - generic [ref=e470]: TikTok
              - generic [ref=e471]: Short videos
            - generic [ref=e472]: →
        - listitem [ref=e473]:
          - link "Open MorseWords on YouTube" [ref=e474] [cursor=pointer]:
            - /url: https://www.youtube.com/@WordSkullYT
            - generic [ref=e476]:
              - generic [ref=e477]: YouTube
              - generic [ref=e478]: Videos
            - generic [ref=e479]: →
        - listitem [ref=e480]:
          - link "Open MorseWords on Dev.to" [ref=e481] [cursor=pointer]:
            - /url: https://dev.to/productivitygarden
            - generic [ref=e483]:
              - generic [ref=e484]: Dev.to
              - generic [ref=e485]: Build notes
            - generic [ref=e486]: →
        - listitem [ref=e487]:
          - link "Open MorseWords on GitHub" [ref=e488] [cursor=pointer]:
            - /url: https://github.com/suhas-sunder/EmojiKitchenGame
            - generic [ref=e490]:
              - generic [ref=e491]: GitHub
              - generic [ref=e492]: Code
            - generic [ref=e493]: →
        - listitem [ref=e494]:
          - link "Open MorseWords on Instagram" [ref=e495] [cursor=pointer]:
            - /url: https://www.instagram.com/productivitygarden/
            - generic [ref=e497]:
              - generic [ref=e498]: Instagram
              - generic [ref=e499]: Posts
            - generic [ref=e500]: →
    - contentinfo [ref=e501]:
      - generic [ref=e502]:
        - navigation "Footer navigation" [ref=e503]:
          - link "Home" [ref=e504] [cursor=pointer]:
            - /url: /
          - link "Learn" [ref=e505] [cursor=pointer]:
            - /url: /learn-morse-code
          - link "Worksheets" [ref=e506] [cursor=pointer]:
            - /url: /morse-code-printable-chart
          - link "Sources" [ref=e507] [cursor=pointer]:
            - /url: /sources
          - link "Sitemap" [ref=e508] [cursor=pointer]:
            - /url: /sitemap
          - link "Privacy Policy" [ref=e509] [cursor=pointer]:
            - /url: /misc/privacy-policy
          - link "Terms of Service" [ref=e510] [cursor=pointer]:
            - /url: /misc/terms-of-service
          - link "Cookies Policy" [ref=e511] [cursor=pointer]:
            - /url: /misc/cookies-policy
          - link "Socials" [ref=e512] [cursor=pointer]:
            - /url: /misc/socials
          - link "About" [ref=e513] [cursor=pointer]:
            - /url: /about
        - generic [ref=e514]:
          - generic [ref=e515]: © 2025 - 2026 MorseWords ~ By Suhas Sunder
          - generic [ref=e516]: Fast, practical tools for translating, listening to, and practicing Morse code.
          - generic [ref=e517]: "-- .- -.. . / .-- .. - .... / 💖"
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