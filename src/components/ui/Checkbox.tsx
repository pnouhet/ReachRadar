import { Check } from "lucide-react";
import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type CheckboxProps = { label: ReactNode; error?: string } & Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

/** Figma Checkbox (4417:70): 20px square, slate outline off, cyan fill + check on. */
export function Checkbox({ label, error, className, id, ...rest }: CheckboxProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <label htmlFor={inputId} className="flex cursor-pointer items-center gap-3 text-body-sm text-soft-white">
        <input id={inputId} type="checkbox" className="peer sr-only" aria-invalid={error ? true : undefined} {...rest} />
        <span
          aria-hidden
          className={cn(
            "flex size-5 shrink-0 items-center justify-center rounded-[2px] border-[1.5px]",
            error ? "border-rose" : "border-border-strong",
            "peer-checked:border-cyan peer-checked:bg-cyan",
            "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-cyan",
            "[&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100",
          )}
        >
          <Check size={14} strokeWidth={3} className="text-midnight" />
        </span>
        <span>{label}</span>
      </label>
      {error && <p className="text-body-sm text-rose">{error}</p>}
    </div>
  );
}
