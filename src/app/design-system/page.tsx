import { notFound } from "next/navigation";
import { Plus, User } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Chip } from "@/components/ui/Chip";
import { CreditPill } from "@/components/ui/CreditPill";
import { Input } from "@/components/ui/Input";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { Stat } from "@/components/ui/Stat";
import { Tab } from "@/components/ui/Tab";
import { Textarea } from "@/components/ui/Textarea";
import { Wordmark } from "@/components/ui/Wordmark";
import { DemoControls } from "./DemoControls";

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

      <section id="components" className="flex flex-col gap-10">
        <h2 className="text-heading-card">Components</h2>
        <div className="flex flex-wrap items-center gap-6">
          <Button variant="primary">Get started</Button>
          <Button variant="primary" icon={User}>Get started</Button>
          <Button variant="secondary">Get started</Button>
          <Button variant="ghost">Get started</Button>
          <Button variant="secondary" icon={Plus}>Get started</Button>
          <Button variant="secondary">A much longer secondary label stays at -12°</Button>
          <Button variant="primary" loading>Saving</Button>
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <Chip>Hip-hop</Chip>
          <Chip active>Hip-hop</Chip>
          <CreditPill credits={24} />
          <SectionBadge>01</SectionBadge>
          <Stat value="+800" label="Submitted songs" />
          <Avatar name="Ilan Mercier" size={44} />
          <Avatar name="Ilan Mercier" size={80} />
        </div>
        <DemoControls />
        <div className="flex gap-2 border-b border-border-subtle">
          <Tab active>Tab label</Tab>
          <Tab active={false}>Tab label</Tab>
          <Tab active={false} count={8}>Inbox</Tab>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Input label="Email" placeholder="you@artist.com" helper="We'll never share it" />
          <Input label="Password" type="password" defaultValue="secret123" trailing={<button type="button" className="text-label-strong text-cyan">Show</button>} />
          <Input label="Email" defaultValue="you@artist.com" error="We'll never share it" />
        </div>
        <Textarea label="Bio" maxLength={300} showCount defaultValue="Producer & DJ from Lyon." />
        <div className="flex flex-col gap-3">
          <Checkbox label="I accept the Terms of use and Privacy policy" />
          <Checkbox label="I accept the Terms of use and Privacy policy" defaultChecked />
        </div>
      </section>
    </main>
  );
}
