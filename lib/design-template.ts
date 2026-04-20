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
    description: 'プライマリ・セカンダリ・ターシャリ・セマンティック・ニュートラル',
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
        id: 'secondaryCtaColor',
        label: 'セカンダリカラー',
        requirement: 'optional',
        default: '',
      } as ColorField,
      {
        type: 'color',
        id: 'tertiaryCtaColor',
        label: 'ターシャリカラー',
        requirement: 'optional',
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
        type: 'textarea',
        id: 'keyColorNotes',
        label: 'キーカラー 使用指針',
        requirement: 'optional',
        placeholder: '',
        default: '',
        rows: 3,
      } as TextareaField,
      {
        type: 'textarea',
        id: 'commonColorNotes',
        label: '共通カラー 使用指針',
        requirement: 'optional',
        placeholder: '',
        default: '',
        rows: 3,
      } as TextareaField,
      {
        type: 'textarea',
        id: 'semanticColorNotes',
        label: 'セマンティックカラー 使用指針',
        requirement: 'optional',
        placeholder: '',
        default: '',
        rows: 3,
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
      {
        type: 'textarea',
        id: 'dspNotes',
        label: 'Dsp テキストスタイルの使い方',
        requirement: 'optional',
        placeholder: '',
        default: 'サイトのメインタイトルやセクション見出しに使用します',
        rows: 3,
      } as TextareaField,
      {
        type: 'textarea',
        id: 'dspSelectedStyles',
        label: 'Dsp 選択されたスタイル',
        requirement: 'optional',
        placeholder: '',
        default: '64B-140,56B-140,48B-140,64N-140,56N-140,48N-140',
        rows: 1,
      } as TextareaField,
      {
        type: 'textarea',
        id: 'stdNotes',
        label: 'Std テキストスタイルの使い方',
        requirement: 'optional',
        placeholder: '',
        default: '通常の本文テキストや説明文に使用します',
        rows: 3,
      } as TextareaField,
      {
        type: 'textarea',
        id: 'stdSelectedStyles',
        label: 'Std 選択されたスタイル',
        requirement: 'optional',
        placeholder: '',
        default: '40B-140,36B-140,32B-150,28B-150,26B-150,24B-150,22B-150,20B-150,18B-160,16B-170,16B-175,40N-140,36N-140,32N-150,28N-150,26N-150,24N-150,22N-150,20N-150,18N-160,16N-170,16N-175',
        rows: 1,
      } as TextareaField,
      {
        type: 'textarea',
        id: 'dnsNotes',
        label: 'Dns テキストスタイルの使い方',
        requirement: 'optional',
        placeholder: '',
        default: '情報密度を優先する場面で、限られたスペースに多くの情報を表示します',
        rows: 3,
      } as TextareaField,
      {
        type: 'textarea',
        id: 'dnsSelectedStyles',
        label: 'Dns 選択されたスタイル',
        requirement: 'optional',
        placeholder: '',
        default: '16B-130,16B-120,14B-130,14B-120,16N-130,16N-120,14N-130,14N-120',
        rows: 1,
      } as TextareaField,
      {
        type: 'textarea',
        id: 'olnNotes',
        label: 'Oln テキストスタイルの使い方',
        requirement: 'optional',
        placeholder: '',
        default: 'ボタンやラベルなど、UI要素内のテキストに使用します',
        rows: 3,
      } as TextareaField,
      {
        type: 'textarea',
        id: 'olnSelectedStyles',
        label: 'Oln 選択されたスタイル',
        requirement: 'optional',
        placeholder: '',
        default: '16B-100,14B-100,16N-100,14N-100',
        rows: 1,
      } as TextareaField,
      {
        type: 'textarea',
        id: 'monoNotes',
        label: 'Mono テキストスタイルの使い方',
        requirement: 'optional',
        placeholder: '',
        default: 'コード系コンテンツのテキストに使用します',
        rows: 3,
      } as TextareaField,
      {
        type: 'textarea',
        id: 'monoSelectedStyles',
        label: 'Mono 選択されたスタイル',
        requirement: 'optional',
        placeholder: '',
        default: '16B-150,14B-150,16N-150,14N-150',
        rows: 1,
      } as TextareaField,
    ],
  },
  {
    id: 'layout',
    label: 'レイアウト',
    icon: 'LayoutGrid',
    description: 'スペーシングスケールの設定',
    enabled: true,
    fields: [
      {
        type: 'select',
        id: 'spacingBase',
        label: 'スペーシング基準単位',
        requirement: 'optional',
        options: SPACING_BASE_OPTIONS,
        default: '',
      } as SelectField,
      {
        type: 'checkbox',
        id: 'useCircleRadius',
        label: '円形要素（50%）を使用する',
        requirement: 'optional',
        default: false,
      } as CheckboxField,
    ],
  },
]
