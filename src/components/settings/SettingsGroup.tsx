import type { ReactNode } from "react";

/** A settings section: Heading/Card title, muted description, bottom hairline (Figma 16a). */
export function SettingsGroup({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4 border-b border-border-subtle pb-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-heading-card uppercase">{title}</h2>
        {description && <p className="text-body-sm text-muted">{description}</p>}
      </div>
      {children}
    </section>
  );
}
