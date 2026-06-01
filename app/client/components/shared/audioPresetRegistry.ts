import type {
  AudioPresetAvailabilityFlag,
  AudioPresetCategory,
  AudioTonePresetDefinition,
  AudioTonePresetId,
  CreativeAudioTonePresetId,
  StandardAudioTonePresetId,
  TranslatorAudioPresetId,
} from "~/client/components/shared/audioSettingsTypes";

export type {
  AudioPresetAvailabilityFlag,
  AudioPresetCategory,
  AudioTonePresetDefinition,
  AudioTonePresetId,
  CreativeAudioTonePresetId,
  StandardAudioTonePresetId,
  TranslatorAudioPresetId,
} from "~/client/components/shared/audioSettingsTypes";

export const STANDARD_AUDIO_TONE_PRESETS = [
  "cw_radio",
  "sine",
  "square",
  "triangle",
  "sawtooth",
  "sounder",
] as const satisfies readonly StandardAudioTonePresetId[];

export const CREATIVE_AUDIO_TONE_PRESETS = [
  "soft_bell",
  "warm_tone",
  "low_beacon",
  "submarine_ping",
  "digital_blip",
  "soft_click",
  "bird_chirp",
] as const satisfies readonly CreativeAudioTonePresetId[];

export const AUDIO_TONE_PRESETS = [
  ...STANDARD_AUDIO_TONE_PRESETS,
  ...CREATIVE_AUDIO_TONE_PRESETS,
] as const satisfies readonly AudioTonePresetId[];

export const TRANSLATOR_AUDIO_PRESET_IDS = [
  "cw_radio",
  "smooth_sine",
  "bright_square",
  "telegraph_sounder",
] as const satisfies readonly TranslatorAudioPresetId[];

const ALL_ROUTE_AVAILABILITY: Record<AudioPresetAvailabilityFlag, boolean> = {
  translator: true,
  audio: true,
  soundGenerator: true,
  mp3Generator: true,
  bookExport: true,
  livePlayback: true,
  wavExport: true,
  mp3Export: true,
  longFormExport: true,
};

const TOOL_ROUTE_AVAILABILITY: Record<AudioPresetAvailabilityFlag, boolean> = {
  ...ALL_ROUTE_AVAILABILITY,
  translator: false,
};

const STANDARD_ROUTE_AVAILABILITY = ALL_ROUTE_AVAILABILITY;
const CREATIVE_ROUTE_AVAILABILITY = TOOL_ROUTE_AVAILABILITY;

function definePreset(
  definition: Omit<
    AudioTonePresetDefinition,
    | "worksForLivePlayback"
    | "worksForWavExport"
    | "worksForMp3Export"
    | "worksForLongFormExport"
  >,
): AudioTonePresetDefinition {
  return {
    ...definition,
    worksForLivePlayback: definition.routeAvailability.livePlayback,
    worksForWavExport: definition.routeAvailability.wavExport,
    worksForMp3Export: definition.routeAvailability.mp3Export,
    worksForLongFormExport: definition.routeAvailability.longFormExport,
  };
}

export const AUDIO_TONE_PRESET_REGISTRY: Record<
  AudioTonePresetId,
  AudioTonePresetDefinition
> = {
  cw_radio: definePreset({
    id: "cw_radio",
    label: "CW (Radio)",
    shortLabel: "CW radio",
    shortDescription:
      "Clean keyed radio-style tone for normal Morse listening and export.",
    category: "standard",
    standard: true,
    toneEngine: { kind: "cw", oscillatorType: "sine" },
    defaults: { pitchHz: 650, volume: 0.75, attackMs: 8, releaseMs: 12 },
    routeAvailability: STANDARD_ROUTE_AVAILABILITY,
    pitchControl: true,
  }),
  sine: definePreset({
    id: "sine",
    label: "Sine",
    shortLabel: "Sine",
    shortDescription: "Smooth pure tone with a softer edge.",
    category: "standard",
    standard: true,
    toneEngine: { kind: "oscillator", oscillatorType: "sine" },
    defaults: { pitchHz: 600, volume: 0.72, attackMs: 10, releaseMs: 14 },
    routeAvailability: STANDARD_ROUTE_AVAILABILITY,
    pitchControl: true,
  }),
  square: definePreset({
    id: "square",
    label: "Square",
    shortLabel: "Square",
    shortDescription: "Bright electronic beep with a sharper edge.",
    category: "standard",
    standard: true,
    toneEngine: { kind: "oscillator", oscillatorType: "square" },
    defaults: { pitchHz: 700, volume: 0.62, attackMs: 6, releaseMs: 10 },
    routeAvailability: STANDARD_ROUTE_AVAILABILITY,
    pitchControl: true,
  }),
  triangle: definePreset({
    id: "triangle",
    label: "Triangle",
    shortLabel: "Triangle",
    shortDescription: "Mellow tone between sine and square.",
    category: "standard",
    standard: true,
    toneEngine: { kind: "oscillator", oscillatorType: "triangle" },
    defaults: { pitchHz: 620, volume: 0.72, attackMs: 12, releaseMs: 18 },
    routeAvailability: STANDARD_ROUTE_AVAILABILITY,
    pitchControl: true,
  }),
  sawtooth: definePreset({
    id: "sawtooth",
    label: "Sawtooth",
    shortLabel: "Sawtooth",
    shortDescription: "Buzzier synthetic tone for high contrast practice.",
    category: "standard",
    standard: true,
    toneEngine: { kind: "oscillator", oscillatorType: "sawtooth" },
    defaults: { pitchHz: 620, volume: 0.58, attackMs: 6, releaseMs: 12 },
    routeAvailability: STANDARD_ROUTE_AVAILABILITY,
    pitchControl: true,
  }),
  sounder: definePreset({
    id: "sounder",
    label: "Telegraph sounder",
    shortLabel: "Sounder",
    shortDescription: "Noisy telegraph-key style click for historical flavor.",
    category: "standard",
    standard: true,
    toneEngine: { kind: "sounder" },
    defaults: { pitchHz: 650, volume: 0.78, attackMs: 0, releaseMs: 0 },
    routeAvailability: STANDARD_ROUTE_AVAILABILITY,
    pitchControl: false,
  }),
  soft_bell: definePreset({
    id: "soft_bell",
    label: "Soft bell",
    shortLabel: "Soft bell",
    shortDescription: "Layered sine harmonics with a gentle bell tail.",
    category: "creative",
    standard: false,
    toneEngine: { kind: "soft_bell" },
    defaults: { pitchHz: 760, volume: 0.6, attackMs: 14, releaseMs: 120 },
    routeAvailability: CREATIVE_ROUTE_AVAILABILITY,
    pitchControl: true,
  }),
  warm_tone: definePreset({
    id: "warm_tone",
    label: "Warm tone",
    shortLabel: "Warm tone",
    shortDescription: "Rounded sine-and-triangle blend for relaxed listening.",
    category: "creative",
    standard: false,
    toneEngine: { kind: "warm_tone" },
    defaults: { pitchHz: 560, volume: 0.72, attackMs: 18, releaseMs: 36 },
    routeAvailability: CREATIVE_ROUTE_AVAILABILITY,
    pitchControl: true,
  }),
  low_beacon: definePreset({
    id: "low_beacon",
    label: "Low beacon",
    shortLabel: "Low beacon",
    shortDescription: "Lower sine beacon that sits below the default CW pitch.",
    category: "creative",
    standard: false,
    toneEngine: { kind: "low_beacon" },
    defaults: { pitchHz: 420, volume: 0.76, attackMs: 20, releaseMs: 55 },
    routeAvailability: CREATIVE_ROUTE_AVAILABILITY,
    pitchControl: true,
  }),
  submarine_ping: definePreset({
    id: "submarine_ping",
    label: "Submarine ping",
    shortLabel: "Submarine",
    shortDescription: "Down-swept ping with a long soft release.",
    category: "creative",
    standard: false,
    toneEngine: { kind: "submarine_ping" },
    defaults: { pitchHz: 520, volume: 0.7, attackMs: 3, releaseMs: 130 },
    routeAvailability: CREATIVE_ROUTE_AVAILABILITY,
    pitchControl: true,
  }),
  digital_blip: definePreset({
    id: "digital_blip",
    label: "Digital blip",
    shortLabel: "Digital",
    shortDescription: "Short square-edged synthetic blip.",
    category: "creative",
    standard: false,
    toneEngine: { kind: "digital_blip", oscillatorType: "square" },
    defaults: { pitchHz: 820, volume: 0.58, attackMs: 2, releaseMs: 18 },
    routeAvailability: CREATIVE_ROUTE_AVAILABILITY,
    pitchControl: true,
  }),
  soft_click: definePreset({
    id: "soft_click",
    label: "Soft click",
    shortLabel: "Soft click",
    shortDescription: "A gentler click-focused sound for short practice clips.",
    category: "creative",
    standard: false,
    toneEngine: { kind: "soft_click" },
    defaults: { pitchHz: 650, volume: 0.66, attackMs: 0, releaseMs: 22 },
    routeAvailability: CREATIVE_ROUTE_AVAILABILITY,
    pitchControl: false,
  }),
  bird_chirp: definePreset({
    id: "bird_chirp",
    label: "Bird chirp",
    shortLabel: "Bird chirp",
    shortDescription: "Up-swept synthesized chirp with no sampled audio.",
    category: "creative",
    standard: false,
    toneEngine: { kind: "bird_chirp" },
    defaults: { pitchHz: 900, volume: 0.45, attackMs: 5, releaseMs: 80 },
    routeAvailability: CREATIVE_ROUTE_AVAILABILITY,
    pitchControl: true,
    safetyNote: "Synthesized tone only; no animal or sampled audio assets.",
  }),
};

const AUDIO_TONE_PRESET_SET = new Set<AudioTonePresetId>(AUDIO_TONE_PRESETS);

const GENERATOR_PRESET_ALIAS_MAP: Record<string, AudioTonePresetId> = {
  smooth_sine: "sine",
  bright_square: "square",
  telegraph_sounder: "sounder",
};

const TRANSLATOR_PRESET_MAP: Record<TranslatorAudioPresetId, AudioTonePresetId> =
  {
    cw_radio: "cw_radio",
    smooth_sine: "sine",
    bright_square: "square",
    telegraph_sounder: "sounder",
  };

export function isAudioTonePresetId(
  value: unknown,
): value is AudioTonePresetId {
  return (
    typeof value === "string" &&
    AUDIO_TONE_PRESET_SET.has(value as AudioTonePresetId)
  );
}

export function isTranslatorAudioPresetId(
  value: unknown,
): value is TranslatorAudioPresetId {
  return TRANSLATOR_AUDIO_PRESET_IDS.includes(value as TranslatorAudioPresetId);
}

export function getAudioTonePresetDefinition(
  preset: unknown,
): AudioTonePresetDefinition {
  return AUDIO_TONE_PRESET_REGISTRY[sanitizeAudioTonePreset(preset)];
}

export function sanitizeAudioTonePreset(
  value: unknown,
  fallback: AudioTonePresetId = "cw_radio",
  context?: AudioPresetAvailabilityFlag,
): AudioTonePresetId {
  const normalized =
    typeof value === "string" ? value.trim() : String(value ?? "");
  const candidate = isAudioTonePresetId(normalized)
    ? normalized
    : GENERATOR_PRESET_ALIAS_MAP[normalized];
  const safeFallback = isAudioTonePresetId(fallback) ? fallback : "cw_radio";

  if (!candidate) return safeFallback;
  if (context && !AUDIO_TONE_PRESET_REGISTRY[candidate].routeAvailability[context]) {
    return safeFallback;
  }
  return candidate;
}

export function sanitizeTranslatorAudioPreset(
  value: unknown,
  fallback: TranslatorAudioPresetId = "cw_radio",
): TranslatorAudioPresetId {
  return isTranslatorAudioPresetId(value) ? value : fallback;
}

export function mapTranslatorAudioPreset(
  preset: unknown,
): AudioTonePresetId {
  return TRANSLATOR_PRESET_MAP[sanitizeTranslatorAudioPreset(preset)];
}

export function getTranslatorAudioPresetLabel(
  preset: TranslatorAudioPresetId,
) {
  return AUDIO_TONE_PRESET_REGISTRY[TRANSLATOR_PRESET_MAP[preset]].label;
}

export function getAudioPresetsForContext(
  context: AudioPresetAvailabilityFlag,
  options: { includeCreative?: boolean } = {},
) {
  const includeCreative = options.includeCreative ?? true;
  return AUDIO_TONE_PRESETS.filter((preset) => {
    const definition = AUDIO_TONE_PRESET_REGISTRY[preset];
    if (!includeCreative && definition.category === "creative") return false;
    return definition.routeAvailability[context];
  });
}

export function getAudioPresetLabel(preset: unknown) {
  return getAudioTonePresetDefinition(preset).label;
}

export function getAudioPresetShortLabel(preset: unknown) {
  return getAudioTonePresetDefinition(preset).shortLabel;
}

export function getAudioPresetDefaults(preset: unknown) {
  return getAudioTonePresetDefinition(preset).defaults;
}

export function audioPresetAllowsPitchControl(preset: unknown) {
  return getAudioTonePresetDefinition(preset).pitchControl;
}

export function getPresetDescription(preset: unknown) {
  return getAudioTonePresetDefinition(preset).shortDescription;
}
