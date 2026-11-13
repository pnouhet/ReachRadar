/**
 * Global audio player store. Framework-free so it can be unit-tested with a fake audio element:
 * one <audio>, a queue, and two snapshots (state and playback time) for useSyncExternalStore.
 */

export type PlayerTrack = { id: string; title: string; artist: string | null; coverUrl: string | null };
export type PlayerStatus = "idle" | "loading" | "playing" | "paused" | "error";
export type PlayerState = {
  queue: PlayerTrack[];
  /** Position in `queue`; -1 when nothing is loaded (the bar is hidden). */
  index: number;
  status: PlayerStatus;
  /** 0..1 */
  volume: number;
  muted: boolean;
};
export type PlayerTime = { current: number; duration: number };

/** The subset of HTMLAudioElement the store drives. */
export type AudioLike = Pick<
  HTMLAudioElement,
  "play" | "pause" | "load" | "addEventListener" | "removeAttribute" | "currentTime" | "duration" | "volume" | "muted" | "paused" | "src"
>;

export type PlayerDeps = {
  createAudio: () => AudioLike;
  /** Resolves a playable URL for a track, or null when it can't be played. */
  loadUrl: (trackId: string) => Promise<string | null>;
  storage?: Pick<Storage, "getItem" | "setItem"> | null;
};

export const VOLUME_KEY = "rr_player_volume";
/** "Previous" restarts the track once it has played this long (seconds). */
export const RESTART_AFTER = 3;
/** Sent on window when a sound source starts, so the others pause. detail = source name. */
export const AUDIO_EVENT = "rr-audio-start";
export const PLAYER_SOURCE = "player";
/** Sent on window to stop the player and hide the bar (sign-out). */
export const PLAYER_CLOSE_EVENT = "rr-player-close";

/** Tells every other sound source on the page that `source` is starting. */
export function announceAudioStart(source: string) {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent(AUDIO_EVENT, { detail: source }));
}

/** Calls `fn` when a source other than `source` starts playing. Returns the unsubscribe. */
export function onOtherAudioStart(source: string, fn: () => void): () => void {
  const listener = (e: Event) => {
    if ((e as CustomEvent<string>).detail !== source) fn();
  };
  window.addEventListener(AUDIO_EVENT, listener);
  return () => window.removeEventListener(AUDIO_EVENT, listener);
}

/** Stops the site player from anywhere, without needing its context. */
export function closePlayer() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(PLAYER_CLOSE_EVENT));
}

export const INITIAL_STATE: PlayerState = { queue: [], index: -1, status: "idle", volume: 1, muted: false };
const ZERO_TIME: PlayerTime = { current: 0, duration: 0 };

const clamp01 = (n: number) => Math.min(1, Math.max(0, Number.isFinite(n) ? n : 0));
const finite = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);

export type PlayerStore = ReturnType<typeof createPlayerStore>;

export function createPlayerStore({ createAudio, loadUrl, storage = null }: PlayerDeps) {
  let state = INITIAL_STATE;
  let time = ZERO_TIME;
  let audio: AudioLike | null = null;
  /** Bumped on every load so a slow URL request for a skipped track is ignored. */
  let loadToken = 0;
  /** Id of the track whose signed URL was already refreshed once after a media error. */
  let retried: string | null = null;
  const stateSubs = new Set<() => void>();
  const timeSubs = new Set<() => void>();

  const setState = (patch: Partial<PlayerState>) => {
    state = { ...state, ...patch };
    stateSubs.forEach((fn) => fn());
  };
  const setTime = (next: PlayerTime) => {
    if (next.current === time.current && next.duration === time.duration) return;
    time = next;
    timeSubs.forEach((fn) => fn());
  };
  const readTime = () => {
    if (audio) setTime({ current: finite(audio.currentTime), duration: finite(audio.duration) });
  };
  const current = () => (state.index >= 0 ? (state.queue[state.index] ?? null) : null);

  function ensureAudio(): AudioLike {
    if (audio) return audio;
    const el = createAudio();
    const stored = storage?.getItem(VOLUME_KEY);
    const volume = stored == null ? state.volume : clamp01(Number(stored));
    el.volume = volume;
    el.muted = state.muted;
    if (volume !== state.volume) setState({ volume });

    el.addEventListener("playing", () => setState({ status: "playing" }));
    el.addEventListener("pause", () => {
      // `pause` also fires while a new source loads and at the end of a track.
      if (state.status === "playing") setState({ status: "paused" });
    });
    el.addEventListener("waiting", () => {
      if (state.status === "playing") setState({ status: "loading" });
    });
    el.addEventListener("timeupdate", readTime);
    el.addEventListener("durationchange", readTime);
    el.addEventListener("loadedmetadata", readTime);
    el.addEventListener("ended", () => {
      if (state.index < state.queue.length - 1) void load(state.index + 1);
      else setState({ status: "paused" });
    });
    el.addEventListener("error", () => {
      const track = current();
      if (!track || state.status === "idle") return;
      // The signed URL expires after an hour: refresh it once and resume where we were.
      if (retried !== track.id) {
        retried = track.id;
        void load(state.index, time.current);
      } else setState({ status: "error" });
    });
    audio = el;
    return el;
  }

  async function load(index: number, resumeAt = 0) {
    const track = state.queue[index];
    if (!track) return;
    const el = ensureAudio();
    const token = ++loadToken;
    el.pause();
    setState({ index, status: "loading" });
    setTime({ current: resumeAt, duration: 0 });
    const url = await loadUrl(track.id).catch(() => null);
    if (token !== loadToken) return;
    if (!url) return setState({ status: "error" });
    el.src = url;
    if (resumeAt > 0) el.currentTime = resumeAt;
    notifyOthers();
    await el.play().catch(() => {
      if (token === loadToken) setState({ status: "error" });
    });
  }

  const notifyOthers = () => announceAudioStart(PLAYER_SOURCE);

  return {
    getState: () => state,
    getTime: () => time,
    subscribe(fn: () => void) {
      stateSubs.add(fn);
      return () => void stateSubs.delete(fn);
    },
    subscribeTime(fn: () => void) {
      timeSubs.add(fn);
      return () => void timeSubs.delete(fn);
    },
    current,

    /** Starts `track`. `queue` is what Previous / Next walk through (defaults to the track alone). */
    play(track: PlayerTrack, queue: PlayerTrack[] = [track]) {
      const list = queue.some((t) => t.id === track.id) ? queue : [track];
      retried = null;
      state = { ...state, queue: list };
      void load(list.findIndex((t) => t.id === track.id));
    },
    toggle() {
      const track = current();
      if (!track || !audio) return;
      if (state.status === "error") {
        retried = null;
        return void load(state.index);
      }
      if (audio.paused) {
        notifyOthers();
        void audio.play().catch(() => setState({ status: "error" }));
      } else audio.pause();
    },
    next() {
      if (state.index < 0 || state.index >= state.queue.length - 1) return;
      retried = null;
      void load(state.index + 1);
    },
    /** Restarts the track; goes to the previous one when pressed in its first seconds. */
    prev() {
      if (state.index < 0 || !audio) return;
      if (state.index === 0 || time.current > RESTART_AFTER) {
        audio.currentTime = 0;
        readTime();
        return;
      }
      retried = null;
      void load(state.index - 1);
    },
    seek(seconds: number) {
      if (!audio || state.index < 0) return;
      audio.currentTime = Math.min(Math.max(0, seconds), time.duration || seconds);
      readTime();
    },
    setVolume(value: number) {
      const volume = clamp01(value);
      const el = ensureAudio();
      el.volume = volume;
      el.muted = false;
      try {
        storage?.setItem(VOLUME_KEY, String(volume));
      } catch {
        // Storage can be unavailable (private mode); the volume still applies for this visit.
      }
      setState({ volume, muted: false });
    },
    toggleMute() {
      const el = ensureAudio();
      el.muted = !state.muted;
      setState({ muted: !state.muted });
    },
    /** Pauses without unloading: another sound source on the page took over. */
    pause() {
      audio?.pause();
    },
    /** Stops playback and hides the bar. */
    close() {
      loadToken++;
      if (audio) {
        audio.pause();
        audio.removeAttribute("src");
        audio.load();
      }
      state = { ...state, queue: [], index: -1, status: "idle" };
      stateSubs.forEach((fn) => fn());
      setTime(ZERO_TIME);
    },
  };
}

/** 75.4 → "1:15"; 3725 → "1:02:05". */
export function formatTime(seconds: number): string {
  const total = Math.floor(finite(seconds));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = String(total % 60).padStart(2, "0");
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${s}` : `${m}:${s}`;
}
