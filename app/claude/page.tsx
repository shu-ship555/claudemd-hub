"use client";

import { useState, useMemo } from "react";
import { MessageSquare, Plug2, Sliders, Plus, Trash2, Link2, Wrench } from "lucide-react";
import { SectionCard } from "@/components/custom/section-card";
import { FieldLabel } from "@/components/custom/field-label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/lib/hooks/use-auth";
import { useSaveConfigFile } from "@/lib/hooks/use-save-config-file";
import { generateClaudeMarkdown, DEFAULT_CLAUDE_CONFIG, MCP_PRESETS, type ClaudeConfig, type McpTool } from "@/lib/generate-claude";
import { MobileGuard } from "@/components/custom/mobile-guard";
import { WizardSidebar } from "@/components/patterns/wizard-sidebar";
import { PreviewSavePanel } from "@/components/patterns/preview-save-panel";

const CLAUDE_MODE_OPTIONS = ["デフォルト", "カスタム"] as const;

const DEFAULT_CLAUDE_PREVIEW = `# CLAUDE.md

@AGENTS.md
@DESIGN.md
`;

const WIZARD_STEPS = [
  { id: "refs", label: "参照ファイル", icon: Link2 },
  { id: "language", label: "言語設定", icon: MessageSquare },
  { id: "mcp", label: "MCPツール", icon: Plug2 },
  { id: "refactoring", label: "リファクタリング", icon: Wrench },
  { id: "custom", label: "カスタムルール", icon: Sliders },
] as const;

// ── McpToolCard ─────────────────────────────────────────────────
function McpToolCard({ tool, index, onChange, onRemove }: { tool: McpTool; index: number; onChange: (idx: number, key: keyof McpTool, value: string) => void; onRemove: (idx: number) => void }) {
  const inputCls = "h-8 text-xs";
  return (
    <div className="rounded-md border border-input bg-background p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Input placeholder="MCP名（ Figma MCP）" value={tool.name} onChange={(e) => onChange(index, "name", e.target.value)} className="font-medium text-sm h-8 flex-1" />
        <button type="button" onClick={() => onRemove(index)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors shrink-0">
          <Trash2 className="size-3.5" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-2xs font-medium text-muted-foreground">使用タイミング</label>
          <Input placeholder="UIコンポーネントの実装・修正時" value={tool.trigger} onChange={(e) => onChange(index, "trigger", e.target.value)} className={inputCls} />
        </div>
        <div className="space-y-1">
          <label className="text-2xs font-medium text-muted-foreground">主要ツール（カンマ区切り）</label>
          <Input placeholder="get_design_context, get_screenshot" value={tool.tools} onChange={(e) => onChange(index, "tools", e.target.value)} className={`${inputCls} font-mono`} />
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-2xs font-medium text-muted-foreground">補足・制約（改行で箇条書き）</label>
        <Textarea placeholder="DESIGN.md のカラートークンはFigmaの値と同期済みのため、実装時はFigma MCPの値を正とする" value={tool.notes} onChange={(e) => onChange(index, "notes", e.target.value)} className="min-h-16 text-xs" />
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────

export default function ClaudePage() {
  const [config, setConfig] = useState<ClaudeConfig>(DEFAULT_CLAUDE_CONFIG);
  const [activeSection, setActiveSection] = useState<string>("language");
  const [claudeMode, setClaudeMode] = useState("");
  const { isLoggedIn, isLoading: isAuthLoading } = useAuth();
  const { fileName, setFileName, isSaving, save, fileCount, maxFiles, feedback } = useSaveConfigFile("CLAUDE.md");

  const isCustom = claudeMode === "カスタム";
  const generatedPreview = useMemo(() => generateClaudeMarkdown(config), [config]);
  const preview = isCustom ? generatedPreview : claudeMode === "デフォルト" ? DEFAULT_CLAUDE_PREVIEW : "# CLAUDE.md";

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
      <MobileGuard />

      <main className="w-full max-w-7xl mx-auto px-6 pt-10 pb-12">
        <div className={isCustom ? "grid gap-6 lg:grid-cols-[160px_1fr_1fr]" : "grid gap-12 lg:grid-cols-2"}>
          {/* Sidebar TOC — カスタム時のみ表示 */}
          {isCustom && (
            <WizardSidebar steps={WIZARD_STEPS} activeSection={activeSection} onNavigate={scrollToSection} />
          )}

          {/* Form */}
          <div className="space-y-6">
            {/* モード選択 */}
            <div className="space-y-2">
              <FieldLabel requirement="required">CLAUDE.mdの種類</FieldLabel>
              <Select value={claudeMode} onValueChange={setClaudeMode}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  {CLAUDE_MODE_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isCustom && (
              <>
                {/* 0. 参照ファイル */}
                <SectionCard id="refs" label="参照ファイル" description="@構文で読み込む外部ファイルのパスを指定する（CLAUDE.md からの相対パス）" icon={Link2}>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <FieldLabel>AGENTS.md のパス</FieldLabel>
                      <Input placeholder="AGENTS.md / docs/AGENTS.md" value={config.agentsPath} onChange={(e) => update("agentsPath", e.target.value)} className="font-mono text-sm" />
                    </div>
                    <div className="space-y-1.5">
                      <FieldLabel>DESIGN.md のパス</FieldLabel>
                      <Input placeholder="DESIGN.md / docs/DESIGN.md" value={config.designPath} onChange={(e) => update("designPath", e.target.value)} className="font-mono text-sm" />
                    </div>
                    <p className="text-2xs leading-[140%] tracking-[0.04em] text-muted-foreground">パスを空にするとその参照は出力されません。CLAUDE.md と同じディレクトリにある場合はファイル名のみで構いません。</p>
                  </div>
                </SectionCard>

                {/* 1. 言語設定 */}
                <SectionCard id="language" label="言語設定" description="Claudeがユーザーと対話する言語を指定する" icon={MessageSquare}>
                  <div className="space-y-1.5">
                    <FieldLabel>コミュニケーション言語</FieldLabel>
                    <Input placeholder="日本語" value={config.language} onChange={(e) => update("language", e.target.value)} />
                  </div>
                </SectionCard>

                {/* 2. MCPツール */}
                <SectionCard id="mcp" label="MCPツール" description="利用可能なMCPサーバーとその使い方をClaudeに伝える" icon={Plug2}>
                  <div className="space-y-4">
                    {/* プリセット */}
                    <div className="space-y-1.5">
                      <p className="text-xs text-muted-foreground">よく使われるMCP（クリックで追加）</p>
                      <div className="flex flex-wrap gap-2">
                        {MCP_PRESETS.map((preset) => (
                          <Badge key={preset.label} variant="outline" className="cursor-pointer hover:bg-primary-surface hover:text-primary hover:border-primary transition-colors px-3 py-1" onClick={() => addMcp(preset.tool)}>
                            <Plus className="size-3" />
                            {preset.label}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* ツール一覧 */}
                    {config.mcpTools.length > 0 && (
                      <div className="space-y-3">
                        {config.mcpTools.map((tool, i) => (
                          <McpToolCard key={i} tool={tool} index={i} onChange={updateMcp} onRemove={removeMcp} />
                        ))}
                      </div>
                    )}

                    <button type="button" onClick={() => addMcp()} className="flex items-center gap-1.5 w-full px-3 py-2.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-ui border border-dashed border-input">
                      <Plus className="size-3" />
                      カスタムMCPを追加
                    </button>
                  </div>
                </SectionCard>

                {/* 4. リファクタリング */}
                <SectionCard id="refactoring" label="リファクタリング" description="重複・最適化を検知した際の Claudeの行動手順を定義する" icon={Wrench}>
                  <div className="space-y-1.5">
                    <FieldLabel>リファクタリングルール</FieldLabel>
                    <Textarea placeholder={"重複箇所を発見した場合、まずユーザーに報告して共通化プランを提示すること\n承認を得てから実装すること\n早すぎる抽象化は避け、3回以上の重複が確認されてから共通化を検討すること"} value={config.refactoringRules} onChange={(e) => update("refactoringRules", e.target.value)} className="min-h-24 text-sm" />
                    <p className="text-2xs leading-[120%] tracking-[0.04em] text-muted-foreground">→ 改行すると箇条書きに出力されます</p>
                  </div>
                </SectionCard>

                {/* 7. カスタムルール */}
                <SectionCard id="custom" label="カスタムルール" description="上記カテゴリに当てはまらない独自の指示を自由記述する" icon={Sliders}>
                  <div className="space-y-1.5">
                    <FieldLabel>自由記述</FieldLabel>
                    <Textarea placeholder={"## Python\n- pip ではなく uv を使用すること\n\n## その他\n- 追加のルールをここに書いてください"} value={config.customRules} onChange={(e) => update("customRules", e.target.value)} className="min-h-32 text-sm font-mono" />
                  </div>
                </SectionCard>
              </>
            )}
          </div>

          {/* Preview & Save */}
          <PreviewSavePanel
            fileNameInputId="claude-filename"
            defaultFileName="CLAUDE.md"
            fileName={fileName}
            setFileName={setFileName}
            fileCount={fileCount}
            maxFiles={maxFiles}
            isSaving={isSaving}
            isLoggedIn={isLoggedIn}
            isAuthLoading={isAuthLoading}
            preview={preview}
            onSave={() => save(preview)}
            feedback={feedback}
          />
        </div>
      </main>
    </>
  );
}
