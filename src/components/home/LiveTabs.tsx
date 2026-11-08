"use client";

import {
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

/** Image frame + Teaser / Behind-the-scenes tabs (the frame is the tab panel). */
export function LiveTabs({
  tabs,
  children,
}: {
  tabs: readonly string[];
  children: ReactNode;
}) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();

  const onKeyDown = (e: KeyboardEvent) => {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (active + step + tabs.length) % tabs.length;
    setActive(next);
    refs.current[next]?.focus();
  };

  return (
    <>
      <div
        data-anim="live-frame"
        role="tabpanel"
        id={`${id}-panel`}
        aria-labelledby={`${id}-tab-${active}`}
        className="overflow-hidden"
      >
        {children}
      </div>
      <div
        role="tablist"
        className="flex gap-[34.28px] max-[560px]:gap-2"
        onKeyDown={onKeyDown}
      >
        {tabs.map((label, i) => (
          <button
            key={label}
            ref={(el) => {
              refs.current[i] = el;
            }}
            id={`${id}-tab-${i}`}
            data-anim="tab"
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-controls={`${id}-panel`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            className={cn(
              "border-b p-3 text-[20.31px] uppercase transition-colors duration-200 max-[560px]:text-[15px]",
              i === active
                ? "border-rose font-bold text-soft-white"
                : "border-transparent font-medium text-[#777] hover:text-[#bbb]",
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </>
  );
}
