/** Mono 16-bit PCM WAV with a 440 Hz sine — a real, decodable test file. */
export function makeWav(seconds: number, sampleRate = 44100): Uint8Array {
  const samples = Math.round(seconds * sampleRate);
  const dataSize = samples * 2;
  const buf = new ArrayBuffer(44 + dataSize);
  const v = new DataView(buf);
  const str = (o: number, s: string) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  str(0, "RIFF");
  v.setUint32(4, 36 + dataSize, true);
  str(8, "WAVE");
  str(12, "fmt ");
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true);
  v.setUint16(22, 1, true);
  v.setUint32(24, sampleRate, true);
  v.setUint32(28, sampleRate * 2, true);
  v.setUint16(32, 2, true);
  v.setUint16(34, 16, true);
  str(36, "data");
  v.setUint32(40, dataSize, true);
  for (let i = 0; i < samples; i++) {
    v.setInt16(44 + i * 2, Math.round(Math.sin((2 * Math.PI * 440 * i) / sampleRate) * 0.6 * 32767), true);
  }
  return new Uint8Array(buf);
}
