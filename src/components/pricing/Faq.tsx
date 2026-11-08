"use client";

import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";
import type { FaqItem } from "@/content/pricing";
import { cn } from "@/lib/cn";

/** Accordion: one answer open at a time, the first one open by default. */
export function Faq({ items }: { items: readonly FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();

  return (
    <div className="flex min-w-0 flex-1 flex-col border-t border-border-subtle">
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `${base}-panel-${i}`;
        return (
          <div key={item.question} className="border-b border-border-subtle">
            <h3>
              <button
                type="button"
                id={`${base}-button-${i}`}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className={cn(
                  "flex w-full items-center gap-4 pt-6 text-left text-body-lg transition-colors hover:text-cyan",
                  isOpen ? "pb-3 text-cyan" : "pb-6 text-white",
                )}
              >
                <span className="flex-1">{item.question}</span>
                <ChevronDown
                  size={22}
                  strokeWidth={1.5}
                  aria-hidden
                  className={cn(
                    "flex-none transition-transform",
                    isOpen && "rotate-180",
                  )}
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={`${base}-button-${i}`}
              hidden={!isOpen}
              className="pb-6"
            >
              <p className="text-body-md text-soft-white">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
