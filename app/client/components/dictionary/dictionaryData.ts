import {
  formatMorseWords,
  splitMorseWords,
  textToMorse,
} from "~/client/components/shared/morseUtils";

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

function dictionaryTextToMorse(value: string) {
  return formatMorseWords(splitMorseWords(textToMorse(value)), {
    letterSeparator: " ",
    wordSeparator: " / ",
  });
}

export const PHRASE_ROWS: PhraseRow[] = [
  { phrase: "HELLO", morse: dictionaryTextToMorse("HELLO"), meaning: "Friendly greeting", category: "Phrases" },
  { phrase: "GOOD MORNING", morse: dictionaryTextToMorse("GOOD MORNING"), meaning: "Polite day greeting", category: "Phrases" },
  { phrase: "THANK YOU", morse: dictionaryTextToMorse("THANK YOU"), meaning: "Gratitude", category: "Phrases" },
  { phrase: "YES", morse: dictionaryTextToMorse("YES"), meaning: "Affirmative", category: "Phrases" },
  { phrase: "NO", morse: dictionaryTextToMorse("NO"), meaning: "Negative", category: "Phrases" },
  { phrase: "PLEASE", morse: dictionaryTextToMorse("PLEASE"), meaning: "Polite request", category: "Phrases" },
  { phrase: "LOVE", morse: dictionaryTextToMorse("LOVE"), meaning: "Affection", category: "Phrases" },
  { phrase: "FRIEND", morse: dictionaryTextToMorse("FRIEND"), meaning: "Companionship", category: "Phrases" },
  { phrase: "GOODBYE", morse: dictionaryTextToMorse("GOODBYE"), meaning: "Sign-off", category: "Phrases" },
  { phrase: "SOS", morse: dictionaryTextToMorse("SOS"), meaning: "Universal distress", category: "Phrases" },
  { phrase: "MAYDAY", morse: dictionaryTextToMorse("MAYDAY"), meaning: "Distress call", category: "Phrases" },
  { phrase: "HELP", morse: dictionaryTextToMorse("HELP"), meaning: "Request assistance", category: "Phrases" },
  { phrase: "NEED ASSISTANCE", morse: dictionaryTextToMorse("NEED ASSISTANCE"), meaning: "Emergency request", category: "Phrases" },
  { phrase: "STOP", morse: dictionaryTextToMorse("STOP"), meaning: "End / stop", category: "Phrases" },
  { phrase: "THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG", morse: dictionaryTextToMorse("THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG"), meaning: "Pangram", category: "Phrases" },
  { phrase: "PACK MY BOX WITH FIVE DOZEN LIQUOR JUGS", morse: dictionaryTextToMorse("PACK MY BOX WITH FIVE DOZEN LIQUOR JUGS"), meaning: "Pangram", category: "Phrases" },
  { phrase: "MORSE CODE IS FUN", morse: dictionaryTextToMorse("MORSE CODE IS FUN"), meaning: "Practice phrase", category: "Phrases" },
  { phrase: "KEEP PRACTICING", morse: dictionaryTextToMorse("KEEP PRACTICING"), meaning: "Encouragement", category: "Phrases" },
  { phrase: "LISTEN LEARN REPEAT", morse: dictionaryTextToMorse("LISTEN LEARN REPEAT"), meaning: "Training advice", category: "Phrases" },

  { phrase: "AR", morse: ".-.-.", meaning: "End of message", category: "Prosigns" },
  { phrase: "AS", morse: ".-...", meaning: "Wait / standby", category: "Prosigns" },
  { phrase: "BT", morse: "-...-", meaning: "Pause / new section", category: "Prosigns" },
  { phrase: "CL", morse: "-.-..-..", meaning: "Closing station", category: "Prosigns" },
  { phrase: "KN", morse: "-.-.-.", meaning: "Invite specific station", category: "Prosigns" },
  { phrase: "SK", morse: "...-.-", meaning: "End of contact", category: "Prosigns" },

  { phrase: "QRL", morse: dictionaryTextToMorse("QRL"), meaning: "Is the frequency busy?", category: "Q-codes" },
  { phrase: "QRZ", morse: dictionaryTextToMorse("QRZ"), meaning: "Who is calling me?", category: "Q-codes" },
  { phrase: "QRS", morse: dictionaryTextToMorse("QRS"), meaning: "Send more slowly", category: "Q-codes" },
  { phrase: "QRQ", morse: dictionaryTextToMorse("QRQ"), meaning: "Send faster", category: "Q-codes" },
  { phrase: "QTH", morse: dictionaryTextToMorse("QTH"), meaning: "My location is...", category: "Q-codes" },
  { phrase: "QSL", morse: dictionaryTextToMorse("QSL"), meaning: "Acknowledgment / received", category: "Q-codes" },
  { phrase: "QSY", morse: dictionaryTextToMorse("QSY"), meaning: "Change frequency", category: "Q-codes" },
  { phrase: "QRM", morse: dictionaryTextToMorse("QRM"), meaning: "Man-made interference", category: "Q-codes" },
  { phrase: "QRN", morse: dictionaryTextToMorse("QRN"), meaning: "Natural interference / static", category: "Q-codes" },
  { phrase: "QRP", morse: dictionaryTextToMorse("QRP"), meaning: "Reduce power", category: "Q-codes" },

  { phrase: "73", morse: dictionaryTextToMorse("73"), meaning: "Best regards", category: "Abbreviations" },
  { phrase: "88", morse: dictionaryTextToMorse("88"), meaning: "Love and kisses", category: "Abbreviations" },
  { phrase: "OM", morse: dictionaryTextToMorse("OM"), meaning: "Friendly term for operator", category: "Abbreviations" },
  { phrase: "YL", morse: dictionaryTextToMorse("YL"), meaning: "Female operator", category: "Abbreviations" },
  { phrase: "FB", morse: dictionaryTextToMorse("FB"), meaning: "Fine business (good)", category: "Abbreviations" },
  { phrase: "HR", morse: dictionaryTextToMorse("HR"), meaning: "Here", category: "Abbreviations" },
  { phrase: "TNX", morse: dictionaryTextToMorse("TNX"), meaning: "Thanks", category: "Abbreviations" },
  { phrase: "CUL", morse: dictionaryTextToMorse("CUL"), meaning: "See you later", category: "Abbreviations" },
  { phrase: "GL", morse: dictionaryTextToMorse("GL"), meaning: "Good luck", category: "Abbreviations" },
  { phrase: "GA", morse: dictionaryTextToMorse("GA"), meaning: "Good afternoon", category: "Abbreviations" },
  { phrase: "GE", morse: dictionaryTextToMorse("GE"), meaning: "Good evening", category: "Abbreviations" },
  { phrase: "GM", morse: dictionaryTextToMorse("GM"), meaning: "Good morning", category: "Abbreviations" },
];
