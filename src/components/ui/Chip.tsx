import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type ChipProps = { active?: boolean; onClick?: () => void; className?: string; children: ReactNode };

/** Figma Chip (4410:9): 34px parallelogram, slate outline by default, cyan fill when active. */
export function Chip({ active = false, onClick, className, children }: ChipProps) {
  const classes = cn(
    "slant inline-flex h-[34px] items-center px-[30px] whitespace-nowrap text-label-strong text-white [--slant-h:34px]",
    active
      ? "[--slant-bg:var(--color-cyan)] [--slant-border:var(--color-cyan)]"
      : "[--slant-border:var(--color-border-strong)]",
    onClick && !active && "hover:[--slant-border:var(--color-slate)]",
    className,
  );
  if (onClick) {
    return (
      <button type="button" className={classes} aria-pressed={active} onClick={onClick}>
        {children}
      </button>
    );
  }
  return <span className={classes}>{children}</span>;
}
