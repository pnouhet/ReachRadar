"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const TABS = [
  { href: "/settings/profile", label: "Profile" },
  { href: "/settings/account", label: "Account" },
  { href: "/settings/notifications", label: "Notifications" },
  { href: "/settings/privacy", label: "Privacy & data" },
  { href: "/settings/billing", label: "Billing" },
];

/** 16 — 260px sub-nav. Active tab: surface-1 with a 1px rose outline (Figma 4543:6131). */
export function SettingsSubNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Settings" className="-mx-4 flex gap-1 overflow-x-auto px-4 lg:mx-0 lg:w-[260px] lg:shrink-0 lg:flex-col lg:px-0">
      {TABS.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "border px-4 py-3 text-body-md whitespace-nowrap transition-colors",
              active ? "border-rose bg-surface-1 text-white" : "border-transparent text-soft-white hover:text-white",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
