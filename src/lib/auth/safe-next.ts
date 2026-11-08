const FALLBACK = "/dashboard";
const PROBE_ORIGIN = "http://reachradar.invalid";

/**
 * Only same-site absolute paths are allowed as post-login destinations.
 * Rejects control characters, spaces and backslashes outright (URL parsers strip or rewrite them,
 * e.g. "/\t/evil.com" becomes "//evil.com"), then checks the parsed URL stays on our origin.
 */
export function safeNext(next: string | undefined | null): string {
  if (!next || !next.startsWith("/") || /[\x00-\x20\x7f\\]/.test(next)) return FALLBACK;
  try {
    const url = new URL(next, PROBE_ORIGIN);
    if (url.origin !== PROBE_ORIGIN) return FALLBACK;
    return url.pathname + url.search + url.hash;
  } catch {
    return FALLBACK;
  }
}
