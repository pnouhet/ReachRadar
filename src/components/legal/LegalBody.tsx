import { CookiePreferences } from "@/components/site/CookiePreferences";
import type { LegalBlock, LegalDoc } from "@/content/legal";
import type { Consent } from "@/lib/consent";

/** Clears the sticky solid header (about 114px) plus a gap when a TOC link scrolls to a section. */
const SECTION = "flex scroll-mt-36 flex-col gap-4";

/** The text column of a legal document (Figma "Text column", 720px). */
export function LegalBody({
  doc,
  consent,
}: {
  doc: LegalDoc;
  consent: Consent | null;
}) {
  return (
    <div className="flex min-w-0 max-w-[720px] flex-1 flex-col gap-12 max-[1100px]:max-w-none">
      <p className="text-body-lg text-white">{doc.intro}</p>
      {doc.sections.map((section, i) => (
        <section
          key={section.id}
          id={section.id}
          aria-labelledby={`${section.id}-title`}
          className={SECTION}
        >
          <h2 className="flex items-baseline gap-3.5 uppercase">
            <span className="text-label-strong text-cyan [text-box:trim-both_cap_alphabetic]">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span
              id={`${section.id}-title`}
              className="text-heading-card text-white [text-box:trim-both_cap_alphabetic]"
            >
              {section.title}
            </span>
          </h2>
          {section.blocks.map((block, j) => (
            <Block key={j} block={block} consent={consent} />
          ))}
        </section>
      ))}
    </div>
  );
}

function Block({
  block,
  consent,
}: {
  block: LegalBlock;
  consent: Consent | null;
}) {
  switch (block.kind) {
    case "p":
      return <p className="text-body-long text-soft-white">{block.text}</p>;
    case "list":
      return (
        <ul className="flex flex-col gap-4">
          {block.items.map((item) => (
            <li key={item} className="flex items-start gap-3.5">
              <span
                aria-hidden
                className="mt-[11px] size-1.5 flex-none bg-cyan"
              />
              <span className="min-w-0 flex-1 text-body-long text-soft-white">
                {item}
              </span>
            </li>
          ))}
        </ul>
      );
    case "callout":
      return (
        <p className="bg-cyan/[0.08] px-5 py-4 text-body-long text-white">
          {block.text}
        </p>
      );
    case "table":
      return <LegalTable head={block.head} rows={block.rows} />;
    case "preferences":
      return <CookiePreferences initial={consent} />;
  }
}

const CELL = "px-2 py-3.5 first:pl-5 last:pr-5 text-left align-top";

function LegalTable({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div
      data-testid="legal-table"
      className="overflow-x-auto border border-border-subtle"
    >
      <table className="w-full min-w-[640px] table-fixed border-collapse">
        <colgroup>
          <col className="w-[178px]" />
          <col className="w-[136px]" />
          <col />
          <col className="w-[138px]" />
        </colgroup>
        <thead>
          <tr className="bg-surface-1 text-label uppercase text-muted">
            {head.map((h) => (
              <th key={h} scope="col" className={`${CELL} font-normal`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row[0]}
              className="border-t border-border-subtle text-body-sm text-soft-white"
            >
              {row.map((cell, i) => (
                <td
                  key={i}
                  className={`${CELL} ${i === 0 ? "font-semibold text-white" : ""}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
