"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { User } from "lucide-react";
import { Wordmark } from "@/components/ui/Wordmark";
import { cn } from "@/lib/cn";
import { SiteMenu } from "./SiteMenu";

/** Overlay (transparent, blurred once scrolled) on Home/Pricing; solid midnight with a bottom border on /legal/*. */
export function SiteHeader({ signedIn }: { signedIn: boolean }) {
  const pathname = usePathname();
  const solid = pathname.startsWith("/legal");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    menuButton.current?.focus();
  }, []);

  const cta = signedIn
    ? { label: "Dashboard", href: "/dashboard" }
    : solid
      ? { label: "Sign In/Sign Up", href: "/login" }
      : { label: "Sign Up", href: "/signup" };

  return (
    <>
      <header
        data-anim="nav"
        className={cn(
          "z-50 transition-[background-color,padding,backdrop-filter] duration-300 motion-reduce:transition-none",
          solid
            ? "sticky top-0 border-b border-border-subtle bg-midnight py-5 lg:py-[35px]"
            : "fixed inset-x-0 top-0",
          !solid &&
            (scrolled
              ? "bg-midnight/80 py-4 backdrop-blur-md"
              : "py-5 lg:py-[35px]"),
        )}
      >
        <div className="mx-auto grid max-w-[1920px] grid-cols-[auto_1fr_auto] items-center gap-4 px-6 lg:grid-cols-[160px_1fr_160px] lg:px-10 xl:px-[60px]">
          <div className="flex gap-2.5">
            <button
              ref={menuButton}
              type="button"
              aria-label="Open menu"
              aria-haspopup="dialog"
              onClick={() => setMenuOpen(true)}
              className="size-10 focus-visible:outline-2 focus-visible:outline-cyan"
            >
              <Image
                src="/home/menu.svg"
                width={40}
                height={40}
                alt=""
                unoptimized
              />
            </button>
            <Link
              href="/catalogue"
              aria-label="Search"
              className="size-10 focus-visible:outline-2 focus-visible:outline-cyan max-[560px]:hidden"
            >
              <Image
                src="/home/search.svg"
                width={40}
                height={40}
                alt=""
                unoptimized
              />
            </Link>
          </div>
          <Link
            href="/"
            aria-label="ReachRadar home"
            className="w-[min(400px,100%)] justify-self-center"
          >
            <Wordmark width={400} className="h-auto w-full" />
          </Link>
          <Link
            href={cta.href}
            className="slant inline-flex h-[42px] min-w-[112px] items-center justify-center gap-2.5 justify-self-end px-5 font-display text-[16px] leading-5 font-medium whitespace-nowrap text-white [--slant-bg:var(--color-rose)] [--slant-border:var(--color-rose)] [--slant-h:42px] hover:brightness-110 sm:min-w-[130px] lg:min-w-[160px]"
          >
            {!signedIn && <User size={20} strokeWidth={1.5} aria-hidden />}
            <span>{cta.label}</span>
          </Link>
        </div>
      </header>
      {/* Outside <header>: its backdrop-filter would otherwise become the containing block of the fixed menu. */}
      <SiteMenu open={menuOpen} onClose={closeMenu} signedIn={signedIn} />
    </>
  );
}
