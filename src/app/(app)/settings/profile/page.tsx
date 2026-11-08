import { AvatarField, BannerField } from "@/components/profile/ImageFields";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { SettingsGroup } from "@/components/settings/SettingsGroup";
import { getCurrentProfile } from "@/lib/profile/queries";

export const metadata = { title: "Settings · Profile" };

export default async function SettingsProfilePage() {
  const profile = await getCurrentProfile();
  return (
    <div className="flex flex-col gap-8">
      <SettingsGroup title="Photo and banner" description="Shown on your profile and next to every pitch.">
        <AvatarField name={profile.displayName} url={profile.avatarUrl} />
        <BannerField url={profile.bannerUrl} />
      </SettingsGroup>
      <ProfileForm profile={profile} />
    </div>
  );
}
