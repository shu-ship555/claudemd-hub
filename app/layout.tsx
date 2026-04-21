import type { Metadata } from "next";
import { Inter, Geist_Mono, Noto_Sans_JP } from "next/font/google";
import { Providers } from "@/providers";
import { DashboardHeader } from "@/components/dashboard-header";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Claude Config Manager",
  description: "Claude Code の設定ファイルを管理・整理します",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${inter.variable} ${notoSansJP.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers>
          <DashboardHeader title="Claude Config Manager" />
          {children}
        </Providers>
      </body>
    </html>
  );
}
