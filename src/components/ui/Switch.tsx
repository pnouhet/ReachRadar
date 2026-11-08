"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";

type SwitchProps = {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  hideLabel?: boolean;
  name?: string;
};

/** Square switch (09b / 16c): on = cyan fill + dark knob right, off = slate outline + knob left. Radius 2, never a pill. */
export function Switch({ checked, onChange, label, hideLabel = false, name }: SwitchProps) {
  const labelId = useId();
  return (
    <span className="inline-flex items-center gap-3 text-body-md text-soft-white">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={hideLabel ? undefined : labelId}
        aria-label={hideLabel ? label : undefined}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-[2px] border-[1.5px] transition-colors",
          checked ? "border-cyan bg-cyan" : "border-slate bg-transparent",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "absolute top-1/2 size-4 -translate-y-1/2 rounded-[1px] transition-[left]",
            checked ? "left-[22px] bg-midnight" : "left-[3px] bg-slate",
          )}
        />
      </button>
      {name && <input type="hidden" name={name} value={checked ? "on" : ""} />}
      {!hideLabel && <span id={labelId}>{label}</span>}
    </span>
  );
}
