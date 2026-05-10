import { TEXT_TO_MORSE } from "~/client/components/shared/morseMaps";
import {
  normalizeTextForEncoding,
  textToMorse,
} from "~/client/components/shared/morseUtils";

export type ContentFaqItem = {
  q: string;
  a: string;
};

export type RelatedLink = {
  href: string;
  label: string;
  description?: string;
  primary?: boolean;
};

export type ContentTile = {
  title: string;
  text: string;
  href?: string;
  badge?: string;
};

export type WorkedExample = {
  title: string;
  text: string;
  morse: string;
  note: string;
};

export type CharacterBreakdown = {
  label: string;
  morse: string;
  note: string;
};

export type GuidePageContent = {
  slug: string;
  path: string;
  eyebrow: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  answerSummary: string;
  guideTitle: string;
  guideDescription: string;
  steps: ContentTile[];
  examplesTitle: string;
  examplesDescription: string;
  examples: WorkedExample[];
  mistakesTitle: string;
  mistakesDescription: string;
  commonMistakes: ContentTile[];
  comparisonTitle: string;
  comparisonDescription: string;
  comparisonItems: ContentTile[];
  nextStepTitle: string;
  nextStepDescription: string;
  relatedLinks: RelatedLink[];
  faqItems: ContentFaqItem[];
  schemaType: "WebPage" | "LearningResource";
};

export type MorseLeafContent = {
  slug: string;
  path: string;
  kind: "phrase" | "symbol";
  eyebrow: string;
  label: string;
  displayTitle: string;
  plainTextValue: string;
  morseValue: string;
  spokenRhythm: string;
  answerSummary: string;
  breakdownIntro: string;
  contextTitle: string;
  context: ContentTile[];
  examples: WorkedExample[];
  commonMistakes: ContentTile[];
  relatedLinks: RelatedLink[];
  faqItems: ContentFaqItem[];
  metaTitle: string;
  metaDescription: string;
  keywords: string;
};

export type NumberContentItem = {
  slug: string;
  label: string;
  displayTitle: string;
  plainTextValue: string;
  morseValue: string;
  spokenRhythm: string;
  answerSummary: string;
  patternExplanation: string;
  examples: WorkedExample[];
  commonMistakes: string[];
  relatedLinks: RelatedLink[];
  faqItems: ContentFaqItem[];
  metaTitle: string;
  metaDescription: string;
  keywords: string;
};

export type LetterContentItem = {
  letter: string;
  slug: string;
  path: string;
  displayTitle: string;
  plainTextValue: string;
  morseValue: string;
  spokenRhythm: string;
  answerSummary: string;
  whatItIs: string;
  soundNotes: ContentTile[];
  typingNotes: ContentTile[];
  commonConfusions: ContentTile[];
  exampleWords: WorkedExample[];
  miniPracticePrompt: ContentTile;
  listeningDrill: ContentTile;
  typingDrill: ContentTile;
  relatedLinks: RelatedLink[];
  faqItems: ContentFaqItem[];
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  isPublicSample: boolean;
};

function assertMorseCharacter(value: string) {
  const normalized = normalizeTextForEncoding(value);
  const morse = TEXT_TO_MORSE[normalized];
  if (!morse) {
    throw new Error(`Unsupported Morse content character: ${value}`);
  }
  return morse;
}

export function morseForText(value: string) {
  return textToMorse(value);
}

function rhythmFor(morse: string) {
  return morse
    .replace(/\s{7,}/g, " / ")
    .split("")
    .map((character) => {
      if (character === ".") return "dit";
      if (character === "-") return "dah";
      if (character === "/") return "/";
      return " ";
    })
    .join("")
    .replace(/\s+/g, " ")
    .replace(/\s\/\s/g, " / ")
    .trim();
}

function breakdownForText(value: string): CharacterBreakdown[] {
  return normalizeTextForEncoding(value)
    .split("")
    .map((character) => {
      if (character === " ") {
        return {
          label: "Word gap",
          morse: "/",
          note: "A word gap separates one word from the next.",
        };
      }

      return {
        label: character,
        morse: assertMorseCharacter(character),
        note: `${character} maps to ${assertMorseCharacter(character)}.`,
      };
    });
}

export function getCharacterBreakdown(value: string) {
  return breakdownForText(value);
}

export function getWordBreakdown(value: string) {
  return normalizeTextForEncoding(value)
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => ({
      label: word,
      morse: morseForText(word),
      note: `${word} is encoded one character at a time.`,
    }));
}

const LETTER_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const PUBLIC_SAMPLE_LETTERS = ["A", "E", "S", "O", "Q"] as const;
type PublicSampleLetter = (typeof PUBLIC_SAMPLE_LETTERS)[number];

const LETTER_EXAMPLE_WORDS: Record<string, readonly string[]> = {
  A: ["A", "NAME", "RADIO", "MAY"],
  B: ["BEE", "BAND", "CAB", "BRAVO"],
  C: ["CQ", "CODE", "COPY", "CAT"],
  D: ["DAY", "CODE", "RADIO", "DASH"],
  E: ["E", "SEE", "TREE", "MEET"],
  F: ["FAR", "FAST", "FOX", "FIVE"],
  G: ["GO", "SIGN", "GAP", "GOLF"],
  H: ["HI", "HELP", "HEAR", "HAT"],
  I: ["I", "SIGN", "TIME", "DIT"],
  J: ["JAM", "JOSH", "JULIET", "JOIN"],
  K: ["KEY", "KATIE", "SKY", "KILO"],
  L: ["LOVE", "CALL", "LINE", "LIMA"],
  M: ["ME", "MAY", "MORSE", "MIKE"],
  N: ["NO", "NAME", "TONE", "NOVEMBER"],
  O: ["O", "SOS", "CODE", "ZERO"],
  P: ["PEN", "COPY", "PULSE", "PAPA"],
  Q: ["Q", "CQ", "QTH", "QUEBEC"],
  R: ["RADIO", "READ", "RING", "ROMEO"],
  S: ["S", "SOS", "SIGN", "TEST"],
  T: ["T", "TEST", "TONE", "TIME"],
  U: ["USE", "TUNE", "UNIT", "UNIFORM"],
  V: ["VIA", "VOICE", "OVER", "VICTOR"],
  W: ["WORD", "WAVE", "TWO", "WHISKEY"],
  X: ["X", "TEXT", "FOX", "XRAY"],
  Y: ["YES", "YARD", "KEY", "YANKEE"],
  Z: ["ZERO", "ZONE", "BUZZ", "ZULU"],
};

function spokenLetterRhythm(morse: string) {
  return morse
    .split("")
    .map((mark, index, marks) => {
      if (mark === "-") return "dah";
      return index === marks.length - 1 ? "dit" : "di";
    })
    .join("-");
}

function letterPatternLengthText(letter: string, morseValue: string) {
  const markCount = morseValue.length;
  const markLabel = markCount === 1 ? "mark" : "marks";
  return `${letter} uses ${markCount} ${markLabel}: ${morseValue}.`;
}

function buildLetterExamples(letter: string) {
  return (LETTER_EXAMPLE_WORDS[letter] ?? [letter]).map((word) => ({
    title: word,
    text: word,
    morse: morseForText(word).replace(/\s{7,}/g, " / "),
    note:
      word === letter
        ? `${letter} by itself is the cleanest way to check the pattern.`
        : `${word} gives you ${letter} inside a short word instead of as an isolated lookup.`,
  }));
}

function defaultLetterFaq({
  letter,
  morseValue,
  spokenRhythm,
}: {
  letter: string;
  morseValue: string;
  spokenRhythm: string;
}): ContentFaqItem[] {
  return [
    {
      q: `What is ${letter} in Morse code?`,
      a: `${letter} in Morse code is ${morseValue}.`,
    },
    {
      q: `How do you say ${letter} in Morse rhythm?`,
      a: `${letter} is commonly spoken as ${spokenRhythm} when practicing the sound pattern.`,
    },
    {
      q: `Can I type ${letter} in Morse code?`,
      a: `Yes. Type ${morseValue} with periods for dots and hyphens for dashes, then keep spaces between letters when you type a word.`,
    },
    {
      q: `Should I learn ${letter} by sight or sound?`,
      a: "Use the visual pattern for lookup, then practice the rhythm so you can recognize it by ear.",
    },
  ];
}

function buildLetterRelatedLinks(letter: string): RelatedLink[] {
  const queryLetter = letter;
  const links: RelatedLink[] = [
    {
      href: "/morse-code-alphabet",
      label: "Alphabet chart",
      description: "Compare this letter with the rest of A-Z.",
      primary: true,
    },
    {
      href: `/audio?text=${queryLetter}`,
      label: "Hear this letter",
      description: "Open the audio tool with this letter preloaded.",
    },
    {
      href: `/morse-code-encoder?text=${queryLetter}`,
      label: "Open in encoder",
      description: "Convert the letter in the encoder.",
    },
    {
      href: "/morse-code-decoder",
      label: "Decoder",
      description: "Decode typed dots and dashes after adding separators.",
    },
    {
      href: "/morse-code-numbers",
      label: "Numbers",
      description: "Review the 0-9 chart after letters.",
    },
    {
      href: "/practice",
      label: "Practice",
      description: "Turn lookup into recall.",
    },
    {
      href: "/typing",
      label: "Typing practice",
      description: "Practice keyboard rhythm with dots and dashes.",
    },
  ];

  if (letter === "S" || letter === "O") {
    links.push({
      href: "/morse-code-sos",
      label: "Study SOS",
      description: "See S and O inside a complete emergency signal.",
    });
  }

  if (letter === "Q") {
    links.push(
      {
        href: "/cq-in-morse-code",
        label: "CQ in Morse",
        description: "See Q inside a common calling signal.",
      },
      {
        href: "/morse-code-q-codes",
        label: "Q-codes",
        description: "Review common Q-code abbreviations.",
      },
    );
  }

  return links;
}

type LetterOverride = Partial<
  Pick<
    LetterContentItem,
    | "answerSummary"
    | "whatItIs"
    | "soundNotes"
    | "typingNotes"
    | "commonConfusions"
    | "miniPracticePrompt"
    | "listeningDrill"
    | "typingDrill"
    | "faqItems"
    | "metaDescription"
  >
>;

const LETTER_CONTENT_OVERRIDES: Record<string, LetterOverride> = {
  A: {
    answerSummary:
      "A in Morse code is .- (di-dah): one short dit followed by one longer dah.",
    whatItIs:
      "The letter A is a two-mark Morse character. The order matters: the dot comes first and the dash comes second. Reversing the order turns it into N, and adding one final dot turns it into R.",
    soundNotes: [
      {
        title: "Hear short then long",
        text: "A should feel like a quick pickup followed by a longer finish: di-dah. Do not let the first dit stretch into a dash.",
      },
      {
        title: "Compare it with N",
        text: "Practice A with N because .- and -. are mirrored patterns. The first sound tells you which letter you heard.",
        href: "/morse-code-alphabet",
      },
    ],
    commonConfusions: [
      {
        title: "N reverses the order",
        text: "A is .- and N is -., so read or type the marks from left to right instead of only remembering that both have one dot and one dash.",
      },
      {
        title: "R adds one more dot",
        text: "R is .-. If you hear or type a final dot after A, the pattern changes from A to R.",
      },
    ],
    miniPracticePrompt: {
      title: "Mini practice",
      text: "Listen for A versus N, identify A inside MAY, NAME, and RADIO, then type A, N, and R in order so the reversal and extra-dot mistakes are obvious.",
      href: "/practice",
    },
    listeningDrill: {
      title: "Listening drill",
      text: "Play A, N, and R in short bursts. Call out whether the first mark is the short dit for A, the long dah for N, or the extra final dit that makes R.",
      href: "/audio?text=ANR",
    },
    typingDrill: {
      title: "Typing drill",
      text: "Type .- for A, -. for N, and .-. for R. Then type MAY, NAME, and RADIO so A appears inside real words.",
      href: "/typing",
    },
    faqItems: [
      { q: "What is A in Morse code?", a: "A in Morse code is .-." },
      { q: "How do you say A in Morse rhythm?", a: "A is spoken as di-dah." },
      {
        q: "What letter is the opposite of A in Morse?",
        a: "N is the mirrored pattern of A. A is .- and N is -.",
      },
      {
        q: "Can I copy A in Morse code for a design?",
        a: "Yes, but check that the dot comes before the dash before using it in jewelry, engraving, or a tattoo.",
      },
      {
        q: "Where should I practice A next?",
        a: "Practice A inside short words such as MAY, NAME, and RADIO so the rhythm is not only an isolated lookup.",
      },
    ],
    metaDescription:
      "A in Morse code is .- (di-dah). Learn the sound, copy the pattern, compare A with N, and practice short words that contain A.",
  },
  E: {
    answerSummary:
      "E in Morse code is . (one dot). It is the shortest Morse character: one quick dit.",
    whatItIs:
      "The letter E is a single dot. Because it is only one mark, timing and spacing matter more than pattern complexity.",
    soundNotes: [
      {
        title: "Shortest character",
        text: "E is one dit, so it is the quickest Morse letter to recognize and send. Stop after one mark.",
      },
      {
        title: "Spacing protects it",
        text: "Two E letters need a letter gap between them. Without a gap, two dots become I.",
      },
    ],
    commonConfusions: [
      {
        title: "I is two dots",
        text: "E is one dot. I is two dots, so an accidental extra mark or missing letter gap changes the letter.",
      },
      {
        title: "T is one dash",
        text: "E and T are the first contrast: one short mark versus one long mark.",
      },
    ],
    miniPracticePrompt: {
      title: "Mini practice",
      text: "Alternate E and T, then type E, I, and S so you can hear how one extra dit changes the decoded letter.",
      href: "/typing",
    },
    listeningDrill: {
      title: "Listening drill",
      text: "Play E, I, and S. Stop after one dit for E, two dits for I, and three dits for S so extra marks become obvious.",
      href: "/audio?text=EIS",
    },
    typingDrill: {
      title: "Typing drill",
      text: "Type ., .., and ... with clear spaces between them. The drill is about stopping cleanly, not speed.",
      href: "/typing",
    },
    faqItems: [
      { q: "What is E in Morse code?", a: "E in Morse code is . (one dot)." },
      {
        q: "Why is E the shortest Morse letter?",
        a: "E is represented by a single dit, which is the shortest possible Morse character.",
      },
      {
        q: "What is E often confused with?",
        a: "E is commonly confused with I when spacing is missing, and with T when a dot is mistaken for a dash.",
      },
      {
        q: "How do I type E in Morse?",
        a: "Type one period for E, then add a space before the next Morse character.",
      },
    ],
    metaDescription:
      "E in Morse code is . (one dot). Learn why E is the shortest Morse character, hear the one-dit rhythm, and avoid spacing mistakes with I.",
  },
  S: {
    answerSummary:
      "S in Morse code is ... (three dots). It sounds like three quick dits and appears at both ends of SOS.",
    whatItIs:
      "The letter S is a three-dot Morse character. It is useful early because the rhythm is easy to hear, but it still needs a clean letter gap after the third dit.",
    soundNotes: [
      {
        title: "Three quick dits",
        text: "S should sound compact: di-di-dit, with the three dots grouped inside one letter.",
      },
      {
        title: "Useful in SOS",
        text: "SOS uses S, then O, then S. Learn S by itself before treating SOS as one complete signal.",
        href: "/morse-code-sos",
      },
    ],
    commonConfusions: [
      {
        title: "H has four dots",
        text: "S is three dots. H is four dots, so one extra dit changes the letter and can make copied Morse decode incorrectly.",
      },
      {
        title: "V ends with a dash",
        text: "V starts with the S rhythm but adds a dash: ...-.",
      },
    ],
    miniPracticePrompt: {
      title: "Mini practice",
      text: "Send S, pause, send H, then return to S. After that, try S-O-S so the three-dot rhythm stays separate from the full SOS signal.",
      href: "/morse-code-sos",
    },
    listeningDrill: {
      title: "Listening drill",
      text: "Play S and H back to back. S stops at three dits; H keeps going for a fourth dit.",
      href: "/audio?text=SHSOS",
    },
    typingDrill: {
      title: "Typing drill",
      text: "Type ... for S, .... for H, and ... --- ... for SOS. Keep the letter spaces visible.",
      href: "/typing",
    },
    faqItems: [
      { q: "What is S in Morse code?", a: "S in Morse code is three dots: ..." },
      {
        q: "Is S the same as SOS?",
        a: "No. S is one letter. SOS is three letters: S, O, and S.",
      },
      {
        q: "How do you say S in Morse rhythm?",
        a: "S is spoken as di-di-dit.",
      },
      {
        q: "What letters are close to S?",
        a: "I has two dots, H has four dots, and V starts with three dots before a dash.",
      },
      {
        q: "How should I practice S?",
        a: "Practice S inside short words such as SIGN and TEST, then compare it with O in SOS.",
      },
    ],
    metaDescription:
      "S in Morse code is ... (three dots). Learn the three-dit rhythm, see how S fits into SOS, and practice words that keep the spacing clear.",
  },
  O: {
    answerSummary:
      "O in Morse code is ---. It sounds like three steady dahs and forms the middle of SOS.",
    whatItIs:
      "The letter O is a three-dash Morse character. It is all long marks, but it is not the digit zero, which has five dashes.",
    soundNotes: [
      {
        title: "Three steady dahs",
        text: "O should sound longer and heavier than S: dah-dah-dah. Count three long marks, then stop.",
      },
      {
        title: "Middle of SOS",
        text: "In SOS, O is the three-dash center between two S letters.",
        href: "/morse-code-sos",
      },
    ],
    commonConfusions: [
      {
        title: "Zero has five dashes",
        text: "O is ---. The digit 0 is -----, so count the dashes when reading copied Morse in codes, dates, or call signs.",
        href: "/morse-code-numbers",
      },
      {
        title: "M has two dashes",
        text: "M is --. O adds one more dash, making three total.",
      },
    ],
    miniPracticePrompt: {
      title: "Mini practice",
      text: "Alternate O and zero aloud: three dahs, then five dahs. Then decode SOS and CODE 0 to practice letter and number context.",
      href: "/audio?text=O0",
    },
    listeningDrill: {
      title: "Listening drill",
      text: "Play O, M, and zero. O has three dahs, M has two, and zero has five.",
      href: "/audio?text=OM0",
    },
    typingDrill: {
      title: "Typing drill",
      text: "Type --- for O, -- for M, and ----- for zero. Use CODE 0 to practice context.",
      href: "/typing",
    },
    faqItems: [
      { q: "What is O in Morse code?", a: "O in Morse code is three dashes: ---." },
      {
        q: "Is O the same as zero in Morse?",
        a: "No. O is three dashes, while the digit 0 is five dashes.",
      },
      {
        q: "How do you say O in Morse rhythm?",
        a: "O is spoken as dah-dah-dah.",
      },
      {
        q: "Why is O useful for beginners?",
        a: "O gives beginners a clean three-dash pattern and pairs naturally with S in SOS.",
      },
    ],
    metaDescription:
      "O in Morse code is ---. Learn the three-dah sound, compare O with zero, and practice O inside SOS and short words.",
  },
  Q: {
    answerSummary:
      "Q in Morse code is --.-. It sounds like dah-dah-di-dah and is useful in CQ and Q-code context.",
    whatItIs:
      "The letter Q is a four-mark Morse character. It is less common in everyday words, but it matters in radio-style abbreviations such as CQ and QTH.",
    soundNotes: [
      {
        title: "Long-long-short-long",
        text: "Q starts with two dahs, adds one dit, then ends with a dah: dah-dah-di-dah. The final dash is part of the letter.",
      },
      {
        title: "Useful in CQ",
        text: "CQ includes Q and is a common calling signal to learn for Morse context.",
        href: "/cq-in-morse-code",
      },
    ],
    commonConfusions: [
      {
        title: "G stops earlier",
        text: "G is --. while Q is --.-. Q adds a final dash after the dot, so stopping early changes the letter.",
      },
      {
        title: "O is all dashes",
        text: "O is ---. Q interrupts the dashes with a dot before the final dash.",
      },
    ],
    miniPracticePrompt: {
      title: "Mini practice",
      text: "Practice CQ, then isolate Q. Listen for the last two marks, dit-dah, because that ending separates Q from G and O.",
      href: "/cq-in-morse-code",
    },
    listeningDrill: {
      title: "Listening drill",
      text: "Play CQ, Q, G, and O. The Q ending is dit-dah, while G stops earlier and O stays all dashes.",
      href: "/audio?text=CQ%20QGO",
    },
    typingDrill: {
      title: "Typing drill",
      text: "Type --.- for Q, then type CQ and QTH. Check that the final dash is not missing.",
      href: "/typing",
    },
    faqItems: [
      { q: "What is Q in Morse code?", a: "Q in Morse code is --.-." },
      {
        q: "How do you say Q in Morse rhythm?",
        a: "Q is spoken as dah-dah-di-dah.",
      },
      {
        q: "Why learn Q if it is less common?",
        a: "Q appears in CQ, QTH, and other radio-style abbreviations, so it is useful beyond ordinary word frequency.",
      },
      {
        q: "What is Q commonly confused with?",
        a: "Q can be confused with G if the final dash is missed, or with O if the dot is not heard clearly.",
      },
      {
        q: "Does Q mean CQ?",
        a: "No. Q is one letter. CQ is a two-letter calling signal that includes Q.",
      },
    ],
    metaDescription:
      "Q in Morse code is --.-. Learn the dah-dah-di-dah rhythm, see why Q matters in CQ and Q-codes, and avoid common decoding mistakes.",
  },
};

function buildLetterContent(letter: string): LetterContentItem {
  const morseValue = assertMorseCharacter(letter);
  const spokenRhythm = spokenLetterRhythm(morseValue);
  const slug = `${letter.toLowerCase()}-in-morse-code`;
  const isPublicSample = PUBLIC_SAMPLE_LETTERS.includes(letter as PublicSampleLetter);
  const override = LETTER_CONTENT_OVERRIDES[letter] ?? {};

  return {
    letter,
    slug,
    path: `/${slug}`,
    displayTitle: `${letter} in Morse Code`,
    plainTextValue: letter,
    morseValue,
    spokenRhythm,
    answerSummary:
      override.answerSummary ??
      `${letter} in Morse code is ${morseValue}. It is spoken as ${spokenRhythm} when you practice by sound.`,
    whatItIs:
      override.whatItIs ??
      `The letter ${letter} is a standard International Morse letter. ${letterPatternLengthText(
        letter,
        morseValue,
      )}`,
    soundNotes:
      override.soundNotes ??
      [
        {
          title: "Listen for the rhythm",
          text: `${letter} is easier to recognize when ${morseValue} becomes the sound ${spokenRhythm}.`,
        },
        {
          title: "Compare nearby patterns",
          text: "Use the alphabet chart to compare letters with a similar number of marks.",
          href: "/morse-code-alphabet",
        },
      ],
    typingNotes:
      override.typingNotes ??
      [
        {
          title: "Use keyboard-safe marks",
          text: `Type ${morseValue} with periods for dots and hyphens for dashes.`,
        },
        {
          title: "Keep letter gaps visible",
          text: "Add a space after the letter when typing a word so the next Morse character stays separate.",
        },
      ],
    commonConfusions:
      override.commonConfusions ??
      [
        {
          title: "Missing a mark",
          text: "Counting each dot and dash prevents a nearby shorter letter from being read by mistake.",
        },
        {
          title: "Adding a mark",
          text: "Extra dots or dashes can change the letter, especially inside fast copied text.",
        },
      ],
    exampleWords: buildLetterExamples(letter),
    miniPracticePrompt:
      override.miniPracticePrompt ??
      {
        title: "Mini practice",
        text: `Copy ${letter}, say ${spokenRhythm}, then find the same rhythm inside a short word from the examples.`,
        href: "/practice",
      },
    listeningDrill:
      override.listeningDrill ??
      {
        title: "Listening drill",
        text: `Play ${letter}, say ${spokenRhythm}, then compare it with one nearby pattern from the alphabet chart.`,
        href: `/audio?text=${letter}`,
      },
    typingDrill:
      override.typingDrill ??
      {
        title: "Typing drill",
        text: `Type ${morseValue} for ${letter}, add a letter space, then type one short example word that contains ${letter}.`,
        href: "/typing",
      },
    relatedLinks: buildLetterRelatedLinks(letter),
    faqItems:
      override.faqItems ??
      defaultLetterFaq({ letter, morseValue, spokenRhythm }),
    metaTitle: `${letter} in Morse Code | Symbol, Sound, and Examples | MorseWords`,
    metaDescription:
      override.metaDescription ??
      `${letter} in Morse code is ${morseValue}. Learn the ${spokenRhythm} sound, copy the pattern, hear it as audio, and practice short words containing ${letter}.`,
    keywords: `${letter} in morse code, morse code ${letter}, ${letter} morse code, ${letter} morse letter`,
    isPublicSample,
  };
}

export const LETTER_ITEMS: LetterContentItem[] =
  LETTER_ALPHABET.map(buildLetterContent);

export const LETTER_PAGES: Record<string, LetterContentItem> =
  Object.fromEntries(LETTER_ITEMS.map((item) => [item.slug, item])) as Record<
    string,
    LetterContentItem
  >;

export const PUBLIC_SAMPLE_LETTER_PAGES = LETTER_ITEMS.filter(
  (item) => item.isPublicSample,
);

export const PUBLIC_SAMPLE_LETTER_PATHS = PUBLIC_SAMPLE_LETTER_PAGES.map(
  (item) => item.path,
);

const numberNames = [
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
] as const;

function numberPatternExplanation(digit: number) {
  if (digit === 0) return "0 is five dashes.";
  if (digit <= 5) {
    return `${digit} starts with ${digit} dot${digit === 1 ? "" : "s"} and fills the five-mark pattern with dashes.`;
  }
  const dashes = digit - 5;
  return `${digit} starts with ${dashes} dash${dashes === 1 ? "" : "es"} and fills the five-mark pattern with dots.`;
}

export const NUMBER_ITEMS: NumberContentItem[] = Array.from(
  { length: 10 },
  (_, digit) => {
    const label = String(digit);
    const morseValue = assertMorseCharacter(label);

    return {
      slug: `${label}-in-morse-code`,
      label,
      displayTitle: `${label} in Morse code`,
      plainTextValue: label,
      morseValue,
      spokenRhythm: rhythmFor(morseValue),
      answerSummary: `${label} in Morse code is ${morseValue}.`,
      patternExplanation: numberPatternExplanation(digit),
      examples: [
        {
          title: `${label} as a count`,
          text: `COUNT ${label}`,
          morse: morseForText(`COUNT ${label}`),
          note: "Numbers can appear beside normal letters when counts or scores matter.",
        },
      ],
      commonMistakes: [
        "Dropping one mark from a five-mark number pattern.",
        "Copying a digit without preserving the space before the next letter.",
      ],
      relatedLinks: [
        { href: "/morse-code-numbers", label: "Numbers hub", primary: true },
        { href: "/audio", label: "Hear number audio" },
        { href: "/", label: "Open translator" },
      ],
      faqItems: [],
      metaTitle: `${label} in Morse Code | MorseWords`,
      metaDescription: `${label} in Morse code is ${morseValue}. Use the numbers hub for the full 0-9 chart, examples, and audio links.`,
      keywords: `${numberNames[digit]} in morse code, ${label} in morse code, morse code number ${label}`,
    };
  },
);

export const NAME_EXAMPLES = ["Avery", "Diego", "Josh", "Katie", "Kyle"].map(
  (name) => ({
    label: name,
    morse: morseForText(name),
  }),
);

export const NUMBER_PAGE_FAQ_ITEMS: ContentFaqItem[] = [
  {
    q: "What are Morse code numbers?",
    a: "Morse code numbers are the digit patterns for 0 through 9. Each digit uses five marks.",
  },
  {
    q: "What is 0 in Morse code?",
    a: "0 in Morse code is five dashes: -----.",
  },
  {
    q: "How do Morse numbers follow a pattern?",
    a: "1 through 5 build dots then dashes. 6 through 9 build dashes then dots. 0 is five dashes.",
  },
  {
    q: "Can I use numbers with letters in Morse code?",
    a: "Yes. Numbers can appear beside letters in dates, counts, codes, and call sign-style examples.",
  },
  {
    q: "Are individual number pages available?",
    a: "Not in this pass. This hub keeps the full 0-9 chart together so learners can compare the number pattern.",
  },
];

export const PHRASE_PAGES: Record<string, MorseLeafContent> = {
  "i-love-you-in-morse-code": {
    slug: "i-love-you-in-morse-code",
    path: "/i-love-you-in-morse-code",
    kind: "phrase",
    eyebrow: "Phrase lookup",
    label: "I LOVE YOU",
    displayTitle: "I Love You in Morse Code",
    plainTextValue: "I LOVE YOU",
    morseValue: morseForText("I LOVE YOU"),
    spokenRhythm: rhythmFor(morseForText("I LOVE YOU")),
    answerSummary:
      "I LOVE YOU in Morse code is written as .. / .-.. --- ...- . / -.-- --- ..- when you use slash word separators.",
    breakdownIntro:
      "The phrase is encoded by spelling each word. Morse changes the letters, not the meaning of the phrase.",
    contextTitle: "Using I LOVE YOU in Morse",
    context: [
      {
        title: "Cards and gifts",
        text: "Keep the slash word gaps visible when the Morse will be printed on a card, bracelet, engraving, or keepsake.",
      },
      {
        title: "Tattoo and engraving caution",
        text: "Check the spelling, spacing, and punctuation before final use. A missing gap can change how the message is read.",
      },
      {
        title: "Audio practice",
        text: "Listen to the phrase before copying it so the word rhythm is familiar, not only visual.",
      },
    ],
    examples: [
      {
        title: "Slash-separated phrase",
        text: "I LOVE YOU",
        morse: morseForText("I LOVE YOU").replace(/\s{7,}/g, " / "),
        note: "This is the clearest written format for gifts, notes, and posts.",
      },
      {
        title: "Timing-style spacing",
        text: "I LOVE YOU",
        morse: morseForText("I LOVE YOU"),
        note: "The wider gaps are word breaks when you want timing-style Morse text.",
      },
    ],
    commonMistakes: [
      {
        title: "Removing word gaps",
        text: "The phrase becomes much harder to read if the spaces or slashes between I, LOVE, and YOU disappear.",
      },
      {
        title: "Treating Morse as a symbol code",
        text: "Morse encodes the letters I, L, O, V, E, Y, O, U. It does not have one special mark for the idea of love.",
      },
      {
        title: "Using decorative dots and dashes",
        text: "Stylized dots and dashes may look good, but test the final pattern in the decoder before printing or engraving.",
      },
    ],
    relatedLinks: [
      { href: "/?text=I%20LOVE%20YOU", label: "Open in translator", primary: true },
      { href: "/audio?text=I%20LOVE%20YOU", label: "Hear it as audio" },
      { href: "/morse-code-encoder", label: "Morse encoder" },
      { href: "/morse-code-words", label: "More Morse words" },
    ],
    faqItems: [
      {
        q: "What is I love you in Morse code?",
        a: "I LOVE YOU in Morse code is .. / .-.. --- ...- . / -.-- --- ..- when written with slash word separators.",
      },
      {
        q: "Does Morse code have one symbol for love?",
        a: "No. Morse code spells the words I LOVE YOU one character at a time.",
      },
      {
        q: "Should I use spaces or slashes for a gift?",
        a: "Slashes are often clearer in printed text because they show word boundaries even when spacing changes.",
      },
      {
        q: "Can I hear I LOVE YOU in Morse code?",
        a: "Yes. Use the audio link on this page to load the phrase into the MorseWords audio tool.",
      },
      {
        q: "Should I check Morse before engraving or tattooing it?",
        a: "Yes. Verify the exact spelling and word gaps before using Morse permanently.",
      },
    ],
    metaTitle: "I Love You in Morse Code | Copy, Hear, and Check It | MorseWords",
    metaDescription:
      "See I LOVE YOU in Morse code, copy the exact pattern, hear the audio, check word spacing, and avoid common gift or engraving mistakes.",
    keywords:
      "i love you in morse code, love you morse code, morse code gift, morse code engraving",
  },
  "cq-in-morse-code": {
    slug: "cq-in-morse-code",
    path: "/cq-in-morse-code",
    kind: "phrase",
    eyebrow: "Radio phrase",
    label: "CQ",
    displayTitle: "CQ in Morse Code",
    plainTextValue: "CQ",
    morseValue: morseForText("CQ"),
    spokenRhythm: rhythmFor(morseForText("CQ")),
    answerSummary:
      "CQ in Morse code is -.-. --.-. It is commonly used as a general call in radio practice and operating context.",
    breakdownIntro:
      "CQ is two letters, C and Q. The Morse pattern comes from the standard letter map, not from a separate prosign.",
    contextTitle: "Using CQ in Morse",
    context: [
      {
        title: "General call",
        text: "CQ is used to call any station. In practice material it often appears before a call sign or a sample contact.",
      },
      {
        title: "Radio context",
        text: "CQ is a useful bridge from alphabet practice into radio-style shorthand and Q-code examples.",
      },
      {
        title: "Spacing clarity",
        text: "Write C and Q as two separated letter patterns: -.-. --.-.",
      },
    ],
    examples: [
      {
        title: "CQ",
        text: "CQ",
        morse: morseForText("CQ"),
        note: "The basic two-letter call.",
      },
      {
        title: "CQ TEST",
        text: "CQ TEST",
        morse: morseForText("CQ TEST").replace(/\s{7,}/g, " / "),
        note: "A simple practice phrase with a visible word break.",
      },
      {
        title: "CQ?",
        text: "CQ?",
        morse: morseForText("CQ?"),
        note: "The question mark is separate punctuation after the letters.",
      },
    ],
    commonMistakes: [
      {
        title: "Sending CQ as one unbroken symbol",
        text: "CQ is normally written as C followed by Q, with a letter gap between the two patterns.",
      },
      {
        title: "Confusing Q with a Q-code",
        text: "CQ contains the letter Q, but CQ itself is a calling phrase, not one of the Q-codes such as QTH or QSL.",
      },
      {
        title: "Dropping the final dot",
        text: "Q is --.-, so CQ ends with the dot in the Q pattern.",
      },
    ],
    relatedLinks: [
      { href: "/?text=CQ", label: "Open in translator", primary: true },
      { href: "/audio?text=CQ", label: "Hear CQ" },
      { href: "/q-in-morse-code", label: "Study Q" },
      { href: "/morse-code-q-codes", label: "Q-codes" },
      { href: "/morse-code-prosigns", label: "Prosigns" },
      { href: "/morse-code-words", label: "More Morse words" },
    ],
    faqItems: [
      {
        q: "What is CQ in Morse code?",
        a: "CQ in Morse code is -.-. --.-.",
      },
      {
        q: "What does CQ mean?",
        a: "CQ is commonly used as a general call to any station in radio operating context.",
      },
      {
        q: "Is CQ a prosign?",
        a: "No. CQ is usually treated as a two-letter calling phrase, not as a single procedural prosign.",
      },
      {
        q: "How should CQ be spaced?",
        a: "Write CQ as two letter patterns with a letter gap: -.-. --.-.",
      },
      {
        q: "Where should I practice CQ next?",
        a: "Use the audio tool to hear it, then compare it with Q-code and prosign pages.",
      },
    ],
    metaTitle: "CQ in Morse Code | Meaning, Audio, and Examples | MorseWords",
    metaDescription:
      "See CQ in Morse code, learn what CQ means in radio context, hear the pattern, and compare it with Q-codes and prosigns.",
    keywords:
      "cq in morse code, cq morse code, cq meaning morse, radio cq morse",
  },
};

export const SYMBOL_PAGES: Record<string, MorseLeafContent> = {
  "question-mark-in-morse-code": {
    slug: "question-mark-in-morse-code",
    path: "/question-mark-in-morse-code",
    kind: "symbol",
    eyebrow: "Symbol lookup",
    label: "Question mark",
    displayTitle: "Question Mark in Morse Code",
    plainTextValue: "?",
    morseValue: assertMorseCharacter("?"),
    spokenRhythm: rhythmFor(assertMorseCharacter("?")),
    answerSummary:
      "The question mark in Morse code is ..--.. Use it when the written message contains a real question mark.",
    breakdownIntro:
      "The question mark is punctuation, so it is encoded as its own longer pattern after the surrounding letters.",
    contextTitle: "Using a question mark in Morse",
    context: [
      {
        title: "Questions",
        text: "Use the question mark pattern after copied text such as QTH? or COPY? when the mark is part of the message.",
      },
      {
        title: "Decoding notes",
        text: "Keep the question mark separated from the previous letter pattern so it decodes as punctuation.",
      },
      {
        title: "Paste safety",
        text: "A question mark is safe plain ASCII. Problems usually come from lost spaces around the Morse pattern.",
      },
    ],
    examples: [
      {
        title: "QTH?",
        text: "QTH?",
        morse: morseForText("QTH?"),
        note: "A radio-style example where the question mark ends the group.",
      },
      {
        title: "COPY?",
        text: "COPY?",
        morse: morseForText("COPY?"),
        note: "A practical copy-check example.",
      },
      {
        title: "ARE YOU OK?",
        text: "ARE YOU OK?",
        morse: morseForText("ARE YOU OK?").replace(/\s{7,}/g, " / "),
        note: "A simple question with visible word separators.",
      },
    ],
    commonMistakes: [
      {
        title: "Attaching it to a letter",
        text: "Write a separator before ..--.. so the decoder does not read it as part of the previous letter.",
      },
      {
        title: "Using a dot lookalike",
        text: "Copied bullets or decorative dots can break compatibility. Use periods for dots when pasting Morse.",
      },
      {
        title: "Dropping the last dot",
        text: "The full question mark pattern has six marks: ..--..",
      },
    ],
    relatedLinks: [
      { href: "/morse-code-punctuation", label: "Punctuation chart", primary: true },
      { href: "/?text=%3F", label: "Open in translator" },
      { href: "/audio?text=%3F", label: "Hear it as audio" },
      { href: "/morse-code-decoder", label: "Decode Morse" },
      { href: "/morse-code-word-separator", label: "Spacing guide" },
    ],
    faqItems: [
      {
        q: "What is a question mark in Morse code?",
        a: "A question mark in Morse code is ..--..",
      },
      {
        q: "Can I type a normal question mark into the encoder?",
        a: "Yes. The MorseWords encoder supports the normal ASCII question mark.",
      },
      {
        q: "Why did my question mark not decode?",
        a: "The most common reason is a missing separator between the previous letter and the question mark pattern.",
      },
      {
        q: "Is question mark Morse the same as a word separator?",
        a: "No. The question mark is punctuation. A slash is commonly used as a visible word separator in copied Morse.",
      },
    ],
    metaTitle: "Question Mark in Morse Code | Pattern, Examples, and Audio | MorseWords",
    metaDescription:
      "See the question mark in Morse code, copy ..--.., hear it as audio, and review examples such as QTH? and COPY?.",
    keywords:
      "question mark in morse code, morse code question mark, punctuation morse question mark",
  },
  "at-sign-in-morse-code": {
    slug: "at-sign-in-morse-code",
    path: "/at-sign-in-morse-code",
    kind: "symbol",
    eyebrow: "Symbol lookup",
    label: "At sign",
    displayTitle: "At Sign in Morse Code",
    plainTextValue: "@",
    morseValue: assertMorseCharacter("@"),
    spokenRhythm: rhythmFor(assertMorseCharacter("@")),
    answerSummary:
      "The at sign in Morse code is .--.-. Use it for email-like text, contact examples, and username-style strings.",
    breakdownIntro:
      "The at sign is punctuation. It has its own supported Morse pattern and should be separated from surrounding letters.",
    contextTitle: "Using the at sign in Morse",
    context: [
      {
        title: "Email-like text",
        text: "The @ symbol can appear inside address-style text, but full email addresses may include unsupported characters depending on the domain.",
      },
      {
        title: "Contact examples",
        text: "Use it for short examples such as NAME@SITE or A@B when the symbol itself matters.",
      },
      {
        title: "Decoding notes",
        text: "Keep .--.-. as one separated punctuation group so it decodes back to @.",
      },
    ],
    examples: [
      {
        title: "NAME@SITE",
        text: "NAME@SITE",
        morse: morseForText("NAME@SITE"),
        note: "A compact address-style example using only supported letters and @.",
      },
      {
        title: "A@B",
        text: "A@B",
        morse: morseForText("A@B"),
        note: "A short copy test for the symbol.",
      },
      {
        title: "CALL @ HOME",
        text: "CALL @ HOME",
        morse: morseForText("CALL @ HOME").replace(/\s{7,}/g, " / "),
        note: "A readable phrase with visible word breaks around the symbol.",
      },
    ],
    commonMistakes: [
      {
        title: "Leaving no separator",
        text: "Put a gap before and after .--.-. so it does not merge with adjacent letter patterns.",
      },
      {
        title: "Encoding a full email without checking",
        text: "Dots, hyphens, and underscores are supported, but always test the complete address before sharing it.",
      },
      {
        title: "Confusing at sign with A",
        text: "The letter A uses .-; the at sign is longer: .--.-.",
      },
    ],
    relatedLinks: [
      { href: "/morse-code-punctuation", label: "Punctuation chart", primary: true },
      { href: "/?text=%40", label: "Open in translator" },
      { href: "/audio?text=%40", label: "Hear it as audio" },
      { href: "/morse-code-encoder", label: "Encode text" },
      { href: "/morse-code-decoder", label: "Decode Morse" },
    ],
    faqItems: [
      {
        q: "What is the at sign in Morse code?",
        a: "The at sign in Morse code is .--.-.",
      },
      {
        q: "Can Morse code encode email addresses?",
        a: "It can encode supported letters, numbers, periods, hyphens, underscores, and the @ sign, but you should test the whole address before using it.",
      },
      {
        q: "Is @ in the same punctuation chart as question mark?",
        a: "Yes. Both are supported punctuation marks in the MorseWords punctuation reference.",
      },
      {
        q: "Why does my at sign not decode?",
        a: "The at sign pattern must stay as one separated group. Lost spaces can merge it into surrounding letters.",
      },
    ],
    metaTitle: "At Sign in Morse Code | Pattern, Examples, and Audio | MorseWords",
    metaDescription:
      "See the at sign in Morse code, copy .--.-., hear it as audio, and use examples for email-like or contact text.",
    keywords:
      "at sign in morse code, @ in morse code, morse code at sign, email morse code",
  },
};

export const GUIDE_PAGES: Record<string, GuidePageContent> = {
  "how-to-read-morse-code": {
    slug: "how-to-read-morse-code",
    path: "/how-to-read-morse-code",
    eyebrow: "Reading guide",
    h1: "How to Read Morse Code",
    metaTitle: "How to Read Morse Code | Rhythm, Spacing, and Examples | MorseWords",
    metaDescription:
      "Learn how to read Morse code by rhythm, letter boundaries, word spacing, and worked examples from E and T through SOS, CQ, TEST, and HELLO.",
    keywords:
      "how to read morse code, read morse code, morse rhythm, morse spacing, morse code examples",
    answerSummary:
      "Read Morse code by hearing or grouping each letter pattern, then using the gaps to decide where letters and words end. Treat dots and dashes as rhythm first, not just marks on a page.",
    guideTitle: "A practical way to read Morse",
    guideDescription:
      "Start with short rhythms, keep letter boundaries visible, and move into words only after the pattern is clear.",
    steps: [
      {
        title: "Hear the rhythm",
        text: "A dot is a short sound and a dash is a longer sound. Reading gets easier when E feels like dit and T feels like dah.",
      },
      {
        title: "Find letter boundaries",
        text: "A separated group of dots and dashes usually represents one character. Do not merge adjacent groups.",
      },
      {
        title: "Watch word gaps",
        text: "A wider pause, slash, or 7-space gap marks a word boundary in copied Morse.",
      },
      {
        title: "Check unknown groups",
        text: "If a group does not decode cleanly, compare it with the alphabet or dictionary before guessing.",
      },
    ],
    examplesTitle: "Worked reading examples",
    examplesDescription:
      "These examples move from one-mark letters to full words and radio-style copy.",
    examples: [
      { title: "E", text: "E", morse: morseForText("E"), note: "One short dit." },
      { title: "T", text: "T", morse: morseForText("T"), note: "One longer dah." },
      { title: "A", text: "A", morse: morseForText("A"), note: "Dit then dah." },
      { title: "N", text: "N", morse: morseForText("N"), note: "Dah then dit." },
      { title: "S", text: "S", morse: morseForText("S"), note: "Three short dits." },
      { title: "O", text: "O", morse: morseForText("O"), note: "Three longer dahs." },
      { title: "SOS", text: "SOS", morse: morseForText("SOS"), note: "S O S as three separated letters." },
      { title: "CQ", text: "CQ", morse: morseForText("CQ"), note: "A common radio calling phrase." },
      { title: "TEST", text: "TEST", morse: morseForText("TEST"), note: "A simple check word with familiar letters." },
      { title: "HELLO", text: "HELLO", morse: morseForText("HELLO"), note: "A practical word once letter gaps are clear." },
    ],
    mistakesTitle: "Common reading mistakes",
    mistakesDescription:
      "Most reading errors come from staring at marks without preserving timing and boundaries.",
    commonMistakes: [
      {
        title: "Reading only visually",
        text: "Use the printed pattern as a reference, but listen to the rhythm as soon as possible.",
      },
      {
        title: "Ignoring spaces",
        text: "Letter and word boundaries are part of the message. Missing spaces can change the decoded text.",
      },
      {
        title: "Guessing unknown runs",
        text: "If the stream has no gaps, restore likely separators before decoding.",
      },
    ],
    comparisonTitle: "Where to practice reading next",
    comparisonDescription:
      "Use these pages to move from examples into active recognition.",
    comparisonItems: [
      {
        title: "Learn Morse code",
        text: "Follow the full beginner path when you need structure.",
        href: "/learn-morse-code",
        badge: "Learn",
      },
      {
        title: "Alphabet chart",
        text: "Check A-Z patterns while you are still building recall.",
        href: "/morse-code-alphabet",
        badge: "Letters",
      },
      {
        title: "Audio tool",
        text: "Hear the same examples as rhythm instead of only dots and dashes.",
        href: "/audio",
        badge: "Listen",
      },
      {
        title: "Practice",
        text: "Start a short drill once the examples feel familiar.",
        href: "/practice",
        badge: "Drill",
      },
    ],
    nextStepTitle: "Best next step after reading examples",
    nextStepDescription:
      "Move into sound and recall before adding speed.",
    relatedLinks: [
      { href: "/learn-morse-code", label: "Learning path", primary: true },
      { href: "/morse-code-alphabet", label: "Alphabet chart" },
      { href: "/morse-code-timing", label: "Timing guide" },
      { href: "/audio", label: "Audio tool" },
      { href: "/practice", label: "Practice" },
      { href: "/typing", label: "Typing" },
    ],
    faqItems: [
      {
        q: "What is the easiest way to read Morse code?",
        a: "Start by recognizing short rhythms such as E, T, A, N, S, and O, then use spacing to separate letters and words.",
      },
      {
        q: "Should I memorize dots and dashes or sounds?",
        a: "Use dots and dashes for lookup, but practice by sound because Morse is meant to be recognized as rhythm.",
      },
      {
        q: "How do I know where one Morse letter ends?",
        a: "A letter ends at a letter gap. In copied text, that is usually a space between dot-dash groups.",
      },
      {
        q: "What does a slash mean in written Morse?",
        a: "A slash is commonly used as a visible word separator.",
      },
      {
        q: "Can I read Morse without spaces?",
        a: "Not reliably. Many unspaced dot-dash streams can be split into more than one possible message.",
      },
    ],
    schemaType: "LearningResource",
  },
  "how-to-write-in-morse-code": {
    slug: "how-to-write-in-morse-code",
    path: "/how-to-write-in-morse-code",
    eyebrow: "Writing guide",
    h1: "How to Write in Morse Code",
    metaTitle: "How to Write in Morse Code | Letters, Words, and Spacing | MorseWords",
    metaDescription:
      "Learn how to write Morse code with letters, numbers, punctuation, word spaces, slash separators, and examples such as HELLO, SOS, TEST 123, and I LOVE YOU.",
    keywords:
      "how to write in morse code, write morse code, morse spacing, morse code slash, morse punctuation",
    answerSummary:
      "Write Morse code by converting each supported character into dots and dashes, separating letters clearly, and marking word gaps with wider spacing or a slash.",
    guideTitle: "Write Morse without losing the message",
    guideDescription:
      "Good written Morse is about correct patterns plus readable boundaries.",
    steps: [
      {
        title: "Convert each character",
        text: "Use the standard map for letters, numbers, and supported punctuation.",
      },
      {
        title: "Separate letters",
        text: "Leave a visible space between each letter pattern so the result can decode cleanly.",
      },
      {
        title: "Separate words",
        text: "Use a wider gap or slash between words when Morse is copied as text.",
      },
      {
        title: "Check punctuation",
        text: "Punctuation has its own patterns. Do not substitute a word separator for a real slash mark.",
      },
    ],
    examplesTitle: "Written Morse examples",
    examplesDescription:
      "These examples show letter gaps, word gaps, numbers, and punctuation in context.",
    examples: [
      { title: "HELLO", text: "HELLO", morse: morseForText("HELLO"), note: "One word with five separated letters." },
      { title: "SOS", text: "SOS", morse: morseForText("SOS"), note: "Three separated letters in the written form." },
      { title: "TEST 123", text: "TEST 123", morse: morseForText("TEST 123").replace(/\s{7,}/g, " / "), note: "Slash shows the word gap between text and numbers." },
      { title: "I LOVE YOU", text: "I LOVE YOU", morse: morseForText("I LOVE YOU").replace(/\s{7,}/g, " / "), note: "Slash separators make the phrase easier to verify." },
    ],
    mistakesTitle: "Common writing mistakes",
    mistakesDescription:
      "Written Morse can look correct while still being hard to decode.",
    commonMistakes: [
      {
        title: "Collapsing spaces",
        text: "Do not remove the spaces between letter patterns.",
      },
      {
        title: "Using slash without context",
        text: "Slash can mean a word break in copied Morse, but slash is also real punctuation in plain text.",
      },
      {
        title: "Skipping punctuation",
        text: "If the source text has punctuation, check the punctuation chart before omitting it.",
      },
    ],
    comparisonTitle: "Writing helpers",
    comparisonDescription:
      "Use the tool that matches your source text and formatting goal.",
    comparisonItems: [
      {
        title: "Morse encoder",
        text: "Convert normal text into properly spaced Morse.",
        href: "/morse-code-encoder",
        badge: "Encode",
      },
      {
        title: "Word separator",
        text: "Switch between wide gaps, slashes, pipes, and line breaks.",
        href: "/morse-code-word-separator",
        badge: "Spacing",
      },
      {
        title: "Punctuation",
        text: "Look up question marks, at signs, slashes, and other symbols.",
        href: "/morse-code-punctuation",
        badge: "Symbols",
      },
      {
        title: "Numbers",
        text: "Review 0-9 patterns before writing codes or dates.",
        href: "/morse-code-numbers",
        badge: "0-9",
      },
    ],
    nextStepTitle: "Best next step after writing Morse",
    nextStepDescription:
      "Check the output, then listen or decode it to verify the spacing.",
    relatedLinks: [
      { href: "/morse-code-encoder", label: "Encode text", primary: true },
      { href: "/morse-code-word-separator", label: "Spacing guide" },
      { href: "/morse-code-punctuation", label: "Punctuation" },
      { href: "/morse-code-alphabet", label: "Alphabet" },
      { href: "/morse-code-numbers", label: "Numbers" },
    ],
    faqItems: [
      {
        q: "How do I write words in Morse code?",
        a: "Convert each character, keep spaces between letters, and use a wider gap or slash between words.",
      },
      {
        q: "Can I write punctuation in Morse code?",
        a: "Yes. Common punctuation has its own Morse patterns in the punctuation chart.",
      },
      {
        q: "What does a slash mean when writing Morse?",
        a: "A slash often marks a word break in copied Morse, but slash can also be encoded as punctuation if it is part of the source text.",
      },
      {
        q: "Should Morse code be uppercase?",
        a: "Morse itself has no case. MorseWords normalizes text to uppercase before encoding.",
      },
      {
        q: "How can I check written Morse?",
        a: "Paste it into the decoder or play it with the audio tool after preserving the letter and word gaps.",
      },
    ],
    schemaType: "LearningResource",
  },
  "how-to-type-in-morse-code": {
    slug: "how-to-type-in-morse-code",
    path: "/how-to-type-in-morse-code",
    eyebrow: "Typing guide",
    h1: "How to Type in Morse Code",
    metaTitle: "How to Type in Morse Code | Keyboard, Mobile, and Practice Tips | MorseWords",
    metaDescription:
      "Learn how to type Morse code with dots, hyphens, spaces, slashes, mobile keyboards, and practice workflows without confusing typed Morse with audio recognition.",
    keywords:
      "how to type in morse code, type morse code, morse keyboard, mobile morse typing, morse typing practice",
    answerSummary:
      "Type Morse code with periods for dots, hyphens for dashes, spaces between letters, and slashes or wider spaces between words. Typing is useful, but it is different from recognizing Morse by sound.",
    guideTitle: "Typed Morse conventions",
    guideDescription:
      "Use simple keyboard characters so your Morse can be pasted, decoded, and practiced reliably.",
    steps: [
      {
        title: "Use period for dot",
        text: "A normal period is the most compatible typed dot.",
      },
      {
        title: "Use hyphen for dash",
        text: "Use the keyboard hyphen, not a long dash copied from rich text.",
      },
      {
        title: "Add separators",
        text: "Use spaces between letters and slashes or wider gaps between words.",
      },
      {
        title: "Practice separately",
        text: "Typing patterns builds recall, but audio recognition still needs listening practice.",
      },
    ],
    examplesTitle: "Typed Morse examples",
    examplesDescription:
      "These examples use safe keyboard characters that work across most apps.",
    examples: [
      { title: "SOS", text: "SOS", morse: "... --- ...", note: "Periods and hyphens with spaces between letters." },
      { title: "HELLO", text: "HELLO", morse: morseForText("HELLO"), note: "Each letter is separated before decoding." },
      { title: "CQ TEST", text: "CQ TEST", morse: morseForText("CQ TEST").replace(/\s{7,}/g, " / "), note: "Slash makes the word break visible." },
    ],
    mistakesTitle: "Common typing mistakes",
    mistakesDescription:
      "Most typed Morse failures come from lookalike characters or missing gaps.",
    commonMistakes: [
      {
        title: "Using long dashes",
        text: "Use hyphen (-), not en dash, em dash, or minus symbols from formatted text.",
      },
      {
        title: "Using bullet dots",
        text: "Use periods (.), not bullet characters that some apps insert.",
      },
      {
        title: "Skipping audio",
        text: "Typing practice is useful, but it does not replace hearing the signal.",
      },
    ],
    comparisonTitle: "Typing and practice tools",
    comparisonDescription:
      "Choose a tool based on whether you need entry, conversion, or recall.",
    comparisonItems: [
      {
        title: "Typing practice",
        text: "Practice typed answers from Morse prompts.",
        href: "/typing",
        badge: "Typing",
      },
      {
        title: "Encoder",
        text: "Convert normal text into typed Morse output.",
        href: "/morse-code-encoder",
        badge: "Encode",
      },
      {
        title: "Decoder",
        text: "Read typed dots and dashes back into text.",
        href: "/morse-code-decoder",
        badge: "Decode",
      },
      {
        title: "Audio",
        text: "Hear typed Morse as sound for rhythm practice.",
        href: "/audio",
        badge: "Listen",
      },
    ],
    nextStepTitle: "Best next step after typing Morse",
    nextStepDescription:
      "Use the typed result to decode, hear, or practice the same pattern.",
    relatedLinks: [
      { href: "/typing", label: "Typing practice", primary: true },
      { href: "/morse-code-encoder", label: "Encoder" },
      { href: "/morse-code-decoder", label: "Decoder" },
      { href: "/practice", label: "Practice" },
      { href: "/audio", label: "Audio" },
    ],
    faqItems: [
      {
        q: "What keys should I use to type Morse code?",
        a: "Use period for dot, hyphen for dash, spaces for letter gaps, and slash or wider spaces for word gaps.",
      },
      {
        q: "Can I type Morse code on mobile?",
        a: "Yes, but check that your keyboard is not replacing hyphens or periods with lookalike characters.",
      },
      {
        q: "Is typing Morse the same as learning Morse audio?",
        a: "No. Typing builds visual and keyboard recall, while audio practice builds rhythm recognition.",
      },
      {
        q: "Why did pasted typed Morse fail to decode?",
        a: "The most common causes are missing spaces, bullet dots, or long dash characters.",
      },
    ],
    schemaType: "LearningResource",
  },
  "copy-and-paste-morse-code": {
    slug: "copy-and-paste-morse-code",
    path: "/copy-and-paste-morse-code",
    eyebrow: "Copy guide",
    h1: "Copy and Paste Morse Code",
    metaTitle: "Copy and Paste Morse Code | Dots, Dashes, Spaces, and Slashes | MorseWords",
    metaDescription:
      "Learn how to copy and paste Morse code safely with period dots, hyphen dashes, slashes, spaces, and notes about app compatibility.",
    keywords:
      "copy and paste morse code, morse code copy paste, dots dashes spaces slashes, paste morse code",
    answerSummary:
      "Use plain periods for dots, hyphens for dashes, spaces for letter gaps, and slashes or wider spaces for word gaps. Avoid decorative dot and dash lookalikes when copying Morse between apps.",
    guideTitle: "Safe copy-paste Morse characters",
    guideDescription:
      "Plain ASCII characters survive across more apps and decode more reliably.",
    steps: [
      {
        title: "Use . for dot",
        text: "The period character is the safest typed dot.",
      },
      {
        title: "Use - for dash",
        text: "The hyphen is the safest typed dash.",
      },
      {
        title: "Keep spaces",
        text: "Spaces separate letters and words. Do not collapse them automatically.",
      },
      {
        title: "Use / for word gaps",
        text: "A slash is useful when an app trims repeated spaces.",
      },
    ],
    examplesTitle: "Copy-ready examples",
    examplesDescription:
      "These examples show standard spacing and slash-separated words.",
    examples: [
      { title: "SOS", text: "SOS", morse: "... --- ...", note: "Simple letter-separated Morse." },
      { title: "HELLO WORLD", text: "HELLO WORLD", morse: morseForText("HELLO WORLD").replace(/\s{7,}/g, " / "), note: "Slash keeps the word gap visible." },
      { title: "COPY?", text: "COPY?", morse: morseForText("COPY?"), note: "Question mark punctuation remains part of the message." },
    ],
    mistakesTitle: "Why copied Morse breaks",
    mistakesDescription:
      "Rich text and messaging apps often alter characters or spacing.",
    commonMistakes: [
      {
        title: "Dot lookalikes",
        text: "Bullets, middle dots, and decorative dots may not decode everywhere.",
      },
      {
        title: "Dash lookalikes",
        text: "Long dashes, minus signs, and styled dashes can be different characters from hyphen.",
      },
      {
        title: "Trimmed spaces",
        text: "Some apps collapse multiple spaces. Use slash word separators when that happens.",
      },
    ],
    comparisonTitle: "Copy-paste helpers",
    comparisonDescription:
      "Use these pages to fix or verify pasted Morse.",
    comparisonItems: [
      {
        title: "Word separator",
        text: "Normalize spaces, slashes, pipes, and line breaks.",
        href: "/morse-code-word-separator",
        badge: "Spacing",
      },
      {
        title: "Decoder",
        text: "Check whether pasted Morse decodes to the expected text.",
        href: "/morse-code-decoder",
        badge: "Decode",
      },
      {
        title: "Encoder",
        text: "Create clean Morse from normal text before copying it.",
        href: "/morse-code-encoder",
        badge: "Encode",
      },
      {
        title: "Punctuation",
        text: "Check symbols such as ?, @, slash, and period.",
        href: "/morse-code-punctuation",
        badge: "Symbols",
      },
    ],
    nextStepTitle: "Best next step after copying Morse",
    nextStepDescription:
      "Decode or play the copied result to make sure the spacing survived.",
    relatedLinks: [
      { href: "/morse-code-word-separator", label: "Spacing guide", primary: true },
      { href: "/morse-code-decoder", label: "Decode pasted Morse" },
      { href: "/morse-code-encoder", label: "Encode clean Morse" },
      { href: "/morse-code-punctuation", label: "Punctuation" },
    ],
    faqItems: [
      {
        q: "What characters should I use for copy-paste Morse?",
        a: "Use period dots, hyphen dashes, spaces, and slashes for maximum compatibility.",
      },
      {
        q: "Why did my pasted Morse change?",
        a: "Some apps replace dots, dashes, or repeated spaces with styled characters or trimmed whitespace.",
      },
      {
        q: "Is slash required in Morse code?",
        a: "No. Slash is a written convention for a word break. Timing uses a longer pause.",
      },
      {
        q: "Can I use Unicode dots and dashes?",
        a: "They may look good, but plain period and hyphen are safer for decoding and sharing.",
      },
    ],
    schemaType: "WebPage",
  },
  "morse-code-without-spaces": {
    slug: "morse-code-without-spaces",
    path: "/morse-code-without-spaces",
    eyebrow: "Spacing guide",
    h1: "Morse Code Without Spaces",
    metaTitle: "Morse Code Without Spaces | Why It Is Hard to Decode | MorseWords",
    metaDescription:
      "Learn why Morse code without spaces is ambiguous, how to restore likely letter gaps, and when to use a decoder, dictionary, or word separator.",
    keywords:
      "morse code without spaces, decode morse without spaces, unspaced morse code, morse spacing problems",
    answerSummary:
      "Morse code without spaces cannot always be decoded reliably because the same run of dots and dashes can often be split into different letters or words.",
    guideTitle: "Why unspaced Morse is ambiguous",
    guideDescription:
      "A decoder needs boundaries. Without them, several messages can share the same continuous stream.",
    steps: [
      {
        title: "Restore likely letter gaps",
        text: "Try splitting the run into valid Morse letter groups before decoding.",
      },
      {
        title: "Use known words",
        text: "If you know the topic or expected answer, test likely words against the stream.",
      },
      {
        title: "Try word boundaries",
        text: "Add slashes where word breaks make sense, then decode again.",
      },
      {
        title: "Compare with the dictionary",
        text: "Use lookup pages to verify questionable groups instead of guessing.",
      },
    ],
    examplesTitle: "Ambiguity examples",
    examplesDescription:
      "These examples show why missing spaces are not a small formatting issue.",
    examples: [
      { title: "SOS with no gaps", text: "SOS", morse: "...---...", note: "Usually recognized as SOS, but it is not a general decoding rule." },
      { title: "Letter split choices", text: "ET", morse: ".-", note: ".- can be A, or it can be E then T if a letter gap is inserted." },
      { title: "HELLO with gaps", text: "HELLO", morse: morseForText("HELLO"), note: "The separated version can decode reliably." },
    ],
    mistakesTitle: "Common unspaced Morse mistakes",
    mistakesDescription:
      "Do not ask the decoder to solve a boundary problem it cannot know.",
    commonMistakes: [
      {
        title: "Expecting perfect decoding",
        text: "No tool can always know the intended split without spaces or context.",
      },
      {
        title: "Ignoring known words",
        text: "Use clue text, expected vocabulary, or dictionary matches to test likely splits.",
      },
      {
        title: "Decoding too early",
        text: "Add separators first, then use the decoder.",
      },
    ],
    comparisonTitle: "Tools for spacing problems",
    comparisonDescription:
      "These pages help after you restore at least some boundaries.",
    comparisonItems: [
      {
        title: "Decoder",
        text: "Decode after letter groups are separated.",
        href: "/morse-code-decoder",
        badge: "Decode",
      },
      {
        title: "Word separator",
        text: "Normalize visible word breaks before decoding.",
        href: "/morse-code-word-separator",
        badge: "Spacing",
      },
      {
        title: "Dictionary",
        text: "Compare possible dot-dash groups with supported characters.",
        href: "/dictionary",
        badge: "Lookup",
      },
      {
        title: "Timing guide",
        text: "Learn why pauses matter in real Morse.",
        href: "/morse-code-timing",
        badge: "Timing",
      },
    ],
    nextStepTitle: "Best next step for unspaced Morse",
    nextStepDescription:
      "Add likely separators, then check the result in the decoder.",
    relatedLinks: [
      { href: "/morse-code-decoder", label: "Decode separated Morse", primary: true },
      { href: "/morse-code-word-separator", label: "Spacing guide" },
      { href: "/dictionary", label: "Dictionary" },
      { href: "/morse-code-timing", label: "Timing guide" },
    ],
    faqItems: [
      {
        q: "Can Morse code without spaces be decoded perfectly?",
        a: "No. Without boundaries, multiple letter splits can be valid, so context is required.",
      },
      {
        q: "Why is ...---... recognized as SOS?",
        a: "SOS is a famous continuous distress pattern, but that does not make all unspaced Morse reliably decodable.",
      },
      {
        q: "What should I do with unspaced Morse?",
        a: "Restore likely letter gaps, add word separators where possible, then use the decoder.",
      },
      {
        q: "Can the dictionary help?",
        a: "Yes. It can help you compare possible Morse groups while rebuilding the spacing.",
      },
    ],
    schemaType: "WebPage",
  },
};

export const FIRST_BATCH_PATHS = [
  "/name-to-morse-code",
  "/morse-code-numbers",
  "/how-to-read-morse-code",
  "/how-to-write-in-morse-code",
  "/how-to-type-in-morse-code",
  "/copy-and-paste-morse-code",
  "/morse-code-without-spaces",
  "/i-love-you-in-morse-code",
  "/cq-in-morse-code",
  "/question-mark-in-morse-code",
  "/at-sign-in-morse-code",
] as const;
