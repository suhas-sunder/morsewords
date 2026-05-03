# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: warnings-and-edge.spec.ts >> printable chart content limits are hidden until content is actually omitted
- Location: tests\break-the-app\warnings-and-edge.spec.ts:48:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Content limits')
Expected: visible
Timeout: 7500ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 7500ms
  - waiting for getByText('Content limits')

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
          - generic [ref=e25]: MorseWords
          - heading "Printable Morse Code Chart and Worksheet Builder" [level=1] [ref=e26]
          - paragraph [ref=e27]: Create a clean teacher-ready printable with student fields, answer key controls, own-message sections, branding, QR code, sharing, PDF export, and image exports.
          - generic [ref=e29]:
            - link "Build printable" [ref=e30] [cursor=pointer]:
              - /url: "#builder"
            - link "Word search" [ref=e31] [cursor=pointer]:
              - /url: /morse-code-word-search-builder
            - link "Practice plan" [ref=e32] [cursor=pointer]:
              - /url: /morse-code-practice-plan
        - complementary [ref=e34]:
          - paragraph [ref=e35]: Print defaults
          - paragraph [ref=e36]: PDF
          - paragraph [ref=e38]: Answer keys stay off until you include them.
      - generic [ref=e39]:
        - generic [ref=e40]:
          - generic [ref=e41]:
            - paragraph [ref=e42]: Worksheet settings
            - heading "Build the printable" [level=2] [ref=e43]
            - paragraph [ref=e44]: Start with a preset, then customize the classroom details, practice content, line counts, branding, scoring, and output. Settings are saved in this browser.
            - generic [ref=e45]:
              - button "Beginner" [ref=e46] [cursor=pointer]
              - button "Classroom" [ref=e47] [cursor=pointer]
              - button "Challenge" [ref=e48] [cursor=pointer]
              - button "Reset" [ref=e49] [cursor=pointer]
          - generic [ref=e50]:
            - heading "1. Output" [level=3] [ref=e51]
            - paragraph [ref=e52]: Choose what the teacher or learner gets when they print or export.
            - generic [ref=e53]:
              - generic [ref=e54]:
                - generic [ref=e55]:
                  - generic [ref=e56]: Print format
                  - combobox "Print format" [ref=e58] [cursor=pointer]:
                    - option "Worksheet + reference guide" [selected]
                    - option "Worksheet only"
                    - option "Reference guide only"
                - generic [ref=e59]:
                  - generic [ref=e60]: Worksheet difficulty
                  - combobox "Worksheet difficulty" [ref=e62] [cursor=pointer]:
                    - option "Beginner"
                    - option "Standard" [selected]
                    - option "Challenge"
              - generic [ref=e63]:
                - generic [ref=e64]: Worksheet title
                - textbox "Worksheet title" [ref=e66]:
                  - /placeholder: Morse Code Practice Sheet
                  - text: Morse Code Practice Sheet
          - generic [ref=e67]:
            - heading "2. Classroom details" [level=3] [ref=e68]
            - paragraph [ref=e69]: These fields appear at the top of the worksheet and reference guide.
            - generic [ref=e70]:
              - generic [ref=e71]:
                - generic [ref=e72]:
                  - generic [ref=e73]: Student name
                  - generic [ref=e74]: Optional.
                  - textbox "Student name Optional." [ref=e76]:
                    - /placeholder: Leave blank for students
                - generic [ref=e77]:
                  - generic [ref=e78]: Date
                  - generic [ref=e79]: Optional.
                  - textbox "Date Optional." [ref=e81]
                - generic [ref=e82]:
                  - generic [ref=e83]: Class or group
                  - generic [ref=e84]: Optional.
                  - textbox "Class or group Optional." [ref=e86]:
                    - /placeholder: Class, group, or lesson
                - generic [ref=e87]:
                  - generic [ref=e88]: Teacher name
                  - generic [ref=e89]: Optional.
                  - textbox "Teacher name Optional." [ref=e91]:
                    - /placeholder: Teacher or marker
              - generic [ref=e92]:
                - generic [ref=e93]: Student directions
                - generic [ref=e94]: Short instructions printed near the top of the worksheet.
                - textbox "Student directions Short instructions printed near the top of the worksheet." [ref=e96]: Use the chart to complete each section. Write neatly, keep spaces between Morse letters, and use a slash between words.
          - generic [ref=e97]:
            - heading "3. Practice content" [level=3] [ref=e98]
            - paragraph [ref=e99]: Use commas to separate items. Sentences stay intact and are not broken into words.
            - generic [ref=e100]:
              - generic [ref=e101]:
                - heading "Custom words" [level=4] [ref=e102]
                - paragraph [ref=e103]: "Add individual words separated by commas. Example: RADIO, SIGNAL, CODE, MORSE."
                - textbox "RADIO, SIGNAL, CODE, MORSE" [active] [ref=e105]: SOS, HELP, RADIO, SIGNAL, CODE, MORSE
              - generic [ref=e106]:
                - heading "Custom sentences" [level=4] [ref=e107]
                - paragraph [ref=e108]: Add full sentences separated by commas. Long sentences will print above the answer lines so the layout stays readable.
                - textbox "SEND HELP, LEARN MORSE, RADIO SIGNAL" [ref=e110]
          - generic [ref=e111]:
            - heading "4. Line counts" [level=3] [ref=e112]
            - paragraph [ref=e113]: Control how much writing space each section gets.
            - generic [ref=e115]:
              - generic [ref=e116]:
                - generic [ref=e117]: Decode answer lines
                - spinbutton "Decode answer lines" [ref=e119]: "1"
              - generic [ref=e120]:
                - generic [ref=e121]: Encode answer lines
                - spinbutton "Encode answer lines" [ref=e123]: "1"
              - generic [ref=e124]:
                - generic [ref=e125]: Sentence answer lines
                - spinbutton "Sentence answer lines" [ref=e127]: "2"
              - generic [ref=e128]:
                - generic [ref=e129]: Own message plain text lines
                - spinbutton "Own message plain text lines" [ref=e131]: "3"
              - generic [ref=e132]:
                - generic [ref=e133]: Own message Morse lines
                - spinbutton "Own message Morse lines" [ref=e135]: "4"
              - generic [ref=e136]:
                - generic [ref=e137]: Teacher feedback lines
                - spinbutton "Teacher feedback lines" [ref=e139]: "5"
          - generic [ref=e140]:
            - heading "5. Branding" [level=3] [ref=e141]
            - paragraph [ref=e142]: Use your own brand name and optional logo. The file name is not used as the brand name.
            - generic [ref=e143]:
              - generic [ref=e144]:
                - generic [ref=e145]: Brand name
                - generic [ref=e146]: Defaults to MorseWords. Maximum 60 characters including spaces.
                - textbox "Brand name Defaults to MorseWords. Maximum 60 characters including spaces." [ref=e148]:
                  - /placeholder: MorseWords
                  - text: MorseWords
              - generic [ref=e149]: 10/60 characters
              - generic [ref=e150]:
                - generic [ref=e151]: Upload custom logo
                - generic [ref=e152]: PNG, JPG, WEBP, or SVG works best. The logo appears beside the brand name.
                - button "Upload custom logo PNG, JPG, WEBP, or SVG works best. The logo appears beside the brand name." [ref=e154] [cursor=pointer]
          - generic [ref=e155]:
            - heading "6. Sections" [level=3] [ref=e156]
            - paragraph [ref=e157]: Control what appears on the final printable.
            - generic [ref=e159]:
              - generic [ref=e160] [cursor=pointer]:
                - generic [ref=e161]: Include student directions
                - checkbox "Include student directions" [checked] [ref=e162]
              - generic [ref=e163] [cursor=pointer]:
                - generic [ref=e164]: Include numbers
                - checkbox "Include numbers" [checked] [ref=e165]
              - generic [ref=e166] [cursor=pointer]:
                - generic [ref=e167]: Include punctuation
                - checkbox "Include punctuation" [checked] [ref=e168]
              - generic [ref=e169] [cursor=pointer]:
                - generic [ref=e170]: Include answer key as the last page
                - checkbox "Include answer key as the last page" [ref=e171]
              - generic [ref=e172] [cursor=pointer]:
                - generic [ref=e173]: Teacher scoring and feedback
                - checkbox "Teacher scoring and feedback" [checked] [ref=e174]
              - generic [ref=e175] [cursor=pointer]:
                - generic [ref=e176]: MorseWords QR on reference guide
                - checkbox "MorseWords QR on reference guide" [checked] [ref=e177]
        - complementary [ref=e178]:
          - generic [ref=e180]:
            - paragraph [ref=e181]: Output preview
            - heading "Worksheet + reference guide" [level=2] [ref=e182]
            - paragraph [ref=e183]: PDF is the default output. The answer key is off by default and, if enabled, prints as the final page.
          - generic [ref=e184]:
            - generic [ref=e185]:
              - generic [ref=e186]: Download format
              - combobox "Download format" [ref=e187] [cursor=pointer]:
                - option "PDF" [selected]
                - option "PNG image"
                - option "JPG image"
                - option "JPEG image"
                - option "WEBP image"
            - generic [ref=e188]:
              - button "Download printable Download PDF" [ref=e189] [cursor=pointer]:
                - img "Download printable" [ref=e190]
                - text: Download PDF
              - button "Share printable Share" [ref=e192] [cursor=pointer]:
                - img "Share printable" [ref=e193]
                - text: Share
            - paragraph [ref=e195]: PDF opens the browser print dialog so users can save as PDF or print.
          - generic [ref=e196]:
            - generic [ref=e197]:
              - generic [ref=e198]:
                - heading "Worksheet page" [level=3] [ref=e199]
                - generic [ref=e200]: Standard
              - generic [ref=e202]:
                - generic [ref=e203]: M
                - generic [ref=e204]:
                  - generic [ref=e205]: MorseWords
                  - generic [ref=e206]: Morse Code Practice Sheet
                  - generic [ref=e207]: Student name, date, class, and teacher fields included.
              - generic [ref=e208]:
                - generic [ref=e209]:
                  - strong [ref=e210]: SOS
                  - code [ref=e211]: ... --- ...
                - generic [ref=e212]:
                  - strong [ref=e213]: HELP
                  - code [ref=e214]: .... . .-.. .--.
                - generic [ref=e215]:
                  - strong [ref=e216]: RADIO
                  - code [ref=e217]: .-. .- -.. .. ---
                - generic [ref=e218]:
                  - strong [ref=e219]: SIGNAL
                  - code [ref=e220]: ... .. --. -. .- .-..
              - generic [ref=e221]:
                - strong [ref=e222]: "Sentences:"
                - text: SEND HELP · LEARN MORSE · RADIO SIGNAL
              - generic [ref=e223]:
                - strong [ref=e224]: "Own message fields:"
                - generic [ref=e225]: Plain text 3 lines, Morse 4 lines
            - generic [ref=e226]:
              - generic [ref=e227]:
                - heading "Reference guide page" [level=3] [ref=e228]
                - generic [ref=e229]: Included
              - generic [ref=e230]:
                - generic [ref=e231]:
                  - strong [ref=e232]: A
                  - code [ref=e233]: .-
                - generic [ref=e234]:
                  - strong [ref=e235]: B
                  - code [ref=e236]: "-..."
                - generic [ref=e237]:
                  - strong [ref=e238]: C
                  - code [ref=e239]: "-.-."
                - generic [ref=e240]:
                  - strong [ref=e241]: D
                  - code [ref=e242]: "-.."
                - generic [ref=e243]:
                  - strong [ref=e244]: E
                  - code [ref=e245]: .
                - generic [ref=e246]:
                  - strong [ref=e247]: F
                  - code [ref=e248]: ..-.
                - generic [ref=e249]:
                  - strong [ref=e250]: G
                  - code [ref=e251]: "--."
                - generic [ref=e252]:
                  - strong [ref=e253]: H
                  - code [ref=e254]: ....
                - generic [ref=e255]:
                  - strong [ref=e256]: I
                  - code [ref=e257]: ..
                - generic [ref=e258]:
                  - strong [ref=e259]: J
                  - code [ref=e260]: .---
                - generic [ref=e261]:
                  - strong [ref=e262]: K
                  - code [ref=e263]: "-.-"
                - generic [ref=e264]:
                  - strong [ref=e265]: L
                  - code [ref=e266]: .-..
                - generic [ref=e267]:
                  - strong [ref=e268]: M
                  - code [ref=e269]: "--"
                - generic [ref=e270]:
                  - strong [ref=e271]: "N"
                  - code [ref=e272]: "-."
                - generic [ref=e273]:
                  - strong [ref=e274]: O
                  - code [ref=e275]: "---"
          - generic [ref=e277]:
            - img "QR code to MorseWords" [ref=e278]
            - generic [ref=e279]:
              - strong [ref=e280]: QR appears on the reference guide
              - generic [ref=e281]: www.morsewords.com
      - generic [ref=e282]:
        - article [ref=e283]:
          - heading "Teacher-ready defaults" [level=2] [ref=e284]
          - paragraph [ref=e285]: Student name and date fields are built in, and the answer key is off by default so learners do not immediately see the solutions.
        - article [ref=e286]:
          - heading "Cleaner own-message section" [level=2] [ref=e287]
          - paragraph [ref=e288]: Learners now get one area for the original plain text and one area for the Morse version so teachers can judge the translation properly.
        - article [ref=e289]:
          - heading "PDF and image export" [level=2] [ref=e290]
          - paragraph [ref=e291]: PDF remains the default. Users can still switch to PNG, JPG, JPEG, or WEBP when they want image output instead.
      - generic [ref=e292]:
        - generic [ref=e293]:
          - heading "Letters A-Z" [level=2] [ref=e294]
          - paragraph [ref=e295]: The complete International Morse code alphabet for letters.
        - generic [ref=e296]:
          - article [ref=e297]:
            - generic [ref=e298]:
              - generic [ref=e299]:
                - generic [ref=e300]: Letter A
                - generic [ref=e301]: A
              - code [ref=e302]: .-
          - article [ref=e303]:
            - generic [ref=e304]:
              - generic [ref=e305]:
                - generic [ref=e306]: Letter B
                - generic [ref=e307]: B
              - code [ref=e308]: "-..."
          - article [ref=e309]:
            - generic [ref=e310]:
              - generic [ref=e311]:
                - generic [ref=e312]: Letter C
                - generic [ref=e313]: C
              - code [ref=e314]: "-.-."
          - article [ref=e315]:
            - generic [ref=e316]:
              - generic [ref=e317]:
                - generic [ref=e318]: Letter D
                - generic [ref=e319]: D
              - code [ref=e320]: "-.."
          - article [ref=e321]:
            - generic [ref=e322]:
              - generic [ref=e323]:
                - generic [ref=e324]: Letter E
                - generic [ref=e325]: E
              - code [ref=e326]: .
          - article [ref=e327]:
            - generic [ref=e328]:
              - generic [ref=e329]:
                - generic [ref=e330]: Letter F
                - generic [ref=e331]: F
              - code [ref=e332]: ..-.
          - article [ref=e333]:
            - generic [ref=e334]:
              - generic [ref=e335]:
                - generic [ref=e336]: Letter G
                - generic [ref=e337]: G
              - code [ref=e338]: "--."
          - article [ref=e339]:
            - generic [ref=e340]:
              - generic [ref=e341]:
                - generic [ref=e342]: Letter H
                - generic [ref=e343]: H
              - code [ref=e344]: ....
          - article [ref=e345]:
            - generic [ref=e346]:
              - generic [ref=e347]:
                - generic [ref=e348]: Letter I
                - generic [ref=e349]: I
              - code [ref=e350]: ..
          - article [ref=e351]:
            - generic [ref=e352]:
              - generic [ref=e353]:
                - generic [ref=e354]: Letter J
                - generic [ref=e355]: J
              - code [ref=e356]: .---
          - article [ref=e357]:
            - generic [ref=e358]:
              - generic [ref=e359]:
                - generic [ref=e360]: Letter K
                - generic [ref=e361]: K
              - code [ref=e362]: "-.-"
          - article [ref=e363]:
            - generic [ref=e364]:
              - generic [ref=e365]:
                - generic [ref=e366]: Letter L
                - generic [ref=e367]: L
              - code [ref=e368]: .-..
          - article [ref=e369]:
            - generic [ref=e370]:
              - generic [ref=e371]:
                - generic [ref=e372]: Letter M
                - generic [ref=e373]: M
              - code [ref=e374]: "--"
          - article [ref=e375]:
            - generic [ref=e376]:
              - generic [ref=e377]:
                - generic [ref=e378]: Letter N
                - generic [ref=e379]: "N"
              - code [ref=e380]: "-."
          - article [ref=e381]:
            - generic [ref=e382]:
              - generic [ref=e383]:
                - generic [ref=e384]: Letter O
                - generic [ref=e385]: O
              - code [ref=e386]: "---"
          - article [ref=e387]:
            - generic [ref=e388]:
              - generic [ref=e389]:
                - generic [ref=e390]: Letter P
                - generic [ref=e391]: P
              - code [ref=e392]: .--.
          - article [ref=e393]:
            - generic [ref=e394]:
              - generic [ref=e395]:
                - generic [ref=e396]: Letter Q
                - generic [ref=e397]: Q
              - code [ref=e398]: "--.-"
          - article [ref=e399]:
            - generic [ref=e400]:
              - generic [ref=e401]:
                - generic [ref=e402]: Letter R
                - generic [ref=e403]: R
              - code [ref=e404]: .-.
          - article [ref=e405]:
            - generic [ref=e406]:
              - generic [ref=e407]:
                - generic [ref=e408]: Letter S
                - generic [ref=e409]: S
              - code [ref=e410]: ...
          - article [ref=e411]:
            - generic [ref=e412]:
              - generic [ref=e413]:
                - generic [ref=e414]: Letter T
                - generic [ref=e415]: T
              - code [ref=e416]: "-"
          - article [ref=e417]:
            - generic [ref=e418]:
              - generic [ref=e419]:
                - generic [ref=e420]: Letter U
                - generic [ref=e421]: U
              - code [ref=e422]: ..-
          - article [ref=e423]:
            - generic [ref=e424]:
              - generic [ref=e425]:
                - generic [ref=e426]: Letter V
                - generic [ref=e427]: V
              - code [ref=e428]: ...-
          - article [ref=e429]:
            - generic [ref=e430]:
              - generic [ref=e431]:
                - generic [ref=e432]: Letter W
                - generic [ref=e433]: W
              - code [ref=e434]: .--
          - article [ref=e435]:
            - generic [ref=e436]:
              - generic [ref=e437]:
                - generic [ref=e438]: Letter X
                - generic [ref=e439]: X
              - code [ref=e440]: "-..-"
          - article [ref=e441]:
            - generic [ref=e442]:
              - generic [ref=e443]:
                - generic [ref=e444]: Letter Y
                - generic [ref=e445]: "Y"
              - code [ref=e446]: "-.--"
          - article [ref=e447]:
            - generic [ref=e448]:
              - generic [ref=e449]:
                - generic [ref=e450]: Letter Z
                - generic [ref=e451]: Z
              - code [ref=e452]: "--.."
      - generic [ref=e453]:
        - generic [ref=e454]:
          - heading "Numbers 0-9" [level=2] [ref=e455]
          - paragraph [ref=e456]: Standard Morse code number patterns for counting, call signs, and exercises.
        - generic [ref=e457]:
          - article [ref=e458]:
            - generic [ref=e459]:
              - generic [ref=e460]:
                - generic [ref=e461]: Number 0
                - generic [ref=e462]: "0"
              - code [ref=e463]: "-----"
          - article [ref=e464]:
            - generic [ref=e465]:
              - generic [ref=e466]:
                - generic [ref=e467]: Number 1
                - generic [ref=e468]: "1"
              - code [ref=e469]: .----
          - article [ref=e470]:
            - generic [ref=e471]:
              - generic [ref=e472]:
                - generic [ref=e473]: Number 2
                - generic [ref=e474]: "2"
              - code [ref=e475]: ..---
          - article [ref=e476]:
            - generic [ref=e477]:
              - generic [ref=e478]:
                - generic [ref=e479]: Number 3
                - generic [ref=e480]: "3"
              - code [ref=e481]: ...--
          - article [ref=e482]:
            - generic [ref=e483]:
              - generic [ref=e484]:
                - generic [ref=e485]: Number 4
                - generic [ref=e486]: "4"
              - code [ref=e487]: ....-
          - article [ref=e488]:
            - generic [ref=e489]:
              - generic [ref=e490]:
                - generic [ref=e491]: Number 5
                - generic [ref=e492]: "5"
              - code [ref=e493]: .....
          - article [ref=e494]:
            - generic [ref=e495]:
              - generic [ref=e496]:
                - generic [ref=e497]: Number 6
                - generic [ref=e498]: "6"
              - code [ref=e499]: "-...."
          - article [ref=e500]:
            - generic [ref=e501]:
              - generic [ref=e502]:
                - generic [ref=e503]: Number 7
                - generic [ref=e504]: "7"
              - code [ref=e505]: "--..."
          - article [ref=e506]:
            - generic [ref=e507]:
              - generic [ref=e508]:
                - generic [ref=e509]: Number 8
                - generic [ref=e510]: "8"
              - code [ref=e511]: "---.."
          - article [ref=e512]:
            - generic [ref=e513]:
              - generic [ref=e514]:
                - generic [ref=e515]: Number 9
                - generic [ref=e516]: "9"
              - code [ref=e517]: "----."
      - generic [ref=e518]:
        - generic [ref=e519]:
          - heading "Punctuation and characters" [level=2] [ref=e520]
          - paragraph [ref=e521]: Common punctuation and symbol entries supported by MorseWords.
        - generic [ref=e522]:
          - article [ref=e523]:
            - generic [ref=e524]:
              - generic [ref=e525]:
                - generic [ref=e526]: Period
                - generic [ref=e527]: .
              - code [ref=e528]: .-.-.-
          - article [ref=e529]:
            - generic [ref=e530]:
              - generic [ref=e531]:
                - generic [ref=e532]: Comma
                - generic [ref=e533]: ","
              - code [ref=e534]: "--..--"
          - article [ref=e535]:
            - generic [ref=e536]:
              - generic [ref=e537]:
                - generic [ref=e538]: Question mark
                - generic [ref=e539]: "?"
              - code [ref=e540]: ..--..
          - article [ref=e541]:
            - generic [ref=e542]:
              - generic [ref=e543]:
                - generic [ref=e544]: Slash
                - generic [ref=e545]: /
              - code [ref=e546]: "-..-."
          - article [ref=e547]:
            - generic [ref=e548]:
              - generic [ref=e549]:
                - generic [ref=e550]: Apostrophe
                - generic [ref=e551]: "'"
              - code [ref=e552]: .----.
          - article [ref=e553]:
            - generic [ref=e554]:
              - generic [ref=e555]:
                - generic [ref=e556]: Exclamation mark
                - generic [ref=e557]: "!"
              - code [ref=e558]: "-.-.--"
          - article [ref=e559]:
            - generic [ref=e560]:
              - generic [ref=e561]:
                - generic [ref=e562]: Hyphen
                - generic [ref=e563]: "-"
              - code [ref=e564]: "-....-"
          - article [ref=e565]:
            - generic [ref=e566]:
              - generic [ref=e567]:
                - generic [ref=e568]: At sign
                - generic [ref=e569]: "@"
              - code [ref=e570]: .--.-.
          - article [ref=e571]:
            - generic [ref=e572]:
              - generic [ref=e573]:
                - generic [ref=e574]: Colon
                - generic [ref=e575]: ":"
              - code [ref=e576]: "---..."
          - article [ref=e577]:
            - generic [ref=e578]:
              - generic [ref=e579]:
                - generic [ref=e580]: Semicolon
                - generic [ref=e581]: ;
              - code [ref=e582]: "-.-.-."
          - article [ref=e583]:
            - generic [ref=e584]:
              - generic [ref=e585]:
                - generic [ref=e586]: Equals
                - generic [ref=e587]: =
              - code [ref=e588]: "-...-"
          - article [ref=e589]:
            - generic [ref=e590]:
              - generic [ref=e591]:
                - generic [ref=e592]: Plus
                - generic [ref=e593]: +
              - code [ref=e594]: .-.-.
          - article [ref=e595]:
            - generic [ref=e596]:
              - generic [ref=e597]:
                - generic [ref=e598]: Quotation mark
                - generic [ref=e599]: "\""
              - code [ref=e600]: .-..-.
          - article [ref=e601]:
            - generic [ref=e602]:
              - generic [ref=e603]:
                - generic [ref=e604]: Open parenthesis
                - generic [ref=e605]: (
              - code [ref=e606]: "-.--."
          - article [ref=e607]:
            - generic [ref=e608]:
              - generic [ref=e609]:
                - generic [ref=e610]: Close parenthesis
                - generic [ref=e611]: )
              - code [ref=e612]: "-.--.-"
          - article [ref=e613]:
            - generic [ref=e614]:
              - generic [ref=e615]:
                - generic [ref=e616]: Ampersand
                - generic [ref=e617]: "&"
              - code [ref=e618]: .-...
          - article [ref=e619]:
            - generic [ref=e620]:
              - generic [ref=e621]:
                - generic [ref=e622]: Underscore
                - generic [ref=e623]: _
              - code [ref=e624]: ..--.-
      - generic [ref=e626]:
        - heading "How this printable works" [level=2] [ref=e627]
        - generic [ref=e628]:
          - generic [ref=e629]:
            - heading "Add comma-separated content" [level=3] [ref=e630]
            - paragraph [ref=e631]: Enter words and full sentences with commas between each item. Sentences stay intact in the worksheet.
          - generic [ref=e632]:
            - heading "Choose PDF or image" [level=3] [ref=e633]
            - paragraph [ref=e634]: PDF is the default. Switch the format selector when an image export is better for sharing or saving.
          - generic [ref=e635]:
            - heading "Return later" [level=3] [ref=e636]
            - paragraph [ref=e637]: The browser saves worksheet settings and preset snapshots with localStorage for future visits.
    - generic [ref=e638]:
      - generic [ref=e640]:
        - generic [ref=e641]:
          - generic [ref=e644]: Morse code navigation
          - heading "Explore the Morse code toolkit" [level=2] [ref=e645]
          - paragraph [ref=e646]: Jump between the translator, encoder, decoder, practice pages, printable charts, audio tools, and Morse code reference guides.
        - complementary [ref=e647]:
          - paragraph [ref=e648]: Quick access
          - generic [ref=e649]:
            - link "Translator Text ↔ Morse" [ref=e650] [cursor=pointer]:
              - /url: /
              - generic [ref=e651]: Translator
              - generic [ref=e652]: Text ↔ Morse
            - link "Practice Drills" [ref=e653] [cursor=pointer]:
              - /url: /practice
              - generic [ref=e654]: Practice
              - generic [ref=e655]: Drills
            - link "Printable chart Worksheets" [ref=e656] [cursor=pointer]:
              - /url: /morse-code-printable-chart
              - generic [ref=e657]: Printable chart
              - generic [ref=e658]: Worksheets
            - link "Audio Audio" [ref=e659] [cursor=pointer]:
              - /url: /audio
              - generic [ref=e660]: Audio
              - generic [ref=e661]: Audio
      - generic [ref=e663]:
        - generic [ref=e665]:
          - generic [ref=e666]:
            - paragraph [ref=e667]: Start here
            - heading "Core Morse tools" [level=3] [ref=e668]
            - paragraph [ref=e669]: Translate, encode, decode, and look up Morse code from the main learning tools.
            - paragraph [ref=e670]: 5 pages
          - generic [ref=e671]:
            - link "Morse Code Translator Main tool Convert text to Morse code and Morse code back to text. Open page" [ref=e672] [cursor=pointer]:
              - /url: /
              - generic [ref=e673]:
                - heading "Morse Code Translator" [level=4] [ref=e674]
                - generic [ref=e675]: Main tool
              - paragraph [ref=e676]: Convert text to Morse code and Morse code back to text.
              - generic [ref=e677]:
                - text: Open page
                - generic [ref=e678]: →
            - link "Morse Code Encoder Encode Turn regular text into clean Morse code output. Open page" [ref=e679] [cursor=pointer]:
              - /url: /morse-code-encoder
              - generic [ref=e680]:
                - heading "Morse Code Encoder" [level=4] [ref=e681]
                - generic [ref=e682]: Encode
              - paragraph [ref=e683]: Turn regular text into clean Morse code output.
              - generic [ref=e684]:
                - text: Open page
                - generic [ref=e685]: →
            - link "Morse Code Decoder Decode Decode dots, dashes, spaces, and separators into text. Open page" [ref=e686] [cursor=pointer]:
              - /url: /morse-code-decoder
              - generic [ref=e687]:
                - heading "Morse Code Decoder" [level=4] [ref=e688]
                - generic [ref=e689]: Decode
              - paragraph [ref=e690]: Decode dots, dashes, spaces, and separators into text.
              - generic [ref=e691]:
                - text: Open page
                - generic [ref=e692]: →
            - link "Morse Code Dictionary Reference Look up letters, numbers, punctuation, and common signals. Open page" [ref=e693] [cursor=pointer]:
              - /url: /dictionary
              - generic [ref=e694]:
                - heading "Morse Code Dictionary" [level=4] [ref=e695]
                - generic [ref=e696]: Reference
              - paragraph [ref=e697]: Look up letters, numbers, punctuation, and common signals.
              - generic [ref=e698]:
                - text: Open page
                - generic [ref=e699]: →
            - link "International Morse Reference Reference Browse letters, digits, punctuation, prosigns, Q-codes, and standards notes. Open page" [ref=e700] [cursor=pointer]:
              - /url: /international-morse-code-reference
              - generic [ref=e701]:
                - heading "International Morse Reference" [level=4] [ref=e702]
                - generic [ref=e703]: Reference
              - paragraph [ref=e704]: Browse letters, digits, punctuation, prosigns, Q-codes, and standards notes.
              - generic [ref=e705]:
                - text: Open page
                - generic [ref=e706]: →
        - generic [ref=e708]:
          - generic [ref=e709]:
            - paragraph [ref=e710]: Practice
            - heading "Learn by doing" [level=3] [ref=e711]
            - paragraph [ref=e712]: Use these pages for drills, typing practice, sentence work, and guided learning.
            - paragraph [ref=e713]: 8 pages
          - generic [ref=e714]:
            - link "Learn Morse Code Learn Follow a practical path through alphabet, words, audio, sentences, and worksheets. Open page" [ref=e715] [cursor=pointer]:
              - /url: /learn-morse-code
              - generic [ref=e716]:
                - heading "Learn Morse Code" [level=4] [ref=e717]
                - generic [ref=e718]: Learn
              - paragraph [ref=e719]: Follow a practical path through alphabet, words, audio, sentences, and worksheets.
              - generic [ref=e720]:
                - text: Open page
                - generic [ref=e721]: →
            - link "Practice Plan Plan Use a 2-week or 6-week routine across the MorseWords tools. Open page" [ref=e722] [cursor=pointer]:
              - /url: /morse-code-practice-plan
              - generic [ref=e723]:
                - heading "Practice Plan" [level=4] [ref=e724]
                - generic [ref=e725]: Plan
              - paragraph [ref=e726]: Use a 2-week or 6-week routine across the MorseWords tools.
              - generic [ref=e727]:
                - text: Open page
                - generic [ref=e728]: →
            - link "Morse Code Practice Practice Practice reading, writing, and recognizing Morse patterns. Open page" [ref=e729] [cursor=pointer]:
              - /url: /practice
              - generic [ref=e730]:
                - heading "Morse Code Practice" [level=4] [ref=e731]
                - generic [ref=e732]: Practice
              - paragraph [ref=e733]: Practice reading, writing, and recognizing Morse patterns.
              - generic [ref=e734]:
                - text: Open page
                - generic [ref=e735]: →
            - link "Morse Code Typing Typing Build speed and accuracy with typing-based Morse drills. Open page" [ref=e736] [cursor=pointer]:
              - /url: /typing
              - generic [ref=e737]:
                - heading "Morse Code Typing" [level=4] [ref=e738]
                - generic [ref=e739]: Typing
              - paragraph [ref=e740]: Build speed and accuracy with typing-based Morse drills.
              - generic [ref=e741]:
                - text: Open page
                - generic [ref=e742]: →
            - link "Sentence Practice Sentences Work with full sentence examples instead of single letters. Open page" [ref=e743] [cursor=pointer]:
              - /url: /morse-code-sentence-practice
              - generic [ref=e744]:
                - heading "Sentence Practice" [level=4] [ref=e745]
                - generic [ref=e746]: Sentences
              - paragraph [ref=e747]: Work with full sentence examples instead of single letters.
              - generic [ref=e748]:
                - text: Open page
                - generic [ref=e749]: →
            - link "Word Trainer Words Practice built-in and custom Morse word lists. Open page" [ref=e750] [cursor=pointer]:
              - /url: /morse-code-word-trainer
              - generic [ref=e751]:
                - heading "Word Trainer" [level=4] [ref=e752]
                - generic [ref=e753]: Words
              - paragraph [ref=e754]: Practice built-in and custom Morse word lists.
              - generic [ref=e755]:
                - text: Open page
                - generic [ref=e756]: →
            - link "Audio Practice Listen Practice copying Morse by ear with focused prompts. Open page" [ref=e757] [cursor=pointer]:
              - /url: /morse-code-audio-practice
              - generic [ref=e758]:
                - heading "Audio Practice" [level=4] [ref=e759]
                - generic [ref=e760]: Listen
              - paragraph [ref=e761]: Practice copying Morse by ear with focused prompts.
              - generic [ref=e762]:
                - text: Open page
                - generic [ref=e763]: →
            - link "Morse Code Words Words Practice common words and word-level Morse patterns. Open page" [ref=e764] [cursor=pointer]:
              - /url: /morse-code-words
              - generic [ref=e765]:
                - heading "Morse Code Words" [level=4] [ref=e766]
                - generic [ref=e767]: Words
              - paragraph [ref=e768]: Practice common words and word-level Morse patterns.
              - generic [ref=e769]:
                - text: Open page
                - generic [ref=e770]: →
        - generic [ref=e772]:
          - generic [ref=e773]:
            - paragraph [ref=e774]: Charts + audio
            - heading "Reference and output tools" [level=3] [ref=e775]
            - paragraph [ref=e776]: Print charts, hear Morse audio, and understand formatting rules used in Morse code.
            - paragraph [ref=e777]: 5 pages
          - generic [ref=e778]:
            - link "Morse Code Alphabet Alphabet View the full A-Z Morse code alphabet in one place. Open page" [ref=e779] [cursor=pointer]:
              - /url: /morse-code-alphabet
              - generic [ref=e780]:
                - heading "Morse Code Alphabet" [level=4] [ref=e781]
                - generic [ref=e782]: Alphabet
              - paragraph [ref=e783]: View the full A-Z Morse code alphabet in one place.
              - generic [ref=e784]:
                - text: Open page
                - generic [ref=e785]: →
            - link "Printable Morse Worksheets Worksheets Build printable charts, learner templates, and teacher-ready handouts. Open page" [ref=e786] [cursor=pointer]:
              - /url: /morse-code-printable-chart
              - generic [ref=e787]:
                - heading "Printable Morse Worksheets" [level=4] [ref=e788]
                - generic [ref=e789]: Worksheets
              - paragraph [ref=e790]: Build printable charts, learner templates, and teacher-ready handouts.
              - generic [ref=e791]:
                - text: Open page
                - generic [ref=e792]: →
            - link "Morse Code Audio Generator Listen Generate Morse audio for listening, practice, and downloadable clips. Open page" [ref=e793] [cursor=pointer]:
              - /url: /audio
              - generic [ref=e794]:
                - heading "Morse Code Audio Generator" [level=4] [ref=e795]
                - generic [ref=e796]: Listen
              - paragraph [ref=e797]: Generate Morse audio for listening, practice, and downloadable clips.
              - generic [ref=e798]:
                - text: Open page
                - generic [ref=e799]: →
            - link "Word Search Builder Puzzle Create printable Morse vocabulary puzzles from custom word lists. Open page" [ref=e800] [cursor=pointer]:
              - /url: /morse-code-word-search-builder
              - generic [ref=e801]:
                - heading "Word Search Builder" [level=4] [ref=e802]
                - generic [ref=e803]: Puzzle
              - paragraph [ref=e804]: Create printable Morse vocabulary puzzles from custom word lists.
              - generic [ref=e805]:
                - text: Open page
                - generic [ref=e806]: →
            - link "Morse Code Word Separator Formatting Understand spaces, slashes, and word breaks in pasted Morse. Open page" [ref=e807] [cursor=pointer]:
              - /url: /morse-code-word-separator
              - generic [ref=e808]:
                - heading "Morse Code Word Separator" [level=4] [ref=e809]
                - generic [ref=e810]: Formatting
              - paragraph [ref=e811]: Understand spaces, slashes, and word breaks in pasted Morse.
              - generic [ref=e812]:
                - text: Open page
                - generic [ref=e813]: →
        - generic [ref=e815]:
          - generic [ref=e816]:
            - paragraph [ref=e817]: Guides
            - heading "Helpful Morse code pages" [level=3] [ref=e818]
            - paragraph [ref=e819]: Extra pages for common examples, separators, and basic site guidance.
            - paragraph [ref=e820]: 10 pages
          - generic [ref=e821]:
            - link "Morse Code Timing Timing Understand dot, dash, WPM, PARIS, and spacing ratios. Open page" [ref=e822] [cursor=pointer]:
              - /url: /morse-code-timing
              - generic [ref=e823]:
                - heading "Morse Code Timing" [level=4] [ref=e824]
                - generic [ref=e825]: Timing
              - paragraph [ref=e826]: Understand dot, dash, WPM, PARIS, and spacing ratios.
              - generic [ref=e827]:
                - text: Open page
                - generic [ref=e828]: →
            - link "Farnsworth Timing Audio Learn character speed, effective speed, and learner spacing. Open page" [ref=e829] [cursor=pointer]:
              - /url: /farnsworth-timing
              - generic [ref=e830]:
                - heading "Farnsworth Timing" [level=4] [ref=e831]
                - generic [ref=e832]: Audio
              - paragraph [ref=e833]: Learn character speed, effective speed, and learner spacing.
              - generic [ref=e834]:
                - text: Open page
                - generic [ref=e835]: →
            - link "Morse Code Prosigns Signals Look up SOS, AR, SK, BT, KN, and other operating signs. Open page" [ref=e836] [cursor=pointer]:
              - /url: /morse-code-prosigns
              - generic [ref=e837]:
                - heading "Morse Code Prosigns" [level=4] [ref=e838]
                - generic [ref=e839]: Signals
              - paragraph [ref=e840]: Look up SOS, AR, SK, BT, KN, and other operating signs.
              - generic [ref=e841]:
                - text: Open page
                - generic [ref=e842]: →
            - link "Morse Code Q-Codes Q-code Browse common Q-codes with meanings and examples. Open page" [ref=e843] [cursor=pointer]:
              - /url: /morse-code-q-codes
              - generic [ref=e844]:
                - heading "Morse Code Q-Codes" [level=4] [ref=e845]
                - generic [ref=e846]: Q-code
              - paragraph [ref=e847]: Browse common Q-codes with meanings and examples.
              - generic [ref=e848]:
                - text: Open page
                - generic [ref=e849]: →
            - link "Morse Punctuation Symbols Find period, comma, question mark, slash, and symbols. Open page" [ref=e850] [cursor=pointer]:
              - /url: /morse-code-punctuation
              - generic [ref=e851]:
                - heading "Morse Punctuation" [level=4] [ref=e852]
                - generic [ref=e853]: Symbols
              - paragraph [ref=e854]: Find period, comma, question mark, slash, and symbols.
              - generic [ref=e855]:
                - text: Open page
                - generic [ref=e856]: →
            - link "How to Use Guide Learn how to use the Morse code tools effectively. Open page" [ref=e857] [cursor=pointer]:
              - /url: /how-to-use
              - generic [ref=e858]:
                - heading "How to Use" [level=4] [ref=e859]
                - generic [ref=e860]: Guide
              - paragraph [ref=e861]: Learn how to use the Morse code tools effectively.
              - generic [ref=e862]:
                - text: Open page
                - generic [ref=e863]: →
            - link "The Quick Brown Fox in Morse Code Example See a full pangram example converted into Morse code. Open page" [ref=e864] [cursor=pointer]:
              - /url: /the-quick-brown-fox-morse-code
              - generic [ref=e865]:
                - heading "The Quick Brown Fox in Morse Code" [level=4] [ref=e866]
                - generic [ref=e867]: Example
              - paragraph [ref=e868]: See a full pangram example converted into Morse code.
              - generic [ref=e869]:
                - text: Open page
                - generic [ref=e870]: →
            - link "Morse Code Word Separator Formatting Understand spacing, slashes, and word separation in Morse code. Open page" [ref=e871] [cursor=pointer]:
              - /url: /morse-code-word-separator
              - generic [ref=e872]:
                - heading "Morse Code Word Separator" [level=4] [ref=e873]
                - generic [ref=e874]: Formatting
              - paragraph [ref=e875]: Understand spacing, slashes, and word separation in Morse code.
              - generic [ref=e876]:
                - text: Open page
                - generic [ref=e877]: →
            - link "Sources Trust See the standards and references used by MorseWords pages. Open page" [ref=e878] [cursor=pointer]:
              - /url: /sources
              - generic [ref=e879]:
                - heading "Sources" [level=4] [ref=e880]
                - generic [ref=e881]: Trust
              - paragraph [ref=e882]: See the standards and references used by MorseWords pages.
              - generic [ref=e883]:
                - text: Open page
                - generic [ref=e884]: →
            - link "About Site info Learn more about the site and its Morse code tools. Open page" [ref=e885] [cursor=pointer]:
              - /url: /about
              - generic [ref=e886]:
                - heading "About" [level=4] [ref=e887]
                - generic [ref=e888]: Site info
              - paragraph [ref=e889]: Learn more about the site and its Morse code tools.
              - generic [ref=e890]:
                - text: Open page
                - generic [ref=e891]: →
  - generic [ref=e892]:
    - generic [ref=e894]:
      - generic [ref=e898]: MorseWords social links
      - list [ref=e900]:
        - listitem [ref=e901]:
          - link "Open MorseWords on Facebook" [ref=e902] [cursor=pointer]:
            - /url: https://www.facebook.com/profile.php?id=61566613301910
            - generic [ref=e904]:
              - generic [ref=e905]: Facebook
              - generic [ref=e906]: Updates
            - generic [ref=e907]: →
        - listitem [ref=e908]:
          - link "Open MorseWords on Twitter / X" [ref=e909] [cursor=pointer]:
            - /url: https://x.com/WordSkullGame
            - generic [ref=e911]:
              - generic [ref=e912]: Twitter / X
              - generic [ref=e913]: Short posts
            - generic [ref=e914]: →
        - listitem [ref=e915]:
          - link "Open MorseWords on Pinterest" [ref=e916] [cursor=pointer]:
            - /url: https://ca.pinterest.com/WordSkull
            - generic [ref=e918]:
              - generic [ref=e919]: Pinterest
              - generic [ref=e920]: Reference boards
            - generic [ref=e921]: →
        - listitem [ref=e922]:
          - link "Open MorseWords on LinkedIn" [ref=e923] [cursor=pointer]:
            - /url: https://www.linkedin.com/company/104154929/
            - generic [ref=e925]:
              - generic [ref=e926]: LinkedIn
              - generic [ref=e927]: Company page
            - generic [ref=e928]: →
        - listitem [ref=e929]:
          - link "Open MorseWords on Instructables" [ref=e930] [cursor=pointer]:
            - /url: https://www.instructables.com/member/SunderOrigami/
            - generic [ref=e932]:
              - generic [ref=e933]: Instructables
              - generic [ref=e934]: Guides
            - generic [ref=e935]: →
        - listitem [ref=e936]:
          - link "Open MorseWords on Reddit" [ref=e937] [cursor=pointer]:
            - /url: https://www.reddit.com/r/WordSkull/
            - generic [ref=e939]:
              - generic [ref=e940]: Reddit
              - generic [ref=e941]: Community
            - generic [ref=e942]: →
        - listitem [ref=e943]:
          - link "Open MorseWords on TikTok" [ref=e944] [cursor=pointer]:
            - /url: https://www.tiktok.com/@wordskull
            - generic [ref=e946]:
              - generic [ref=e947]: TikTok
              - generic [ref=e948]: Short videos
            - generic [ref=e949]: →
        - listitem [ref=e950]:
          - link "Open MorseWords on YouTube" [ref=e951] [cursor=pointer]:
            - /url: https://www.youtube.com/@WordSkullYT
            - generic [ref=e953]:
              - generic [ref=e954]: YouTube
              - generic [ref=e955]: Videos
            - generic [ref=e956]: →
        - listitem [ref=e957]:
          - link "Open MorseWords on Dev.to" [ref=e958] [cursor=pointer]:
            - /url: https://dev.to/productivitygarden
            - generic [ref=e960]:
              - generic [ref=e961]: Dev.to
              - generic [ref=e962]: Build notes
            - generic [ref=e963]: →
        - listitem [ref=e964]:
          - link "Open MorseWords on GitHub" [ref=e965] [cursor=pointer]:
            - /url: https://github.com/suhas-sunder/EmojiKitchenGame
            - generic [ref=e967]:
              - generic [ref=e968]: GitHub
              - generic [ref=e969]: Code
            - generic [ref=e970]: →
        - listitem [ref=e971]:
          - link "Open MorseWords on Instagram" [ref=e972] [cursor=pointer]:
            - /url: https://www.instagram.com/productivitygarden/
            - generic [ref=e974]:
              - generic [ref=e975]: Instagram
              - generic [ref=e976]: Posts
            - generic [ref=e977]: →
    - contentinfo [ref=e978]:
      - generic [ref=e979]:
        - navigation "Footer navigation" [ref=e980]:
          - link "Home" [ref=e981] [cursor=pointer]:
            - /url: /
          - link "Learn" [ref=e982] [cursor=pointer]:
            - /url: /learn-morse-code
          - link "Worksheets" [ref=e983] [cursor=pointer]:
            - /url: /morse-code-printable-chart
          - link "Sources" [ref=e984] [cursor=pointer]:
            - /url: /sources
          - link "Sitemap" [ref=e985] [cursor=pointer]:
            - /url: /sitemap
          - link "Privacy Policy" [ref=e986] [cursor=pointer]:
            - /url: /misc/privacy-policy
          - link "Terms of Service" [ref=e987] [cursor=pointer]:
            - /url: /misc/terms-of-service
          - link "Cookies Policy" [ref=e988] [cursor=pointer]:
            - /url: /misc/cookies-policy
          - link "Socials" [ref=e989] [cursor=pointer]:
            - /url: /misc/socials
          - link "About" [ref=e990] [cursor=pointer]:
            - /url: /about
        - generic [ref=e991]:
          - generic [ref=e992]: © 2025 - 2026 MorseWords ~ By Suhas Sunder
          - generic [ref=e993]: Fast, practical tools for translating, listening to, and practicing Morse code.
          - generic [ref=e994]: "-- .- -.. . / .-- .. - .... / 💖"
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
> 54 |   await expect(page.getByText("Content limits")).toBeVisible();
     |                                                  ^ Error: expect(locator).toBeVisible() failed
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