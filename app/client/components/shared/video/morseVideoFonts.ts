const REQUIRED_MORSE_VIDEO_FONTS = [
  '700 64px "Space Mono"',
  '800 64px "DM Sans"',
] as const;

export class MorseVideoFontReadinessError extends Error {
  constructor() {
    super(
      "The video export could not prepare its required fonts. Refresh the page and try again.",
    );
    this.name = "MorseVideoFontReadinessError";
  }
}

/**
 * Canvas has no layout pass to wait on, so make font readiness explicit before
 * drawing or recording. The timeout is deliberately bounded: a font problem
 * must return a usable UI rather than leave an export indefinitely pending.
 */
export async function waitForMorseVideoFonts({
  timeoutMs = 3_500,
}: {
  timeoutMs?: number;
} = {}) {
  if (typeof document === "undefined" || !("fonts" in document)) {
    throw new MorseVideoFontReadinessError();
  }

  const fonts = document.fonts;
  let timeoutId: number | null = null;
  try {
    await Promise.race([
      Promise.all([
        ...REQUIRED_MORSE_VIDEO_FONTS.map((font) => fonts.load(font)),
        fonts.ready,
      ]),
      new Promise<never>((_, reject) => {
        timeoutId = window.setTimeout(
          () => reject(new MorseVideoFontReadinessError()),
          timeoutMs,
        );
      }),
    ]);

    // `FontFaceSet.check()` is inconsistent for CSS-loaded variable/subset
    // fonts in Chromium even after `load()` and `ready` resolve. The explicit
    // requests above are the reliable readiness contract; rejection or the
    // bounded timeout still produces the visible recovery state.
  } catch (error) {
    if (error instanceof MorseVideoFontReadinessError) throw error;
    throw new MorseVideoFontReadinessError();
  } finally {
    if (timeoutId !== null) window.clearTimeout(timeoutId);
  }
}
