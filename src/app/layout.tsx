import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import { OutlineFilter } from "@/components/ui/OutlineFilter";
import "./globals.css";

const syne = Syne({ subsets: ["latin"], weight: ["500", "600", "700", "800"], variable: "--font-syne" });
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: { default: "ReachRadar", template: "%s · ReachRadar" },
  description: "Pitch smarter. Pay only for real feedback. Grow real fans.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${syne.variable} ${inter.variable}`}>
      <body>
        <OutlineFilter />
        {children}
      </body>
    </html>
  );
}
