import { cn } from "@/lib/cn";

type StatProps = { value: string; label: string; accent?: "rose" | "white"; align?: "center" | "start" };

/** Figma Stat (4410:22): Metric/Large value over an uppercase Label/Default caption. */
export function Stat({ value, label, accent = "rose", align = "center" }: StatProps) {
  return (
    <div className={cn("flex flex-col gap-4", align === "center" ? "items-center text-center" : "items-start")}>
      <p className={cn("text-metric-lg tabular-nums", accent === "rose" ? "text-rose" : "text-white")}>{value}</p>
      <p className="text-label uppercase text-soft-white">{label}</p>
    </div>
  );
}
