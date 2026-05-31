import {
  CANONICAL_ROUTE_PATHS,
  REDIRECT_ALIASES,
  REDIRECT_ALIAS_PATHS,
  ROUTES,
  type RedirectAliasPath,
} from "../../../app/client/data/routes";

const LETTERS = "abcdefghijklmnopqrstuvwxyz".split("");
const DIGITS = "0123456789".split("");

function uniquePaths(paths: readonly string[]) {
  return [...new Set(paths)];
}

export const LETTER_ROUTE_PATHS = LETTERS.map(
  (letter) => `/${letter}-in-morse-code`,
);

export const NUMBER_ROUTE_PATHS = DIGITS.map((digit) => `/${digit}-in-morse-code`);

export const GENERATED_ROUTE_PATHS = [
  ...LETTER_ROUTE_PATHS,
  ...NUMBER_ROUTE_PATHS,
] as const;

export const CANONICAL_SMOKE_ROUTES = uniquePaths([
  ...CANONICAL_ROUTE_PATHS,
  ...GENERATED_ROUTE_PATHS,
]);

export const REDIRECT_ROUTE_EXPECTATIONS = Object.entries(REDIRECT_ALIASES).map(
  ([from, to]) => ({
    from: from as RedirectAliasPath,
    to,
  }),
);

export const REDIRECT_PATHS = REDIRECT_ROUTE_EXPECTATIONS.map((route) => route.from);

export function redirectAliasesFor(canonicalPath: string) {
  return REDIRECT_ROUTE_EXPECTATIONS.filter((route) => route.to === canonicalPath).map(
    (route) => route.from,
  );
}

export const AUDIO_DECODER_ALIAS_PATHS = redirectAliasesFor(ROUTES.audioDecoder);
export const CHART_ALIAS_PATHS = redirectAliasesFor(ROUTES.chart);
export const MP3_ALIAS_PATHS = redirectAliasesFor(ROUTES.mp3Generator);
export const READER_ALIAS_PATHS = redirectAliasesFor(ROUTES.reader);
export const TEST_ALIAS_PATHS = redirectAliasesFor(ROUTES.test);

export const ROUTE_EXCLUSIONS = ["/morse-code-wav-generator"] as const;

export const PRIMARY_TOOL_ROUTES = [
  ROUTES.home,
  ROUTES.audio,
  ROUTES.audioDecoder,
  ROUTES.encoder,
  ROUTES.decoder,
  ROUTES.reader,
  ROUTES.soundGenerator,
  ROUTES.mp3Generator,
  ROUTES.wordSearchBuilder,
  ROUTES.printableChart,
] as const;

const CORE_ROUTES = [
  ROUTES.home,
  ROUTES.encoder,
  ROUTES.decoder,
  ROUTES.reader,
  ROUTES.dictionary,
  ROUTES.howToUse,
  ROUTES.about,
  ROUTES.contact,
  ROUTES.sitemap,
  ROUTES.sources,
  ROUTES.misc,
  ROUTES.miscCookies,
  ROUTES.miscPrivacy,
  ROUTES.miscSocials,
  ROUTES.miscTerms,
] as const;

const AUDIO_EXPORT_ROUTES = [
  ROUTES.audio,
  ROUTES.audioDecoder,
  ROUTES.audioPractice,
  ROUTES.audioQuiz,
  ROUTES.soundGenerator,
  ROUTES.mp3Generator,
] as const;

const PRACTICE_QUIZ_ROUTES = [
  ROUTES.practice,
  ROUTES.typing,
  ROUTES.sentencePractice,
  ROUTES.wordTrainer,
  ROUTES.visualPractice,
  ROUTES.visualQuiz,
  ROUTES.test,
] as const;

const ALIAS_AND_METADATA_ROUTES = [...REDIRECT_ALIAS_PATHS] as const;

const groupedCanonicalRoutes = new Set<string>([
  ...CORE_ROUTES,
  ...AUDIO_EXPORT_ROUTES,
  ...PRACTICE_QUIZ_ROUTES,
]);

const REFERENCE_CONTENT_ROUTES = CANONICAL_SMOKE_ROUTES.filter(
  (route) => !groupedCanonicalRoutes.has(route),
);

export const ROUTE_SMOKE_GROUPS = {
  core: CORE_ROUTES,
  audioExport: AUDIO_EXPORT_ROUTES,
  practiceQuiz: PRACTICE_QUIZ_ROUTES,
  referenceContent: REFERENCE_CONTENT_ROUTES,
  aliasesMetadata: ALIAS_AND_METADATA_ROUTES,
} as const;

export const APP_ROUTES = uniquePaths(Object.values(ROUTE_SMOKE_GROUPS).flat());
