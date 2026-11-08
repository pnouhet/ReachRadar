"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, type KeyboardEvent } from "react";
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
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Leave the modal state before the caller moves focus back to the menu button.
  const dismiss = useCallback(() => {
    dialogRef.current?.close();
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    // Modal dialog: the rest of the page becomes inert (Esc fires `cancel`).
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    closeRef.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Keep Tab inside the dialog: wrap from the last control to the first and back.
  const trapTab = (e: KeyboardEvent<HTMLDialogElement>) => {
    if (e.key !== "Tab") return;
    const items =
      e.currentTarget.querySelectorAll<HTMLElement>("a[href], button");
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && active === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  };

  if (!open) return null;

  const account = signedIn
    ? [{ label: "Dashboard", href: "/dashboard" }]
    : [
        { label: "Log in", href: "/login" },
        { label: "Sign up", href: "/signup" },
      ];

  return (
    <dialog
      ref={dialogRef}
      aria-label="Menu"
      onCancel={(e) => {
        e.preventDefault();
        dismiss();
      }}
      onKeyDown={trapTab}
      className="fixed inset-0 z-[60] m-0 flex h-full max-h-none w-full max-w-none flex-col overflow-y-auto border-0 bg-midnight p-0 text-white"
    >
      <div className="flex items-center justify-between px-6 py-5 lg:px-10 lg:py-8">
        <Wordmark width={220} className="h-auto w-[160px] sm:w-[220px]" />
        <button
          ref={closeRef}
          type="button"
          onClick={dismiss}
          aria-label="Close menu"
          className="flex size-10 items-center justify-center text-white hover:text-cyan focus-visible:outline-2 focus-visible:outline-cyan"
        >
          <X size={28} strokeWidth={1.5} aria-hidden />
        </button>
      </div>
      <nav
        aria-label="Site"
        className="flex flex-1 flex-col gap-12 px-6 pt-8 pb-16 lg:flex-row lg:gap-32 lg:px-10"
      >
        <ul className="flex flex-col gap-4">
          {[...PRIMARY, ...account].map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                onClick={dismiss}
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
                  onClick={dismiss}
                  className="text-body-lg text-soft-white hover:text-white"
                >
                  {d.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </dialog>
  );
}
