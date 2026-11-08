import type { LegalDoc } from "./types";
import { cookies } from "./cookies";
import { gdpr } from "./gdpr";
import { legalNotice } from "./legal-notice";
import { privacy } from "./privacy";
import { terms } from "./terms";

const DOCS: Record<string, LegalDoc> = {
  privacy,
  gdpr,
  cookies,
  terms,
  "legal-notice": legalNotice,
};

export function getLegalDoc(slug: string): LegalDoc | null {
  return Object.hasOwn(DOCS, slug) ? DOCS[slug] : null;
}

export type { LegalBlock, LegalDoc, LegalSection } from "./types";
