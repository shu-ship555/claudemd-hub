export type TechRow3 = { role: string; tech: string; note: string }
export type TechRow2 = { role: string; tech: string }

export interface AgentConfig {
  projectName: string
  description: string
  languages: string
  targetEnv: string
  frontendStack: TechRow3[]
  backendStack: TechRow3[]
  infraStack: TechRow3[]
  devTools: TechRow3[]
  repoStructure: string
  importantFiles: string
  cmdInstall: string
  cmdDev: string
  cmdBuild: string
  cmdTest: string
  cmdLint: string
  indent: string
  charset: string
  lineEnding: string
  namingRules: string
  prohibitions: string
  designPrinciples: string
  layerStructure: string
  dependencyRules: string
  testPolicy: string
  branchNaming: string
  commitFormat: string
  prRules: string
  mustDo: string
  mustNot: string
  should: string
  envVars: string
  externalServices: string
  commonTasks: string
  references: string
  maintainer: string
  contact: string
  version: string
  lastUpdated: string
}

export const DEFAULT_AGENT_CONFIG: AgentConfig = {
  projectName: '',
  description: '',
  languages: '',
  targetEnv: '',
  frontendStack: [
    { role: 'フレームワーク', tech: '', note: '' },
    { role: 'スタイリング', tech: '', note: '' },
    { role: '状態管理', tech: '', note: '' },
    { role: 'データフェッチ', tech: '', note: '' },
    { role: 'フォーム', tech: '', note: '' },
  ],
  backendStack: [
    { role: 'ランタイム', tech: '', note: '' },
    { role: 'フレームワーク', tech: '', note: '' },
    { role: 'ORM', tech: '', note: '' },
    { role: '認証', tech: '', note: '' },
  ],
  infraStack: [
    { role: 'データベース', tech: '', note: '' },
    { role: 'キャッシュ', tech: '', note: '' },
    { role: 'ホスティング', tech: '', note: '' },
    { role: 'CI/CD', tech: '', note: '' },
  ],
  devTools: [
    { role: 'パッケージマネージャー', tech: '', note: '' },
    { role: 'Linter', tech: '', note: '' },
    { role: 'フォーマッター', tech: '', note: '' },
    { role: 'テスト', tech: '', note: '' },
  ],
  repoStructure: '',
  importantFiles: '',
  cmdInstall: '',
  cmdDev: '',
  cmdBuild: '',
  cmdTest: '',
  cmdLint: '',
  indent: '',
  charset: '',
  lineEnding: '',
  namingRules: '',
  prohibitions: '',
  designPrinciples: '',
  layerStructure: '',
  dependencyRules: '',
  testPolicy: '',
  branchNaming: '',
  commitFormat: '',
  prRules: '',
  mustDo: '',
  mustNot: '',
  should: '',
  envVars: '',
  externalServices: '',
  commonTasks: '',
  references: '',
  maintainer: '',
  contact: '',
  version: '',
  lastUpdated: '',
}

function hasValue(s: string): boolean {
  return s.trim().length > 0
}

function toLines(raw: string): string[] {
  return raw.split('\n').map((l) => l.trim()).filter(Boolean)
}

function parseRows(raw: string): string[][] {
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.split(/[|｜]/).map((cell) => cell.trim()))
}

function renderTable(headers: string[], rows: string[][]): string {
  const validRows = rows.filter((r) => r.some((c) => c))
  if (validRows.length === 0) return ''
  const headerLine = `| ${headers.join(' | ')} |`
  const separator = `| ${headers.map(() => '------').join(' | ')} |`
  const dataLines = validRows.map((row) => {
    const cells = headers.map((_, i) => row[i] ?? '')
    return `| ${cells.join(' | ')} |`
  })
  return [headerLine, separator, ...dataLines].join('\n')
}

function renderList(raw: string): string {
  return toLines(raw)
    .map((l) => (l.startsWith('-') ? l : `- ${l}`))
    .join('\n')
}

export function generateAgentMarkdown(config: AgentConfig): string {
  const parts: string[] = []
  const projectName = config.projectName.trim()

  parts.push(`# ${projectName || 'AGENT.md'} — AI Agent Instructions`)
  parts.push('')
  parts.push('')

  let idx = 0

  // 1. プロジェクト概要
  const overviewLines: string[] = []
  if (hasValue(config.projectName)) overviewLines.push(`**プロジェクト名:** ${config.projectName.trim()}`)
  if (hasValue(config.description)) overviewLines.push(`**目的・概要:** ${config.description.trim()}`)
  if (hasValue(config.languages)) overviewLines.push(`**主要言語・フレームワーク:** ${config.languages.trim()}`)
  if (hasValue(config.targetEnv)) overviewLines.push(`**ターゲット環境:** ${config.targetEnv.trim()}`)
  if (hasValue(config.maintainer)) overviewLines.push(`**メンテナー:** ${config.maintainer.trim()}`)
  if (hasValue(config.contact)) overviewLines.push(`**連絡先:** ${config.contact.trim()}`)
  if (hasValue(config.version)) overviewLines.push(`**バージョン:** ${config.version.trim()}`)
  if (hasValue(config.lastUpdated)) overviewLines.push(`**最終更新日:** ${config.lastUpdated.trim()}`)
  if (overviewLines.length > 0) {
    idx++
    parts.push(`## ${idx}. Project Overview`)
    parts.push('')
    parts.push(overviewLines.join('\n'))
    parts.push('')
    parts.push('---')
    parts.push('')
  }

  // 2. 技術スタック
  const techSections: string[] = []
  const renderTech3 = (title: string, rows: TechRow3[]) => {
    const valid = rows.filter((r) => r.tech.trim())
    if (valid.length === 0) return
    techSections.push(`### ${title}`)
    techSections.push(renderTable(['役割', '採用技術', '備考'], valid.map((r) => [r.role, r.tech, r.note])))
    techSections.push('')
  }
  renderTech3('フロントエンド', config.frontendStack)
  renderTech3('バックエンド', config.backendStack)
  renderTech3('インフラ・データ', config.infraStack)
  renderTech3('開発ツール', config.devTools)
  if (techSections.length > 0) {
    idx++
    parts.push(`## ${idx}. Tech Stack`)
    parts.push('')
    parts.push(techSections.join('\n'))
    parts.push('> ⚠️ **上記以外のライブラリを新たに追加する場合は必ず確認を求めること。**')
    parts.push('')
    parts.push('---')
    parts.push('')
  }

  // 3. リポジトリ構成
  const repoContent: string[] = []
  if (hasValue(config.repoStructure)) {
    repoContent.push('```')
    repoContent.push(config.repoStructure.trim())
    repoContent.push('```')
  }
  if (hasValue(config.importantFiles)) {
    repoContent.push('')
    repoContent.push('**重要ファイル:**')
    repoContent.push(renderList(config.importantFiles))
  }
  if (repoContent.length > 0) {
    idx++
    parts.push(`## ${idx}. Repository Structure`)
    parts.push('')
    parts.push(repoContent.join('\n'))
    parts.push('')
    parts.push('---')
    parts.push('')
  }

  // 4. セットアップ & コマンド
  const cmds = [
    { label: 'インストール', value: config.cmdInstall },
    { label: '開発サーバー起動', value: config.cmdDev },
    { label: 'ビルド', value: config.cmdBuild },
    { label: 'テスト実行', value: config.cmdTest },
    { label: 'Lint / フォーマット', value: config.cmdLint },
  ].filter((c) => hasValue(c.value))
  if (cmds.length > 0) {
    idx++
    parts.push(`## ${idx}. Setup & Commands`)
    parts.push('')
    for (const { label, value } of cmds) {
      parts.push(`### ${label}`)
      parts.push('```bash')
      parts.push(value.trim())
      parts.push('```')
      parts.push('')
    }
    parts.push('---')
    parts.push('')
  }

  // 5. コーディング規約
  const conventionContent: string[] = []
  const generalLines: string[] = []
  if (hasValue(config.indent)) generalLines.push(`- インデント: ${config.indent}`)
  if (hasValue(config.charset)) generalLines.push(`- 文字コード: ${config.charset}`)
  if (hasValue(config.lineEnding)) generalLines.push(`- 行末: ${config.lineEnding}`)
  if (generalLines.length > 0) {
    conventionContent.push('### 全般')
    conventionContent.push(generalLines.join('\n'))
    conventionContent.push('')
  }
  if (hasValue(config.namingRules)) {
    const table = renderTable(['対象', '規則', '例'], parseRows(config.namingRules))
    if (table) {
      conventionContent.push('### 命名規則')
      conventionContent.push(table)
      conventionContent.push('')
    }
  }
  if (hasValue(config.prohibitions)) {
    conventionContent.push('### 禁止事項')
    conventionContent.push(renderList(config.prohibitions))
    conventionContent.push('')
  }
  if (conventionContent.length > 0) {
    idx++
    parts.push(`## ${idx}. Coding Conventions`)
    parts.push('')
    parts.push(conventionContent.join('\n'))
    parts.push('---')
    parts.push('')
  }

  // 6. アーキテクチャ & 設計方針 + テスト方針
  const archContent: string[] = []
  if (hasValue(config.designPrinciples)) {
    archContent.push('### 設計原則')
    archContent.push(renderList(config.designPrinciples))
    archContent.push('')
  }
  if (hasValue(config.layerStructure)) {
    archContent.push('### レイヤー構成')
    archContent.push('```')
    archContent.push(config.layerStructure.trim())
    archContent.push('```')
    archContent.push('')
  }
  if (hasValue(config.dependencyRules)) {
    archContent.push('### 依存関係のルール')
    archContent.push(renderList(config.dependencyRules))
    archContent.push('')
  }
  if (hasValue(config.testPolicy)) {
    archContent.push('### テスト方針')
    archContent.push(renderList(config.testPolicy))
    archContent.push('')
  }
  if (archContent.length > 0) {
    idx++
    parts.push(`## ${idx}. Architecture & Design`)
    parts.push('')
    parts.push(archContent.join('\n'))
    parts.push('---')
    parts.push('')
  }

  // 7. Git 規約
  const gitContent: string[] = []
  if (hasValue(config.branchNaming)) {
    gitContent.push('### ブランチ命名')
    gitContent.push('```')
    gitContent.push(config.branchNaming.trim())
    gitContent.push('```')
    gitContent.push('')
  }
  if (hasValue(config.commitFormat)) {
    gitContent.push('### コミットメッセージ')
    gitContent.push('```')
    gitContent.push(config.commitFormat.trim())
    gitContent.push('```')
    gitContent.push('')
  }
  if (hasValue(config.prRules)) {
    gitContent.push('### PR のルール')
    gitContent.push(renderList(config.prRules))
    gitContent.push('')
  }
  if (gitContent.length > 0) {
    idx++
    parts.push(`## ${idx}. Git Conventions`)
    parts.push('')
    parts.push(gitContent.join('\n'))
    parts.push('---')
    parts.push('')
  }

  // 8. エージェント行動指示
  const agentContent: string[] = []
  if (hasValue(config.mustDo)) {
    agentContent.push('### 必ずすること')
    agentContent.push(renderList(config.mustDo))
    agentContent.push('')
  }
  if (hasValue(config.mustNot)) {
    agentContent.push('### してはいけないこと')
    agentContent.push(renderList(config.mustNot))
    agentContent.push('')
  }
  if (hasValue(config.should)) {
    agentContent.push('### 推奨される行動')
    agentContent.push(renderList(config.should))
    agentContent.push('')
  }
  if (agentContent.length > 0) {
    idx++
    parts.push(`## ${idx}. Agent Behavior Rules`)
    parts.push('')
    parts.push(agentContent.join('\n'))
    parts.push('---')
    parts.push('')
  }

  // 9. 環境変数 & 外部サービス & よくあるタスク & 参考リソース
  const envContent: string[] = []
  if (hasValue(config.envVars)) {
    const rows = parseRows(config.envVars).filter((r) => r.some((c) => c))
    if (rows.length > 0) {
      envContent.push('### 環境変数一覧')
      envContent.push('| 変数名 | 必須 | 説明 | デフォルト |')
      envContent.push('|--------|------|------|------------|')
      for (const row of rows) {
        const name = row[0] ?? ''
        envContent.push(`| \`${name}\` | ${row[1] ?? ''} | ${row[2] ?? ''} | ${row[3] ?? ''} |`)
      }
      envContent.push('')
      envContent.push('> シークレットは `.env.example` を参照し、実際の値は **絶対にコードに書かない**。')
      envContent.push('')
    }
  }
  if (hasValue(config.externalServices)) {
    const table = renderTable(['サービス', '用途', 'ローカル代替'], parseRows(config.externalServices))
    if (table) {
      envContent.push('### 外部依存サービス')
      envContent.push(table)
      envContent.push('')
    }
  }
  if (hasValue(config.commonTasks)) {
    envContent.push('### よくあるタスク')
    envContent.push(renderList(config.commonTasks))
    envContent.push('')
  }
  if (hasValue(config.references)) {
    envContent.push('### 参考リソース')
    envContent.push(renderList(config.references))
    envContent.push('')
  }
  if (envContent.length > 0) {
    idx++
    parts.push(`## ${idx}. External Services & Env Vars`)
    parts.push('')
    parts.push(envContent.join('\n'))
    parts.push('---')
    parts.push('')
  }

  return parts.join('\n').trim() + '\n'
}
