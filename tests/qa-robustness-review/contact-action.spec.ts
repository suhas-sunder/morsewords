import { expect, test } from "@playwright/test";

import {
  clearContactRateLimitForTests,
  getContactRateLimitStateForTests,
  submitContactForm,
} from "../../app/server/contact.server";

const originalEnv = {
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
};

const validFields = {
  name: "Test Sender",
  email: "sender@example.com",
  category: "source",
  subject: "Source correction",
  message: "Please review the source note on this page.",
  website: "",
};

function restoreEnv() {
  if (originalEnv.RESEND_API_KEY === undefined) {
    delete process.env.RESEND_API_KEY;
  } else {
    process.env.RESEND_API_KEY = originalEnv.RESEND_API_KEY;
  }

  if (originalEnv.RESEND_FROM_EMAIL === undefined) {
    delete process.env.RESEND_FROM_EMAIL;
  } else {
    process.env.RESEND_FROM_EMAIL = originalEnv.RESEND_FROM_EMAIL;
  }
}

function setContactEnv() {
  process.env.RESEND_API_KEY = "test-resend-key";
  process.env.RESEND_FROM_EMAIL = "MorseWords <contact@morsewords.com>";
}

function contactRequest(
  fields: Record<string, string | undefined> = {},
  init: {
    origin?: string | null;
    url?: string;
    ip?: string;
    method?: string;
    contentLength?: string;
  } = {},
) {
  const body = new URLSearchParams();
  for (const [key, value] of Object.entries({ ...validFields, ...fields })) {
    if (value !== undefined) body.set(key, value);
  }
  const bodyText = body.toString();
  const headers = new Headers({
    "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
    "content-length": init.contentLength ?? String(bodyText.length),
    "x-real-ip": init.ip ?? "198.51.100.10",
  });

  if (init.origin !== null) {
    headers.set("origin", init.origin ?? "https://www.morsewords.com");
  }

  return new Request(init.url ?? "https://www.morsewords.com/contact", {
    method: init.method ?? "POST",
    headers,
    body: init.method === "GET" ? undefined : bodyText,
  });
}

function mockEmailClient(
  calls: Array<{
    from: string;
    to: string;
    replyTo: string;
    subject: string;
    text: string;
  }>,
  result: "ok" | "error" | "throw" = "ok",
) {
  return {
    createEmailClient: (apiKey: string) => {
      expect(apiKey).toBe("test-resend-key");
      return {
        emails: {
          send: async (payload: (typeof calls)[number]) => {
            calls.push(payload);
            if (result === "throw") throw new Error("provider failed");
            if (result === "error") return { error: { message: "provider failed" } };
            return {};
          },
        },
      };
    },
  };
}

test.describe("server contact action", () => {
  test.beforeEach(() => {
    clearContactRateLimitForTests();
    setContactEnv();
  });

  test.afterEach(() => {
    clearContactRateLimitForTests();
    restoreEnv();
  });

  test("accepts a valid same-origin request and sends one fixed-recipient email", async () => {
    const calls: Array<{
      from: string;
      to: string;
      replyTo: string;
      subject: string;
      text: string;
    }> = [];

    const result = await submitContactForm(
      contactRequest(),
      mockEmailClient(calls),
    );

    expect(result).toEqual({ ok: true });
    expect(calls).toHaveLength(1);
    expect(calls[0].to).toBe("support@morsewords.com");
    expect(calls[0].from).toBe("MorseWords <contact@morsewords.com>");
    expect(calls[0].replyTo).toBe("sender@example.com");
    expect(calls[0].subject).toBe("[MorseWords source] Source correction");
    expect(calls[0].text).toContain("Category: source");
    expect(calls[0].text).toContain("Name: Test Sender");
  });

  test("rejects invalid fields before email delivery", async () => {
    const invalidCases = [
      [{ name: "" }, "name", "Enter a name between 2 and 100 characters."],
      [{ email: "not-an-email" }, "email", "Enter a valid email address."],
      [{ category: "billing" }, "category", "Choose one of the listed contact categories."],
      [{ subject: "x" }, "subject", "Enter a subject between 3 and 160 characters."],
      [{ message: "short" }, "message", "Enter a message between 10 and 4,000 characters."],
      [{ message: "x".repeat(4_001) }, "message", "Enter a message between 10 and 4,000 characters."],
    ] as const;

    for (const [fields, field, message] of invalidCases) {
      clearContactRateLimitForTests();
      const calls: unknown[] = [];
      const result = await submitContactForm(
        contactRequest(fields, { ip: `198.51.100.${calls.length + 20}` }),
        mockEmailClient(calls as never[]),
      );

      expect(result).toMatchObject({ ok: false, status: 400, field, message });
      expect(calls).toHaveLength(0);
    }
  });

  test("rejects honeypot, oversized, and cross-origin submissions safely", async () => {
    const cases = [
      [
        contactRequest({ website: "https://spam.example" }),
        { ok: false, status: 400, message: "This submission could not be accepted." },
      ],
      [
        contactRequest({}, { contentLength: "16001" }),
        { ok: false, status: 413, message: "Your message is too large. Please keep it under 4,000 characters." },
      ],
      [
        contactRequest({}, { origin: "https://attacker.example" }),
        { ok: false, status: 403, message: "This submission could not be verified." },
      ],
      [
        contactRequest({}, { origin: "not a url" }),
        { ok: false, status: 403, message: "This submission could not be verified." },
      ],
      [
        contactRequest({}, { origin: null }),
        { ok: true },
      ],
      [
        contactRequest({}, { origin: "http://127.0.0.1:3101", url: "http://127.0.0.1:3101/contact" }),
        { ok: true },
      ],
    ] as const;

    for (const [request, expected] of cases) {
      clearContactRateLimitForTests();
      const calls: Array<{
        from: string;
        to: string;
        replyTo: string;
        subject: string;
        text: string;
      }> = [];
      const result = await submitContactForm(request, mockEmailClient(calls));

      expect(result).toMatchObject(expected);
      expect(calls).toHaveLength(expected.ok ? 1 : 0);
    }
  });

  test("keeps rate-limit state content-free, bounded, and process-local", async () => {
    const calls: Array<{
      from: string;
      to: string;
      replyTo: string;
      subject: string;
      text: string;
    }> = [];
    const options = { ...mockEmailClient(calls), now: () => 1_000 };

    for (let index = 0; index < 4; index += 1) {
      await expect(
        submitContactForm(contactRequest({}, { ip: "198.51.100.40" }), options),
      ).resolves.toEqual({ ok: true });
    }

    await expect(
      submitContactForm(contactRequest({}, { ip: "198.51.100.40" }), options),
    ).resolves.toMatchObject({ ok: false, status: 429 });

    const limitedState = getContactRateLimitStateForTests();
    expect(limitedState.entries[0].key).toBe("198.51.100.40");
    expect(JSON.stringify(limitedState)).not.toContain(validFields.message);

    for (let index = 0; index < 505; index += 1) {
      await submitContactForm(
        contactRequest({ name: "" }, { ip: `203.0.113.${index}` }),
        { ...mockEmailClient([]), now: () => 2_000 },
      );
    }
    expect(getContactRateLimitStateForTests().keyCount).toBeLessThanOrEqual(500);

    await submitContactForm(
      contactRequest({}, { ip: "198.51.100.40" }),
      { ...mockEmailClient([]), now: () => 16 * 60 * 1_000 },
    );
    expect(getContactRateLimitStateForTests().entries).not.toContainEqual(
      expect.objectContaining({ key: "198.51.100.40", count: 4 }),
    );
  });

  test("fails safely when configuration or provider delivery is unavailable", async () => {
    delete process.env.RESEND_API_KEY;
    const missingKey = await submitContactForm(contactRequest(), mockEmailClient([]));
    expect(missingKey).toMatchObject({ ok: false, status: 503 });
    expect(JSON.stringify(missingKey)).not.toContain("RESEND_API_KEY");

    setContactEnv();
    delete process.env.RESEND_FROM_EMAIL;
    const missingSender = await submitContactForm(contactRequest(), mockEmailClient([]));
    expect(missingSender).toMatchObject({ ok: false, status: 503 });
    expect(JSON.stringify(missingSender)).not.toContain("RESEND_FROM_EMAIL");

    setContactEnv();
    const calls: Array<{
      from: string;
      to: string;
      replyTo: string;
      subject: string;
      text: string;
    }> = [];
    const providerError = await submitContactForm(
      contactRequest(),
      mockEmailClient(calls, "error"),
    );
    expect(providerError).toMatchObject({ ok: false, status: 502 });
    expect(JSON.stringify(providerError)).not.toContain("provider failed");

    clearContactRateLimitForTests();
    const providerThrow = await submitContactForm(
      contactRequest(),
      mockEmailClient([], "throw"),
    );
    expect(providerThrow).toMatchObject({ ok: false, status: 502 });
    expect(JSON.stringify(providerThrow)).not.toContain("provider failed");
  });

  test("neutralizes header injection and does not allow client-controlled routing", async () => {
    const calls: Array<{
      from: string;
      to: string;
      replyTo: string;
      subject: string;
      text: string;
    }> = [];
    const result = await submitContactForm(
      contactRequest({
        email: "sender@example.com",
        subject: "Hi\r\nBcc: attacker@example.com",
        message: "<script>alert('x')</script> Please review this visible text.",
      }),
      mockEmailClient(calls),
    );

    expect(result).toEqual({ ok: true });
    expect(calls).toHaveLength(1);
    expect(calls[0].to).toBe("support@morsewords.com");
    expect(calls[0].from).toBe("MorseWords <contact@morsewords.com>");
    expect(calls[0].subject).toBe("[MorseWords source] Hi Bcc: attacker@example.com");
    expect(calls[0].subject).not.toContain("\r");
    expect(calls[0].subject).not.toContain("\n");
    expect(calls[0]).not.toHaveProperty("html");

    clearContactRateLimitForTests();
    const injectedEmail = await submitContactForm(
      contactRequest({ email: "sender@example.com\r\nBcc: attacker@example.com" }),
      mockEmailClient([]),
    );
    expect(injectedEmail).toMatchObject({ ok: false, field: "email" });
  });
});
