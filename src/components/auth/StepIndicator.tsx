import { cn } from "@/lib/cn";

/** Figma Step Indicator (4418:64): "Step n of 2" + two slanted 8px bars. */
export function StepIndicator({ step, total = 2 }: { step: number; total?: number }) {
  return (
    <div className="flex items-center gap-4">
      <p className="text-label-strong text-cyan">
        Step {step} of {total}
      </p>
      <div className="flex gap-1.5" aria-hidden>
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={cn("block h-2 w-12 -skew-x-12", i < step ? "bg-cyan" : "bg-border-strong")}
          />
        ))}
      </div>
    </div>
  );
}
