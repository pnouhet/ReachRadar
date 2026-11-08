import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

type NavItemProps = { href: string; label: string; icon: LucideIcon; active: boolean; badge?: string; onNavigate?: () => void };

/** Figma Nav Item (4425:82): default = plain row; active = surface-3 parallelogram with a 1px rose outline. */
export function NavItem({ href, label, icon: Icon, active, badge, onNavigate }: NavItemProps) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex h-12 w-full items-center gap-3.5 pr-3 pl-4 text-body-md transition-colors",
        active
          ? "slant pl-[30px] pr-[30px] font-semibold text-white [--slant-bg:var(--color-surface-3)] [--slant-border:var(--color-rose)] [--slant-border-width:1px]"
          : "text-soft-white hover:text-white",
      )}
    >
      <Icon size={20} strokeWidth={1.5} className={active ? "text-white" : "text-slate"} aria-hidden />
      <span className="flex-1 truncate">{label}</span>
      {badge && (
        <span className="inline-flex h-5 items-center rounded-[2px] bg-cyan px-1.5 text-label-strong text-midnight">{badge}</span>
      )}
    </Link>
  );
}
