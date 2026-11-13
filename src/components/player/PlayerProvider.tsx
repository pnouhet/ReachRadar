"use client";

import { createContext, useContext, useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import {
  createPlayerStore,
  INITIAL_STATE,
  onOtherAudioStart,
  PLAYER_CLOSE_EVENT,
  PLAYER_SOURCE,
  type PlayerState,
  type PlayerStore,
  type PlayerTime,
  type PlayerTrack,
} from "@/lib/player/store";
import { getTrackAudioUrl } from "@/lib/tracks/actions";

const PlayerContext = createContext<PlayerStore | null>(null);
const QueueContext = createContext<PlayerTrack[] | null>(null);

const SERVER_TIME: PlayerTime = { current: 0, duration: 0 };

// Only called in the browser (on first play / volume change). Storage can throw in private mode.
const volumeStorage = {
  getItem: (key: string) => {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string) => {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // Not persisted; the volume still applies for this visit.
    }
  },
};

/**
 * Owns the one audio element of the site. Mounted in the root layout, which never remounts on
 * navigation, so playback carries on from page to page.
 */
export function PlayerProvider({ children }: { children: ReactNode }) {
  const [store] = useState(() =>
    createPlayerStore({ createAudio: () => new Audio(), loadUrl: getTrackAudioUrl, storage: volumeStorage }),
  );

  useEffect(() => {
    // Another sound source on the page (the upload preview) started: give it the floor.
    const off = onOtherAudioStart(PLAYER_SOURCE, store.pause);
    // Sign-out: stop the private audio and hide the bar.
    window.addEventListener(PLAYER_CLOSE_EVENT, store.close);
    return () => {
      off();
      window.removeEventListener(PLAYER_CLOSE_EVENT, store.close);
    };
  }, [store]);

  // Lock-screen / media-key controls.
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    const session = navigator.mediaSession;
    const sync = () => {
      const track = store.current();
      const { status, index, queue } = store.getState();
      session.metadata = track
        ? new MediaMetadata({
            title: track.title,
            artist: track.artist ?? undefined,
            artwork: track.coverUrl ? [{ src: track.coverUrl }] : undefined,
          })
        : null;
      session.playbackState = !track ? "none" : status === "playing" ? "playing" : "paused";
      session.setActionHandler("play", track ? store.toggle : null);
      session.setActionHandler("pause", track ? store.toggle : null);
      session.setActionHandler("previoustrack", track ? store.prev : null);
      session.setActionHandler("nexttrack", track && index < queue.length - 1 ? store.next : null);
    };
    sync();
    return store.subscribe(sync);
  }, [store]);

  return <PlayerContext.Provider value={store}>{children}</PlayerContext.Provider>;
}

/** Player actions (play, toggle, next, prev, seek, setVolume, toggleMute, close). */
export function usePlayer(): PlayerStore {
  const store = useContext(PlayerContext);
  if (!store) throw new Error("usePlayer must be used inside <PlayerProvider>");
  return store;
}

/** Queue, current index, status and volume. Does not re-render on playback time. */
export function usePlayerState(): PlayerState {
  const store = usePlayer();
  return useSyncExternalStore(store.subscribe, store.getState, () => INITIAL_STATE);
}

/** Playback position; re-renders several times a second while playing. */
export function usePlayerTime(): PlayerTime {
  const store = usePlayer();
  return useSyncExternalStore(store.subscribeTime, store.getTime, () => SERVER_TIME);
}

/** Wrap a list of tracks so its play buttons queue the whole list for Previous / Next. */
export function TrackQueue({ tracks, children }: { tracks: PlayerTrack[]; children: ReactNode }) {
  return <QueueContext.Provider value={tracks}>{children}</QueueContext.Provider>;
}

export function useTrackQueue(): PlayerTrack[] | null {
  return useContext(QueueContext);
}
