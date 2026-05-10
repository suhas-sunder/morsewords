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

const FIRST_BATCH_LINK_CHECK_ROUTES = [
  "/",
  "/audio",
  "/morse-code-encoder",
  "/morse-code-decoder",
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

const DEFERRED_OR_REDIRECT_ONLY_ROUTES = [
  "/morse-code-letters",
  "/text-to-morse-code",
  "/morse-to-text",
  "/morse-code-translator",
  "/morse-code-audio-generator",
  "/morse-code-wav-generator",
  "/morse-code-mp3-generator",
  "/hello-in-morse-code",
  "/hi-in-morse-code",
  "/help-in-morse-code",
  "/help-me-in-morse-code",
  "/love-in-morse-code",
  "/yes-in-morse-code",
  "/no-in-morse-code",
  "/ok-in-morse-code",
  "/sorry-in-morse-code",
  "/hello-world-in-morse-code",
  "/test-in-morse-code",
  "/space-in-morse-code",
  "/slash-in-morse-code",
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
  "/contact",
] as const;

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
      expect(types, `${route.path} has FAQPage`).toContain("FAQPage");
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
      expect(types, `${route.path} has FAQPage`).toContain("FAQPage");

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
          isDeferredLetterPath(href) ||
          /^\/[0-9]-in-morse-code$/.test(href),
      );

      expect(badLinks, `${route} bad internal links`).toEqual([]);
    });
  }
});
