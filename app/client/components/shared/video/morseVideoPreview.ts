import { textToMorse } from "~/client/components/shared/morseUtils";

import type { MorseVideoSettings } from "./morseVideoTypes";

export type MorseVideoPreview = {
  sampleText: string;
  sampleMorse: string;
  brandLabel: string;
};

export function buildMorseVideoPreview(
  settings: MorseVideoSettings,
  text: string,
): MorseVideoPreview {
  const sampleText = buildPreviewSampleText(text);
  const morse = textToMorse(sampleText, {
    unsupportedText: "omit",
    wordSeparator: "spaces",
  });
  const sampleMorse =
    typeof morse === "string" && morse.trim()
      ? morse
      : textToMorse("SOS HELP", { wordSeparator: "spaces" });

  return {
    sampleText,
    sampleMorse,
    brandLabel: settings.showBranding ? "www.morsewords.com" : "",
  };
}

function buildPreviewSampleText(text: string) {
  const normalized = text.trim().replace(/\s+/g, " ");
  if (!normalized) return "SOS HELP";
  const sample = normalized.split(" ").slice(0, 4).join(" ");
  return sample.length > 34 ? `${sample.slice(0, 31).trimEnd()}...` : sample;
}
