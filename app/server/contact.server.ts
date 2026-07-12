import { Resend } from "resend";
import { CONTACT_CATEGORIES, type ContactCategory } from "~/contact.shared";

export { CONTACT_CATEGORIES };

type ContactField = "name" | "email" | "category" | "subject" | "message";

export type ContactResult =
  | { ok: true }
  | { ok: false; status: number; message: string; field?: ContactField };

type ContactEmailClient = {
  emails: {
    send: (payload: {
      from: string;
      to: string;
      replyTo: string;
      subject: string;
      text: string;
    }) => Promise<{ error?: unknown }>;
  };
};

type ContactSubmitOptions = {
  createEmailClient?: (apiKey: string) => ContactEmailClient;
  now?: () => number;
};

const MAX_BODY_BYTES = 16_000;
const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 4;
const MAX_RATE_LIMIT_KEYS = 500;
const rateLimit = new Map<string, number[]>();

function formString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function safeHeader(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function clientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

function cleanupRateLimit(now: number) {
  for (const [key, times] of rateLimit) {
    const active = times.filter((time) => now - time < WINDOW_MS);
    if (active.length > 0) {
      rateLimit.set(key, active);
    } else {
      rateLimit.delete(key);
    }
  }

  while (rateLimit.size > MAX_RATE_LIMIT_KEYS) {
    const oldestKey = rateLimit.keys().next().value;
    if (oldestKey === undefined) break;
    rateLimit.delete(oldestKey);
  }
}

function enforceRateLimitKeyCap() {
  while (rateLimit.size > MAX_RATE_LIMIT_KEYS) {
    const oldestKey = rateLimit.keys().next().value;
    if (oldestKey === undefined) break;
    rateLimit.delete(oldestKey);
  }
}

function rateLimited(key: string, now = Date.now()) {
  cleanupRateLimit(now);
  const active = (rateLimit.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  if (active.length >= MAX_REQUESTS_PER_WINDOW) {
    rateLimit.set(key, active);
    return true;
  }
  active.push(now);
  rateLimit.set(key, active);
  enforceRateLimitKeyCap();
  return false;
}

function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

export function clearContactRateLimitForTests() {
  rateLimit.clear();
}

export function getContactRateLimitStateForTests() {
  return {
    keyCount: rateLimit.size,
    entries: [...rateLimit].map(([key, times]) => ({ key, count: times.length })),
  };
}

export async function submitContactForm(
  request: Request,
  options: ContactSubmitOptions = {},
): Promise<ContactResult> {
  if (request.method !== "POST") {
    return { ok: false, status: 405, message: "This form only accepts submissions." };
  }

  const contentLength = Number(request.headers.get("content-length") || "0");
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return { ok: false, status: 413, message: "Your message is too large. Please keep it under 4,000 characters." };
  }

  if (!isSameOrigin(request)) {
    return { ok: false, status: 403, message: "This submission could not be verified." };
  }

  if (rateLimited(clientKey(request), options.now?.())) {
    return { ok: false, status: 429, message: "Please wait before sending another message." };
  }

  const form = await request.formData();
  if (formString(form.get("website"))) {
    return { ok: false, status: 400, message: "This submission could not be accepted." };
  }

  const name = formString(form.get("name"));
  const email = formString(form.get("email")).toLowerCase();
  const subject = safeHeader(formString(form.get("subject")));
  const message = formString(form.get("message"));
  const category = formString(form.get("category"));

  if (name.length < 2 || name.length > 100) {
    return { ok: false, status: 400, field: "name", message: "Enter a name between 2 and 100 characters." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return { ok: false, status: 400, field: "email", message: "Enter a valid email address." };
  }
  if (subject.length < 3 || subject.length > 160) {
    return { ok: false, status: 400, field: "subject", message: "Enter a subject between 3 and 160 characters." };
  }
  if (message.length < 10 || message.length > 4_000) {
    return { ok: false, status: 400, field: "message", message: "Enter a message between 10 and 4,000 characters." };
  }
  if (!CONTACT_CATEGORIES.includes(category as ContactCategory)) {
    return { ok: false, status: 400, field: "category", message: "Choose one of the listed contact categories." };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) {
    return { ok: false, status: 503, message: "Contact delivery is temporarily unavailable. Please try again later." };
  }

  try {
    const resend = options.createEmailClient?.(apiKey) ?? new Resend(apiKey);
    const result = await resend.emails.send({
      from,
      to: "support@morsewords.com",
      replyTo: email,
      subject: `[MorseWords ${category}] ${subject}`,
      text: `Category: ${category}\nName: ${name}\nEmail: ${email}\n\n${message}`,
    });
    if (result.error) {
      return { ok: false, status: 502, message: "We could not send your message. Please try again later." };
    }
  } catch {
    return { ok: false, status: 502, message: "We could not send your message. Please try again later." };
  }

  return { ok: true };
}
