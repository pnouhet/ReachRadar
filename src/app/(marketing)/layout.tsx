import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { getViewer } from "@/lib/auth/session";

export default async function MarketingLayout({ children }: LayoutProps<"/">) {
  const viewer = await getViewer();
  return (
    <>
      <SiteHeader signedIn={viewer !== null} />
      {children}
      <SiteFooter />
    </>
  );
}
