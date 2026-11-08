"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef, type ReactNode } from "react";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const PENDING = "anim-pending";
const ONCE = "play none none none";

type El = HTMLElement;

/**
 * Port of prototype/js/main.js: the hero intro, the scroll parallax and every reveal,
 * selected through `data-anim` attributes. Returns the cleanup for the media query.
 */
function buildMotion(root: El, animateNav: boolean): () => void {
  const all = (name: string, scope: ParentNode = root) =>
    Array.from(scope.querySelectorAll<El>(`[data-anim="${name}"]`));
  const one = (name: string, scope: ParentNode = root) =>
    scope.querySelector<El>(`[data-anim="${name}"]`);
  const cardOf = (el: El | null) =>
    el?.closest<El>('[data-anim="card"]') ?? null;
  const later: gsap.core.Tween[] = [];
  const restores: (() => void)[] = [];

  const reveal = (
    targets: gsap.TweenTarget,
    vars: gsap.TweenVars,
    trigger?: Element | null,
  ) =>
    gsap.from(targets, {
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      clearProps: "transform,filter", // keep the CSS :hover transforms working afterwards
      scrollTrigger: {
        trigger: (trigger ?? targets) as gsap.DOMTarget,
        start: "top 85%",
        toggleActions: ONCE,
      },
      ...vars,
    });

  /** Shows 0 now, restores the server text on cleanup; `play` counts up to data-count. */
  const counter = (el: El | null) => {
    const node = el?.firstChild;
    if (!el || !node) return null;
    const original = node.nodeValue;
    const { count, prefix = "", suffix = "" } = el.dataset;
    const write = (v: number) => {
      node.nodeValue = `${prefix}${Math.round(v)}${suffix}`;
    };
    write(0);
    restores.push(() => {
      node.nodeValue = original;
    });
    return (duration = 1.6) => {
      const state = { v: 0 };
      return gsap.to(state, {
        v: Number(count),
        duration,
        ease: "power2.out",
        onUpdate: () => write(state.v),
      });
    };
  };

  /* Hero intro timeline */
  const heroBar = one("hero-bar");
  const intro = gsap.timeline({ defaults: { ease: "expo.out" } });
  intro
    // fromTo: while anim-pending, CSS holds the photo at 1.18, which from() would read as its end.
    .fromTo(
      one("hero-photo"),
      { scale: 1.18 },
      { scale: 1, duration: 2.6, ease: "power2.out" },
      0,
    )
    .from(one("hero-dots"), { autoAlpha: 0, duration: 1.6 }, 0.2);
  const nav = document.querySelector<El>('[data-anim="nav"]');
  if (animateNav && nav)
    intro.from(nav, { y: -60, autoAlpha: 0, duration: 1 }, 0.3);
  intro
    .from(
      root.querySelectorAll('[data-anim="hero-solid"] [data-char]'),
      {
        yPercent: 120,
        rotate: 10,
        autoAlpha: 0,
        duration: 1.2,
        stagger: 0.045,
      },
      0.4,
    )
    .from(
      root.querySelectorAll('[data-anim="hero-outline"] [data-char]'),
      {
        yPercent: -80,
        autoAlpha: 0,
        duration: 1.2,
        stagger: { each: 0.045, from: "end" },
      },
      0.6,
    )
    .from(one("hero-lead"), { y: 30, autoAlpha: 0, duration: 1 }, 1.1)
    .from(
      all("hero-btn"),
      {
        y: 30,
        scale: 0.9,
        autoAlpha: 0,
        duration: 0.9,
        stagger: 0.12,
        clearProps: "transform",
      },
      1.3,
    );
  if (heroBar)
    intro
      .from(
        heroBar.children,
        { y: 20, autoAlpha: 0, duration: 0.9, stagger: 0.1 },
        1.5,
      )
      .from(
        heroBar.querySelectorAll("li"),
        { y: 14, autoAlpha: 0, duration: 0.6, stagger: 0.06 },
        1.6,
      );

  // Start states are applied: show the page.
  document.documentElement.classList.remove(PENDING);

  /* Below the intro, fades use opacity rather than autoAlpha: content waiting for its
     scroll reveal stays in the accessibility tree (visibility: hidden would remove it). */

  /* Hero scroll: photo parallax, title drifts and fades */
  gsap.to(one("hero-photo"), {
    yPercent: 10,
    ease: "none",
    scrollTrigger: {
      trigger: one("top"),
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });
  gsap.to([one("hero-title"), one("hero-cta")], {
    y: -120,
    opacity: 0,
    ease: "none",
    scrollTrigger: {
      trigger: one("hero"),
      start: "top top",
      end: "bottom 30%",
      scrub: true,
    },
  });

  /* Generic reveals */
  for (const el of all("badge"))
    reveal(el, { x: -40, skewX: -12, duration: 0.8, ease: "back.out(2)" });
  for (const el of all("title"))
    reveal(el, { y: 60, filter: "blur(10px)", duration: 1.1 });
  for (const el of [...all("up"), ...all("progress")])
    reveal(el, { y: 40, duration: 0.9 });
  for (const list of all("benefits"))
    reveal(list.children, { x: -24, duration: 0.7, stagger: 0.12 }, list);
  for (const el of all("card"))
    reveal(el, { y: 90, scale: 0.96, duration: 1.2 });

  /* 01 stats count up */
  const stats = one("stats");
  if (stats) {
    reveal(all("stat", stats), { y: 30, duration: 0.8, stagger: 0.12 }, stats);
    const counters = all("count", stats).map(counter);
    ScrollTrigger.create({
      trigger: stats,
      start: "top 85%",
      once: true,
      onEnter: () => {
        for (const play of counters) if (play) later.push(play());
      },
    });
  }

  /* Go ahead: image wipe + quote */
  gsap
    .timeline({
      scrollTrigger: {
        trigger: one("live"),
        start: "top 70%",
        toggleActions: ONCE,
      },
    })
    .from(one("live-frame"), {
      clipPath: "inset(0 0 100% 0)",
      duration: 1.3,
      ease: "expo.inOut",
    })
    .from(
      one("live-img"),
      { scale: 1.25, duration: 1.6, ease: "power3.out" },
      0.2,
    )
    .from(
      one("live-quote"),
      {
        scale: 0,
        rotate: -45,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(2.5)",
      },
      0.2,
    )
    .from(all("tab"), { y: 20, opacity: 0, duration: 0.6, stagger: 0.1 }, 0.9);

  /* 02 steps */
  gsap
    .timeline({
      scrollTrigger: {
        trigger: one("steps"),
        start: "top 80%",
        toggleActions: ONCE,
      },
    })
    .from(all("step"), {
      y: 70,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: "power3.out",
    })
    .from(
      all("step-icon"),
      {
        scale: 0,
        rotate: -90,
        duration: 0.7,
        stagger: 0.15,
        ease: "back.out(3)",
      },
      0.25,
    )
    .from(
      all("step-num"),
      {
        scale: 0.7,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: "back.out(2)",
      },
      0.3,
    );

  /* 03 categories */
  gsap
    .timeline({
      scrollTrigger: {
        trigger: one("categories"),
        start: "top 80%",
        toggleActions: ONCE,
      },
    })
    .from(all("cat"), {
      y: 90,
      rotate: 2,
      opacity: 0,
      duration: 1.1,
      stagger: 0.12,
      ease: "power3.out",
    })
    .from(
      all("cat-img"),
      {
        clipPath: "inset(100% 0 0 0)",
        duration: 1.2,
        stagger: 0.12,
        ease: "expo.inOut",
      },
      0,
    )
    .from(
      all("cat-badge"),
      { scale: 0, duration: 0.6, stagger: 0.12, ease: "back.out(3)" },
      0.7,
    );

  /* 04 pre-test score card */
  const score = one("score-card");
  const scoreCount = counter(score && one("count", score));
  const scoreTl = gsap
    .timeline({
      scrollTrigger: {
        trigger: cardOf(score),
        start: "top 75%",
        toggleActions: ONCE,
      },
    })
    .from(one("score-status"), { y: 10, opacity: 0, duration: 0.5 }, 0.5);
  if (scoreCount) scoreTl.add(scoreCount(1.8), 0.5);
  scoreTl
    .from(
      all("criterion-bar"),
      {
        clipPath: "inset(0 100% 0 0)",
        duration: 1,
        stagger: 0.12,
        ease: "power3.inOut",
      },
      0.7,
    )
    .from(
      all("criterion-value"),
      { opacity: 0, x: -8, duration: 0.4, stagger: 0.12 },
      1.1,
    )
    .from(one("highlight"), { y: 20, opacity: 0, duration: 0.7 }, 1.4)
    .from(one("score-foot"), { opacity: 0, duration: 0.6 }, 1.7);

  /* 05 player */
  const chips = one("chips");
  const actions = one("player-actions");
  gsap
    .timeline({
      scrollTrigger: {
        trigger: cardOf(chips),
        start: "top 75%",
        toggleActions: ONCE,
      },
    })
    .from(
      chips?.children ?? [],
      { y: 16, opacity: 0, duration: 0.5, stagger: 0.08 },
      0.4,
    )
    .from(
      one("play"),
      { scale: 0, rotate: -30, duration: 0.6, ease: "back.out(2.5)" },
      0.5,
    )
    .from(
      all("bar"),
      { scaleY: 0, duration: 0.6, stagger: 0.012, ease: "power2.out" },
      0.6,
    )
    .from(
      one("rating"),
      { clipPath: "inset(0 100% 0 0)", duration: 0.9, ease: "power3.inOut" },
      1.2,
    )
    .from(one("feedback"), { y: 20, opacity: 0, duration: 0.7 }, 1.4)
    .from(
      actions?.children ?? [],
      { y: 16, opacity: 0, duration: 0.5, stagger: 0.1 },
      1.7,
    );

  reveal(
    all("segment"),
    {
      scaleX: 0,
      transformOrigin: "left center",
      opacity: 1,
      duration: 0.4,
      stagger: 0.04,
      ease: "power2.out",
    },
    one("progress"),
  );

  /* 06 community: avatars + chat messages arrive one by one */
  const avatars = one("avatars");
  if (avatars)
    reveal(
      Array.from(avatars.children).slice(0, -1),
      { scale: 0, duration: 0.5, stagger: 0.08, ease: "back.out(2.5)" },
      avatars,
    );
  const chatHead = one("chat-head");
  gsap
    .timeline({
      scrollTrigger: {
        trigger: cardOf(chatHead),
        start: "top 70%",
        toggleActions: ONCE,
      },
    })
    .from(chatHead, { y: 16, opacity: 0, duration: 0.6 }, 0.4)
    .from(
      one("chat-rule"),
      {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 0.8,
        ease: "power3.inOut",
      },
      0.5,
    )
    .from(
      all("msg-in"),
      {
        x: -40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.7,
        ease: "back.out(1.6)",
      },
      0.9,
    )
    .from(
      all("msg-mine"),
      { x: 40, opacity: 0, duration: 0.6, ease: "back.out(1.6)" },
      2.4,
    )
    .from(one("composer"), { y: 16, opacity: 0, duration: 0.6 }, 2.6);

  /* Testimonials */
  reveal(one("quote-mark"), {
    scale: 0,
    rotate: -30,
    duration: 0.7,
    ease: "back.out(3)",
  });
  reveal(all("quote"), { y: 80, duration: 1, stagger: 0.15 }, one("quotes"));

  /* Final CTA */
  gsap.fromTo(
    one("final-photo"),
    { scale: 1.25 },
    {
      scale: 1,
      ease: "none",
      scrollTrigger: {
        trigger: one("final"),
        start: "top bottom",
        end: "bottom bottom",
        scrub: true,
      },
    },
  );
  gsap
    .timeline({
      scrollTrigger: {
        trigger: one("final-band"),
        start: "top 65%",
        toggleActions: ONCE,
      },
    })
    .from(one("final-title"), {
      y: 70,
      scale: 0.92,
      filter: "blur(12px)",
      opacity: 0,
      duration: 1.2,
      ease: "expo.out",
    })
    .from(
      one("final-text"),
      { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" },
      0.4,
    )
    .from(
      all("final-btn"),
      { y: 30, opacity: 0, duration: 0.8, stagger: 0.12, ease: "power3.out" },
      0.6,
    );

  return () => {
    for (const t of later) t.kill();
    for (const restore of restores) restore();
  };
}

/**
 * The home <main>: sets the page gutter / section gap and runs the GSAP motion.
 * With reduced motion nothing animates and nothing stays hidden.
 */
export function HomeMotion({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLElement>(null);
  // The header slides in only on a full page load (AnimGate ran), not after a client navigation.
  const hardLoad = useRef<boolean | null>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const html = document.documentElement;
    hardLoad.current ??= html.classList.contains(PENDING);
    const animateNav = hardLoad.current;

    let mm: gsap.MatchMedia | undefined;
    const ctx = gsap.context(() => {
      mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: reduce)", () => {
        html.classList.remove(PENDING);
      });
      mm.add(
        "(prefers-reduced-motion: no-preference)",
        () => buildMotion(root, animateNav),
        root,
      );
    }, root);

    return () => {
      mm?.revert();
      ctx.revert();
      html.classList.remove(PENDING);
    };
  }, []);

  return (
    <main
      ref={rootRef}
      className="overflow-x-clip [--gutter:60px] [--section-gap:160px] max-[1280px]:[--gutter:40px] max-[1280px]:[--section-gap:128px] max-[860px]:[--gutter:24px] max-[860px]:[--section-gap:96px]"
    >
      {children}
    </main>
  );
}
