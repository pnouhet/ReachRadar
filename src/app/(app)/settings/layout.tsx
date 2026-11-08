import { SettingsSubNav } from "@/components/settings/SettingsSubNav";

export default function SettingsLayout({ children }: LayoutProps<"/settings">) {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2.5">
        <h1 className="text-page-title text-gradient">Settings</h1>
        <p className="text-body-md text-soft-white">Your profile, account, notifications, privacy and billing.</p>
      </header>
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
        <SettingsSubNav />
        <div className="w-full max-w-[720px] min-w-0">{children}</div>
      </div>
    </div>
  );
}
