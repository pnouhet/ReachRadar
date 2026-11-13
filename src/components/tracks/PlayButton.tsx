"use client";

import { Loader2, Pause, Play } from "lucide-react";
import { usePlayer, usePlayerState, useTrackQueue } from "@/components/player/PlayerProvider";
import { cn } from "@/lib/cn";

type PlayButtonProps = {
  trackId: string;
  title: string;
  artist?: string | null;
  coverUrl?: string | null;
  size?: number;
  className?: string;
};

/**
 * Rose slanted 56px play square (Track Card). Hands the track to the site-wide player, which keeps
 * playing across pages; inside a <TrackQueue> the whole list is queued for Previous / Next.
 */
export function PlayButton({ trackId, title, artist = null, coverUrl = null, size = 56, className }: PlayButtonProps) {
  const player = usePlayer();
  const { queue, index, status } = usePlayerState();
  const list = useTrackQueue();
  const isCurrent = index >= 0 && queue[index]?.id === trackId;
  const state = isCurrent ? status : "idle";

  function toggle() {
    if (isCurrent) return player.toggle();
    player.play({ id: trackId, title, artist, coverUrl }, list ?? undefined);
  }

  const Icon = state === "loading" ? Loader2 : state === "playing" ? Pause : Play;
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={state === "playing" ? `Pause ${title}` : `Play ${title}`}
      data-state={state}
      className={cn(
        "slant flex items-center justify-center text-white [--slant-bg:var(--color-rose)] [--slant-border:var(--color-rose)] hover:brightness-110",
        className,
      )}
      style={{ width: size, height: size, ["--slant-h" as string]: `${size}px` }}
    >
      <Icon size={22} strokeWidth={1.75} className={state === "loading" ? "animate-spin" : undefined} aria-hidden />
    </button>
  );
}
