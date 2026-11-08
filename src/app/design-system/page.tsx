import { notFound } from "next/navigation";
import { Wordmark } from "@/components/ui/Wordmark";

export const metadata = { title: "Design system" };

const COLORS = [
  "midnight", "surface-1", "surface-2", "surface-3", "border-subtle", "border-strong",
  "rose", "cyan", "slate", "soft-white", "success", "warning",
] as const;

const TEXT_STYLES = [
  ["text-display-hero", "Reach radar"],
  ["text-display-section", "Get heard"],
  ["text-heading-secondary", "Heading secondary"],
  ["text-page-title", "Page title"],
  ["text-heading-h3", "Heading H3"],
  ["text-heading-card", "Heading card"],
  ["text-metric-lg", "1,248"],
  ["text-body-lg", "Body large — Pitch smarter. Pay only for real feedback."],
  ["text-body-md", "Body medium — Grow real fans."],
  ["text-body-sm", "Body small — Answer within 7 days or refunded."],
  ["text-body-long", "Body long-form — legal and help copy."],
  ["text-label", "Label default"],
  ["text-label-strong", "Label strong"],
  ["text-button", "Button default"],
  ["text-tab", "Tab default"],
] as const;

export default function DesignSystemPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="mx-auto flex max-w-content flex-col gap-16 px-6 py-16">
      <section className="flex flex-col gap-6">
        <h1 className="text-page-title text-gradient">Design system</h1>
        <Wordmark width={400} />
        <p className="text-display-hero text-outline">ReachRadar</p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-heading-card">Colors</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
          {COLORS.map((c) => (
            <div key={c} className="flex flex-col gap-2">
              <div className="h-16 border border-border-subtle" style={{ background: `var(--color-${c})` }} />
              <span className="text-body-sm text-muted">{c}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-heading-card">Typography</h2>
        {TEXT_STYLES.map(([cls, sample]) => (
          <div key={cls} className="flex flex-col gap-1 border-b border-border-subtle pb-4">
            <span className="text-body-sm text-muted">{cls}</span>
            <span className={cls}>{sample}</span>
          </div>
        ))}
      </section>

      <section id="components" className="flex flex-col gap-6">
        <h2 className="text-heading-card">Slant</h2>
        <div className="flex flex-wrap gap-6">
          <span className="slant inline-flex h-12 items-center px-[34px] text-button [--slant-bg:var(--color-rose)] [--slant-border:var(--color-rose)]">
            Start pitching
          </span>
          <span className="slant inline-flex h-12 items-center px-[34px] text-button [--slant-border:#fff]">
            A much longer secondary label stays at -12°
          </span>
        </div>
      </section>
    </main>
  );
}
