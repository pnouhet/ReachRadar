export type Consent = { analytics: boolean; marketing: boolean };

export const CONSENT_COOKIE = "rr_consent";
/** 6 months. */
export const CONSENT_MAX_AGE = 15_552_000;
export const CONSENT_EVENT = "rr-consent";

const PATTERN = /^v1\.([01])\.([01])$/;

/** Anything malformed counts as "no choice yet". */
export function parseConsent(value: string | undefined): Consent | null {
  if (!value) return null;
  const m = PATTERN.exec(value);
  if (!m) return null;
  return { analytics: m[1] === "1", marketing: m[2] === "1" };
}

export function serializeConsent(c: Consent): string {
  return `v1.${c.analytics ? 1 : 0}.${c.marketing ? 1 : 0}`;
}

/** Client only: stores the choice and tells the page (banner) about it. */
export function writeConsent(c: Consent): void {
  document.cookie = `${CONSENT_COOKIE}=${serializeConsent(c)}; max-age=${CONSENT_MAX_AGE}; path=/; SameSite=Lax`;
  window.dispatchEvent(new CustomEvent<Consent>(CONSENT_EVENT, { detail: c }));
}
