import Image from "next/image";
import { SettingsGroup } from "@/components/settings/SettingsGroup";
import { ChangePasswordForm } from "@/components/settings/AccountForms";
import { Input } from "@/components/ui/Input";
import { getCurrentProfile } from "@/lib/profile/queries";

export const metadata = { title: "Settings · Account" };

const PROVIDERS = [
  { name: "Google", logo: "/brand/google.svg", text: "Log in with your Google account." },
  { name: "Spotify", logo: "/brand/spotify.svg", text: "Connect to import your releases and check placements." },
];

export default async function SettingsAccountPage() {
  const profile = await getCurrentProfile();
  const isArtist = profile.role === "artist";

  return (
    <div className="flex flex-col gap-8">
      <SettingsGroup title="Email">
        <Input
          label="Email"
          value={profile.email}
          readOnly
          helper="Email changes are coming soon."
          trailing={<span className="text-label-strong text-cyan">Verified</span>}
        />
      </SettingsGroup>

      <ChangePasswordForm />

      <SettingsGroup title="Connected accounts">
        {PROVIDERS.map((p) => (
          <div key={p.name} className="flex flex-wrap items-center gap-4 border border-border-subtle bg-surface-1 px-4 py-3">
            <Image src={p.logo} alt="" width={20} height={20} unoptimized />
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="text-label-strong">{p.name}</span>
              <span className="text-body-sm text-muted">{p.text}</span>
            </div>
            <span className="text-label-strong text-muted">Coming soon</span>
          </div>
        ))}
      </SettingsGroup>

      <SettingsGroup title="Account type">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-label-strong">{profile.isAdmin ? "Admin" : isArtist ? "Artist" : "Curator"}</span>
            <span className="text-body-sm text-muted">
              {isArtist
                ? "You also run a playlist, a label, a radio or a blog? Add a Pro profile."
                : "You also release music? Add an artist profile."}
            </span>
          </div>
          <span className="text-label-strong text-muted">Coming soon</span>
        </div>
      </SettingsGroup>
    </div>
  );
}
