export interface McpTool {
  name: string
  trigger: string
  tools: string
  notes: string
}

export interface ClaudeConfig {
  agentsPath: string
  designPath: string
  language: string
  mcpTools: McpTool[]
  refactoringRules: string
  customRules: string
}

export const DEFAULT_CLAUDE_CONFIG: ClaudeConfig = {
  agentsPath: '',
  designPath: '',
  language: '',
  mcpTools: [],
  refactoringRules: '',
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

  parts.push('# CLAUDE.md')
  parts.push('')

  // @ file references
  const refs = [config.agentsPath, config.designPath].filter(hasValue)
  if (refs.length > 0) {
    refs.forEach((p) => parts.push(`@${p.trim()}`))
    parts.push('')
  }

  // Language
  if (hasValue(config.language)) {
    parts.push('## Language')
    parts.push('')
    parts.push(
      `- **Communication**: ユーザーとの対話はすべて**${config.language.trim()}**で行ってください。`
    )
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

  // Custom Rules
  if (hasValue(config.customRules)) {
    parts.push('## Custom Rules')
    parts.push('')
    parts.push(config.customRules.trim())
    parts.push('')
  }

  return parts.join('\n').trim() + '\n'
}
