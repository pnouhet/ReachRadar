import { describe, expect, it, vi } from "vitest";
import {
  AUDIO_EVENT,
  closePlayer,
  createPlayerStore,
  formatTime,
  onOtherAudioStart,
  PLAYER_CLOSE_EVENT,
  PLAYER_SOURCE,
  VOLUME_KEY,
  type AudioLike,
  type PlayerTrack,
} from "@/lib/player/store";

/** Minimal stand-in for HTMLAudioElement: plays instantly, lets the test fire media events. */
class FakeAudio extends EventTarget {
  src = "";
  currentTime = 0;
  duration = NaN;
  volume = 1;
  muted = false;
  paused = true;
  playFails = false;
  play = vi.fn(async () => {
    if (this.playFails) throw new Error("NotAllowedError");
    this.paused = false;
    this.duration = 180;
    this.dispatchEvent(new Event("playing"));
  });
  pause = vi.fn(() => {
    if (this.paused) return;
    this.paused = true;
    this.dispatchEvent(new Event("pause"));
  });
  load = vi.fn();
  removeAttribute = vi.fn((name: string) => {
    if (name === "src") this.src = "";
  });
  fire(type: string) {
    this.dispatchEvent(new Event(type));
  }
}

const track = (id: string): PlayerTrack => ({ id, title: `Track ${id}`, artist: "Nova", coverUrl: null });
const A = track("a");
const B = track("b");
const C = track("c");

function setup(options: { loadUrl?: (id: string) => Promise<string | null>; stored?: string } = {}) {
  const audio = new FakeAudio();
  const loadUrl = vi.fn(options.loadUrl ?? (async (id: string) => `https://cdn.test/${id}.mp3`));
  const values = new Map<string, string>(options.stored ? [[VOLUME_KEY, options.stored]] : []);
  const storage = { getItem: (k: string) => values.get(k) ?? null, setItem: (k: string, v: string) => void values.set(k, v) };
  const store = createPlayerStore({ createAudio: () => audio as unknown as AudioLike, loadUrl, storage });
  return { audio, loadUrl, store, values };
}

/** Lets the pending loadUrl promise and the play() promise settle. */
const settle = () => new Promise((r) => setTimeout(r, 0));

describe("player store", () => {
  it("starts hidden, with nothing loaded", () => {
    const { store } = setup();
    expect(store.getState()).toMatchObject({ index: -1, status: "idle", queue: [] });
    expect(store.current()).toBeNull();
  });

  it("loads the signed URL and plays the chosen track of the queue", async () => {
    const { audio, loadUrl, store } = setup();
    store.play(B, [A, B, C]);
    expect(store.getState()).toMatchObject({ index: 1, status: "loading" });
    await settle();
    expect(loadUrl).toHaveBeenCalledWith("b");
    expect(audio.src).toBe("https://cdn.test/b.mp3");
    expect(store.getState().status).toBe("playing");
    expect(store.current()).toEqual(B);
  });

  it("queues the track alone when no list is given", async () => {
    const { store } = setup();
    store.play(A);
    await settle();
    expect(store.getState().queue).toEqual([A]);
  });

  it("toggles between paused and playing", async () => {
    const { store } = setup();
    store.play(A);
    await settle();
    store.toggle();
    expect(store.getState().status).toBe("paused");
    store.toggle();
    await settle();
    expect(store.getState().status).toBe("playing");
  });

  it("next moves forward and stops at the end of the queue", async () => {
    const { loadUrl, store } = setup();
    store.play(A, [A, B]);
    await settle();
    store.next();
    await settle();
    expect(store.current()).toEqual(B);
    store.next();
    await settle();
    expect(store.current()).toEqual(B);
    expect(loadUrl).toHaveBeenCalledTimes(2);
  });

  it("previous goes back in the first seconds, and restarts the track after that", async () => {
    const { audio, store } = setup();
    store.play(B, [A, B]);
    await settle();
    audio.currentTime = 42;
    audio.fire("timeupdate");
    store.prev();
    expect(audio.currentTime).toBe(0);
    expect(store.current()).toEqual(B);
    store.prev();
    await settle();
    expect(store.current()).toEqual(A);
  });

  it("plays the next track when one ends, and pauses after the last", async () => {
    const { audio, store } = setup();
    store.play(A, [A, B]);
    await settle();
    audio.fire("ended");
    await settle();
    expect(store.current()).toEqual(B);
    expect(store.getState().status).toBe("playing");
    audio.fire("ended");
    expect(store.getState()).toMatchObject({ index: 1, status: "paused" });
  });

  it("ignores a slow URL once another track was chosen", async () => {
    const resolvers: Record<string, (url: string) => void> = {};
    const { audio, store } = setup({ loadUrl: (id) => new Promise((resolve) => (resolvers[id] = resolve)) });
    store.play(A, [A, B]);
    store.play(B, [A, B]);
    resolvers.b("https://cdn.test/b.mp3");
    await settle();
    resolvers.a("https://cdn.test/a.mp3");
    await settle();
    expect(audio.src).toBe("https://cdn.test/b.mp3");
    expect(store.current()).toEqual(B);
  });

  it("reports an error when the track has no playable URL, and retries on toggle", async () => {
    let url: string | null = null;
    const { store } = setup({ loadUrl: async () => url });
    store.play(A);
    await settle();
    expect(store.getState().status).toBe("error");
    url = "https://cdn.test/a.mp3";
    store.toggle();
    await settle();
    expect(store.getState().status).toBe("playing");
  });

  it("refreshes an expired URL once and resumes at the same position", async () => {
    const { audio, loadUrl, store } = setup();
    store.play(A);
    await settle();
    audio.currentTime = 61;
    audio.fire("timeupdate");
    audio.fire("error");
    await settle();
    expect(loadUrl).toHaveBeenCalledTimes(2);
    expect(audio.currentTime).toBe(61);
    expect(store.getState().status).toBe("playing");
    audio.fire("error");
    expect(store.getState().status).toBe("error");
  });

  it("seeks within the track and publishes the playback time", async () => {
    const { audio, store } = setup();
    const onTime = vi.fn();
    store.subscribeTime(onTime);
    store.play(A);
    await settle();
    audio.fire("loadedmetadata");
    store.seek(90);
    expect(audio.currentTime).toBe(90);
    expect(store.getTime()).toEqual({ current: 90, duration: 180 });
    store.seek(999);
    expect(audio.currentTime).toBe(180);
    expect(onTime).toHaveBeenCalled();
  });

  it("keeps the time snapshot stable when nothing changed", async () => {
    const { audio, store } = setup();
    store.play(A);
    await settle();
    audio.fire("timeupdate");
    const first = store.getTime();
    audio.fire("timeupdate");
    expect(store.getTime()).toBe(first);
  });

  it("clamps, applies and remembers the volume; changing it unmutes", async () => {
    const { audio, store, values } = setup();
    store.play(A);
    await settle();
    store.toggleMute();
    expect(audio.muted).toBe(true);
    store.setVolume(0.4);
    expect(audio.volume).toBe(0.4);
    expect(store.getState()).toMatchObject({ volume: 0.4, muted: false });
    expect(values.get(VOLUME_KEY)).toBe("0.4");
    store.setVolume(7);
    expect(store.getState().volume).toBe(1);
  });

  it("restores the remembered volume on first play", async () => {
    const { audio, store } = setup({ stored: "0.25" });
    store.play(A);
    await settle();
    expect(audio.volume).toBe(0.25);
    expect(store.getState().volume).toBe(0.25);
  });

  it("close stops playback, unloads the audio and hides the bar", async () => {
    const { audio, store } = setup();
    store.play(A, [A, B]);
    await settle();
    store.close();
    expect(audio.paused).toBe(true);
    expect(audio.src).toBe("");
    expect(store.getState()).toMatchObject({ index: -1, status: "idle", queue: [] });
    expect(store.getTime()).toEqual({ current: 0, duration: 0 });
  });

  it("tells other sound sources when it starts", async () => {
    const { store } = setup();
    const heard = vi.fn();
    const off = onOtherAudioStart("upload-preview", heard);
    const own = vi.fn();
    const offOwn = onOtherAudioStart(PLAYER_SOURCE, own);
    store.play(A);
    await settle();
    expect(heard).toHaveBeenCalledTimes(1);
    expect(own).not.toHaveBeenCalled();
    off();
    offOwn();
    window.dispatchEvent(new CustomEvent(AUDIO_EVENT, { detail: PLAYER_SOURCE }));
    expect(heard).toHaveBeenCalledTimes(1);
  });

  it("closePlayer sends the close event", () => {
    const heard = vi.fn();
    window.addEventListener(PLAYER_CLOSE_EVENT, heard);
    closePlayer();
    window.removeEventListener(PLAYER_CLOSE_EVENT, heard);
    expect(heard).toHaveBeenCalledTimes(1);
  });
});

describe("formatTime", () => {
  it.each([
    [0, "0:00"],
    [9.9, "0:09"],
    [75.4, "1:15"],
    [3725, "1:02:05"],
    [NaN, "0:00"],
    [-3, "0:00"],
  ])("%s → %s", (seconds, text) => {
    expect(formatTime(seconds)).toBe(text);
  });
});
