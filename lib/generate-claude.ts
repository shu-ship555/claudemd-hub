import { hasValue, toLines, renderList } from './string-utils'

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
  {
    label: 'Context7',
    tool: {
      name: 'Context7 MCP',
      trigger: 'ライブラリ・フレームワークのAPIを実装・確認時',
      tools: 'resolve-library-id, get-library-docs',
      notes:
        '学習済みの古いAPI情報よりContext7で取得した最新ドキュメントを優先する\nバージョン指定が可能な場合は使用中のバージョンを明示する',
    },
  },
  {
    label: 'Playwright',
    tool: {
      name: 'Playwright MCP',
      trigger: 'E2Eテスト作成・ブラウザ操作の自動化時',
      tools: 'browser_navigate, browser_click, browser_screenshot, browser_snapshot',
      notes:
        'テスト実行は必ずローカル環境で確認する\nスクリーンショットを活用してUIの状態を検証する',
    },
  },
  {
    label: 'Linear',
    tool: {
      name: 'Linear MCP',
      trigger: 'Issue確認・タスク更新・プロジェクト管理時',
      tools: 'get_issue, create_issue, update_issue, list_issues',
      notes:
        '実装前に関連Issueのコメントと要件を必ず確認する\nブランチ名はIssue IDを含める',
    },
  },
  {
    label: 'Notion',
    tool: {
      name: 'Notion MCP',
      trigger: 'ドキュメント参照・仕様書確認・ページ更新時',
      tools: 'search, get_page, create_page, update_page',
      notes:
        '仕様変更があった場合はNotionのドキュメントも更新する\n社内ルールやAPI仕様はNotionを正とする',
    },
  },
  {
    label: 'Sentry',
    tool: {
      name: 'Sentry MCP',
      trigger: 'バグ調査・エラートレース確認時',
      tools: 'get_error_details, list_issues, get_event',
      notes:
        'エラー修正前にSentryのスタックトレースと発生頻度を必ず確認する\n同一エラーの過去の修正履歴も参照する',
    },
  },
  {
    label: 'Vercel',
    tool: {
      name: 'Vercel MCP',
      trigger: 'デプロイ確認・環境変数管理・ログ調査時',
      tools: 'list_deployments, get_deployment_logs, list_env_variables',
      notes:
        '本番環境の環境変数変更は慎重に行い、必ずプレビューデプロイで確認する\nデプロイ失敗時はビルドログを最初に確認する',
    },
  },
  {
    label: 'Brave Search',
    tool: {
      name: 'Brave Search MCP',
      trigger: '最新情報・ライブラリの最新バージョン・エラー解決策の検索時',
      tools: 'brave_web_search, brave_local_search',
      notes:
        '学習データのカットオフ以降の情報や公式ドキュメントがない場合に使用する\n検索結果は複数ソースで裏取りする',
    },
  },
]

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
