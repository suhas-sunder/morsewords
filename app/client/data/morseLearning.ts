export type ReferenceItem = {
  label: string;
  morse: string;
  description: string;
  example?: string;
};

export const LETTERS: ReferenceItem[] = [
  ["A", ".-", "Letter A"],
  ["B", "-...", "Letter B"],
  ["C", "-.-.", "Letter C"],
  ["D", "-..", "Letter D"],
  ["E", ".", "Letter E"],
  ["F", "..-.", "Letter F"],
  ["G", "--.", "Letter G"],
  ["H", "....", "Letter H"],
  ["I", "..", "Letter I"],
  ["J", ".---", "Letter J"],
  ["K", "-.-", "Letter K"],
  ["L", ".-..", "Letter L"],
  ["M", "--", "Letter M"],
  ["N", "-.", "Letter N"],
  ["O", "---", "Letter O"],
  ["P", ".--.", "Letter P"],
  ["Q", "--.-", "Letter Q"],
  ["R", ".-.", "Letter R"],
  ["S", "...", "Letter S"],
  ["T", "-", "Letter T"],
  ["U", "..-", "Letter U"],
  ["V", "...-", "Letter V"],
  ["W", ".--", "Letter W"],
  ["X", "-..-", "Letter X"],
  ["Y", "-.--", "Letter Y"],
  ["Z", "--..", "Letter Z"],
].map(([label, morse, description]) => ({ label, morse, description }));

export const DIGITS: ReferenceItem[] = [
  ["0", "-----", "Number zero"],
  ["1", ".----", "Number one"],
  ["2", "..---", "Number two"],
  ["3", "...--", "Number three"],
  ["4", "....-", "Number four"],
  ["5", ".....", "Number five"],
  ["6", "-....", "Number six"],
  ["7", "--...", "Number seven"],
  ["8", "---..", "Number eight"],
  ["9", "----.", "Number nine"],
].map(([label, morse, description]) => ({ label, morse, description }));

export const PUNCTUATION: ReferenceItem[] = [
  { label: "Period", morse: ".-.-.-", description: "Full stop used at the end of a sentence.", example: "END." },
  { label: "Comma", morse: "--..--", description: "Comma separator inside a sentence.", example: "YES, COPY" },
  { label: "Question mark", morse: "..--..", description: "Used for questions and uncertain copy.", example: "QTH?" },
  { label: "Slash", morse: "-..-.", description: "Commonly used as a word separator in written Morse.", example: "TEXT / MORSE" },
  { label: "Hyphen", morse: "-....-", description: "Dash or hyphen inside a word or call sign.", example: "X-RAY" },
  { label: "Apostrophe", morse: ".----.", description: "Apostrophe in contractions and names.", example: "DON'T" },
  { label: "Open parenthesis", morse: "-.--.", description: "Opening parenthesis.", example: "(NOTE" },
  { label: "Close parenthesis", morse: "-.--.-", description: "Closing parenthesis.", example: "NOTE)" },
  { label: "Colon", morse: "---...", description: "Colon punctuation.", example: "TIME:" },
  { label: "Semicolon", morse: "-.-.-.", description: "Semicolon punctuation.", example: "COPY; WAIT" },
  { label: "Equals", morse: "-...-", description: "Equals sign and a common break separator.", example: "A=B" },
  { label: "Plus", morse: ".-.-.", description: "Plus sign; also overlaps with the AR prosign pattern.", example: "A+B" },
  { label: "At sign", morse: ".--.-.", description: "At sign used in email-like text.", example: "NAME@SITE" },
  { label: "Quotation mark", morse: ".-..-.", description: "Quotation mark punctuation.", example: "\"SOS\"" },
];

export const PROSIGNS: ReferenceItem[] = [
  { label: "SOS", morse: "...---...", description: "Distress signal sent as one continuous pattern.", example: "Emergency distress" },
  { label: "AR", morse: ".-.-.", description: "End of message.", example: "Message complete" },
  { label: "SK", morse: "...-.-", description: "End of contact.", example: "Closing a contact" },
  { label: "BT", morse: "-...-", description: "Break or separator between thoughts.", example: "New section" },
  { label: "KN", morse: "-.--.", description: "Go only to the named station.", example: "Directed reply" },
  { label: "AS", morse: ".-...", description: "Wait or stand by.", example: "Pause traffic" },
  { label: "HH", morse: "........", description: "Error correction signal.", example: "Resend after mistake" },
  { label: "CT", morse: "-.-.-", description: "Start of transmission.", example: "Opening traffic" },
];

export const Q_CODES: ReferenceItem[] = [
  { label: "QTH", morse: "--.-   -   ....", description: "My location is / what is your location?", example: "QTH BOSTON" },
  { label: "QRM", morse: "--.-   .-.   --", description: "Interference from other stations.", example: "QRM HIGH" },
  { label: "QRN", morse: "--.-   .-.   -.", description: "Static or natural noise.", example: "QRN LOW" },
  { label: "QRS", morse: "--.-   .-.   ...", description: "Send more slowly.", example: "PSE QRS" },
  { label: "QRQ", morse: "--.-   .-.   --.-", description: "Send faster.", example: "QRQ?" },
  { label: "QSL", morse: "--.-   ...   .-..", description: "I acknowledge receipt / do you acknowledge?", example: "QSL 599" },
  { label: "QSO", morse: "--.-   ...   ---", description: "A radio contact or conversation.", example: "TNX QSO" },
  { label: "QSY", morse: "--.-   ...   -.--", description: "Change frequency.", example: "QSY 7050" },
  { label: "QRP", morse: "--.-   .-.   .--.", description: "Low power operation.", example: "QRP 5W" },
  { label: "QRT", morse: "--.-   .-.   -", description: "Stop sending or close station.", example: "QRT NOW" },
  { label: "QRV", morse: "--.-   .-.   ...-", description: "Ready to receive.", example: "QRV" },
  { label: "QRZ", morse: "--.-   .-.   --..", description: "Who is calling me?", example: "QRZ?" },
];

export const SOURCE_LINKS = [
  {
    title: "ITU-R Recommendation M.1677-1",
    href: "https://www.itu.int/rec/R-REC-M.1677-1-200910-I/",
    description:
      "International Morse code recommendation used as the main reference for code tables and operating signs.",
  },
  {
    title: "ARRL Learning Morse Code",
    href: "https://www.arrl.org/learning-morse-code",
    description:
      "Learning and practice context for CW, including common training approaches and amateur radio usage.",
  },
  {
    title: "ARRL Morse timing standard",
    href: "https://www.arrl.org/files/file/Technology/x9004008.pdf",
    description:
      "Timing discussion for Morse transmissions, including PARIS-based speed and Farnsworth timing.",
  },
  {
    title: "ARRL Tips for Learning Morse Code",
    href: "https://www.arrl.org/files/file/Morse/LearningMorseCode.pdf",
    description:
      "Training guidance that recommends learning characters as sound patterns and using Farnsworth spacing.",
  },
];

export const WORD_LISTS = {
  beginner: ["sos", "cq", "test", "help", "copy", "radio", "morse", "code", "dit", "dah"],
  classroom: ["teacher", "student", "signal", "listen", "answer", "practice", "worksheet", "puzzle"],
  radio: ["qth", "qsl", "qso", "rst", "name", "rig", "ant", "pwr", "qrp", "qrz"],
};

