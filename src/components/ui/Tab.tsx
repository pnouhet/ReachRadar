import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type TabProps = { active: boolean; href?: string; count?: number; onClick?: () => void; children: ReactNode };

/** Figma Tab (4409:59): uppercase Inter bold, active = white + 2px rose underline. */
export function Tab({ active, href, count, onClick, children }: TabProps) {
  const classes = cn(
    "inline-flex items-center gap-2 border-b-2 p-3 whitespace-nowrap text-tab uppercase transition-colors",
    active ? "border-rose text-white" : "border-transparent text-muted hover:text-soft-white",
  );
  const label = (
    <>
      {children}
      {count !== undefined && <span className="text-muted">· {count}</span>}
    </>
  );
  if (href) {
    return (
      <Link href={href} className={classes} aria-current={active ? "page" : undefined}>
        {label}
      </Link>
    );
  }
  return (
    <button type="button" role="tab" aria-selected={active} className={classes} onClick={onClick}>
      {label}
    </button>
  );
}
