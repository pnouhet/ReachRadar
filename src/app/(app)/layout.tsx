import { AppShell } from "@/components/app/AppShell";
import { getCurrentProfile } from "@/lib/profile/queries";

export default async function AppLayout({ children }: LayoutProps<"/">) {
  const profile = await getCurrentProfile();
  return (
    <AppShell user={{ displayName: profile.displayName, role: profile.role, avatarUrl: profile.avatarUrl }}>
      {children}
    </AppShell>
  );
}
