'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { Info, Layers, FolderOpen, Terminal, Code, Blocks, GitBranch, Bot, Server } from 'lucide-react'
import { SectionCard } from '@/components/custom/section-card'
import { FieldLabel } from '@/components/custom/field-label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/hooks/use-auth'
import { useSaveConfigFile } from '@/lib/hooks/use-save-config-file'
import { downloadTextFile } from '@/lib/download'
import { generateAgentMarkdown, DEFAULT_AGENT_CONFIG, type AgentConfig } from '@/lib/generate-agent'

const WIZARD_STEPS = [
  { id: 'overview',       label: 'プロジェクト概要',      icon: Info },
  { id: 'techStack',      label: '技術スタック',           icon: Layers },
  { id: 'repoStructure',  label: 'リポジトリ構成',         icon: FolderOpen },
  { id: 'commands',       label: 'コマンド',               icon: Terminal },
  { id: 'conventions',    label: 'コーディング規約',        icon: Code },
  { id: 'architecture',   label: 'アーキテクチャ & テスト', icon: Blocks },
  { id: 'git',            label: 'Git 規約',               icon: GitBranch },
  { id: 'agentRules',     label: 'エージェント指示',        icon: Bot },
  { id: 'envServices',    label: '環境変数 & リソース',     icon: Server },
] as const

export default function AgentPage() {
  const [config, setConfig] = useState<AgentConfig>(DEFAULT_AGENT_CONFIG)
  const [activeSection, setActiveSection] = useState<string>('overview')
  const formScrollRef = useRef<HTMLDivElement>(null)
  const previewScrollRef = useRef<HTMLTextAreaElement>(null)
  const { isLoggedIn, isLoading: isAuthLoading } = useAuth()
  const { fileName, setFileName, isSaving, save, fileCount, maxFiles } = useSaveConfigFile('AGENT.md')

  const preview = useMemo(() => generateAgentMarkdown(config), [config])

  const update = <K extends keyof AgentConfig>(key: K, value: AgentConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }))
  }

  useEffect(() => {
    const formEl = formScrollRef.current
    if (!formEl) return
    const sectionIds = WIZARD_STEPS.map((s) => s.id)
    const handleScroll = () => {
      const containerTop = formEl.getBoundingClientRect().top
      let found = sectionIds[0]
      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (!el) continue
        if (el.getBoundingClientRect().top - containerTop <= 60) found = id
      }
      setActiveSection(found)
    }
    formEl.addEventListener('scroll', handleScroll)
    return () => formEl.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const formEl = formScrollRef.current
    const sectionEl = document.getElementById(id)
    if (!formEl || !sectionEl) return
    const top = sectionEl.getBoundingClientRect().top - formEl.getBoundingClientRect().top + formEl.scrollTop
    formEl.scrollTo({ top: top - 16, behavior: 'smooth' })
    setActiveSection(id)
  }

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
            <nav className="sticky space-y-0.5" style={{ top: 'calc(3.5rem + 1.5rem)' }}>
              {WIZARD_STEPS.map((step, i) => {
                const StepIcon = step.icon
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => scrollToSection(step.id)}
                    className={cn(
                      'flex items-center gap-2 w-full text-left px-2.5 py-2 rounded-lg text-xs transition-colors duration-ui',
                      activeSection === step.id
                        ? 'bg-primary-surface text-primary font-semibold'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    )}
                  >
                    <span className="w-4 shrink-0 text-[10px] font-mono tabular-nums opacity-40">{i + 1}</span>
                    <StepIcon className="size-3 shrink-0" />
                    <span className="leading-tight truncate">{step.label}</span>
                  </button>
                )
              })}
            </nav>
          </aside>

          {/* Form */}
          <div ref={formScrollRef} className="space-y-6 max-h-[calc(100vh-160px)] overflow-y-auto pr-4">

            {/* 1. プロジェクト概要 */}
            <SectionCard
              id="overview"
              label="プロジェクト概要"
              description="エージェントがコンテキストを把握するための基本情報"
              icon={Info}
            >
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <FieldLabel requirement="required">プロジェクト名</FieldLabel>
                  <Input
                    placeholder="例: my-saas-app"
                    value={config.projectName}
                    onChange={(e) => update('projectName', e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <FieldLabel requirement="required">目的・概要</FieldLabel>
                  <Textarea
                    placeholder="例: ユーザーが Claude の設定ファイルを生成・管理できる Web アプリ"
                    value={config.description}
                    onChange={(e) => update('description', e.target.value)}
                    className="min-h-20"
                  />
                </div>
                <div className="space-y-1.5">
                  <FieldLabel>主要言語・フレームワーク</FieldLabel>
                  <Input
                    placeholder="例: TypeScript / Next.js 16 / PostgreSQL"
                    value={config.languages}
                    onChange={(e) => update('languages', e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <FieldLabel>ターゲット環境</FieldLabel>
                  <Input
                    placeholder="例: Node.js 20+, ブラウザ"
                    value={config.targetEnv}
                    onChange={(e) => update('targetEnv', e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <FieldLabel>メンテナー</FieldLabel>
                  <Input
                    placeholder="例: @your-handle"
                    value={config.maintainer}
                    onChange={(e) => update('maintainer', e.target.value)}
                  />
                </div>
              </div>
            </SectionCard>

            {/* 2. 技術スタック */}
            <SectionCard
              id="techStack"
              label="技術スタック"
              description="採用技術と使用しない技術を明示する"
              icon={Layers}
            >
              <div className="space-y-6">
                <p className="text-[10px] leading-[170%] tracking-[0.04em] text-muted-foreground">
                  各行に「役割 | 採用技術 | 備考」の形式で入力してください（例: フレームワーク | Next.js 16 | App Router のみ）
                </p>
                <div className="space-y-1.5">
                  <FieldLabel>フロントエンド</FieldLabel>
                  <Textarea
                    placeholder={'フレームワーク | Next.js 16 | App Routerのみ\nスタイリング | Tailwind CSS v4 | CSS Modulesは使わない\n状態管理 | React useState / useContext | —'}
                    value={config.frontendStack}
                    onChange={(e) => update('frontendStack', e.target.value)}
                    className="min-h-24 font-mono text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <FieldLabel>バックエンド</FieldLabel>
                  <Textarea
                    placeholder={'ランタイム | Node.js 20 | —\nフレームワーク | Next.js API Routes | —\n認証 | Supabase Auth | —'}
                    value={config.backendStack}
                    onChange={(e) => update('backendStack', e.target.value)}
                    className="min-h-24 font-mono text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <FieldLabel>インフラ・データ</FieldLabel>
                  <Textarea
                    placeholder={'データベース | PostgreSQL (Supabase) | —\nホスティング | Vercel | —\nCI/CD | GitHub Actions | —'}
                    value={config.infraStack}
                    onChange={(e) => update('infraStack', e.target.value)}
                    className="min-h-20 font-mono text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <FieldLabel>開発ツール</FieldLabel>
                  <Textarea
                    placeholder={'パッケージマネージャー | npm\nLinter | ESLint\nフォーマッター | Prettier\nテスト | Vitest'}
                    value={config.devTools}
                    onChange={(e) => update('devTools', e.target.value)}
                    className="min-h-20 font-mono text-xs"
                  />
                  <p className="text-[10px] leading-[120%] tracking-[0.04em] text-muted-foreground">→ 開発ツールは「役割 | 採用技術」の2列形式</p>
                </div>
              </div>
            </SectionCard>

            {/* 3. リポジトリ構成 */}
            <SectionCard
              id="repoStructure"
              label="リポジトリ構成"
              description="エージェントが迷わないよう、重要なファイル・ディレクトリを明示する"
              icon={FolderOpen}
            >
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <FieldLabel>ディレクトリ構造</FieldLabel>
                  <Textarea
                    placeholder={'src/\n├── app/          # Next.js App Router\n├── components/   # Reactコンポーネント\n├── lib/          # ユーティリティ・フック\n└── types/        # 型定義'}
                    value={config.repoStructure}
                    onChange={(e) => update('repoStructure', e.target.value)}
                    className="min-h-40 font-mono text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <FieldLabel>重要ファイル</FieldLabel>
                  <Textarea
                    placeholder={'src/lib/auth.ts — 認証ユーティリティ\nsrc/types/index.ts — 共通型定義\ndocker-compose.yml — ローカル環境のDB設定'}
                    value={config.importantFiles}
                    onChange={(e) => update('importantFiles', e.target.value)}
                    className="min-h-24 font-mono text-xs mb-1"
                  />
                  <p className="text-[10px] leading-[120%] tracking-[0.04em] text-muted-foreground">→ 改行すると箇条書きに出力されます</p>
                </div>
              </div>
            </SectionCard>

            {/* 4. コマンド */}
            <SectionCard
              id="commands"
              label="コマンド"
              description="エージェントが環境を構築・確認するための手順"
              icon={Terminal}
            >
              <div className="space-y-4">
                {([
                  { key: 'cmdInstall', label: 'インストール',       placeholder: 'npm install' },
                  { key: 'cmdDev',     label: '開発サーバー起動',   placeholder: 'npm run dev' },
                  { key: 'cmdBuild',   label: 'ビルド',             placeholder: 'npm run build' },
                  { key: 'cmdTest',    label: 'テスト実行',         placeholder: 'npm test' },
                  { key: 'cmdLint',    label: 'Lint / フォーマット', placeholder: 'npm run lint' },
                ] as const).map(({ key, label, placeholder }) => (
                  <div key={key} className="space-y-1.5">
                    <FieldLabel>{label}</FieldLabel>
                    <Input
                      placeholder={placeholder}
                      value={config[key]}
                      onChange={(e) => update(key, e.target.value)}
                      className="font-mono text-sm"
                    />
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* 5. コーディング規約 */}
            <SectionCard
              id="conventions"
              label="コーディング規約"
              description="エージェントが生成するコードの品質・スタイルを統一する"
              icon={Code}
            >
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <FieldLabel>インデント</FieldLabel>
                  <select
                    value={config.indent}
                    onChange={(e) => update('indent', e.target.value)}
                    className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm"
                  >
                    <option value="スペース2">スペース2</option>
                    <option value="スペース4">スペース4</option>
                    <option value="タブ">タブ</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <FieldLabel>命名規則</FieldLabel>
                  <Textarea
                    placeholder={'変数・関数 | camelCase | getUserName\nクラス | PascalCase | UserService\n定数 | UPPER_SNAKE_CASE | MAX_RETRY_COUNT\nファイル | kebab-case | user-service.ts'}
                    value={config.namingRules}
                    onChange={(e) => update('namingRules', e.target.value)}
                    className="min-h-24 font-mono text-xs"
                  />
                  <p className="text-[10px] leading-[120%] tracking-[0.04em] text-muted-foreground">→ 「対象 | 規則 | 例」の形式で1行1項目</p>
                </div>
                <div className="space-y-1.5">
                  <FieldLabel>禁止事項</FieldLabel>
                  <Textarea
                    placeholder={'console.log をプロダクションコードに残さない\nハードコードされたシークレット・APIキーを絶対にコミットしない\nany型を安易に使用しない'}
                    value={config.prohibitions}
                    onChange={(e) => update('prohibitions', e.target.value)}
                    className="min-h-24 text-sm mb-1"
                  />
                  <p className="text-[10px] leading-[120%] tracking-[0.04em] text-muted-foreground">→ 改行すると箇条書きに出力されます</p>
                </div>
              </div>
            </SectionCard>

            {/* 6. アーキテクチャ & テスト */}
            <SectionCard
              id="architecture"
              label="アーキテクチャ & テスト"
              description="設計判断の指針とテスト方針"
              icon={Blocks}
            >
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <FieldLabel>設計原則</FieldLabel>
                  <Textarea
                    placeholder={'単一責任の原則を徹底する\nドメインロジックはサービス層に集約する\n副作用はリポジトリ層に閉じ込める'}
                    value={config.designPrinciples}
                    onChange={(e) => update('designPrinciples', e.target.value)}
                    className="min-h-24 text-sm mb-1"
                  />
                  <p className="text-[10px] leading-[120%] tracking-[0.04em] text-muted-foreground">→ 改行すると箇条書きに出力されます</p>
                </div>
                <div className="space-y-1.5">
                  <FieldLabel>レイヤー構成</FieldLabel>
                  <Textarea
                    placeholder={'Presentation (API Routes / UI)\n    ↓\nApplication (Use Cases / Services)\n    ↓\nDomain (Entities / Value Objects)\n    ↓\nInfrastructure (DB / External APIs)'}
                    value={config.layerStructure}
                    onChange={(e) => update('layerStructure', e.target.value)}
                    className="min-h-32 font-mono text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <FieldLabel>依存関係のルール</FieldLabel>
                  <Textarea
                    placeholder={'ドメイン層はインフラ層に依存しない\n循環依存を禁止する'}
                    value={config.dependencyRules}
                    onChange={(e) => update('dependencyRules', e.target.value)}
                    className="min-h-20 text-sm mb-1"
                  />
                  <p className="text-[10px] leading-[120%] tracking-[0.04em] text-muted-foreground">→ 改行すると箇条書きに出力されます</p>
                </div>
                <div className="space-y-1.5">
                  <FieldLabel>テスト方針</FieldLabel>
                  <Textarea
                    placeholder={'テスト名は「[状況] のとき [操作] すると [期待結果]」の形式で書く\n外部依存（DB・API）は必ずモック/スタブする\nテストはそれぞれ独立して実行できること（順序依存禁止）'}
                    value={config.testPolicy}
                    onChange={(e) => update('testPolicy', e.target.value)}
                    className="min-h-24 text-sm mb-1"
                  />
                  <p className="text-[10px] leading-[120%] tracking-[0.04em] text-muted-foreground">→ 改行すると箇条書きに出力されます</p>
                </div>
              </div>
            </SectionCard>

            {/* 7. Git 規約 */}
            <SectionCard
              id="git"
              label="Git 規約"
              description="ブランチ命名・コミットメッセージ・PR のルール"
              icon={GitBranch}
            >
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <FieldLabel>ブランチ命名</FieldLabel>
                  <Textarea
                    placeholder={'feature/[issue番号]-[簡潔な説明]   例: feature/42-add-user-auth\nfix/[issue番号]-[簡潔な説明]       例: fix/88-null-pointer-login\nchore/[説明]                        例: chore/update-dependencies'}
                    value={config.branchNaming}
                    onChange={(e) => update('branchNaming', e.target.value)}
                    className="min-h-24 font-mono text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <FieldLabel>コミットメッセージ形式</FieldLabel>
                  <Textarea
                    placeholder={'<type>(<scope>): <summary>\n\n[オプション: 詳細説明]\n\ntype: feat / fix / docs / refactor / test / chore'}
                    value={config.commitFormat}
                    onChange={(e) => update('commitFormat', e.target.value)}
                    className="min-h-24 font-mono text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <FieldLabel>PR のルール</FieldLabel>
                  <Textarea
                    placeholder={'1 PR = 1つの目的（機能追加とリファクタは分ける）\nレビュー前にセルフレビューを行う\nPRテンプレートがある場合は必ず埋める'}
                    value={config.prRules}
                    onChange={(e) => update('prRules', e.target.value)}
                    className="min-h-20 text-sm mb-1"
                  />
                  <p className="text-[10px] leading-[120%] tracking-[0.04em] text-muted-foreground">→ 改行すると箇条書きに出力されます</p>
                </div>
              </div>
            </SectionCard>

            {/* 8. エージェント行動指示 */}
            <SectionCard
              id="agentRules"
              label="エージェント行動指示"
              description="AI エージェントが自律的に動く際の制約・優先順位"
              icon={Bot}
            >
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <FieldLabel requirement="required">必ずすること (MUST)</FieldLabel>
                  <Textarea
                    placeholder={'変更前に既存のテストが通ることを確認する\n新しいファイルを作成する前に既存ファイルを確認する\n不明な仕様は推測せず、コメント or ドキュメントを確認する\n破壊的変更（APIの削除・DBスキーマ変更）は実行前に確認を求める'}
                    value={config.mustDo}
                    onChange={(e) => update('mustDo', e.target.value)}
                    className="min-h-28 text-sm mb-1"
                  />
                  <p className="text-[10px] leading-[120%] tracking-[0.04em] text-muted-foreground">→ 改行すると箇条書きに出力されます</p>
                </div>
                <div className="space-y-1.5">
                  <FieldLabel requirement="required">してはいけないこと (MUST NOT)</FieldLabel>
                  <Textarea
                    placeholder={'.env ファイルや秘密情報をコミットする\nmain / master ブランチへ直接プッシュする\nテストを削除してカバレッジを下げる\n本番データベースに対してDDLを直接実行する'}
                    value={config.mustNot}
                    onChange={(e) => update('mustNot', e.target.value)}
                    className="min-h-28 text-sm mb-1"
                  />
                  <p className="text-[10px] leading-[120%] tracking-[0.04em] text-muted-foreground">→ 改行すると箇条書きに出力されます</p>
                </div>
                <div className="space-y-1.5">
                  <FieldLabel>推奨される行動 (SHOULD)</FieldLabel>
                  <Textarea
                    placeholder={'大きな変更は小さなステップに分割して実行する\n既存コードのパターンに従い、スタイルを統一する\n変更範囲が広い場合は計画を提示してから実行する'}
                    value={config.should}
                    onChange={(e) => update('should', e.target.value)}
                    className="min-h-24 text-sm mb-1"
                  />
                  <p className="text-[10px] leading-[120%] tracking-[0.04em] text-muted-foreground">→ 改行すると箇条書きに出力されます</p>
                </div>
              </div>
            </SectionCard>

            {/* 9. 環境変数 & 外部サービス & リソース */}
            <SectionCard
              id="envServices"
              label="環境変数 & 外部サービス"
              description="エージェントが参照すべき設定情報とリソース"
              icon={Server}
            >
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <FieldLabel>環境変数一覧</FieldLabel>
                  <Textarea
                    placeholder={'DATABASE_URL | ✅ | DBの接続文字列 | —\nAPI_KEY | ✅ | 外部APIキー | —\nLOG_LEVEL | — | ログ出力レベル | info'}
                    value={config.envVars}
                    onChange={(e) => update('envVars', e.target.value)}
                    className="min-h-24 font-mono text-xs"
                  />
                  <p className="text-[10px] leading-[120%] tracking-[0.04em] text-muted-foreground">→ 「変数名 | 必須 | 説明 | デフォルト」の形式で1行1変数</p>
                </div>
                <div className="space-y-1.5">
                  <FieldLabel>外部依存サービス</FieldLabel>
                  <Textarea
                    placeholder={'PostgreSQL | データ永続化 | Docker Compose\nRedis | セッション管理 | Docker Compose\nSendGrid | メール送信 | MailHog'}
                    value={config.externalServices}
                    onChange={(e) => update('externalServices', e.target.value)}
                    className="min-h-20 font-mono text-xs"
                  />
                  <p className="text-[10px] leading-[120%] tracking-[0.04em] text-muted-foreground">→ 「サービス | 用途 | ローカル代替」の形式で1行1サービス</p>
                </div>
                <div className="space-y-1.5">
                  <FieldLabel>よくあるタスク</FieldLabel>
                  <Textarea
                    placeholder={'新しいAPIエンドポイントを追加する: src/routes/ → src/services/ → tests/ の順で実装\nデータベースマイグレーションを追加する: マイグレーションファイル生成 → Up/Down実装 → ローカル確認'}
                    value={config.commonTasks}
                    onChange={(e) => update('commonTasks', e.target.value)}
                    className="min-h-20 text-sm mb-1"
                  />
                  <p className="text-[10px] leading-[120%] tracking-[0.04em] text-muted-foreground">→ 改行すると箇条書きに出力されます</p>
                </div>
                <div className="space-y-1.5">
                  <FieldLabel>参考リソース</FieldLabel>
                  <Textarea
                    placeholder={'設計ドキュメント: docs/architecture.md\nAPIドキュメント: https://...\nチームWiki: https://notion.so/...'}
                    value={config.references}
                    onChange={(e) => update('references', e.target.value)}
                    className="min-h-20 text-sm mb-1"
                  />
                  <p className="text-[10px] leading-[120%] tracking-[0.04em] text-muted-foreground">→ 改行すると箇条書きに出力されます</p>
                </div>
              </div>
            </SectionCard>

          </div>

          {/* Preview & Save */}
          <div className="space-y-5">
            <div className="lg:sticky lg:top-20 space-y-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="agent-filename">ファイル名</Label>
                  {fileCount !== null && (
                    <span className={`text-xs font-mono ${fileCount >= maxFiles ? 'text-destructive' : 'text-muted-foreground'}`}>
                      {fileCount} / {maxFiles}
                    </span>
                  )}
                </div>
                <Input
                  id="agent-filename"
                  placeholder="AGENT.md"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  disabled={isSaving}
                />
              </div>

              <Textarea
                ref={previewScrollRef}
                value={preview}
                readOnly
                className="h-[calc(100vh-400px)] min-h-64 font-mono text-xs"
              />

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => downloadTextFile(fileName || 'AGENT.md', preview)}
                  className="flex-1"
                >
                  ダウンロード
                </Button>
                {!isAuthLoading && (
                  isLoggedIn ? (
                    <Button
                      onClick={() => save(preview)}
                      disabled={isSaving}
                      className="flex-1"
                    >
                      {isSaving ? '保存中...' : '保存'}
                    </Button>
                  ) : (
                    <a
                      href="/auth/login"
                      className={cn(buttonVariants({ variant: 'default' }), 'flex-1 justify-center')}
                    >
                      ログインして保存
                    </a>
                  )
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </>
  )
}
