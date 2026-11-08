import { AuthSplitLayout, PANEL_COPY } from "@/components/auth/AuthSplitLayout";
import { ForgotPasswordForm } from "@/components/auth/SimpleAuthForms";

export const metadata = { title: "Forgot password" };

export default function ForgotPasswordPage() {
  return (
    <AuthSplitLayout
      panel={PANEL_COPY.login}
      back={{ href: "/login", label: "Back to log in" }}
      switchTo={{ prompt: "New to ReachRadar?", href: "/signup", label: "Sign up" }}
    >
      <div className="flex flex-col gap-7">
        <div className="flex flex-col gap-3">
          <h1 className="text-page-title">Forgot your password?</h1>
          <p className="text-body-md text-soft-white">Enter your email and we&apos;ll send you a link to choose a new one.</p>
        </div>
        <ForgotPasswordForm />
      </div>
    </AuthSplitLayout>
  );
}
