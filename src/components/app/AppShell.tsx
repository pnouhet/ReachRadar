"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { Role } from "@/lib/nav";
import { AppSidebar } from "./AppSidebar";
import { AppTopBar } from "./AppTopBar";

type AppShellProps = {
  user: { displayName: string; role: Role; avatarUrl: string | null };
  children: ReactNode;
};

/** Top bar 80px + sidebar 264px. Below 1024px the sidebar becomes a drawer opened from the top bar. */
export function AppShell({ user, children }: AppShellProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="min-h-dvh">
      <AppTopBar user={user} menuOpen={open} onToggleMenu={() => setOpen((v) => !v)} />
      <div className="flex">
        {open && (
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="fixed inset-0 top-20 z-20 bg-midnight/80 lg:hidden"
          />
        )}
        <aside
          id="app-sidebar"
          className={cn(
            "fixed top-20 bottom-0 left-0 z-20 w-sidebar overflow-y-auto border-r border-border-subtle bg-surface-1 transition-transform lg:sticky lg:h-[calc(100dvh-80px)] lg:translate-x-0",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <AppSidebar role={user.role} pathname={pathname} onNavigate={() => setOpen(false)} />
        </aside>
        <main className="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:px-12 lg:py-12">{children}</main>
      </div>
    </div>
  );
}
