import { cn } from "@/lib/cn";

/** 150-bar waveform: played part cyan, rest slate (17a). Falls back to a flat line when peaks are unknown. */
export function Waveform({ peaks, progress = 0, className }: { peaks: number[] | null; progress?: number; className?: string }) {
  const bars = peaks && peaks.length ? peaks : new Array(150).fill(0.08);
  const played = Math.round(bars.length * Math.min(1, Math.max(0, progress)));
  return (
    <div aria-hidden className={cn("flex h-8 min-w-0 flex-1 items-center gap-[2px]", className)}>
      {bars.map((p, i) => (
        <span
          key={i}
          className={cn("min-w-px flex-1", i < played ? "bg-cyan" : "bg-slate")}
          style={{ height: `${Math.max(8, Math.round(p * 100))}%` }}
        />
      ))}
    </div>
  );
}
