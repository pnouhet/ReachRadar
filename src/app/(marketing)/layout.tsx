import { CookieBanner } from "@/components/site/CookieBanner";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { getViewer } from "@/lib/auth/session";
import { readConsent } from "@/lib/consent-server";

export default async function MarketingLayout({ children }: LayoutProps<"/">) {
  const [viewer, consent] = await Promise.all([getViewer(), readConsent()]);
  return (
    <>
      <SiteHeader signedIn={viewer !== null} />
      {children}
      <SiteFooter />
      <CookieBanner initial={consent} />
    </>
  );
}
