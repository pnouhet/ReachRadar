import { CircleAlert, CircleCheck } from "lucide-react";
import { cn } from "@/lib/cn";

/** Inline form-level message: rose for errors, green for success. No shadows, radius 2. */
export function FormMessage({ tone, children }: { tone: "error" | "success"; children: React.ReactNode }) {
  const Icon = tone === "error" ? CircleAlert : CircleCheck;
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-3 rounded-[2px] border px-4 py-3 text-body-sm",
        tone === "error" ? "border-rose/60 bg-rose/8 text-soft-white" : "border-success/60 bg-success/8 text-soft-white",
      )}
    >
      <Icon size={20} strokeWidth={1.5} className={tone === "error" ? "text-rose" : "text-success"} aria-hidden />
      <div className="flex-1">{children}</div>
    </div>
  );
}
