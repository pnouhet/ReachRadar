"use client";

import { Loader2, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { getTrackAudioUrl } from "@/lib/tracks/actions";

let current: HTMLAudioElement | null = null;

/** Rose slanted 56px play square (Track Card). Fetches a signed URL for the private audio on first play. */
export function PlayButton({ trackId, title, size = 56, className }: { trackId: string; title: string; size?: number; className?: string }) {
  const audio = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "playing" | "error">("idle");

  useEffect(() => () => audio.current?.pause(), []);

  async function toggle() {
    if (state === "playing") {
      audio.current?.pause();
      return;
    }
    if (!audio.current) {
      setState("loading");
      const url = await getTrackAudioUrl(trackId);
      if (!url) return setState("error");
      const el = new Audio(url);
      el.addEventListener("pause", () => setState("idle"));
      el.addEventListener("ended", () => setState("idle"));
      el.addEventListener("playing", () => setState("playing"));
      audio.current = el;
    }
    if (current && current !== audio.current) current.pause();
    current = audio.current;
    await audio.current.play().catch(() => setState("error"));
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
