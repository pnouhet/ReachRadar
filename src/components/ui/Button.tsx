import Link from "next/link";
import { Loader2, type LucideIcon } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = {
  variant?: ButtonVariant;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  href?: string;
  loading?: boolean;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  // Figma Button (4409:51): 14px slanted cap + 20px padding each side, 48px high.
  primary: "slant px-[34px] [--slant-bg:var(--color-rose)] [--slant-border:var(--color-rose)] hover:brightness-110",
  secondary: "slant px-[34px] [--slant-border:#fff] hover:[--slant-bg:rgb(255_255_255/0.08)]",
  ghost: "px-1 underline-offset-4 hover:underline",
};

/** Parallelogram CTA (-12°). Primary = rose, one per viewport. Secondary = white outline. Ghost = text link. */
export function Button({
  variant = "primary",
  icon: Icon,
  iconPosition = "left",
  href,
  loading = false,
  className,
  children,
  disabled,
  type = "button",
  ...rest
}: ButtonProps) {
  const classes = cn(
    "inline-flex h-12 shrink-0 items-center justify-center gap-3 whitespace-nowrap text-button text-white transition-[filter] duration-200",
    "disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
    VARIANT_CLASS[variant],
    className,
  );
  const iconSize = variant === "secondary" ? 18 : 20;
  const content = (
    <>
      {loading ? (
        <Loader2 size={iconSize} className="animate-spin" aria-hidden />
      ) : (
        Icon && iconPosition === "left" && <Icon size={iconSize} strokeWidth={1.5} aria-hidden />
      )}
      <span>{children}</span>
      {!loading && Icon && iconPosition === "right" && <Icon size={iconSize} strokeWidth={1.5} aria-hidden />}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes} aria-disabled={disabled || undefined}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} disabled={disabled || loading} aria-busy={loading || undefined} {...rest}>
      {content}
    </button>
  );
}
