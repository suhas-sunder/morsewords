import {
  audioPresetAllowsPitchControl,
  getAudioPresetDefaults,
  getAudioTonePresetDefinition,
  sanitizeAudioTonePreset,
  type AudioTonePresetId,
} from "~/client/components/shared/audioPresetRegistry";

const TWO_PI = Math.PI * 2;

export function defaultAttackMs(preset: unknown) {
  return getAudioPresetDefaults(preset).attackMs;
}

export function defaultReleaseMs(preset: unknown) {
  return getAudioPresetDefaults(preset).releaseMs;
}

export function defaultPitchHz(preset: unknown) {
  return getAudioPresetDefaults(preset).pitchHz;
}

export function defaultPresetVolume(preset: unknown) {
  return getAudioPresetDefaults(preset).volume;
}

export function presetSupportsPitchControl(preset: unknown) {
  return audioPresetAllowsPitchControl(preset);
}

export function presetToOscType(preset: unknown): OscillatorType {
  const definition = getAudioTonePresetDefinition(preset);
  return definition.toneEngine.oscillatorType ?? "sine";
}

export function isNoiseLikePreset(preset: unknown) {
  const kind = getAudioTonePresetDefinition(preset).toneEngine.kind;
  return kind === "sounder" || kind === "soft_click";
}

export function oscillatorLayers({
  hz,
  preset,
}: {
  hz: number;
  preset: unknown;
}): Array<{
  type: OscillatorType;
  gain: number;
  startHz: number;
  endHz?: number;
}> {
  const safePreset = sanitizeAudioTonePreset(preset);
  const definition = getAudioTonePresetDefinition(safePreset);
  const type = presetToOscType(safePreset);

  switch (definition.toneEngine.kind) {
    case "soft_bell":
      return [
        { type: "sine", gain: 0.78, startHz: hz },
        { type: "sine", gain: 0.2, startHz: hz * 2.01 },
        { type: "triangle", gain: 0.12, startHz: hz * 3.02 },
      ];
    case "warm_tone":
      return [
        { type: "sine", gain: 0.78, startHz: hz },
        { type: "triangle", gain: 0.28, startHz: hz * 0.5 },
      ];
    case "low_beacon":
      return [
        { type: "sine", gain: 0.86, startHz: hz },
        { type: "sine", gain: 0.18, startHz: hz * 1.5 },
      ];
    case "submarine_ping":
      return [{ type: "sine", gain: 1, startHz: hz * 1.12, endHz: hz * 0.78 }];
    case "digital_blip":
      return [
        { type: "square", gain: 0.75, startHz: hz },
        { type: "sine", gain: 0.22, startHz: hz * 2 },
      ];
    case "bird_chirp":
      return [
        { type: "sine", gain: 0.82, startHz: hz * 0.72, endHz: hz * 1.42 },
        { type: "triangle", gain: 0.16, startHz: hz * 1.44, endHz: hz * 2 },
      ];
    default:
      return [{ type, gain: 1, startHz: hz }];
  }
}

export function samplePresetWaveform({
  hz,
  localSampleIndex,
  preset,
  sampleIndex,
  sampleRate,
  samples,
}: {
  hz: number;
  localSampleIndex: number;
  preset: unknown;
  sampleIndex: number;
  sampleRate: number;
  samples: number;
}) {
  const safePreset = sanitizeAudioTonePreset(preset);
  const definition = getAudioTonePresetDefinition(safePreset);
  const progress = samples > 1 ? localSampleIndex / (samples - 1) : 0;

  switch (definition.toneEngine.kind) {
    case "sounder":
      return deterministicNoise(sampleIndex) * 0.75;
    case "soft_click": {
      const decay = Math.exp(-progress * 10);
      return deterministicNoise(sampleIndex) * 0.55 * decay;
    }
    case "soft_bell": {
      const decay = 1 - progress * 0.55;
      return (
        sine(sampleIndex, hz, sampleRate) * 0.78 +
        sine(sampleIndex, hz * 2.01, sampleRate) * 0.2 * decay +
        triangle(sampleIndex, hz * 3.02, sampleRate) * 0.1 * decay
      );
    }
    case "warm_tone":
      return (
        sine(sampleIndex, hz, sampleRate) * 0.78 +
        triangle(sampleIndex, hz * 0.5, sampleRate) * 0.28
      );
    case "low_beacon":
      return (
        sine(sampleIndex, hz, sampleRate) * 0.86 +
        sine(sampleIndex, hz * 1.5, sampleRate) * 0.18
      );
    case "submarine_ping": {
      const sweptHz = hz * (1.12 - progress * 0.34);
      return sine(sampleIndex, sweptHz, sampleRate);
    }
    case "digital_blip":
      return (
        square(sampleIndex, hz, sampleRate) * 0.76 +
        sine(sampleIndex, hz * 2, sampleRate) * 0.22
      );
    case "bird_chirp": {
      const sweptHz = hz * (0.72 + progress * 0.7);
      return (
        sine(sampleIndex, sweptHz, sampleRate) * 0.82 +
        triangle(sampleIndex, sweptHz * 2, sampleRate) * 0.16
      );
    }
    case "cw":
    case "oscillator":
    default:
      return oscillatorSample(
        presetToOscType(safePreset),
        sampleIndex,
        hz,
        sampleRate,
      );
  }
}

export function renderPresetPcmTone({
  amplitude,
  attackMs,
  hz,
  preset,
  releaseMs,
  sampleRate,
  samples,
}: {
  amplitude: number;
  attackMs: number;
  hz: number;
  preset: AudioTonePresetId;
  releaseMs: number;
  sampleRate: number;
  samples: number;
}) {
  const output = new Float32Array(samples);
  const attackSamples = Math.min(samples / 2, (sampleRate * attackMs) / 1000);
  const releaseSamples = Math.min(samples / 2, (sampleRate * releaseMs) / 1000);

  for (let index = 0; index < samples; index += 1) {
    const envelope = envelopeAt(index, samples, attackSamples, releaseSamples);
    output[index] =
      samplePresetWaveform({
        preset,
        sampleIndex: index,
        localSampleIndex: index,
        samples,
        hz,
        sampleRate,
      }) *
      amplitude *
      envelope;
  }

  return output;
}

export function envelopeAt(
  sampleIndex: number,
  samples: number,
  attackSamples: number,
  releaseSamples: number,
) {
  const attack =
    attackSamples > 0 ? Math.min(1, sampleIndex / attackSamples) : 1;
  const releaseStart = samples - releaseSamples;
  const release =
    releaseSamples > 0 && sampleIndex > releaseStart
      ? Math.max(0, (samples - sampleIndex) / releaseSamples)
      : 1;
  return Math.min(attack, release);
}

function oscillatorSample(
  type: OscillatorType,
  sampleIndex: number,
  hz: number,
  sampleRate: number,
) {
  if (type === "square") return square(sampleIndex, hz, sampleRate);
  if (type === "triangle") return triangle(sampleIndex, hz, sampleRate);
  if (type === "sawtooth") return sawtooth(sampleIndex, hz, sampleRate);
  return sine(sampleIndex, hz, sampleRate);
}

function sine(sampleIndex: number, hz: number, sampleRate: number) {
  return Math.sin(TWO_PI * ((sampleIndex * hz) / sampleRate));
}

function square(sampleIndex: number, hz: number, sampleRate: number) {
  const phase = ((sampleIndex * hz) / sampleRate) % 1;
  return phase < 0.5 ? 1 : -1;
}

function triangle(sampleIndex: number, hz: number, sampleRate: number) {
  const phase = ((sampleIndex * hz) / sampleRate) % 1;
  return 1 - 4 * Math.abs(Math.round(phase - 0.25) - (phase - 0.25));
}

function sawtooth(sampleIndex: number, hz: number, sampleRate: number) {
  const phase = ((sampleIndex * hz) / sampleRate) % 1;
  return 2 * phase - 1;
}

function deterministicNoise(sampleIndex: number) {
  const noise = Math.sin((sampleIndex + 1) * 12.9898) * 43758.5453;
  return (noise - Math.floor(noise)) * 2 - 1;
}
