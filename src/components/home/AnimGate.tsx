"use client";

/**
 * Hides the hero text and header (see `.anim-pending` in globals.css) until HomeMotion has set the GSAP start states,
 * so the hero does not flash its final layout first. Runs while the HTML is parsed;
 * skipped with reduced motion; a 2.5 s failsafe shows everything even if GSAP never runs.
 */
const SCRIPT = `(function(){var d=document.documentElement;if(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;d.classList.add("anim-pending");setTimeout(function(){d.classList.remove("anim-pending")},2500)})()`;

/**
 * A client component so that on client-side navigations it renders an inert `text/plain`
 * script (React warns about executable scripts it renders, and would not run them anyway):
 * HomeMotion sets the start states before paint in that case.
 */
export function AnimGate() {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: SCRIPT }}
    />
  );
}
