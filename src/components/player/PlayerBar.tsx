"use client";

import { Loader2, Music, Pause, Play, SkipBack, SkipForward, Volume2, VolumeX, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { formatTime } from "@/lib/player/store";
import { usePlayer, usePlayerState, usePlayerTime } from "./PlayerProvider";

const ICON_BUTTON =
  "flex size-11 shrink-0 items-center justify-center text-soft-white transition-colors hover:text-white disabled:pointer-events-none disabled:text-muted/50";

/** `--range-pct` paints the filled part of an .rr-range track (WebKit has no ::-moz-range-progress). */
const fill = (value: number, max: number) => ({ "--range-pct": `${max > 0 ? Math.min(100, (value / max) * 100) : 0}%` }) as CSSProperties;

/**
 * Slim dock: a 72px bar fixed to the bottom of every page once a track has been started.
 * Track on the left, transport in the centre, time and volume on the right; the seek line runs along its top edge.
 */
export function PlayerBar() {
  const player = usePlayer();
  const { queue, index, status, volume, muted } = usePlayerState();
  const track = index >= 0 ? (queue[index] ?? null) : null;
  const visible = track !== null;
  const ref = useRef<HTMLElement>(null);

  // Publish the bar height so pages pad themselves and nothing hides behind it.
  useEffect(() => {
    const el = ref.current;
    const root = document.documentElement;
    if (!visible || !el) return;
    const write = () => root.style.setProperty("--player-h", `${el.offsetHeight}px`);
    write();
    const ro = new ResizeObserver(write);
    ro.observe(el);
    return () => {
      ro.disconnect();
      root.style.removeProperty("--player-h");
    };
  }, [visible]);

  if (!track) return null;

  const playing = status === "playing";
  const loading = status === "loading";
  const PlayIcon = loading ? Loader2 : playing ? Pause : Play;
  const silent = muted || volume === 0;

  return (
    <section
      ref={ref}
      aria-label="Audio player"
      data-print-hide
      data-state={status}
      className="fixed inset-x-0 bottom-[var(--consent-h,0px)] z-40 border-t border-border-subtle bg-surface-1 pb-[env(safe-area-inset-bottom)]"
    >
      <SeekBar />
      <p aria-live="polite" className="sr-only">
        {status === "error" ? `Couldn't load ${track.title}` : `Now playing: ${track.title}`}
      </p>
      <div className="grid h-[72px] grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2 px-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:gap-4 sm:px-4 lg:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xs bg-linear-to-br from-cyan via-surface-3 to-midnight">
            {track.coverUrl ? (
              <Image src={track.coverUrl} alt="" fill sizes="44px" className="object-cover" />
            ) : (
              <Music size={18} strokeWidth={1.5} className="text-soft-white" aria-hidden />
            )}
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="truncate font-display text-[14px] leading-5 font-bold uppercase" title={track.title}>
              {track.title}
            </span>
            {status === "error" ? (
              <span className="truncate text-body-sm text-rose">Couldn&apos;t load this track. Press play to retry.</span>
            ) : (
              track.artist && <span className="truncate text-body-sm text-muted">{track.artist}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <button type="button" onClick={player.prev} aria-label="Previous track" className={ICON_BUTTON}>
            <SkipBack size={20} strokeWidth={1.75} aria-hidden />
          </button>
          <button
            type="button"
            onClick={player.toggle}
            aria-label={playing || loading ? "Pause" : "Play"}
            className="slant flex size-11 shrink-0 items-center justify-center text-white [--slant-bg:var(--color-rose)] [--slant-border:var(--color-rose)] [--slant-h:44px] hover:brightness-110"
          >
            <PlayIcon size={20} strokeWidth={1.75} className={loading ? "animate-spin" : undefined} aria-hidden />
          </button>
          <button
            type="button"
            onClick={player.next}
            disabled={index >= queue.length - 1}
            aria-label="Next track"
            className={ICON_BUTTON}
          >
            <SkipForward size={20} strokeWidth={1.75} aria-hidden />
          </button>
        </div>

        <div className="flex items-center justify-end sm:gap-1">
          <TimeLabel />
          <button
            type="button"
            onClick={player.toggleMute}
            aria-label={silent ? "Unmute" : "Mute"}
            aria-pressed={muted}
            className={cn(ICON_BUTTON, "text-muted max-sm:hidden")}
          >
            {silent ? <VolumeX size={20} strokeWidth={1.75} aria-hidden /> : <Volume2 size={20} strokeWidth={1.75} aria-hidden />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={muted ? 0 : volume}
            onChange={(e) => player.setVolume(Number(e.target.value))}
            aria-label="Volume"
            aria-valuetext={`${Math.round((muted ? 0 : volume) * 100)}%`}
            className="rr-range w-20 max-sm:hidden lg:w-24"
            style={fill(muted ? 0 : volume, 1)}
          />
          <button type="button" onClick={player.close} aria-label="Close player" className={cn(ICON_BUTTON, "text-muted sm:ml-2")}>
            <X size={20} strokeWidth={1.75} aria-hidden />
          </button>
        </div>
      </div>
    </section>
  );
}

/** Seek line on the top edge of the bar. Its own component: it re-renders with the playback time. */
function SeekBar() {
  const player = usePlayer();
  const { current, duration } = usePlayerTime();
  return (
    <input
      type="range"
      min={0}
      max={duration || 1}
      step={0.1}
      value={Math.min(current, duration || 1)}
      disabled={duration === 0}
      onChange={(e) => player.seek(Number(e.target.value))}
      aria-label="Seek"
      aria-valuetext={`${formatTime(current)} of ${formatTime(duration)}`}
      className="rr-range rr-range-seek absolute inset-x-0 -top-[10px] w-full [--range-fill:var(--color-rose)]"
      style={fill(current, duration)}
    />
  );
}

function TimeLabel() {
  const { current, duration } = usePlayerTime();
  return (
    <span className="mr-2 text-body-sm whitespace-nowrap text-muted tabular-nums max-md:hidden">
      {formatTime(current)} / {formatTime(duration)}
    </span>
  );
}
