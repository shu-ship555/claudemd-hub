"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Info, Layers, FolderOpen, Terminal, Code, Blocks, GitBranch, Bot, Server, Plus, Trash2, ChevronRight, ChevronLeft, GripVertical } from "lucide-react";
import { SectionCard } from "@/components/custom/section-card";
import { FieldLabel } from "@/components/custom/field-label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/hooks/use-auth";
import { useSaveConfigFile } from "@/lib/hooks/use-save-config-file";
import { generateAgentMarkdown, DEFAULT_AGENT_CONFIG, type AgentConfig, type TechRow3 } from "@/lib/generate-agent";
import { useDragAndDrop } from "@/lib/hooks/use-drag-and-drop";
import { MobileGuard } from "@/components/custom/mobile-guard";
import { WizardSidebar } from "@/components/patterns/wizard-sidebar";
import { PreviewSavePanel } from "@/components/patterns/preview-save-panel";
import { ScrollSyncToggle } from "@/components/patterns/scroll-sync-toggle";
import { useScrollSync } from "@/lib/hooks/use-scroll-sync";

type TechField3 = "frontendStack" | "backendStack" | "infraStack" | "devTools" | "namingRules" | "branchNaming" | "commitTypes" | "envVars" | "externalServices";

type ColPlaceholder = { role?: string; tech?: string; note?: string };

type PresetItem = { label: string; row: TechRow3 };
type PresetGroup = { group: string; items: PresetItem[] };
const TECH_PRESETS: Record<"frontendStack" | "backendStack" | "infraStack" | "devTools", PresetGroup[]> = {
  frontendStack: [
    {
      group: "フレームワーク",
      items: [
        { label: "Next.js", row: { role: "フレームワーク", tech: "Next.js", note: "" } },
        { label: "React", row: { role: "フレームワーク", tech: "React", note: "" } },
        { label: "Vue.js", row: { role: "フレームワーク", tech: "Vue.js", note: "" } },
        { label: "Nuxt", row: { role: "フレームワーク", tech: "Nuxt.js", note: "" } },
        { label: "SvelteKit", row: { role: "フレームワーク", tech: "SvelteKit", note: "" } },
        { label: "Astro", row: { role: "フレームワーク", tech: "Astro", note: "" } },
      ],
    },
    {
      group: "言語",
      items: [
        { label: "TypeScript", row: { role: "言語", tech: "TypeScript", note: "" } },
        { label: "JavaScript", row: { role: "言語", tech: "JavaScript", note: "" } },
      ],
    },
    {
      group: "スタイリング",
      items: [
        { label: "Tailwind CSS", row: { role: "スタイリング", tech: "Tailwind CSS", note: "" } },
        { label: "CSS Modules", row: { role: "スタイリング", tech: "CSS Modules", note: "" } },
        { label: "styled-components", row: { role: "スタイリング", tech: "styled-components", note: "" } },
      ],
    },
    {
      group: "状態管理",
      items: [
        { label: "Zustand", row: { role: "状態管理", tech: "Zustand", note: "" } },
        { label: "Jotai", row: { role: "状態管理", tech: "Jotai", note: "" } },
        { label: "Redux Toolkit", row: { role: "状態管理", tech: "Redux Toolkit", note: "" } },
      ],
    },
    {
      group: "データフェッチ",
      items: [
        { label: "TanStack Query", row: { role: "データフェッチ", tech: "TanStack Query", note: "" } },
        { label: "SWR", row: { role: "データフェッチ", tech: "SWR", note: "" } },
      ],
    },
    {
      group: "ビルドツール",
      items: [
        { label: "Vite", row: { role: "ビルドツール", tech: "Vite", note: "" } },
        { label: "Turbopack", row: { role: "ビルドツール", tech: "Turbopack", note: "" } },
      ],
    },
    {
      group: "AWS",
      items: [
        { label: "Amplify", row: { role: "ホスティング", tech: "AWS Amplify", note: "" } },
        { label: "CloudFront", row: { role: "CDN", tech: "Amazon CloudFront", note: "" } },
        { label: "S3", row: { role: "静的ファイル配信", tech: "Amazon S3", note: "" } },
      ],
    },
    {
      group: "GCP",
      items: [
        { label: "Firebase Hosting", row: { role: "ホスティング", tech: "Firebase Hosting", note: "" } },
        { label: "Cloud CDN", row: { role: "CDN", tech: "Cloud CDN", note: "" } },
        { label: "Cloud Storage", row: { role: "静的ファイル配信", tech: "Cloud Storage", note: "" } },
      ],
    },
  ],
  backendStack: [
    {
      group: "ランタイム",
      items: [
        { label: "Node.js", row: { role: "ランタイム", tech: "Node.js", note: "" } },
        { label: "Bun", row: { role: "ランタイム", tech: "Bun", note: "" } },
        { label: "Deno", row: { role: "ランタイム", tech: "Deno", note: "" } },
      ],
    },
    {
      group: "フレームワーク",
      items: [
        { label: "NestJS", row: { role: "フレームワーク", tech: "NestJS", note: "" } },
        { label: "Express", row: { role: "フレームワーク", tech: "Express", note: "" } },
        { label: "Hono", row: { role: "フレームワーク", tech: "Hono", note: "" } },
        { label: "FastAPI", row: { role: "フレームワーク", tech: "FastAPI", note: "" } },
        { label: "Django", row: { role: "フレームワーク", tech: "Django", note: "" } },
        { label: "Rails", row: { role: "フレームワーク", tech: "Ruby on Rails", note: "" } },
      ],
    },
    {
      group: "言語",
      items: [
        { label: "TypeScript", row: { role: "言語", tech: "TypeScript", note: "" } },
        { label: "Python", row: { role: "言語", tech: "Python", note: "" } },
        { label: "Go", row: { role: "言語", tech: "Go", note: "" } },
        { label: "Rust", row: { role: "言語", tech: "Rust", note: "" } },
        { label: "Java", row: { role: "言語", tech: "Java", note: "" } },
      ],
    },
    {
      group: "API",
      items: [
        { label: "REST", row: { role: "API", tech: "REST", note: "" } },
        { label: "GraphQL", row: { role: "API", tech: "GraphQL", note: "" } },
        { label: "tRPC", row: { role: "API", tech: "tRPC", note: "" } },
        { label: "gRPC", row: { role: "API", tech: "gRPC", note: "" } },
      ],
    },
    {
      group: "ORM",
      items: [
        { label: "Prisma", row: { role: "ORM", tech: "Prisma", note: "" } },
        { label: "Drizzle", row: { role: "ORM", tech: "Drizzle ORM", note: "" } },
        { label: "TypeORM", row: { role: "ORM", tech: "TypeORM", note: "" } },
        { label: "SQLAlchemy", row: { role: "ORM", tech: "SQLAlchemy", note: "" } },
      ],
    },
    {
      group: "AWS",
      items: [
        { label: "EC2", row: { role: "コンピューティング", tech: "Amazon EC2", note: "" } },
        { label: "ECS / Fargate", row: { role: "コンテナ実行", tech: "Amazon ECS / Fargate", note: "" } },
        { label: "Lambda", row: { role: "サーバーレス", tech: "AWS Lambda", note: "" } },
        { label: "EKS", row: { role: "Kubernetes", tech: "Amazon EKS", note: "" } },
        { label: "API Gateway", row: { role: "APIゲートウェイ", tech: "Amazon API Gateway", note: "" } },
        { label: "Cognito", row: { role: "認証", tech: "Amazon Cognito", note: "" } },
        { label: "SQS", row: { role: "メッセージキュー", tech: "Amazon SQS", note: "" } },
        { label: "SES", row: { role: "メール送信", tech: "Amazon SES", note: "" } },
      ],
    },
    {
      group: "GCP",
      items: [
        { label: "Cloud Run", row: { role: "コンテナ / サーバーレス", tech: "Cloud Run", note: "" } },
        { label: "Cloud Functions", row: { role: "サーバーレス", tech: "Cloud Functions", note: "" } },
        { label: "App Engine", row: { role: "PaaS", tech: "App Engine", note: "" } },
        { label: "GKE", row: { role: "Kubernetes", tech: "Google Kubernetes Engine", note: "" } },
        { label: "Pub/Sub", row: { role: "メッセージキュー", tech: "Cloud Pub/Sub", note: "" } },
      ],
    },
  ],
  infraStack: [
    {
      group: "データベース",
      items: [
        { label: "PostgreSQL", row: { role: "データベース", tech: "PostgreSQL", note: "" } },
        { label: "MySQL", row: { role: "データベース", tech: "MySQL", note: "" } },
        { label: "MongoDB", row: { role: "データベース", tech: "MongoDB", note: "" } },
        { label: "SQLite", row: { role: "データベース", tech: "SQLite", note: "" } },
        { label: "Supabase", row: { role: "データベース / BaaS", tech: "Supabase", note: "" } },
        { label: "Firebase", row: { role: "データベース / BaaS", tech: "Firebase", note: "" } },
      ],
    },
    {
      group: "キャッシュ",
      items: [
        { label: "Redis", row: { role: "キャッシュ", tech: "Redis", note: "" } },
        { label: "Memcached", row: { role: "キャッシュ", tech: "Memcached", note: "" } },
      ],
    },
    {
      group: "ホスティング",
      items: [
        { label: "Vercel", row: { role: "ホスティング", tech: "Vercel", note: "" } },
        { label: "Azure", row: { role: "ホスティング", tech: "Azure", note: "" } },
        { label: "Fly.io", row: { role: "ホスティング", tech: "Fly.io", note: "" } },
        { label: "Railway", row: { role: "ホスティング", tech: "Railway", note: "" } },
      ],
    },
    {
      group: "AWS",
      items: [
        { label: "S3", row: { role: "ストレージ", tech: "Amazon S3", note: "" } },
        { label: "RDS", row: { role: "データベース", tech: "Amazon RDS", note: "" } },
        { label: "Aurora", row: { role: "データベース", tech: "Amazon Aurora", note: "" } },
        { label: "DynamoDB", row: { role: "NoSQLデータベース", tech: "Amazon DynamoDB", note: "" } },
        { label: "ElastiCache", row: { role: "キャッシュ", tech: "Amazon ElastiCache", note: "" } },
        { label: "ECR", row: { role: "コンテナレジストリ", tech: "Amazon ECR", note: "" } },
      ],
    },
    {
      group: "GCP",
      items: [
        { label: "Cloud Storage", row: { role: "ストレージ", tech: "Cloud Storage", note: "" } },
        { label: "Cloud SQL", row: { role: "データベース", tech: "Cloud SQL", note: "" } },
        { label: "BigQuery", row: { role: "データ分析", tech: "BigQuery", note: "" } },
        { label: "Firestore", row: { role: "NoSQLデータベース", tech: "Cloud Firestore", note: "" } },
        { label: "Memorystore", row: { role: "キャッシュ", tech: "Cloud Memorystore", note: "" } },
        { label: "Artifact Registry", row: { role: "コンテナレジストリ", tech: "Artifact Registry", note: "" } },
      ],
    },
    {
      group: "コンテナ",
      items: [
        { label: "Docker", row: { role: "コンテナ", tech: "Docker", note: "" } },
        { label: "Kubernetes", row: { role: "コンテナオーケストレーション", tech: "Kubernetes", note: "" } },
      ],
    },
    {
      group: "CDN / エッジ",
      items: [
        { label: "Cloudflare", row: { role: "CDN / エッジ", tech: "Cloudflare", note: "" } },
        { label: "Fastly", row: { role: "CDN", tech: "Fastly", note: "" } },
      ],
    },
  ],
  devTools: [
    {
      group: "Lint / フォーマット",
      items: [
        { label: "ESLint", row: { role: "Linter", tech: "ESLint", note: "" } },
        { label: "Prettier", row: { role: "フォーマッター", tech: "Prettier", note: "" } },
        { label: "Biome", row: { role: "Linter / フォーマッター", tech: "Biome", note: "" } },
      ],
    },
    {
      group: "テスト",
      items: [
        { label: "Vitest", row: { role: "テスト", tech: "Vitest", note: "" } },
        { label: "Jest", row: { role: "テスト", tech: "Jest", note: "" } },
        { label: "Playwright", row: { role: "E2Eテスト", tech: "Playwright", note: "" } },
        { label: "Cypress", row: { role: "E2Eテスト", tech: "Cypress", note: "" } },
      ],
    },
    {
      group: "パッケージ管理",
      items: [
        { label: "pnpm", row: { role: "パッケージマネージャー", tech: "pnpm", note: "" } },
        { label: "npm", row: { role: "パッケージマネージャー", tech: "npm", note: "" } },
        { label: "Bun", row: { role: "パッケージマネージャー", tech: "Bun", note: "" } },
      ],
    },
    {
      group: "CI/CD",
      items: [
        { label: "GitHub Actions", row: { role: "CI/CD", tech: "GitHub Actions", note: "" } },
        { label: "CircleCI", row: { role: "CI/CD", tech: "CircleCI", note: "" } },
        { label: "CodePipeline", row: { role: "CI/CD", tech: "AWS CodePipeline", note: "" } },
        { label: "Cloud Build", row: { role: "CI/CD", tech: "Cloud Build", note: "" } },
      ],
    },
    {
      group: "モノレポ",
      items: [
        { label: "Turborepo", row: { role: "モノレポ", tech: "Turborepo", note: "" } },
        { label: "Nx", row: { role: "モノレポ", tech: "Nx", note: "" } },
      ],
    },
    {
      group: "その他",
      items: [
        { label: "Storybook", row: { role: "UIカタログ", tech: "Storybook", note: "" } },
        { label: "Docker", row: { role: "コンテナ", tech: "Docker", note: "" } },
      ],
    },
  ],
};

const NAMING_PRESETS = ["camelCase", "PascalCase", "UPPER_SNAKE_CASE", "kebab-case", "snake_case", "flatcase"];

const BRANCH_NAMING_TEMPLATE: TechRow3[] = [
  { role: "feature", tech: "/[issue番号]-[簡潔な説明]", note: "feature/42-add-user-auth" },
  { role: "fix", tech: "/[issue番号]-[簡潔な説明]", note: "fix/88-null-pointer-login" },
  { role: "hotfix", tech: "/[説明]", note: "hotfix/critical-security-patch" },
  { role: "chore", tech: "/[説明]", note: "chore/update-dependencies" },
  { role: "docs", tech: "/[説明]", note: "docs/update-readme" },
  { role: "release", tech: "/[バージョン]", note: "release/1.2.0" },
];

const COMMIT_TYPES_TEMPLATE: TechRow3[] = [
  { role: "feat", tech: "新機能の追加", note: "" },
  { role: "fix", tech: "バグ修正", note: "" },
  { role: "docs", tech: "ドキュメントのみの変更", note: "" },
  { role: "style", tech: "コード整形・フォーマット", note: "" },
  { role: "refactor", tech: "リファクタリング", note: "" },
  { role: "test", tech: "テストの追加・修正", note: "" },
  { role: "chore", tech: "ビルド・設定変更", note: "" },
  { role: "perf", tech: "パフォーマンス改善", note: "" },
  { role: "ci", tech: "CI設定の変更", note: "" },
];

const ENV_PRESETS = ["ブラウザ", "Node.js 20+", "Node.js 22+", "Docker / Linux", "Cloudflare Workers", "Vercel", "iOS", "Android"];

const REPO_STRUCTURE_TEMPLATE = [
  { name: "src/", comment: "ソースコード", depth: 0 },
  { name: "components/", comment: "UIコンポーネント", depth: 1 },
  { name: "features/", comment: "機能別モジュール", depth: 1 },
  { name: "lib/", comment: "ユーティリティ・ロジック", depth: 1 },
  { name: "hooks/", comment: "カスタムフック", depth: 2 },
  { name: "utils/", comment: "ユーティリティ関数", depth: 2 },
  { name: "types/", comment: "型定義", depth: 1 },
  { name: "config/", comment: "設定ファイル", depth: 1 },
  { name: "tests/", comment: "テスト", depth: 0 },
  { name: "public/", comment: "静的ファイル", depth: 0 },
];

interface TechTableProps {
  rows: Array<{ role: string; tech: string; note?: string }>;
  showNote?: boolean;
  compact?: boolean;
  colLabels?: ColPlaceholder;
  rowPlaceholders?: ColPlaceholder[];
  onUpdate: (idx: number, key: string, value: string) => void;
  onAdd: () => void;
  onRemove: (idx: number) => void;
  onReorder: (from: number, to: number) => void;
  onFocusRow?: (idx: number) => void;
  onBlurRow?: () => void;
}

function TechTable({ rows, showNote = true, compact = false, colLabels = {}, rowPlaceholders, onUpdate, onAdd, onRemove, onReorder, onFocusRow, onBlurRow }: TechTableProps) {
  const { role: roleLabel = "役割", tech: techLabel = "採用技術", note: noteLabel = "備考" } = colLabels;
  const { draggingIndex, dragOverIndex, onDragStart, onDragOver, onDrop, onDragEnd } = useDragAndDrop(onReorder);

  const cellCls = "h-7 text-2xs border-0 bg-transparent px-1 shadow-none focus-visible:ring-0 w-full";

  return (
    <div className="rounded-md border border-input overflow-hidden text-sm">
      <div className={compact ? "" : "overflow-x-auto"}>
        <table className={`w-full ${compact ? "" : "min-w-140"}`}>
          <thead>
            <tr className="bg-muted border-b border-input">
              <th className="w-6" />
              <th className="px-3 py-2 text-left text-2xs font-medium text-muted-foreground w-40">{roleLabel}</th>
              <th className={`px-3 py-2 text-left text-2xs font-medium text-muted-foreground ${showNote ? "w-50" : ""}`}>{techLabel}</th>
              {showNote && <th className="px-3 py-2 text-left text-2xs font-medium text-muted-foreground">{noteLabel}</th>}
              <th className="w-8" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} draggable onDragStart={() => onDragStart(i)} onDragOver={(e) => onDragOver(e, i)} onDrop={(e) => onDrop(e, i)} onDragEnd={onDragEnd} className={`border-b border-input last:border-0 transition-colors ${draggingIndex === i ? "opacity-40" : ""} ${dragOverIndex === i && draggingIndex !== i ? "border-t-2 border-t-primary bg-primary-surface" : ""}`}>
                <td className="pl-2">
                  <GripVertical className="size-3 text-muted-foreground/30 cursor-grab hover:text-muted-foreground/60 transition-colors" />
                </td>
                <td onFocus={() => onFocusRow?.(i)} onBlur={() => onBlurRow?.()} className="px-2 py-1 w-40">
                  <Input value={row.role} onChange={(e) => onUpdate(i, "role", e.target.value)} placeholder={rowPlaceholders?.[i]?.role ?? "役割"} className={cellCls} />
                </td>
                <td onFocus={() => onFocusRow?.(i)} onBlur={() => onBlurRow?.()} className="px-2 py-1 w-50">
                  <Input value={row.tech} onChange={(e) => onUpdate(i, "tech", e.target.value)} placeholder={rowPlaceholders?.[i]?.tech ?? "技術名"} className={cellCls} />
                </td>
                {showNote && (
                  <td onFocus={() => onFocusRow?.(i)} onBlur={() => onBlurRow?.()} className="px-2 py-1">
                    <Input value={row.note ?? ""} onChange={(e) => onUpdate(i, "note", e.target.value)} placeholder={rowPlaceholders?.[i]?.note ?? "備考"} className={cellCls} />
                  </td>
                )}
                <td className="pr-2 text-right">
                  <button type="button" onClick={() => onRemove(i)} className="p-1 text-muted-foreground hover:text-destructive transition-colors duration-ui">
                    <Trash2 className="size-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button type="button" onClick={onAdd} className="flex items-center gap-2 w-full px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-ui border-t border-input">
        <Plus className="size-3" />
        行を追加
      </button>
    </div>
  );
}

// ── EnvVarTable ─────────────────────────────────────────────────
interface EnvVarTableProps {
  rows: TechRow3[];
  rowPlaceholders?: { role?: string; tech?: string }[];
  onUpdate: (idx: number, key: string, value: string) => void;
  onAdd: () => void;
  onRemove: (idx: number) => void;
  onReorder: (from: number, to: number) => void;
}

function EnvVarTable({ rows, rowPlaceholders, onUpdate, onAdd, onRemove, onReorder }: EnvVarTableProps) {
  const { draggingIndex, dragOverIndex, onDragStart, onDragOver, onDrop, onDragEnd } = useDragAndDrop(onReorder);

  const cellCls = "h-7 text-2xs border-0 bg-transparent px-1 shadow-none focus-visible:ring-0 w-full";

  return (
    <div className="rounded-md border border-input overflow-hidden text-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-140 table-fixed">
          <colgroup>
            <col className="w-6" />
            <col className="w-5/12" />
            <col className="w-5/12" />
            <col className="w-2/12" />
            <col className="w-8" />
          </colgroup>
          <thead>
            <tr className="bg-muted border-b border-input">
              <th />
              <th className="px-3 py-2 text-left text-2xs font-medium text-muted-foreground">変数名</th>
              <th className="px-3 py-2 text-left text-2xs font-medium text-muted-foreground">説明</th>
              <th className="px-3 py-2 text-left text-2xs font-medium text-muted-foreground">必須</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} draggable onDragStart={() => onDragStart(i)} onDragOver={(e) => onDragOver(e, i)} onDrop={(e) => onDrop(e, i)} onDragEnd={onDragEnd} className={`border-b border-input last:border-0 transition-colors ${draggingIndex === i ? "opacity-40" : ""} ${dragOverIndex === i && draggingIndex !== i ? "border-t-2 border-t-primary bg-primary-surface" : ""}`}>
                <td className="pl-2">
                  <GripVertical className="size-3 text-muted-foreground/30 cursor-grab hover:text-muted-foreground/60 transition-colors" />
                </td>
                <td className="px-2 py-1">
                  <Input value={row.role} onChange={(e) => onUpdate(i, "role", e.target.value)} placeholder={rowPlaceholders?.[i]?.role ?? "VARIABLE_NAME"} className={cellCls} />
                </td>
                <td className="px-2 py-1">
                  <Input value={row.tech} onChange={(e) => onUpdate(i, "tech", e.target.value)} placeholder={rowPlaceholders?.[i]?.tech ?? "説明"} className={cellCls} />
                </td>
                <td className="px-2 py-1 text-center">
                  <Checkbox checked={row.note === "✅"} onCheckedChange={(checked) => onUpdate(i, "note", checked ? "✅" : "")} />
                </td>
                <td className="pr-2 text-right">
                  <button type="button" onClick={() => onRemove(i)} className="p-1 text-muted-foreground hover:text-destructive transition-colors duration-ui">
                    <Trash2 className="size-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button type="button" onClick={onAdd} className="flex items-center gap-2 w-full px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-ui border-t border-input">
        <Plus className="size-3" />
        行を追加
      </button>
    </div>
  );
}

// ── DirTreeBuilder ──────────────────────────────────────────────
type DirNode = { name: string; comment: string; depth: number };

function treeToNodes(value: string): DirNode[] {
  if (!value.trim()) return [];
  return value
    .split("\n")
    .filter((l) => l.trim())
    .map((line) => {
      const m = line.match(/^((?:│\s{3}|\s{4})*)(?:[├└]── )?(.*)$/);
      const prefix = m?.[1] ?? "";
      const depth = Math.round(prefix.length / 4);
      const rest = (m?.[2] ?? line).trim();
      const ci = rest.indexOf(" # ");
      return {
        depth,
        name: ci >= 0 ? rest.slice(0, ci).trimEnd() : rest,
        comment: ci >= 0 ? rest.slice(ci + 3).trim() : "",
      };
    });
}

function nodesToTree(nodes: DirNode[]): string {
  const isLast = (idx: number, depth: number) => {
    for (let i = idx + 1; i < nodes.length; i++) {
      if (nodes[i].depth < depth) return true;
      if (nodes[i].depth === depth) return false;
    }
    return true;
  };
  const hasLine = (idx: number, depth: number) => {
    for (let i = idx + 1; i < nodes.length; i++) {
      if (nodes[i].depth < depth) return false;
      if (nodes[i].depth === depth) return true;
    }
    return false;
  };
  return nodes
    .filter((n) => n.name.trim())
    .map((node, i) => {
      if (node.depth === 0) {
        return node.comment ? `${node.name}  # ${node.comment}` : node.name;
      }
      let prefix = "";
      for (let d = 1; d < node.depth; d++) prefix += hasLine(i, d) ? "│   " : "    ";
      prefix += isLast(i, node.depth) ? "└── " : "├── ";
      const full = prefix + node.name;
      return node.comment ? `${full.padEnd(24)}# ${node.comment}` : full;
    })
    .join("\n");
}

function DirTreeBuilder({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const empty = (): DirNode => ({ name: "", comment: "", depth: 0 });
  const [nodes, setNodes] = useState<DirNode[]>(() => {
    const parsed = treeToNodes(value);
    return parsed.length > 0 ? parsed : [empty()];
  });
  const lastEmittedRef = useRef(value);

  useEffect(() => {
    if (value !== lastEmittedRef.current) {
      lastEmittedRef.current = value;
      const parsed = treeToNodes(value);
      setNodes(parsed.length > 0 ? parsed : [empty()]);
    }
  }, [value]);

  const emit = (next: DirNode[]) => {
    const s = nodesToTree(next);
    lastEmittedRef.current = s;
    onChange(s);
  };
  const update = (i: number, key: keyof DirNode, val: string | number) => {
    const next = [...nodes];
    next[i] = { ...next[i], [key]: val };
    setNodes(next);
    emit(next);
  };
  const indent = (i: number) => {
    const max = i > 0 ? nodes[i - 1].depth + 1 : 0;
    update(i, "depth", Math.min(nodes[i].depth + 1, max));
  };
  const outdent = (i: number) => update(i, "depth", Math.max(0, nodes[i].depth - 1));
  const remove = (i: number) => {
    const next = nodes.filter((_, idx) => idx !== i);
    const nn = next.length > 0 ? next : [empty()];
    setNodes(nn);
    emit(nn);
  };
  const addRow = () => setNodes((prev) => [...prev, { ...empty(), depth: prev[prev.length - 1]?.depth ?? 0 }]);

  const { draggingIndex, dragOverIndex, onDragStart, onDragOver, onDrop, onDragEnd } = useDragAndDrop((from, to) => {
    const next = [...nodes];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setNodes(next);
    emit(next);
  });

  const inputCls = "h-7 text-xs border-0 bg-transparent px-1 shadow-none focus-visible:ring-0 font-mono";
  const iconBtnCls = "p-0.5 text-muted-foreground/50 hover:text-muted-foreground disabled:opacity-20 transition-colors shrink-0";

  return (
    <div className="rounded-md border border-input overflow-hidden text-sm">
      <div className="flex items-center bg-muted border-b border-input px-1 py-2">
        <span className="w-6 shrink-0" />
        <span className="flex-1 min-w-0 text-2xs font-medium text-muted-foreground px-1">パス / ファイル名</span>
        <span className="text-muted-foreground/0 text-xs font-mono px-1 shrink-0 select-none">#</span>
        <span className="w-36 text-2xs font-medium text-muted-foreground px-1">説明</span>
        <span className="w-6 shrink-0" />
      </div>
      {nodes.map((node, i) => (
        <div key={i} draggable onDragStart={() => onDragStart(i)} onDragOver={(e) => onDragOver(e, i)} onDrop={(e) => onDrop(e, i)} onDragEnd={onDragEnd} className={`flex items-center border-b border-input last:border-0 group pr-1 transition-colors ${dragOverIndex === i && draggingIndex !== i ? "border-t-2 border-t-primary bg-primary-surface" : ""}`} style={{ paddingLeft: `${node.depth * 16 + 4}px` }}>
          <GripVertical className="size-3 text-muted-foreground/30 cursor-grab shrink-0 mr-0.5 group-hover:text-muted-foreground/60" />
          <div className="flex items-center shrink-0">
            <button type="button" onClick={() => outdent(i)} disabled={node.depth === 0} className={iconBtnCls}>
              <ChevronLeft className="size-3" />
            </button>
            <button type="button" onClick={() => indent(i)} className={iconBtnCls}>
              <ChevronRight className="size-3" />
            </button>
          </div>
          <Input value={node.name} onChange={(e) => update(i, "name", e.target.value)} placeholder={node.depth === 0 ? "src/" : "app/"} className={`${inputCls} flex-1 min-w-0`} />
          <span className="text-muted-foreground/50 text-xs font-mono px-1 shrink-0">#</span>
          <Input value={node.comment} onChange={(e) => update(i, "comment", e.target.value)} placeholder="説明" className={`${inputCls} w-36`} />
          <button type="button" onClick={() => remove(i)} className="p-1 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive transition-all duration-ui shrink-0">
            <Trash2 className="size-3" />
          </button>
        </div>
      ))}
      <button type="button" onClick={addRow} className="flex items-center gap-2 w-full px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-ui border-t border-input">
        <Plus className="size-3" />
        行を追加
      </button>
    </div>
  );
}
// ── LayerBuilder ────────────────────────────────────────────────
type LayerNode = { name: string; desc: string };

function layerToNodes(value: string): LayerNode[] {
  if (!value.trim()) return [];
  return value
    .split("\n")
    .filter((line) => line.startsWith("|") && !line.match(/^\|[-| ]+\|$/))
    .map((line) => {
      const [, name = "", desc = ""] = line.split("|").map((s) => s.trim());
      return { name, desc };
    })
    .filter((n) => n.name && n.name !== "レイヤー名");
}

function nodesToLayer(nodes: LayerNode[]): string {
  const rows = nodes.filter((n) => n.name.trim());
  if (rows.length === 0) return "";
  return ["| レイヤー名 | 内容・役割 |", "|---|---|", ...rows.map((n) => `| ${n.name} | ${n.desc} |`)].join("\n");
}

const emptyLayerNode = (): LayerNode => ({ name: "", desc: "" });

function LayerBuilder({ value, onChange, rowPlaceholders }: { value: string; onChange: (v: string) => void; rowPlaceholders?: { name?: string; desc?: string }[] }) {
  const makeDefaultNodes = () => Array.from({ length: rowPlaceholders?.length ?? 1 }, emptyLayerNode);
  const [nodes, setNodes] = useState<LayerNode[]>(() => {
    const parsed = layerToNodes(value);
    return parsed.length > 0 ? parsed : makeDefaultNodes();
  });
  const lastEmittedRef = useRef(value);

  useEffect(() => {
    if (value !== lastEmittedRef.current) {
      lastEmittedRef.current = value;
      const parsed = layerToNodes(value);
      setNodes(parsed.length > 0 ? parsed : Array.from({ length: rowPlaceholders?.length ?? 1 }, emptyLayerNode));
    }
  }, [value, rowPlaceholders]);

  const emit = (next: LayerNode[]) => {
    const s = nodesToLayer(next);
    lastEmittedRef.current = s;
    onChange(s);
  };
  const update = (i: number, key: keyof LayerNode, val: string) => {
    const next = [...nodes];
    next[i] = { ...next[i], [key]: val };
    setNodes(next);
    emit(next);
  };
  const remove = (i: number) => {
    const next = nodes.filter((_, idx) => idx !== i);
    const nn = next.length > 0 ? next : [emptyLayerNode()];
    setNodes(nn);
    emit(nn);
  };
  const addRow = () => {
    const nn = [...nodes, emptyLayerNode()];
    setNodes(nn);
    emit(nn);
  };

  const { draggingIndex, dragOverIndex, onDragStart, onDragOver, onDrop, onDragEnd } = useDragAndDrop((from, to) => {
    const next = [...nodes];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setNodes(next);
    emit(next);
  });

  const inputCls = "h-7 text-xs border-0 bg-transparent px-1 shadow-none focus-visible:ring-0";

  return (
    <div className="rounded-md border border-input overflow-hidden text-sm">
      <div className="bg-muted border-b border-input flex items-center">
        <div className="w-6 shrink-0" />
        <div className="px-1 py-2 text-2xs font-medium text-muted-foreground flex-1">レイヤー名</div>
        <div className="px-1 py-2 text-2xs font-medium text-muted-foreground w-44">内容・役割</div>
        <div className="w-8 shrink-0" />
      </div>
      {nodes.map((node, i) => (
        <div key={i} draggable onDragStart={() => onDragStart(i)} onDragOver={(e) => onDragOver(e, i)} onDrop={(e) => onDrop(e, i)} onDragEnd={onDragEnd} className={`flex items-center gap-1 px-2 py-1 group border-b border-input last:border-0 transition-colors ${draggingIndex === i ? "opacity-40" : ""} ${dragOverIndex === i && draggingIndex !== i ? "border-t-2 border-t-primary bg-primary-surface" : ""}`}>
          <GripVertical className="size-3 text-muted-foreground/30 cursor-grab shrink-0 group-hover:text-muted-foreground/60" />
          <Input value={node.name} onChange={(e) => update(i, "name", e.target.value)} placeholder={rowPlaceholders?.[i]?.name ?? "レイヤー名"} className={`${inputCls} flex-1 min-w-0 font-medium`} />
          <Input value={node.desc} onChange={(e) => update(i, "desc", e.target.value)} placeholder={rowPlaceholders?.[i]?.desc ?? "内容・役割"} className={`${inputCls} w-44 text-muted-foreground`} />
          <button type="button" onClick={() => remove(i)} className="p-1 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive transition-all duration-ui shrink-0">
            <Trash2 className="size-3" />
          </button>
        </div>
      ))}
      <button type="button" onClick={addRow} className="flex items-center gap-2 w-full px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-ui border-t border-input">
        <Plus className="size-3" />
        レイヤーを追加
      </button>
    </div>
  );
}
// ────────────────────────────────────────────────────────────────

const AGENT_MODE_OPTIONS = ["デフォルト", "カスタム"];

const DEFAULT_AGENT_PREVIEW = `# AGENTS.md file

## Dev environment tips
- Use \`pnpm dlx turbo run where <project_name>\` to jump to a package instead of scanning with \`ls\`.
- Run \`pnpm install --filter <project_name>\` to add the package to your workspace so Vite, ESLint, and TypeScript can see it.
- Use \`pnpm create vite@latest <project_name> -- --template react-ts\` to spin up a new React + Vite package with TypeScript checks ready.
- Check the name field inside each package's package.json to confirm the right name—skip the top-level one.

## Testing instructions
- Find the CI plan in the .github/workflows folder.
- Run \`pnpm turbo run test --filter <project_name>\` to run every check defined for that package.
- From the package root you can just call \`pnpm test\`. The commit should pass all tests before you merge.
- To focus on one step, add the Vitest pattern: \`pnpm vitest run -t "<test name>"\`.
- Fix any test or type errors until the whole suite is green.
- After moving files or changing imports, run \`pnpm lint --filter <project_name>\` to be sure ESLint and TypeScript rules still pass.
- Add or update tests for the code you change, even if nobody asked.

## PR instructions
- Title format: [<project_name>] <Title>
- Always run \`pnpm lint\` and \`pnpm test\` before committing.
`;

const WIZARD_STEPS = [
  { id: "overview", label: "プロジェクト概要", icon: Info },
  { id: "techStack", label: "技術スタック", icon: Layers },
  { id: "repoStructure", label: "リポジトリ構成", icon: FolderOpen },
  { id: "commands", label: "コマンド", icon: Terminal },
  { id: "conventions", label: "コーディング規約", icon: Code },
  { id: "architecture", label: "アーキテクチャ & テスト", icon: Blocks },
  { id: "git", label: "Git 規約", icon: GitBranch },
  { id: "agentRules", label: "エージェント指示", icon: Bot },
  { id: "envServices", label: "環境変数 & リソース", icon: Server },
] as const;

export default function AgentPage() {
  const [config, setConfig] = useState<AgentConfig>(DEFAULT_AGENT_CONFIG);
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [agentMode, setAgentMode] = useState("");
  const [syncScroll, setSyncScroll] = useState(false);
  const formScrollRef = useRef<HTMLDivElement>(null);
  const previewScrollRef = useRef<HTMLTextAreaElement>(null);
  useScrollSync(formScrollRef, previewScrollRef, syncScroll);
  const focusedTechRow = useRef<Partial<Record<string, number | null>>>({});
  const { isLoggedIn, isLoading: isAuthLoading } = useAuth();
  const { fileName, setFileName, isSaving, save, fileCount, maxFiles, feedback } = useSaveConfigFile("AGENT.md");

  const isCustom = agentMode === "カスタム";
  const generatedPreview = useMemo(() => generateAgentMarkdown(config), [config]);
  const preview = isCustom ? generatedPreview : agentMode === "デフォルト" ? DEFAULT_AGENT_PREVIEW : "# AGENTS.md file";

  const update = <K extends keyof AgentConfig>(key: K, value: AgentConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const updateRow3 = (field: TechField3, idx: number, key: string, value: string) => {
    setConfig((prev) => {
      const rows = (prev[field] as TechRow3[]).map((r, i) => (i === idx ? { ...r, [key]: value } : r));
      return { ...prev, [field]: rows };
    });
  };
  const addRow3 = (field: TechField3) => {
    setConfig((prev) => ({ ...prev, [field]: [...(prev[field] as TechRow3[]), { role: "", tech: "", note: "" }] }));
  };
  const replaceRow3 = (field: TechField3, idx: number, row: TechRow3) => {
    setConfig((prev) => {
      const rows = [...(prev[field] as TechRow3[])];
      rows[idx] = { ...row };
      return { ...prev, [field]: rows };
    });
  };
  const addPresetRow3 = (field: TechField3, row: TechRow3) => {
    setConfig((prev) => ({ ...prev, [field]: [...(prev[field] as TechRow3[]), { ...row }] }));
  };
  const removeRow3 = (field: TechField3, idx: number) => {
    setConfig((prev) => ({ ...prev, [field]: (prev[field] as TechRow3[]).filter((_, i) => i !== idx) }));
  };
  const reorderRow3 = (field: TechField3, from: number, to: number) => {
    setConfig((prev) => {
      const rows = [...(prev[field] as TechRow3[])];
      const [moved] = rows.splice(from, 1);
      rows.splice(to, 0, moved);
      return { ...prev, [field]: rows };
    });
  };

  useEffect(() => {
    const formEl = formScrollRef.current;
    if (!formEl) return;
    const sectionIds = WIZARD_STEPS.map((s) => s.id);
    const handleScroll = () => {
      const containerTop = formEl.getBoundingClientRect().top;
      let found = sectionIds[0];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top - containerTop <= 60) found = id;
      }
      setActiveSection(found);
    };
    formEl.addEventListener("scroll", handleScroll);
    return () => formEl.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const formEl = formScrollRef.current;
    const sectionEl = document.getElementById(id);
    if (!formEl || !sectionEl) return;
    const top = sectionEl.getBoundingClientRect().top - formEl.getBoundingClientRect().top + formEl.scrollTop;
    formEl.scrollTo({ top: top - 16, behavior: "smooth" });
    setActiveSection(id);
  };

  return (
    <>
      <MobileGuard />

      <main className="h-[calc(100vh-3.5rem)] overflow-y-auto w-full max-w-7xl mx-auto px-6 pt-10 pb-12">
        <div className={isCustom ? "grid gap-6 lg:grid-cols-[160px_1fr_1fr] items-start" : "grid gap-12 lg:grid-cols-2 items-start"}>
          {/* Sidebar TOC — カスタム時のみ表示 */}
          {isCustom && <WizardSidebar steps={WIZARD_STEPS} activeSection={activeSection} onNavigate={scrollToSection} />}

          {/* Form */}
          <div ref={formScrollRef} className="space-y-6 max-h-[calc(100vh-160px)] overflow-y-auto px-4 -mx-4">
            {/* モード選択 */}
            <div className="space-y-2">
              <FieldLabel requirement="required">AGENT.mdの種類</FieldLabel>
              <Select value={agentMode} onValueChange={setAgentMode}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  {AGENT_MODE_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isCustom && (
              <>
                {/* 1. プロジェクト概要 */}
                <SectionCard id="overview" label="プロジェクト概要" description="エージェントがコンテキストを把握するための基本情報" icon={Info}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <FieldLabel>プロジェクト名</FieldLabel>
                      <Input placeholder="my-saas-app" value={config.projectName} onChange={(e) => update("projectName", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <FieldLabel>目的・概要</FieldLabel>
                      <Textarea placeholder="ユーザーが Claude の設定ファイルを生成・管理できる Web アプリ" value={config.description} onChange={(e) => update("description", e.target.value)} className="min-h-20" />
                    </div>
                    <div className="space-y-2">
                      <FieldLabel>ターゲット環境</FieldLabel>
                      <div className="flex flex-wrap gap-1.5">
                        {ENV_PRESETS.map((p) => (
                          <Badge key={p} variant="outline" className="cursor-pointer hover:bg-primary-surface hover:text-primary hover:border-primary transition-colors px-3 py-1" onClick={() => update("targetEnv", config.targetEnv.trim() ? `${config.targetEnv.trim()}, ${p}` : p)}>
                            {p}
                          </Badge>
                        ))}
                      </div>
                      <Input placeholder="Node.js 20+, ブラウザ" value={config.targetEnv} onChange={(e) => update("targetEnv", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <FieldLabel>メンテナー</FieldLabel>
                      <Input placeholder="@your-handle" value={config.maintainer} onChange={(e) => update("maintainer", e.target.value)} />
                    </div>
                    {config.maintainer.trim() && (
                      <div className="pl-3 space-y-3 border-l-2 border-border">
                        <div className="space-y-1">
                          <label className="text-xs font-medium">{`連絡先`}</label>
                          <Input placeholder="Slack #channel-name / email@example.com" value={config.contact} onChange={(e) => update("contact", e.target.value)} className="h-8 text-xs" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium">{`バージョン`}</label>
                          <Input placeholder="1.2.0" value={config.version} onChange={(e) => update("version", e.target.value)} className="h-8 text-xs" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium">{`最終更新日`}</label>
                          <Input placeholder="2026-04-24" value={config.lastUpdated} onChange={(e) => update("lastUpdated", e.target.value)} className="h-8 text-xs" />
                        </div>
                      </div>
                    )}
                  </div>
                </SectionCard>

                {/* 2. 技術スタック */}
                <SectionCard id="techStack" label="技術スタック" description="採用技術と使用しない技術を明示する" icon={Layers}>
                  <div className="space-y-6">
                    {(["frontendStack", "backendStack", "infraStack", "devTools"] as const).map((field) => (
                      <div key={field} className="space-y-2">
                        <FieldLabel>{{ frontendStack: "フロントエンド", backendStack: "バックエンド", infraStack: "インフラ・データ", devTools: "開発ツール" }[field]}</FieldLabel>
                        <div className="rounded-md border border-input overflow-hidden">
                          {TECH_PRESETS[field].map((group, gi) => (
                            <div key={group.group} className={`px-3 py-2 flex items-start gap-3 ${gi > 0 ? "border-t border-input" : ""}`}>
                              <p className="text-2xs leading-[120%] tracking-[0.04em] text-muted-foreground w-24 shrink-0 pt-0.5">{group.group}</p>
                              <div className="flex flex-wrap gap-1.5">
                                {group.items.map((preset) => (
                                  <Badge
                                    key={preset.label}
                                    variant="outline"
                                    className="cursor-pointer hover:bg-primary-surface hover:text-primary hover:border-primary transition-colors px-3 py-1"
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                      const idx = focusedTechRow.current[field];
                                      if (idx !== null && idx !== undefined) {
                                        replaceRow3(field, idx, preset.row);
                                      } else {
                                        addPresetRow3(field, preset.row);
                                      }
                                    }}
                                  >
                                    {preset.label}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                        <TechTable
                          rows={config[field]}
                          onUpdate={(i, k, v) => updateRow3(field, i, k, v)}
                          onAdd={() => addRow3(field)}
                          onRemove={(i) => removeRow3(field, i)}
                          onReorder={(f, t) => reorderRow3(field, f, t)}
                          onFocusRow={(i) => {
                            focusedTechRow.current[field] = i;
                          }}
                          onBlurRow={() => {
                            focusedTechRow.current[field] = null;
                          }}
                          rowPlaceholders={[
                            {
                              role: ({ frontendStack: "フレームワーク", backendStack: "ランタイム / FW", infraStack: "インフラ / DB", devTools: "ツール種別" } as const)[field],
                              tech: ({ frontendStack: "Next.js", backendStack: "Node.js", infraStack: "Supabase", devTools: "ESLint" } as const)[field],
                              note: "備考",
                            },
                          ]}
                        />
                      </div>
                    ))}
                  </div>
                </SectionCard>

                {/* 3. リポジトリ構成 */}
                <SectionCard id="repoStructure" label="リポジトリ構成" description="エージェントが迷わないよう、重要なファイル・ディレクトリを明示する" icon={FolderOpen}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <FieldLabel>ディレクトリ構造</FieldLabel>
                        <button type="button" className="text-2xs text-primary hover:underline" onClick={() => update("repoStructure", nodesToTree(REPO_STRUCTURE_TEMPLATE))}>テンプレートを挿入</button>
                      </div>
                      <DirTreeBuilder value={config.repoStructure} onChange={(v) => update("repoStructure", v)} />
                    </div>
                    <div className="space-y-2">
                      <FieldLabel>重要ファイル</FieldLabel>
                      <Textarea placeholder={"src/lib/auth.ts — 認証ユーティリティ\nsrc/types/index.ts — 共通型定義\ndocker-compose.yml — ローカル環境のDB設定"} value={config.importantFiles} onChange={(e) => update("importantFiles", e.target.value)} className="min-h-24 font-mono text-xs mb-1" />
                      <p className="text-2xs leading-[120%] tracking-[0.04em] text-muted-foreground">→ 改行すると箇条書きに出力されます</p>
                    </div>
                  </div>
                </SectionCard>

                {/* 4. コマンド */}
                <SectionCard id="commands" label="コマンド" description="エージェントが環境を構築・確認するための手順" icon={Terminal}>
                  <div className="space-y-4">
                    {(
                      [
                        { key: "cmdInstall", label: "インストール", placeholder: "npm install" },
                        { key: "cmdDev", label: "開発サーバー起動", placeholder: "npm run dev" },
                        { key: "cmdBuild", label: "ビルド", placeholder: "npm run build" },
                        { key: "cmdTest", label: "テスト実行", placeholder: "npm test" },
                        { key: "cmdLint", label: "Lint / フォーマット", placeholder: "npm run lint" },
                      ] as const
                    ).map(({ key, label, placeholder }) => (
                      <div key={key} className="space-y-2">
                        <FieldLabel>{label}</FieldLabel>
                        <Input placeholder={placeholder} value={config[key]} onChange={(e) => update(key, e.target.value)} className="font-mono text-sm" />
                      </div>
                    ))}
                  </div>
                </SectionCard>

                {/* 5. コーディング規約 */}
                <SectionCard id="conventions" label="コーディング規約" description="エージェントが生成するコードの品質・スタイルを統一する" icon={Code}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <FieldLabel>インデント</FieldLabel>
                      <Select value={config.indent ?? ""} onValueChange={(v) => update("indent", v)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="選択してください" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="スペース2">スペース2</SelectItem>
                          <SelectItem value="スペース4">スペース4</SelectItem>
                          <SelectItem value="タブ">タブ</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <FieldLabel>文字コード</FieldLabel>
                      <Select value={config.charset ?? ""} onValueChange={(v) => update("charset", v)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="選択してください" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTF-8">UTF-8</SelectItem>
                          <SelectItem value="UTF-16">UTF-16</SelectItem>
                          <SelectItem value="Shift-JIS">Shift-JIS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <FieldLabel>行末</FieldLabel>
                      <Select value={config.lineEnding ?? ""} onValueChange={(v) => update("lineEnding", v)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="選択してください" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LF (Unix形式)">LF (Unix形式)</SelectItem>
                          <SelectItem value="CRLF (Windows形式)">CRLF (Windows形式)</SelectItem>
                          <SelectItem value="CR">CR</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <FieldLabel>命名規則</FieldLabel>
                      <div className="flex flex-wrap gap-1.5">
                        {NAMING_PRESETS.map((preset) => (
                          <Badge
                            key={preset}
                            variant="outline"
                            className="cursor-pointer hover:bg-primary-surface hover:text-primary hover:border-primary transition-colors px-3 py-1 font-mono"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              const idx = focusedTechRow.current["namingRules"];
                              if (idx !== null && idx !== undefined) {
                                updateRow3("namingRules", idx, "tech", preset);
                              } else {
                                addPresetRow3("namingRules", { role: "", tech: preset, note: "" });
                              }
                            }}
                          >
                            {preset}
                          </Badge>
                        ))}
                      </div>
                      <TechTable
                        rows={config.namingRules}
                        colLabels={{ role: "対象", tech: "規則", note: "例" }}
                        rowPlaceholders={[
                          { role: "変数・関数", tech: "camelCase", note: "getUserName" },
                          { role: "クラス", tech: "PascalCase", note: "UserService" },
                          { role: "定数", tech: "UPPER_SNAKE_CASE", note: "MAX_RETRY_COUNT" },
                          { role: "ファイル", tech: "kebab-case", note: "user-service.ts" },
                        ]}
                        onUpdate={(i, k, v) => updateRow3("namingRules", i, k, v)}
                        onAdd={() => addRow3("namingRules")}
                        onRemove={(i) => removeRow3("namingRules", i)}
                        onReorder={(f, t) => reorderRow3("namingRules", f, t)}
                        onFocusRow={(i) => {
                          focusedTechRow.current["namingRules"] = i;
                        }}
                        onBlurRow={() => {
                          focusedTechRow.current["namingRules"] = null;
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <FieldLabel>禁止事項</FieldLabel>
                      <Textarea placeholder={"console.log をプロダクションコードに残さない\nハードコードされたシークレット・APIキーを絶対にコミットしない\nany型を安易に使用しない"} value={config.prohibitions} onChange={(e) => update("prohibitions", e.target.value)} className="min-h-24 text-sm mb-1" />
                      <p className="text-2xs leading-[120%] tracking-[0.04em] text-muted-foreground">→ 改行すると箇条書きに出力されます</p>
                    </div>
                  </div>
                </SectionCard>

                {/* 6. アーキテクチャ & テスト */}
                <SectionCard id="architecture" label="アーキテクチャ & テスト" description="設計判断の指針とテスト方針" icon={Blocks}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <FieldLabel>設計原則</FieldLabel>
                      <Textarea placeholder={"単一責任の原則を徹底する\nドメインロジックはサービス層に集約する\n副作用はリポジトリ層に閉じ込める"} value={config.designPrinciples} onChange={(e) => update("designPrinciples", e.target.value)} className="min-h-24 text-sm mb-1" />
                      <p className="text-2xs leading-[120%] tracking-[0.04em] text-muted-foreground">→ 改行すると箇条書きに出力されます</p>
                    </div>
                    <div className="space-y-2">
                      <FieldLabel>レイヤー構成</FieldLabel>
                      <LayerBuilder
                        value={config.layerStructure}
                        onChange={(v) => update("layerStructure", v)}
                        rowPlaceholders={[
                          { name: "Presentation", desc: "API Routes / UI" },
                          { name: "Application", desc: "Use Cases / Services" },
                          { name: "Domain", desc: "Entities / Value Objects" },
                          { name: "Infrastructure", desc: "DB / External APIs" },
                        ]}
                      />
                    </div>
                    <div className="space-y-2">
                      <FieldLabel>依存関係のルール</FieldLabel>
                      <Textarea placeholder={"ドメイン層はインフラ層に依存しない\n循環依存を禁止する"} value={config.dependencyRules} onChange={(e) => update("dependencyRules", e.target.value)} className="min-h-20 text-sm mb-1" />
                      <p className="text-2xs leading-[120%] tracking-[0.04em] text-muted-foreground">→ 改行すると箇条書きに出力されます</p>
                    </div>
                    <div className="space-y-2">
                      <FieldLabel>テスト方針</FieldLabel>
                      <Textarea placeholder={"テスト名は「[状況] のとき [操作] すると [期待結果]」の形式で書く\n外部依存（DB・API）は必ずモック/スタブする\nテストはそれぞれ独立して実行できること（順序依存禁止）"} value={config.testPolicy} onChange={(e) => update("testPolicy", e.target.value)} className="min-h-24 text-sm mb-1" />
                      <p className="text-2xs leading-[120%] tracking-[0.04em] text-muted-foreground">→ 改行すると箇条書きに出力されます</p>
                    </div>
                  </div>
                </SectionCard>

                {/* 7. Git 規約 */}
                <SectionCard id="git" label="Git 規約" description="ブランチ命名・コミットメッセージ・PR のルール" icon={GitBranch}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <FieldLabel>ブランチ命名</FieldLabel>
                        <button type="button" className="text-2xs text-primary hover:underline" onClick={() => update("branchNaming", BRANCH_NAMING_TEMPLATE)}>
                          テンプレートを挿入
                        </button>
                      </div>
                      <TechTable
                        rows={config.branchNaming}
                        colLabels={{ role: "プレフィックス", tech: "パターン", note: "例" }}
                        rowPlaceholders={[
                          { role: "feature", tech: "/[issue番号]-[簡潔な説明]", note: "feature/42-add-user-auth" },
                          { role: "fix", tech: "/[issue番号]-[簡潔な説明]", note: "fix/88-null-pointer-login" },
                          { role: "chore", tech: "/[説明]", note: "chore/update-dependencies" },
                        ]}
                        onUpdate={(i, k, v) => updateRow3("branchNaming", i, k, v)}
                        onAdd={() => addRow3("branchNaming")}
                        onRemove={(i) => removeRow3("branchNaming", i)}
                        onReorder={(f, t) => reorderRow3("branchNaming", f, t)}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <FieldLabel>コミットタイプ</FieldLabel>
                        <button type="button" className="text-2xs text-primary hover:underline" onClick={() => update("commitTypes", COMMIT_TYPES_TEMPLATE)}>
                          テンプレートを挿入
                        </button>
                      </div>
                      <TechTable
                        rows={config.commitTypes}
                        showNote={false}
                        compact
                        colLabels={{ role: "type", tech: "説明" }}
                        rowPlaceholders={[
                          { role: "feat", tech: "新機能追加" },
                          { role: "fix", tech: "バグ修正" },
                          { role: "docs", tech: "ドキュメント変更" },
                          { role: "refactor", tech: "リファクタリング" },
                          { role: "test", tech: "テスト追加・修正" },
                          { role: "chore", tech: "ビルド・設定変更" },
                          { role: "style", tech: "コード整形・フォーマット" },
                        ]}
                        onUpdate={(i, k, v) => updateRow3("commitTypes", i, k, v)}
                        onAdd={() => addRow3("commitTypes")}
                        onRemove={(i) => removeRow3("commitTypes", i)}
                        onReorder={(f, t) => reorderRow3("commitTypes", f, t)}
                      />
                    </div>
                    <div className="space-y-2">
                      <FieldLabel>コミットメッセージ形式</FieldLabel>
                      <Input placeholder="<type>(<scope>): <summary>" value={config.commitFormat} onChange={(e) => update("commitFormat", e.target.value)} className="font-mono text-sm" />
                    </div>

                    <div className="space-y-2">
                      <FieldLabel>PR のルール</FieldLabel>
                      <Textarea placeholder={"1 PR = 1つの目的（機能追加とリファクタは分ける）\nレビュー前にセルフレビューを行う\nPRテンプレートがある場合は必ず埋める"} value={config.prRules} onChange={(e) => update("prRules", e.target.value)} className="min-h-20 text-sm mb-1" />
                      <p className="text-2xs leading-[120%] tracking-[0.04em] text-muted-foreground">→ 改行すると箇条書きに出力されます</p>
                    </div>
                  </div>
                </SectionCard>

                {/* 8. エージェント行動指示 */}
                <SectionCard id="agentRules" label="エージェント行動指示" description="AI エージェントが自律的に動く際の制約・優先順位" icon={Bot}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <FieldLabel>必ずすること (MUST)</FieldLabel>
                      <Textarea placeholder={"変更前に既存のテストが通ることを確認する\n新しいファイルを作成する前に既存ファイルを確認する\n不明な仕様は推測せず、コメント or ドキュメントを確認する\n破壊的変更（APIの削除・DBスキーマ変更）は実行前に確認を求める"} value={config.mustDo} onChange={(e) => update("mustDo", e.target.value)} className="min-h-28 text-sm mb-1" />
                      <p className="text-2xs leading-[120%] tracking-[0.04em] text-muted-foreground">→ 改行すると箇条書きに出力されます</p>
                    </div>
                    <div className="space-y-2">
                      <FieldLabel>してはいけないこと (MUST NOT)</FieldLabel>
                      <Textarea placeholder={".env ファイルや秘密情報をコミットする\nmain / master ブランチへ直接プッシュする\nテストを削除してカバレッジを下げる\n本番データベースに対してDDLを直接実行する"} value={config.mustNot} onChange={(e) => update("mustNot", e.target.value)} className="min-h-28 text-sm mb-1" />
                      <p className="text-2xs leading-[120%] tracking-[0.04em] text-muted-foreground">→ 改行すると箇条書きに出力されます</p>
                    </div>
                    <div className="space-y-2">
                      <FieldLabel>推奨される行動 (SHOULD)</FieldLabel>
                      <Textarea placeholder={"大きな変更は小さなステップに分割して実行する\n既存コードのパターンに従い、スタイルを統一する\n変更範囲が広い場合は計画を提示してから実行する"} value={config.should} onChange={(e) => update("should", e.target.value)} className="min-h-24 text-sm mb-1" />
                      <p className="text-2xs leading-[120%] tracking-[0.04em] text-muted-foreground">→ 改行すると箇条書きに出力されます</p>
                    </div>
                  </div>
                </SectionCard>

                {/* 9. 環境変数 & 外部サービス & リソース */}
                <SectionCard id="envServices" label="環境変数 & 外部サービス" description="エージェントが参照すべき設定情報とリソース" icon={Server}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <FieldLabel>環境変数一覧</FieldLabel>
                      <EnvVarTable
                        rows={config.envVars}
                        rowPlaceholders={[
                          { role: "DATABASE_URL", tech: "DBの接続文字列" },
                          { role: "API_KEY", tech: "外部APIキー" },
                          { role: "LOG_LEVEL", tech: "ログ出力レベル" },
                        ]}
                        onUpdate={(i, k, v) => updateRow3("envVars", i, k, v)}
                        onAdd={() => addRow3("envVars")}
                        onRemove={(i) => removeRow3("envVars", i)}
                        onReorder={(f, t) => reorderRow3("envVars", f, t)}
                      />
                    </div>
                    <div className="space-y-2">
                      <FieldLabel>外部依存サービス</FieldLabel>
                      <TechTable
                        rows={config.externalServices}
                        colLabels={{ role: "サービス", tech: "用途", note: "ローカル代替" }}
                        rowPlaceholders={[
                          { role: "PostgreSQL", tech: "データ永続化", note: "Docker Compose" },
                          { role: "Redis", tech: "セッション管理", note: "Docker Compose" },
                          { role: "SendGrid", tech: "メール送信", note: "MailHog" },
                        ]}
                        onUpdate={(i, k, v) => updateRow3("externalServices", i, k, v)}
                        onAdd={() => addRow3("externalServices")}
                        onRemove={(i) => removeRow3("externalServices", i)}
                        onReorder={(f, t) => reorderRow3("externalServices", f, t)}
                      />
                    </div>
                    <div className="space-y-2">
                      <FieldLabel>よくあるタスク</FieldLabel>
                      <Textarea placeholder={"新しいAPIエンドポイントを追加する: src/routes/ → src/services/ → tests/ の順で実装\nデータベースマイグレーションを追加する: マイグレーションファイル生成 → Up/Down実装 → ローカル確認"} value={config.commonTasks} onChange={(e) => update("commonTasks", e.target.value)} className="min-h-20 text-sm mb-1" />
                      <p className="text-2xs leading-[120%] tracking-[0.04em] text-muted-foreground">→ 改行すると箇条書きに出力されます</p>
                    </div>
                    <div className="space-y-2">
                      <FieldLabel>参考リソース</FieldLabel>
                      <Textarea placeholder={"設計ドキュメント: docs/architecture.md\nAPIドキュメント: https://...\nチームWiki: https://notion.so/..."} value={config.references} onChange={(e) => update("references", e.target.value)} className="min-h-20 text-sm mb-1" />
                      <p className="text-2xs leading-[120%] tracking-[0.04em] text-muted-foreground">→ 改行すると箇条書きに出力されます</p>
                    </div>
                  </div>
                </SectionCard>
              </>
            )}
          </div>

          {/* Preview & Save */}
          <PreviewSavePanel fileNameInputId="agent-filename" defaultFileName="AGENT.md" fileName={fileName} setFileName={setFileName} fileCount={fileCount} maxFiles={maxFiles} isSaving={isSaving} isLoggedIn={isLoggedIn} isAuthLoading={isAuthLoading} preview={preview} onSave={() => save(preview)} feedback={feedback} textareaRef={previewScrollRef} />
        </div>
      </main>
      <ScrollSyncToggle enabled={syncScroll} onChange={setSyncScroll} />
    </>
  );
}
