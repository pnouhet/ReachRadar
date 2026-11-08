import { MailCheck } from "lucide-react";
import { AuthSplitLayout, PANEL_COPY } from "@/components/auth/AuthSplitLayout";
import { ResendConfirmationForm } from "@/components/auth/SimpleAuthForms";

export const metadata = { title: "Check your inbox" };

export default async function CheckEmailPage(props: PageProps<"/signup/check-email">) {
  const { email } = await props.searchParams;
  const address = typeof email === "string" ? email : "";

  return (
    <AuthSplitLayout
      panel={PANEL_COPY.artist}
      back={{ href: "/signup", label: "Back to sign up" }}
      switchTo={{ prompt: "Already confirmed?", href: "/login", label: "Log in" }}
    >
      <div className="flex flex-col gap-8">
        <MailCheck size={40} strokeWidth={1.5} className="text-cyan" aria-hidden />
        <div className="flex flex-col gap-3">
          <h1 className="text-page-title">Check your inbox</h1>
          <p className="text-body-lg text-soft-white">
            We sent a confirmation link to{" "}
            {address ? <strong className="font-semibold break-all text-white">{address}</strong> : "your email address"}.
            Open it to activate your account.
          </p>
          <p className="text-body-sm text-muted">No email after a few minutes? Check your spam folder or send it again.</p>
        </div>
        {address && <ResendConfirmationForm email={address} />}
      </div>
    </AuthSplitLayout>
  );
}
