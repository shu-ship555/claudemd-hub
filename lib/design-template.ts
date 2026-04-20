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
        default: 'ライトなベースカラーにブルー系のアクセントを組み合わせた、クリーンでプロフェッショナルなビジュアル。余白を活かしたレイアウトで情報の見通しをよくする。',
        rows: 5,
      } as TextareaField,
      {
        type: 'textarea',
        id: 'keyCharacteristics',
        label: '主要な特徴（1行1項目）',
        requirement: 'optional',
        placeholder:
          '例:\n白いキャンバスとディープネイビーのテキスト (#181d26)\nAirtable Blue (#1b61c9) を CTA とリンクに使用\nHaas + Haas Groot Disp のデュアルフォント\n12px のボタンラジウス、16px-32px のカード\nブルー調の多層シャドウ',
        default: 'ライトな背景色とディープなテキストカラーによる高コントラスト\nブルー系プライマリカラーを CTA とリンクに使用\nグレースケールで情報の階層を表現\n十分な余白とスペーシングで読みやすさを確保',
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
        default: '#1a4fd6',
      } as ColorField,
      {
        type: 'color',
        id: 'secondaryCtaColor',
        label: 'セカンダリカラー',
        requirement: 'optional',
        default: '#3b65ce',
      } as ColorField,
      {
        type: 'color',
        id: 'tertiaryCtaColor',
        label: 'ターシャリカラー',
        requirement: 'optional',
        default: '#0d38a5',
      } as ColorField,
      {
        type: 'color',
        id: 'semanticColor',
        label: 'セマンティックカラー（成功・強調）',
        requirement: 'required',
        default: '#0284c7',
      } as ColorField,
      {
        type: 'color',
        id: 'primarySurfaceColor',
        label: 'ライト（背景・白系）',
        requirement: 'required',
        default: '#ebf1ff',
      } as ColorField,
      {
        type: 'color',
        id: 'primaryTextColor',
        label: 'ダーク（テキスト・黒系）',
        requirement: 'required',
        default: '#0f1e3d',
      } as ColorField,
      {
        type: 'color',
        id: 'successColor',
        label: '成功色',
        requirement: 'optional',
        default: '#16a34a',
      } as ColorField,
      {
        type: 'color',
        id: 'errorColor',
        label: 'エラー色',
        requirement: 'optional',
        default: '#dc2626',
      } as ColorField,
      {
        type: 'color',
        id: 'warningColor',
        label: '警告色',
        requirement: 'optional',
        default: '#d97706',
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
        default: '128Bk-140--2,96Bk-140--2,64Bk-140--1,56Bk-140--1,48Bk-140--1,128B-140--2,96B-140--2,64B-140--1,56B-140--1,48B-140--1,128N-140--2,96N-140--2,64N-140--1,56N-140--1,48N-140--1,128Th-140--2,96Th-140--2,64Th-140--1,56Th-140--1,48Th-140--1',
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
        default: '40Bk-140-0,36Bk-140-0,32Bk-150-0,28Bk-150-0,26Bk-150-0,24Bk-150-0,22Bk-150-0,20Bk-150-0,18Bk-160-0,16Bk-160-0,14Bk-160-0,12Bk-170-2,10Bk-170-4,40B-140-0,36B-140-0,32B-150-0,28B-150-0,26B-150-0,24B-150-0,22B-150-0,20B-150-0,18B-160-0,16B-160-0,14B-160-0,12B-170-2,10B-170-4,40N-140-0,36N-140-0,32N-150-0,28N-150-0,26N-150-0,24N-150-0,22N-150-0,20N-150-0,18N-160-0,16N-160-0,14N-160-0,12N-170-2,10N-170-4,40Th-140-0,36Th-140-0,32Th-150-0,28Th-150-0,26Th-150-0,24Th-150-0,22Th-150-0,20Th-150-0,18Th-160-0,16Th-160-0,14Th-160-0,12Th-170-2,10Th-170-4',
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
        default: '16Bk-130-0,16Bk-120-0,14Bk-130-1,14Bk-120-1,12Bk-130-2,10Bk-120-2,16B-130-0,16B-120-0,14B-130-1,14B-120-1,12B-130-2,10B-120-2,16N-130-0,16N-120-0,14N-130-1,14N-120-1,12N-130-2,10N-120-2,16Th-130-0,16Th-120-0,14Th-130-1,14Th-120-1,12Th-130-2,10Th-120-2',
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
        default: '16Bk-100-2,14Bk-100-2,12Bk-100-3,10Bk-100-5,16B-100-2,14B-100-2,12B-100-3,10B-100-5,16N-100-2,14N-100-2,12N-100-3,10N-100-5,16Th-100-2,14Th-100-2,12Th-100-3,10Th-100-5',
        rows: 1,
      } as TextareaField,
      {
        type: 'textarea',
        id: 'monoNotes',
        label: 'Mono テキストスタイルの使い方',
        requirement: 'optional',
        placeholder: '',
        default: 'preタグとcodeタグとのテキストに使用します',
        rows: 3,
      } as TextareaField,
      {
        type: 'textarea',
        id: 'monoSelectedStyles',
        label: 'Mono 選択されたスタイル',
        requirement: 'optional',
        placeholder: '',
        default: '16Bk-150-0,14Bk-150-0,12Bk-150-0,10Bk-150-0,16B-150-0,14B-150-0,12B-150-0,10B-150-0,16N-150-0,14N-150-0,12N-150-0,10N-150-0,16Th-150-0,14Th-150-0,12Th-150-0,10Th-150-0',
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
        id: 'layoutType',
        label: 'レイアウトタイプ',
        requirement: 'optional',
        options: ['liquid', 'solid'],
        default: 'liquid',
      } as SelectField,
      {
        type: 'select',
        id: 'spacingBase',
        label: 'スペーシング基準単位',
        requirement: 'optional',
        options: SPACING_BASE_OPTIONS,
        default: '8px',
      } as SelectField,
      {
        type: 'checkbox',
        id: 'smBreakpointEnabled',
        label: 'sm ブレイクポイントを使用する',
        requirement: 'optional',
        default: true,
      } as CheckboxField,
      {
        type: 'number',
        id: 'smBreakpointValue',
        label: 'sm',
        requirement: 'optional',
        default: 640,
        min: 1,
        dependsOn: { fieldId: 'smBreakpointEnabled', values: [true] },
      } as NumberField,
      {
        type: 'checkbox',
        id: 'mdBreakpointEnabled',
        label: 'md ブレイクポイントを使用する',
        requirement: 'optional',
        default: true,
      } as CheckboxField,
      {
        type: 'number',
        id: 'mdBreakpointValue',
        label: 'md',
        requirement: 'optional',
        default: 768,
        min: 1,
        dependsOn: { fieldId: 'mdBreakpointEnabled', values: [true] },
      } as NumberField,
      {
        type: 'checkbox',
        id: 'lgBreakpointEnabled',
        label: 'lg ブレイクポイントを使用する',
        requirement: 'optional',
        default: true,
      } as CheckboxField,
      {
        type: 'number',
        id: 'lgBreakpointValue',
        label: 'lg',
        requirement: 'optional',
        default: 1024,
        min: 1,
        dependsOn: { fieldId: 'lgBreakpointEnabled', values: [true] },
      } as NumberField,
      {
        type: 'checkbox',
        id: '2xlBreakpointEnabled',
        label: '2xl ブレイクポイントを使用する',
        requirement: 'optional',
        default: true,
      } as CheckboxField,
      {
        type: 'number',
        id: '2xlBreakpointValue',
        label: '2xl',
        requirement: 'optional',
        default: 1536,
        min: 1,
        dependsOn: { fieldId: '2xlBreakpointEnabled', values: [true] },
      } as NumberField,
      {
        type: 'checkbox',
        id: 'ergonomicsGuidance',
        label: '人間工学に基づく指示を含める',
        requirement: 'optional',
        default: true,
      } as CheckboxField,
    ],
  },
]
