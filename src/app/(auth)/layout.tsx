import { CookieBanner } from "@/components/site/CookieBanner";
import { readConsent } from "@/lib/consent-server";

export default async function AuthLayout({ children }: LayoutProps<"/">) {
  const consent = await readConsent();
  return (
    <>
      {children}
      <CookieBanner initial={consent} />
    </>
  );
}
