/** Peak amplitude per bar across all channels, normalised to 0..1 against the loudest bar (3 decimals). */
export function computePeaks(channels: Float32Array[], bars = 150): number[] {
  const length = channels[0]?.length ?? 0;
  const raw = new Array<number>(bars).fill(0);
  if (length === 0) return raw;

  for (let i = 0; i < bars; i++) {
    const start = Math.min(length - 1, Math.floor((i * length) / bars));
    const end = Math.min(length, Math.max(start + 1, Math.floor(((i + 1) * length) / bars)));
    let peak = 0;
    for (const ch of channels) {
      for (let s = start; s < end; s++) {
        const v = Math.abs(ch[s]);
        if (v > peak) peak = v;
      }
    }
    raw[i] = peak;
  }

  const max = Math.max(...raw);
  if (max === 0) return raw;
  return raw.map((p) => Math.round((p / max) * 1000) / 1000);
}

/** Decodes an audio file in the browser to get its waveform and duration. Returns null when the browser cannot decode it. */
export async function decodeAudio(file: File, bars = 150): Promise<{ peaks: number[]; durationSeconds: number } | null> {
  try {
    const ctx = new AudioContext();
    try {
      const buffer = await ctx.decodeAudioData(await file.arrayBuffer());
      const channels = Array.from({ length: buffer.numberOfChannels }, (_, i) => buffer.getChannelData(i));
      return { peaks: computePeaks(channels, bars), durationSeconds: Math.round(buffer.duration) };
    } finally {
      void ctx.close();
    }
  } catch {
    return null;
  }
}
