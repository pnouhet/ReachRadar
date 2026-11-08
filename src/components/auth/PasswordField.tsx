"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/cn";
import { passwordStrength, STRENGTH_LABEL } from "@/lib/password-strength";

type PasswordFieldProps = {
  label?: string;
  name?: string;
  helper?: string;
  error?: string;
  showStrength?: boolean;
  autoComplete?: "current-password" | "new-password";
};

/** Password input with Show/Hide and an optional 4-segment strength meter (02b). */
export function PasswordField({
  label = "Password",
  name = "password",
  helper,
  error,
  showStrength = false,
  autoComplete = "current-password",
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState("");
  const score = passwordStrength(value);

  return (
    <div className="flex w-full flex-col gap-3">
      <Input
        label={label}
        name={name}
        type={visible ? "text" : "password"}
        autoComplete={autoComplete}
        required
        helper={helper}
        error={error}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        trailing={
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="text-label-strong text-cyan"
            aria-label={visible ? "Hide password" : "Show password"}
          >
            {visible ? "Hide" : "Show"}
          </button>
        }
      />
      {showStrength && value && (
        <div className="flex items-center gap-3" aria-live="polite">
          <div className="flex flex-1 gap-1" aria-hidden>
            {[1, 2, 3, 4].map((i) => (
              <span key={i} className={cn("h-1 flex-1", i <= score ? "bg-success" : "bg-border-strong")} />
            ))}
          </div>
          <span className="text-label-strong text-success">{STRENGTH_LABEL[score]}</span>
        </div>
      )}
    </div>
  );
}
