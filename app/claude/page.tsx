"use client";

import { useState, useMemo } from "react";
import { MessageSquare, Layers, ShieldCheck, Palette, Plug2, Database, Sliders, Plus, Trash2 } from "lucide-react";
import { SectionCard } from "@/components/custom/section-card";
import { FieldLabel } from "@/components/custom/field-label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/hooks/use-auth";
import { useSaveConfigFile } from "@/lib/hooks/use-save-config-file";
import { downloadTextFile } from "@/lib/download";
import {
  generateClaudeMarkdown,
  DEFAULT_CLAUDE_CONFIG,
  MCP_PRESETS,
  type ClaudeConfig,
  type McpTool,
} from "@/lib/generate-claude";

const WIZARD_STEPS = [
  { id: "language", label: "言語設定", icon: MessageSquare },
  { id: "framework", label: "フレームワーク", icon: Layers },
  { id: "quality", label: "コード品質", icon: ShieldCheck },
  { id: "design", label: "デザイン規約", icon: Palette },
  { id: "mcp", label: "MCPツール", icon: Plug2 },
  { id: "backend", label: "バックエンド統合", icon: Database },
  { id: "custom", label: "カスタムルール", icon: Sliders },
] as const;

// ── McpToolCard ─────────────────────────────────────────────────
function McpToolCard({
  tool,
  index,
  onChange,
  onRemove,
}: {
  tool: McpTool;
  index: number;
  onChange: (idx: number, key: keyof McpTool, value: string) => void;
  onRemove: (idx: number) => void;
}) {
  const inputCls = "h-8 text-xs";
  return (
    <div className="rounded-md border border-input bg-background p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Input
          placeholder="MCP名（例: Figma MCP）"
          value={tool.name}
          onChange={(e) => onChange(index, "name", e.target.value)}
          className="font-medium text-sm h-8 flex-1"
        />
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="p-1.5 text-muted-foreground hover:text-destructive transition-colors shrink-0"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-2xs font-medium text-muted-foreground">使用タイミング</label>
          <Input
            placeholder="例: UIコンポーネントの実装・修正時"
            value={tool.trigger}
            onChange={(e) => onChange(index, "trigger", e.target.value)}
            className={inputCls}
          />
        </div>
        <div className="space-y-1">
          <label className="text-2xs font-medium text-muted-foreground">主要ツール（カンマ区切り）</label>
          <Input
            placeholder="例: get_design_context, get_screenshot"
            value={tool.tools}
            onChange={(e) => onChange(index, "tools", e.target.value)}
            className={`${inputCls} font-mono`}
          />
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-2xs font-medium text-muted-foreground">補足・制約（改行で箇条書き）</label>
        <Textarea
          placeholder="例: DESIGN.md のカラートークンはFigmaの値と同期済みのため、実装時はFigma MCPの値を正とする"
          value={tool.notes}
          onChange={(e) => onChange(index, "notes", e.target.value)}
          className="min-h-16 text-xs"
        />
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────

export default function ClaudePage() {
  const [config, setConfig] = useState<ClaudeConfig>(DEFAULT_CLAUDE_CONFIG);
  const [activeSection, setActiveSection] = useState<string>("language");
  const { isLoggedIn, isLoading: isAuthLoading } = useAuth();
  const { fileName, setFileName, isSaving, save, fileCount, maxFiles, feedback } =
    useSaveConfigFile("CLAUDE.md");

  const preview = useMemo(() => generateClaudeMarkdown(config), [config]);

  const update = <K extends keyof ClaudeConfig>(key: K, value: ClaudeConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const updateMcp = (idx: number, key: keyof McpTool, value: string) => {
    setConfig((prev) => {
      const tools = prev.mcpTools.map((t, i) => (i === idx ? { ...t, [key]: value } : t));
      return { ...prev, mcpTools: tools };
    });
  };

  const addMcp = (preset?: McpTool) => {
    const newTool: McpTool = preset ?? { name: "", trigger: "", tools: "", notes: "" };
    setConfig((prev) => ({ ...prev, mcpTools: [...prev.mcpTools, newTool] }));
  };

  const removeMcp = (idx: number) => {
    setConfig((prev) => ({
      ...prev,
      mcpTools: prev.mcpTools.filter((_, i) => i !== idx),
    }));
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSection(id);
  };

  return (
    <>
      <div className="lg:hidden fixed inset-0 z-50 flex flex-col items-center justify-center bg-background gap-3 px-8 text-center">
        <p className="text-sm leading-[120%] tracking-[0.06em] font-bold text-foreground">PC でご覧ください</p>
        <p className="text-xs leading-[170%] tracking-[0.06em] text-muted-foreground">このページはデスクトップ（1024px 以上）向けに最適化されています。</p>
      </div>

      <main className="w-full max-w-7xl mx-auto px-6 pt-10 pb-12">
        <div className="grid gap-6 lg:grid-cols-[160px_1fr_1fr]">
          {/* Sidebar TOC */}
          <aside className="hidden lg:block">
            <nav className="sticky space-y-0.5" style={{ top: "calc(3.5rem + 1.5rem)" }}>
              {WIZARD_STEPS.map((step, i) => {
                const StepIcon = step.icon;
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => scrollToSection(step.id)}
                    className={cn(
                      "flex items-center gap-2 w-full text-left px-2.5 py-2 rounded-md text-xs transition-colors duration-ui",
                      activeSection === step.id
                        ? "bg-primary-surface text-primary font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <span className="w-4 shrink-0 text-2xs font-mono tabular-nums opacity-40">{i + 1}</span>
                    <StepIcon className="size-3 shrink-0" />
                    <span className="leading-tight truncate">{step.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Form */}
          <div className="space-y-6">
            {/* 1. 言語設定 */}
            <SectionCard id="language" label="言語設定" description="Claudeがユーザーと対話する言語を指定する" icon={MessageSquare}>
              <div className="space-y-1.5">
                <FieldLabel>コミュニケーション言語</FieldLabel>
                <Input
                  placeholder="例: 日本語"
                  value={config.language}
                  onChange={(e) => update("language", e.target.value)}
                />
              </div>
            </SectionCard>

            {/* 2. フレームワーク & ライブラリ */}
            <SectionCard id="framework" label="フレームワーク & ライブラリ" description="採用技術を明示し、Claudeが適切なコードを生成できるようにする" icon={Layers}>
              <div className="space-y-4">
                {(
                  [
                    { key: "framework", label: "Core", placeholder: "例: Next.js 16 (App Router), React 19" },
                    { key: "styling", label: "Styling", placeholder: "例: Tailwind CSS v4" },
                    { key: "uiLib", label: "UI Components", placeholder: "例: shadcn/ui" },
                    { key: "icons", label: "Icons", placeholder: "例: lucide-react" },
                    { key: "backend", label: "Backend", placeholder: "例: Supabase (Auth / SSR / Database)" },
                  ] as const
                ).map(({ key, label, placeholder }) => (
                  <div key={key} className="space-y-1.5">
                    <FieldLabel>{label}</FieldLabel>
                    <Input
                      placeholder={placeholder}
                      value={config[key]}
                      onChange={(e) => update(key, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* 3. コード品質原則 */}
            <SectionCard id="quality" label="コード品質原則" description="エンジニアリング原則とLintコマンドを定義する" icon={ShieldCheck}>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <FieldLabel>原則一覧</FieldLabel>
                  <Textarea
                    placeholder={"KISS: 常に最もシンプルな解決策を選択してください\nYAGNI: 現時点で必要な機能のみを実装してください\nDRY: コードの重複を排除してください"}
                    value={config.principles}
                    onChange={(e) => update("principles", e.target.value)}
                    className="min-h-24 text-sm"
                  />
                  <p className="text-2xs leading-[120%] tracking-[0.04em] text-muted-foreground">→ 改行すると箇条書きに出力されます</p>
                </div>
                <div className="space-y-1.5">
                  <FieldLabel>Lint コマンド</FieldLabel>
                  <Input
                    placeholder="例: npm run lint"
                    value={config.lintCmd}
                    onChange={(e) => update("lintCmd", e.target.value)}
                    className="font-mono text-sm"
                  />
                </div>
              </div>
            </SectionCard>

            {/* 4. デザイン規約 */}
            <SectionCard id="design" label="デザイン規約" description="デザインドキュメントへの参照とUIルールを定義する" icon={Palette}>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <FieldLabel>デザイン定義ファイル</FieldLabel>
                  <Input
                    placeholder="例: DESIGN.md"
                    value={config.designRef}
                    onChange={(e) => update("designRef", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <FieldLabel>追加ルール</FieldLabel>
                  <Textarea
                    placeholder={"DESIGN.md に定義されているカラーパレット、タイポグラフィ、スペーシングの規則を逸脱しないでください\nFigma MCP が利用可能な場合はそちらの値を正とする"}
                    value={config.designRules}
                    onChange={(e) => update("designRules", e.target.value)}
                    className="min-h-20 text-sm"
                  />
                  <p className="text-2xs leading-[120%] tracking-[0.04em] text-muted-foreground">→ 改行すると箇条書きに出力されます</p>
                </div>
              </div>
            </SectionCard>

            {/* 5. MCPツール */}
            <SectionCard id="mcp" label="MCPツール" description="利用可能なMCPサーバーとその使い方をClaudeに伝える" icon={Plug2}>
              <div className="space-y-4">
                {/* プリセット */}
                <div className="space-y-1.5">
                  <p className="text-xs text-muted-foreground">よく使われるMCP（クリックで追加）</p>
                  <div className="flex flex-wrap gap-2">
                    {MCP_PRESETS.map((preset) => (
                      <Badge
                        key={preset.label}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary-surface hover:text-primary hover:border-primary transition-colors px-3 py-1"
                        onClick={() => addMcp(preset.tool)}
                      >
                        <Plus className="size-3 mr-1" />
                        {preset.label}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* ツール一覧 */}
                {config.mcpTools.length > 0 && (
                  <div className="space-y-3">
                    {config.mcpTools.map((tool, i) => (
                      <McpToolCard
                        key={i}
                        tool={tool}
                        index={i}
                        onChange={updateMcp}
                        onRemove={removeMcp}
                      />
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => addMcp()}
                  className="flex items-center gap-1.5 w-full px-3 py-2.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-ui border border-dashed border-input"
                >
                  <Plus className="size-3" />
                  カスタムMCPを追加
                </button>
              </div>
            </SectionCard>

            {/* 6. バックエンド統合 */}
            <SectionCard id="backend" label="バックエンド統合" description="認証・DBアクセスなどのバックエンドルールを定義する" icon={Database}>
              <div className="space-y-1.5">
                <FieldLabel>統合ルール</FieldLabel>
                <Textarea
                  placeholder={"認証やデータ取得には @supabase/ssr を使用し、Server Components と Client Components の適切な責務分担を行ってください\nセッション管理やデータベース操作において、型安全性を確保するために定義された型定義を活用してください"}
                  value={config.backendRules}
                  onChange={(e) => update("backendRules", e.target.value)}
                  className="min-h-24 text-sm"
                />
                <p className="text-2xs leading-[120%] tracking-[0.04em] text-muted-foreground">→ 改行すると箇条書きに出力されます</p>
              </div>
            </SectionCard>

            {/* 7. カスタムルール */}
            <SectionCard id="custom" label="カスタムルール" description="上記カテゴリに当てはまらない独自の指示を自由記述する" icon={Sliders}>
              <div className="space-y-1.5">
                <FieldLabel>自由記述</FieldLabel>
                <Textarea
                  placeholder={"## Python\n- pip ではなく uv を使用すること\n\n## その他\n- 追加のルールをここに書いてください"}
                  value={config.customRules}
                  onChange={(e) => update("customRules", e.target.value)}
                  className="min-h-32 text-sm font-mono"
                />
              </div>
            </SectionCard>
          </div>

          {/* Preview & Save */}
          <div className="space-y-5">
            <div className="lg:sticky lg:top-20 space-y-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="claude-filename">ファイル名</Label>
                  {fileCount !== null && (
                    <span
                      className={`text-xs font-mono ${fileCount >= maxFiles ? "text-destructive" : "text-muted-foreground"}`}
                    >
                      {fileCount} / {maxFiles}
                    </span>
                  )}
                </div>
                <Input
                  id="claude-filename"
                  placeholder="CLAUDE.md"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  disabled={isSaving}
                />
              </div>

              <Textarea
                value={preview}
                readOnly
                className="h-[calc(100vh-400px)] min-h-64 font-mono text-xs"
              />

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => downloadTextFile(fileName || "CLAUDE.md", preview)}
                  className="flex-1"
                >
                  ダウンロード
                </Button>
                {!isAuthLoading &&
                  (isLoggedIn ? (
                    <Button onClick={() => save(preview)} disabled={isSaving} className="flex-1">
                      {isSaving ? "保存中..." : "保存"}
                    </Button>
                  ) : (
                    <a
                      href="/auth/login"
                      className={cn(buttonVariants({ variant: "default" }), "flex-1 justify-center")}
                    >
                      ログインして保存
                    </a>
                  ))}
              </div>
              {feedback && (
                <p
                  className={`text-xs leading-[160%] tracking-[0.04em] ${feedback.type === "success" ? "text-success" : "text-destructive"}`}
                >
                  {feedback.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
