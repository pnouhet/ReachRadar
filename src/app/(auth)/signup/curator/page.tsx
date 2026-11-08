import { AuthSplitLayout, PANEL_COPY } from "@/components/auth/AuthSplitLayout";
import { SignUpForm } from "@/components/auth/SignUpForm";

export const metadata = { title: "Join as a pro" };

export default function SignUpCuratorPage() {
  return (
    <AuthSplitLayout
      panel={PANEL_COPY.curator}
      back={{ href: "/signup", label: "Change profile" }}
      switchTo={{ prompt: "Already have an account?", href: "/login", label: "Log in" }}
    >
      <SignUpForm role="curator" />
    </AuthSplitLayout>
  );
}
