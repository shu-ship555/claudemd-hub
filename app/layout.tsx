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
  title: "Claude Config Generator",
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
          <div className="lg:hidden fixed inset-0 z-50 flex flex-col items-center justify-center bg-background gap-3 px-8 text-center">
            <p className="text-sm leading-[120%] tracking-[0.06em] font-bold text-foreground">PC でご覧ください</p>
            <p className="text-xs leading-[170%] tracking-[0.06em] text-muted-foreground">このページはデスクトップ（1024px 以上）向けに最適化されています。</p>
          </div>
          <div className="hidden lg:block">
            <DashboardHeader title="Claude Config Generator" />
          </div>
          {children}
        </Providers>
      </body>
    </html>
  );
}
