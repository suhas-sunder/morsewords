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
  path: string;
  digit: string;
  label: string;
  displayTitle: string;
  plainTextValue: string;
  morseValue: string;
  spokenRhythm: string;
  answerSummary: string;
  patternExplanation: string;
  soundNotes: ContentTile[];
  typingNotes: ContentTile[];
  commonConfusions: ContentTile[];
  exampleUses: WorkedExample[];
  miniPracticePrompt: ContentTile;
  listeningDrill: ContentTile;
  typingDrill: ContentTile;
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
  isPublicLetter: boolean;
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
    .trim()
    .split(/\s{7,}/)
    .map((word) =>
      word
        .split(/\s{3,}/)
        .filter(Boolean)
        .map((pattern) =>
          pattern
            .split("")
            .map((mark, index, marks) => {
              if (mark === "-") return "dah";
              return index === marks.length - 1 ? "dit" : "di";
            })
            .join("-"),
        )
        .join("  "),
    )
    .join(" / ");
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
const PUBLIC_LETTERS = LETTER_ALPHABET;
type PublicLetter = (typeof PUBLIC_LETTERS)[number];

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
  faqCompare,
  faqPractice,
}: {
  letter: string;
  morseValue: string;
  spokenRhythm: string;
  faqCompare?: string;
  faqPractice?: string;
}): ContentFaqItem[] {
  const items: ContentFaqItem[] = [
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

  if (faqCompare) {
    items.push({
      q: `What should I compare ${letter} with?`,
      a: faqCompare,
    });
  }

  if (faqPractice) {
    items.push({
      q: `How should I practice ${letter}?`,
      a: faqPractice,
    });
  }

  return items;
}

const LETTER_RELATED_LETTERS: Record<string, string[]> = {
  A: ["N", "R"],
  B: ["D", "G"],
  C: ["Q", "K"],
  D: ["B", "G"],
  E: ["I", "T"],
  F: ["L", "S"],
  G: ["D", "O"],
  H: ["S", "I"],
  I: ["E", "S"],
  J: ["W", "P"],
  K: ["C", "X"],
  L: ["F", "R"],
  M: ["T", "O"],
  N: ["A", "D"],
  O: ["S", "G"],
  P: ["W", "J"],
  Q: ["C", "Y"],
  R: ["A", "L"],
  S: ["E", "H", "O"],
  T: ["E", "M"],
  U: ["V", "D"],
  V: ["S", "U"],
  W: ["J", "P"],
  X: ["K", "D"],
  Y: ["Q", "C"],
  Z: ["G"],
};

function buildLetterRelatedLinks(letter: string): RelatedLink[] {
  const queryLetter = letter;
  const links: RelatedLink[] = [
    {
      href: "/morse-code-alphabet",
      label: "Alphabet chart",
      description: "Compare this letter with the rest of A-Z.",
      primary: true,
    },
    ...(LETTER_RELATED_LETTERS[letter] ?? []).map((relatedLetter) => ({
      href: `/${relatedLetter.toLowerCase()}-in-morse-code`,
      label: `${relatedLetter} in Morse`,
      description: `Compare ${letter} with ${relatedLetter}.`,
    })),
  ];

  if (letter === "S" || letter === "O") {
    links.push({
      href: "/morse-code-sos",
      label: "Study SOS",
      description: "See this letter inside a complete emergency signal.",
    });
  }

  if (letter === "C" || letter === "Q") {
    links.push({
      href: "/cq-in-morse-code",
      label: "CQ in Morse",
      description: "See this letter inside a common calling signal.",
    });
  }

  if (letter === "Q") {
    links.push({
      href: "/morse-code-q-codes",
      label: "Q-codes",
      description: "Review common Q-code abbreviations.",
    });
  }

  links.push(
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
  );

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

type LetterStudyGuidance = {
  whatItIs: string;
  soundNotes: ContentTile[];
  commonConfusions: ContentTile[];
  miniPracticePrompt: ContentTile;
  listeningDrill: ContentTile;
  typingDrill: ContentTile;
  metaDescription: string;
  faqCompare: string;
  faqPractice: string;
};

const LETTER_STUDY_GUIDANCE: Record<string, LetterStudyGuidance> = {
  B: {
    whatItIs:
      "B starts with one long dah and then snaps through three short dits. That shape makes the first sound the anchor, then the rest of the letter runs quickly.",
    soundNotes: [
      {
        title: "Hear the opening dah",
        text: "Listen for the long first mark before the three quick marks. If the first mark is not clearly longer, B can blur into a run of short dits.",
      },
      {
        title: "Keep it separate from 6",
        text: "B and the number 6 share a long-first feel, but numbers are five-mark characters. Count the total marks before deciding.",
        href: "/morse-code-numbers",
      },
    ],
    commonConfusions: [
      {
        title: "B vs D",
        text: "D has the same long-first opening but stops after two short marks. B has one extra dit at the end.",
        href: "/d-in-morse-code",
      },
      {
        title: "B vs 6",
        text: "The number 6 is longer. If you hear five marks, treat it as a number candidate instead of a letter.",
        href: "/morse-code-numbers",
      },
    ],
    miniPracticePrompt: {
      title: "Practice B in short bursts",
      text: "Alternate B with D, then copy B inside BRAVO, CAB, and BEE so the extra final dit becomes obvious.",
    },
    listeningDrill: {
      title: "Listening drill",
      text: "Play B, D, and 6 in a mixed order. Call out whether the signal has three, four, or five total marks.",
      href: "/audio?text=B%20D%206",
    },
    typingDrill: {
      title: "Typing drill",
      text: "Type BEE, CAB, and BRAVO, then check that every B keeps the long mark first and three short marks after it.",
      href: "/morse-code-encoder?text=BEE%20CAB%20BRAVO",
    },
    metaDescription:
      "Learn B in Morse code with its long-first rhythm, common B vs D and B vs 6 mistakes, copy tips, audio practice, and examples.",
    faqCompare:
      "B is most often mixed with D because both start with a dah. Count the short marks after the opening dah: B has three, while D has two.",
    faqPractice:
      "Practice B by mixing it with D first, then add number 6 once you are comfortable counting four-mark versus five-mark signals.",
  },
  C: {
    whatItIs:
      "C is an alternating long-short-long-short Morse letter. The back-and-forth rhythm matters more than trying to memorize it as four separate symbols.",
    soundNotes: [
      {
        title: "Hear the alternating rhythm",
        text: "C should feel like a steady switch between dah and dit. If the spacing gets uneven, it can sound like two smaller letter fragments.",
      },
      {
        title: "Useful in CQ practice",
        text: "C is one half of CQ, a common radio-style calling pattern, but the letter is useful outside that phrase too.",
        href: "/cq-in-morse-code",
      },
    ],
    commonConfusions: [
      {
        title: "C vs Q",
        text: "C alternates all the way through. Q starts with two long marks, so the first half of the sound is heavier.",
        href: "/q-in-morse-code",
      },
      {
        title: "C vs K",
        text: "K has the same long-short-long start, but it stops there. C adds one final short mark.",
        href: "/k-in-morse-code",
      },
    ],
    miniPracticePrompt: {
      title: "Practice C without relying on CQ",
      text: "Copy C inside CODE, CAT, and COPY, then compare it with Q so you hear the lighter alternating rhythm.",
    },
    listeningDrill: {
      title: "Listening drill",
      text: "Play C, Q, and K together. Listen for whether the signal alternates or starts with two long marks.",
      href: "/audio?text=C%20Q%20K",
    },
    typingDrill: {
      title: "Typing drill",
      text: "Encode CODE, COPY, and CQ, then check that C keeps the long-short-long-short order.",
      href: "/morse-code-encoder?text=CODE%20COPY%20CQ",
    },
    metaDescription:
      "Learn C in Morse code with its alternating rhythm, CQ context, C vs Q and C vs K comparisons, examples, and practice drills.",
    faqCompare:
      "C is commonly confused with Q and K. Q begins with two long marks, while K is the shorter long-short-long pattern.",
    faqPractice:
      "Practice C by mixing CODE and CQ, then add K so you learn when the alternating pattern stops and when it continues.",
  },
  D: {
    whatItIs:
      "D is one long dah followed by two short dits. It is compact, but the opening long mark must stay clear.",
    soundNotes: [
      {
        title: "Start strong, finish short",
        text: "Hear D as one long sound followed by two quick taps. The letter should not trail into a fourth mark.",
      },
      {
        title: "Useful dash practice",
        text: "D helps beginners practice starting a letter with a long mark and then switching quickly to shorter marks.",
      },
    ],
    commonConfusions: [
      {
        title: "D vs B",
        text: "B has the same opening but one extra short mark. If you count only two dits after the dah, it is D.",
        href: "/b-in-morse-code",
      },
      {
        title: "D vs G",
        text: "G starts with two long marks before the final short mark. D has only one long mark.",
        href: "/g-in-morse-code",
      },
    ],
    miniPracticePrompt: {
      title: "Practice D by counting the tail",
      text: "Alternate D with B and G, then encode DAY, CODE, and DASH to lock in the two-dit ending.",
    },
    listeningDrill: {
      title: "Listening drill",
      text: "Play D, B, and G. First identify how many long marks you hear, then count the short tail.",
      href: "/audio?text=D%20B%20G",
    },
    typingDrill: {
      title: "Typing drill",
      text: "Type DAY, CODE, and DASH, then verify each D has one dah and two dits.",
      href: "/morse-code-encoder?text=DAY%20CODE%20DASH",
    },
    metaDescription:
      "Learn D in Morse code with its one-dah two-dit rhythm, B and G confusion checks, typing tips, examples, and audio drills.",
    faqCompare:
      "D is often confused with B and G. B adds another short mark, while G changes the opening into two long marks.",
    faqPractice:
      "Practice D by mixing it with B and G until you can identify the one-long, two-short rhythm without counting slowly.",
  },
  F: {
    whatItIs:
      "F starts with two short dits, moves to one longer dah, and finishes with one dit. The turn in the middle is the part to listen for.",
    soundNotes: [
      {
        title: "Hear the middle dah",
        text: "F should not sound like a flat run of short marks. The third mark is longer and gives the letter its shape.",
      },
      {
        title: "Keep spacing even",
        text: "Weak spacing can make F sound like separate fragments instead of one four-mark letter.",
      },
    ],
    commonConfusions: [
      {
        title: "F vs L",
        text: "L starts with a dit, then a dah, then two dits. F starts with two dits before the dah.",
        href: "/l-in-morse-code",
      },
      {
        title: "F vs S",
        text: "S is only three short dits. F adds a longer mark before the final dit.",
        href: "/s-in-morse-code",
      },
    ],
    miniPracticePrompt: {
      title: "Practice F with L",
      text: "Copy F and L back to back, then encode FAR, FAST, and FOX to practice the middle-dah shape.",
    },
    listeningDrill: {
      title: "Listening drill",
      text: "Play F, L, and S. Listen for whether the dah appears after one dit or after two dits.",
      href: "/audio?text=F%20L%20S",
    },
    typingDrill: {
      title: "Typing drill",
      text: "Encode FAR, FAST, and FOX, then check that F starts with two short marks.",
      href: "/morse-code-encoder?text=FAR%20FAST%20FOX",
    },
    metaDescription:
      "Learn F in Morse code with its two-dit opening, middle dah, F vs L comparison, copy guidance, examples, and practice drills.",
    faqCompare:
      "F is often confused with L. The easiest check is where the dah appears: F has two short marks before it, L has one.",
    faqPractice:
      "Practice F by alternating F and L, then add real words like FAR and FAST so the rhythm appears in context.",
  },
  G: {
    whatItIs:
      "G is two long dahs followed by one short dit. It has a heavier opening than D and a shorter ending than O.",
    soundNotes: [
      {
        title: "Hear the double dah",
        text: "The first half of G is two long marks. Do not rush them into a single long blur.",
      },
      {
        title: "Finish with one short mark",
        text: "The final dit is what separates G from O, which stays long for all three marks.",
      },
    ],
    commonConfusions: [
      {
        title: "G vs D",
        text: "D starts with one long mark. G starts with two.",
        href: "/d-in-morse-code",
      },
      {
        title: "G vs O",
        text: "O is three long marks. G changes the last mark to a short dit.",
        href: "/o-in-morse-code",
      },
    ],
    miniPracticePrompt: {
      title: "Practice G by hearing the ending",
      text: "Alternate G with O, then type GO, SIGN, and GOLF so the final short mark becomes automatic.",
    },
    listeningDrill: {
      title: "Listening drill",
      text: "Play G, O, and D. Decide whether the signal starts with one dah or two, then listen to the final mark.",
      href: "/audio?text=G%20O%20D",
    },
    typingDrill: {
      title: "Typing drill",
      text: "Encode GO, SIGN, and GOLF, then verify the final mark in G is short.",
      href: "/morse-code-encoder?text=GO%20SIGN%20GOLF",
    },
    metaDescription:
      "Learn G in Morse code with its two-dah opening, G vs D and G vs O comparisons, examples, audio practice, and copy tips.",
    faqCompare:
      "G is most often mixed with D and O. D has only one opening dah, while O has three dahs and no final dit.",
    faqPractice:
      "Practice G by alternating G and O first, then add D to train both the opening and the ending.",
  },
  H: {
    whatItIs:
      "H is four short dits in a row. It is simple to write, but it requires clean timing so it does not collapse into S.",
    soundNotes: [
      {
        title: "Hear all four dits",
        text: "H should sound like four short, evenly spaced taps. Missing the last tap changes the letter.",
      },
      {
        title: "Do not rush the run",
        text: "Fast practice is fine, but the marks still need enough separation to stay countable.",
      },
    ],
    commonConfusions: [
      {
        title: "H vs S",
        text: "S is three short dits. H is the same short sound with one more dit.",
        href: "/s-in-morse-code",
      },
      {
        title: "H vs 5",
        text: "The number 5 is five short dits, so H sits between S and 5 by count.",
        href: "/morse-code-numbers",
      },
    ],
    miniPracticePrompt: {
      title: "Practice H by counting short marks",
      text: "Copy S, H, and 5 in a mixed order, then encode HI, HELP, and HEAR.",
    },
    listeningDrill: {
      title: "Listening drill",
      text: "Play S, H, and 5. Count short marks only, without looking at the text.",
      href: "/audio?text=S%20H%205",
    },
    typingDrill: {
      title: "Typing drill",
      text: "Encode HI, HELP, and HEAR, then check that H has exactly four short marks.",
      href: "/morse-code-encoder?text=HI%20HELP%20HEAR",
    },
    metaDescription:
      "Learn H in Morse code with its four-dit rhythm, H vs S and H vs 5 mistakes, typing guidance, examples, and drills.",
    faqCompare:
      "H is commonly confused with S and 5 because all three use only short marks. Count three for S, four for H, and five for 5.",
    faqPractice:
      "Practice H by mixing it with S first, then add 5 once the four-dit count feels reliable.",
  },
  I: {
    whatItIs:
      "I is two short dits. It is one of the shortest Morse letters, so extra marks or loose spacing quickly change what the listener hears.",
    soundNotes: [
      {
        title: "Hear two clean dits",
        text: "I should sound like two short taps with a clear stop after the second one.",
      },
      {
        title: "Keep it distinct from E",
        text: "E is only one dit. If a second short mark appears, the letter is I.",
        href: "/e-in-morse-code",
      },
    ],
    commonConfusions: [
      {
        title: "I vs E",
        text: "E is one short mark. I is two short marks.",
        href: "/e-in-morse-code",
      },
      {
        title: "I vs S",
        text: "S is three short marks. I stops after two.",
        href: "/s-in-morse-code",
      },
    ],
    miniPracticePrompt: {
      title: "Practice I in tiny groups",
      text: "Alternate E, I, and S, then encode I, SIGN, and TIME to practice stopping after two dits.",
    },
    listeningDrill: {
      title: "Listening drill",
      text: "Play E, I, and S. Count only short marks and stop as soon as the letter ends.",
      href: "/audio?text=E%20I%20S",
    },
    typingDrill: {
      title: "Typing drill",
      text: "Encode I, SIGN, and TIME, then verify I never receives a third dit.",
      href: "/morse-code-encoder?text=I%20SIGN%20TIME",
    },
    metaDescription:
      "Learn I in Morse code with its two-dit sound, I vs E and I vs S comparisons, copy tips, examples, and practice drills.",
    faqCompare:
      "I is most often confused with E and S. The difference is only the count: one, two, or three short marks.",
    faqPractice:
      "Practice I in short groups with E and S before using it inside longer words.",
  },
  J: {
    whatItIs:
      "J begins with one short dit and then holds three longer dahs. The long ending makes it feel larger than W.",
    soundNotes: [
      {
        title: "Hear the long tail",
        text: "After the first short mark, J stays long for the rest of the letter.",
      },
      {
        title: "Check it against 1",
        text: "The number 1 starts the same way but has four long marks after the first dit.",
        href: "/morse-code-numbers",
      },
    ],
    commonConfusions: [
      {
        title: "J vs W",
        text: "W has one short mark and two long marks. J adds one more long mark.",
        href: "/w-in-morse-code",
      },
      {
        title: "J vs 1",
        text: "The number 1 is a five-mark number, so it keeps going after J would stop.",
        href: "/morse-code-numbers",
      },
    ],
    miniPracticePrompt: {
      title: "Practice J by feeling the length",
      text: "Alternate J with W and 1, then encode JOSH, JOIN, and JULIET.",
    },
    listeningDrill: {
      title: "Listening drill",
      text: "Play W, J, and 1. Listen for how many long marks follow the first dit.",
      href: "/audio?text=W%20J%201",
    },
    typingDrill: {
      title: "Typing drill",
      text: "Encode JOSH, JOIN, and JULIET, then check that J has one short mark and three long marks.",
      href: "/morse-code-encoder?text=JOSH%20JOIN%20JULIET",
    },
    metaDescription:
      "Learn J in Morse code with its one-short three-long rhythm, J vs W and J vs 1 comparisons, examples, and drills.",
    faqCompare:
      "J is commonly confused with W and 1. W stops one dah earlier, while 1 continues one dah longer.",
    faqPractice:
      "Practice J by grouping W, J, and 1 so the letter length becomes easy to hear.",
  },
  K: {
    whatItIs:
      "K is long-short-long. It has a balanced rhythm that is useful in procedural and radio-style Morse practice.",
    soundNotes: [
      {
        title: "Hear the center dit",
        text: "K is built around the short mark in the middle. The two outside marks are longer.",
      },
      {
        title: "Keep it from turning into C",
        text: "C starts with the same three marks but adds a final short mark.",
        href: "/c-in-morse-code",
      },
    ],
    commonConfusions: [
      {
        title: "K vs C",
        text: "C is K plus one final dit. If the signal stops after long-short-long, it is K.",
        href: "/c-in-morse-code",
      },
      {
        title: "K vs X",
        text: "X starts with a long mark and includes two short marks in the middle before the final dah.",
        href: "/x-in-morse-code",
      },
    ],
    miniPracticePrompt: {
      title: "Practice K as a centered rhythm",
      text: "Copy K, C, and X, then encode KEY, KATIE, and KILO.",
    },
    listeningDrill: {
      title: "Listening drill",
      text: "Play K, C, and X. Listen for whether there is one center dit or two short marks in the middle.",
      href: "/audio?text=K%20C%20X",
    },
    typingDrill: {
      title: "Typing drill",
      text: "Encode KEY, KATIE, and KILO, then verify K ends with a long mark.",
      href: "/morse-code-encoder?text=KEY%20KATIE%20KILO",
    },
    metaDescription:
      "Learn K in Morse code with its long-short-long rhythm, K vs C and K vs X comparisons, examples, and practice tips.",
    faqCompare:
      "K is commonly confused with C and X. C adds a final short mark, while X has two short marks in the middle.",
    faqPractice:
      "Practice K by mixing it with C first, then add X when you are ready to compare the middle of the rhythm.",
  },
  L: {
    whatItIs:
      "L starts short, moves long, and then finishes with two short marks. It is a four-mark letter where the middle turn matters.",
    soundNotes: [
      {
        title: "Hear the early dah",
        text: "The second mark in L is long. If the long mark comes later, you may be hearing F instead.",
      },
      {
        title: "Do not drop the ending",
        text: "L needs two short marks after the dah. Dropping one can make the rhythm feel like R.",
      },
    ],
    commonConfusions: [
      {
        title: "L vs F",
        text: "F has two short marks before the dah. L has only one short mark before the dah.",
        href: "/f-in-morse-code",
      },
      {
        title: "L vs R",
        text: "R is short-long-short. L adds one more short mark at the end.",
        href: "/r-in-morse-code",
      },
    ],
    miniPracticePrompt: {
      title: "Practice L with F and R",
      text: "Alternate L, F, and R, then encode LOVE, CALL, and LIMA.",
    },
    listeningDrill: {
      title: "Listening drill",
      text: "Play L, F, and R. Notice where the long mark appears and whether the letter has three or four marks.",
      href: "/audio?text=L%20F%20R",
    },
    typingDrill: {
      title: "Typing drill",
      text: "Encode LOVE, CALL, and LIMA, then check the two short marks after the dah.",
      href: "/morse-code-encoder?text=LOVE%20CALL%20LIMA",
    },
    metaDescription:
      "Learn L in Morse code with its early-dah rhythm, L vs F and L vs R comparisons, examples, copy tips, and drills.",
    faqCompare:
      "L is usually confused with F or R. Check where the dah appears and whether there are two final short marks.",
    faqPractice:
      "Practice L by mixing L, F, and R, then use words like LOVE and CALL to hear L in context.",
  },
  M: {
    whatItIs:
      "M is two long dahs. It is the long-mark partner to I, which uses two short marks.",
    soundNotes: [
      {
        title: "Hear two full dahs",
        text: "M should sound like two separate long marks, not one stretched tone.",
      },
      {
        title: "Stop before O",
        text: "O is three long marks. M stops after two.",
        href: "/o-in-morse-code",
      },
    ],
    commonConfusions: [
      {
        title: "M vs T",
        text: "T is one long mark. M is two.",
        href: "/t-in-morse-code",
      },
      {
        title: "M vs O",
        text: "O adds a third long mark after M.",
        href: "/o-in-morse-code",
      },
    ],
    miniPracticePrompt: {
      title: "Practice M by counting dahs",
      text: "Alternate T, M, and O, then encode ME, MAY, and MORSE.",
    },
    listeningDrill: {
      title: "Listening drill",
      text: "Play T, M, and O. Count long marks only.",
      href: "/audio?text=T%20M%20O",
    },
    typingDrill: {
      title: "Typing drill",
      text: "Encode ME, MAY, and MORSE, then verify M has exactly two dahs.",
      href: "/morse-code-encoder?text=ME%20MAY%20MORSE",
    },
    metaDescription:
      "Learn M in Morse code with its two-dah sound, M vs T and M vs O comparisons, examples, copy tips, and practice drills.",
    faqCompare:
      "M is commonly confused with T and O because all three use long marks. Count one for T, two for M, and three for O.",
    faqPractice:
      "Practice M in the T-M-O group so long-mark counting becomes automatic.",
  },
  N: {
    whatItIs:
      "N is one long dah followed by one short dit. It is the exact reverse of A, so order is the main thing to protect.",
    soundNotes: [
      {
        title: "Hear the reversal",
        text: "N starts long and ends short. A starts short and ends long.",
        href: "/a-in-morse-code",
      },
      {
        title: "Keep the stop clean",
        text: "Do not add extra dits after N. Extra short marks can turn the sound toward D or B.",
      },
    ],
    commonConfusions: [
      {
        title: "N vs A",
        text: "A is short-long. N is long-short.",
        href: "/a-in-morse-code",
      },
      {
        title: "N vs D",
        text: "D keeps going with one more short mark after N.",
        href: "/d-in-morse-code",
      },
    ],
    miniPracticePrompt: {
      title: "Practice N against A",
      text: "Alternate A and N until the reversal is automatic, then encode NO, NAME, and TONE.",
    },
    listeningDrill: {
      title: "Listening drill",
      text: "Play A, N, and D. Identify whether the first mark is short or long before counting the rest.",
      href: "/audio?text=A%20N%20D",
    },
    typingDrill: {
      title: "Typing drill",
      text: "Encode NO, NAME, and TONE, then verify N starts with the dah.",
      href: "/morse-code-encoder?text=NO%20NAME%20TONE",
    },
    metaDescription:
      "Learn N in Morse code with its long-short rhythm, N vs A reversal, N vs D mistake check, examples, and drills.",
    faqCompare:
      "N is most often confused with A because they use the same two marks in reverse order.",
    faqPractice:
      "Practice N by alternating A and N slowly, then add D to avoid adding an accidental extra dit.",
  },
  P: {
    whatItIs:
      "P starts short, holds two long marks, and finishes short. It has a centered long section with short marks on both ends.",
    soundNotes: [
      {
        title: "Hear the two middle dahs",
        text: "P should feel like a short opening, a long middle, and a short close.",
      },
      {
        title: "Separate it from W",
        text: "W starts the same way but stops after two long marks instead of closing with a final dit.",
        href: "/w-in-morse-code",
      },
    ],
    commonConfusions: [
      {
        title: "P vs W",
        text: "W is short-long-long. P adds one final short mark.",
        href: "/w-in-morse-code",
      },
      {
        title: "P vs J",
        text: "J has one short mark followed by three long marks. P closes with a short mark instead.",
        href: "/j-in-morse-code",
      },
    ],
    miniPracticePrompt: {
      title: "Practice P by hearing the close",
      text: "Alternate P, W, and J, then encode PEN, COPY, and PAPA.",
    },
    listeningDrill: {
      title: "Listening drill",
      text: "Play P, W, and J. Listen to whether the final mark is short, long, or absent.",
      href: "/audio?text=P%20W%20J",
    },
    typingDrill: {
      title: "Typing drill",
      text: "Encode PEN, COPY, and PAPA, then verify P ends with a short mark.",
      href: "/morse-code-encoder?text=PEN%20COPY%20PAPA",
    },
    metaDescription:
      "Learn P in Morse code with its short-long-long-short rhythm, P vs W and P vs J comparisons, examples, and drills.",
    faqCompare:
      "P is commonly confused with W and J. W stops earlier, while J replaces the closing short mark with another dah.",
    faqPractice:
      "Practice P by mixing P, W, and J, then use short words like PEN and COPY for context.",
  },
  R: {
    whatItIs:
      "R is short-long-short. It is a compact three-mark letter with one longer sound in the center.",
    soundNotes: [
      {
        title: "Hear the center dah",
        text: "R should sound balanced: short, long, short. The middle mark gives the letter its shape.",
      },
      {
        title: "Avoid turning A into R",
        text: "A is short-long. R adds one more short mark at the end.",
        href: "/a-in-morse-code",
      },
    ],
    commonConfusions: [
      {
        title: "R vs A",
        text: "A stops after short-long. R adds a final short mark.",
        href: "/a-in-morse-code",
      },
      {
        title: "R vs L",
        text: "L also has an early dah, but it has four total marks.",
        href: "/l-in-morse-code",
      },
    ],
    miniPracticePrompt: {
      title: "Practice R by stopping cleanly",
      text: "Alternate A, R, and L, then encode RADIO, READ, and ROMEO.",
    },
    listeningDrill: {
      title: "Listening drill",
      text: "Play A, R, and L. Listen for whether the signal stops after two, three, or four marks.",
      href: "/audio?text=A%20R%20L",
    },
    typingDrill: {
      title: "Typing drill",
      text: "Encode RADIO, READ, and ROMEO, then verify R is short-long-short.",
      href: "/morse-code-encoder?text=RADIO%20READ%20ROMEO",
    },
    metaDescription:
      "Learn R in Morse code with its short-long-short rhythm, R vs A and R vs L comparisons, examples, and practice drills.",
    faqCompare:
      "R is often confused with A and L. A is missing the final dit, while L has one extra dit at the end.",
    faqPractice:
      "Practice R in the A-R-L group so you learn when the same early rhythm should stop.",
  },
  T: {
    whatItIs:
      "T is one long dah. It is the shortest dash letter, so duration is the entire signal.",
    soundNotes: [
      {
        title: "Hear one full dah",
        text: "T should be longer than E, but it still stops after a single mark.",
        href: "/e-in-morse-code",
      },
      {
        title: "Do not accidentally make M",
        text: "A second long mark changes T into M.",
        href: "/m-in-morse-code",
      },
    ],
    commonConfusions: [
      {
        title: "T vs E",
        text: "E is one short mark. T is one long mark.",
        href: "/e-in-morse-code",
      },
      {
        title: "T vs M",
        text: "M is two long marks. T is only one.",
        href: "/m-in-morse-code",
      },
    ],
    miniPracticePrompt: {
      title: "Practice T by contrasting duration",
      text: "Alternate E, T, and M, then encode TEST, TONE, and TIME.",
    },
    listeningDrill: {
      title: "Listening drill",
      text: "Play E, T, and M. Focus on short versus long, then count whether there is a second dah.",
      href: "/audio?text=E%20T%20M",
    },
    typingDrill: {
      title: "Typing drill",
      text: "Encode TEST, TONE, and TIME, then verify T is a single dash.",
      href: "/morse-code-encoder?text=TEST%20TONE%20TIME",
    },
    metaDescription:
      "Learn T in Morse code with its one-dah signal, T vs E and T vs M comparisons, copy guidance, examples, and drills.",
    faqCompare:
      "T is most often confused with E by duration and with M by count. T is one long mark only.",
    faqPractice:
      "Practice T by grouping E, T, and M so you hear both mark length and mark count.",
  },
  U: {
    whatItIs:
      "U has two short dits followed by one long dah. It starts like I and then opens into a longer final mark.",
    soundNotes: [
      {
        title: "Hear the final dah",
        text: "U should sound like two quick taps followed by a held mark.",
      },
      {
        title: "Keep it from becoming V",
        text: "V starts with three short marks before the final dah.",
        href: "/v-in-morse-code",
      },
    ],
    commonConfusions: [
      {
        title: "U vs V",
        text: "V adds one extra short mark before the final dah.",
        href: "/v-in-morse-code",
      },
      {
        title: "U vs D",
        text: "D has the same count but starts with a dah instead of ending with one.",
        href: "/d-in-morse-code",
      },
    ],
    miniPracticePrompt: {
      title: "Practice U by hearing the ending",
      text: "Alternate U, V, and D, then encode USE, TUNE, and UNIT.",
    },
    listeningDrill: {
      title: "Listening drill",
      text: "Play U, V, and D. Listen for whether the long mark comes first or last, then count the short marks.",
      href: "/audio?text=U%20V%20D",
    },
    typingDrill: {
      title: "Typing drill",
      text: "Encode USE, TUNE, and UNIT, then check that U ends with the dah.",
      href: "/morse-code-encoder?text=USE%20TUNE%20UNIT",
    },
    metaDescription:
      "Learn U in Morse code with its two-dit then dah rhythm, U vs V and U vs D comparisons, examples, and practice drills.",
    faqCompare:
      "U is commonly confused with V and D. V adds another opening dit, while D puts the dah at the start.",
    faqPractice:
      "Practice U by alternating U and V first, then add D to train the position of the dah.",
  },
  V: {
    whatItIs:
      "V is three short dits followed by one long dah. It starts like S and then extends into a long final mark.",
    soundNotes: [
      {
        title: "Hear S plus a dah",
        text: "V begins with the same three short marks as S, then adds one longer ending.",
        href: "/s-in-morse-code",
      },
      {
        title: "Do not drop the final mark",
        text: "If the final dah is missing, the signal becomes S.",
      },
    ],
    commonConfusions: [
      {
        title: "V vs S",
        text: "S is three short marks. V adds one long mark after them.",
        href: "/s-in-morse-code",
      },
      {
        title: "V vs U",
        text: "U has two short marks before the dah. V has three.",
        href: "/u-in-morse-code",
      },
    ],
    miniPracticePrompt: {
      title: "Practice V by extending S",
      text: "Alternate S, U, and V, then encode VIA, VOICE, and VICTOR.",
    },
    listeningDrill: {
      title: "Listening drill",
      text: "Play S, U, and V. Listen for how many short marks occur before the final dah.",
      href: "/audio?text=S%20U%20V",
    },
    typingDrill: {
      title: "Typing drill",
      text: "Encode VIA, VOICE, and VICTOR, then check that V ends long.",
      href: "/morse-code-encoder?text=VIA%20VOICE%20VICTOR",
    },
    metaDescription:
      "Learn V in Morse code with its three-dits then dah rhythm, V vs S and V vs U comparisons, examples, and drills.",
    faqCompare:
      "V is often confused with S and U. S has no final dah, while U has only two opening dits.",
    faqPractice:
      "Practice V by listening to S, U, and V together so you hear both the count and the ending.",
  },
  W: {
    whatItIs:
      "W is one short dit followed by two long dahs. It starts like A and then holds one more long mark.",
    soundNotes: [
      {
        title: "Hear A plus one dah",
        text: "W begins short-long like A, then adds another long mark.",
        href: "/a-in-morse-code",
      },
      {
        title: "Stop before J",
        text: "J keeps the long ending going for one more dah.",
        href: "/j-in-morse-code",
      },
    ],
    commonConfusions: [
      {
        title: "W vs J",
        text: "J has one short mark followed by three long marks. W has only two long marks after the dit.",
        href: "/j-in-morse-code",
      },
      {
        title: "W vs P",
        text: "P closes with a short mark after the two dahs. W stops after the second dah.",
        href: "/p-in-morse-code",
      },
    ],
    miniPracticePrompt: {
      title: "Practice W by hearing the stop",
      text: "Alternate W, J, and P, then encode WORD, WAVE, and WHISKEY.",
    },
    listeningDrill: {
      title: "Listening drill",
      text: "Play W, J, and P. Listen for what happens after the two long marks.",
      href: "/audio?text=W%20J%20P",
    },
    typingDrill: {
      title: "Typing drill",
      text: "Encode WORD, WAVE, and WHISKEY, then verify W stops after two dahs.",
      href: "/morse-code-encoder?text=WORD%20WAVE%20WHISKEY",
    },
    metaDescription:
      "Learn W in Morse code with its dit-dah-dah sound, W vs J and W vs P comparisons, examples, and practice drills.",
    faqCompare:
      "W is commonly confused with J and P. J keeps going with another dah, while P adds a final dit.",
    faqPractice:
      "Practice W by mixing it with J and P so the end of the signal becomes clear.",
  },
  X: {
    whatItIs:
      "X starts long, has two short marks in the middle, and closes long. The matching long marks frame the letter.",
    soundNotes: [
      {
        title: "Hear the framed rhythm",
        text: "X has a long opening and long ending, with two short marks between them.",
      },
      {
        title: "Do not reduce the middle",
        text: "If the middle collapses to one short mark, the rhythm moves toward K.",
        href: "/k-in-morse-code",
      },
    ],
    commonConfusions: [
      {
        title: "X vs K",
        text: "K is long-short-long. X adds one more short mark in the middle.",
        href: "/k-in-morse-code",
      },
      {
        title: "X vs D",
        text: "D starts the same but stops after the two short marks. X adds a final dah.",
        href: "/d-in-morse-code",
      },
    ],
    miniPracticePrompt: {
      title: "Practice X by framing the middle",
      text: "Alternate X, K, and D, then encode TEXT, FOX, and XRAY.",
    },
    listeningDrill: {
      title: "Listening drill",
      text: "Play X, K, and D. Listen for the long mark at the end and count the middle dits.",
      href: "/audio?text=X%20K%20D",
    },
    typingDrill: {
      title: "Typing drill",
      text: "Encode TEXT, FOX, and XRAY, then check that X has the closing dah.",
      href: "/morse-code-encoder?text=TEXT%20FOX%20XRAY",
    },
    metaDescription:
      "Learn X in Morse code with its long-short-short-long rhythm, X vs K and X vs D comparisons, examples, and drills.",
    faqCompare:
      "X is often confused with K and D. K has only one short mark in the middle, while D has no closing dah.",
    faqPractice:
      "Practice X by comparing it with K and D, then encode words where X appears at the end, such as FOX.",
  },
  Y: {
    whatItIs:
      "Y starts long, moves short, and finishes with two long marks. It has a heavier ending than C.",
    soundNotes: [
      {
        title: "Hear the long ending",
        text: "After the short second mark, Y holds two long marks to close the letter.",
      },
      {
        title: "Keep it distinct from Q",
        text: "Q starts with two long marks, while Y has only one long mark before the short mark.",
        href: "/q-in-morse-code",
      },
    ],
    commonConfusions: [
      {
        title: "Y vs Q",
        text: "Q begins with two dahs. Y begins with one dah, then a dit.",
        href: "/q-in-morse-code",
      },
      {
        title: "Y vs C",
        text: "C alternates long-short-long-short. Y changes the final short mark into a long one.",
        href: "/c-in-morse-code",
      },
    ],
    miniPracticePrompt: {
      title: "Practice Y by hearing the close",
      text: "Alternate Y, Q, and C, then encode YES, YARD, and YANKEE.",
    },
    listeningDrill: {
      title: "Listening drill",
      text: "Play Y, Q, and C. Focus on the first two marks, then decide whether the ending is long or short.",
      href: "/audio?text=Y%20Q%20C",
    },
    typingDrill: {
      title: "Typing drill",
      text: "Encode YES, YARD, and YANKEE, then verify Y finishes with two dahs.",
      href: "/morse-code-encoder?text=YES%20YARD%20YANKEE",
    },
    metaDescription:
      "Learn Y in Morse code with its dah-dit-dah-dah rhythm, Y vs Q and Y vs C comparisons, examples, and drills.",
    faqCompare:
      "Y is commonly confused with Q and C. Q starts with two dahs, while C has a short final mark instead of a long one.",
    faqPractice:
      "Practice Y by mixing it with Q and C so the opening and ending both become recognizable.",
  },
  Z: {
    whatItIs:
      "Z is two long dahs followed by two short dits. It starts like G but continues with one more short mark.",
    soundNotes: [
      {
        title: "Hear the heavy start",
        text: "Z begins with two long marks, then ends with two short marks.",
      },
      {
        title: "Check it against 7",
        text: "The number 7 starts with two long marks too, but it is a five-mark number with three short marks after them.",
        href: "/morse-code-numbers",
      },
    ],
    commonConfusions: [
      {
        title: "Z vs G",
        text: "G has two dahs and one dit. Z adds one more dit after G.",
        href: "/g-in-morse-code",
      },
      {
        title: "Z vs 7",
        text: "7 keeps going with three short marks after the two dahs. Z has only two.",
        href: "/morse-code-numbers",
      },
    ],
    miniPracticePrompt: {
      title: "Practice Z by counting the tail",
      text: "Alternate Z, G, and 7, then encode ZERO, ZONE, and ZULU.",
    },
    listeningDrill: {
      title: "Listening drill",
      text: "Play G, Z, and 7. Count how many short marks follow the two opening dahs.",
      href: "/audio?text=G%20Z%207",
    },
    typingDrill: {
      title: "Typing drill",
      text: "Encode ZERO, ZONE, and ZULU, then check that Z has two short marks after the two dahs.",
      href: "/morse-code-encoder?text=ZERO%20ZONE%20ZULU",
    },
    metaDescription:
      "Learn Z in Morse code with its two-dah two-dit rhythm, Z vs G and Z vs 7 comparisons, examples, and practice drills.",
    faqCompare:
      "Z is often confused with G and 7. G has one final dit, while 7 has three final dits.",
    faqPractice:
      "Practice Z by comparing G, Z, and 7 until the number of final short marks is automatic.",
  },
};

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
  const isPublicLetter = PUBLIC_LETTERS.includes(letter as PublicLetter);
  const override = LETTER_CONTENT_OVERRIDES[letter] ?? {};
  const guidance = LETTER_STUDY_GUIDANCE[letter];

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
      guidance?.whatItIs ??
      `The letter ${letter} is a standard International Morse letter. ${letterPatternLengthText(
        letter,
        morseValue,
      )}`,
    soundNotes:
      override.soundNotes ??
      guidance?.soundNotes ??
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
      guidance?.commonConfusions ??
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
      guidance?.miniPracticePrompt ??
      {
        title: "Mini practice",
        text: `Copy ${letter}, say ${spokenRhythm}, then find the same rhythm inside a short word from the examples.`,
        href: "/practice",
      },
    listeningDrill:
      override.listeningDrill ??
      guidance?.listeningDrill ??
      {
        title: "Listening drill",
        text: `Play ${letter}, say ${spokenRhythm}, then compare it with one nearby pattern from the alphabet chart.`,
        href: `/audio?text=${letter}`,
      },
    typingDrill:
      override.typingDrill ??
      guidance?.typingDrill ??
      {
        title: "Typing drill",
        text: `Type ${morseValue} for ${letter}, add a letter space, then type one short example word that contains ${letter}.`,
        href: "/typing",
      },
    relatedLinks: buildLetterRelatedLinks(letter),
    faqItems:
      override.faqItems ??
      defaultLetterFaq({
        letter,
        morseValue,
        spokenRhythm,
        faqCompare: guidance?.faqCompare,
        faqPractice: guidance?.faqPractice,
      }),
    metaTitle: `${letter} in Morse Code | Symbol, Sound, and Examples | MorseWords`,
    metaDescription:
      override.metaDescription ??
      guidance?.metaDescription ??
      `${letter} in Morse code is ${morseValue}. Learn the ${spokenRhythm} sound, copy the pattern, hear it as audio, and practice short words containing ${letter}.`,
    keywords: `${letter} in morse code, morse code ${letter}, ${letter} morse code, ${letter} morse letter`,
    isPublicLetter,
  };
}

export const LETTER_ITEMS: LetterContentItem[] =
  LETTER_ALPHABET.map(buildLetterContent);

export const LETTER_PAGES: Record<string, LetterContentItem> =
  Object.fromEntries(LETTER_ITEMS.map((item) => [item.slug, item])) as Record<
    string,
    LetterContentItem
  >;

export const PUBLIC_LETTER_PAGES = LETTER_ITEMS.filter(
  (item) => item.isPublicLetter,
);

export const PUBLIC_LETTER_PATHS = PUBLIC_LETTER_PAGES.map(
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

type NumberStudyGuidance = {
  patternExplanation: string;
  soundNotes: ContentTile[];
  typingNotes: ContentTile[];
  commonConfusions: ContentTile[];
  exampleTexts: string[];
  listeningDrill: ContentTile;
  typingDrill: ContentTile;
  faqCompare: string;
  faqPractice: string;
  relatedNumbers: string[];
  relatedLetters?: string[];
  metaDescription: string;
};

function spokenNumberRhythm(morse: string) {
  return morse
    .split("")
    .map((mark) => (mark === "-" ? "dah" : "dit"))
    .join("-");
}

const NUMBER_STUDY_GUIDANCE: Record<string, NumberStudyGuidance> = {
  "0": {
    patternExplanation:
      "0 is the all-dash Morse number: five long dahs in a row.",
    soundNotes: [
      {
        title: "Hear five long marks",
        text: "Listen for a steady run of five dahs. If a short dit appears, it is not zero.",
      },
      {
        title: "Separate 0 from O",
        text: "O is a letter with three dahs. 0 is a digit with five dahs.",
        href: "/o-in-morse-code",
      },
    ],
    typingNotes: [
      {
        title: "Type five hyphens",
        text: "Use five keyboard hyphens for zero, then add a space before the next Morse character.",
      },
      {
        title: "Keep digit context visible",
        text: "In copied text, write the plain digit as 0, not the letter O, before converting.",
      },
    ],
    commonConfusions: [
      {
        title: "Stopping at three dahs",
        text: "Three dahs is O. Count all five dahs before calling it zero.",
        href: "/o-in-morse-code",
      },
      {
        title: "Missing the final dah",
        text: "Four dahs and one dit is 9, so the final mark matters.",
        href: "/9-in-morse-code",
      },
    ],
    exampleTexts: ["CODE 0", "N0CALL", "ZERO 0", "2020"],
    listeningDrill: {
      title: "Listening drill",
      text: "Play O, 0, 9, and 8. Count the long dahs before deciding whether the sound is a letter or a digit.",
      href: "/audio?text=O%200%209%208",
    },
    typingDrill: {
      title: "Typing drill",
      text: "Type the five-dah pattern for 0, then type CODE 0 and N0CALL to check that the digit stays clear in context.",
      href: "/typing",
    },
    faqCompare: "0 is most often confused with O in plain text and with 9 or 8 if one of the long marks is shortened or missed.",
    faqPractice: "Practice 0 beside O, 8, and 9 so you learn both mark count and digit context.",
    relatedNumbers: ["9", "8"],
    relatedLetters: ["O"],
    metaDescription:
      "Learn the five-dah zero pattern, compare it with O and 9, copy it safely, and practice zero in codes, callsigns, and dates.",
  },
  "1": {
    patternExplanation:
      "1 starts the 1-5 build-up pattern with one dit followed by four dahs.",
    soundNotes: [
      {
        title: "Hear the opening dit",
        text: "The first short mark announces 1. After that, the rhythm stretches into four dahs.",
      },
      {
        title: "Compare nearby digits",
        text: "2 has two opening dits, so the number of short marks at the start tells you which early digit you heard.",
        href: "/2-in-morse-code",
      },
    ],
    typingNotes: [
      {
        title: "Start with one dot",
        text: "Type one period, then four hyphens, with no extra space inside the digit.",
      },
      {
        title: "Use it inside short strings",
        text: "Practice 1 in compact examples like A1 or CODE 1 before using longer dates.",
      },
    ],
    commonConfusions: [
      {
        title: "Adding a second dit",
        text: "Two opening dits turns 1 into 2.",
        href: "/2-in-morse-code",
      },
      {
        title: "Missing the opening dit",
        text: "If the first short mark is missed, the remaining sound can feel like a partial run of dahs.",
      },
    ],
    exampleTexts: ["COUNT 1", "A1", "2021", "K1 TEST"],
    listeningDrill: {
      title: "Listening drill",
      text: "Play 1, 2, and 0. Focus on whether the digit begins with one short dit or with a long dah.",
      href: "/audio?text=1%202%200",
    },
    typingDrill: {
      title: "Typing drill",
      text: "Type the one-dit four-dah pattern for 1, then type A1, 21, and CODE 1 with clear spaces between Morse characters.",
      href: "/typing",
    },
    faqCompare: "1 is most often confused with 2 when an extra opening dit is added or when the first two short marks run together.",
    faqPractice: "Practice 1 beside 2 and 0 so the opening dit becomes the main recognition cue.",
    relatedNumbers: ["2", "0"],
    metaDescription:
      "Learn the one-dit four-dah pattern for 1, compare it with 2 and 0, and practice copying 1 in short codes and dates.",
  },
  "2": {
    patternExplanation:
      "2 uses two dits followed by three dahs, continuing the 1-5 dot build-up.",
    soundNotes: [
      {
        title: "Count two opening dits",
        text: "The first two short marks are the giveaway. The remaining three marks are dahs.",
      },
      {
        title: "Compare 1 and 3",
        text: "1 has one opening dit; 3 has three. 2 sits directly between them.",
        href: "/3-in-morse-code",
      },
    ],
    typingNotes: [
      {
        title: "Two dots, three dashes",
        text: "Type two periods followed by three hyphens as one five-mark digit.",
      },
      {
        title: "Check copied spacing",
        text: "Keep a letter gap after 2 so the following character does not attach to the number pattern.",
      },
    ],
    commonConfusions: [
      {
        title: "One too few dits",
        text: "One opening dit is 1, not 2.",
        href: "/1-in-morse-code",
      },
      {
        title: "One extra dit",
        text: "Three opening dits changes 2 into 3.",
        href: "/3-in-morse-code",
      },
    ],
    exampleTexts: ["2 TONES", "A2", "2026", "CODE 12"],
    listeningDrill: {
      title: "Listening drill",
      text: "Play 1, 2, 3, and 2 again. Say the count of opening dits out loud before checking the digit.",
      href: "/audio?text=1%202%203%202",
    },
    typingDrill: {
      title: "Typing drill",
      text: "Type the two-dit three-dah pattern for 2, then type 12, 23, and CODE 12 to practice digit boundaries.",
      href: "/typing",
    },
    faqCompare: "2 is most often confused with 1 or 3 because those digits differ by only one opening dit.",
    faqPractice: "Practice 2 in a 1-2-3 set so the dot build-up pattern becomes automatic.",
    relatedNumbers: ["1", "3"],
    metaDescription:
      "Learn 2 in Morse code with the two-dit three-dah rhythm, compare it with 1 and 3, and practice it in dates and short codes.",
  },
  "3": {
    patternExplanation:
      "3 uses three dits followed by two dahs, right before the 4 and 5 end of the dot build-up.",
    soundNotes: [
      {
        title: "Hear three short dits",
        text: "The opening is close to S, but 3 keeps going with two dahs after the three dits.",
      },
      {
        title: "Do not stop at S",
        text: "S is only three dits. 3 adds two long marks after that.",
        href: "/s-in-morse-code",
      },
    ],
    typingNotes: [
      {
        title: "Three dots, two dashes",
        text: "Type three periods followed by two hyphens without spaces inside the digit.",
      },
      {
        title: "Use adjacent digits",
        text: "Practice 2, 3, and 4 together because the opening dit count changes by one.",
      },
    ],
    commonConfusions: [
      {
        title: "Stopping at S",
        text: "Three dits alone is S. Add two dahs to make 3.",
        href: "/s-in-morse-code",
      },
      {
        title: "Sliding to 2 or 4",
        text: "Two opening dits is 2. Four opening dits is 4.",
        href: "/4-in-morse-code",
      },
    ],
    exampleTexts: ["3 DITS", "R3", "73", "CODE 303"],
    listeningDrill: {
      title: "Listening drill",
      text: "Play S, 3, 2, and 4. Listen for whether the three dits are the whole character or only the start.",
      href: "/audio?text=S%203%202%204",
    },
    typingDrill: {
      title: "Typing drill",
      text: "Type the three-dit two-dah pattern for 3, then type 303 and 73 with clear spaces between each Morse digit.",
      href: "/typing",
    },
    faqCompare: "3 can be confused with S when the two final dahs are dropped, or with 2 and 4 when the dot count is off.",
    faqPractice: "Practice 3 beside S, 2, and 4 so you can hear both the opening dits and the final dahs.",
    relatedNumbers: ["2", "4"],
    relatedLetters: ["S"],
    metaDescription:
      "Learn 3 in Morse code, hear the three-dit two-dah rhythm, compare it with S, 2, and 4, and practice short number strings.",
  },
  "4": {
    patternExplanation:
      "4 uses four dits followed by one dah, the last mixed digit before 5.",
    soundNotes: [
      {
        title: "Hear four short dits first",
        text: "The digit begins like H, then adds one final dah.",
      },
      {
        title: "Compare with H and 5",
        text: "H is four dits. 5 is five dits. 4 changes direction with one final dah.",
        href: "/h-in-morse-code",
      },
    ],
    typingNotes: [
      {
        title: "Four dots, one dash",
        text: "Type four periods and one hyphen as a single number character.",
      },
      {
        title: "Watch the ending",
        text: "The last mark must be a dash. A dot at the end changes the digit to 5.",
      },
    ],
    commonConfusions: [
      {
        title: "H is not 4",
        text: "H stops after four dits. 4 adds a dah at the end.",
        href: "/h-in-morse-code",
      },
      {
        title: "5 has no dah",
        text: "If all five marks are dits, the digit is 5.",
        href: "/5-in-morse-code",
      },
    ],
    exampleTexts: ["4 MARKS", "H4", "144", "CODE 40"],
    listeningDrill: {
      title: "Listening drill",
      text: "Play H, 4, and 5. Listen for the final long mark that separates 4 from both neighbors.",
      href: "/audio?text=H%204%205",
    },
    typingDrill: {
      title: "Typing drill",
      text: "Type the four-dit one-dah pattern for 4, then type H4, 44, and CODE 40 to practice the final dash.",
      href: "/typing",
    },
    faqCompare: "4 is commonly confused with H when the final dash is missed, and with 5 when the final dash is typed as a dot.",
    faqPractice: "Practice 4 beside H and 5 so the final dash becomes the cue.",
    relatedNumbers: ["3", "5"],
    relatedLetters: ["H"],
    metaDescription:
      "Learn 4 in Morse code with four dits and one dah, compare it with H and 5, and practice the final dash in codes and counts.",
  },
  "5": {
    patternExplanation:
      "5 is five dits, the midpoint where the 1-5 dot build-up becomes all dots.",
    soundNotes: [
      {
        title: "Hear five short dits",
        text: "5 is a quick run of five short marks. It should not have any long dahs.",
      },
      {
        title: "Compare with H and S",
        text: "S is three dits and H is four dits. 5 continues to five.",
        href: "/h-in-morse-code",
      },
    ],
    typingNotes: [
      {
        title: "Type five periods",
        text: "Use exactly five periods for 5. Any dash changes it to a nearby number.",
      },
      {
        title: "Count before copying",
        text: "When copying 5 into a design or code, count all five dots before saving it.",
      },
    ],
    commonConfusions: [
      {
        title: "Stopping at H",
        text: "Four dits is H. 5 needs one more short dit.",
        href: "/h-in-morse-code",
      },
      {
        title: "Adding a dah",
        text: "Four dits and a dah is 4, not 5.",
        href: "/4-in-morse-code",
      },
    ],
    exampleTexts: ["COUNT 5", "S5", "555", "CODE 15"],
    listeningDrill: {
      title: "Listening drill",
      text: "Play S, H, 5, and 4. Count the short dits, then check whether a final dah appears.",
      href: "/audio?text=S%20H%205%204",
    },
    typingDrill: {
      title: "Typing drill",
      text: "Type the five-dit pattern for 5, then type 15, 55, and COUNT 5 without merging digit gaps.",
      href: "/typing",
    },
    faqCompare: "5 is most often confused with S or H when the copied sound is cut short.",
    faqPractice: "Practice 5 beside S, H, and 4 so you can count short marks without rushing.",
    relatedNumbers: ["4", "6"],
    relatedLetters: ["H", "S"],
    metaDescription:
      "Learn 5 in Morse code as five short dits, compare it with S, H, and 4, and practice copying five-dot number patterns.",
  },
  "6": {
    patternExplanation:
      "6 begins the reverse side of the number system with one dah followed by four dits.",
    soundNotes: [
      {
        title: "Hear the opening dah",
        text: "6 starts long, then finishes with four short dits.",
      },
      {
        title: "Reverse of the early numbers",
        text: "The 6-9 group counts dahs at the start instead of dits.",
      },
    ],
    typingNotes: [
      {
        title: "One dash, four dots",
        text: "Type one hyphen followed by four periods as one five-mark digit.",
      },
      {
        title: "Do not confuse count with digit",
        text: "Even though the digit is 6, the Morse character still has five marks.",
      },
    ],
    commonConfusions: [
      {
        title: "Dropping a final dit",
        text: "Missing one of the final dits makes the copied rhythm feel incomplete.",
      },
      {
        title: "Mixing with 7",
        text: "7 has two opening dahs, so count the long marks at the start.",
        href: "/7-in-morse-code",
      },
    ],
    exampleTexts: ["CODE 6", "K6 TEST", "66", "GRID 6"],
    listeningDrill: {
      title: "Listening drill",
      text: "Play 6, 7, and 5. Notice how 6 starts with one dah while 5 has no dah at all.",
      href: "/audio?text=6%207%205",
    },
    typingDrill: {
      title: "Typing drill",
      text: "Type the one-dah four-dit pattern for 6, then type 66, K6, and CODE 6 with visible spacing.",
      href: "/typing",
    },
    faqCompare: "6 is commonly confused with 7 when a second opening dah is added or heard by mistake.",
    faqPractice: "Practice 6 beside 7 and 5 so you can hear the shift from dot-built to dash-built digits.",
    relatedNumbers: ["5", "7"],
    metaDescription:
      "Learn 6 in Morse code with one dah and four dits, understand the 6-9 reverse pattern, and practice 6 in codes and callsign-style text.",
  },
  "7": {
    patternExplanation:
      "7 uses two dahs followed by three dits, continuing the 6-9 reverse pattern.",
    soundNotes: [
      {
        title: "Hear two long marks first",
        text: "The two opening dahs make 7 feel heavier than 6 before the three short dits arrive.",
      },
      {
        title: "Compare with Z",
        text: "Z is also two dahs then two dits. 7 adds one extra dit.",
        href: "/z-in-morse-code",
      },
    ],
    typingNotes: [
      {
        title: "Two dashes, three dots",
        text: "Type two hyphens followed by three periods without a gap inside the digit.",
      },
      {
        title: "Check the final dot count",
        text: "The ending has three dits. Stopping at two can look like Z in learning context.",
      },
    ],
    commonConfusions: [
      {
        title: "Z is shorter",
        text: "Z is --.. with two final dits. 7 is --... with three.",
        href: "/z-in-morse-code",
      },
      {
        title: "Sliding to 8",
        text: "8 has three opening dahs, so count the long marks at the start.",
        href: "/8-in-morse-code",
      },
    ],
    exampleTexts: ["73", "K7 Q", "CODE 7", "Z7"],
    listeningDrill: {
      title: "Listening drill",
      text: "Play Z, 7, and 8. Count both the opening dahs and the final dits before deciding.",
      href: "/audio?text=Z%207%208",
    },
    typingDrill: {
      title: "Typing drill",
      text: "Type the two-dah three-dit pattern for 7, then type 73, Z7, and CODE 7 with clean digit gaps.",
      href: "/typing",
    },
    faqCompare: "7 can be confused with Z if the final dit count is missed, or with 8 if one extra opening dah is added.",
    faqPractice: "Practice 7 beside Z and 8 so you hear both halves of the pattern.",
    relatedNumbers: ["6", "8"],
    relatedLetters: ["Z"],
    metaDescription:
      "Learn 7 in Morse code with two dahs and three dits, compare it with Z and 8, and practice 7 in short codes like 73.",
  },
  "8": {
    patternExplanation:
      "8 uses three dahs followed by two dits, one step before the four-dah pattern for 9.",
    soundNotes: [
      {
        title: "Hear three long dahs",
        text: "8 begins like O, then adds two short dits at the end.",
      },
      {
        title: "Compare with O",
        text: "O is only three dahs. 8 continues with two final dits.",
        href: "/o-in-morse-code",
      },
    ],
    typingNotes: [
      {
        title: "Three dashes, two dots",
        text: "Type three hyphens followed by two periods as one five-mark digit.",
      },
      {
        title: "Keep the dits attached",
        text: "The two final dots belong to 8. Do not separate them as another Morse letter.",
      },
    ],
    commonConfusions: [
      {
        title: "O stops earlier",
        text: "O is three dahs. 8 has two extra dits after those dahs.",
        href: "/o-in-morse-code",
      },
      {
        title: "7 and 9 flank it",
        text: "7 starts with two dahs. 9 starts with four. 8 sits between them.",
        href: "/9-in-morse-code",
      },
    ],
    exampleTexts: ["8 TONES", "88", "O8", "CODE 80"],
    listeningDrill: {
      title: "Listening drill",
      text: "Play O, 8, 7, and 9. Listen for the number of opening dahs and the final dits.",
      href: "/audio?text=O%208%207%209",
    },
    typingDrill: {
      title: "Typing drill",
      text: "Type the three-dah two-dit pattern for 8, then type O8, 88, and CODE 80 without splitting the final dots.",
      href: "/typing",
    },
    faqCompare: "8 is commonly confused with O when the final dits are missed, or with 7 and 9 when the opening dah count is off.",
    faqPractice: "Practice 8 beside O, 7, and 9 so the long-short transition is clear.",
    relatedNumbers: ["7", "9"],
    relatedLetters: ["O"],
    metaDescription:
      "Learn 8 in Morse code with three dahs and two dits, compare it with O, 7, and 9, and practice copying 8 in codes.",
  },
  "9": {
    patternExplanation:
      "9 uses four dahs followed by one dit, the last mixed number before 0.",
    soundNotes: [
      {
        title: "Hear four long marks",
        text: "9 almost feels like 0, but it ends with one short dit instead of a fifth dah.",
      },
      {
        title: "Compare with 0",
        text: "0 is five dahs. 9 changes the final mark to a dit.",
        href: "/0-in-morse-code",
      },
    ],
    typingNotes: [
      {
        title: "Four dashes, one dot",
        text: "Type four hyphens followed by one period as one complete digit.",
      },
      {
        title: "Check the last mark",
        text: "The final dot is the difference between 9 and 0.",
      },
    ],
    commonConfusions: [
      {
        title: "Final dit vs final dah",
        text: "If the final mark is a dah, the pattern becomes 0.",
        href: "/0-in-morse-code",
      },
      {
        title: "One fewer dah",
        text: "8 starts with three dahs, so count the long marks before the final short marks.",
        href: "/8-in-morse-code",
      },
    ],
    exampleTexts: ["9 COUNT", "99", "N9 TEST", "CODE 90"],
    listeningDrill: {
      title: "Listening drill",
      text: "Play 9, 0, and 8. Focus on the final mark and the number of opening dahs.",
      href: "/audio?text=9%200%208",
    },
    typingDrill: {
      title: "Typing drill",
      text: "Type the four-dah one-dit pattern for 9, then type 90, 99, and CODE 90 with clear digit boundaries.",
      href: "/typing",
    },
    faqCompare: "9 is most often confused with 0 when the final dit is copied as a dah, and with 8 when one opening dah is missed.",
    faqPractice: "Practice 9 beside 0 and 8 so the final dot is obvious.",
    relatedNumbers: ["8", "0"],
    metaDescription:
      "Learn 9 in Morse code with four dahs and one dit, compare it with 0 and 8, and practice the final-dot number rhythm.",
  },
};

function normalizeExampleMorse(value: string) {
  return morseForText(value).replace(/\s{7,}/g, " / ");
}

function buildNumberExamples(digit: string, examples: string[]): WorkedExample[] {
  return examples.map((text) => ({
    title: text,
    text,
    morse: normalizeExampleMorse(text),
    note:
      text === digit
        ? `${digit} by itself is the cleanest way to check the five-mark number pattern.`
        : `${text} shows ${digit} in a practical short string with letters or other digits.`,
  }));
}

function buildNumberRelatedLinks(
  digit: string,
  guidance: NumberStudyGuidance,
): RelatedLink[] {
  return [
    { href: "/morse-code-numbers", label: "Numbers hub", primary: true },
    { href: "/morse-code-alphabet", label: "Alphabet" },
    { href: "/audio", label: "Audio" },
    { href: "/practice", label: "Practice" },
    { href: "/typing", label: "Typing" },
    { href: "/morse-code-encoder", label: "Encoder" },
    { href: "/morse-code-decoder", label: "Decoder" },
    ...guidance.relatedNumbers.map((relatedDigit) => ({
      href: `/${relatedDigit}-in-morse-code`,
      label: `${relatedDigit} in Morse`,
    })),
    ...(guidance.relatedLetters ?? []).map((letter) => ({
      href: `/${letter.toLowerCase()}-in-morse-code`,
      label: `${letter} in Morse`,
    })),
  ];
}

function defaultNumberFaq({
  digit,
  morseValue,
  spokenRhythm,
  guidance,
}: {
  digit: string;
  morseValue: string;
  spokenRhythm: string;
  guidance: NumberStudyGuidance;
}): ContentFaqItem[] {
  return [
    {
      q: `What is ${digit} in Morse code?`,
      a: `${digit} in Morse code is ${morseValue}.`,
    },
    {
      q: `How do you say ${digit} in Morse rhythm?`,
      a: `${digit} is spoken as ${spokenRhythm}.`,
    },
    {
      q: `What pattern does ${digit} follow?`,
      a: guidance.patternExplanation,
    },
    {
      q: `What is ${digit} commonly confused with?`,
      a: guidance.faqCompare,
    },
    {
      q: `How should I practice ${digit} in Morse code?`,
      a: guidance.faqPractice,
    },
  ];
}

export const NUMBER_ITEMS: NumberContentItem[] = Array.from(
  { length: 10 },
  (_, digitIndex) => {
    const digit = String(digitIndex);
    const guidance = NUMBER_STUDY_GUIDANCE[digit];
    const morseValue = assertMorseCharacter(digit);
    const spokenRhythm = spokenNumberRhythm(morseValue);
    const slug = `${digit}-in-morse-code`;

    return {
      slug,
      path: `/${slug}`,
      digit,
      label: digit,
      displayTitle: `${digit} in Morse Code`,
      plainTextValue: digit,
      morseValue,
      spokenRhythm,
      answerSummary: `${digit} in Morse code is ${morseValue}. It is spoken as ${spokenRhythm} and uses one standard five-mark number pattern.`,
      patternExplanation: guidance.patternExplanation,
      soundNotes: guidance.soundNotes,
      typingNotes: guidance.typingNotes,
      commonConfusions: guidance.commonConfusions,
      exampleUses: buildNumberExamples(digit, guidance.exampleTexts),
      miniPracticePrompt: {
        title: `Practice ${digit} in context`,
        text: `Hear ${digit}, type ${morseValue}, then compare it with nearby number and letter patterns so it becomes more than a lookup.`,
        href: "/practice",
      },
      listeningDrill: guidance.listeningDrill,
      typingDrill: guidance.typingDrill,
      relatedLinks: buildNumberRelatedLinks(digit, guidance),
      faqItems: defaultNumberFaq({
        digit,
        morseValue,
        spokenRhythm,
        guidance,
      }),
      metaTitle: `${digit} in Morse Code | Number, Sound, and Examples | MorseWords`,
      metaDescription: `${digit} in Morse code is ${morseValue}. ${guidance.metaDescription}`,
      keywords: `${numberNames[digitIndex]} in morse code, ${digit} in morse code, morse code number ${digit}, morse code digit ${digit}`,
    };
  },
);

export const NUMBER_PAGES: Record<string, NumberContentItem> =
  Object.fromEntries(NUMBER_ITEMS.map((item) => [item.slug, item])) as Record<
    string,
    NumberContentItem
  >;

export const PUBLIC_NUMBER_PATHS = NUMBER_ITEMS.map((item) => item.path);

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
    a: "Yes. Each digit has its own page with the direct pattern, sound notes, examples, practice drills, and links back to the full 0-9 chart.",
  },
];

type PhrasePageInput = Omit<
  MorseLeafContent,
  "path" | "kind" | "morseValue" | "spokenRhythm"
>;

function makePhrasePage(input: PhrasePageInput): MorseLeafContent {
  const morseValue = morseForText(input.plainTextValue);

  return {
    ...input,
    path: `/${input.slug}`,
    kind: "phrase",
    morseValue,
    spokenRhythm: rhythmFor(morseValue),
  };
}

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
      { href: "/love-in-morse-code", label: "LOVE" },
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
  "hello-in-morse-code": makePhrasePage({
    slug: "hello-in-morse-code",
    eyebrow: "Phrase lookup",
    label: "HELLO",
    displayTitle: "Hello in Morse Code",
    plainTextValue: "HELLO",
    answerSummary:
      "HELLO in Morse code is .... . .-.. .-.. --- for H E L L O. It is a one-word greeting, so there is no word slash inside the phrase.",
    breakdownIntro:
      "HELLO is encoded letter by letter: H, E, L, L, and O. The repeated L pattern is the part most learners need to check.",
    contextTitle: "Using HELLO in Morse",
    context: [
      {
        title: "Greeting and practice word",
        text: "HELLO is useful for cards, classroom puzzles, audio playback, and first word-level Morse practice.",
      },
      {
        title: "One word, simple spacing",
        text: "Because HELLO is one word, keep normal letter gaps between H, E, L, L, and O. No slash is needed.",
      },
      {
        title: "Listen for repeated L",
        text: "The two L characters appear back to back. Use audio practice to hear the same .-.. rhythm twice.",
        href: "/l-in-morse-code",
      },
    ],
    examples: [
      {
        title: "Plain greeting",
        text: "HELLO",
        morse: morseForText("HELLO"),
        note: "The direct one-word greeting, useful for copy and paste checks.",
      },
      {
        title: "Greeting pair",
        text: "HELLO HI",
        morse: morseForText("HELLO HI").replace(/\s{7,}/g, " / "),
        note: "Compare HELLO with the shorter HI page when you want a compact greeting.",
      },
      {
        title: "Practice word",
        text: "HELLO",
        morse: morseForText("HELLO"),
        note: "Play it slowly and listen for H, E, L, L, O instead of memorizing the full string visually.",
      },
    ],
    commonMistakes: [
      {
        title: "Dropping one L",
        text: "HELLO has two L letters. If one .-.. pattern is missing, the word is not HELLO.",
      },
      {
        title: "Adding a word slash",
        text: "A slash marks a word boundary. HELLO is one word, so a slash inside it would break the spelling.",
      },
      {
        title: "Rushing H and E together",
        text: "H is four dits and E is one dit. Keep a letter gap so they do not become one longer run of dots.",
        href: "/h-in-morse-code",
      },
    ],
    relatedLinks: [
      { href: "/?text=HELLO", label: "Open in translator", primary: true },
      { href: "/audio?text=HELLO", label: "Hear HELLO" },
      { href: "/morse-code-encoder?text=HELLO", label: "Open in encoder" },
      { href: "/hi-in-morse-code", label: "Compare HI" },
      { href: "/hello-world-in-morse-code", label: "HELLO WORLD" },
      { href: "/morse-code-words", label: "More Morse words" },
      { href: "/practice", label: "Practice words" },
    ],
    faqItems: [
      {
        q: "What is HELLO in Morse code?",
        a: "HELLO in Morse code is .... . .-.. .-.. ---.",
      },
      {
        q: "Does HELLO need a slash in Morse code?",
        a: "No. HELLO is one word, so it only needs letter spacing between H, E, L, L, and O.",
      },
      {
        q: "Why is HELLO useful for practice?",
        a: "HELLO is familiar and includes repeated L patterns, which makes it useful for checking spacing and rhythm.",
      },
      {
        q: "Can I hear HELLO in Morse code?",
        a: "Yes. Use the audio link on this page to load HELLO into the MorseWords audio tool.",
      },
      {
        q: "What should I compare HELLO with?",
        a: "Compare it with HI for a shorter greeting and with the L page if the repeated L pattern is the hard part.",
      },
    ],
    metaTitle: "Hello in Morse Code | Copy, Audio, and Breakdown | MorseWords",
    metaDescription:
      "See HELLO in Morse code, copy the exact greeting, hear the audio, review H E L L O spacing, and practice the repeated L pattern.",
    keywords:
      "hello in morse code, hello morse code, morse code hello, hello in dots and dashes",
  }),
  "hi-in-morse-code": makePhrasePage({
    slug: "hi-in-morse-code",
    eyebrow: "Phrase lookup",
    label: "HI",
    displayTitle: "Hi in Morse Code",
    plainTextValue: "HI",
    answerSummary:
      "HI in Morse code is .... ... for H I. It is a short greeting with H followed by I.",
    breakdownIntro:
      "HI is two letters, H and I. The whole phrase is compact, but the letter gap still matters.",
    contextTitle: "Using HI in Morse",
    context: [
      {
        title: "Short greeting",
        text: "HI is quicker to copy than HELLO and works well for short practice messages.",
      },
      {
        title: "Keep H and I separate",
        text: "H is .... and I is ... Keep the letter gap visible so the two dot groups do not collapse.",
      },
      {
        title: "Compare with HELLO",
        text: "Use HELLO when you want a fuller greeting or a word with repeated L practice.",
        href: "/hello-in-morse-code",
      },
    ],
    examples: [
      {
        title: "Short greeting",
        text: "HI",
        morse: morseForText("HI"),
        note: "The shortest casual greeting in this batch.",
      },
      {
        title: "Greeting contrast",
        text: "HI HELLO",
        morse: morseForText("HI HELLO").replace(/\s{7,}/g, " / "),
        note: "Use the slash to show the word break between two greetings.",
      },
      {
        title: "Dot-group drill",
        text: "H I",
        morse: morseForText("H I").replace(/\s{7,}/g, " / "),
        note: "Practice hearing four dits, then two dits.",
      },
    ],
    commonMistakes: [
      {
        title: "Collapsing the dots",
        text: "Without a letter gap, H and I can look like a long run of dots instead of two letters.",
      },
      {
        title: "Reading I as E",
        text: "I is two dits. E is one dit, so do not stop early when copying the second letter.",
        href: "/i-in-morse-code",
      },
      {
        title: "Overusing slash separators",
        text: "HI is one word. Use slashes only between words, not between H and I.",
      },
    ],
    relatedLinks: [
      { href: "/?text=HI", label: "Open in translator", primary: true },
      { href: "/audio?text=HI", label: "Hear HI" },
      { href: "/morse-code-encoder?text=HI", label: "Open in encoder" },
      { href: "/hello-in-morse-code", label: "Compare HELLO" },
      { href: "/h-in-morse-code", label: "Study H" },
      { href: "/i-in-morse-code", label: "Study I" },
    ],
    faqItems: [
      {
        q: "What is HI in Morse code?",
        a: "HI in Morse code is .... ... for H I.",
      },
      {
        q: "Is HI shorter than HELLO in Morse code?",
        a: "Yes. HI uses only two letters, while HELLO uses five letters.",
      },
      {
        q: "Why can HI be hard to read?",
        a: "Both letters are made only of dits, so the gap between H and I must stay clear.",
      },
      {
        q: "Can I copy HI into another app?",
        a: "Yes. Use periods for dots and keep one clear space between H and I.",
      },
      {
        q: "What should I practice after HI?",
        a: "Practice H, I, and HELLO so short dot groups stay easy to separate.",
      },
    ],
    metaTitle: "Hi in Morse Code | Copy, Audio, and Breakdown | MorseWords",
    metaDescription:
      "See HI in Morse code, copy the short greeting, hear the H-I rhythm, compare it with HELLO, and avoid collapsed dot spacing.",
    keywords:
      "hi in morse code, hi morse code, morse code hi, short morse greeting",
  }),
  "help-in-morse-code": makePhrasePage({
    slug: "help-in-morse-code",
    eyebrow: "Phrase lookup",
    label: "HELP",
    displayTitle: "Help in Morse Code",
    plainTextValue: "HELP",
    answerSummary:
      "HELP in Morse code is .... . .-.. .--. for H E L P. It is the word HELP, not the international SOS distress signal.",
    breakdownIntro:
      "HELP is encoded as H, E, L, and P. Keep the spelling separate from the special SOS signal.",
    contextTitle: "Using HELP in Morse",
    context: [
      {
        title: "Word, not SOS",
        text: "HELP is a normal word in Morse. SOS is the internationally recognized distress signal pattern.",
        href: "/morse-code-sos",
      },
      {
        title: "Spacing matters",
        text: "Keep H, E, L, and P as four separate letter patterns so the word decodes cleanly.",
      },
      {
        title: "Practice caution",
        text: "Use this page for learning, puzzles, and practice. Do not rely on a web page as an emergency communication method.",
      },
    ],
    examples: [
      {
        title: "Single word",
        text: "HELP",
        morse: morseForText("HELP"),
        note: "The plain word, useful for spelling and spacing practice.",
      },
      {
        title: "Compare with HELP ME",
        text: "HELP ME",
        morse: morseForText("HELP ME").replace(/\s{7,}/g, " / "),
        note: "The slash makes the word break visible in the two-word phrase.",
      },
      {
        title: "Compare with SOS",
        text: "SOS",
        morse: morseForText("SOS"),
        note: "SOS is shorter and has a different emergency-signal role.",
      },
    ],
    commonMistakes: [
      {
        title: "Treating HELP as SOS",
        text: "HELP and SOS are different. HELP spells a word; SOS is a recognized distress signal.",
      },
      {
        title: "Losing the P ending",
        text: "The final P is .--. If it is missing, the word becomes HEL, not HELP.",
        href: "/p-in-morse-code",
      },
      {
        title: "Removing letter gaps",
        text: "HELP contains four letters. Each letter pattern needs its own gap for decoding.",
      },
    ],
    relatedLinks: [
      { href: "/?text=HELP", label: "Open in translator", primary: true },
      { href: "/audio?text=HELP", label: "Hear HELP" },
      { href: "/morse-code-encoder?text=HELP", label: "Open in encoder" },
      { href: "/help-me-in-morse-code", label: "HELP ME" },
      { href: "/morse-code-sos", label: "Compare SOS" },
      { href: "/morse-code-words", label: "More Morse words" },
    ],
    faqItems: [
      {
        q: "What is HELP in Morse code?",
        a: "HELP in Morse code is .... . .-.. .--. for H E L P.",
      },
      {
        q: "Is HELP the same as SOS?",
        a: "No. HELP is the word HELP encoded letter by letter. SOS is a special distress signal pattern.",
      },
      {
        q: "How do I write HELP ME in Morse code?",
        a: "Use HELP, a word separator, then ME. The HELP ME page shows the full two-word phrase.",
      },
      {
        q: "Can I use this page in an emergency?",
        a: "No. This page is for learning and reference, not for emergency communication.",
      },
      {
        q: "Which letter is easiest to miss in HELP?",
        a: "P is easy to shorten or drop because it comes at the end. Check the final .--. pattern.",
      },
    ],
    metaTitle: "Help in Morse Code | Copy, Audio, and SOS Difference | MorseWords",
    metaDescription:
      "See HELP in Morse code, copy and hear the word, review H E L P spacing, and learn how HELP differs from the SOS distress signal.",
    keywords:
      "help in morse code, help morse code, morse code help, help vs sos morse",
  }),
  "help-me-in-morse-code": makePhrasePage({
    slug: "help-me-in-morse-code",
    eyebrow: "Phrase lookup",
    label: "HELP ME",
    displayTitle: "Help Me in Morse Code",
    plainTextValue: "HELP ME",
    answerSummary:
      "HELP ME in Morse code is .... . .-.. .--. / -- . when you show the word break with a slash.",
    breakdownIntro:
      "HELP ME has two words. The word boundary is the most important part to keep visible when copying it.",
    contextTitle: "Using HELP ME in Morse",
    context: [
      {
        title: "Two-word spacing",
        text: "Use a slash or a larger word gap between HELP and ME so the phrase does not collapse into one unreadable group.",
        href: "/morse-code-word-separator",
      },
      {
        title: "Reference, not emergency service",
        text: "This page explains the phrase for learning, puzzles, and checking output. It is not a substitute for emergency communication.",
      },
      {
        title: "Compare HELP and SOS",
        text: "HELP ME is a normal phrase. SOS is a specific distress signal with its own page and context.",
        href: "/morse-code-sos",
      },
    ],
    examples: [
      {
        title: "Slash-separated phrase",
        text: "HELP ME",
        morse: morseForText("HELP ME").replace(/\s{7,}/g, " / "),
        note: "This is the clearest written form for most copy and paste uses.",
      },
      {
        title: "Spacing-only Morse",
        text: "HELP ME",
        morse: morseForText("HELP ME"),
        note: "The larger gap between P and M marks the word boundary.",
      },
      {
        title: "Single-word comparison",
        text: "HELP",
        morse: morseForText("HELP"),
        note: "HELP by itself has no word separator.",
      },
    ],
    commonMistakes: [
      {
        title: "Dropping the word boundary",
        text: "Without the word gap, HELP ME can be difficult to decode because the letters run together.",
      },
      {
        title: "Mixing HELP ME with SOS",
        text: "HELP ME spells two words. SOS is a different signal and should not be treated as the same output.",
      },
      {
        title: "Using decorative separators",
        text: "For compatibility, use a plain slash or clear spaces instead of decorative dividers.",
        href: "/copy-and-paste-morse-code",
      },
    ],
    relatedLinks: [
      { href: "/?text=HELP%20ME", label: "Open in translator", primary: true },
      { href: "/audio?text=HELP%20ME", label: "Hear HELP ME" },
      { href: "/morse-code-encoder?text=HELP%20ME", label: "Open in encoder" },
      { href: "/help-in-morse-code", label: "HELP" },
      { href: "/morse-code-sos", label: "Compare SOS" },
      { href: "/morse-code-word-separator", label: "Word spacing" },
    ],
    faqItems: [
      {
        q: "What is HELP ME in Morse code?",
        a: "HELP ME in Morse code is .... . .-.. .--. / -- . when written with a slash word separator.",
      },
      {
        q: "Why is there a slash in HELP ME?",
        a: "The slash marks the word break between HELP and ME in copied text.",
      },
      {
        q: "Is HELP ME the same as SOS?",
        a: "No. HELP ME is a two-word phrase. SOS is a special distress signal pattern.",
      },
      {
        q: "Can I hear HELP ME in Morse code?",
        a: "Yes. Use the audio link to load HELP ME into the MorseWords audio tool.",
      },
      {
        q: "What is the biggest spacing mistake with HELP ME?",
        a: "The biggest mistake is losing the word boundary between HELP and ME.",
      },
    ],
    metaTitle: "Help Me in Morse Code | Copy, Audio, and Word Spacing | MorseWords",
    metaDescription:
      "See HELP ME in Morse code with a clear word separator, copy or hear the phrase, compare it with HELP and SOS, and avoid spacing mistakes.",
    keywords:
      "help me in morse code, help me morse code, morse code help me, help me dots and dashes",
  }),
  "yes-in-morse-code": makePhrasePage({
    slug: "yes-in-morse-code",
    eyebrow: "Phrase lookup",
    label: "YES",
    displayTitle: "Yes in Morse Code",
    plainTextValue: "YES",
    answerSummary:
      "YES in Morse code is -.-- . ... for Y E S. It is a short affirmative word for practice, quizzes, and simple messages.",
    breakdownIntro:
      "YES is encoded as Y, E, and S. The middle E is a single dit, so it is easy to skip if you rush.",
    contextTitle: "Using YES in Morse",
    context: [
      {
        title: "Short response",
        text: "YES works well in quizzes, short-response messages, and beginner practice sets.",
      },
      {
        title: "Compare with NO and OK",
        text: "Use YES beside NO and OK to practice short answer words with different rhythms.",
        href: "/no-in-morse-code",
      },
      {
        title: "Listen for the E",
        text: "The single E in the middle is brief. Keep it audible between Y and S.",
        href: "/e-in-morse-code",
      },
    ],
    examples: [
      {
        title: "Direct answer",
        text: "YES",
        morse: morseForText("YES"),
        note: "A compact positive response.",
      },
      {
        title: "Answer pair",
        text: "YES NO",
        morse: morseForText("YES NO").replace(/\s{7,}/g, " / "),
        note: "Use the slash to separate opposite short answers.",
      },
      {
        title: "Quiz response",
        text: "YES OK",
        morse: morseForText("YES OK").replace(/\s{7,}/g, " / "),
        note: "A practical phrase pair for short-answer drills.",
      },
    ],
    commonMistakes: [
      {
        title: "Skipping E",
        text: "YES has three letters. Do not jump from Y directly to S.",
        href: "/e-in-morse-code",
      },
      {
        title: "Confusing Y and Q",
        text: "Y is -.--. Q is --.-. The first two marks are different.",
        href: "/y-in-morse-code",
      },
      {
        title: "Running YES into NO",
        text: "When practicing answer pairs, keep a word gap or slash between YES and NO.",
      },
    ],
    relatedLinks: [
      { href: "/?text=YES", label: "Open in translator", primary: true },
      { href: "/audio?text=YES", label: "Hear YES" },
      { href: "/morse-code-encoder?text=YES", label: "Open in encoder" },
      { href: "/no-in-morse-code", label: "NO" },
      { href: "/ok-in-morse-code", label: "OK" },
      { href: "/practice", label: "Practice answers" },
    ],
    faqItems: [
      {
        q: "What is YES in Morse code?",
        a: "YES in Morse code is -.-- . ... for Y E S.",
      },
      {
        q: "Why is YES useful for practice?",
        a: "YES is short, familiar, and includes three different letter rhythms.",
      },
      {
        q: "What is easy to miss in YES?",
        a: "The single E in the middle is easy to skip because it is only one dit.",
      },
      {
        q: "Should I practice YES with NO?",
        a: "Yes. Practicing YES, NO, and OK together helps with short-response recognition.",
      },
      {
        q: "Can I copy YES into another app?",
        a: "Yes. Use periods and hyphens and keep letter spaces visible.",
      },
    ],
    metaTitle: "Yes in Morse Code | Copy, Audio, and Breakdown | MorseWords",
    metaDescription:
      "See YES in Morse code, copy and hear the short affirmative word, review Y E S spacing, and compare it with NO and OK.",
    keywords:
      "yes in morse code, yes morse code, morse code yes, yes dots and dashes",
  }),
  "no-in-morse-code": makePhrasePage({
    slug: "no-in-morse-code",
    eyebrow: "Phrase lookup",
    label: "NO",
    displayTitle: "No in Morse Code",
    plainTextValue: "NO",
    answerSummary:
      "NO in Morse code is -. --- for N O. N is the reverse of A, and O is three dahs.",
    breakdownIntro:
      "NO is two letters: N followed by O. It is short, but both letters depend on getting dash timing right.",
    contextTitle: "Using NO in Morse",
    context: [
      {
        title: "Short negative response",
        text: "NO is useful in quizzes, short messages, and answer-pair practice with YES and OK.",
      },
      {
        title: "N versus A",
        text: "N is -. and A is .-. The order is reversed, so listen for the dash first.",
        href: "/n-in-morse-code",
      },
      {
        title: "O as three dahs",
        text: "O is ---. Count three long marks, not the five long marks used by zero.",
        href: "/o-in-morse-code",
      },
    ],
    examples: [
      {
        title: "Direct answer",
        text: "NO",
        morse: morseForText("NO"),
        note: "A compact negative response.",
      },
      {
        title: "Answer pair",
        text: "NO YES",
        morse: morseForText("NO YES").replace(/\s{7,}/g, " / "),
        note: "Use this to practice opposite short answers.",
      },
      {
        title: "Compare with OK",
        text: "NO OK",
        morse: morseForText("NO OK").replace(/\s{7,}/g, " / "),
        note: "Both include O, but the surrounding letters change the rhythm.",
      },
    ],
    commonMistakes: [
      {
        title: "Reversing N into A",
        text: "N starts with a dash. If you send dot-dash, you sent A instead.",
        href: "/a-in-morse-code",
      },
      {
        title: "Confusing O with zero",
        text: "O is three dahs. Zero is five dahs, so count the marks when context is unclear.",
        href: "/0-in-morse-code",
      },
      {
        title: "Losing the letter gap",
        text: "Keep the gap between N and O so -. --- does not run together.",
      },
    ],
    relatedLinks: [
      { href: "/?text=NO", label: "Open in translator", primary: true },
      { href: "/audio?text=NO", label: "Hear NO" },
      { href: "/morse-code-encoder?text=NO", label: "Open in encoder" },
      { href: "/yes-in-morse-code", label: "YES" },
      { href: "/ok-in-morse-code", label: "OK" },
      { href: "/n-in-morse-code", label: "Study N" },
    ],
    faqItems: [
      {
        q: "What is NO in Morse code?",
        a: "NO in Morse code is -. ---.",
      },
      {
        q: "Why mention A when learning NO?",
        a: "The N in NO is dash-dot, while A is dot-dash. The reversal is a common beginner mixup.",
      },
      {
        q: "Is O the same as zero in Morse code?",
        a: "No. O is three dashes, while zero is five dashes.",
      },
      {
        q: "What should I practice with NO?",
        a: "Practice NO with YES and OK so short responses become easy to hear.",
      },
      {
        q: "Can I hear NO in Morse code?",
        a: "Yes. Use the audio link on this page to load NO into the audio tool.",
      },
    ],
    metaTitle: "No in Morse Code | Copy, Audio, and Breakdown | MorseWords",
    metaDescription:
      "See NO in Morse code, copy and hear the short negative word, review N and O timing, and compare it with YES and OK.",
    keywords:
      "no in morse code, no morse code, morse code no, no dots and dashes",
  }),
  "ok-in-morse-code": makePhrasePage({
    slug: "ok-in-morse-code",
    eyebrow: "Phrase lookup",
    label: "OK",
    displayTitle: "OK in Morse Code",
    plainTextValue: "OK",
    answerSummary:
      "OK in Morse code is --- -.- for O K. It is short and practical, but the letter gap between O and K must stay clear.",
    breakdownIntro:
      "OK is two letters: O and K. O is three dahs, and K is dah-dit-dah.",
    contextTitle: "Using OK in Morse",
    context: [
      {
        title: "Short acknowledgment",
        text: "OK is useful for simple practice messages, quizzes, and short response sets.",
      },
      {
        title: "Keep O and K separate",
        text: "O is --- and K is -.-. Without the letter gap, the two dash-heavy patterns become harder to read.",
      },
      {
        title: "Practice with YES and NO",
        text: "Use OK beside YES and NO to practice short everyday responses.",
        href: "/yes-in-morse-code",
      },
    ],
    examples: [
      {
        title: "Direct answer",
        text: "OK",
        morse: morseForText("OK"),
        note: "A compact acknowledgment word.",
      },
      {
        title: "Response set",
        text: "YES NO OK",
        morse: morseForText("YES NO OK").replace(/\s{7,}/g, " / "),
        note: "A useful short-answer drill with clear word separators.",
      },
      {
        title: "Letter comparison",
        text: "O K",
        morse: morseForText("O K").replace(/\s{7,}/g, " / "),
        note: "Practice O and K as separate units before sending OK as a word.",
      },
    ],
    commonMistakes: [
      {
        title: "Blending O into K",
        text: "Both letters use dahs. Keep the O pattern and K pattern separated by a letter gap.",
      },
      {
        title: "Shortening O",
        text: "O has three dahs. Two dahs is M, so count the long marks.",
        href: "/o-in-morse-code",
      },
      {
        title: "Dropping the middle dit in K",
        text: "K is -.-. If you miss the middle dit, it can sound like a dash-heavy blur.",
        href: "/k-in-morse-code",
      },
    ],
    relatedLinks: [
      { href: "/?text=OK", label: "Open in translator", primary: true },
      { href: "/audio?text=OK", label: "Hear OK" },
      { href: "/morse-code-encoder?text=OK", label: "Open in encoder" },
      { href: "/yes-in-morse-code", label: "YES" },
      { href: "/no-in-morse-code", label: "NO" },
      { href: "/practice", label: "Practice responses" },
    ],
    faqItems: [
      {
        q: "What is OK in Morse code?",
        a: "OK in Morse code is --- -.-.",
      },
      {
        q: "Why can OK be tricky?",
        a: "OK is short, but both O and K use long dahs, so the letter gap must stay clear.",
      },
      {
        q: "Should OK be written as one word?",
        a: "Yes. OK is usually written as the two letters O and K with a letter gap between them.",
      },
      {
        q: "What should I compare OK with?",
        a: "Compare OK with YES and NO for short-response practice.",
      },
      {
        q: "Can I hear OK in Morse code?",
        a: "Yes. Use the audio link on this page to hear the O K rhythm.",
      },
    ],
    metaTitle: "OK in Morse Code | Copy, Audio, and Breakdown | MorseWords",
    metaDescription:
      "See OK in Morse code, copy and hear the two-letter response, review O K spacing, and compare it with YES and NO.",
    keywords:
      "ok in morse code, ok morse code, morse code ok, okay in morse code",
  }),
  "sorry-in-morse-code": makePhrasePage({
    slug: "sorry-in-morse-code",
    eyebrow: "Phrase lookup",
    label: "SORRY",
    displayTitle: "Sorry in Morse Code",
    plainTextValue: "SORRY",
    answerSummary:
      "SORRY in Morse code is ... --- .-. .-. -.-- for S O R R Y. It is one word, so keep letter gaps clear and do not add a slash inside it.",
    breakdownIntro:
      "SORRY is encoded one letter at a time: S, O, R, R, and Y. The repeated R pattern is the part to check before copying.",
    contextTitle: "Using SORRY in Morse",
    context: [
      {
        title: "Common lookup word",
        text: "SORRY is a common word people copy for puzzles, notes, classroom examples, and short practice sets.",
      },
      {
        title: "One-word spacing",
        text: "Keep normal letter gaps between S, O, R, R, and Y. A slash belongs between words, not inside SORRY.",
      },
      {
        title: "Listen for contrast",
        text: "SORRY starts with S and O, so the sound moves from three short dits to three longer dahs before the repeated R.",
        href: "/audio?text=SORRY",
      },
    ],
    examples: [
      {
        title: "Direct word",
        text: "SORRY",
        morse: morseForText("SORRY"),
        note: "The one-word form, ready to copy after you check the repeated R.",
      },
      {
        title: "Short response pair",
        text: "SORRY NO",
        morse: morseForText("SORRY NO").replace(/\s{7,}/g, " / "),
        note: "The slash shows the word gap before NO in copied text.",
      },
      {
        title: "Greeting context",
        text: "HELLO SORRY",
        morse: morseForText("HELLO SORRY").replace(/\s{7,}/g, " / "),
        note: "Useful for classroom or puzzle examples with two familiar words.",
      },
    ],
    commonMistakes: [
      {
        title: "Dropping the second R",
        text: "SORRY has two R letters. If one .-. pattern is missing, the word is not spelled correctly.",
        href: "/r-in-morse-code",
      },
      {
        title: "Confusing S and O",
        text: "S is three dits and O is three dahs. The first two letters need a clear short-to-long contrast.",
        href: "/s-in-morse-code",
      },
      {
        title: "Adding a word separator",
        text: "SORRY is one word. Do not place a slash between the letters unless you are intentionally showing a training split.",
      },
    ],
    relatedLinks: [
      { href: "/?text=SORRY", label: "Open in translator", primary: true },
      { href: "/audio?text=SORRY", label: "Hear SORRY" },
      { href: "/morse-code-encoder?text=SORRY", label: "Open in encoder" },
      { href: "/hello-in-morse-code", label: "HELLO" },
      { href: "/yes-in-morse-code", label: "YES" },
      { href: "/no-in-morse-code", label: "NO" },
      { href: "/morse-code-words", label: "More Morse words" },
    ],
    faqItems: [
      {
        q: "What is SORRY in Morse code?",
        a: "SORRY in Morse code is ... --- .-. .-. -.-- for S O R R Y.",
      },
      {
        q: "Does SORRY need a slash in Morse code?",
        a: "No. SORRY is one word, so it needs letter spaces but no slash inside the word.",
      },
      {
        q: "What is easy to miss in SORRY?",
        a: "The repeated R is easy to shorten. Check that the .-. pattern appears twice.",
      },
      {
        q: "How should I practice SORRY by sound?",
        a: "Listen for S as three short dits, O as three dahs, then the repeated R rhythm before Y.",
      },
      {
        q: "Can I copy SORRY into a puzzle or note?",
        a: "Yes. Use periods, hyphens, and spaces between letters so the word stays decodable.",
      },
    ],
    metaTitle: "Sorry in Morse Code | Copy, Audio, and Breakdown | MorseWords",
    metaDescription:
      "See SORRY in Morse code, copy and hear the word, review S O R R Y spacing, and practice the repeated R with S and O contrast.",
    keywords:
      "sorry in morse code, sorry morse code, morse code sorry, sorry dots and dashes",
  }),
  "love-in-morse-code": makePhrasePage({
    slug: "love-in-morse-code",
    eyebrow: "Phrase lookup",
    label: "LOVE",
    displayTitle: "Love in Morse Code",
    plainTextValue: "LOVE",
    answerSummary:
      "LOVE in Morse code is .-.. --- ...- . for L O V E. LOVE is one word; I LOVE YOU adds word breaks around it.",
    breakdownIntro:
      "LOVE is encoded as L, O, V, and E. It is not a single special Morse symbol for the idea of love.",
    contextTitle: "Using LOVE in Morse",
    context: [
      {
        title: "One word, not a phrase",
        text: "LOVE has no internal word slash. Compare it with I LOVE YOU when you need a full three-word phrase.",
        href: "/i-love-you-in-morse-code",
      },
      {
        title: "Design and gift checks",
        text: "For cards, engraving, tattoos, or jewelry, verify every dot, dash, and letter gap before final use.",
      },
      {
        title: "Listen before copying",
        text: "Hearing L O V E helps you catch missing gaps that may be hard to see in a decorative design.",
        href: "/audio?text=LOVE",
      },
    ],
    examples: [
      {
        title: "Single word",
        text: "LOVE",
        morse: morseForText("LOVE"),
        note: "Use this when you only want the word LOVE.",
      },
      {
        title: "Full phrase comparison",
        text: "I LOVE YOU",
        morse: morseForText("I LOVE YOU").replace(/\s{7,}/g, " / "),
        note: "The phrase adds word separators around LOVE.",
      },
      {
        title: "Design check",
        text: "LOVE",
        morse: morseForText("LOVE"),
        note: "Copy the plain Morse first, then check any styled version against it.",
      },
    ],
    commonMistakes: [
      {
        title: "Treating LOVE as one symbol",
        text: "Morse spells L, O, V, and E. It does not use one combined symbol for LOVE.",
      },
      {
        title: "Losing letter spaces in designs",
        text: "Decorative layouts can collapse L O V E into one run. Keep each letter pattern readable.",
        href: "/copy-and-paste-morse-code",
      },
      {
        title: "Mixing LOVE with I LOVE YOU",
        text: "LOVE is one word. I LOVE YOU has three words and needs word breaks.",
        href: "/i-love-you-in-morse-code",
      },
    ],
    relatedLinks: [
      { href: "/?text=LOVE", label: "Open in translator", primary: true },
      { href: "/audio?text=LOVE", label: "Hear LOVE" },
      { href: "/morse-code-encoder?text=LOVE", label: "Open in encoder" },
      { href: "/i-love-you-in-morse-code", label: "I LOVE YOU" },
      { href: "/copy-and-paste-morse-code", label: "Copy safely" },
      { href: "/morse-code-words", label: "More Morse words" },
    ],
    faqItems: [
      {
        q: "What is LOVE in Morse code?",
        a: "LOVE in Morse code is .-.. --- ...- . for L O V E.",
      },
      {
        q: "Is LOVE the same as I LOVE YOU in Morse code?",
        a: "No. LOVE is one word, while I LOVE YOU is a three-word phrase with word gaps.",
      },
      {
        q: "Should I use slashes for LOVE?",
        a: "No slash is needed inside LOVE because it is one word. Use slashes only between words.",
      },
      {
        q: "How should I check LOVE before engraving or tattooing it?",
        a: "Compare the final design against the plain .-.. --- ...- . pattern and keep letter gaps visible.",
      },
      {
        q: "Can I hear LOVE in Morse code?",
        a: "Yes. Use the audio link to load LOVE into the MorseWords audio tool.",
      },
    ],
    metaTitle: "Love in Morse Code | Copy, Audio, and Breakdown | MorseWords",
    metaDescription:
      "See LOVE in Morse code, copy and hear the one-word pattern, compare it with I LOVE YOU, and check spacing for gifts or designs.",
    keywords:
      "love in morse code, love morse code, morse code love, love dots and dashes",
  }),
  "hello-world-in-morse-code": makePhrasePage({
    slug: "hello-world-in-morse-code",
    eyebrow: "Phrase lookup",
    label: "HELLO WORLD",
    displayTitle: "Hello World in Morse Code",
    plainTextValue: "HELLO WORLD",
    answerSummary:
      "HELLO WORLD in Morse code is .... . .-.. .-.. --- / .-- --- .-. .-.. -.. when the word break is shown with a slash.",
    breakdownIntro:
      "HELLO WORLD has two words. The word boundary between HELLO and WORLD is the main thing to preserve.",
    contextTitle: "Using HELLO WORLD in Morse",
    context: [
      {
        title: "Programming-style practice phrase",
        text: "HELLO WORLD is familiar from coding examples and works well as a two-word Morse spacing drill.",
      },
      {
        title: "Word boundary example",
        text: "Use a slash or a larger gap between HELLO and WORLD so the copied phrase does not merge into one run.",
        href: "/morse-code-word-separator",
      },
      {
        title: "Classroom and puzzle use",
        text: "The phrase is familiar enough for learners to check, while still forcing them to handle repeated letters and a word gap.",
      },
    ],
    examples: [
      {
        title: "Slash-separated phrase",
        text: "HELLO WORLD",
        morse: morseForText("HELLO WORLD").replace(/\s{7,}/g, " / "),
        note: "This is the clearest format for posts, worksheets, and puzzles.",
      },
      {
        title: "Timing-style spacing",
        text: "HELLO WORLD",
        morse: morseForText("HELLO WORLD"),
        note: "The wider gap between O and W represents the word boundary.",
      },
      {
        title: "Single-word comparison",
        text: "HELLO",
        morse: morseForText("HELLO"),
        note: "HELLO by itself has no word separator.",
      },
    ],
    commonMistakes: [
      {
        title: "Dropping the word boundary",
        text: "HELLO WORLD needs a word gap between O and W. Without it, the phrase becomes hard to decode.",
        href: "/morse-code-word-separator",
      },
      {
        title: "Missing repeated L",
        text: "HELLO has two L letters and WORLD has one L. Check every .-.. pattern before copying.",
        href: "/l-in-morse-code",
      },
      {
        title: "Using styled separators",
        text: "For copy and paste, a plain slash is more reliable than decorative dividers.",
        href: "/copy-and-paste-morse-code",
      },
    ],
    relatedLinks: [
      { href: "/?text=HELLO%20WORLD", label: "Open in translator", primary: true },
      { href: "/audio?text=HELLO%20WORLD", label: "Hear HELLO WORLD" },
      { href: "/morse-code-encoder?text=HELLO%20WORLD", label: "Open in encoder" },
      { href: "/hello-in-morse-code", label: "HELLO" },
      { href: "/morse-code-word-separator", label: "Word spacing" },
      { href: "/morse-code-words", label: "More Morse words" },
    ],
    faqItems: [
      {
        q: "What is HELLO WORLD in Morse code?",
        a: "HELLO WORLD in Morse code is .... . .-.. .-.. --- / .-- --- .-. .-.. -.. with a slash word separator.",
      },
      {
        q: "Why is there a slash in HELLO WORLD?",
        a: "The slash shows the word break between HELLO and WORLD in copied Morse text.",
      },
      {
        q: "Is HELLO WORLD useful for Morse practice?",
        a: "Yes. It is familiar, includes repeated letters, and gives beginners a clear two-word spacing example.",
      },
      {
        q: "Can I write HELLO WORLD without a slash?",
        a: "Yes, but you still need a wider word gap between HELLO and WORLD so the phrase stays readable.",
      },
      {
        q: "What should I compare HELLO WORLD with?",
        a: "Compare it with HELLO alone and with the word separator guide to understand the word boundary.",
      },
    ],
    metaTitle: "Hello World in Morse Code | Copy, Audio, and Word Spacing | MorseWords",
    metaDescription:
      "See HELLO WORLD in Morse code, copy and hear the two-word phrase, review slash word spacing, and use it for coding or classroom practice.",
    keywords:
      "hello world in morse code, hello world morse code, morse code hello world, coding phrase morse",
  }),
  "test-in-morse-code": makePhrasePage({
    slug: "test-in-morse-code",
    eyebrow: "Phrase lookup",
    label: "TEST",
    displayTitle: "Test in Morse Code",
    plainTextValue: "TEST",
    answerSummary:
      "TEST in Morse code is - . ... - for T E S T. It is a practical check word for the translator, decoder, audio tool, and spacing practice.",
    breakdownIntro:
      "TEST is encoded as T, E, S, and T. The short T and E contrast makes it useful for quick tool checks.",
    contextTitle: "Using TEST in Morse",
    context: [
      {
        title: "Tool check word",
        text: "TEST is short enough to use when trying the translator, decoder, audio playback, or a worksheet example.",
      },
      {
        title: "T and E contrast",
        text: "T is one dah and E is one dit, so TEST is useful for hearing long versus short single-mark letters.",
        href: "/t-in-morse-code",
      },
      {
        title: "Simple spacing practice",
        text: "TEST is one word. Keep letter gaps clear, then compare it with two-word examples when you need word spacing.",
      },
    ],
    examples: [
      {
        title: "Direct word",
        text: "TEST",
        morse: morseForText("TEST"),
        note: "A compact check word for conversion and audio playback.",
      },
      {
        title: "Number check",
        text: "TEST 123",
        morse: morseForText("TEST 123").replace(/\s{7,}/g, " / "),
        note: "Useful when you want to verify both letters and number spacing.",
      },
      {
        title: "Audio drill",
        text: "T E S T",
        morse: morseForText("T E S T").replace(/\s{7,}/g, " / "),
        note: "Separated letters help beginners hear the building blocks before the word.",
      },
    ],
    commonMistakes: [
      {
        title: "Mixing up T and E",
        text: "T is a single dash and E is a single dot. In TEST they appear right next to each other.",
        href: "/e-in-morse-code",
      },
      {
        title: "Flattening S",
        text: "S is three dits. If the three short marks collapse, TEST becomes harder to check by ear.",
        href: "/s-in-morse-code",
      },
      {
        title: "Using TEST as a word-gap check",
        text: "TEST is one word, so it checks letter spacing. Use a two-word phrase when you need word-boundary practice.",
      },
    ],
    relatedLinks: [
      { href: "/?text=TEST", label: "Open in translator", primary: true },
      { href: "/audio?text=TEST", label: "Hear TEST" },
      { href: "/morse-code-encoder?text=TEST", label: "Open in encoder" },
      { href: "/morse-code-decoder", label: "Decoder" },
      { href: "/practice", label: "Practice" },
      { href: "/morse-code-words", label: "More Morse words" },
    ],
    faqItems: [
      {
        q: "What is TEST in Morse code?",
        a: "TEST in Morse code is - . ... - for T E S T.",
      },
      {
        q: "Why is TEST useful for practice?",
        a: "TEST is short, familiar, and checks T, E, and S timing without needing a long phrase.",
      },
      {
        q: "Can TEST check word spacing?",
        a: "TEST is one word, so it mainly checks letter spacing. Use a phrase like HELLO WORLD for word gaps.",
      },
      {
        q: "What is the common mistake in TEST?",
        a: "The common mistake is confusing T and E or flattening the three dits in S.",
      },
      {
        q: "Which tool should I use after copying TEST?",
        a: "Use the decoder to check typed Morse, the audio tool to hear it, or practice mode to build recall.",
      },
    ],
    metaTitle: "Test in Morse Code | Copy, Audio, and Breakdown | MorseWords",
    metaDescription:
      "See TEST in Morse code, copy and hear the check word, review T E S T spacing, and use it with the encoder, decoder, audio, and practice tools.",
    keywords:
      "test in morse code, test morse code, morse code test, test dots and dashes",
  }),
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
