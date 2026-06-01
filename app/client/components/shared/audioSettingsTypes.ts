export type StandardAudioTonePresetId =
  | "cw_radio"
  | "sine"
  | "square"
  | "triangle"
  | "sawtooth"
  | "sounder";

export type CreativeAudioTonePresetId =
  | "soft_bell"
  | "warm_tone"
  | "low_beacon"
  | "submarine_ping"
  | "digital_blip"
  | "soft_click"
  | "bird_chirp";

export type AudioTonePresetId =
  | StandardAudioTonePresetId
  | CreativeAudioTonePresetId;

export type TranslatorAudioPresetId =
  | "cw_radio"
  | "smooth_sine"
  | "bright_square"
  | "telegraph_sounder";

export type AudioPresetCategory = "standard" | "creative";

export type AudioPresetAvailabilityFlag =
  | "translator"
  | "audio"
  | "soundGenerator"
  | "mp3Generator"
  | "bookExport"
  | "livePlayback"
  | "wavExport"
  | "mp3Export"
  | "longFormExport";

export type AudioToneEngineKind =
  | "cw"
  | "oscillator"
  | "sounder"
  | "soft_bell"
  | "warm_tone"
  | "low_beacon"
  | "submarine_ping"
  | "digital_blip"
  | "soft_click"
  | "bird_chirp";

export type AudioTonePresetDefinition = {
  id: AudioTonePresetId;
  label: string;
  shortLabel: string;
  shortDescription: string;
  category: AudioPresetCategory;
  standard: boolean;
  toneEngine: {
    kind: AudioToneEngineKind;
    oscillatorType?: OscillatorType;
  };
  defaults: {
    pitchHz: number;
    volume: number;
    attackMs: number;
    releaseMs: number;
  };
  routeAvailability: Record<AudioPresetAvailabilityFlag, boolean>;
  worksForLivePlayback: boolean;
  worksForWavExport: boolean;
  worksForMp3Export: boolean;
  worksForLongFormExport: boolean;
  pitchControl: boolean;
  safetyNote?: string;
};
