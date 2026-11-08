import type { Role } from "@/lib/nav";

export type LegalSlug =
  "privacy" | "gdpr" | "cookies" | "terms" | "legal-notice";

/** Legal documents in display order. */
export const LEGAL_DOCS: { slug: LegalSlug; label: string }[] = [
  { slug: "privacy", label: "Privacy policy" },
  { slug: "gdpr", label: "GDPR" },
  { slug: "cookies", label: "Cookies" },
  { slug: "terms", label: "Terms of use" },
  { slug: "legal-notice", label: "Legal notice" },
];

/** `href: null` means the page is not built yet: rendered as muted text ("Coming soon"). */
export type SiteLink = { label: string; href: string | null };

export const SITE_LINKS: {
  title: "Product" | "Community" | "Company" | "Legal";
  links: SiteLink[];
}[] = [
  {
    title: "Product",
    links: [
      { label: "Pitch to curators", href: "/pitch" },
      { label: "Rate & earn", href: "/rate" },
      { label: "Credit packs", href: "/pricing" },
      { label: "Catalogue", href: "/catalogue" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Artist chat", href: "/messages" },
      { label: "Find collabs", href: "/messages" },
      { label: "Success stories", href: "/#stories" },
      { label: "Blog", href: null },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: null },
      { label: "For curators", href: "/signup" },
      { label: "Careers", href: null },
      { label: "Contact", href: "/legal/legal-notice#contact" },
    ],
  },
  {
    title: "Legal",
    links: LEGAL_DOCS.map((d) => ({
      label: d.label,
      href: `/legal/${d.slug}`,
    })),
  },
];

/** Where a "Buy credits" call to action leads for this viewer. */
export function buyCreditsHref(viewer: { role: Role } | null): string {
  if (!viewer) return "/signup";
  return viewer.role === "artist" ? "/credits" : "/dashboard";
}
