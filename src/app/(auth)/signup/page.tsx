import { AuthSplitLayout, PANEL_COPY } from "@/components/auth/AuthSplitLayout";
import { RoleChooser } from "@/components/auth/RoleChooser";
import { StepIndicator } from "@/components/auth/StepIndicator";

export const metadata = { title: "Sign up" };

export default function SignUpRolePage() {
  return (
    <AuthSplitLayout
      panel={PANEL_COPY.artist}
      back={{ href: "/", label: "Back to home" }}
      switchTo={{ prompt: "Already have an account?", href: "/login", label: "Log in" }}
    >
      <div className="flex flex-col gap-10">
        <StepIndicator step={1} />
        <div className="flex flex-col gap-4">
          <h1 className="text-page-title">Who are you?</h1>
          <p className="text-body-lg text-soft-white">
            Pick the profile that fits you. It shapes your dashboard and what you can do on ReachRadar.
          </p>
        </div>
        <RoleChooser />
      </div>
    </AuthSplitLayout>
  );
}
