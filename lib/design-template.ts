export type FieldType = 'select' | 'text' | 'multiselect' | 'checkbox' | 'number' | 'textarea' | 'color'
export type Requirement = 'required' | 'optional'

export interface SelectField {
  type: 'select'
  id: string
  label: string
  requirement: Requirement
  options: string[]
  default: string
  allowCustom?: boolean
  customPlaceholder?: string
  dependsOn?: { fieldId: string; values: (string | boolean)[] }
  optionsIf?: { sectionId?: string; fieldId: string; map: Record<string, string[]> }
}

export interface TextField {
  type: 'text'
  id: string
  label: string
  requirement: Requirement
  placeholder: string
  default: string
  dependsOn?: { fieldId: string; values: (string | boolean)[] }
}

export interface NumberField {
  type: 'number'
  id: string
  label: string
  requirement: Requirement
  default: number
  min?: number
  max?: number
  step?: number
  dependsOn?: { fieldId: string; values: (string | boolean)[] }
}

export interface MultiSelectField {
  type: 'multiselect'
  id: string
  label: string
  requirement: Requirement
  options: string[]
  default: string[]
  dependsOn?: { fieldId: string; values: (string | boolean)[] }
  optionsIf?: { sectionId?: string; fieldId: string; map: Record<string, string[]> }
}

export interface CheckboxField {
  type: 'checkbox'
  id: string
  label: string
  requirement: Requirement
  default: boolean
  dependsOn?: { fieldId: string; values: (string | boolean)[] }
}

export interface TextareaField {
  type: 'textarea'
  id: string
  label: string
  requirement: Requirement
  placeholder: string
  default: string
  rows?: number
  dependsOn?: { fieldId: string; values: (string | boolean)[] }
}

export interface ColorField {
  type: 'color'
  id: string
  label: string
  requirement: Requirement
  default: string
  dependsOn?: { fieldId: string; values: (string | boolean)[] }
}

export type DesignField = SelectField | TextField | NumberField | MultiSelectField | CheckboxField | TextareaField | ColorField

export interface DesignSection {
  id: string
  label: string
  icon: string
  description: string
  enabled: boolean
  fields: DesignField[]
}

export type FieldValue = string | number | boolean | string[]

export interface DesignConfig {
  [sectionId: string]: {
    enabled: boolean
    [fieldId: string]: FieldValue
  }
}

export const designTemplate: DesignSection[] = [
  {
    id: 'visualTheme',
    label: '🎭 ビジュアルテーマ',
    icon: '🎭',
    description: 'ブランドの世界観・インスピレーション元・全体の雰囲気',
    enabled: true,
    fields: [
      {
        type: 'text',
        id: 'themeName',
        label: 'テーマ名 / インスピレーション元',
        requirement: 'required',
        placeholder: '例: Airtable / Apple / ブランド名',
        default: '',
      } as TextField,
      {
        type: 'textarea',
        id: 'atmosphere',
        label: 'ビジュアル雰囲気の説明',
        requirement: 'required',
        placeholder:
          '例: 白を基調としたキャンバスに深いネイビーのテキスト（#181d26）、Airtable Blue（#1b61c9）をアクセントとする、洗練されたシンプルさ。',
        default: '',
        rows: 5,
      } as TextareaField,
      {
        type: 'textarea',
        id: 'keyCharacteristics',
        label: '主要な特徴（1行1項目）',
        requirement: 'optional',
        placeholder:
          '例:\n白いキャンバスとディープネイビーのテキスト (#181d26)\nAirtable Blue (#1b61c9) を CTA とリンクに使用\nHaas + Haas Groot Disp のデュアルフォント\n12px のボタンラジウス、16px-32px のカード\nブルー調の多層シャドウ',
        default: '',
        rows: 6,
      } as TextareaField,
    ],
  },
  {
    id: 'colorPalette',
    label: '🎨 カラーパレット',
    icon: '🎨',
    description: 'プライマリ・セマンティック・ニュートラル（ライト／ダーク）を各1色定義',
    enabled: true,
    fields: [
      {
        type: 'color',
        id: 'primaryCtaColor',
        label: 'プライマリカラー（ボタン・リンク）',
        requirement: 'required',
        default: '',
      } as ColorField,
      {
        type: 'color',
        id: 'semanticColor',
        label: 'セマンティックカラー（成功・強調）',
        requirement: 'required',
        default: '',
      } as ColorField,
      {
        type: 'color',
        id: 'primarySurfaceColor',
        label: 'ライト（背景・白系）',
        requirement: 'required',
        default: '',
      } as ColorField,
      {
        type: 'color',
        id: 'primaryTextColor',
        label: 'ダーク（テキスト・黒系）',
        requirement: 'required',
        default: '',
      } as ColorField,
      {
        type: 'color',
        id: 'spotlightColor',
        label: 'スポットライト / アクセント背景',
        requirement: 'optional',
        default: '',
      } as ColorField,
      {
        type: 'color',
        id: 'successColor',
        label: '成功色',
        requirement: 'optional',
        default: '',
      } as ColorField,
      {
        type: 'color',
        id: 'errorColor',
        label: 'エラー色',
        requirement: 'optional',
        default: '',
      } as ColorField,
      {
        type: 'color',
        id: 'warningColor',
        label: '警告色',
        requirement: 'optional',
        default: '',
      } as ColorField,
      {
        type: 'color',
        id: 'weakTextColor',
        label: '弱調テキスト',
        requirement: 'optional',
        default: '',
      } as ColorField,
      {
        type: 'color',
        id: 'secondaryTextColor',
        label: 'サブテキスト',
        requirement: 'optional',
        default: '',
      } as ColorField,
      {
        type: 'color',
        id: 'borderColor',
        label: 'ボーダー色',
        requirement: 'optional',
        default: '',
      } as ColorField,
      {
        type: 'color',
        id: 'subtleSurfaceColor',
        label: '微調背景色',
        requirement: 'optional',
        default: '',
      } as ColorField,
      {
        type: 'textarea',
        id: 'shadowElevated',
        label: 'シャドウ（多層可）',
        requirement: 'optional',
        placeholder:
          '例: rgba(0,0,0,0.32) 0px 0px 1px, rgba(0,0,0,0.08) 0px 0px 2px, rgba(45,127,249,0.28) 0px 1px 3px',
        default: '',
        rows: 2,
      } as TextareaField,
      {
        type: 'text',
        id: 'shadowSoft',
        label: 'ソフトシャドウ',
        requirement: 'optional',
        placeholder: '例: rgba(15,48,106,0.05) 0px 0px 20px',
        default: '',
      } as TextField,
    ],
  },
  {
    id: 'typography',
    label: '✍️ タイポグラフィ',
    icon: '✍️',
    description: 'フォントファミリーと階層（サイズ / ウェイト / 行間 / 字間）',
    enabled: true,
    fields: [
      {
        type: 'select',
        id: 'primaryFont',
        label: 'メインフォント（フォールバック込み）',
        requirement: 'required',
        options: [
          'Inter, system-ui, sans-serif',
          'Noto Sans JP, sans-serif',
          'Roboto, sans-serif',
          'SF Pro Text, -apple-system, sans-serif',
          'system-ui, -apple-system, sans-serif',
        ],
        default: '',
        allowCustom: true,
        customPlaceholder: '例: Haas, -apple-system, system-ui, Segoe UI, Roboto',
      } as SelectField,
      {
        type: 'select',
        id: 'displayFont',
        label: '見出しフォント',
        requirement: 'optional',
        options: [
          'メインフォントと同じ',
          'Playfair Display, serif',
          'Noto Serif JP, serif',
          'Georgia, serif',
        ],
        default: '',
        allowCustom: true,
        customPlaceholder: '例: Haas Groot Disp, Haas',
      } as SelectField,
      {
        type: 'select',
        id: 'letterSpacingStrategy',
        label: '文字間隔の方針',
        requirement: 'required',
        options: [
          'ポジティブトラッキング（広め）',
          'ネガティブトラッキング（狭め）',
          'ニュートラル（normal）',
        ],
        default: 'ニュートラル（normal）',
      } as SelectField,
      {
        type: 'select',
        id: 'letterSpacingRange',
        label: '文字間隔の範囲',
        requirement: 'optional',
        options: [
          '-0.374px – 0.08px',
          '-0.03em – 0em',
          '-0.01em – 0.05em',
          '0em – 0.1em',
        ],
        default: '',
        allowCustom: true,
        customPlaceholder: '例: 0.08px–0.28px / -0.374px–-0.08px',
      } as SelectField,
      {
        type: 'select',
        id: 'displayHero',
        label: '特大見出し（サイズ / ウェイト / 行間 / 字間）',
        requirement: 'optional',
        options: [
          '56px / 700 / 1.07 / -0.03em',
          '48px / 700 / 1.1 / -0.02em',
          '40px / 600 / 1.15 / normal',
        ],
        default: '',
        allowCustom: true,
        customPlaceholder: '例: 48px / 400 / 1.15 / normal',
      } as SelectField,
      {
        type: 'select',
        id: 'displayBold',
        label: '大見出し（太字）',
        requirement: 'optional',
        options: [
          '48px / 900 / 1.1 / normal',
          '40px / 800 / 1.15 / normal',
          '36px / 700 / 1.2 / normal',
        ],
        default: '',
        allowCustom: true,
        customPlaceholder: '例: 48px / 900 / 1.50 / normal',
      } as SelectField,
      {
        type: 'select',
        id: 'sectionHeading',
        label: 'セクション見出し',
        requirement: 'optional',
        options: [
          '40px / 600 / 1.2 / normal',
          '32px / 600 / 1.25 / normal',
          '28px / 600 / 1.3 / normal',
        ],
        default: '',
        allowCustom: true,
        customPlaceholder: '例: 40px / 400 / 1.25 / normal',
      } as SelectField,
      {
        type: 'select',
        id: 'subHeading',
        label: '小見出し',
        requirement: 'optional',
        options: [
          '28px / 500 / 1.3 / normal',
          '24px / 500 / 1.35 / normal',
          '22px / 500 / 1.4 / normal',
        ],
        default: '',
        allowCustom: true,
        customPlaceholder: '例: 32px / 400-500 / 1.15-1.25 / normal',
      } as SelectField,
      {
        type: 'select',
        id: 'cardTitle',
        label: 'カードタイトル',
        requirement: 'optional',
        options: [
          '24px / 600 / 1.3 / 0.01em',
          '20px / 600 / 1.35 / 0.01em',
          '18px / 600 / 1.4 / 0.01em',
        ],
        default: '',
        allowCustom: true,
        customPlaceholder: '例: 24px / 400 / 1.20-1.30 / 0.12px',
      } as SelectField,
      {
        type: 'select',
        id: 'featureText',
        label: '特徴テキスト',
        requirement: 'optional',
        options: [
          '20px / 400 / 1.4 / normal',
          '18px / 400 / 1.45 / normal',
          '16px / 500 / 1.5 / normal',
        ],
        default: '',
        allowCustom: true,
        customPlaceholder: '例: 20px / 400 / 1.25-1.50 / 0.1px',
      } as SelectField,
      {
        type: 'select',
        id: 'bodyText',
        label: '本文',
        requirement: 'optional',
        options: [
          '17px / 400 / 1.5 / -0.374px',
          '16px / 400 / 1.6 / normal',
          '15px / 400 / 1.6 / normal',
        ],
        default: '',
        allowCustom: true,
        customPlaceholder: '例: 18px / 400 / 1.35 / 0.18px',
      } as SelectField,
      {
        type: 'select',
        id: 'bodyMedium',
        label: '本文（中）',
        requirement: 'optional',
        options: [
          '16px / 500 / 1.5 / normal',
          '15px / 500 / 1.5 / normal',
          '14px / 500 / 1.5 / normal',
        ],
        default: '',
        allowCustom: true,
        customPlaceholder: '例: 16px / 500 / 1.30 / 0.08-0.16px',
      } as SelectField,
      {
        type: 'select',
        id: 'buttonText',
        label: 'ボタンテキスト',
        requirement: 'optional',
        options: [
          '16px / 500 / 1.25 / normal',
          '15px / 500 / 1.3 / normal',
          '14px / 500 / 1.3 / normal',
        ],
        default: '',
        allowCustom: true,
        customPlaceholder: '例: 16px / 500 / 1.25-1.30 / 0.08px',
      } as SelectField,
      {
        type: 'select',
        id: 'captionText',
        label: 'キャプション',
        requirement: 'optional',
        options: [
          '14px / 400 / 1.4 / -0.01em',
          '13px / 400 / 1.4 / -0.01em',
          '12px / 400 / 1.5 / normal',
        ],
        default: '',
        allowCustom: true,
        customPlaceholder: '例: 14px / 400-500 / 1.25-1.35 / 0.07-0.28px',
      } as SelectField,
    ],
  },
  {
    id: 'components',
    label: '🧩 コンポーネント',
    icon: '🧩',
    description: 'ボタン、カード、インプットなどのデフォルトスタイル',
    enabled: true,
    fields: [
      {
        type: 'color',
        id: 'primaryBtnBg',
        label: 'メインボタン 背景色',
        requirement: 'optional',
        default: '',
      } as ColorField,
      {
        type: 'color',
        id: 'primaryBtnText',
        label: 'メインボタン テキスト色',
        requirement: 'optional',
        default: '',
      } as ColorField,
      {
        type: 'select',
        id: 'primaryBtnPadding',
        label: 'メインボタン 余白',
        requirement: 'optional',
        options: ['8px 16px', '8px 20px', '10px 20px', '12px 24px', '16px 32px'],
        default: '',
        allowCustom: true,
        customPlaceholder: '例: 16px 24px',
      } as SelectField,
      {
        type: 'select',
        id: 'primaryBtnRadius',
        label: 'メインボタン 角丸',
        requirement: 'optional',
        options: ['4px', '6px', '8px', '12px', '16px', '50%'],
        default: '',
        allowCustom: true,
        customPlaceholder: '例: 12px',
      } as SelectField,
      {
        type: 'textarea',
        id: 'secondaryBtnStyle',
        label: 'サブボタン の定義',
        requirement: 'optional',
        placeholder: '例: white bg, #181d26 text, 12px radius, 1px border',
        default: '',
        rows: 2,
      } as TextareaField,
      {
        type: 'textarea',
        id: 'otherButtons',
        label: 'その他のボタン（1行1項目）',
        requirement: 'optional',
        placeholder:
          '例:\nCookie Consent: #1b61c9 bg, 2px radius (sharp)\nPill Link: transparent bg, 980px radius',
        default: '',
        rows: 3,
      } as TextareaField,
      {
        type: 'select',
        id: 'cardBorder',
        label: 'カード ボーダー',
        requirement: 'optional',
        options: ['なし (none)', '1px solid', '1.5px solid', '2px solid'],
        default: '',
        allowCustom: true,
        customPlaceholder: '例: 1px solid #e0e2e6',
      } as SelectField,
      {
        type: 'select',
        id: 'cardRadius',
        label: 'カード 角丸',
        requirement: 'optional',
        options: ['4px', '8px', '12px', '16px', '20px', '24px'],
        default: '',
        allowCustom: true,
        customPlaceholder: '例: 16px-24px',
      } as SelectField,
      {
        type: 'text',
        id: 'inputStyle',
        label: '入力欄 スタイル',
        requirement: 'optional',
        placeholder: '例: 標準 Haas スタイリング / 11px radius, 3px border',
        default: '',
      } as TextField,
    ],
  },
  {
    id: 'layout',
    label: '📐 レイアウト',
    icon: '📐',
    description: 'スペーシングとラジウスのスケール',
    enabled: true,
    fields: [
      {
        type: 'select',
        id: 'spacingRange',
        label: 'スペーシング範囲',
        requirement: 'required',
        options: ['1–8px', '2–16px', '4–32px', '4–48px', '8–64px'],
        default: '',
        allowCustom: true,
        customPlaceholder: '例: 1–48px',
      } as SelectField,
      {
        type: 'select',
        id: 'spacingBase',
        label: 'スペーシング基準単位',
        requirement: 'required',
        options: ['4px', '6px', '8px', '16px'],
        default: '8px',
      } as SelectField,
      {
        type: 'select',
        id: 'radiusSmall',
        label: '角丸（小）',
        requirement: 'optional',
        options: ['0px', '2px', '3px', '4px'],
        default: '',
        allowCustom: true,
        customPlaceholder: '例: 2px',
      } as SelectField,
      {
        type: 'select',
        id: 'radiusButton',
        label: '角丸（ボタン）',
        requirement: 'optional',
        options: ['4px', '6px', '8px', '12px', '16px'],
        default: '',
        allowCustom: true,
        customPlaceholder: '例: 12px',
      } as SelectField,
      {
        type: 'select',
        id: 'radiusCard',
        label: '角丸（カード）',
        requirement: 'optional',
        options: ['8px', '12px', '16px', '20px', '24px'],
        default: '',
        allowCustom: true,
        customPlaceholder: '例: 16px',
      } as SelectField,
      {
        type: 'select',
        id: 'radiusSection',
        label: '角丸（セクション）',
        requirement: 'optional',
        options: ['16px', '20px', '24px', '32px'],
        default: '',
        allowCustom: true,
        customPlaceholder: '例: 24px',
      } as SelectField,
      {
        type: 'select',
        id: 'radiusLarge',
        label: '角丸（大・ピル）',
        requirement: 'optional',
        options: ['32px', '48px', '64px', '980px'],
        default: '',
        allowCustom: true,
        customPlaceholder: '例: 32px / 980px',
      } as SelectField,
      {
        type: 'checkbox',
        id: 'useCircleRadius',
        label: '円形要素（50%）を使用する',
        requirement: 'optional',
        default: true,
      } as CheckboxField,
    ],
  },
  {
    id: 'depth',
    label: '🌫️ 奥行き・シャドウ',
    icon: '🌫️',
    description: 'シャドウシステムの方針',
    enabled: true,
    fields: [
      {
        type: 'textarea',
        id: 'shadowPhilosophy',
        label: 'シャドウ哲学の説明',
        requirement: 'optional',
        placeholder:
          '例: ブルー調の多層シャドウでサブルな奥行きを表現。影はブランドの重要な識別要素。',
        default: '',
        rows: 3,
      } as TextareaField,
      {
        type: 'text',
        id: 'ambientShadow',
        label: '補助シャドウ',
        requirement: 'optional',
        placeholder: '例: rgba(15,48,106,0.05) 0px 0px 20px',
        default: '',
      } as TextField,
    ],
  },
  {
    id: 'guidelines',
    label: '✅ すべきこと・避けること',
    icon: '✅',
    description: 'デザイン上で推奨されること・避けるべきこと',
    enabled: true,
    fields: [
      {
        type: 'textarea',
        id: 'dos',
        label: 'Do（推奨・1行1項目）',
        requirement: 'optional',
        placeholder:
          '例:\nAirtable Blue を CTA に使う\nHaas をポジティブトラッキングで使用\n12px ラジウスのボタン',
        default: '',
        rows: 6,
      } as TextareaField,
      {
        type: 'textarea',
        id: 'donts',
        label: 'やってはいけないこと（1行1項目）',
        requirement: 'optional',
        placeholder: '例:\nポジティブレタースペーシングをスキップする\n重いシャドウを使う',
        default: '',
        rows: 6,
      } as TextareaField,
    ],
  },
  {
    id: 'responsive',
    label: '📱 レスポンシブ対応',
    icon: '📱',
    description: 'ブレークポイント戦略',
    enabled: true,
    fields: [
      {
        type: 'multiselect',
        id: 'breakpoints',
        label: 'ブレークポイント',
        requirement: 'required',
        options: ['sm (640px)', 'md (768px)', 'lg (1024px)', 'xl (1280px)', '2xl (1536px)'],
        default: [],
      } as MultiSelectField,
      {
        type: 'text',
        id: 'customBreakpoints',
        label: 'カスタムブレークポイント（カンマ区切り）',
        requirement: 'optional',
        placeholder: '例: 480px, 1440px',
        default: '',
      } as TextField,
      {
        type: 'textarea',
        id: 'responsiveNotes',
        label: 'レスポンシブ挙動の補足',
        requirement: 'optional',
        placeholder:
          '例: 主要ブレークポイントは 640 / 768 / 1024 / 1280。タブレットでは 2-column グリッドへ遷移。',
        default: '',
        rows: 3,
      } as TextareaField,
    ],
  },
  {
    id: 'agentGuide',
    label: '🤖 エージェント向けガイド',
    icon: '🤖',
    description: 'AI/エージェント向けの簡易カラーリファレンス',
    enabled: true,
    fields: [
      {
        type: 'color',
        id: 'agentTextColor',
        label: 'テキスト色',
        requirement: 'optional',
        default: '',
      } as ColorField,
      {
        type: 'color',
        id: 'agentCtaColor',
        label: 'CTAカラー',
        requirement: 'optional',
        default: '',
      } as ColorField,
      {
        type: 'color',
        id: 'agentBgColor',
        label: '背景色',
        requirement: 'optional',
        default: '',
      } as ColorField,
      {
        type: 'color',
        id: 'agentBorderColor',
        label: 'ボーダー色',
        requirement: 'optional',
        default: '',
      } as ColorField,
      {
        type: 'textarea',
        id: 'agentExamples',
        label: 'プロンプト例・追加指針',
        requirement: 'optional',
        placeholder:
          '例: CTA ボタンを作る際は #1b61c9 / 白テキスト / 12px ラジウス / 16px 24px パディングで生成する。',
        default: '',
        rows: 4,
      } as TextareaField,
    ],
  },
  {
    id: 'misc',
    label: '📝 その他',
    icon: '📝',
    description: 'プロジェクト固有の追加ルールやメモ',
    enabled: false,
    fields: [
      {
        type: 'textarea',
        id: 'miscContent',
        label: '自由記述（Markdown 可）',
        requirement: 'optional',
        placeholder: '例:\n### 命名規約\n- コンポーネントは PascalCase',
        default: '',
        rows: 12,
      } as TextareaField,
    ],
  },
]
