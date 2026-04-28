import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ConfigList from "./config-list";
import { getConfigFiles } from "@/app/actions";
import type { ConfigFile } from "@/lib/types";
import { fetchSupabaseUser } from "@/lib/supabase-auth";

export default async function FilesPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("sb-access-token")?.value;

  if (!accessToken) {
    redirect("/auth/login");
  }

  const user = await fetchSupabaseUser(accessToken);
  if (!user) {
    redirect("/auth/login");
  }

  let configs: ConfigFile[] = [];
  try {
    configs = await getConfigFiles();
  } catch (error) {
    console.error("Failed to fetch configs:", error);
  }

  return (
    <main className="w-full max-w-7xl mx-auto px-6 pt-16 pb-20">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle>設定ファイル一覧</CardTitle>
            <CardDescription>Claude Code の設定ファイルを管理・同期します</CardDescription>
          </div>
          <span className={`text-sm font-mono ${configs.length >= 10 ? "text-destructive" : "text-muted-foreground"}`}>{configs.length}&nbsp;/&nbsp;10</span>
        </CardHeader>
        <CardContent>
          <ConfigList configs={configs} />
        </CardContent>
      </Card>
    </main>
  );
}
