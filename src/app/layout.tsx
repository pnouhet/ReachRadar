import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "ReachRadar", template: "%s · ReachRadar" },
  description: "Pitch smarter. Pay only for real feedback. Grow real fans.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
