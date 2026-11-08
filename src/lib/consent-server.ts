import { cookies } from "next/headers";
import { CONSENT_COOKIE, parseConsent, type Consent } from "@/lib/consent";

/** Server only: the visitor's saved cookie choice, or null when none (or malformed). */
export async function readConsent(): Promise<Consent | null> {
  return parseConsent((await cookies()).get(CONSENT_COOKIE)?.value);
}
