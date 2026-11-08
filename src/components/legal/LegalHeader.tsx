import Link from "next/link";
import { Tab } from "@/components/ui/Tab";
import { CONTAINER } from "@/components/site/layout";
import type { LegalDoc } from "@/content/legal";
import { cn } from "@/lib/cn";
import { LEGAL_DOCS } from "@/lib/site";
import { PrintButton } from "./PrintButton";

/** Page head of the legal documents (Figma 09a): breadcrumb, title row, document tabs. */
export function LegalHeader({ doc }: { doc: LegalDoc }) {
  return (
    <div
      className={cn(CONTAINER, "flex flex-col gap-4 pt-20 max-[860px]:pt-10")}
    >
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-body-sm">
          <li>
            <Link href="/" className="text-soft-white hover:text-white">
              Home
            </Link>
          </li>
          <li aria-hidden className="text-muted">
            /
          </li>
          <li>
            <Link
              href="/legal/privacy"
              className="text-soft-white hover:text-white"
            >
              Legal
            </Link>
          </li>
          <li aria-hidden className="text-muted">
            /
          </li>
          <li className="text-white">{doc.title}</li>
        </ol>
      </nav>

      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <div className="flex flex-col gap-3">
          <h1 className="text-page-title text-white">{doc.title}</h1>
          <p className="flex flex-wrap items-center gap-x-3 text-body-sm text-soft-white">
            <span className="text-label-strong text-cyan">Last updated</span>
            <span>
              {doc.updated}
              <span aria-hidden className="px-2">
                ·
              </span>
              {doc.readMinutes} min read
            </span>
          </p>
        </div>
        <PrintButton />
      </div>

      <nav
        aria-label="Legal documents"
        className="flex gap-8 overflow-x-auto border-b border-border-subtle"
      >
        {LEGAL_DOCS.map((d) => (
          <Tab
            key={d.slug}
            href={`/legal/${d.slug}`}
            active={d.slug === doc.slug}
          >
            {d.label}
          </Tab>
        ))}
      </nav>
    </div>
  );
}
