# Design System: Airtable Inspired (Japanese Optimized)

## 1. ビジュアルテーマ & 雰囲気
Airtableの「洗練されたシンプルさ」を継承。クリーンな白いキャンバスに、深いネイビー（`#181d26`）のテキストと、アクセントとしてのAirtable Blue（`#1b61c9`）が知的な印象を与えます。日本語環境では、システムの標準フォントを活かしつつ、スイス・スタイルの精密なタイポグラフィを再現します。

**主な特徴:**
- ホワイトキャンバスとディープネイビー（`#181d26`）のコントラスト
- プライマリCTAとリンクにはAirtable Blue（`#1b61c9`）を使用
- 日本語フォントはモダンなサンセリフ（Gothic）を採用し、可読性を確保
- カードやボタンの角丸は、親しみやすさと信頼感を両立する12px〜32px
- ブルーを微かに含んだ多層シャドウによる奥行き感

## 2. カラーパレット & ロール

### Primary (メイン)
- **Deep Navy** (`#181d26`): 本文・ヘッドライン（視認性の高い紺黒）
- **Airtable Blue** (`#1b61c9`): 主要ボタン (CTA)、リンク、アクティブ状態
- **White** (`#ffffff`): 背景、ベースサーフェス
- **Spotlight** (`rgba(249,252,255,0.97)`): ホバー時の強調や特殊な背景

### Semantic (意味的定義)
- **Success Green** (`#006400`): 成功、完了、ポジティブな通知
- **Weak Text** (`rgba(4,14,32,0.69)`): 補足説明、キャプション（日本語での読みやすさを考慮した不透明度）
- **Secondary Active** (`rgba(7,12,20,0.82)`): 二次的な操作要素のアクティブ状態

### Neutral (ニュートラル)
- **Dark Gray** (`#333333`): サブテキスト
- **Border** (`#e0e2e6`): カード、入力フォームの境界線
- **Light Surface** (`#f8fafc`): コンテンツの背景（セクションの区切り）

### Shadows (影)
- **Blue-tinted**: `rgba(0,0,0,0.32) 0px 0px 1px, rgba(0,0,0,0.08) 0px 0px 2px, rgba(45,127,249,0.28) 0px 1px 3px`
- **Soft Ambient**: `rgba(15,48,106,0.05) 0px 0px 20px`

## 3. タイポグラフィ ルール (日本語最適化)

日本語の読みやすさを考慮し、英字版より行間（Line Height）を広めに設定しています。

### フォントファミリー
- `sans-serif`, `"Hiragino Sans"`, `"Hiragino Kaku Gothic ProN"`, `"ヒラギノ角ゴ ProN W3"`, `"Meiryo"`, `"noto sans jp"`, `system-ui`

### ヒエラルキー

| ロール | サイズ | 太さ (Weight) | 行間 | 字送り (Tracking) |
| :--- | :--- | :--- | :--- | :--- |
| **Display Hero** | 48px | 700 (Bold) | 1.3 | 0.02em |
| **Section Heading** | 32px | 700 | 1.4 | 0.02em |
| **Sub-heading** | 24px | 600 | 1.5 | 0.01em |
| **Card Title** | 20px | 600 | 1.5 | 0.01em |
| **Body (標準)** | 16px | 400 | 1.7 | 0.04em |
| **Body Small** | 14px | 400 | 1.6 | 0.04em |
| **Button Text** | 16px | 600 | 1.0 | 0.05em |
| **Caption** | 12px | 400 | 1.5 | 0.05em |

## 4. コンポーネント スタイル

### ボタン (Buttons)
- **Primary Blue**: 背景 `#1b61c9` / 文字 ホワイト
    - Padding: `12px 24px` / Radius: `12px`
- **Secondary White**: 背景 ホワイト / 文字 `#181d26` / 境界線 `#e0e2e6`
    - Padding: `12px 24px` / Radius: `12px`

### カード (Cards)
- Border: `1px solid #e0e2e6`
- Radius: `16px` 〜 `24px`
- Shadow: `Blue-tinted` を適用して浮遊感を演出

### 入力フォーム (Inputs)
- Border: `1px solid #e0e2e6`
- Focus: `2px solid #1b61c9`
- Radius: `8px`

## 5. レイアウト & スペーシング
- **ベースグリッド**: 8px (全ての余白を8の倍数で構築)
- **Radius (角丸)**:
    - Small: 4px (チップ、ラベル)
    - Medium: 12px (ボタン、入力フォーム)
    - Large: 24px (カード、モーダル)
    - Section: 32px (大きなセクションの区切り)

## 6. Do's and Don'ts
- **Do**:
    - CTAには必ず Airtable Blue を使用する。
    - 日本語の文章には十分な行間（1.7前後）を確保する。
    - 重要な要素には12pxの角丸を適用し、モダンな印象を与える。
- **Don't**:
    - 日本語の文字間を詰めすぎない（ベタ打ちは避ける）。
    - 真っ黒（`#000000`）を使用せず、Deep Navy（`#181d26`）を使用する。
    - 重すぎるドロップシャドウ（不透明度の高い黒）を使わない。

## 7. 実装ガイド (Agent Prompt)
- テキスト色: `#181d26`
- アクセント色: `#1b61c9`
- 背景色: `#ffffff`
- 境界線: `#e0e2e6`
- フォント: 日本語標準ゴシック体、行間広め