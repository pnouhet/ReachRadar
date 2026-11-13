"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { X } from "lucide-react";
import { Wordmark } from "@/components/ui/Wordmark";
import { LEGAL_DOCS } from "@/lib/site";

type SiteMenuProps = { open: boolean; onClose: () => void; signedIn: boolean };

const PRIMARY = [
  { label: "Home", href: "/" },
  { label: "Pricing", href: "/pricing" },
  { label: "Catalogue", href: "/catalogue" },
];

/** Slide duration (ms); keep in sync with `duration-500` on the panel. */
const SLIDE_MS = 500;

const reducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Navigation drawer that slides in from the left edge and covers 30% of the
 * screen (wider floor on small screens). Esc, the close button and a click on
 * the dimmed backdrop dismiss it; the header returns focus to its menu button.
 */
export function SiteMenu({ open, onClose, signedIn }: SiteMenuProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closingRef = useRef(false);
  // `shown` drives the slide: false = off-screen left, true = in place.
  const [shown, setShown] = useState(false);

  // Slide out, then leave the modal state before the caller moves focus back to the menu button.
  const dismiss = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    setShown(false);
    const finish = () => {
      dialogRef.current?.close();
      closingRef.current = false;
      onClose();
    };
    if (reducedMotion()) finish();
    else window.setTimeout(finish, SLIDE_MS);
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    // Modal dialog: the rest of the page becomes inert (Esc fires `cancel`).
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    closeRef.current?.focus();
    // Start off-screen for one frame so the transform transition runs.
    const frame = requestAnimationFrame(() => setShown(true));
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(frame);
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

  // A click outside the panel's box lands on the ::backdrop (target is the dialog itself).
  const closeOnBackdrop = (e: MouseEvent<HTMLDialogElement>) => {
    if (e.target !== e.currentTarget) return;
    const r = e.currentTarget.getBoundingClientRect();
    const inside =
      e.clientX >= r.left &&
      e.clientX <= r.right &&
      e.clientY >= r.top &&
      e.clientY <= r.bottom;
    if (!inside) dismiss();
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
      data-shown={shown}
      onCancel={(e) => {
        e.preventDefault();
        dismiss();
      }}
      onKeyDown={trapTab}
      onClick={closeOnBackdrop}
      className={[
        // @container: link sizes follow the drawer width (cqi), not the viewport.
        "@container fixed inset-y-0 right-auto left-0 z-[60] m-0 flex h-full max-h-none w-[min(100vw,max(30vw,320px))] max-w-none flex-col overflow-y-auto border-0 bg-midnight p-0 text-white shadow-2xl",
        // Slide from the left edge.
        "-translate-x-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] data-[shown=true]:translate-x-0",
        // Dim the page behind the drawer in step with the slide.
        "backdrop:bg-black/60 backdrop:opacity-0 backdrop:transition-opacity backdrop:duration-500 data-[shown=true]:backdrop:opacity-100",
        "motion-reduce:transition-none motion-reduce:backdrop:transition-none",
      ].join(" ")}
    >
      <div className="flex items-center justify-between px-6 py-5 lg:px-10 lg:py-8">
        <Wordmark width={180} className="h-auto w-[150px] lg:w-[180px]" />
        <button
          ref={closeRef}
          type="button"
          onClick={dismiss}
          aria-label="Close menu"
          className="group flex size-10 items-center justify-center text-white hover:text-cyan focus-visible:outline-2 focus-visible:outline-cyan"
        >
          <X
            size={28}
            strokeWidth={1.5}
            aria-hidden
            className="transition-transform duration-300 ease-out group-hover:rotate-90 motion-reduce:transition-none"
          />
        </button>
      </div>
      <nav
        aria-label="Site"
        className="flex flex-1 flex-col gap-12 px-6 pt-8 pb-16 lg:px-10"
      >
        <ul className="flex flex-col gap-4">
          {[...PRIMARY, ...account].map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                onClick={dismiss}
                className="font-display text-[clamp(20px,7cqi,44px)] leading-[1.1] font-extrabold uppercase hover:text-cyan"
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
