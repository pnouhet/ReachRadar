import type { LegalSlug } from "@/lib/site";

export type LegalBlock =
  | { kind: "p"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "callout"; text: string }
  | { kind: "table"; head: string[]; rows: string[][] }
  | { kind: "preferences" };

export type LegalSection = { id: string; title: string; blocks: LegalBlock[] };

export type LegalDoc = {
  slug: LegalSlug;
  title: string;
  /** Shown as written in the "Last updated" line. */
  updated: string;
  readMinutes: number;
  intro: string;
  /** Help card under the table of contents. Empty title = no card (Legal notice, Figma 09e). */
  asideTitle: string;
  asideEmail: string;
  sections: LegalSection[];
};
