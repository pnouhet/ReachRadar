import type { ReactNode } from "react";

/** Numbered 17a panel: surface-1, 28px padding, cyan number + Heading/Card title, optional right action. */
export function Panel({ number, title, action, children }: { number: string; title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="flex w-full flex-col gap-5 rounded-[2px] border border-border-subtle bg-surface-1 p-5 sm:p-7">
      <div className="flex items-center justify-between gap-4">
        <h2 className="flex items-baseline gap-2.5">
          <span className="text-label-strong text-cyan">{number}</span>
          <span className="text-heading-card uppercase">{title}</span>
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function SideCard({ title, aside, children }: { title: string; aside?: ReactNode; children: ReactNode }) {
  return (
    <section className="flex w-full flex-col gap-4 rounded-[2px] border border-border-subtle bg-surface-1 p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-heading-card uppercase">{title}</h2>
        {aside}
      </div>
      {children}
    </section>
  );
}
