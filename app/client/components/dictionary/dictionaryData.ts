export type DictionaryCategory =
  | "Letters"
  | "Numbers"
  | "Punctuation"
  | "Prosigns"
  | "Q-codes"
  | "Abbreviations"
  | "Phrases";

export type PhraseRow = {
  phrase: string;
  morse: string;
  meaning: string;
  category: Exclude<DictionaryCategory, "Letters" | "Numbers" | "Punctuation">;
};

export const PHRASE_ROWS: PhraseRow[] = [
  // Common words / phrases
  { phrase: "HELLO", morse: ".... . .-.. .-.. ---", meaning: "Greeting", category: "Phrases" },
  { phrase: "GOOD MORNING", morse: "--. --- --- -.. / -- --- .-. -. .. -. --.", meaning: "Greeting", category: "Phrases" },
  { phrase: "THANK YOU", morse: "- .... .- -. -.- / -.-- --- ..-", meaning: "Gratitude", category: "Phrases" },
  { phrase: "PLEASE", morse: ".--. .-.. . .- ... .", meaning: "Polite request", category: "Phrases" },
  { phrase: "YES", morse: "-.-- . ...", meaning: "Affirmative", category: "Phrases" },
  { phrase: "NO", morse: "-. ---", meaning: "Negative", category: "Phrases" },
  { phrase: "GOODBYE", morse: "--. --- --- -.. -... -.-- .", meaning: "Farewell", category: "Phrases" },

  // Emergency / priority
  { phrase: "SOS", morse: "... --- ...", meaning: "Distress", category: "Phrases" },
  { phrase: "MAYDAY", morse: "-- .- -.-- -.. .- -.--", meaning: "Distress call", category: "Phrases" },
  { phrase: "HELP", morse: ".... . .-.. .--.", meaning: "Assistance", category: "Phrases" },
  { phrase: "STOP", morse: "... - --- .--.", meaning: "End / stop", category: "Phrases" },

  // Prosigns
  { phrase: "AR", morse: ".-.-.", meaning: "End of message", category: "Prosigns" },
  { phrase: "AS", morse: ".-...", meaning: "Wait", category: "Prosigns" },
  { phrase: "BT", morse: "-...-", meaning: "Separator / pause", category: "Prosigns" },
  { phrase: "KN", morse: "-.-.-.", meaning: "Specific station only", category: "Prosigns" },
  { phrase: "SK", morse: "...-.-", meaning: "End of contact", category: "Prosigns" },
  { phrase: "CL", morse: "-.-..-..", meaning: "Closing station", category: "Prosigns" },

  // Q-codes
  { phrase: "QRL", morse: "--.- .-. .-..", meaning: "Frequency busy?", category: "Q-codes" },
  { phrase: "QRZ", morse: "--.- .-. --..", meaning: "Who is calling me?", category: "Q-codes" },
  { phrase: "QRS", morse: "--.- .-. ...", meaning: "Send slower", category: "Q-codes" },
  { phrase: "QRQ", morse: "--.- .-. --.-", meaning: "Send faster", category: "Q-codes" },
  { phrase: "QTH", morse: "--.- - ....", meaning: "My location is…", category: "Q-codes" },
  { phrase: "QSL", morse: "--.- ... .-..", meaning: "Acknowledgement", category: "Q-codes" },
  { phrase: "QSY", morse: "--.- ... -.--", meaning: "Change frequency", category: "Q-codes" },
  { phrase: "QRM", morse: "--.- .-. --", meaning: "Man-made interference", category: "Q-codes" },
  { phrase: "QRN", morse: "--.- .-. -.", meaning: "Natural interference", category: "Q-codes" },
  { phrase: "QRP", morse: "--.- .-. .--.", meaning: "Reduce power", category: "Q-codes" },

  // Abbreviations / shorthand
  { phrase: "73", morse: "--... ...--", meaning: "Best regards", category: "Abbreviations" },
  { phrase: "88", morse: "---.. ---..", meaning: "Love and kisses", category: "Abbreviations" },
  { phrase: "OM", morse: "--- --", meaning: "Operator (male)", category: "Abbreviations" },
  { phrase: "YL", morse: "-.-- .-..", meaning: "Operator (female)", category: "Abbreviations" },
  { phrase: "FB", morse: "..-. -...", meaning: "Good / fine business", category: "Abbreviations" },
  { phrase: "TNX", morse: "- .... -. -..-", meaning: "Thanks", category: "Abbreviations" },
  { phrase: "CUL", morse: "-.-. ..- .-..", meaning: "See you later", category: "Abbreviations" },
  { phrase: "GL", morse: "--. .-..", meaning: "Good luck", category: "Abbreviations" },
  { phrase: "GA", morse: "--. .-", meaning: "Good afternoon", category: "Abbreviations" },
  { phrase: "GE", morse: "--. .", meaning: "Good evening", category: "Abbreviations" },
  { phrase: "GM", morse: "--. --", meaning: "Good morning", category: "Abbreviations" },
  { phrase: "HR", morse: ".... .-.", meaning: "Here", category: "Abbreviations" },
];
