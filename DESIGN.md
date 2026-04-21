# Design System Guidelines

## 1. Visual Theme & Atmosphere

ライトなベースカラーにブルー系のアクセントを組み合わせた、クリーンでプロフェッショナルなビジュアル。余白を活かしたレイアウトで情報の見通しをよくする。

**Key Characteristics:**
- ライトな背景色とディープなテキストカラーによる高コントラスト
- ブルー系プライマリカラーを CTA とリンクに使用
- グレースケールで情報の階層を表現
- 十分な余白とスペーシングで読みやすさを確保

## 2. Color Palette & Roles

### KeyColor
- **Primary** (`#1a4fd6`)
- **Secondary** (`#3b65ce`)
- **Tertiary** (`#0d38a5`)
- **Primary surface** (`#ebf1ff`)

#### キーカラーの使い方
- ブランドのメインカラーとして CTA ボタン・リンク・強調に使用する
- セカンダリ・ターシャリは階調表現やホバー状態に活用する
- バックグラウンドはページ全体の基調色として使用する

### Grayscale
- **White** (`#ffffff`)
- **Gray 1** (`#f0f0f0`)
- **Gray 2** (`#e0e0e0`)
- **Gray 3** (`#d0d0d0`)
- **Gray 4** (`#c0c0c0`)
- **Gray 5** (`#b0b0b0`)
- **Gray 6** (`#808080`)
- **Gray 7** (`#606060`)
- **Gray 8** (`#404040`)
- **Gray 9** (`#202020`)
- **Gray 10** (`#101010`)
- **Gray 11** (`#050505`)
- **Gray 12** (`#010101`)
- **Black** (`#000000`)

#### グレースケールの使い方
- White〜Gray 3 は背景・サーフェスに適する
- Gray 4〜Gray 6 はサブテキスト・ミュートテキストに適する
- Gray 7〜Black は見出し・本文テキストに適する

### Semantic
- **Success** (`#16a34a`)
- **Error** (`#dc2626`)
- **Warning** (`#d97706`)

#### セマンティックカラーの使い方
- サクセス：完了・承認・正常状態のフィードバックに使用する
- エラー：失敗・削除・危険な操作のフィードバックに使用する
- 警告：注意・期限・確認が必要な状態のフィードバックに使用する

## 3. Typography Rules

### Font Families
- **Latin**: `Inter`
- **Japanese**: `Noto Sans JP`

### Text Styles

#### 見出し

**Black:**
- 64px | Black | 140% | 0.00em
- 48px | Black | 140% | 0.01em
- 40px | Black | 140% | 0.02em
- 32px | Black | 150% | 0.02em
- 24px | Black | 150% | 0.02em

**Bold:**
- 64px | Bold | 140% | 0.00em
- 48px | Bold | 140% | 0.01em
- 40px | Bold | 140% | 0.02em
- 32px | Bold | 150% | 0.02em
- 24px | Bold | 150% | 0.02em

**Normal:**
- 64px | Normal | 140% | 0.01em
- 48px | Normal | 140% | 0.01em
- 40px | Normal | 140% | 0.02em
- 32px | Normal | 150% | 0.02em
- 24px | Normal | 150% | 0.02em

**使い方:**
- サイトのメインタイトルやセクション見出しに使用します。大きなサイズでも窮屈さを感じさせないよう、微細な余白を持たせています。


#### 本文

**Black:**
- 24px | Black | 150% | 0.04em
- 20px | Black | 150% | 0.04em
- 16px | Black | 160% | 0.04em
- 14px | Black | 160% | 0.06em
- 12px | Black | 170% | 0.06em

**Bold:**
- 24px | Bold | 150% | 0.04em
- 20px | Bold | 150% | 0.04em
- 16px | Bold | 160% | 0.04em
- 14px | Bold | 160% | 0.06em
- 12px | Bold | 170% | 0.06em

**Normal:**
- 24px | Normal | 150% | 0.04em
- 20px | Normal | 150% | 0.04em
- 16px | Normal | 160% | 0.04em
- 14px | Normal | 160% | 0.06em
- 12px | Normal | 170% | 0.06em

**使い方:**
- 通常の本文テキスト。長文でも目が疲れにくいよう、文字間に呼吸をさせる設定にしています。


#### 本文（表示情報量を優先）

**Black / Bold / Normal:**
- 16px | 130% | 0.03em
- 16px | 120% | 0.02em
- 14px | 130% | 0.04em
- 14px | 120% | 0.04em
- 12px | 130% | 0.04em

**使い方:**
- 情報密度を優先する場面。行間（line-height）が狭いため、文字間を少し広げることで可読性を担保しています。


#### UIテキスト

**Black / Bold / Normal:**
- 16px | 120% | 0.04em
- 14px | 120% | 0.04em
- 12px | 120% | 0.04em
- 10px | 120% | 0.04em

**使い方:**
- ボタンやラベル。ベタ打ち（100%）を避け、認識しやすさを優先。特に10pxなどの最小サイズは文字間を広く取っています。


#### コードテキスト

**Black / Bold / Normal:**
- 16px | 150% | 0.02em
- 14px | 150% | 0.02em
- 12px | 150% | 0.04em
- 10px | 150% | 0.04em

**使い方:**
- 等幅フォントの特性を活かしつつ、シンボル記号などが判別しやすい適度なゆとりを持たせています。

**使い方:**
- preタグとcodeタグとのテキストに使用します

## 4. Icons

- **Library**: `lucide-react`

## 5. Layout

- Layout Type: リキッド（流動的）
- Base Unit: 8px
- Spacing Scale: 1, 2, 4, 8, 10, 12, 16, 18, 20, 24, 32, 40, 48, 56, 64, 80, 128, 160, 240, 320, 480, 640, 960, 1920
- Breakpoints: sm: 640px, md: 768px, lg: 1024px, 2xl: 1536px

### 人間工学に基づく指示

#### 1. 視覚的なバランスを整える「幾何学的・心理学的錯視」

人間は物理的に正確な中心や直線を、必ずしも「正解」とは感じません。デザイナーの仕事は、数値を疑い、「目に正しく見えるよう」に数値を裏切ることです。

**上方錯視（Vertical-Horizontal Illusion）**
- 同じ長さの垂直線と水平線がある場合、垂直線の方が長く見える現象です。
- 図形の垂直方向の中央は、実際よりも少し下にあるように感じられます。
- デザインへの応用：UIやテキストを配置する際、幾何学的な中央よりもわずかに（要素の高さに対して4〜8%ほど）上に配置すると、視覚的に中央にどっしり構えて見えます。

**面積模倣（外形による中心のズレ）**
- 「再生ボタン（▶︎）」のような三角形を円や四角形の中央に置く際、幾何学的な中心に置くと左に寄って見えます。
- デザインへの応用：重心位置を考慮し、**「視覚的な重心」**に合わせて右側に余白を多めに取ります。

#### 2. 認知負荷を軽減する「ゲシュタルトの法則」

ユーザーが画面を見た瞬間、要素をどう「グループ」として認識するかを制御します。

**近接の法則（Proximity）**
- 近いもの同士は関連があると感じます。
- 関連するラベルと入力フォームは近づけ、別のセクションとは大きな余白（ホワイトスペース）で区切ります。

**類同の法則（Similarity）**
- 色や形が同じものは同じ機能を持つと認識します。
- 「保存」と「削除」のボタンが同じ色だと誤操作を招くため、色で機能を区別します。

**閉合の法則（Closure）**
- 枠線がなくても、要素の配置によって「ひとかたまりの領域」を脳が補完します。
- 過剰な線（罫線）を減らし、スッキリした画面を作るのに役立ちます。

#### 3. 操作性を高める「運動機能の法則」

デバイスを操作する際の身体的な制約や物理的な法則です。

**フィッツの法則（Fitts's Law）**
- ターゲットに到達するまでの時間は、ターゲットまでの距離と、ターゲットの大きさに依存します。
- デザインへの応用：重要なアクション（コンバージョンボタンなど）は大きく、押しやすい位置に配置する。逆に、削除などの危険なボタンはあえて小さくしたり、離れた場所に置くことで誤操作を防ぎます。

**ヒックの法則（Hick's Law）**
- 選択肢の数が増えるほど、意思決定にかかる時間は対数的に増加します。
- デザインへの応用：メニュー項目を増やしすぎない。複雑な登録フォームは、ステップごとに分割（ステップUI）して、1画面あたりの選択肢を減らします。

#### 4. 視覚情報の優先順位「色の人間工学」

**プルキンエ現象**
- 暗い場所では青色が明るく見え、赤色が暗く沈んで見えます。
- ナイトモードのデザインでは、色のコントラストに注意が必要です。

**誘目性**
- 赤や黄色は目を引きやすく、青や緑は落ち着きを与えます。
- 警告には赤、進行には緑といった「色のメンタルモデル」を利用することで、説明がなくても伝わるデザインになります。

## 6. Components

> shadcn/ui を使用
> コンポーネントの実装仕様は https://ui.shadcn.com/ を参照すること。

### 1. デザイントークン CSS 変数マッピング

shadcn/ui は HSL 形式の CSS 変数で動作する。DESIGN.md の HEX 値を以下の通り対応させる。

```css
:root {
  /* ============================================================
     KeyColor
     ============================================================ */
  --primary:              220 79% 47%;  /* Primary         #1a4fd6 */
  --primary-foreground:     0  0% 100%; /* White           #ffffff */
  --primary-surface:      220 100% 96%; /* Primary surface #ebf1ff */
  --ring:                 220 79% 47%;  /* Focus ring      #1a4fd6 */

  /* ============================================================
     Grayscale
     ============================================================ */
  --background:             0  0% 100%; /* White           #ffffff */
  --foreground:             0  0% 25%;  /* Gray 8          #404040 */
  --card:                   0  0% 100%; /* White           #ffffff */
  --card-foreground:        0  0% 25%;  /* Gray 8          #404040 */
  --popover:                0  0% 100%; /* White           #ffffff */
  --popover-foreground:     0  0% 25%;  /* Gray 8          #404040 */
  --muted:                  0  0% 94%;  /* Gray 1          #f0f0f0 */
  --muted-foreground:       0  0% 69%;  /* Gray 5          #b0b0b0 */
  --border:                 0  0% 88%;  /* Gray 2          #e0e0e0 */
  --input:                  0  0% 88%;  /* Gray 2          #e0e0e0 */

  /* ============================================================
     shadcn UI 用（hover 時などに背景色として使用される）
     ============================================================ */
  --secondary:              0  0% 94%;  /* Gray 1          #f0f0f0 */
  --secondary-foreground:   0  0% 25%;  /* Gray 8          #404040 */
  --accent:                 0  0% 94%;  /* Gray 1          #f0f0f0 */
  --accent-foreground:      0  0% 25%;  /* Gray 8          #404040 */

  /* ============================================================
     Semantic
     ============================================================ */
  --destructive:            0 72% 51%;  /* Error           #dc2626 */
  --destructive-foreground:  0  0% 100%;/* White           #ffffff */
  --success:              142 72% 36%;  /* Success         #16a34a */
  --success-foreground:     0  0% 100%; /* White           #ffffff */
  --warning:               32 95% 44%;  /* Warning         #d97706 */
  --warning-foreground:     0  0% 100%; /* White           #ffffff */

  /* ============================================================
     Shape
     ============================================================ */
  --radius: 0.5rem;                     /* 8px */
}
```

#### Button の状態カラー対応表

DESIGN.md の Button コンポーネント仕様をトークン名で表現する。

| 状態 | プロパティ | トークン | カラーコード |
|------|-----------|---------|-------------|
| Default | bg | `--primary` / Primary | `#1a4fd6` |
| Default | text | `--primary-foreground` / White | `#ffffff` |
| Hover | bg | Secondary（KeyColor） | `#3b65ce` |
| Active | bg | Tertiary（KeyColor） | `#0d38a5` |
| Focus-visible | outline | `--ring` / Primary | `#1a4fd6` 2px / offset 2px |
| Disabled | bg | `--border` / Gray 2 | `#e0e0e0` |
| Disabled | text | `--muted-foreground` / Gray 5 | `#b0b0b0` |
| Disabled | cursor | — | `not-allowed` |

> **Note:** Hover（Secondary #3b65ce）と Active（Tertiary #0d38a5）は shadcn のデフォルト変数にないため、Tailwind のカスタムカラーか CSS で直接指定する。

---

### 2. 採用コンポーネント一覧

#### 採用

| カテゴリ | コンポーネント |
|---------|--------------|
| 入力 | Button、Input、Textarea、Select、Checkbox、RadioGroup、Label |
| フォーム | Form（react-hook-form + zod と組み合わせて使用） |
| 表示 | Card、Badge、Avatar、Separator、Skeleton |
| オーバーレイ | Dialog、AlertDialog、Sheet、Tooltip、DropdownMenu |
| 通知 | Toast（Sonner） |
| ナビゲーション | Tabs |
| 選択 | Combobox |

#### 非採用

| コンポーネント | 理由 |
|--------------|------|
| Carousel | 使用機会が限定的。独自実装で統一 |
| Menubar | Web アプリ向きでない |
| Context Menu | モバイル非対応 |
| Resizable | 使用機会なし |
| Command | Combobox で代替 |
| Accordion | 独自の折りたたみ UI で統一 |

---

### 3. 使い分けガイド

#### オーバーレイ系

| コンポーネント | 使う場面 | 使わない場面 |
|--------------|---------|------------|
| **Dialog** | 確認・フォーム入力など、ユーザーの応答が必要な場面 | 単純な情報提示（Toast で十分） |
| **AlertDialog** | 削除など破壊的操作の最終確認 | 通常のアクション確認（Dialog を使う） |
| **Sheet** | 設定パネル・フィルターなど補助的な操作領域 | 主要なアクション（Dialog を使う） |
| **Tooltip** | アイコンボタンの補足説明（hover で表示） | 重要な情報（常時表示が必要な場合は Label を使う） |

#### 通知・フィードバック系

| コンポーネント | 使う場面 | 自動消滅 |
|--------------|---------|---------|
| **Toast** | 操作結果の一時的な通知（保存完了・送信完了など） | ✅ 3〜5秒 |
| **Alert** | ページ上に残す恒久的な状態表示（エラー・警告・案内） | ❌ 手動で閉じる or 常時表示 |

#### 選択系

| コンポーネント | 選択肢の数 | 検索 | 用途 |
|--------------|----------|------|------|
| **Select** | 10個以下 | 不要 | 都道府県・カテゴリなど固定の選択肢 |
| **Combobox** | 11個以上 | 必要 | ユーザー検索・タグ選択など |

#### Button variant

DESIGN.md の Button 仕様に準拠し、以下の基準で variant を選択する。

| Variant | 使う場面 | 1画面あたりの数 |
|---------|---------|--------------|
| `default`（Primary） | ページの主要 CTA（送信・購入・次へ） | **1つまで** |
| `secondary` | 副次的なアクション（戻る・キャンセル） | 制限なし |
| `ghost` | ツールバー・テーブル内の補助操作 | 制限なし |
| `destructive` | 削除など破壊的操作 | AlertDialog と必ず併用 |
| `outline` | secondary より控えめな強調が必要な場面 | 制限なし |

---

### 4. カスタマイズポリシー

#### 許可される改変

- `globals.css` の CSS 変数（`--primary` など）の値変更
- `cva` の `variants` オブジェクトへの新 variant 追加
- デフォルト props の変更（例：`size` のデフォルト値変更）
- `components/ui/` のコンポーネントを組み合わせた社内コンポーネントの作成

#### 避けるべき改変

- Radix Primitive のアクセシビリティ属性（`aria-*`、`role` など）の削除・変更
- コンポーネントの DOM 構造の大幅な書き換え（アップデート追従が困難になる）
- `components/ui/` 配下への独自コンポーネントの混在

#### ディレクトリ構成

```
components/
├── ui/          # shadcn/ui 本体（原則変更しない）
│   ├── button.tsx
│   ├── input.tsx
│   └── ...
├── custom/      # 独自拡張コンポーネント（詳細は §6 参照）
│   ├── confirm-dialog.tsx
│   ├── empty-state.tsx
│   └── page-header.tsx
└── patterns/    # 複数コンポーネントを組み合わせた標準パターン
    ├── destructive-action.tsx
    └── form-field-set.tsx
```

#### 新 variant を追加する場合のルール

```tsx
// components/ui/button.tsx 内の cva を拡張する
const buttonVariants = cva(/* base */, {
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground ...",
      secondary: "...",
      // ✅ 新 variant はここに追加する
      subtle: "bg-[#ebf1ff] text-primary hover:bg-primary/10",
    },
  },
})
```

---

### 5. 標準パターン

#### フォームの標準構成

**react-hook-form + zod + shadcn Form** を必ず使う。bare の `<input>` や独自バリデーションは禁止。

```tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Form, FormControl, FormDescription,
  FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const schema = z.object({
  email: z.string().email("有効なメールアドレスを入力してください"),
})

export function SampleForm() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  })

  function onSubmit(values: z.infer<typeof schema>) {
    // 送信処理
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>メールアドレス</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
              </FormControl>
              <FormDescription>登録済みのアドレスを入力してください</FormDescription>
              <FormMessage /> {/* エラーはここに自動表示 */}
            </FormItem>
          )}
        />
        <Button type="submit">送信</Button>
      </form>
    </Form>
  )
}
```

#### 破壊的操作の標準フロー

削除など破壊的操作は **必ず AlertDialog でラップする**。直接 `onClick` で処理を実行しない。

```tsx
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

export function DeleteAction({ onDelete }: { onDelete: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {/* Destructive variant はトリガーにのみ使用。Action ボタンは別途スタイリング */}
        <Button variant="destructive" size="sm">削除</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>
        <AlertDialogDescription>
          この操作は取り消せません。削除したデータは復元できません。
        </AlertDialogDescription>
        <AlertDialogFooter>
          {/* Cancel を必ず左に配置（ヒックの法則・誤操作防止） */}
          <AlertDialogCancel>キャンセル</AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            削除する
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

---

### 6. 独自コンポーネント仕様

shadcn/ui にない、プロジェクト共通で使う UI を `components/custom/` に配置する。

#### ConfirmDialog

AlertDialog のラッパー。毎回ボイラープレートを書かないためのユーティリティ。

**Props**

| Prop | 型 | 必須 | 説明 |
|------|----|------|------|
| `title` | `string` | ✅ | ダイアログのタイトル |
| `description` | `string` | ✅ | 操作の説明文 |
| `onConfirm` | `() => void` | ✅ | 確認ボタンのハンドラ |
| `confirmLabel` | `string` | — | 確認ボタンのラベル（デフォルト：「確認」） |
| `variant` | `"default" \| "destructive"` | — | 確認ボタンの variant（デフォルト：`"default"`） |
| `children` | `ReactNode` | ✅ | トリガー要素 |

#### EmptyState

一覧が空の時に表示するフォールバック UI。

**Props**

| Prop | 型 | 必須 | 説明 |
|------|----|------|------|
| `icon` | `ReactNode` | — | 上部に表示するアイコン |
| `title` | `string` | ✅ | メインメッセージ |
| `description` | `string` | — | サブメッセージ |
| `action` | `ReactNode` | — | CTA ボタン（Button コンポーネントを渡す） |

**使用例**
```tsx
<EmptyState
  icon={<InboxIcon />}
  title="データがありません"
  description="新しいアイテムを追加してください"
  action={<Button>追加する</Button>}
/>
```

#### PageHeader

ページ上部の共通レイアウト。タイトル・パンくず・アクションエリアを統一する。

**Props**

| Prop | 型 | 必須 | 説明 |
|------|----|------|------|
| `title` | `string` | ✅ | ページタイトル |
| `breadcrumbs` | `{ label: string; href?: string }[]` | — | パンくずリスト |
| `actions` | `ReactNode` | — | 右端のアクションボタン群 |

**使用例**
```tsx
<PageHeader
  title="ユーザー管理"
  breadcrumbs={[{ label: "管理", href: "/admin" }, { label: "ユーザー" }]}
  actions={<Button>新規追加</Button>}
/>
```

#### DataTable

TanStack Table + shadcn Table のラッパー。ソート・ページネーション・行選択を内包。

**Props**

| Prop | 型 | 必須 | 説明 |
|------|----|------|------|
| `columns` | `ColumnDef<T>[]` | ✅ | カラム定義（TanStack Table 準拠） |
| `data` | `T[]` | ✅ | 表示するデータ |
| `pagination` | `boolean` | — | ページネーションの表示（デフォルト：`true`） |
| `selectable` | `boolean` | — | 行選択チェックボックスの表示 |
| `onRowClick` | `(row: T) => void` | — | 行クリックのハンドラ |

## 7. Accessibility

### WCAG AA 準拠

| 対象 | 最低コントラスト比 |
|------|------------------|
| 通常テキスト (18pt未満 / 太字14pt未満) | 4.5:1 |
| 大テキスト (18pt以上 / 太字14pt以上) | 3.0:1 |
| UI コンポーネント・グラフィック | 3.0:1 |
