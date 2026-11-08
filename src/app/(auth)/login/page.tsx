import { AuthSplitLayout, PANEL_COPY } from "@/components/auth/AuthSplitLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import { safeNext } from "@/lib/auth/safe-next";

export const metadata = { title: "Log in" };

export default async function LoginPage(props: PageProps<"/login">) {
  const { next, error } = await props.searchParams;
  const nextPath = typeof next === "string" ? safeNext(next) : undefined;

  return (
    <AuthSplitLayout
      panel={PANEL_COPY.login}
      back={{ href: "/", label: "Back to home" }}
      switchTo={{ prompt: "New to ReachRadar?", href: "/signup", label: "Sign up" }}
    >
      <LoginForm next={nextPath} linkError={error === "link"} />
    </AuthSplitLayout>
  );
}
