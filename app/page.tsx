import Link from "next/link";
import { Palette, Bot, FileCode2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const TOOLS = [
  {
    href: "/claude",
    icon: FileCode2,
    title: "CLAUDE.md",
    description: "Claude Code 専用の設定ファイルを生成します。MCP ツールの使い方や Claude 固有のルールを記述します。",
  },
  {
    href: "/agent",
    icon: Bot,
    title: "AGENTS.md",
    description: "フレームワーク非依存のエージェント向け指示書を生成します。技術スタック・Git規約・アーキテクチャを記述します。",
  },
  {
    href: "/design",
    icon: Palette,
    title: "DESIGN.md",
    description: "カラーパレット・タイポグラフィ・コンポーネント規約を定義する設計ガイドラインを生成します。",
  },
] as const;

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 pt-4 pb-12">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Claude Config Manager</h2>
          <p className="text-sm text-muted-foreground">Claude Code の設定ファイルを生成・管理します</p>
        </div>

        <div className="grid gap-4">
          {TOOLS.map(({ href, icon: Icon, title, description }) => (
            <Link key={href} href={href}>
              <Card className="px-8 pt-8 pb-10 gap-2 group cursor-pointer transition-colors hover:border-primary hover:bg-primary-surface/30">
                <CardHeader className="p-0">
                  <CardTitle className="flex items-center gap-2 text-base group-hover:text-primary transition-colors">
                    <Icon className="size-4 shrink-0" />
                    {title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <CardDescription className="text-xs leading-relaxed">{description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground">
          アカウントをお持ちの方は{" "}
          <Link href="/auth/login" className="font-medium text-primary hover:underline">
            ログイン
          </Link>{" "}
          または{" "}
          <Link href="/auth/signup" className="font-medium text-primary hover:underline">
            新規登録
          </Link>
        </p>
      </div>
    </main>
  );
}
