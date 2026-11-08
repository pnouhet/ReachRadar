import Image from "next/image";

const PROVIDERS = [
  { id: "google", label: "Continue with Google", logo: "/brand/google.svg" },
  { id: "spotify", label: "Continue with Spotify", logo: "/brand/spotify.svg" },
] as const;

/** Figma Social Button (4418:53). Visible but inactive for now: email + password only. */
export function SocialButtons() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      {PROVIDERS.map((p) => (
        <button
          key={p.id}
          type="button"
          disabled
          title="Coming soon"
          className="slant inline-flex h-12 flex-1 cursor-not-allowed items-center justify-center gap-3 px-[30px] whitespace-nowrap text-label-strong text-white opacity-60 [--slant-border:var(--color-border-strong)]"
        >
          <Image src={p.logo} alt="" width={20} height={20} unoptimized />
          {p.label}
        </button>
      ))}
    </div>
  );
}

export function OrWithEmail() {
  return (
    <div className="flex items-center gap-4" aria-hidden>
      <span className="h-px flex-1 bg-border-subtle" />
      <span className="text-label-strong text-muted">or with email</span>
      <span className="h-px flex-1 bg-border-subtle" />
    </div>
  );
}
