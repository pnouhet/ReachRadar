"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

type Item = { id: string; title: string };

/** Distance from the viewport top below which a section counts as "current" (header + gap). */
const SPY_OFFSET = 180;

/** Figma "Table of contents (sticky)": sticky on desktop, stacked above the text under 1100px. */
export function LegalToc({
  sections,
  asideTitle,
  asideEmail,
}: {
  sections: Item[];
  asideTitle: string;
  asideEmail: string;
}) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      let current = sections[0]?.id ?? "";
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= SPY_OFFSET) current = s.id;
      }
      if (atBottom) current = sections[sections.length - 1]?.id ?? current;
      setActiveId(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [sections]);

  return (
    <aside className="flex w-[300px] flex-none flex-col gap-6 min-[1100px]:sticky min-[1100px]:top-36 max-[1100px]:w-full">
      <p className="text-label uppercase text-muted">On this page</p>
      <nav aria-label="On this page">
        <ul className="flex flex-col">
          {sections.map((s, i) => {
            const active = s.id === activeId;
            return (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  aria-current={active ? "location" : undefined}
                  className={cn(
                    "flex items-center gap-3 py-2.5 pl-4 transition-colors",
                    active
                      ? "border border-rose bg-surface-1"
                      : "border-l border-border-subtle hover:bg-surface-1/50",
                  )}
                >
                  <span
                    className={cn(
                      "text-label-strong",
                      active ? "text-cyan" : "text-muted",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={cn(
                      "text-body-md",
                      active ? "text-white" : "text-soft-white",
                    )}
                  >
                    {s.title}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
      {asideTitle && (
        <div className="flex flex-col gap-2 rounded-[2px] border border-border-subtle bg-surface-1 p-5">
          <p className="text-label-strong text-white">{asideTitle}</p>
          <a
            href={`mailto:${asideEmail}`}
            className="text-body-md text-cyan hover:underline"
          >
            {asideEmail}
          </a>
        </div>
      )}
    </aside>
  );
}
