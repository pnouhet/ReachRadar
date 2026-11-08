/** Only same-site absolute paths are allowed as post-login destinations. */
export function safeNext(next: string | undefined | null): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return "/dashboard";
  return next;
}
