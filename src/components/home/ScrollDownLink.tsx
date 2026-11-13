"use client";

import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import type { MouseEvent, ReactNode } from "react";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollToPlugin);

type ScrollDownLinkProps = {
  /** Id of the section to reach, without the leading `#`. */
  target: string;
  label: string;
  className?: string;
  children: ReactNode;
};

/**
 * Hero "Scroll down" link: eases the page down to the target section instead of
 * jumping. Keeps a real `#target` href so it still works before hydration, and
 * jumps instantly when the visitor prefers reduced motion.
 */
export function ScrollDownLink({
  target,
  label,
  className,
  children,
}: ScrollDownLinkProps) {
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    const section = document.getElementById(target);
    if (!section) return;
    e.preventDefault();
    // Keep the `#target` in the URL like a native anchor, without the instant jump.
    if (location.hash !== `#${target}`) history.pushState(null, "", `#${target}`);
    // Honour the section's scroll-margin-top (scroll-mt-*) like a native anchor jump.
    const offsetY = parseFloat(getComputedStyle(section).scrollMarginTop) || 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.to(window, {
      duration: reduce ? 0 : 1.2,
      ease: "power3.inOut",
      // A wheel or touch scroll from the visitor cancels the tween.
      scrollTo: { y: section, offsetY, autoKill: true },
      onComplete: () => section.focus({ preventScroll: true }),
    });
  };

  return (
    <a
      href={`#${target}`}
      aria-label={label}
      onClick={onClick}
      className={className}
    >
      {children}
    </a>
  );
}
