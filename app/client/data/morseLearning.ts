import { TEXT_TO_MORSE } from "~/client/components/shared/morseUtils";

export type ReferenceItem = {
  label: string;
  morse: string;
  description: string;
  example?: string;
};

export const LETTERS: ReferenceItem[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  .split("")
  .map((label) => ({
    label,
    morse: TEXT_TO_MORSE[label],
    description: `Letter ${label}`,
  }));

const DIGIT_NAMES = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
];

export const DIGITS: ReferenceItem[] = "0123456789"
  .split("")
  .map((label) => ({
    label,
    morse: TEXT_TO_MORSE[label],
    description: `Number ${DIGIT_NAMES[Number(label)]}`,
  }));

const punctuationDefinitions = [
  ["Period", ".", "Full stop used at the end of a sentence.", "END."],
  ["Comma", ",", "Comma separator inside a sentence.", "YES, COPY"],
  ["Question mark", "?", "Used for questions and uncertain copy.", "QTH?"],
  ["Exclamation mark", "!", "Used for emphasis in written text.", "STOP!"],
  ["Slash", "/", "Slash punctuation. This is different from / used as written word-separator notation.", "A/B"],
  ["Hyphen", "-", "Dash or hyphen inside a word or call sign.", "X-RAY"],
  ["Apostrophe", "'", "Apostrophe in contractions and names.", "DON'T"],
  ["Open parenthesis", "(", "Opening parenthesis.", "(NOTE"],
  ["Close parenthesis", ")", "Closing parenthesis.", "NOTE)"],
  ["Colon", ":", "Colon punctuation.", "TIME:"],
  ["Semicolon", ";", "Semicolon punctuation.", "COPY; WAIT"],
  ["Equals", "=", "Equals sign and a common break separator.", "A=B"],
  ["Plus", "+", "Plus sign; also overlaps with the AR prosign pattern.", "A+B"],
  ["At sign", "@", "At sign used in email-like text.", "NAME@SITE"],
  ["Ampersand", "&", "Ampersand punctuation.", "R&D"],
  ["Underscore", "_", "Underscore in code-like text.", "CALL_SIGN"],
  ["Quotation mark", '"', "Quotation mark punctuation.", '"SOS"'],
] as const;

export const PUNCTUATION: ReferenceItem[] = punctuationDefinitions.map(
  ([label, character, description, example]) => ({
    label,
    morse: TEXT_TO_MORSE[character],
    description,
    example,
  }),
);

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
