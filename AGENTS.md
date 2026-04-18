## Language
- **Communication**: ユーザーとの対話はすべて**日本語**で行ってください。

## Design Enforcement
- UIの実装や修正を行う際は、必ずプロジェクトルートにある `DESIGN.md` を参照してください。
- `DESIGN.md` に定義されているカラーパレット、タイポグラフィ、スペーシングの規則を逸脱しないでください。
- **Tailwind CSS v4** を使用しているため、カスタムテーマや変数は `app/globals.css` の `@theme` ブロックを確認し、CSS 変数（CSS Variables）ベースの設計に従ってください。
- コンポーネントの実装には、`@base-ui/react` をプリミティブとして活用し、一貫したアクセシビリティと挙動を担保してください。

## Framework & Library
- **Core**: Next.js 16 (App Router), React 19
- **Styling**: Tailwind CSS v4, `lucide-react` (Icons)
- **UI Components**: `@base-ui/react` (Unstyled components)
- **Utilities**: `clsx`, `tailwind-merge` を使用したクラス名の結合
- **Backend**: Supabase (Auth / SSR / Database)

## Code Quality & Engineering Principles
- **KISS (Keep It Simple, Stupid)**: 常に最もシンプルな解決策を選択してください。不必要な複雑さは避け、誰が見ても理解しやすいコードを記述してください。
- **YAGNI (You Ain't Gonna Need It)**: 現時点で必要な機能のみを実装してください。将来の予測に基づいた過度な抽象化は禁止です。
- **DRY (Don't Repeat Yourself)**: コードの重複を排除してください。ただし、早期すぎる抽象化が KISS を損なう場合は、バランスを検討してください。
- **Modern React**: React 19 の機能（`use` hook, Server Actions など）を積極的に活用し、最新のベストプラクティスに従ってください。
- **Linting**: 実装後は必ず `npm run lint` を実行し、静的解析エラーがないことを確認してください。

## Refactoring & Optimization
- ロジックやUIの重複を検知した場合は、作業を開始する前に必ず以下の手順を踏んでください：
  1. **重複箇所の特定**: 重複している箇所をリストアップし、ユーザーに報告する。
  2. **共通化プランの提示**: `components/ui` への共通コンポーネント化や、`hooks/` へのカスタムフック化など、具体的な計画を提示する。
  3. **承認と実施**: 提示した計画についてユーザーの承認を得た後、実装を実行する。

## Supabase Integration
- 認証やデータ取得には `@supabase/ssr` を使用し、Server Components と Client Components の適切な責務分担を行ってください。
- セッション管理やデータベース操作において、型安全性を確保するために定義された型定義を活用してください。