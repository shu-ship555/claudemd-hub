# DESIGN.md Generation Service — Design Guidelines

## 1. Visual Theme & Atmosphere
本サービスは、プロダクトの設計思想を美しく、かつ精密にドキュメント化するための「DESIGN.md」を生成します。Appleのミニマリズムをベースに、ユーザーが入力した設計情報が「ギャラリーの展示物」のように際立つインターフェースを目指します。

- **Cinematic Pacing**: 純粋な背景色（`bg-background`）と、情報の区切りを示すセクション背景（`bg-muted`）を交互に配し、流れるような閲覧体験を提供します。
- **Focus on Clarity**: 装飾的な境界線を排除し、広大な余白とタイポグラフィの階層のみで構造を表現します。
- **Instructional Elegance**: 生成されるドキュメントのプレビューは、常に等幅フォント（`font-mono`）とセマンティックな配色により、技術的な正確さを演出します。

---

## 2. Typography & Hierarchy
`Geist Mono` の機能性を組み合わせ、設計書としての信頼性を高めます。

### Font Families
| Role | Font Stack | Notes |
| :--- | :--- | :--- |
| **Interface / Headings** | Geist Mono + Noto Sans JP | 欧文のモダンさと和文の可読性を両立。 |
| **Code / Specs / Values** | Geist Mono (`font-mono`) | 設定値、コード片、プロパティ記述用。 |

### Type Scale & Rules
- **Heading 1**: `text-lg` (18px) / Bold / Tracking `-0.02em`
- **Sub Heading**: `text-sm` (14px) / Medium
- **Body / Labels**: `text-sm` (14px) / Regular / Line Height `1.47`
- **Technical Values**: `text-xl` (20px) / Bold / `font-mono`
- **Minimal Size**: 視認性担保のため `text-[10px]` を最小値とする。
- **Optical Tracking**: すべてのサイズで微細なネガティブ・トラッキングを適用し、タイトで洗練された印象を与えます。
- **Do Not Use Emoji**: 絵文字の使用を禁止します。絵文字と同等の効果を得たい場合アイコンをしようします。

---

## 3. Color Palette (Tone on Tone System)
色は「意味」を伝達するためのシグナルとして定義します。背景（不透明度10%）と、同系色の濃いテキストを組み合わせることで、高いコントラストとモダンな質感を両立させます。

### Semantic Logic
| Role | Token / Background (10%) | Foreground (Light/Dark) | Purpose |
| :--- | :--- | :--- | :--- |
| **Info / Primary** | `bg-blue-500/10` | `text-blue-600` / `-400` | 主要な情報・仕様の記述 |
| **Success / Valid** | `bg-green-500/10` | `text-green-700` / `-400` | 推奨事項・パスした要件 |
| **Warning / Caution** | `bg-yellow-500/10` | `text-yellow-700` / `-400` | 注意事項・非推奨の兆候 |
| **Danger / Critical** | `bg-red-500/10` | `text-red-700` / `-400` | 破壊的操作・エラー・警告 |
| **Accent / Energy** | `bg-orange-500/10` | `text-orange-700` / `-400` | 強調したいハイライト値 |

> **Contrast Rule:** WCAG 2.1 AA (4.5:1) を遵守。`-500` はテキスト色として使用せず、塗りや背景のみに使用します。

---

## 4. Layout & Spacing
設計ユニットは `8 (2rem)`。すべての数値は 2・4・8 の倍数に収束させます。

### Visual Balance (上方錯視の補正)
全て余白は、人間の目の特性に合わせ上部をわずかに詰め、光学的中心を整えます。
上部と下部の余白差は8〜10%以内に収めてください。

### Responsive Behavior
- **Max Content Width**: `max-w-7xl:` (約1280px) で情報の拡散を防止。
- **Grid Strategy**: スマートフォンでは1〜2列、PC（`sm`以上）では4列を基本とし、ドキュメントの密度を最適化します。

---

## 5. Components & Interaction
### Card & Surface
- **Border Radius**: `--radius: 0.625rem` (10px) を基準とした倍数系。
- **Elevation**: `rgba(0, 0, 0, 0.22) 3px 5px 30px 0px` のソフトな影により、平面上の「重なり」を表現。

### Action Elements
- **Primary Button**: `bg-primary` ＋ `hover:bg-primary/80`。
- **Icon Buttons**: `size="icon" variant="ghost"`。ホバー時に `bg-muted` へ変化。
- **Interactive Depth**: FABなどの重要ボタンは `hover:scale-105` と `hover:shadow-xl` を適用。

---

## 6. Guidelines for Generation
- **Date & Time**: 常に `src/lib/date-utils.ts` を経由し、JST基準でフォーマット。
- **Skeleton States**: 生成プロセス中やデータ取得中は `<Skeleton>` を用い、レイアウトシフトを防止。
- **Empty States**: 記述がない項目は単に隠すのではなく、入力を促す、あるいは「未定義」であることを明示するプレースホルダーを表示。