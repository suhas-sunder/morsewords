/** Adapt the reviewed work description to the audio task without importing the library payload. */
export function morseAudiobookDescription(title: string, reviewedDescription?: string | null) {
  const description = reviewedDescription?.trim();
  return description
    ? `Listen to ${title} in Morse code. ${description}`
    : `Listen to ${title} in Morse code with chapter selection, playback controls, and MP3 download.`;
}
