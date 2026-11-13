import { cn } from "@/lib/cn";

type StatProps = { value: string; label: string; accent?: "rose" | "white"; align?: "center" | "start" };

/**
 * Figma Stat (4410:22): Metric/Large value over a bold uppercase caption.
 * Typography matches the homepage 01 stats strip (src/components/home/Intro.tsx).
 */
export function Stat({ value, label, accent = "rose", align = "center" }: StatProps) {
  return (
    <div className={cn("flex flex-col gap-[25px]", align === "center" ? "items-center text-center" : "items-start")}>
      <p className={cn("text-metric-lg lining-nums proportional-nums", accent === "rose" ? "text-rose" : "text-white")}>{value}</p>
      <p className="text-[15px] leading-6 font-bold uppercase text-soft-white">{label}</p>
    </div>
  );
}
