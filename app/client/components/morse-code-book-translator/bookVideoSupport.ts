export type BookVideoSupport = {
  supported: boolean;
  mimeType: string;
  extension: "webm";
  reason: string;
  audioTrackSupported: boolean;
  audioTrackReason: string;
};

const BOOK_VIDEO_MIME_CANDIDATES = [
  "video/webm;codecs=vp9,opus",
  "video/webm;codecs=vp8,opus",
  "video/webm;codecs=vp9",
  "video/webm;codecs=vp8",
  "video/webm",
] as const;

export function detectBookVideoSupport(): BookVideoSupport {
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
    return unsupported(
      "This browser does not support canvas video capture.",
    );
  }

  const mimeType = getSupportedBookVideoMimeType();
  if (!mimeType) {
    return unsupported("This browser does not report a supported WebM format.");
  }

  const audioTrackSupported = supportsAudioTrack();
  return {
    supported: true,
    mimeType,
    extension: "webm",
    reason: "WebM video export is available in this browser.",
    audioTrackSupported,
    audioTrackReason: audioTrackSupported
      ? "Synchronized audio tracks are available."
      : "Audio tracks are unavailable in this browser; video can still export silently.",
  };
}

export function getSupportedBookVideoMimeType() {
  if (typeof MediaRecorder === "undefined") return "";
  for (const mimeType of BOOK_VIDEO_MIME_CANDIDATES) {
    if (
      typeof MediaRecorder.isTypeSupported !== "function" ||
      MediaRecorder.isTypeSupported(mimeType)
    ) {
      return mimeType;
    }
  }
  return "";
}

export function describeBookVideoFormat(support: BookVideoSupport | null) {
  if (!support) return "Checking WebM support";
  if (!support.supported) return "Video unavailable";
  return "WebM";
}

function unsupported(reason: string): BookVideoSupport {
  return {
    supported: false,
    mimeType: "",
    extension: "webm",
    reason,
    audioTrackSupported: false,
    audioTrackReason: "Audio tracks require browser video export support.",
  };
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
