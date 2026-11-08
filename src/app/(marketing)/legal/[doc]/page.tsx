import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalBody } from "@/components/legal/LegalBody";
import { LegalHeader } from "@/components/legal/LegalHeader";
import { LegalToc } from "@/components/legal/LegalToc";
import { CONTAINER } from "@/components/site/layout";
import { getLegalDoc } from "@/content/legal";
import { cn } from "@/lib/cn";
import { readConsent } from "@/lib/consent-server";
import { LEGAL_DOCS } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return LEGAL_DOCS.map((d) => ({ doc: d.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/legal/[doc]">): Promise<Metadata> {
  const doc = getLegalDoc((await params).doc);
  return { title: doc?.title };
}

/** Legal documents (Figma 09a-09e): head with tabs, sticky table of contents, 720px text column. */
export default async function LegalPage({ params }: PageProps<"/legal/[doc]">) {
  const doc = getLegalDoc((await params).doc);
  if (!doc) notFound();
  const consent = doc.slug === "cookies" ? await readConsent() : null;

  return (
    <main
      data-legal
      className="overflow-x-clip [font-feature-settings:'lnum'_1,'pnum'_1] [--gutter:60px] max-[1280px]:[--gutter:40px] max-[860px]:[--gutter:24px]"
    >
      <LegalHeader doc={doc} />
      <div
        className={cn(
          CONTAINER,
          "flex items-start gap-24 pb-32 pt-14 max-[1100px]:flex-col max-[1100px]:items-stretch max-[1100px]:gap-10 max-[860px]:pb-20 max-[860px]:pt-10",
        )}
      >
        <LegalToc
          sections={doc.sections.map(({ id, title }) => ({ id, title }))}
          asideTitle={doc.asideTitle}
          asideEmail={doc.asideEmail}
        />
        <LegalBody doc={doc} consent={consent} />
      </div>
    </main>
  );
}
