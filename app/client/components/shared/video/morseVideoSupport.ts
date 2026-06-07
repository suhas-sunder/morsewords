export type MorseVideoSupport = {
  supported: boolean;
  mimeType: string;
  extension: MorseVideoFormatExtension;
  reason: string;
  audioTrackSupported: boolean;
  audioTrackReason: string;
  formats: MorseVideoFormatSupport[];
};

export type MorseVideoFormat = "webm" | "mp4";
export type MorseVideoFormatExtension = MorseVideoFormat;

export type MorseVideoFormatSupport = {
  format: MorseVideoFormat;
  label: "WebM" | "MP4";
  supported: boolean;
  mimeType: string;
  extension: MorseVideoFormatExtension;
  reason: string;
};

export const MORSE_VIDEO_FORMATS = ["webm", "mp4"] as const;

const WEBM_MIME_CANDIDATES = [
  "video/webm;codecs=vp9,opus",
  "video/webm;codecs=vp8,opus",
  "video/webm;codecs=vp9",
  "video/webm;codecs=vp8",
  "video/webm",
] as const;

const MP4_MIME_CANDIDATES = [
  "video/mp4;codecs=avc1.42E01E,mp4a.40.2",
  "video/mp4;codecs=h264,aac",
  "video/mp4",
] as const;

export function detectMorseVideoSupport(): MorseVideoSupport {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return unsupported("Video export runs in a browser window.");
  }

  if (typeof MediaRecorder === "undefined") {
    return unsupported(
      "This browser does not support MediaRecorder video export.",
    );
  }

  const canvas = document.createElement("canvas") as HTMLCanvasElement & {
    captureStream?: (frameRate?: number) => MediaStream;
  };
  if (typeof canvas.captureStream !== "function") {
    return unsupported("This browser does not support canvas video capture.");
  }

  const formats = detectMorseVideoFormatSupport();
  const webmSupport = getMorseVideoFormatSupportFromList(formats, "webm");
  if (!webmSupport.supported) {
    return unsupported("This browser does not report a supported WebM format.");
  }

  const audioTrackSupported = supportsAudioTrack();
  return {
    supported: true,
    mimeType: webmSupport.mimeType,
    extension: webmSupport.extension,
    reason: "WebM video export is available in this browser.",
    audioTrackSupported,
    audioTrackReason: audioTrackSupported
      ? "Synchronized audio tracks are available."
      : "Audio tracks are unavailable in this browser; video can still export silently.",
    formats,
  };
}

export function detectMorseVideoFormatSupport(): MorseVideoFormatSupport[] {
  return [
    buildFormatSupport("webm", "WebM", "WebM"),
    buildFormatSupport("mp4", "MP4", "MP4"),
  ];
}

export function getSupportedMorseVideoMimeType(format: MorseVideoFormat = "webm") {
  if (typeof MediaRecorder === "undefined") return "";
  const candidates = format === "mp4" ? MP4_MIME_CANDIDATES : WEBM_MIME_CANDIDATES;
  for (const mimeType of candidates) {
    if (
      typeof MediaRecorder.isTypeSupported !== "function" ||
      MediaRecorder.isTypeSupported(mimeType)
    ) {
      return mimeType;
    }
  }
  return "";
}

export function getMorseVideoFormatSupport(
  support: MorseVideoSupport | null,
  format: MorseVideoFormat,
): MorseVideoFormatSupport {
  if (!support) {
    return {
      format,
      label: format === "mp4" ? "MP4" : "WebM",
      supported: false,
      mimeType: "",
      extension: format,
      reason: `Checking ${format === "mp4" ? "MP4" : "WebM"} support.`,
    };
  }
  return getMorseVideoFormatSupportFromList(support.formats, format);
}

export function describeMorseVideoFormat(support: MorseVideoSupport | null) {
  if (!support) return "Checking WebM support";
  if (!support.supported) return "Video unavailable";
  return "WebM";
}

function unsupported(reason: string): MorseVideoSupport {
  const formats = detectMorseVideoFormatSupport();
  return {
    supported: false,
    mimeType: "",
    extension: "webm",
    reason,
    audioTrackSupported: false,
    audioTrackReason: "Audio tracks require browser video export support.",
    formats,
  };
}

function buildFormatSupport(
  format: MorseVideoFormat,
  label: MorseVideoFormatSupport["label"],
  friendlyName: string,
): MorseVideoFormatSupport {
  const mimeType = getSupportedMorseVideoMimeType(format);
  return {
    format,
    label,
    supported: Boolean(mimeType),
    mimeType,
    extension: format,
    reason: mimeType
      ? `${friendlyName} export is available in this browser.`
      : `${friendlyName} not supported in this browser.`,
  };
}

function getMorseVideoFormatSupportFromList(
  formats: MorseVideoFormatSupport[],
  format: MorseVideoFormat,
): MorseVideoFormatSupport {
  return (
    formats.find((item) => item.format === format) ?? {
      format,
      label: format === "mp4" ? "MP4" : "WebM",
      supported: false,
      mimeType: "",
      extension: format,
      reason: `${format === "mp4" ? "MP4" : "WebM"} not supported in this browser.`,
    }
  );
}

function supportsAudioTrack() {
  if (typeof window === "undefined") return false;
  const AudioContextCtor =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  return (
    !!AudioContextCtor &&
    typeof AudioContextCtor.prototype.createMediaStreamDestination === "function"
  );
}
