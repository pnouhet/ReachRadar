import Link from "next/link";
import { Wordmark } from "@/components/ui/Wordmark";
import { SITE_LINKS } from "@/lib/site";
import { NewsletterForm } from "./NewsletterForm";
import { SocialIcons } from "./SocialIcons";

export function SiteFooter() {
  return (
    <footer className="px-6 pt-24 pb-12 min-[860px]:px-10 min-[1280px]:px-[60px]">
      <div className="mx-auto max-w-[1320px]">
        <div className="flex flex-col justify-between gap-16 min-[1100px]:flex-row">
          <div className="flex w-[380px] max-w-full flex-col gap-7">
            <Wordmark echo width={380} className="h-auto w-full" />
            <p className="text-body-md text-muted">
              The pitching platform for independent artists. Get heard by
              curators, labels, radios and new fans.
            </p>
            <SocialIcons />
            <NewsletterForm />
          </div>
          <nav
            aria-label="Footer"
            className="flex flex-wrap gap-x-12 gap-y-10 whitespace-nowrap min-[1280px]:gap-x-20"
          >
            {SITE_LINKS.map((col) => (
              <div key={col.title} className="flex flex-col items-start gap-4">
                <h2 className="-mb-1 text-label-strong text-soft-white">
                  {col.title}
                </h2>
                {col.links.map((l) =>
                  l.href ? (
                    <Link
                      key={l.label}
                      href={l.href}
                      className="text-body-md text-muted transition-colors hover:text-white"
                    >
                      {l.label}
                    </Link>
                  ) : (
                    <span
                      key={l.label}
                      title="Coming soon"
                      className="text-body-md text-muted"
                    >
                      {l.label}
                    </span>
                  ),
                )}
              </div>
            ))}
          </nav>
        </div>
        <div className="mt-16 flex justify-between gap-4 border-t border-border-subtle pt-6 text-body-sm text-muted max-[560px]:flex-col">
          <p>© 2026 ReachRadar. Made for independent artists.</p>
          <p className="text-label-strong text-soft-white">
            EN&nbsp;&nbsp;/&nbsp;&nbsp;FR
          </p>
        </div>
      </div>
    </footer>
  );
}
