import { textToMorse } from "~/client/components/shared/morseUtils";

import type { BookVideoSettings } from "./bookVideoTypes";

export type BookVideoPreview = {
  sampleText: string;
  sampleMorse: string;
  brandLabel: string;
};

export function buildBookVideoPreview(
  settings: BookVideoSettings,
  cleanedText: string,
): BookVideoPreview {
  const sampleText = buildPreviewSampleText(cleanedText);
  const morse = textToMorse(sampleText, {
    unsupportedText: "omit",
    wordSeparator: "spaces",
  });
  const sampleMorse = typeof morse === "string" && morse.trim()
    ? morse
    : textToMorse("SOS HELP", { wordSeparator: "spaces" });

  return {
    sampleText,
    sampleMorse,
    brandLabel: settings.showBranding ? "www.morsewords.com" : "",
  };
}

function buildPreviewSampleText(cleanedText: string) {
  const normalized = cleanedText.trim().replace(/\s+/g, " ");
  if (!normalized) return "SOS HELP";
  const sample = normalized.split(" ").slice(0, 4).join(" ");
  return sample.length > 34 ? `${sample.slice(0, 31).trimEnd()}...` : sample;
}
