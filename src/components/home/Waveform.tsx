"use client";

import Image from "next/image";
import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

/** Player waveform: the play button toggles a GSAP "dance" of the bars (skipped with reduced motion). */
export function Waveform({
  heights,
  played,
  playIcon,
  label,
}: {
  heights: readonly number[];
  played: number;
  playIcon: string;
  /** Accessible name of the play button. */
  label: string;
}) {
  const [playing, setPlaying] = useState(false);
  const barsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bars = barsRef.current?.children;
    if (!playing || !bars?.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const dance = gsap.to(bars, {
      scaleY: () => gsap.utils.random(0.35, 1.25),
      duration: 0.28,
      ease: "sine.inOut",
      stagger: { each: 0.01, repeat: -1, yoyo: true },
    });
    return () => {
      dance.kill();
      gsap.to(bars, { scaleY: 1, duration: 0.3 });
    };
  }, [playing]);

  return (
    <div className="flex h-14 items-center gap-[3px]">
      <button
        data-anim="play"
        type="button"
        aria-label={label}
        aria-pressed={playing}
        onClick={() => setPlaying((p) => !p)}
        className="size-14 flex-none transition-[scale] duration-200 hover:scale-[1.06]"
      >
        <Image src={playIcon} width={56} height={56} alt="" unoptimized />
      </button>
      <div
        ref={barsRef}
        aria-hidden
        className="flex h-14 min-w-0 flex-1 items-center gap-[3px] max-[560px]:gap-[2px]"
      >
        {heights.map((h, i) => (
          <span
            key={i}
            data-anim="bar"
            style={{ height: h }}
            className={cn(
              "min-w-px flex-[1_1_0] origin-center",
              i < played ? "bg-cyan" : "bg-muted opacity-45",
            )}
          />
        ))}
      </div>
    </div>
  );
}
