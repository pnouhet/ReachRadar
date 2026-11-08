import { AuthSplitLayout, PANEL_COPY } from "@/components/auth/AuthSplitLayout";
import { SignUpForm } from "@/components/auth/SignUpForm";

export const metadata = { title: "Join as an artist" };

export default function SignUpArtistPage() {
  return (
    <AuthSplitLayout
      panel={PANEL_COPY.artist}
      back={{ href: "/signup", label: "Change profile" }}
      switchTo={{ prompt: "Already have an account?", href: "/login", label: "Log in" }}
    >
      <SignUpForm role="artist" />
    </AuthSplitLayout>
  );
}
