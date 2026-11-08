import { describe, expect, it } from "vitest";
import { computePeaks } from "@/lib/audio/waveform";

describe("computePeaks", () => {
  it("returns 150 zeros for silence", () => {
    const peaks = computePeaks([new Float32Array(300)]);
    expect(peaks).toHaveLength(150);
    expect(peaks.every((p) => p === 0)).toBe(true);
  });

  it("normalises against the loudest bucket", () => {
    const ch = new Float32Array(300);
    ch.fill(0.25, 0, 150);
    ch.fill(-0.5, 150);
    const peaks = computePeaks([ch]);
    expect(peaks[0]).toBe(0.5);
    expect(peaks[149]).toBe(1);
  });

  it("takes the loudest of all channels", () => {
    const left = new Float32Array(300).fill(0.1);
    const right = new Float32Array(300).fill(0.4);
    right[0] = 0.8;
    const peaks = computePeaks([left, right]);
    expect(peaks[0]).toBe(1);
    expect(peaks[1]).toBe(0.5);
  });

  it("supports a custom bar count and short buffers", () => {
    expect(computePeaks([new Float32Array([0.5, 1])], 10)).toHaveLength(10);
  });
});
