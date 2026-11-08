import { redirect } from "next/navigation";
import { AuthSplitLayout, PANEL_COPY } from "@/components/auth/AuthSplitLayout";
import { ResetPasswordForm } from "@/components/auth/SimpleAuthForms";
import { createServerSupabase } from "@/lib/supabase/server";

export const metadata = { title: "Choose a new password" };

export default async function ResetPasswordPage() {
  const supabase = await createServerSupabase();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login?error=link");

  return (
    <AuthSplitLayout
      panel={PANEL_COPY.login}
      back={{ href: "/dashboard", label: "Back to dashboard" }}
      switchTo={{ prompt: "Remembered it?", href: "/dashboard", label: "Continue" }}
    >
      <div className="flex flex-col gap-7">
        <div className="flex flex-col gap-3">
          <h1 className="text-page-title">Choose a new password</h1>
          <p className="text-body-md text-soft-white">You&apos;ll stay logged in on this device.</p>
        </div>
        <ResetPasswordForm />
      </div>
    </AuthSplitLayout>
  );
}
