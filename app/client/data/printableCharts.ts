export const PRINTABLE_CHART_ASSET_BASE = "https://assets.morsewords.com/printable-charts";

export type PrintableChart = {
  id: string;
  key: string;
  url: string;
  title: string;
  description: string;
  alt: string;
  category: string;
  language?: string;
  note?: string;
  placements: readonly string[];
  referencePath: string;
  referenceLabel: string;
  width: number;
  height: number;
};

// Preserve the exact spelling and Unicode of the existing remote object keys.
const chartDefinitions: Omit<PrintableChart, "url">[] = [
  {
    "id": "timing-spacing",
    "key": "morse-code-timing-and-spacing-printable-chart.png",
    "title": "Timing and spacing",
    "description": "Compare the duration of dots, dashes, and the gaps that keep letters and words distinct.",
    "alt": "Timing and spacing printable chart with Morse patterns and reference notes",
    "category": "Timing and spacing",
    "note": "S–O–S shown as separate letters uses ordinary character gaps. The distress signal SOS is sent continuously as ...---... without those intercharacter gaps.",
    "placements": [
      "/morse-code-printable-chart",
      "/morse-code-timing"
    ],
    "referencePath": "/morse-code-timing",
    "referenceLabel": "Explore timing and spacing",
    "width": 1103,
    "height": 1426
  },
  {
    "id": "prosigns",
    "key": "morse-code-prosigns-and-procedural-signals-printable-chart.png",
    "title": "Prosigns and procedural signals",
    "description": "Keep common run-together signals beside your listening or operating notes.",
    "alt": "Prosigns and procedural signals printable chart with Morse patterns and reference notes",
    "category": "Radio and CW",
    "placements": [
      "/morse-code-printable-chart",
      "/morse-code-prosigns"
    ],
    "referencePath": "/morse-code-prosigns",
    "referenceLabel": "Explore prosigns and procedural signals",
    "width": 1102,
    "height": 1427
  },
  {
    "id": "pattern-families",
    "key": "morse-code-pattern-families-printable-chart.png",
    "title": "Morse code pattern families",
    "description": "Compare related letter patterns, then practise hearing the difference without the chart.",
    "alt": "Morse code pattern families printable chart with Morse patterns and reference notes",
    "category": "Learning and memory",
    "placements": [
      "/morse-code-printable-chart",
      "/learn-morse-code"
    ],
    "referencePath": "/learn-morse-code",
    "referenceLabel": "Explore learning and practice",
    "width": 1024,
    "height": 1536
  },
  {
    "id": "numbers-punctuation",
    "key": "morse-code-numbers-and-punctuation-chart.png",
    "title": "Numbers and punctuation",
    "description": "Look up digits and punctuation together when checking a date, number, or short message.",
    "alt": "Numbers and punctuation printable chart with Morse patterns and reference notes",
    "category": "Quick reference",
    "placements": [
      "/morse-code-printable-chart",
      "/morse-code-chart",
      "/morse-code-numbers",
      "/morse-code-punctuation"
    ],
    "referencePath": "/morse-code-chart",
    "referenceLabel": "Explore the interactive chart",
    "width": 1103,
    "height": 1426
  },
  {
    "id": "learning-order",
    "key": "morse-code-letters-learning-order-printable-chart.png",
    "title": "Morse code letter learning order",
    "description": "Use a suggested letter sequence to organize short recall sessions.",
    "alt": "Morse code letter learning order printable chart with Morse patterns and reference notes",
    "category": "Learning and memory",
    "placements": [
      "/morse-code-printable-chart",
      "/learn-morse-code"
    ],
    "referencePath": "/learn-morse-code",
    "referenceLabel": "Explore learning and practice",
    "width": 1103,
    "height": 1426
  },
  {
    "id": "letter-frequency",
    "key": "morse-code-letter-frequency-printable-chart.png",
    "title": "Morse code letter frequency",
    "description": "Explore letter frequency as a study aid alongside listening and recall practice.",
    "alt": "Morse code letter frequency printable chart with Morse patterns and reference notes",
    "category": "Learning and memory",
    "placements": [
      "/morse-code-printable-chart",
      "/learn-morse-code"
    ],
    "referencePath": "/learn-morse-code",
    "referenceLabel": "Explore learning and practice",
    "width": 1023,
    "height": 1537
  },
  {
    "id": "binary-tree",
    "key": "morse-code-binary-tree-printable-chart.png",
    "title": "Morse code binary tree",
    "description": "Follow dots and dashes through a branching letter reference to check a pattern.",
    "alt": "Morse code binary tree printable chart with Morse patterns and reference notes",
    "category": "Learning and memory",
    "placements": [
      "/morse-code-printable-chart",
      "/learn-morse-code"
    ],
    "referencePath": "/learn-morse-code",
    "referenceLabel": "Explore learning and practice",
    "width": 1103,
    "height": 1426
  },
  {
    "id": "beginner-alphabet",
    "key": "morse-code-alphabet-beginner-reference-chart-infographic.png",
    "title": "Beginner Morse code alphabet",
    "description": "Keep an A–Z reference nearby while you start matching letters with their rhythms.",
    "alt": "Beginner Morse code alphabet printable chart with Morse patterns and reference notes",
    "category": "Quick reference",
    "placements": [
      "/morse-code-printable-chart",
      "/morse-code-alphabet"
    ],
    "referencePath": "/morse-code-alphabet",
    "referenceLabel": "Explore beginner morse code alphabet",
    "width": 1103,
    "height": 1426
  },
  {
    "id": "international-reference",
    "key": "international-morse-code-chart-reference-guide-infographic.png",
    "title": "International Morse code reference guide",
    "description": "Print a general reference for checking Morse patterns during study or message writing.",
    "alt": "International Morse code reference guide printable chart with Morse patterns and reference notes",
    "category": "Quick reference",
    "placements": [
      "/morse-code-printable-chart",
      "/international-morse-code-reference"
    ],
    "referencePath": "/international-morse-code-reference",
    "referenceLabel": "Explore the International reference",
    "width": 1103,
    "height": 1426
  },
  {
    "id": "word-spacing",
    "key": "morse-code-word-spacing-rules-printable-chart.png",
    "title": "Morse code word spacing rules",
    "description": "Compare character and word gaps before copying or listening to a complete message.",
    "alt": "Morse code word spacing rules printable chart with Morse patterns and reference notes",
    "category": "Timing and spacing",
    "note": "S–O–S shown as separate letters uses ordinary character gaps. The distress signal SOS is sent continuously as ...---... without those intercharacter gaps.",
    "placements": [
      "/morse-code-printable-chart",
      "/morse-code-word-separator"
    ],
    "referencePath": "/morse-code-word-separator",
    "referenceLabel": "Explore morse code word spacing rules",
    "width": 1103,
    "height": 1426
  },
  {
    "id": "punctuation",
    "key": "morse-code-punctuation-printable-chart.png",
    "title": "Morse code punctuation",
    "description": "Check punctuation patterns separately from the slash used to display a word break.",
    "alt": "Morse code punctuation printable chart with Morse patterns and reference notes",
    "category": "Quick reference",
    "placements": [
      "/morse-code-printable-chart",
      "/morse-code-punctuation"
    ],
    "referencePath": "/morse-code-punctuation",
    "referenceLabel": "Explore morse code punctuation",
    "width": 1102,
    "height": 1427
  },
  {
    "id": "q-signals",
    "key": "morse-code-common-amateur-radio-q-signals-printable-chart.png",
    "title": "Common amateur radio Q-signals",
    "description": "Keep common Q-signals and their meanings beside your CW listening notes.",
    "alt": "Common amateur radio Q-signals printable chart with Morse patterns and reference notes",
    "category": "Radio and CW",
    "placements": [
      "/morse-code-printable-chart",
      "/morse-code-q-codes"
    ],
    "referencePath": "/morse-code-q-codes",
    "referenceLabel": "Explore common amateur radio q-signals",
    "width": 1024,
    "height": 1536
  },
  {
    "id": "nato-alphabet",
    "key": "morse-code-and-nato-phonetic-alphabet-printable-chart.png",
    "title": "Morse code and NATO phonetic alphabet",
    "description": "Compare Morse letters with spoken spelling words; these are two different ways to communicate letters.",
    "alt": "Morse code and NATO phonetic alphabet printable chart with Morse patterns and reference notes",
    "category": "Radio and CW",
    "placements": [
      "/morse-code-printable-chart",
      "/morse-code-amateur-radio-cw"
    ],
    "referencePath": "/morse-code-amateur-radio-cw",
    "referenceLabel": "Explore morse code and nato phonetic alphabet",
    "width": 1024,
    "height": 1536
  },
  {
    "id": "cw-abbreviations",
    "key": "morese-cod-cw-abbreviation-printable-chart.png",
    "title": "CW abbreviations",
    "description": "Look up common shorthand used in amateur radio CW exchanges.",
    "alt": "CW abbreviations printable chart with Morse patterns and reference notes",
    "category": "Radio and CW",
    "note": "RST means Readability, Signal Strength, Tone. “Signal” on the chart refers to signal strength.",
    "placements": [
      "/morse-code-printable-chart",
      "/morse-code-amateur-radio-cw"
    ],
    "referencePath": "/morse-code-amateur-radio-cw",
    "referenceLabel": "Explore cw abbreviations",
    "width": 1024,
    "height": 1536
  },
  {
    "id": "international-timing",
    "key": "international-morse-code-timing-printable-chart.png",
    "title": "International Morse code timing",
    "description": "Review the standard 1:3 mark lengths and the gaps used within and between characters.",
    "alt": "International Morse code timing printable chart with Morse patterns and reference notes",
    "category": "Timing and spacing",
    "note": "S–O–S shown as separate letters uses ordinary character gaps. The distress signal SOS is sent continuously as ...---... without those intercharacter gaps.",
    "placements": [
      "/morse-code-printable-chart",
      "/morse-code-timing"
    ],
    "referencePath": "/morse-code-timing",
    "referenceLabel": "Explore international morse code timing",
    "width": 1024,
    "height": 1536
  },
  {
    "id": "numbers",
    "key": "international-morse-code-numbers-printable-chart.png",
    "title": "International Morse code numbers",
    "description": "Compare the five-mark patterns for digits 0–9 on a dedicated number sheet.",
    "alt": "International Morse code numbers printable chart with Morse patterns and reference notes",
    "category": "Quick reference",
    "placements": [
      "/morse-code-printable-chart",
      "/morse-code-numbers"
    ],
    "referencePath": "/morse-code-numbers",
    "referenceLabel": "Explore international morse code numbers",
    "width": 1103,
    "height": 1426
  },
  {
    "id": "color-reference",
    "key": "color-coded-morse-code-quick-reference-chart.png",
    "title": "Color-coded Morse code quick reference",
    "description": "Use color to scan a compact reference while checking letters and other Morse patterns.",
    "alt": "Color-coded Morse code quick reference printable chart with Morse patterns and reference notes",
    "category": "Quick reference",
    "placements": [
      "/morse-code-printable-chart",
      "/morse-code-chart",
      "/morse-code-alphabet"
    ],
    "referencePath": "/morse-code-chart",
    "referenceLabel": "Explore the interactive chart",
    "width": 1102,
    "height": 1427
  },
  {
    "id": "german",
    "key": "international-morse-code-deustsches-morsealphabet-printable-chart.png",
    "title": "German Morse alphabet",
    "description": "Print a reference for German letters and traditional accented-letter extensions.",
    "alt": "German Morse alphabet printable chart with Morse patterns and reference notes",
    "category": "Latin letters and localized references",
    "language": "German",
    "note": "A localized reference that may include traditional extensions or transliteration conventions; it does not define a separate ITU alphabet.",
    "placements": [
      "/morse-code-by-language"
    ],
    "referencePath": "/morse-code-by-language",
    "referenceLabel": "Explore Morse by language",
    "width": 1023,
    "height": 1537
  },
  {
    "id": "french",
    "key": "international-morse-code-alphabet-morse-francais-printable-chart.png",
    "title": "French Morse alphabet",
    "description": "Print a reference for French letters and accented-letter conventions.",
    "alt": "French Morse alphabet printable chart with Morse patterns and reference notes",
    "category": "Latin letters and localized references",
    "language": "French",
    "note": "A localized reference that may include traditional extensions or transliteration conventions; it does not define a separate ITU alphabet.",
    "placements": [
      "/morse-code-by-language"
    ],
    "referencePath": "/morse-code-by-language",
    "referenceLabel": "Explore Morse by language",
    "width": 1024,
    "height": 1536
  },
  {
    "id": "portuguese",
    "key": "international-morse-code-alfabeto-morse-em-português-printable-chart.png",
    "title": "Portuguese Morse alphabet",
    "description": "Print a reference for Portuguese letters and local conventions.",
    "alt": "Portuguese Morse alphabet printable chart with Morse patterns and reference notes",
    "category": "Latin letters and localized references",
    "language": "Portuguese",
    "note": "A localized reference that may include traditional extensions or transliteration conventions; it does not define a separate ITU alphabet.",
    "placements": [
      "/morse-code-by-language"
    ],
    "referencePath": "/morse-code-by-language",
    "referenceLabel": "Explore Morse by language",
    "width": 1103,
    "height": 1426
  },
  {
    "id": "spanish",
    "key": "international-morse-code-alfabeto-morse-en-español-printable-chart.png",
    "title": "Spanish Morse alphabet",
    "description": "Print a reference for Spanish letters and traditional extensions.",
    "alt": "Spanish Morse alphabet printable chart with Morse patterns and reference notes",
    "category": "Latin letters and localized references",
    "language": "Spanish",
    "note": "A localized reference that may include traditional extensions or transliteration conventions; it does not define a separate ITU alphabet.",
    "placements": [
      "/morse-code-by-language"
    ],
    "referencePath": "/morse-code-by-language",
    "referenceLabel": "Explore Morse by language",
    "width": 1103,
    "height": 1426
  },
  {
    "id": "danish",
    "key": "international-morse-code-dansk-morsealfabet-printable-chart.png",
    "title": "Danish Morse alphabet",
    "description": "Print a reference for Danish letters and traditional extensions.",
    "alt": "Danish Morse alphabet printable chart with Morse patterns and reference notes",
    "category": "Latin letters and localized references",
    "language": "Danish",
    "note": "A localized reference that may include traditional extensions or transliteration conventions; it does not define a separate ITU alphabet.",
    "placements": [
      "/morse-code-by-language"
    ],
    "referencePath": "/morse-code-by-language",
    "referenceLabel": "Explore Morse by language",
    "width": 1024,
    "height": 1536
  },
  {
    "id": "norwegian",
    "key": "international-morse-code-norsk-morsealfabet-printable-chart.png",
    "title": "Norwegian Morse alphabet",
    "description": "Print a reference for Norwegian letters and traditional extensions.",
    "alt": "Norwegian Morse alphabet printable chart with Morse patterns and reference notes",
    "category": "Latin letters and localized references",
    "language": "Norwegian",
    "note": "A localized reference that may include traditional extensions or transliteration conventions; it does not define a separate ITU alphabet.",
    "placements": [
      "/morse-code-by-language"
    ],
    "referencePath": "/morse-code-by-language",
    "referenceLabel": "Explore Morse by language",
    "width": 1103,
    "height": 1426
  },
  {
    "id": "polish",
    "key": "international-morse-code-polski-alfabet-morse'a-printable-chart.png",
    "title": "Polish Morse alphabet",
    "description": "Print a reference for Polish letters and local conventions.",
    "alt": "Polish Morse alphabet printable chart with Morse patterns and reference notes",
    "category": "Latin letters and localized references",
    "language": "Polish",
    "note": "A localized reference that may include traditional extensions or transliteration conventions; it does not define a separate ITU alphabet.",
    "placements": [
      "/morse-code-by-language"
    ],
    "referencePath": "/morse-code-by-language",
    "referenceLabel": "Explore Morse by language",
    "width": 1024,
    "height": 1536
  },
  {
    "id": "finnish",
    "key": "international-morse-code-suomen-morseaakkoset-printable-chart.png",
    "title": "Finnish Morse alphabet",
    "description": "Print a reference for Finnish letters and local conventions.",
    "alt": "Finnish Morse alphabet printable chart with Morse patterns and reference notes",
    "category": "Latin letters and localized references",
    "language": "Finnish",
    "note": "A localized reference that may include traditional extensions or transliteration conventions; it does not define a separate ITU alphabet.",
    "placements": [
      "/morse-code-by-language"
    ],
    "referencePath": "/morse-code-by-language",
    "referenceLabel": "Explore Morse by language",
    "width": 1103,
    "height": 1426
  },
  {
    "id": "swedish",
    "key": "international-morse-code-svenska-morsealfabetet-printable-chart.png",
    "title": "Swedish Morse alphabet",
    "description": "Print a reference for Swedish letters and traditional extensions.",
    "alt": "Swedish Morse alphabet printable chart with Morse patterns and reference notes",
    "category": "Latin letters and localized references",
    "language": "Swedish",
    "note": "A localized reference that may include traditional extensions or transliteration conventions; it does not define a separate ITU alphabet.",
    "placements": [
      "/morse-code-by-language"
    ],
    "referencePath": "/morse-code-by-language",
    "referenceLabel": "Explore Morse by language",
    "width": 1023,
    "height": 1537
  },
  {
    "id": "korean",
    "key": "international-morse-code-한글-모스부호표-printable-chart.png",
    "title": "Korean Morse reference",
    "description": "Print a reference for Hangul-script Morse mappings.",
    "alt": "Korean Morse reference printable chart with Morse patterns and reference notes",
    "category": "East Asian scripts",
    "language": "Korean",
    "note": "A script-specific reference; these mappings are not the basic International Morse A–Z alphabet.",
    "placements": [
      "/morse-code-by-language"
    ],
    "referencePath": "/morse-code-by-language",
    "referenceLabel": "Explore Morse by language",
    "width": 1024,
    "height": 1535
  },
  {
    "id": "wabun",
    "key": "international-morse-code-和文モールス符号参考表-printable-chart.png",
    "title": "Japanese Wabun reference",
    "description": "Print a reference for kana patterns in the Japanese Wabun adaptation.",
    "alt": "Japanese Wabun reference printable chart with Morse patterns and reference notes",
    "category": "East Asian scripts",
    "language": "Japanese",
    "note": "A script-specific reference; these mappings are not the basic International Morse A–Z alphabet.",
    "placements": [
      "/morse-code-by-language",
      "/morse-code-by-language/japanese"
    ],
    "referencePath": "/morse-code-by-language/japanese",
    "referenceLabel": "Explore Japanese Morse",
    "width": 1103,
    "height": 1426
  },
  {
    "id": "japanese-study-sheet",
    "key": "japanese-morse-code-language-sheet.png",
    "title": "Japanese Morse study sheet",
    "description": "Print a reference for a side-by-side kana reference for listening practice.",
    "alt": "Japanese Morse study sheet printable chart with Morse patterns and reference notes",
    "category": "East Asian scripts",
    "language": "Japanese",
    "note": "A script-specific reference; these mappings are not the basic International Morse A–Z alphabet.",
    "placements": [
      "/morse-code-by-language",
      "/morse-code-by-language/japanese"
    ],
    "referencePath": "/morse-code-by-language/japanese",
    "referenceLabel": "Explore Japanese Morse",
    "width": 1632,
    "height": 2752
  },
  {
    "id": "arabic",
    "key": "international-morse-code-arabic-alphabet-printable-chart.png",
    "title": "Arabic Morse alphabet",
    "description": "Print a reference for Arabic-script Morse mappings.",
    "alt": "Arabic Morse alphabet printable chart with Morse patterns and reference notes",
    "category": "Arabic-script and Hebrew references",
    "language": "Arabic",
    "note": "A script-specific reference; these mappings are not the basic International Morse A–Z alphabet.",
    "placements": [
      "/morse-code-by-language"
    ],
    "referencePath": "/morse-code-by-language",
    "referenceLabel": "Explore Morse by language",
    "width": 1103,
    "height": 1426
  },
  {
    "id": "hebrew",
    "key": "international-morse-code-hebrew-alphabet-printable-chart.png",
    "title": "Hebrew Morse alphabet",
    "description": "Print a reference for Hebrew-script Morse mappings.",
    "alt": "Hebrew Morse alphabet printable chart with Morse patterns and reference notes",
    "category": "Arabic-script and Hebrew references",
    "language": "Hebrew",
    "note": "A script-specific reference; these mappings are not the basic International Morse A–Z alphabet.",
    "placements": [
      "/morse-code-by-language"
    ],
    "referencePath": "/morse-code-by-language",
    "referenceLabel": "Explore Morse by language",
    "width": 2550,
    "height": 3300
  },
  {
    "id": "hungarian",
    "key": "international-morse-code-hungarian-alphabet-printable-chart.png",
    "title": "Hungarian Morse alphabet",
    "description": "Print a reference for Hungarian letters and accented-letter conventions.",
    "alt": "Hungarian Morse alphabet printable chart with Morse patterns and reference notes",
    "category": "Latin letters and localized references",
    "language": "Hungarian",
    "note": "A localized reference that may include traditional extensions or transliteration conventions; it does not define a separate ITU alphabet.",
    "placements": [
      "/morse-code-by-language"
    ],
    "referencePath": "/morse-code-by-language",
    "referenceLabel": "Explore Morse by language",
    "width": 1103,
    "height": 1426
  },
  {
    "id": "persian",
    "key": "international-morse-code-persian-alphabet-printable-chart.png",
    "title": "Persian Morse alphabet",
    "description": "Print a reference for Persian-script Morse mappings.",
    "alt": "Persian Morse alphabet printable chart with Morse patterns and reference notes",
    "category": "Arabic-script and Hebrew references",
    "language": "Persian",
    "note": "A script-specific reference; these mappings are not the basic International Morse A–Z alphabet.",
    "placements": [
      "/morse-code-by-language"
    ],
    "referencePath": "/morse-code-by-language",
    "referenceLabel": "Explore Morse by language",
    "width": 1103,
    "height": 1426
  },
  {
    "id": "vietnamese",
    "key": "international-morse-code-vietnamese-alphabet-printable-chart.png",
    "title": "Vietnamese Morse reference",
    "description": "Print a reference for localized letter and transliteration conventions for Vietnamese.",
    "alt": "Vietnamese Morse reference printable chart with Morse patterns and reference notes",
    "category": "Latin letters and localized references",
    "language": "Vietnamese",
    "note": "A localized reference that may include traditional extensions or transliteration conventions; it does not define a separate ITU alphabet.",
    "placements": [
      "/morse-code-by-language"
    ],
    "referencePath": "/morse-code-by-language",
    "referenceLabel": "Explore Morse by language",
    "width": 2550,
    "height": 3300
  },
  {
    "id": "romanian",
    "key": "international-morse-code-alfabetul-morse-românesc-printable-chart.png",
    "title": "Romanian Morse alphabet",
    "description": "Print a reference for Romanian letters and local conventions.",
    "alt": "Romanian Morse alphabet printable chart with Morse patterns and reference notes",
    "category": "Latin letters and localized references",
    "language": "Romanian",
    "note": "A localized reference that may include traditional extensions or transliteration conventions; it does not define a separate ITU alphabet.",
    "placements": [
      "/morse-code-by-language"
    ],
    "referencePath": "/morse-code-by-language",
    "referenceLabel": "Explore Morse by language",
    "width": 1103,
    "height": 1426
  },
  {
    "id": "slovak",
    "key": "international-morse-code-Slovenská-Morseova-abeceda-printable-chart.png",
    "title": "Slovak Morse alphabet",
    "description": "Print a reference for Slovak letters and accented-letter conventions.",
    "alt": "Slovak Morse alphabet printable chart with Morse patterns and reference notes",
    "category": "Latin letters and localized references",
    "language": "Slovak",
    "note": "A localized reference that may include traditional extensions or transliteration conventions; it does not define a separate ITU alphabet.",
    "placements": [
      "/morse-code-by-language"
    ],
    "referencePath": "/morse-code-by-language",
    "referenceLabel": "Explore Morse by language",
    "width": 1102,
    "height": 1428
  },
  {
    "id": "turkish",
    "key": "international-morse-code-Türkçe-Mors-alfabesi-printable-chart.png",
    "title": "Turkish Morse alphabet",
    "description": "Print a reference for Turkish letters and local extensions.",
    "alt": "Turkish Morse alphabet printable chart with Morse patterns and reference notes",
    "category": "Latin letters and localized references",
    "language": "Turkish",
    "note": "A localized reference that may include traditional extensions or transliteration conventions; it does not define a separate ITU alphabet.",
    "placements": [
      "/morse-code-by-language"
    ],
    "referencePath": "/morse-code-by-language",
    "referenceLabel": "Explore Morse by language",
    "width": 1024,
    "height": 1536
  },
  {
    "id": "russian",
    "key": "international-morse-code-Русская-азбука-Морзе-руководство-printable-chart.png",
    "title": "Russian Cyrillic Morse reference",
    "description": "Print a reference for Cyrillic letter patterns alongside listening practice.",
    "alt": "Russian Cyrillic Morse reference printable chart with Morse patterns and reference notes",
    "category": "Cyrillic scripts",
    "language": "Russian",
    "note": "A script-specific reference; these mappings are not the basic International Morse A–Z alphabet.",
    "placements": [
      "/morse-code-by-language",
      "/morse-code-by-language/russian"
    ],
    "referencePath": "/morse-code-by-language/russian",
    "referenceLabel": "Explore Russian Morse",
    "width": 1103,
    "height": 1426
  },
  {
    "id": "ukrainian",
    "key": "international-morse-code-Українська-абетка-Морзе-інфографіка-printable-chart.png",
    "title": "Ukrainian Morse alphabet",
    "description": "Print a reference for Ukrainian Cyrillic Morse mappings.",
    "alt": "Ukrainian Morse alphabet printable chart with Morse patterns and reference notes",
    "category": "Cyrillic scripts",
    "language": "Ukrainian",
    "note": "A script-specific reference; these mappings are not the basic International Morse A–Z alphabet.",
    "placements": [
      "/morse-code-by-language"
    ],
    "referencePath": "/morse-code-by-language",
    "referenceLabel": "Explore Morse by language",
    "width": 1103,
    "height": 1426
  }
];

export const PRINTABLE_CHARTS: readonly PrintableChart[] = chartDefinitions.map((chart) => ({
  ...chart,
  placements: [...new Set(["/morse-code-printable-chart", ...chart.placements])],
  url: PRINTABLE_CHART_ASSET_BASE + "/" + encodeURIComponent(chart.key).replace(/\x27/g, "%27"),
}));

export function getPrintableChartsForPage(path: string) {
  return PRINTABLE_CHARTS.filter((chart) => chart.placements.includes(path));
}
