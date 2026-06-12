import { buildMorseVideoPreview } from "~/client/components/shared/video/morseVideoPreview";
import type {
  MorseVideoAudioSettings,
} from "~/client/components/shared/video/morseVideoRenderer";
import type { MorseVideoSettings } from "~/client/components/shared/video/morseVideoTypes";

import type { BookSourceSection } from "./bookSourceTypes";
import { sanitizeBookExportSettings } from "./bookExportPresets";
import type { BookExportPart, BookExportSettings } from "./bookExportTypes";
import { BOOK_DIRECT_FILE_RUNTIME_LIMIT_MS } from "./bookExportSafety";
import { segmentBookText } from "./bookSegmentation";

export const LIVE_PREVIEW_TARGET_PART_MINUTES = 60;
export const LIVE_PREVIEW_MAX_SEGMENT_CHARS = 240_000;
export const LIVE_PREVIEW_MAX_SEGMENT_WORDS = 48_000;

export function buildLivePreviewSegments({
  cleanedText,
  settings,
  sourceSections = [],
  sourceTitle,
}: {
  cleanedText: string;
  settings: BookExportSettings;
  sourceSections?: BookSourceSection[];
  sourceTitle?: string;
}): BookExportPart[] {
  const liveSettings = sanitizeBookExportSettings({
    ...settings,
    outputFormat: "mp3",
    splitMode: "duration",
    splitAudio: true,
    targetPartMinutes: LIVE_PREVIEW_TARGET_PART_MINUTES,
    preferSourceSections: sourceSections.length > 1,
    includeCleanedText: false,
    includeMorseTranscript: false,
    includeManifest: false,
    includeSettings: false,
    includeReadme: false,
  });

  return segmentBookText({
    cleanedText,
    maxPartMs: BOOK_DIRECT_FILE_RUNTIME_LIMIT_MS,
    settings: liveSettings,
    sourceSections,
    sourceTitle,
  });
}

export function buildLiveMorseVideoPreview({
  audioSettings,
  fallbackText,
  segment,
  settings,
}: {
  audioSettings: Pick<MorseVideoAudioSettings, "charWpm" | "farnsworthWpm">;
  fallbackText?: string;
  segment: BookExportPart | null;
  settings: MorseVideoSettings;
}) {
  const text = segment?.cleanedText || fallbackText || "";
  return buildMorseVideoPreview(settings, text, audioSettings, {
    maxCharacters: LIVE_PREVIEW_MAX_SEGMENT_CHARS,
    maxDurationMs: Math.max(
      1_200,
      (segment?.morseDurationMs ?? BOOK_DIRECT_FILE_RUNTIME_LIMIT_MS) + 2_000,
    ),
    maxWords: LIVE_PREVIEW_MAX_SEGMENT_WORDS,
  });
}
