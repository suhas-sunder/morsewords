import { expect, test, type Page } from "@playwright/test";
import { blockExternalNetwork } from "./helpers";

type JsonLdRecord = Record<string, unknown>;

const SITE_URL = "https://morsewords.com";

const REDIRECT_ROUTES = [
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
  { from: "/morse-code-practice-test", to: "/morse-code-test" },
  { from: "/morse-code-listening-test", to: "/morse-code-test" },
  { from: "/morse-code-typing-test", to: "/morse-code-test" },
  { from: "/morse-code-speed-test", to: "/morse-code-test" },
  { from: "/morse-type-test", to: "/morse-code-test" },
  { from: "/morse-code-tests", to: "/morse-code-test" },
  { from: "/morse-code-test-online", to: "/morse-code-test" },
  { from: "/morse-reader", to: "/morse-code-reader" },
  { from: "/read-morse-code", to: "/morse-code-reader" },
  { from: "/morse-to-english", to: "/morse-code-reader" },
  { from: "/morse-code-to-english", to: "/morse-code-reader" },
  { from: "/text-to-morse-code-mp3", to: "/morse-code-mp3-generator" },
  { from: "/morse-to-mp3", to: "/morse-code-mp3-generator" },
  { from: "/morse-code-to-mp3", to: "/morse-code-mp3-generator" },
  { from: "/text-to-morse-mp3", to: "/morse-code-mp3-generator" },
  {
    from: "/morse-code-translator-audio-mp3",
    to: "/morse-code-mp3-generator",
  },
] as const;

const REDIRECT_PATHS = REDIRECT_ROUTES.map((route) => route.from);

const REPRESENTATIVE_ROUTES = [
  "/",
  "/morse-code-audio-decoder",
  "/morse-code-test",
  "/morse-code-reader",
  "/morse-code-mp3-generator",
  "/morse-code-chart",
  "/morse-code-alphabet",
  "/a-in-morse-code",
  "/n-in-morse-code",
  "/z-in-morse-code",
  "/morse-code-numbers",
  "/0-in-morse-code",
  "/5-in-morse-code",
  "/9-in-morse-code",
  "/morse-code-words",
  "/hello-in-morse-code",
  "/help-me-in-morse-code",
  "/hello-world-in-morse-code",
  "/morse-code-punctuation",
  "/question-mark-in-morse-code",
  "/colon-in-morse-code",
  "/underscore-in-morse-code",
  "/space-in-morse-code",
  "/slash-in-morse-code",
  "/how-to-separate-words-in-morse-code",
  "/name-to-morse-code",
  "/contact",
] as const;

const GENERATED_LEAF_SAMPLE_ROUTES = new Set<string>([
  "/a-in-morse-code",
  "/n-in-morse-code",
  "/z-in-morse-code",
  "/0-in-morse-code",
  "/5-in-morse-code",
  "/9-in-morse-code",
  "/hello-in-morse-code",
  "/help-me-in-morse-code",
  "/hello-world-in-morse-code",
  "/question-mark-in-morse-code",
  "/colon-in-morse-code",
  "/underscore-in-morse-code",
  "/space-in-morse-code",
  "/slash-in-morse-code",
]);

function parseJsonLdFromHtml(html: string, routePath: string) {
  return [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .map((match, index) => {
      const scriptText = match[1]?.trim() ?? "";
      expect(scriptText, `${routePath} JSON-LD script ${index + 1}`).toBeTruthy();
      return JSON.parse(scriptText) as unknown;
    });
}

function flattenJsonLd(value: unknown): JsonLdRecord[] {
  if (Array.isArray(value)) return value.flatMap(flattenJsonLd);
  if (!value || typeof value !== "object") return [];

  const record = value as JsonLdRecord;
  return [
    record,
    ...flattenJsonLd(record["@graph"]),
    ...flattenJsonLd(record.mainEntity),
    ...flattenJsonLd(record.itemListElement),
    ...flattenJsonLd(record.breadcrumb),
  ];
}

function schemaTypes(record: JsonLdRecord) {
  const type = record["@type"];
  if (Array.isArray(type)) {
    return type.filter((item): item is string => typeof item === "string");
  }

  return typeof type === "string" ? [type] : [];
}

function hasSchemaType(record: JsonLdRecord, type: string) {
  return schemaTypes(record).includes(type);
}

function itemName(value: unknown) {
  if (!value || typeof value !== "object") return "";
  const record = value as JsonLdRecord;
  return typeof record.name === "string" ? record.name : "";
}

function schemaId(value: JsonLdRecord) {
  return typeof value["@id"] === "string" ? value["@id"] : "";
}

function collectReferenceIds(value: unknown): string[] {
  if (Array.isArray(value)) return value.flatMap(collectReferenceIds);
  if (!value || typeof value !== "object") return [];

  const record = value as JsonLdRecord;
  return schemaId(record) ? [schemaId(record)] : [];
}

function collectBreadcrumbReferenceIds(value: unknown): string[] {
  if (Array.isArray(value)) return value.flatMap(collectBreadcrumbReferenceIds);
  if (!value || typeof value !== "object") return [];

  const record = value as JsonLdRecord;
  return [
    ...collectReferenceIds(record.breadcrumb),
    ...collectBreadcrumbReferenceIds(record["@graph"]),
    ...collectBreadcrumbReferenceIds(record.mainEntity),
    ...collectBreadcrumbReferenceIds(record.itemListElement),
  ];
}

async function visibleFaqQuestions(page: Page) {
  return page.locator("section").evaluateAll((sections) =>
    sections.flatMap((section) => {
      const eyebrow = section.querySelector(".mw-eyebrow-text");
      if (eyebrow?.textContent?.trim() !== "FAQ") return [];

      return [...section.querySelectorAll("details summary")]
        .map((summary) => summary.textContent?.trim() ?? "")
        .filter(Boolean);
    }),
  );
}

function assertSchemaDoesNotReferenceRedirects(records: JsonLdRecord[], routePath: string) {
  const schemaText = JSON.stringify(records);

  for (const aliasPath of REDIRECT_PATHS) {
    expect(
      schemaText,
      `${routePath} schema should not reference redirect alias ${aliasPath}`,
    ).not.toContain(`${SITE_URL}${aliasPath}`);
  }
}

function assertBreadcrumbList(record: JsonLdRecord, routePath: string) {
  const itemListElement = record.itemListElement;
  expect(
    Array.isArray(itemListElement),
    `${routePath} BreadcrumbList has itemListElement`,
  ).toBe(true);
  expect(
    itemListElement,
    `${routePath} BreadcrumbList itemListElement is non-empty`,
  ).not.toHaveLength(0);

  (itemListElement as unknown[]).forEach((item, index) => {
    expect(item, `${routePath} breadcrumb item ${index + 1}`).toEqual(
      expect.objectContaining({ "@type": "ListItem" }),
    );

    const listItem = item as JsonLdRecord;
    expect(listItem.position, `${routePath} breadcrumb position`).toBe(index + 1);
    expect(itemName(listItem), `${routePath} breadcrumb name`).toBeTruthy();

    if (typeof listItem.item === "string") {
      expect(
        listItem.item.startsWith(SITE_URL),
        `${routePath} breadcrumb item uses canonical host`,
      ).toBe(true);
      for (const aliasPath of REDIRECT_PATHS) {
        expect(
          listItem.item,
          `${routePath} breadcrumb item avoids redirect alias ${aliasPath}`,
        ).not.toContain(aliasPath);
      }
    } else {
      expect(index, `${routePath} only final breadcrumb may omit item`).toBe(
        itemListElement.length - 1,
      );
    }
  });
}

function assertBreadcrumbReferencesResolve(
  parsedJsonLd: unknown[],
  records: JsonLdRecord[],
  routePath: string,
) {
  const breadcrumbById = new Map(
    records
      .filter((record) => hasSchemaType(record, "BreadcrumbList") && schemaId(record))
      .map((record) => [schemaId(record), record]),
  );
  const referencedIds = [...new Set(parsedJsonLd.flatMap(collectBreadcrumbReferenceIds))];

  for (const referencedId of referencedIds) {
    const breadcrumb = breadcrumbById.get(referencedId);
    expect(
      breadcrumb,
      `${routePath} breadcrumb reference ${referencedId} resolves to BreadcrumbList`,
    ).toBeTruthy();
    assertBreadcrumbList(breadcrumb as JsonLdRecord, routePath);
  }
}

function assertFaqPage(record: JsonLdRecord, routePath: string) {
  expect(Array.isArray(record.mainEntity), `${routePath} FAQPage mainEntity`).toBe(
    true,
  );
  expect(record.mainEntity, `${routePath} FAQPage mainEntity is non-empty`).not.toHaveLength(
    0,
  );

  (record.mainEntity as unknown[]).forEach((entry, index) => {
    expect(entry, `${routePath} FAQ question ${index + 1}`).toEqual(
      expect.objectContaining({ "@type": "Question" }),
    );

    const question = entry as JsonLdRecord;
    expect(typeof question.name, `${routePath} FAQ question name`).toBe("string");
    expect(question.name, `${routePath} FAQ question name`).toBeTruthy();

    const answer = question.acceptedAnswer as JsonLdRecord | undefined;
    expect(answer, `${routePath} acceptedAnswer`).toEqual(
      expect.objectContaining({ "@type": "Answer" }),
    );
    expect(typeof answer?.text, `${routePath} FAQ answer text`).toBe("string");
    expect(answer?.text, `${routePath} FAQ answer text`).toBeTruthy();
    expect(answer?.text, `${routePath} FAQ answer text is plain`).not.toMatch(
      /<script|<details|<summary|<[^>]+>/i,
    );
  });
}

test.describe("structured data output", () => {
  test("sitemap pages render valid BreadcrumbList and conservative FAQPage JSON-LD", async ({
    request,
  }) => {
    test.slow();

    const sitemapResponse = await request.get("/sitemap.xml");
    expect(sitemapResponse.ok()).toBe(true);
    const sitemapXml = await sitemapResponse.text();
    const sitemapPaths = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)]
      .map((match) => new URL(match[1]).pathname)
      .filter((pathname) => pathname !== "/sitemap.xml");

    expect(sitemapPaths.length, "sitemap URL count").toBeGreaterThan(0);

    for (const aliasPath of REDIRECT_PATHS) {
      expect(sitemapXml, `sitemap excludes redirect alias ${aliasPath}`).not.toContain(
        `${SITE_URL}${aliasPath}`,
      );
    }

    for (const routePath of sitemapPaths) {
      const response = await request.get(routePath);
      expect(response.ok(), `${routePath} response`).toBe(true);

      const parsedJsonLd = parseJsonLdFromHtml(await response.text(), routePath);
      const records = parsedJsonLd.flatMap(flattenJsonLd);
      const types = records.flatMap(schemaTypes);
      const breadcrumbs = records.filter((record) =>
        hasSchemaType(record, "BreadcrumbList"),
      );
      const faqPages = records.filter((record) => hasSchemaType(record, "FAQPage"));

      expect(
        breadcrumbs.length,
        `${routePath} should not render duplicate BreadcrumbList schema`,
      ).toBeLessThanOrEqual(1);
      expect(
        faqPages.length,
        `${routePath} should not render duplicate FAQPage schema`,
      ).toBeLessThanOrEqual(1);
      assertSchemaDoesNotReferenceRedirects(records, routePath);

      for (const breadcrumb of breadcrumbs) {
        assertBreadcrumbList(breadcrumb, routePath);
      }
      assertBreadcrumbReferencesResolve(parsedJsonLd, records, routePath);

      for (const faqPage of faqPages) {
        assertFaqPage(faqPage, routePath);
      }

      if (GENERATED_LEAF_SAMPLE_ROUTES.has(routePath)) {
        expect(types, `${routePath} generated leaf omits FAQPage`).not.toContain(
          "FAQPage",
        );
      }
    }
  });

  test("representative pages keep FAQPage schema aligned with visible FAQs", async ({
    page,
  }) => {
    await blockExternalNetwork(page);

    for (const routePath of REPRESENTATIVE_ROUTES) {
      await page.goto(routePath, { waitUntil: "domcontentloaded" });
      const parsedJsonLd = await page
        .locator('script[type="application/ld+json"]')
        .evaluateAll((scripts) =>
          scripts.map((script) => JSON.parse(script.textContent ?? "null")),
        );
      const records = parsedJsonLd.flatMap(flattenJsonLd);
      const types = records.flatMap(schemaTypes);
      const faqPages = records.filter((record) => hasSchemaType(record, "FAQPage"));
      const visibleQuestions = await visibleFaqQuestions(page);

      expect(
        faqPages.length,
        `${routePath} should not render duplicate FAQPage schema`,
      ).toBeLessThanOrEqual(1);

      if (GENERATED_LEAF_SAMPLE_ROUTES.has(routePath)) {
        expect(types, `${routePath} generated leaf omits FAQPage`).not.toContain(
          "FAQPage",
        );
        await expect(page.locator("details summary").first()).toBeVisible();
        continue;
      }

      for (const faqPage of faqPages) {
        const questions = (faqPage.mainEntity as JsonLdRecord[]).map((entry) =>
          itemName(entry),
        );

        for (const question of questions) {
          expect(
            visibleQuestions.some((visibleQuestion) =>
              visibleQuestion.includes(question),
            ),
            `${routePath} visible FAQ includes schema question: ${question}`,
          ).toBe(true);
        }
      }
    }
  });

  test("redirect aliases do not emit standalone JSON-LD and stay out of sitemap", async ({
    request,
  }) => {
    const sitemapResponse = await request.get("/sitemap.xml");
    expect(sitemapResponse.ok()).toBe(true);
    const sitemapXml = await sitemapResponse.text();

    for (const route of REDIRECT_ROUTES) {
      const response = await request.get(route.from, { maxRedirects: 0 });
      expect(
        [301, 302, 307, 308],
        `${route.from} redirect status`,
      ).toContain(response.status());
      const locationHeader = response.headers().location ?? "";
      const locationPath = locationHeader.startsWith("http")
        ? new URL(locationHeader).pathname
        : locationHeader;
      expect(locationPath, `${route.from} redirect target`).toBe(route.to);
      expect(await response.text(), `${route.from} has no JSON-LD script`).not.toContain(
        "application/ld+json",
      );
      expect(sitemapXml, `sitemap excludes ${route.from}`).not.toContain(
        `${SITE_URL}${route.from}`,
      );
    }
  });
});
