"use client";

import { useId, useState, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { fieldBoxClass, fieldLabelClass } from "./Input";

type TextareaProps = {
  label: string;
  error?: string;
  helper?: string;
  showCount?: boolean;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({
  label,
  error,
  helper,
  showCount,
  maxLength,
  className,
  id,
  defaultValue,
  onChange,
  ...rest
}: TextareaProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const messageId = `${fieldId}-message`;
  const [length, setLength] = useState(String(defaultValue ?? rest.value ?? "").length);
  const message = error ?? helper;
  return (
    <div className={cn("flex w-full flex-col gap-2.5", className)}>
      <label htmlFor={fieldId} className={fieldLabelClass}>
        {label}
      </label>
      <textarea
        id={fieldId}
        maxLength={maxLength}
        defaultValue={defaultValue}
        aria-invalid={error ? true : undefined}
        aria-describedby={message ? messageId : undefined}
        onChange={(e) => {
          setLength(e.target.value.length);
          onChange?.(e);
        }}
        className={cn(
          fieldBoxClass,
          "min-h-28 resize-y py-3 outline-none placeholder:text-muted",
          error ? "border-rose" : "border-border-strong focus:border-cyan",
        )}
        {...rest}
      />
      <div className="flex justify-between gap-4 text-body-sm">
        <p id={messageId} className={error ? "text-rose" : "text-muted"}>
          {message}
        </p>
        {showCount && maxLength !== undefined && (
          <span className="shrink-0 tabular-nums text-muted">
            {length} / {maxLength}
          </span>
        )}
      </div>
    </div>
  );
}
