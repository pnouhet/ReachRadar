import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type InputProps = {
  label: string;
  error?: string;
  helper?: string;
  trailing?: ReactNode;
} & InputHTMLAttributes<HTMLInputElement>;

export const fieldLabelClass = "text-label uppercase text-soft-white";
export const fieldBoxClass =
  "flex w-full items-center gap-3 rounded-[2px] border bg-surface-1 px-4 text-body-md text-white transition-colors";

/** Figma Input (4410:40): Default / Focus (cyan) / Error (rose), optional trailing action. */
export function Input({ label, error, helper, trailing, className, id, ...rest }: InputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const messageId = `${inputId}-message`;
  const message = error ?? helper;
  return (
    <div className={cn("flex w-full flex-col gap-2.5", className)}>
      <label htmlFor={inputId} className={fieldLabelClass}>
        {label}
      </label>
      <div className={cn(fieldBoxClass, "h-12", error ? "border-rose" : "border-border-strong focus-within:border-cyan")}>
        <input
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted"
          {...rest}
        />
        {trailing}
      </div>
      {message && (
        <p id={messageId} className={cn("text-body-sm", error ? "text-rose" : "text-muted")}>
          {message}
        </p>
      )}
    </div>
  );
}
