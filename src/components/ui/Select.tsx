import { ChevronDown } from "lucide-react";
import { useId, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { fieldBoxClass, fieldLabelClass } from "./Input";

type SelectProps = {
  label: string;
  options: readonly string[];
  placeholder?: string;
  error?: string;
  helper?: string;
} & SelectHTMLAttributes<HTMLSelectElement>;

/** Native select styled like the Figma Input (Default / Focus / Error). */
export function Select({ label, options, placeholder = "Choose…", error, helper, className, id, ...rest }: SelectProps) {
  const autoId = useId();
  const selectId = id ?? autoId;
  const messageId = `${selectId}-message`;
  const message = error ?? helper;
  return (
    <div className={cn("flex w-full flex-col gap-2.5", className)}>
      <label htmlFor={selectId} className={fieldLabelClass}>
        {label}
      </label>
      <div className={cn(fieldBoxClass, "relative h-12 px-0", error ? "border-rose" : "border-border-strong focus-within:border-cyan")}>
        <select
          id={selectId}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          className="h-full w-full cursor-pointer appearance-none bg-transparent pr-10 pl-4 outline-none [&>option]:bg-surface-1"
          {...rest}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown size={18} strokeWidth={1.5} className="pointer-events-none absolute right-4 text-cyan" aria-hidden />
      </div>
      {message && (
        <p id={messageId} className={cn("text-body-sm", error ? "text-rose" : "text-muted")}>
          {message}
        </p>
      )}
    </div>
  );
}
