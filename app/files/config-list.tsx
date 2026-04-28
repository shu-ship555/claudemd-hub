"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { deleteConfigFile } from "@/app/actions";
import type { ConfigFile } from "@/app/actions";

export default function ConfigList({ configs }: { configs: ConfigFile[] }) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDownload = (config: ConfigFile) => {
    const blob = new Blob([config.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = config.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteConfigFile(id);
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setDeletingId(null);
    }
  };

  if (configs.length === 0) {
    return <div className="text-muted-foreground">設定ファイルがまだありません。新しいファイルをアップロードしてください。</div>;
  }

  return (
    <div className="space-y-3">
      {configs.map((config) => (
        <Card key={config.id} className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="text-base mb-1">{config.name}</CardTitle>
                <CardDescription>更新: {new Date(config.updated_at).toLocaleString("ja-JP")}</CardDescription>
              </div>
              <div className="flex gap-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" disabled={deletingId === config.id}>
                      {deletingId === config.id ? "削除中..." : "削除"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>ファイルを削除しますか？</AlertDialogTitle>
                      <AlertDialogDescription>この操作は取り消せません。削除したファイルは復元できません。</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>キャンセル</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(config.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        削除する
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button variant="default" size="sm" onClick={() => handleDownload(config)}>
                  <Download className="size-4" />
                  ダウンロード
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md bg-muted p-3 font-mono text-xs max-h-32 overflow-auto text-muted-foreground">{config.content}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
