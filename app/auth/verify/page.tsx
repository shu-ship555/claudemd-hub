"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CenteredCard } from "@/components/custom/centered-card";

export default function VerifyPage() {
  return (
    <CenteredCard
      title="メールを確認してください"
      description="確認用リンクをメールで送信しました"
    >
      <div className="flex flex-col gap-4">
        <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
          <p>メールに記載されているリンクをクリックして、アカウントを有効化してください。</p>
        </div>

        <div className="text-sm text-muted-foreground space-y-2">
          <p>メールが届かない場合は、迷惑メールフォルダをご確認いただくか、再度登録をお試しください。</p>
        </div>

        <Link href="/auth/login">
          <Button variant="outline" className="w-full">
            ログインに戻る
          </Button>
        </Link>
      </div>
    </CenteredCard>
  );
}
