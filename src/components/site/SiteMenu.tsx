"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Wordmark } from "@/components/ui/Wordmark";
import { LEGAL_DOCS } from "@/lib/site";

type SiteMenuProps = { open: boolean; onClose: () => void; signedIn: boolean };

const PRIMARY = [
  { label: "Home", href: "/" },
  { label: "Pricing", href: "/pricing" },
  { label: "Catalogue", href: "/catalogue" },
];

/** Full-height navigation panel. Esc and the close button dismiss it; the header returns focus to its menu button. */
export function SiteMenu({ open, onClose, signedIn }: SiteMenuProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  if (!open) return null;

  const account = signedIn
    ? [{ label: "Dashboard", href: "/dashboard" }]
    : [
        { label: "Log in", href: "/login" },
        { label: "Sign up", href: "/signup" },
      ];

  return (
    <div role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-midnight">
      <div className="flex items-center justify-between px-6 py-5 lg:px-10 lg:py-8">
        <Wordmark width={220} className="h-auto w-[160px] sm:w-[220px]" />
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="flex size-10 items-center justify-center text-white hover:text-cyan focus-visible:outline-2 focus-visible:outline-cyan"
        >
          <X size={28} strokeWidth={1.5} aria-hidden />
        </button>
      </div>
      <nav aria-label="Site" className="flex flex-1 flex-col gap-12 px-6 pt-8 pb-16 lg:flex-row lg:gap-32 lg:px-10">
        <ul className="flex flex-col gap-4">
          {[...PRIMARY, ...account].map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                onClick={onClose}
                className="font-display text-[clamp(32px,6vw,56px)] leading-[1.1] font-extrabold uppercase hover:text-cyan"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-4">
          <p className="text-label-strong text-muted">Legal</p>
          <ul className="flex flex-col gap-3">
            {LEGAL_DOCS.map((d) => (
              <li key={d.slug}>
                <Link
                  href={`/legal/${d.slug}`}
                  onClick={onClose}
                  prefetch={false}
                  className="text-body-lg text-soft-white hover:text-white"
                >
                  {d.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
}
