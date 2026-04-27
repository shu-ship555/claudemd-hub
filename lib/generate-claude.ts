export interface McpTool {
  name: string
  trigger: string
  tools: string
  notes: string
}

export interface ClaudeConfig {
  language: string
  framework: string
  styling: string
  uiLib: string
  icons: string
  backend: string
  principles: string
  lintCmd: string
  designRef: string
  designRules: string
  mcpTools: McpTool[]
  refactoringRules: string
  backendRules: string
  customRules: string
}

export const DEFAULT_CLAUDE_CONFIG: ClaudeConfig = {
  language: '日本語',
  framework: '',
  styling: '',
  uiLib: '',
  icons: '',
  backend: '',
  principles:
    'KISS (Keep It Simple, Stupid): 常に最もシンプルな解決策を選択してください\nYAGNI (You Ain\'t Gonna Need It): 現時点で必要な機能のみを実装してください\nDRY (Don\'t Repeat Yourself): コードの重複を排除してください',
  lintCmd: '',
  designRef: 'DESIGN.md',
  designRules:
    'DESIGN.md に定義されているカラーパレット、タイポグラフィ、スペーシングの規則を逸脱しないでください',
  mcpTools: [],
  refactoringRules: '',
  backendRules: '',
  customRules: '',
}

export const MCP_PRESETS: { label: string; tool: McpTool }[] = [
  {
    label: 'Figma',
    tool: {
      name: 'Figma MCP',
      trigger: 'UIコンポーネントの実装・修正時',
      tools: 'get_design_context, get_screenshot, get_metadata',
      notes:
        'DESIGN.md のカラートークンはFigmaの値と同期済みのため、実装時はFigma MCPの値を正とする\nCode Connect設定がある場合はそれを優先する\nデザインアノテーションがある場合は必ず従う',
    },
  },
  {
    label: 'GitHub',
    tool: {
      name: 'GitHub MCP',
      trigger: 'Issue確認・PR作成・コードレビュー時',
      tools: 'get_issue, create_pull_request, list_pull_requests, get_file_contents',
      notes:
        'Issue番号はブランチ名に含める\nPRはテンプレートに従い、レビュアーを必ず指定する',
    },
  },
  {
    label: 'Supabase',
    tool: {
      name: 'Supabase MCP',
      trigger: 'スキーマ確認・マイグレーション生成時',
      tools: 'list_tables, execute_sql, create_migration',
      notes:
        '本番DBへの直接DDL実行は禁止。必ずマイグレーションファイルを生成する\nRLSポリシーの変更は必ず確認を求める',
    },
  },
]

function hasValue(s: string): boolean {
  return s.trim().length > 0
}

function toLines(raw: string): string[] {
  return raw
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
}

function renderList(raw: string): string {
  return toLines(raw)
    .map((l) => (l.startsWith('-') ? l : `- ${l}`))
    .join('\n')
}

export function generateClaudeMarkdown(config: ClaudeConfig): string {
  const parts: string[] = []

  // Language
  if (hasValue(config.language)) {
    parts.push('## Language')
    parts.push('')
    parts.push(
      `- **Communication**: ユーザーとの対話はすべて**${config.language.trim()}**で行ってください。`
    )
    parts.push('')
  }

  // Framework & Library
  const frameworkLines: string[] = []
  if (hasValue(config.framework)) frameworkLines.push(`- **Core**: ${config.framework.trim()}`)
  if (hasValue(config.styling)) frameworkLines.push(`- **Styling**: ${config.styling.trim()}`)
  if (hasValue(config.uiLib)) frameworkLines.push(`- **UI Components**: ${config.uiLib.trim()}`)
  if (hasValue(config.icons)) frameworkLines.push(`- **Icons**: ${config.icons.trim()}`)
  if (hasValue(config.backend)) frameworkLines.push(`- **Backend**: ${config.backend.trim()}`)
  if (frameworkLines.length > 0) {
    parts.push('## Framework & Library')
    parts.push('')
    parts.push(frameworkLines.join('\n'))
    parts.push('')
  }

  // Code Quality
  const qualityLines: string[] = []
  if (hasValue(config.principles)) {
    toLines(config.principles).forEach((l) =>
      qualityLines.push(`- ${l.replace(/^[-•]\s*/, '')}`)
    )
  }
  if (hasValue(config.lintCmd)) {
    qualityLines.push(
      `- **Linting**: 実装後は必ず \`${config.lintCmd.trim()}\` を実行し、静的解析エラーがないことを確認してください。`
    )
  }
  if (qualityLines.length > 0) {
    parts.push('## Code Quality & Engineering Principles')
    parts.push('')
    parts.push(qualityLines.join('\n'))
    parts.push('')
  }

  // Design Enforcement
  const designLines: string[] = []
  if (hasValue(config.designRef)) {
    designLines.push(
      `- UIの実装や修正を行う際は、必ずプロジェクトルートにある \`${config.designRef.trim()}\` を参照してください。`
    )
  }
  if (hasValue(config.designRules)) {
    toLines(config.designRules).forEach((l) =>
      designLines.push(`- ${l.replace(/^[-•]\s*/, '')}`)
    )
  }
  if (designLines.length > 0) {
    parts.push('## Design Enforcement')
    parts.push('')
    parts.push(designLines.join('\n'))
    parts.push('')
  }

  // MCP Tools
  const validMcp = config.mcpTools.filter((t) => hasValue(t.name))
  if (validMcp.length > 0) {
    parts.push('## MCP Tools')
    parts.push('')
    for (const tool of validMcp) {
      parts.push(`### ${tool.name.trim()}`)
      if (hasValue(tool.trigger)) {
        parts.push(`- **使用タイミング**: ${tool.trigger.trim()}`)
      }
      if (hasValue(tool.tools)) {
        const toolNames = tool.tools
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
          .map((s) => `\`${s}\``)
          .join(', ')
        parts.push(`- **主要ツール**: ${toolNames}`)
      }
      if (hasValue(tool.notes)) {
        toLines(tool.notes).forEach((l) => parts.push(`- ${l.replace(/^[-•]\s*/, '')}`))
      }
      parts.push('')
    }
  }

  // Refactoring
  if (hasValue(config.refactoringRules)) {
    parts.push('## Refactoring & Optimization')
    parts.push('')
    parts.push(renderList(config.refactoringRules))
    parts.push('')
  }

  // Backend Integration
  if (hasValue(config.backendRules)) {
    parts.push('## Backend Integration')
    parts.push('')
    parts.push(renderList(config.backendRules))
    parts.push('')
  }

  // Custom Rules
  if (hasValue(config.customRules)) {
    parts.push('## Custom Rules')
    parts.push('')
    parts.push(config.customRules.trim())
    parts.push('')
  }

  return parts.join('\n').trim() + '\n'
}
