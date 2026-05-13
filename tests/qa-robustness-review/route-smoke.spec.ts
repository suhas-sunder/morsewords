import { expect, test } from "@playwright/test";
import {
  APP_ROUTES,
  blockExternalNetwork,
  collectConsoleErrors,
  writeArtifact,
} from "./helpers";

const LETTER_MORSE = {
  A: ".-",
  B: "-...",
  C: "-.-.",
  D: "-..",
  E: ".",
  F: "..-.",
  G: "--.",
  H: "....",
  I: "..",
  J: ".---",
  K: "-.-",
  L: ".-..",
  M: "--",
  N: "-.",
  O: "---",
  P: ".--.",
  Q: "--.-",
  R: ".-.",
  S: "...",
  T: "-",
  U: "..-",
  V: "...-",
  W: ".--",
  X: "-..-",
  Y: "-.--",
  Z: "--..",
} as const;

const LETTER_ROUTE_EXPECTATIONS = Object.entries(LETTER_MORSE).map(
  ([letter, morse]) => ({
    path: `/${letter.toLowerCase()}-in-morse-code`,
    h1: `${letter} in Morse Code`,
    title: `${letter} in Morse Code | Symbol, Sound, and Examples | MorseWords`,
    morse,
    letter,
  }),
);

const LETTER_ROUTE_PATHS = LETTER_ROUTE_EXPECTATIONS.map((route) => route.path);

const NUMBER_MORSE = {
  "0": "-----",
  "1": ".----",
  "2": "..---",
  "3": "...--",
  "4": "....-",
  "5": ".....",
  "6": "-....",
  "7": "--...",
  "8": "---..",
  "9": "----.",
} as const;

const NUMBER_ROUTE_EXPECTATIONS = Object.entries(NUMBER_MORSE).map(
  ([digit, morse]) => ({
    path: `/${digit}-in-morse-code`,
    h1: `${digit} in Morse Code`,
    title: `${digit} in Morse Code | Number, Sound, and Examples | MorseWords`,
    morse,
    digit,
  }),
);

const NUMBER_ROUTE_PATHS = NUMBER_ROUTE_EXPECTATIONS.map((route) => route.path);

const PHRASE_ROUTE_EXPECTATIONS = [
  {
    path: "/hello-in-morse-code",
    h1: "Hello in Morse Code",
    title: "Hello in Morse Code | Copy, Audio, and Breakdown | MorseWords",
    textQuery: "HELLO",
  },
  {
    path: "/hi-in-morse-code",
    h1: "Hi in Morse Code",
    title: "Hi in Morse Code | Copy, Audio, and Breakdown | MorseWords",
    textQuery: "HI",
  },
  {
    path: "/help-in-morse-code",
    h1: "Help in Morse Code",
    title: "Help in Morse Code | Copy, Audio, and SOS Difference | MorseWords",
    textQuery: "HELP",
  },
  {
    path: "/help-me-in-morse-code",
    h1: "Help Me in Morse Code",
    title: "Help Me in Morse Code | Copy, Audio, and Word Spacing | MorseWords",
    textQuery: "HELP%20ME",
  },
  {
    path: "/yes-in-morse-code",
    h1: "Yes in Morse Code",
    title: "Yes in Morse Code | Copy, Audio, and Breakdown | MorseWords",
    textQuery: "YES",
  },
  {
    path: "/no-in-morse-code",
    h1: "No in Morse Code",
    title: "No in Morse Code | Copy, Audio, and Breakdown | MorseWords",
    textQuery: "NO",
  },
  {
    path: "/ok-in-morse-code",
    h1: "OK in Morse Code",
    title: "OK in Morse Code | Copy, Audio, and Breakdown | MorseWords",
    textQuery: "OK",
  },
  {
    path: "/sorry-in-morse-code",
    h1: "Sorry in Morse Code",
    title: "Sorry in Morse Code | Copy, Audio, and Breakdown | MorseWords",
    textQuery: "SORRY",
  },
  {
    path: "/love-in-morse-code",
    h1: "Love in Morse Code",
    title: "Love in Morse Code | Copy, Audio, and Breakdown | MorseWords",
    textQuery: "LOVE",
  },
  {
    path: "/hello-world-in-morse-code",
    h1: "Hello World in Morse Code",
    title: "Hello World in Morse Code | Copy, Audio, and Word Spacing | MorseWords",
    textQuery: "HELLO%20WORLD",
  },
  {
    path: "/test-in-morse-code",
    h1: "Test in Morse Code",
    title: "Test in Morse Code | Copy, Audio, and Breakdown | MorseWords",
    textQuery: "TEST",
  },
] as const;

const PHRASE_ROUTE_PATHS = PHRASE_ROUTE_EXPECTATIONS.map((route) => route.path);

const SPACING_PUNCTUATION_ROUTE_EXPECTATIONS = [
  {
    path: "/space-in-morse-code",
    h1: "Space in Morse Code",
    title: "Space in Morse Code | Word Gaps, Slashes, and Examples | MorseWords",
    textQuery: "HI%20OK",
  },
  {
    path: "/slash-in-morse-code",
    h1: "Slash in Morse Code",
    title: "Slash in Morse Code | Separator, Punctuation, and Examples | MorseWords",
    textQuery: "%2F",
  },
  {
    path: "/period-in-morse-code",
    h1: "Period in Morse Code",
    title: "Period in Morse Code | Copy, Decode, and Examples | MorseWords",
    textQuery: ".",
  },
  {
    path: "/comma-in-morse-code",
    h1: "Comma in Morse Code",
    title: "Comma in Morse Code | Copy, Decode, and Examples | MorseWords",
    textQuery: "%2C",
  },
  {
    path: "/exclamation-mark-in-morse-code",
    h1: "Exclamation Mark in Morse Code",
    title: "Exclamation Mark in Morse Code | Copy, Decode, and Examples | MorseWords",
    textQuery: "!",
  },
  {
    path: "/apostrophe-in-morse-code",
    h1: "Apostrophe in Morse Code",
    title: "Apostrophe in Morse Code | Names, Contractions, and Examples | MorseWords",
    textQuery: "%27",
  },
  {
    path: "/hyphen-in-morse-code",
    h1: "Hyphen in Morse Code",
    title: "Hyphen in Morse Code | Names, Dashes, and Examples | MorseWords",
    textQuery: "-",
  },
  {
    path: "/colon-in-morse-code",
    h1: "Colon in Morse Code",
    title: "Colon in Morse Code | Copy, Decode, and Examples | MorseWords",
    textQuery: "%3A",
  },
  {
    path: "/semicolon-in-morse-code",
    h1: "Semicolon in Morse Code",
    title: "Semicolon in Morse Code | Copy, Decode, and Examples | MorseWords",
    textQuery: "%3B",
  },
  {
    path: "/equals-sign-in-morse-code",
    h1: "Equals Sign in Morse Code",
    title: "Equals Sign in Morse Code | Copy, Decode, and Examples | MorseWords",
    textQuery: "%3D",
  },
  {
    path: "/plus-sign-in-morse-code",
    h1: "Plus Sign in Morse Code",
    title: "Plus Sign in Morse Code | Copy, Decode, and URL Tips | MorseWords",
    textQuery: "%2B",
  },
  {
    path: "/quotation-mark-in-morse-code",
    h1: "Quotation Mark in Morse Code",
    title: "Quotation Mark in Morse Code | Copy, Decode, and Examples | MorseWords",
    textQuery: "%22",
  },
  {
    path: "/parentheses-in-morse-code",
    h1: "Parentheses in Morse Code",
    title: "Parentheses in Morse Code | Copy, Decode, and Examples | MorseWords",
    textQuery: "%28%29",
  },
  {
    path: "/ampersand-in-morse-code",
    h1: "Ampersand in Morse Code",
    title: "Ampersand in Morse Code | Copy, Decode, and Examples | MorseWords",
    textQuery: "%26",
  },
  {
    path: "/underscore-in-morse-code",
    h1: "Underscore in Morse Code",
    title: "Underscore in Morse Code | Usernames, Files, and Examples | MorseWords",
    textQuery: "_",
  },
] as const;

const SPACING_PUNCTUATION_ROUTE_PATHS =
  SPACING_PUNCTUATION_ROUTE_EXPECTATIONS.map((route) => route.path);

const FINAL_ROUTE_EXPECTATIONS = [
  {
    path: "/how-to-separate-words-in-morse-code",
    h1: "How to Separate Words in Morse Code",
    title:
      "How to Separate Words in Morse Code | Spaces, Slashes, and Examples | MorseWords",
    schemaType: "LearningResource",
  },
  {
    path: "/contact",
    h1: "Contact MorseWords",
    title: "Contact MorseWords | Feedback, Corrections, and Questions",
    schemaType: "ContactPage",
  },
] as const;

const FINAL_ROUTE_PATHS = FINAL_ROUTE_EXPECTATIONS.map((route) => route.path);

const BREADCRUMB_SCHEMA_EXPECTATIONS = [
  {
    path: "/a-in-morse-code",
    names: ["Home", "Morse Code Alphabet", "A in Morse Code"],
  },
  {
    path: "/7-in-morse-code",
    names: ["Home", "Morse Code Numbers", "7 in Morse Code"],
  },
  {
    path: "/hello-in-morse-code",
    names: ["Home", "Morse Code Words", "Hello in Morse Code"],
  },
  {
    path: "/colon-in-morse-code",
    names: ["Home", "Morse Code Punctuation", "Colon in Morse Code"],
  },
  {
    path: "/how-to-separate-words-in-morse-code",
    names: [
      "Home",
      "Morse Code Word Separator",
      "How to Separate Words in Morse Code",
    ],
  },
  {
    path: "/contact",
    names: ["Home", "Contact MorseWords"],
  },
] as const;

const FIRST_BATCH_LINK_CHECK_ROUTES = [
  "/",
  "/audio",
  "/morse-code-audio-decoder",
  "/morse-code-encoder",
  "/morse-code-decoder",
  "/morse-code-chart",
  "/morse-code-alphabet",
  "/morse-code-punctuation",
  "/morse-code-word-separator",
  "/morse-code-words",
  "/sitemap",
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
  ...LETTER_ROUTE_PATHS,
  ...NUMBER_ROUTE_PATHS,
  ...PHRASE_ROUTE_PATHS,
  ...SPACING_PUNCTUATION_ROUTE_PATHS,
  ...FINAL_ROUTE_PATHS,
];

const FIRST_BATCH_ROUTE_EXPECTATIONS = [
  {
    path: "/name-to-morse-code",
    h1: "Name to Morse Code",
    title: "Name to Morse Code | Convert Any Name and Hear It | MorseWords",
    schemaType: "WebApplication",
  },
  {
    path: "/morse-code-numbers",
    h1: "Morse Code Numbers",
    title: "Morse Code Numbers | 0-9 Chart, Sound, and Examples | MorseWords",
    schemaType: "CollectionPage",
  },
  {
    path: "/how-to-read-morse-code",
    h1: "How to Read Morse Code",
    title: "How to Read Morse Code | Rhythm, Spacing, and Examples | MorseWords",
    schemaType: "LearningResource",
  },
  {
    path: "/how-to-write-in-morse-code",
    h1: "How to Write in Morse Code",
    title: "How to Write in Morse Code | Letters, Words, and Spacing | MorseWords",
    schemaType: "LearningResource",
  },
  {
    path: "/how-to-type-in-morse-code",
    h1: "How to Type in Morse Code",
    title: "How to Type in Morse Code | Keyboard, Mobile, and Practice Tips | MorseWords",
    schemaType: "LearningResource",
  },
  {
    path: "/copy-and-paste-morse-code",
    h1: "Copy and Paste Morse Code",
    title: "Copy and Paste Morse Code | Dots, Dashes, Spaces, and Slashes | MorseWords",
    schemaType: "WebPage",
  },
  {
    path: "/morse-code-without-spaces",
    h1: "Morse Code Without Spaces",
    title: "Morse Code Without Spaces | Why It Is Hard to Decode | MorseWords",
    schemaType: "WebPage",
  },
  {
    path: "/i-love-you-in-morse-code",
    h1: "I Love You in Morse Code",
    title: "I Love You in Morse Code | Copy, Hear, and Check It | MorseWords",
    schemaType: "WebPage",
  },
  {
    path: "/cq-in-morse-code",
    h1: "CQ in Morse Code",
    title: "CQ in Morse Code | Meaning, Audio, and Examples | MorseWords",
    schemaType: "WebPage",
  },
  {
    path: "/question-mark-in-morse-code",
    h1: "Question Mark in Morse Code",
    title: "Question Mark in Morse Code | Pattern, Examples, and Audio | MorseWords",
    schemaType: "WebPage",
  },
  {
    path: "/at-sign-in-morse-code",
    h1: "At Sign in Morse Code",
    title: "At Sign in Morse Code | Pattern, Examples, and Audio | MorseWords",
    schemaType: "WebPage",
  },
] as const;

const REDIRECT_ROUTE_EXPECTATIONS = [
  { from: "/morse-code-letters", to: "/morse-code-alphabet" },
  { from: "/text-to-morse-code", to: "/morse-code-encoder" },
  { from: "/morse-to-text", to: "/morse-code-decoder" },
  { from: "/morse-code-translator", to: "/" },
  { from: "/morse-code-audio-generator", to: "/audio" },
  { from: "/morse-code-vidual-quiz", to: "/morse-code-visual-quiz" },
  { from: "/audio-to-morse-code", to: "/morse-code-audio-decoder" },
  { from: "/morse-code-audio-to-text", to: "/morse-code-audio-decoder" },
  { from: "/morse-code-sound-to-text", to: "/morse-code-audio-decoder" },
  { from: "/morse-code-from-audio", to: "/morse-code-audio-decoder" },
  { from: "/translate-morse-code-audio", to: "/morse-code-audio-decoder" },
  { from: "/real-time-morse-code-decoder", to: "/morse-code-audio-decoder" },
  { from: "/mp3-morse-code-decoder", to: "/morse-code-audio-decoder" },
  { from: "/wav-morse-code-decoder", to: "/morse-code-audio-decoder" },
  { from: "/international-morse-code-chart", to: "/morse-code-chart" },
  { from: "/morse-code-chart-a-z-0-9", to: "/morse-code-chart" },
  { from: "/morse-code-alphabet-chart", to: "/morse-code-chart" },
] as const;

const DEFERRED_OR_REDIRECT_ONLY_ROUTES = [
  ...REDIRECT_ROUTE_EXPECTATIONS.map((route) => route.from),
  "/morse-code-wav-generator",
  "/morse-code-mp3-generator",
] as const;

const GENERATED_LEAF_SCHEMA_SUPPRESSED_PATHS = new Set<string>([
  ...LETTER_ROUTE_PATHS,
  ...NUMBER_ROUTE_PATHS,
  ...PHRASE_ROUTE_PATHS,
  ...SPACING_PUNCTUATION_ROUTE_PATHS,
  "/i-love-you-in-morse-code",
  "/cq-in-morse-code",
  "/question-mark-in-morse-code",
  "/at-sign-in-morse-code",
]);

function isDeferredLetterPath(pathname: string) {
  return (
    /^\/[a-z]-in-morse-code$/.test(pathname) &&
    !LETTER_ROUTE_PATHS.includes(pathname)
  );
}

function collectJsonLdTypes(value: unknown): string[] {
  if (Array.isArray(value)) return value.flatMap(collectJsonLdTypes);
  if (!value || typeof value !== "object") return [];

  const record = value as Record<string, unknown>;
  const ownType = typeof record["@type"] === "string" ? [record["@type"]] : [];
  return [
    ...ownType,
    ...collectJsonLdTypes(record["@graph"]),
    ...collectJsonLdTypes(record.mainEntity),
    ...collectJsonLdTypes(record.itemListElement),
  ];
}

function collectBreadcrumbNameTrails(value: unknown): string[][] {
  if (Array.isArray(value)) return value.flatMap(collectBreadcrumbNameTrails);
  if (!value || typeof value !== "object") return [];

  const record = value as Record<string, unknown>;
  const trails =
    record["@type"] === "BreadcrumbList" && Array.isArray(record.itemListElement)
      ? [
          record.itemListElement
            .map((item) =>
              item && typeof item === "object"
                ? (item as Record<string, unknown>).name
                : undefined,
            )
            .filter((name): name is string => typeof name === "string"),
        ]
      : [];

  return [...trails, ...collectBreadcrumbNameTrails(record["@graph"])];
}

function expectFaqSchemaPolicy(types: string[], routePath: string) {
  if (GENERATED_LEAF_SCHEMA_SUPPRESSED_PATHS.has(routePath)) {
    expect(types, `${routePath} omits generated leaf FAQPage schema`).not.toContain(
      "FAQPage",
    );
    return;
  }

  expect(types, `${routePath} has FAQPage`).toContain("FAQPage");
}

test.describe("route smoke and console stability", () => {
  for (const route of APP_ROUTES) {
    test(`${route} loads without server error`, async ({ page }, testInfo) => {
      await blockExternalNetwork(page);
      const consoleEntries = collectConsoleErrors(page);
      const response = await page.goto(route, {
        waitUntil: "domcontentloaded",
        timeout: 60_000,
      });
      await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

      expect(response?.status(), `${route} HTTP status`).toBeLessThan(400);
      if ((await page.locator("main").count()) > 0) {
        await expect(page.locator("main")).toBeVisible();
      } else {
        await expect(page.locator("body")).toBeVisible();
      }

      await page.screenshot({
        path: `test-artifacts/qa-robustness-review/screenshots/smoke-${testInfo.project.name}-${route === "/" ? "home" : route.slice(1).replaceAll("/", "-")}.png`,
        fullPage: false,
      });

      await writeArtifact(
        testInfo,
        `console-${route === "/" ? "home" : route.slice(1).replaceAll("/", "-")}.json`,
        consoleEntries,
      );
    });
  }
});

test.describe("breadcrumb schema hierarchy", () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalNetwork(page);
  });

  for (const route of BREADCRUMB_SCHEMA_EXPECTATIONS) {
    test(`${route.path} uses the expected breadcrumb hierarchy`, async ({
      page,
    }) => {
      await page.goto(route.path, { waitUntil: "domcontentloaded" });

      const jsonLdTexts = await page
        .locator('script[type="application/ld+json"]')
        .evaluateAll((scripts) =>
          scripts.map((script) => script.textContent ?? ""),
        );
      const trails = jsonLdTexts
        .map((text) => JSON.parse(text))
        .flatMap(collectBreadcrumbNameTrails);

      expect(
        trails.some((trail) => JSON.stringify(trail) === JSON.stringify(route.names)),
        `${route.path} breadcrumb trails: ${JSON.stringify(trails)}`,
      ).toBe(true);
    });
  }
});

test.describe("query prefill support", () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalNetwork(page);
  });

  test("translator and encoder preload text query values", async ({ page }) => {
    await page.goto("/?text=HELLO%20WORLD", { waitUntil: "domcontentloaded" });
    await expect(page.getByLabel("Input (Text)")).toHaveValue("HELLO WORLD");
    await expect(page.locator("#mw_output")).toHaveValue(/\.{4}/);

    await page.goto("/morse-code-encoder?text=CQ", {
      waitUntil: "domcontentloaded",
    });
    await expect(page.getByLabel("Input (Text)")).toHaveValue("CQ");
    await expect(page.locator("#mw_output")).toHaveValue("-.-.   --.-");

    await page.goto("/audio?text=HELLO", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("button", { name: "Text to Morse audio" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(page.getByLabel("Input (Text)")).toHaveValue("HELLO");
  });

  test("translator, decoder, and audio preload morse query values", async ({ page }) => {
    await page.goto("/?morse=....%20.%20.-..%20.-..%20---", {
      waitUntil: "domcontentloaded",
    });
    await expect(page.getByLabel("Input (Morse)")).toHaveValue(
      ".... . .-.. .-.. ---",
    );

    await page.goto("/morse-code-decoder?morse=-.-.%20--.-", {
      waitUntil: "domcontentloaded",
    });
    await expect(page.getByLabel("Input (Morse)")).toHaveValue("-.-. --.-");
    await expect(page.locator("#mw_output")).toHaveValue("CQ");

    await page.goto("/audio?morse=...%20---%20...", {
      waitUntil: "domcontentloaded",
    });
    await expect(page.getByRole("button", { name: "Morse to audio" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(page.getByLabel("Input (Morse)")).toHaveValue("... --- ...");
  });

  test("query prefill handles encoded spaces", async ({
    page,
  }) => {
    await page.goto("/?text=I%20LOVE%20YOU", { waitUntil: "domcontentloaded" });
    await expect(page.getByLabel("Input (Text)")).toHaveValue("I LOVE YOU");
  });

  test("query prefill keeps literal plus signs", async ({ page }) => {
    await page.goto("/?text=A+B", { waitUntil: "domcontentloaded" });
    await expect(page.getByLabel("Input (Text)")).toHaveValue("A+B");
    await expect(page.locator("#mw_output")).toHaveValue(".-   .-.-.   -...");

    await page.goto("/morse-code-encoder?text=A%2BB", {
      waitUntil: "domcontentloaded",
    });
    await expect(page.getByLabel("Input (Text)")).toHaveValue("A+B");
  });

  test("query prefill keeps supported punctuation edge cases", async ({
    page,
  }) => {
    const supportedCases = [
      { url: "/?text=DON%27T", value: "DON'T" },
      { url: "/?text=X-RAY", value: "X-RAY" },
      { url: "/?text=%22SOS%22", value: '"SOS"' },
      { url: "/?text=%28NOTE%29", value: "(NOTE)" },
      { url: "/?text=CALL_SIGN", value: "CALL_SIGN" },
    ];

    for (const item of supportedCases) {
      await page.goto(item.url, { waitUntil: "domcontentloaded" });
      await expect(page.getByLabel("Input (Text)")).toHaveValue(item.value);
      await expect(page.locator("#mw_output")).not.toHaveValue("");
    }
  });

  test("query prefill ignores empty values", async ({ page }) => {
    await page.goto("/?text=", { waitUntil: "domcontentloaded" });
    await expect(page.getByLabel("Input (Text)")).toHaveValue("sos help");
  });

  test("query prefill ignores unsupported text values without crashing", async ({
    page,
  }) => {
    await page.goto("/?text=HELLO%20%23", {
      waitUntil: "domcontentloaded",
    });
    await expect(page.getByLabel("Input (Text)")).toHaveValue("sos help");
    await expect(page.getByText("Unsupported:", { exact: false })).toHaveCount(0);
  });

  test("audio query prefill keeps localStorage when no query is present", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.evaluate(() => {
      window.localStorage.setItem("mw_audio_source", "text");
      window.localStorage.setItem("mw_audio_text", "STORED VALUE");
    });

    await page.goto("/audio", { waitUntil: "domcontentloaded" });
    await expect(page.getByLabel("Input (Text)")).toHaveValue("STORED VALUE");
  });

  test("audio query prefill wins over localStorage when text has a value", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.evaluate(() => {
      window.localStorage.setItem("mw_audio_source", "text");
      window.localStorage.setItem("mw_audio_text", "STORED VALUE");
    });

    await page.goto("/audio?text=QUERY%20VALUE", {
      waitUntil: "domcontentloaded",
    });
    await expect(page.getByLabel("Input (Text)")).toHaveValue("QUERY VALUE");
  });

  test("audio query prefill ignores empty values and keeps localStorage", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.evaluate(() => {
      window.localStorage.setItem("mw_audio_source", "text");
      window.localStorage.setItem("mw_audio_text", "STORED EMPTY CHECK");
    });

    await page.goto("/audio?text=", { waitUntil: "domcontentloaded" });
    await expect(page.getByLabel("Input (Text)")).toHaveValue(
      "STORED EMPTY CHECK",
    );
  });
});

test.describe("first-batch SEO metadata and schema", () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalNetwork(page);
  });

  test("new routes expose unique titles, descriptions, canonicals, H1s, and JSON-LD", async ({
    page,
  }) => {
    test.slow();
    const descriptions = new Set<string>();

    for (const route of FIRST_BATCH_ROUTE_EXPECTATIONS) {
      await page.goto(route.path, { waitUntil: "domcontentloaded" });

      await expect(page).toHaveTitle(route.title);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1")).toHaveText(route.h1);

      const canonical = `https://morsewords.com${route.path}`;
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        canonical,
      );
      await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
        "content",
        canonical,
      );

      const description = await page
        .locator('meta[name="description"]')
        .getAttribute("content");
      expect(description, `${route.path} meta description`).toBeTruthy();
      expect(description?.length, `${route.path} description length`).toBeGreaterThan(80);
      descriptions.add(description ?? "");

      const jsonLdTexts = await page
        .locator('script[type="application/ld+json"]')
        .evaluateAll((scripts) =>
          scripts.map((script) => script.textContent ?? ""),
        );
      expect(jsonLdTexts.length, `${route.path} JSON-LD script count`).toBeGreaterThan(0);

      const parsedJsonLd = jsonLdTexts.map((text) => JSON.parse(text));
      const types = parsedJsonLd.flatMap(collectJsonLdTypes);
      expect(types, `${route.path} has BreadcrumbList`).toContain("BreadcrumbList");
      expectFaqSchemaPolicy(types, route.path);
      expect(types, `${route.path} has page schema`).toContain(route.schemaType);

      const faqQuestions = await page.locator("details summary").allTextContents();
      const faqSchemaQuestions = parsedJsonLd
        .flatMap((jsonLd) => (Array.isArray(jsonLd) ? jsonLd : [jsonLd]))
        .filter((jsonLd) => jsonLd?.["@type"] === "FAQPage")
        .flatMap((jsonLd) => jsonLd.mainEntity ?? [])
        .map((item) => item.name);

      for (const question of faqSchemaQuestions) {
        expect(
          faqQuestions.some((visibleQuestion) => visibleQuestion.includes(question)),
          `${route.path} visible FAQ includes schema question: ${question}`,
        ).toBe(true);
      }
    }

    expect(descriptions.size).toBe(FIRST_BATCH_ROUTE_EXPECTATIONS.length);
  });

  test("HTML and XML sitemaps include the first-batch routes", async ({
    page,
    request,
  }) => {
    await page.goto("/sitemap", { waitUntil: "domcontentloaded" });

    for (const route of FIRST_BATCH_ROUTE_EXPECTATIONS) {
      await expect(page.locator(`a[href="${route.path}"]`).first()).toBeVisible();
    }

    const xmlResponse = await request.get("/sitemap.xml");
    expect(xmlResponse.ok()).toBe(true);
    const xml = await xmlResponse.text();

    for (const route of FIRST_BATCH_ROUTE_EXPECTATIONS) {
      expect(xml).toContain(`https://morsewords.com${route.path}`);
    }
  });
});

test.describe("letter SEO metadata and schema", () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalNetwork(page);
  });

  for (const route of LETTER_ROUTE_EXPECTATIONS) {
    test(`${route.path} exposes title, description, canonical, H1, and JSON-LD`, async ({
      page,
    }) => {
      await page.goto(route.path, { waitUntil: "domcontentloaded" });

      await expect(page).toHaveTitle(route.title);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1")).toHaveText(route.h1);

      const canonical = `https://morsewords.com${route.path}`;
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        canonical,
      );
      await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
        "content",
        canonical,
      );

      const title = await page.title();
      const description = await page
        .locator('meta[name="description"]')
        .getAttribute("content");
      expect(description, `${route.path} meta description`).toContain(route.letter);
      expect(description?.length, `${route.path} description length`).toBeGreaterThan(90);
      expect(title).toBe(route.title);

      const jsonLdTexts = await page
        .locator('script[type="application/ld+json"]')
        .evaluateAll((scripts) =>
          scripts.map((script) => script.textContent ?? ""),
        );
      expect(jsonLdTexts.length, `${route.path} JSON-LD script count`).toBeGreaterThan(0);

      const parsedJsonLd = jsonLdTexts.map((text) => JSON.parse(text));
      const types = parsedJsonLd.flatMap(collectJsonLdTypes);
      expect(types, `${route.path} has BreadcrumbList`).toContain("BreadcrumbList");
      expect(types, `${route.path} has WebPage`).toContain("WebPage");
      expectFaqSchemaPolicy(types, route.path);

      const faqQuestions = await page.locator("details summary").allTextContents();
      const faqSchemaQuestions = parsedJsonLd
        .flatMap((jsonLd) => (Array.isArray(jsonLd) ? jsonLd : [jsonLd]))
        .filter((jsonLd) => jsonLd?.["@type"] === "FAQPage")
        .flatMap((jsonLd) => jsonLd.mainEntity ?? [])
        .map((item) => item.name);

      for (const question of faqSchemaQuestions) {
        expect(
          faqQuestions.some((visibleQuestion) => visibleQuestion.includes(question)),
          `${route.path} visible FAQ includes schema question: ${question}`,
        ).toBe(true);
      }
    });

    test(`${route.path} exposes expected Morse answer and tool CTAs`, async ({
      page,
    }) => {
      await page.goto(route.path, { waitUntil: "domcontentloaded" });

      await expect(page.getByText(route.morse, { exact: true }).first()).toBeVisible();
      await expect(page.getByRole("button", { name: "Copy Morse" })).toBeVisible();
      await expect(page.getByRole("button", { name: "Play Morse" })).toBeVisible();
      await expect(
        page.locator(`a[href="/?text=${route.letter}"]`).first(),
      ).toBeVisible();
      await expect(
        page.locator(`a[href="/audio?text=${route.letter}"]`).first(),
      ).toBeVisible();
      await expect(
        page.locator(`a[href="/morse-code-encoder?text=${route.letter}"]`).first(),
      ).toBeVisible();
    });
  }

  test("letter titles and descriptions are unique", async ({ request }) => {
    const titles = new Set(LETTER_ROUTE_EXPECTATIONS.map((route) => route.title));
    const descriptions = new Set<string>();

    for (const route of LETTER_ROUTE_EXPECTATIONS) {
      const response = await request.get(route.path);
      expect(response.ok(), `${route.path} response`).toBe(true);
      const html = await response.text();
      const description = html.match(
        /<meta\s+name="description"\s+content="([^"]+)"/,
      );
      expect(description?.[1], `${route.path} meta description`).toBeTruthy();
      descriptions.add(description?.[1] ?? "");
    }

    expect(titles.size).toBe(LETTER_ROUTE_EXPECTATIONS.length);
    expect(descriptions.size).toBe(LETTER_ROUTE_EXPECTATIONS.length);
  });

  test("HTML and XML sitemaps include every launched letter route", async ({
    page,
    request,
  }) => {
    await page.goto("/sitemap", { waitUntil: "domcontentloaded" });

    for (const route of LETTER_ROUTE_EXPECTATIONS) {
      await expect(page.locator(`a[href="${route.path}"]`).first()).toBeVisible();
    }

    const htmlHrefs = await page.locator("a[href]").evaluateAll((anchors) =>
      anchors.map((anchor) => (anchor as HTMLAnchorElement).getAttribute("href") ?? ""),
    );
    const exposedDeferred = htmlHrefs.filter((href) => isDeferredLetterPath(href));
    expect(exposedDeferred, "HTML sitemap deferred letter links").toEqual([]);

    const xmlResponse = await request.get("/sitemap.xml");
    expect(xmlResponse.ok()).toBe(true);
    const xml = await xmlResponse.text();

    for (const route of LETTER_ROUTE_EXPECTATIONS) {
      expect(xml).toContain(`https://morsewords.com${route.path}`);
    }
  });

  test("alphabet links to every launched letter page", async ({ page }) => {
    await page.goto("/morse-code-alphabet", { waitUntil: "domcontentloaded" });

    for (const route of LETTER_ROUTE_EXPECTATIONS) {
      await expect(page.locator(`a[href="${route.path}"]`).first()).toBeVisible();
    }

    const hrefs = await page.locator("a[href]").evaluateAll((anchors) =>
      anchors
        .map((anchor) => (anchor as HTMLAnchorElement).href)
        .map((href) => new URL(href).pathname),
    );
    const deferredLetterLinks = hrefs.filter(isDeferredLetterPath);
    expect(deferredLetterLinks, "alphabet deferred letter links").toEqual([]);
  });

  test("letter pages do not render a duplicate Wave-only toolkit section", async ({
    page,
  }) => {
    await page.goto("/b-in-morse-code", { waitUntil: "domcontentloaded" });

    await expect(
      page.locator(".mw-wave-content-page").getByText("Explore the Morse code toolkit"),
    ).toHaveCount(0);
    await expect(page.getByText("Keep using MorseWords")).toHaveCount(0);
    await expect(page.getByText("Explore the Morse code toolkit")).toHaveCount(1);
  });
});

test.describe("number SEO metadata and schema", () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalNetwork(page);
  });

  for (const route of NUMBER_ROUTE_EXPECTATIONS) {
    test(`${route.path} exposes title, description, canonical, H1, and JSON-LD`, async ({
      page,
    }) => {
      await page.goto(route.path, { waitUntil: "domcontentloaded" });

      await expect(page).toHaveTitle(route.title);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1")).toHaveText(route.h1);

      const canonical = `https://morsewords.com${route.path}`;
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        canonical,
      );
      await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
        "content",
        canonical,
      );

      const title = await page.title();
      const description = await page
        .locator('meta[name="description"]')
        .getAttribute("content");
      expect(description, `${route.path} meta description`).toContain(route.digit);
      expect(description?.length, `${route.path} description length`).toBeGreaterThan(100);
      expect(title).toBe(route.title);

      const jsonLdTexts = await page
        .locator('script[type="application/ld+json"]')
        .evaluateAll((scripts) =>
          scripts.map((script) => script.textContent ?? ""),
        );
      expect(jsonLdTexts.length, `${route.path} JSON-LD script count`).toBeGreaterThan(0);

      const parsedJsonLd = jsonLdTexts.map((text) => JSON.parse(text));
      const types = parsedJsonLd.flatMap(collectJsonLdTypes);
      expect(types, `${route.path} has BreadcrumbList`).toContain("BreadcrumbList");
      expect(types, `${route.path} has WebPage`).toContain("WebPage");
      expectFaqSchemaPolicy(types, route.path);

      const faqQuestions = await page.locator("details summary").allTextContents();
      const faqSchemaQuestions = parsedJsonLd
        .flatMap((jsonLd) => (Array.isArray(jsonLd) ? jsonLd : [jsonLd]))
        .filter((jsonLd) => jsonLd?.["@type"] === "FAQPage")
        .flatMap((jsonLd) => jsonLd.mainEntity ?? [])
        .map((item) => item.name);

      for (const question of faqSchemaQuestions) {
        expect(
          faqQuestions.some((visibleQuestion) => visibleQuestion.includes(question)),
          `${route.path} visible FAQ includes schema question: ${question}`,
        ).toBe(true);
      }
    });

    test(`${route.path} exposes expected Morse answer and tool CTAs`, async ({
      page,
    }) => {
      await page.goto(route.path, { waitUntil: "domcontentloaded" });

      await expect(page.getByText(route.morse, { exact: true }).first()).toBeVisible();
      await expect(page.getByRole("button", { name: "Copy Morse" })).toBeVisible();
      await expect(page.getByRole("button", { name: "Play Morse" })).toBeVisible();
      await expect(
        page.locator(`a[href="/?text=${route.digit}"]`).first(),
      ).toBeVisible();
      await expect(
        page.locator(`a[href="/audio?text=${route.digit}"]`).first(),
      ).toBeVisible();
      await expect(
        page.locator(`a[href="/morse-code-encoder?text=${route.digit}"]`).first(),
      ).toBeVisible();
    });
  }

  test("number titles and descriptions are unique", async ({ request }) => {
    const titles = new Set(NUMBER_ROUTE_EXPECTATIONS.map((route) => route.title));
    const descriptions = new Set<string>();

    for (const route of NUMBER_ROUTE_EXPECTATIONS) {
      const response = await request.get(route.path);
      expect(response.ok(), `${route.path} response`).toBe(true);
      const html = await response.text();
      const description = html.match(
        /<meta\s+name="description"\s+content="([^"]+)"/,
      );
      expect(description?.[1], `${route.path} meta description`).toBeTruthy();
      descriptions.add(description?.[1] ?? "");
    }

    expect(titles.size).toBe(NUMBER_ROUTE_EXPECTATIONS.length);
    expect(descriptions.size).toBe(NUMBER_ROUTE_EXPECTATIONS.length);
  });

  test("HTML and XML sitemaps include every launched number route", async ({
    page,
    request,
  }) => {
    await page.goto("/sitemap", { waitUntil: "domcontentloaded" });

    for (const route of NUMBER_ROUTE_EXPECTATIONS) {
      await expect(page.locator(`a[href="${route.path}"]`).first()).toBeVisible();
    }

    const xmlResponse = await request.get("/sitemap.xml");
    expect(xmlResponse.ok()).toBe(true);
    const xml = await xmlResponse.text();

    for (const route of NUMBER_ROUTE_EXPECTATIONS) {
      expect(xml).toContain(`https://morsewords.com${route.path}`);
    }
  });

  test("numbers hub links to every launched number page", async ({ page }) => {
    await page.goto("/morse-code-numbers", { waitUntil: "domcontentloaded" });

    for (const route of NUMBER_ROUTE_EXPECTATIONS) {
      await expect(page.locator(`a[href="${route.path}"]`).first()).toBeVisible();
    }
  });

  test("number pages do not render a duplicate Wave-only toolkit section", async ({
    page,
  }) => {
    await page.goto("/7-in-morse-code", { waitUntil: "domcontentloaded" });

    await expect(
      page.locator(".mw-wave-content-page").getByText("Explore the Morse code toolkit"),
    ).toHaveCount(0);
    await expect(page.getByText("Keep using MorseWords")).toHaveCount(0);
    await expect(page.getByText("Explore the Morse code toolkit")).toHaveCount(1);
  });
});

test.describe("phrase SEO metadata and schema", () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalNetwork(page);
  });

  for (const route of PHRASE_ROUTE_EXPECTATIONS) {
    test(`${route.path} exposes title, description, canonical, H1, and JSON-LD`, async ({
      page,
    }) => {
      await page.goto(route.path, { waitUntil: "domcontentloaded" });

      await expect(page).toHaveTitle(route.title);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1")).toHaveText(route.h1);

      const canonical = `https://morsewords.com${route.path}`;
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        canonical,
      );
      await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
        "content",
        canonical,
      );

      const description = await page
        .locator('meta[name="description"]')
        .getAttribute("content");
      expect(description, `${route.path} meta description`).toBeTruthy();
      expect(description?.length, `${route.path} description length`).toBeGreaterThan(90);

      const jsonLdTexts = await page
        .locator('script[type="application/ld+json"]')
        .evaluateAll((scripts) =>
          scripts.map((script) => script.textContent ?? ""),
        );
      expect(jsonLdTexts.length, `${route.path} JSON-LD script count`).toBeGreaterThan(0);

      const parsedJsonLd = jsonLdTexts.map((text) => JSON.parse(text));
      const types = parsedJsonLd.flatMap(collectJsonLdTypes);
      expect(types, `${route.path} has BreadcrumbList`).toContain("BreadcrumbList");
      expect(types, `${route.path} has WebPage`).toContain("WebPage");
      expectFaqSchemaPolicy(types, route.path);

      const faqQuestions = await page.locator("details summary").allTextContents();
      const faqSchemaQuestions = parsedJsonLd
        .flatMap((jsonLd) => (Array.isArray(jsonLd) ? jsonLd : [jsonLd]))
        .filter((jsonLd) => jsonLd?.["@type"] === "FAQPage")
        .flatMap((jsonLd) => jsonLd.mainEntity ?? [])
        .map((item) => item.name);

      for (const question of faqSchemaQuestions) {
        expect(
          faqQuestions.some((visibleQuestion) => visibleQuestion.includes(question)),
          `${route.path} visible FAQ includes schema question: ${question}`,
        ).toBe(true);
      }
    });

    test(`${route.path} exposes copy, play, and open-in-tool CTAs`, async ({
      page,
    }) => {
      await page.goto(route.path, { waitUntil: "domcontentloaded" });

      await expect(page.getByRole("button", { name: "Copy text" })).toBeVisible();
      await expect(page.getByRole("button", { name: "Copy Morse" })).toBeVisible();
      await expect(page.getByRole("button", { name: "Play Morse" })).toBeVisible();
      await expect(
        page.locator(`a[href="/?text=${route.textQuery}"]`).first(),
      ).toBeVisible();
      await expect(
        page.locator(`a[href="/audio?text=${route.textQuery}"]`).first(),
      ).toBeVisible();
      await expect(
        page.locator(`a[href="/morse-code-encoder?text=${route.textQuery}"]`).first(),
      ).toBeVisible();
    });
  }

  test("phrase titles and descriptions are unique", async ({ request }) => {
    const titles = new Set(PHRASE_ROUTE_EXPECTATIONS.map((route) => route.title));
    const descriptions = new Set<string>();

    for (const route of PHRASE_ROUTE_EXPECTATIONS) {
      const response = await request.get(route.path);
      expect(response.ok(), `${route.path} response`).toBe(true);
      const html = await response.text();
      const description = html.match(
        /<meta\s+name="description"\s+content="([^"]+)"/,
      );
      expect(description?.[1], `${route.path} meta description`).toBeTruthy();
      descriptions.add(description?.[1] ?? "");
    }

    expect(titles.size).toBe(PHRASE_ROUTE_EXPECTATIONS.length);
    expect(descriptions.size).toBe(PHRASE_ROUTE_EXPECTATIONS.length);
  });

  test("HTML and XML sitemaps include every new phrase route", async ({
    page,
    request,
  }) => {
    await page.goto("/sitemap", { waitUntil: "domcontentloaded" });

    for (const route of PHRASE_ROUTE_EXPECTATIONS) {
      await expect(page.locator(`a[href="${route.path}"]`).first()).toBeVisible();
    }

    const xmlResponse = await request.get("/sitemap.xml");
    expect(xmlResponse.ok()).toBe(true);
    const xml = await xmlResponse.text();

    for (const route of PHRASE_ROUTE_EXPECTATIONS) {
      expect(xml).toContain(`https://morsewords.com${route.path}`);
    }
  });

  test("words hub links to every new phrase route", async ({ page }) => {
    await page.goto("/morse-code-words", { waitUntil: "domcontentloaded" });

    for (const route of PHRASE_ROUTE_EXPECTATIONS) {
      await expect(page.locator(`a[href="${route.path}"]`).first()).toBeVisible();
    }
  });

  test("phrase pages use shared toolkit only once", async ({ page }) => {
    await page.goto("/hello-in-morse-code", { waitUntil: "domcontentloaded" });

    await expect(
      page.locator(".mw-wave-content-page").getByText("Explore the Morse code toolkit"),
    ).toHaveCount(0);
    await expect(page.getByText("Keep using MorseWords")).toHaveCount(0);
    await expect(page.getByText("Explore the Morse code toolkit")).toHaveCount(1);
  });
});

test.describe("spacing and punctuation SEO metadata and schema", () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalNetwork(page);
  });

  for (const route of SPACING_PUNCTUATION_ROUTE_EXPECTATIONS) {
    test(`${route.path} exposes title, description, canonical, H1, and JSON-LD`, async ({
      page,
    }) => {
      await page.goto(route.path, { waitUntil: "domcontentloaded" });

      await expect(page).toHaveTitle(route.title);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1")).toHaveText(route.h1);

      const canonical = `https://morsewords.com${route.path}`;
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        canonical,
      );
      await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
        "content",
        canonical,
      );

      const description = await page
        .locator('meta[name="description"]')
        .getAttribute("content");
      expect(description, `${route.path} meta description`).toBeTruthy();
      expect(description?.length, `${route.path} description length`).toBeGreaterThan(90);

      const jsonLdTexts = await page
        .locator('script[type="application/ld+json"]')
        .evaluateAll((scripts) =>
          scripts.map((script) => script.textContent ?? ""),
        );
      expect(jsonLdTexts.length, `${route.path} JSON-LD script count`).toBeGreaterThan(0);

      const parsedJsonLd = jsonLdTexts.map((text) => JSON.parse(text));
      const types = parsedJsonLd.flatMap(collectJsonLdTypes);
      expect(types, `${route.path} has BreadcrumbList`).toContain("BreadcrumbList");
      expect(types, `${route.path} has WebPage`).toContain("WebPage");
      expectFaqSchemaPolicy(types, route.path);

      const faqQuestions = await page.locator("details summary").allTextContents();
      const faqSchemaQuestions = parsedJsonLd
        .flatMap((jsonLd) => (Array.isArray(jsonLd) ? jsonLd : [jsonLd]))
        .filter((jsonLd) => jsonLd?.["@type"] === "FAQPage")
        .flatMap((jsonLd) => jsonLd.mainEntity ?? [])
        .map((item) => item.name);

      for (const question of faqSchemaQuestions) {
        expect(
          faqQuestions.some((visibleQuestion) => visibleQuestion.includes(question)),
          `${route.path} visible FAQ includes schema question: ${question}`,
        ).toBe(true);
      }
    });

    test(`${route.path} exposes copy, play, and open-in-tool CTAs`, async ({
      page,
    }) => {
      await page.goto(route.path, { waitUntil: "domcontentloaded" });

      await expect(page.getByRole("button", { name: "Copy text" })).toBeVisible();
      await expect(page.getByRole("button", { name: "Copy Morse" })).toBeVisible();
      await expect(page.getByRole("button", { name: "Play Morse" })).toBeVisible();
      await expect(
        page.locator(`a[href="/?text=${route.textQuery}"]`).first(),
      ).toBeVisible();
      await expect(
        page.locator(`a[href="/audio?text=${route.textQuery}"]`).first(),
      ).toBeVisible();
      await expect(
        page.locator(`a[href="/morse-code-encoder?text=${route.textQuery}"]`).first(),
      ).toBeVisible();
    });
  }

  test("spacing and punctuation titles and descriptions are unique", async ({
    request,
  }) => {
    const titles = new Set(
      SPACING_PUNCTUATION_ROUTE_EXPECTATIONS.map((route) => route.title),
    );
    const descriptions = new Set<string>();

    for (const route of SPACING_PUNCTUATION_ROUTE_EXPECTATIONS) {
      const response = await request.get(route.path);
      expect(response.ok(), `${route.path} response`).toBe(true);
      const html = await response.text();
      const description = html.match(
        /<meta\s+name="description"\s+content="([^"]+)"/,
      );
      expect(description?.[1], `${route.path} meta description`).toBeTruthy();
      descriptions.add(description?.[1] ?? "");
    }

    expect(titles.size).toBe(SPACING_PUNCTUATION_ROUTE_EXPECTATIONS.length);
    expect(descriptions.size).toBe(SPACING_PUNCTUATION_ROUTE_EXPECTATIONS.length);
  });

  test("HTML and XML sitemaps include every new spacing and punctuation route", async ({
    page,
    request,
  }) => {
    await page.goto("/sitemap", { waitUntil: "domcontentloaded" });

    for (const route of SPACING_PUNCTUATION_ROUTE_EXPECTATIONS) {
      await expect(page.locator(`a[href="${route.path}"]`).first()).toBeVisible();
    }

    const xmlResponse = await request.get("/sitemap.xml");
    expect(xmlResponse.ok()).toBe(true);
    const xml = await xmlResponse.text();

    for (const route of SPACING_PUNCTUATION_ROUTE_EXPECTATIONS) {
      expect(xml).toContain(`https://morsewords.com${route.path}`);
    }
  });

  test("punctuation and word separator hubs link to the new pages", async ({
    page,
  }) => {
    await page.goto("/morse-code-punctuation", { waitUntil: "domcontentloaded" });

    for (const path of [
      "/period-in-morse-code",
      "/comma-in-morse-code",
      "/exclamation-mark-in-morse-code",
      "/apostrophe-in-morse-code",
      "/hyphen-in-morse-code",
      "/colon-in-morse-code",
      "/semicolon-in-morse-code",
      "/equals-sign-in-morse-code",
      "/plus-sign-in-morse-code",
      "/quotation-mark-in-morse-code",
      "/parentheses-in-morse-code",
      "/ampersand-in-morse-code",
      "/underscore-in-morse-code",
    ]) {
      await expect(page.locator(`a[href="${path}"]`).first()).toBeVisible();
    }

    await page.goto("/morse-code-word-separator", {
      waitUntil: "domcontentloaded",
    });

    for (const path of ["/space-in-morse-code", "/slash-in-morse-code"]) {
      await expect(page.locator(`a[href="${path}"]`).first()).toBeVisible();
    }
  });

  test("spacing and punctuation pages use shared toolkit only once", async ({
    page,
  }) => {
    await page.goto("/space-in-morse-code", { waitUntil: "domcontentloaded" });

    await expect(
      page.locator(".mw-wave-content-page").getByText("Explore the Morse code toolkit"),
    ).toHaveCount(0);
    await expect(page.getByText("Keep using MorseWords")).toHaveCount(0);
    await expect(page.getByText("Explore the Morse code toolkit")).toHaveCount(1);
  });
});

test.describe("final supporting routes and duplicate-safe handling", () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalNetwork(page);
  });

  for (const route of FINAL_ROUTE_EXPECTATIONS) {
    test(`${route.path} exposes title, description, canonical, H1, and JSON-LD`, async ({
      page,
    }) => {
      await page.goto(route.path, { waitUntil: "domcontentloaded" });

      await expect(page).toHaveTitle(route.title);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1")).toHaveText(route.h1);

      const canonical = `https://morsewords.com${route.path}`;
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        canonical,
      );
      await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
        "content",
        canonical,
      );

      const description = await page
        .locator('meta[name="description"]')
        .getAttribute("content");
      expect(description, `${route.path} meta description`).toBeTruthy();
      expect(description?.length, `${route.path} description length`).toBeGreaterThan(90);

      const jsonLdTexts = await page
        .locator('script[type="application/ld+json"]')
        .evaluateAll((scripts) =>
          scripts.map((script) => script.textContent ?? ""),
        );
      expect(jsonLdTexts.length, `${route.path} JSON-LD script count`).toBeGreaterThan(0);

      const parsedJsonLd = jsonLdTexts.map((text) => JSON.parse(text));
      const types = parsedJsonLd.flatMap(collectJsonLdTypes);
      expect(types, `${route.path} has BreadcrumbList`).toContain("BreadcrumbList");
      expect(types, `${route.path} has page schema`).toContain(route.schemaType);
      expectFaqSchemaPolicy(types, route.path);
    });
  }

  test("HTML and XML sitemaps include built final routes only", async ({
    page,
    request,
  }) => {
    await page.goto("/sitemap", { waitUntil: "domcontentloaded" });

    for (const route of FINAL_ROUTE_EXPECTATIONS) {
      await expect(page.locator(`a[href="${route.path}"]`).first()).toBeVisible();
    }

    for (const route of REDIRECT_ROUTE_EXPECTATIONS) {
      await expect(page.locator(`a[href="${route.from}"]`)).toHaveCount(0);
    }

    const xmlResponse = await request.get("/sitemap.xml");
    expect(xmlResponse.ok()).toBe(true);
    const xml = await xmlResponse.text();
    const xmlUrls = [...xml.matchAll(/<loc>[^<]+<\/loc>/g)];
    expect(xmlUrls).toHaveLength(110);

    for (const route of FINAL_ROUTE_EXPECTATIONS) {
      expect(xml).toContain(`https://morsewords.com${route.path}`);
    }
    for (const route of REDIRECT_ROUTE_EXPECTATIONS) {
      expect(xml).not.toContain(`https://morsewords.com${route.from}`);
    }
  });

  test("word spacing pages link to the instructional separation guide", async ({
    page,
  }) => {
    for (const path of [
      "/morse-code-word-separator",
      "/space-in-morse-code",
      "/slash-in-morse-code",
      "/copy-and-paste-morse-code",
      "/morse-code-without-spaces",
    ]) {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      await expect(
        page.locator('a[href="/how-to-separate-words-in-morse-code"]').first(),
        `${path} guide link`,
      ).toBeVisible();
    }
  });

  test("morse-code-letters redirects to the canonical alphabet hub", async ({
    page,
  }) => {
    await page.goto("/morse-code-letters", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/morse-code-alphabet$/);
    await expect(page.locator("h1")).toHaveText("Morse Code Alphabet");
  });

  test("redirect-only aliases point to canonical destinations", async ({
    page,
    request,
  }) => {
    for (const route of REDIRECT_ROUTE_EXPECTATIONS) {
      const response = await request.get(route.from, { maxRedirects: 0 });
      expect(response.status(), `${route.from} redirect status`).toBe(301);
      expect(response.headers().location, `${route.from} redirect location`).toBe(
        route.to,
      );
    }

    await page.goto("/text-to-morse-code", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/morse-code-encoder$/);
    await expect(page.locator("h1")).toHaveText("Morse Code Encoder");

    await page.goto("/morse-to-text", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/morse-code-decoder$/);
    await expect(page.locator("h1")).toHaveText("Morse Code Decoder");
  });

  test("final routes use the shared toolkit only once", async ({ page }) => {
    for (const path of FINAL_ROUTE_PATHS) {
      await page.goto(path, { waitUntil: "domcontentloaded" });

      await expect(
        page.locator(".mw-wave-content-page").getByText("Explore the Morse code toolkit"),
      ).toHaveCount(0);
      await expect(page.getByText("Keep using MorseWords")).toHaveCount(0);
      await expect(page.getByText("Explore the Morse code toolkit")).toHaveCount(1);
    }
  });
});

test.describe("first-batch utility interactions", () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalNetwork(page);
  });

  test("name converter updates output and exposes copy, audio, and tool CTAs", async ({
    page,
  }) => {
    await page.goto("/name-to-morse-code", { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

    const nameInput = page.locator("#mw_name_input");
    await expect(nameInput).toHaveValue("Avery");

    await nameInput.fill("Avery O'Neil");
    await expect(nameInput).toHaveValue("Avery O'Neil");
    await expect(page.getByText("AVERY O'NEIL")).toBeVisible();
    await expect(page.getByRole("button", { name: "Copy name" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Copy Morse" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Play Morse" })).toBeVisible();
    await expect(page.locator('a[href="/?text=AVERY%20O%27NEIL"]')).toBeVisible();
    await expect(
      page.locator('a[href="/audio?text=AVERY%20O%27NEIL"]'),
    ).toBeVisible();

    await page.getByRole("button", { name: /Try .Diego./ }).click();
    await expect(nameInput).toHaveValue("Diego");
    await expect(page.locator('a[href="/?text=DIEGO"]')).toBeVisible();
  });

  test("numbers and leaf pages expose copy, play, and open-in-tool CTAs", async ({
    page,
  }) => {
    await page.goto("/morse-code-numbers", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("button", { name: "Copy Morse" })).toHaveCount(10);
    await expect(page.getByRole("button", { name: /Play/ })).toHaveCount(10);
    await expect(page.locator('a[href="/?text=5"]')).toBeVisible();
    await expect(page.locator('a[href="/audio?text=5"]')).toBeVisible();

    await page.goto("/i-love-you-in-morse-code", {
      waitUntil: "domcontentloaded",
    });
    await expect(page.getByRole("button", { name: "Copy text" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Copy Morse" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Play Morse" })).toBeVisible();
    await expect(
      page.locator('a[href="/?text=I%20LOVE%20YOU"]').first(),
    ).toBeVisible();
    await expect(
      page.locator('a[href="/audio?text=I%20LOVE%20YOU"]').first(),
    ).toBeVisible();
  });
});

test.describe("first-batch link hygiene", () => {
  for (const route of FIRST_BATCH_LINK_CHECK_ROUTES) {
    test(`${route} does not link deferred, unbuilt, or redirect-only routes`, async ({
      page,
    }) => {
      await blockExternalNetwork(page);
      await page.goto(route, { waitUntil: "domcontentloaded" });
      const hrefs = await page.locator("a[href]").evaluateAll((anchors) =>
        anchors
          .map((anchor) => (anchor as HTMLAnchorElement).href)
          .map((href) => {
            try {
              return new URL(href).pathname;
            } catch {
              return "";
            }
          })
          .filter(Boolean),
      );

      const badLinks = hrefs.filter(
        (href) =>
          DEFERRED_OR_REDIRECT_ONLY_ROUTES.includes(
            href as (typeof DEFERRED_OR_REDIRECT_ONLY_ROUTES)[number],
          ) ||
          isDeferredLetterPath(href),
      );

      expect(badLinks, `${route} bad internal links`).toEqual([]);
    });
  }
});

test.describe("canonical navigation surfaces", () => {
  test("more menu links canonical tools and excludes redirect-only aliases", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await blockExternalNetwork(page);
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

    await page.getByRole("button", { name: /^More$/ }).click();
    const dialog = page.getByRole("dialog", {
      name: "More MorseWords tools",
    });
    await expect(dialog).toBeVisible();

    const hrefs = await dialog.locator("a[href]").evaluateAll((anchors) =>
      anchors.map((anchor) => (anchor as HTMLAnchorElement).getAttribute("href") ?? ""),
    );

    expect(hrefs).toEqual(
      expect.arrayContaining([
        "/morse-code-encoder",
        "/morse-code-decoder",
        "/morse-code-alphabet",
        "/morse-code-numbers",
        "/morse-code-words",
        "/morse-code-punctuation",
        "/morse-code-word-separator",
        "/name-to-morse-code",
        "/how-to-read-morse-code",
        "/copy-and-paste-morse-code",
        "/how-to-separate-words-in-morse-code",
      ]),
    );

    const redirectLinks = hrefs.filter((href) =>
      DEFERRED_OR_REDIRECT_ONLY_ROUTES.includes(
        href as (typeof DEFERRED_OR_REDIRECT_ONLY_ROUTES)[number],
      ),
    );
    expect(redirectLinks).toEqual([]);
  });
});
