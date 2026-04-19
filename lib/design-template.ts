import { LATIN_FONTS, JAPANESE_FONTS, SPACING_BASE_OPTIONS } from '@/lib/constants'

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
  toggle?: boolean
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
    label: 'ビジュアルテーマ',
    icon: 'Sparkles',
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
    label: 'カラーパレット',
    icon: 'Palette',
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
    id: 'agentGuide',
    label: 'エージェント向けガイド',
    icon: 'Bot',
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
    id: 'typography',
    label: 'タイポグラフィ',
    icon: 'Type',
    description: 'フォントファミリー（欧文・和文）',
    enabled: true,
    fields: [
      {
        type: 'select',
        id: 'latinFont',
        label: '欧文フォント',
        requirement: 'optional',
        options: LATIN_FONTS,
        default: '',
        allowCustom: true,
        customPlaceholder: '例: Haas',
      } as SelectField,
      {
        type: 'select',
        id: 'japaneseFont',
        label: '和文フォント',
        requirement: 'optional',
        options: JAPANESE_FONTS,
        default: '',
        allowCustom: true,
        customPlaceholder: '例: Hiragino Kaku Gothic Pro',
      } as SelectField,
    ],
  },
  {
    id: 'layout',
    label: 'レイアウト',
    icon: 'LayoutGrid',
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
        options: SPACING_BASE_OPTIONS,
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
    ],
  },
  {
    id: 'components',
    label: 'コンポーネント',
    icon: 'Puzzle',
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
    id: 'depth',
    label: '奥行き・シャドウ',
    icon: 'Layers',
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
    label: 'すべきこと・避けること',
    icon: 'ListChecks',
    description: 'デザイン上で推奨されること・避けるべきこと',
    enabled: true,
    fields: [
      {
        type: 'textarea',
        id: 'dos',
        label: 'すべきこと（1行1項目）',
        requirement: 'optional',
        placeholder:
          '例:\nAirtable Blue を CTA に使う\nHaas をポジティブトラッキングで使用\n12px ラジウスのボタン',
        default: '',
        rows: 6,
      } as TextareaField,
      {
        type: 'textarea',
        id: 'donts',
        label: '避けること（1行1項目）',
        requirement: 'optional',
        placeholder: '例:\nポジティブレタースペーシングをスキップする\n重いシャドウを使う',
        default: '',
        rows: 6,
      } as TextareaField,
    ],
  },
  {
    id: 'responsive',
    label: 'レスポンシブ対応',
    icon: 'MonitorSmartphone',
    description: 'ブレークポイント戦略',
    enabled: true,
    fields: [
      {
        type: 'number',
        id: 'bpSm',
        label: 'sm',
        requirement: 'optional',
        default: 640,
        min: 1,
        toggle: true,
      } as NumberField,
      {
        type: 'number',
        id: 'bpMd',
        label: 'md',
        requirement: 'optional',
        default: 768,
        min: 1,
        toggle: true,
      } as NumberField,
      {
        type: 'number',
        id: 'bpLg',
        label: 'lg',
        requirement: 'optional',
        default: 1024,
        min: 1,
        toggle: true,
      } as NumberField,
      {
        type: 'number',
        id: 'bpXl',
        label: 'xl',
        requirement: 'optional',
        default: 1280,
        min: 1,
        toggle: true,
      } as NumberField,
      {
        type: 'number',
        id: 'bp2xl',
        label: '2xl',
        requirement: 'optional',
        default: 1536,
        min: 1,
        toggle: true,
      } as NumberField,
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
    id: 'misc',
    label: 'その他',
    icon: 'FileText',
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
