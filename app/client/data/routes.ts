export const SITE_ORIGIN = "https://www.morsewords.com";

export const CANONICAL_ROUTES = {
  home: "/",
  audio: "/audio",
  audioDecoder: "/morse-code-audio-decoder",
  practice: "/practice",
  typing: "/typing",
  howToUse: "/how-to-use",
  dictionary: "/dictionary",
  about: "/about",
  contact: "/contact",
  sitemap: "/sitemap",
  sources: "/sources",
  misc: "/misc",
  miscCookies: "/misc/cookies-policy",
  miscPrivacy: "/misc/privacy-policy",
  miscSocials: "/misc/socials",
  miscTerms: "/misc/terms-of-service",

  nameToMorse: "/name-to-morse-code",
  encoder: "/morse-code-encoder",
  decoder: "/morse-code-decoder",
  reader: "/morse-code-reader",
  quickBrownFox: "/the-quick-brown-fox-morse-code",
  wordSeparator: "/morse-code-word-separator",
  words: "/morse-code-words",
  chart: "/morse-code-chart",
  alphabet: "/morse-code-alphabet",
  numbers: "/morse-code-numbers",
  printableChart: "/morse-code-printable-chart",
  internationalTranslator: "/morse-code-international-translator",
  sos: "/morse-code-sos",
  sentencePractice: "/morse-code-sentence-practice",
  learn: "/learn-morse-code",
  timing: "/morse-code-timing",
  farnsworth: "/farnsworth-timing",
  wordTrainer: "/morse-code-word-trainer",
  prosigns: "/morse-code-prosigns",
  qCodes: "/morse-code-q-codes",
  punctuation: "/morse-code-punctuation",
  practicePlan: "/morse-code-practice-plan",
  test: "/morse-code-test",
  internationalReference: "/international-morse-code-reference",
  audioPractice: "/morse-code-audio-practice",
  wordSearchBuilder: "/morse-code-word-search-builder",
  visualPractice: "/morse-code-visual-practice",
  audioQuiz: "/morse-code-audio-quiz",
  visualQuiz: "/morse-code-visual-quiz",
  soundGenerator: "/morse-code-sound-generator",
  mp3Generator: "/morse-code-mp3-generator",
  bookTranslator: "/morse-code-book-translator",
  morseBooks: "/morse-code-books",
  morseAudiobooks: "/morse-code-audiobooks",
  videoGenerator: "/morse-code-video-generator",

  howToRead: "/how-to-read-morse-code",
  howToWrite: "/how-to-write-in-morse-code",
  howToType: "/how-to-type-in-morse-code",
  copyAndPaste: "/copy-and-paste-morse-code",
  withoutSpaces: "/morse-code-without-spaces",
  separateWords: "/how-to-separate-words-in-morse-code",

  iLoveYou: "/i-love-you-in-morse-code",
  cq: "/cq-in-morse-code",
  hello: "/hello-in-morse-code",
  hi: "/hi-in-morse-code",
  help: "/help-in-morse-code",
  helpMe: "/help-me-in-morse-code",
  yes: "/yes-in-morse-code",
  no: "/no-in-morse-code",
  ok: "/ok-in-morse-code",
  sorry: "/sorry-in-morse-code",
  love: "/love-in-morse-code",
  helloWorld: "/hello-world-in-morse-code",
  testPhrase: "/test-in-morse-code",

  questionMark: "/question-mark-in-morse-code",
  atSign: "/at-sign-in-morse-code",
  space: "/space-in-morse-code",
  slash: "/slash-in-morse-code",
  period: "/period-in-morse-code",
  comma: "/comma-in-morse-code",
  exclamationMark: "/exclamation-mark-in-morse-code",
  apostrophe: "/apostrophe-in-morse-code",
  hyphen: "/hyphen-in-morse-code",
  colon: "/colon-in-morse-code",
  semicolon: "/semicolon-in-morse-code",
  equalsSign: "/equals-sign-in-morse-code",
  plusSign: "/plus-sign-in-morse-code",
  quotationMark: "/quotation-mark-in-morse-code",
  parentheses: "/parentheses-in-morse-code",
  ampersand: "/ampersand-in-morse-code",
  underscore: "/underscore-in-morse-code",

  letterA: "/a-in-morse-code",
  letterE: "/e-in-morse-code",
  letterO: "/o-in-morse-code",
  letterQ: "/q-in-morse-code",
  letterS: "/s-in-morse-code",
} as const;

export const REDIRECT_ROUTE_ALIASES = {
  translatorAlias: "/morse-code-translator",
  dictionaryAlias: "/morse-code-dictionary",
  wordGameAlias: "/morse-code-word-game",
  audioGeneratorAlias: "/morse-code-audio-generator",
  textToMorseAlias: "/text-to-morse-code",
  morseToTextAlias: "/morse-to-text",
  audioToMorseAlias: "/audio-to-morse-code",
  audioToTextAlias: "/morse-code-audio-to-text",
  soundToTextAlias: "/morse-code-sound-to-text",
  fromAudioAlias: "/morse-code-from-audio",
  translateAudioAlias: "/translate-morse-code-audio",
  realtimeAudioDecoderAlias: "/real-time-morse-code-decoder",
  mp3AudioDecoderAlias: "/mp3-morse-code-decoder",
  wavAudioDecoderAlias: "/wav-morse-code-decoder",
  lettersAlias: "/morse-code-letters",
  internationalChartAlias: "/international-morse-code-chart",
  chartAz09Alias: "/morse-code-chart-a-z-0-9",
  alphabetChartAlias: "/morse-code-alphabet-chart",
  practiceTestAlias: "/morse-code-practice-test",
  listeningTestAlias: "/morse-code-listening-test",
  typingTestAlias: "/morse-code-typing-test",
  speedTestAlias: "/morse-code-speed-test",
  morseTypeTestAlias: "/morse-type-test",
  testsAlias: "/morse-code-tests",
  testOnlineAlias: "/morse-code-test-online",
  morseReaderAlias: "/morse-reader",
  readMorseAlias: "/read-morse-code",
  morseToEnglishAlias: "/morse-to-english",
  morseCodeToEnglishAlias: "/morse-code-to-english",
  textToMorseMp3Alias: "/text-to-morse-code-mp3",
  morseToMp3Alias: "/morse-to-mp3",
  morseCodeToMp3Alias: "/morse-code-to-mp3",
  textToMorseMp3ShortAlias: "/text-to-morse-mp3",
  translatorAudioMp3Alias: "/morse-code-translator-audio-mp3",
  textToMorseVideoAlias: "/text-to-morse-code-video",
  visualQuizTypoAlias: "/morse-code-vidual-quiz",
  ebookTranslatorAlias: "/morse-code-ebook-translator",
} as const;

export const ROUTES = {
  ...CANONICAL_ROUTES,
  ...REDIRECT_ROUTE_ALIASES,
} as const;

export type CanonicalRoutePath =
  (typeof CANONICAL_ROUTES)[keyof typeof CANONICAL_ROUTES];

export type RedirectAliasRoutePath =
  (typeof REDIRECT_ROUTE_ALIASES)[keyof typeof REDIRECT_ROUTE_ALIASES];

export const CANONICAL_ROUTE_PATHS = Object.values(
  CANONICAL_ROUTES,
) as CanonicalRoutePath[];

export const REDIRECT_ALIASES = {
  [ROUTES.translatorAlias]: ROUTES.home,
  [ROUTES.dictionaryAlias]: ROUTES.dictionary,
  [ROUTES.wordGameAlias]: ROUTES.wordTrainer,
  [ROUTES.audioGeneratorAlias]: ROUTES.audio,
  [ROUTES.textToMorseAlias]: ROUTES.encoder,
  [ROUTES.morseToTextAlias]: ROUTES.decoder,
  [ROUTES.audioToMorseAlias]: ROUTES.audioDecoder,
  [ROUTES.audioToTextAlias]: ROUTES.audioDecoder,
  [ROUTES.soundToTextAlias]: ROUTES.audioDecoder,
  [ROUTES.fromAudioAlias]: ROUTES.audioDecoder,
  [ROUTES.translateAudioAlias]: ROUTES.audioDecoder,
  [ROUTES.realtimeAudioDecoderAlias]: ROUTES.audioDecoder,
  [ROUTES.mp3AudioDecoderAlias]: ROUTES.audioDecoder,
  [ROUTES.wavAudioDecoderAlias]: ROUTES.audioDecoder,
  [ROUTES.lettersAlias]: ROUTES.alphabet,
  [ROUTES.internationalChartAlias]: ROUTES.chart,
  [ROUTES.chartAz09Alias]: ROUTES.chart,
  [ROUTES.alphabetChartAlias]: ROUTES.chart,
  [ROUTES.practiceTestAlias]: ROUTES.test,
  [ROUTES.listeningTestAlias]: ROUTES.test,
  [ROUTES.typingTestAlias]: ROUTES.test,
  [ROUTES.speedTestAlias]: ROUTES.test,
  [ROUTES.morseTypeTestAlias]: ROUTES.test,
  [ROUTES.testsAlias]: ROUTES.test,
  [ROUTES.testOnlineAlias]: ROUTES.test,
  [ROUTES.morseReaderAlias]: ROUTES.reader,
  [ROUTES.readMorseAlias]: ROUTES.reader,
  [ROUTES.morseToEnglishAlias]: ROUTES.reader,
  [ROUTES.morseCodeToEnglishAlias]: ROUTES.reader,
  [ROUTES.textToMorseMp3Alias]: ROUTES.mp3Generator,
  [ROUTES.morseToMp3Alias]: ROUTES.mp3Generator,
  [ROUTES.morseCodeToMp3Alias]: ROUTES.mp3Generator,
  [ROUTES.textToMorseMp3ShortAlias]: ROUTES.mp3Generator,
  [ROUTES.translatorAudioMp3Alias]: ROUTES.mp3Generator,
  [ROUTES.textToMorseVideoAlias]: ROUTES.videoGenerator,
  [ROUTES.visualQuizTypoAlias]: ROUTES.visualQuiz,
  [ROUTES.ebookTranslatorAlias]: ROUTES.bookTranslator,
} as const;

export type RedirectAliasPath = keyof typeof REDIRECT_ALIASES;

export const REDIRECT_ALIAS_PATHS = Object.keys(
  REDIRECT_ALIASES,
) as RedirectAliasPath[];

export function normalizeRoutePath(rawPath: string) {
  const withoutHash = rawPath.split("#")[0] ?? "";
  const withoutQuery = withoutHash.split("?")[0] ?? "";
  const pathname = withoutQuery || "/";
  return pathname.length > 1 && pathname.endsWith("/")
    ? pathname.slice(0, -1)
    : pathname;
}

export function routeSlug(path: string) {
  const normalized = normalizeRoutePath(path);
  return normalized === "/" ? "" : normalized.slice(1);
}

export function absoluteUrl(path: string) {
  return `${SITE_ORIGIN}${normalizeRoutePath(path)}`;
}

export function isRedirectAliasPath(path: string): path is RedirectAliasPath {
  return REDIRECT_ALIAS_PATHS.includes(normalizeRoutePath(path) as RedirectAliasPath);
}

export function getCanonicalRoutePath(path: string) {
  const normalized = normalizeRoutePath(path);
  if (isRedirectAliasPath(normalized)) return REDIRECT_ALIASES[normalized];
  return normalized;
}
