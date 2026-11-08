import { Check } from "lucide-react";
import { Fragment, type HTMLAttributes } from "react";
import type { AvatarTone } from "@/content/home";
import { cn } from "@/lib/cn";

/** Prototype `.container`: 1320px wide, inside the page gutter (set on <main> by HomeMotion). */
export const CONTAINER = "mx-auto w-[min(1320px,100%_-_2*var(--gutter))]";

/** Prototype `.section`: section gap above (160 / 128 / 96 px). */
export const SECTION = "pt-(--section-gap)";

/** Section title with the heading gradient (one per screen). */
export const GRADIENT_TITLE =
  "text-gradient font-display text-[length:clamp(36px,5vw,60px)] leading-[1.0667] font-extrabold uppercase";

/** Prototype `.split` (04, 05, 06): copy + card side by side, stacked under 1100px. */
export const SPLIT =
  "flex items-center gap-24 max-[1280px]:gap-14 max-[1100px]:flex-col max-[1100px]:items-stretch";
export const SPLIT_COPY = "flex min-w-0 flex-1 flex-col items-start gap-8";
/** Mock cards in a split: fixed width on desktop, centred under 1100px. */
export const SPLIT_CARD =
  "max-w-full rounded-xs border border-border-subtle bg-surface-1 max-[1100px]:w-[min(614px,100%)] max-[1100px]:flex-none max-[1100px]:self-center";

export const LABEL = "text-label-strong";

/** Inert look-alike of the primary Button, for the illustration cards. */
export const FAKE_PRIMARY =
  "slant inline-flex h-12 items-center px-[34px] text-button whitespace-nowrap text-white [--slant-bg:var(--color-rose)] [--slant-border:var(--color-rose)]";

/** Text lines joined by <br>, with a space so the text content still reads as one sentence. */
export function Lines({
  lines,
  brClassName,
}: {
  lines: readonly string[];
  brClassName?: string;
}) {
  return lines.map((line, i) => (
    <Fragment key={i}>
      {i > 0 && (
        <>
          {" "}
          <br className={brClassName} />
        </>
      )}
      {line}
    </Fragment>
  ));
}

export function Benefits({ items }: { items: readonly string[] }) {
  return (
    <ul data-anim="benefits" className="flex flex-col gap-4">
      {items.map((item) => (
        <li key={item} className="flex items-center gap-3">
          <Check
            size={20}
            strokeWidth={2}
            absoluteStrokeWidth
            className="flex-none text-cyan"
            aria-hidden
          />
          {item}
        </li>
      ))}
    </ul>
  );
}

const TONE: Record<AvatarTone, string> = {
  cyan: "from-[#059cbf]",
  rose: "from-[#e54066]",
  slate: "from-[#788ca8]",
};

/** Initials disc from the Figma mock (cyan / rose / slate to midnight). */
export function ToneAvatar({
  initials,
  tone,
  size = 48,
  className,
  ...rest
}: {
  initials: string;
  tone: AvatarTone;
  size?: 44 | 48;
} & HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      {...rest}
      className={cn(
        "inline-flex flex-none items-center justify-center rounded-full bg-linear-to-r to-midnight text-label-strong",
        size === 44 ? "size-11" : "size-12",
        TONE[tone],
        className,
      )}
    >
      {initials}
    </span>
  );
}
