import Image from "next/image";

/** Figma Credit Pill (4410:10): cyan outlined parallelogram with the credits icon. */
export function CreditPill({ credits }: { credits: number }) {
  return (
    <span className="slant inline-flex h-[34px] items-center gap-2 px-[30px] whitespace-nowrap text-label-strong text-cyan [--slant-h:34px] [--slant-border:var(--color-cyan)]">
      <Image src="/brand/credit-icon.svg" alt="" width={16} height={16} unoptimized />
      {credits} {credits === 1 ? "credit" : "credits"}
    </span>
  );
}
