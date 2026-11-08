export type AudioFormat = "mp3" | "flac" | "wav";
export type AudioCheck = { ok: true; format: AudioFormat } | { ok: false; error: string };

export const MAX_AUDIO_BYTES = 50 * 1024 * 1024;
export const AUDIO_HELP = "MP3, FLAC or WAV, up to 50 MB. Mastered audio only.";

const MIME: Record<AudioFormat, string[]> = {
  mp3: ["audio/mpeg", "audio/mp3"],
  flac: ["audio/flac", "audio/x-flac"],
  wav: ["audio/wav", "audio/x-wav", "audio/wave", "audio/vnd.wave"],
};

export const AUDIO_MIME_TYPES = Object.values(MIME).flat();
export const AUDIO_ACCEPT = ".mp3,.flac,.wav," + AUDIO_MIME_TYPES.join(",");

/** Extension and MIME must agree (an empty MIME is accepted when the extension is valid). */
export function validateAudioFile(file: File): AudioCheck {
  const ext = /\.([a-z0-9]+)$/i.exec(file.name)?.[1]?.toLowerCase();
  const format = (["mp3", "flac", "wav"] as const).find((f) => f === ext);
  if (!format || (file.type && !MIME[format].includes(file.type))) {
    return { ok: false, error: "Use an MP3, FLAC or WAV file." };
  }
  if (file.size === 0) return { ok: false, error: "This file is empty." };
  if (file.size > MAX_AUDIO_BYTES) return { ok: false, error: "File too large — max 50 MB. Export as MP3 or FLAC." };
  return { ok: true, format };
}

/** The MIME type to send to Storage (falls back from the extension when the browser gives none). */
export function audioContentType(file: File, format: AudioFormat): string {
  return file.type || MIME[format][0];
}
