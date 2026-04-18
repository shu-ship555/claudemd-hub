export type FieldType = 'select' | 'text' | 'multiselect' | 'checkbox' | 'number' | 'textarea'
export type Requirement = 'required' | 'optional'

export interface SelectField {
  type: 'select'
  id: string
  label: string
  requirement: Requirement
  options: string[]
  default: string
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

export type DesignField = SelectField | TextField | NumberField | MultiSelectField | CheckboxField | TextareaField

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
    label: '🎭 Visual Theme & Atmosphere',
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
    label: '🎨 Color Palette & Roles',
    icon: '🎨',
    description: 'プライマリ・セマンティック・ニュートラル・シャドウの色定義',
    enabled: true,
    fields: [
      {
        type: 'text',
        id: 'primaryTextColor',
        label: 'Primary Text（主要テキスト）',
        requirement: 'required',
        placeholder: '例: #181d26（Deep Navy）',
        default: '',
      } as TextField,
      {
        type: 'text',
        id: 'primaryCtaColor',
        label: 'Primary CTA / Link（CTA・リンク）',
        requirement: 'required',
        placeholder: '例: #1b61c9（Airtable Blue）',
        default: '',
      } as TextField,
      {
        type: 'text',
        id: 'primarySurfaceColor',
        label: 'Primary Surface（背景色）',
        requirement: 'required',
        placeholder: '例: #ffffff（White）',
        default: '',
      } as TextField,
      {
        type: 'text',
        id: 'spotlightColor',
        label: 'Spotlight / アクセント背景（任意）',
        requirement: 'optional',
        placeholder: '例: rgba(249,252,255,0.97)',
        default: '',
      } as TextField,
      {
        type: 'text',
        id: 'successColor',
        label: 'Success（成功）',
        requirement: 'optional',
        placeholder: '例: #006400',
        default: '',
      } as TextField,
      {
        type: 'text',
        id: 'errorColor',
        label: 'Error（エラー）',
        requirement: 'optional',
        placeholder: '例: #b91c1c',
        default: '',
      } as TextField,
      {
        type: 'text',
        id: 'warningColor',
        label: 'Warning（警告）',
        requirement: 'optional',
        placeholder: '例: #ca8a04',
        default: '',
      } as TextField,
      {
        type: 'text',
        id: 'weakTextColor',
        label: 'Weak Text（弱調テキスト）',
        requirement: 'optional',
        placeholder: '例: rgba(4,14,32,0.69)',
        default: '',
      } as TextField,
      {
        type: 'text',
        id: 'secondaryTextColor',
        label: 'Secondary Text（セカンダリテキスト）',
        requirement: 'optional',
        placeholder: '例: #333333',
        default: '',
      } as TextField,
      {
        type: 'text',
        id: 'borderColor',
        label: 'Border（ボーダー）',
        requirement: 'optional',
        placeholder: '例: #e0e2e6',
        default: '',
      } as TextField,
      {
        type: 'text',
        id: 'subtleSurfaceColor',
        label: 'Subtle Surface（微調背景）',
        requirement: 'optional',
        placeholder: '例: #f8fafc',
        default: '',
      } as TextField,
      {
        type: 'textarea',
        id: 'shadowElevated',
        label: 'Elevated Shadow（多層シャドウ可）',
        requirement: 'optional',
        placeholder:
          '例: rgba(0,0,0,0.32) 0px 0px 1px, rgba(0,0,0,0.08) 0px 0px 2px, rgba(45,127,249,0.28) 0px 1px 3px',
        default: '',
        rows: 2,
      } as TextareaField,
      {
        type: 'text',
        id: 'shadowSoft',
        label: 'Soft Shadow（ソフトシャドウ）',
        requirement: 'optional',
        placeholder: '例: rgba(15,48,106,0.05) 0px 0px 20px',
        default: '',
      } as TextField,
    ],
  },
  {
    id: 'typography',
    label: '✍️ Typography Rules',
    icon: '✍️',
    description: 'フォントファミリーと階層（サイズ / ウェイト / 行間 / 字間）',
    enabled: true,
    fields: [
      {
        type: 'text',
        id: 'primaryFont',
        label: 'Primary Font（フォールバック込み）',
        requirement: 'required',
        placeholder: '例: Haas, -apple-system, system-ui, Segoe UI, Roboto',
        default: '',
      } as TextField,
      {
        type: 'text',
        id: 'displayFont',
        label: 'Display Font（見出し用・任意）',
        requirement: 'optional',
        placeholder: '例: Haas Groot Disp, Haas',
        default: '',
      } as TextField,
      {
        type: 'select',
        id: 'letterSpacingStrategy',
        label: 'Letter Spacing 戦略',
        requirement: 'required',
        options: [
          'ポジティブトラッキング（広め）',
          'ネガティブトラッキング（狭め）',
          'ニュートラル（normal）',
        ],
        default: 'ニュートラル（normal）',
      } as SelectField,
      {
        type: 'text',
        id: 'letterSpacingRange',
        label: 'Letter Spacing の代表レンジ',
        requirement: 'optional',
        placeholder: '例: 0.08px–0.28px / -0.374px–-0.08px',
        default: '',
      } as TextField,
      {
        type: 'text',
        id: 'displayHero',
        label: 'Display Hero（サイズ / ウェイト / 行間 / 字間）',
        requirement: 'optional',
        placeholder: '例: 48px / 400 / 1.15 / normal',
        default: '',
      } as TextField,
      {
        type: 'text',
        id: 'displayBold',
        label: 'Display Bold',
        requirement: 'optional',
        placeholder: '例: 48px / 900 / 1.50 / normal',
        default: '',
      } as TextField,
      {
        type: 'text',
        id: 'sectionHeading',
        label: 'Section Heading',
        requirement: 'optional',
        placeholder: '例: 40px / 400 / 1.25 / normal',
        default: '',
      } as TextField,
      {
        type: 'text',
        id: 'subHeading',
        label: 'Sub-heading',
        requirement: 'optional',
        placeholder: '例: 32px / 400-500 / 1.15-1.25 / normal',
        default: '',
      } as TextField,
      {
        type: 'text',
        id: 'cardTitle',
        label: 'Card Title',
        requirement: 'optional',
        placeholder: '例: 24px / 400 / 1.20-1.30 / 0.12px',
        default: '',
      } as TextField,
      {
        type: 'text',
        id: 'featureText',
        label: 'Feature',
        requirement: 'optional',
        placeholder: '例: 20px / 400 / 1.25-1.50 / 0.1px',
        default: '',
      } as TextField,
      {
        type: 'text',
        id: 'bodyText',
        label: 'Body',
        requirement: 'optional',
        placeholder: '例: 18px / 400 / 1.35 / 0.18px',
        default: '',
      } as TextField,
      {
        type: 'text',
        id: 'bodyMedium',
        label: 'Body Medium',
        requirement: 'optional',
        placeholder: '例: 16px / 500 / 1.30 / 0.08-0.16px',
        default: '',
      } as TextField,
      {
        type: 'text',
        id: 'buttonText',
        label: 'Button',
        requirement: 'optional',
        placeholder: '例: 16px / 500 / 1.25-1.30 / 0.08px',
        default: '',
      } as TextField,
      {
        type: 'text',
        id: 'captionText',
        label: 'Caption',
        requirement: 'optional',
        placeholder: '例: 14px / 400-500 / 1.25-1.35 / 0.07-0.28px',
        default: '',
      } as TextField,
    ],
  },
  {
    id: 'components',
    label: '🧩 Component Stylings',
    icon: '🧩',
    description: 'ボタン、カード、インプットなどのデフォルトスタイル',
    enabled: true,
    fields: [
      {
        type: 'text',
        id: 'primaryBtnBg',
        label: 'Primary Button 背景色',
        requirement: 'optional',
        placeholder: '例: #1b61c9',
        default: '',
      } as TextField,
      {
        type: 'text',
        id: 'primaryBtnText',
        label: 'Primary Button テキスト色',
        requirement: 'optional',
        placeholder: '例: #ffffff',
        default: '',
      } as TextField,
      {
        type: 'text',
        id: 'primaryBtnPadding',
        label: 'Primary Button パディング',
        requirement: 'optional',
        placeholder: '例: 16px 24px',
        default: '',
      } as TextField,
      {
        type: 'text',
        id: 'primaryBtnRadius',
        label: 'Primary Button ラジウス',
        requirement: 'optional',
        placeholder: '例: 12px',
        default: '',
      } as TextField,
      {
        type: 'textarea',
        id: 'secondaryBtnStyle',
        label: 'Secondary Button の定義',
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
        type: 'text',
        id: 'cardBorder',
        label: 'Card Border',
        requirement: 'optional',
        placeholder: '例: 1px solid #e0e2e6',
        default: '',
      } as TextField,
      {
        type: 'text',
        id: 'cardRadius',
        label: 'Card Radius',
        requirement: 'optional',
        placeholder: '例: 16px-24px',
        default: '',
      } as TextField,
      {
        type: 'text',
        id: 'inputStyle',
        label: 'Input スタイル',
        requirement: 'optional',
        placeholder: '例: 標準 Haas スタイリング / 11px radius, 3px border',
        default: '',
      } as TextField,
    ],
  },
  {
    id: 'layout',
    label: '📐 Layout',
    icon: '📐',
    description: 'スペーシングとラジウスのスケール',
    enabled: true,
    fields: [
      {
        type: 'text',
        id: 'spacingRange',
        label: 'スペーシング範囲',
        requirement: 'optional',
        placeholder: '例: 1–48px',
        default: '',
      } as TextField,
      {
        type: 'select',
        id: 'spacingBase',
        label: 'スペーシング基準単位',
        requirement: 'required',
        options: ['4px', '6px', '8px', '16px'],
        default: '8px',
      } as SelectField,
      {
        type: 'text',
        id: 'radiusSmall',
        label: 'Radius Small',
        requirement: 'optional',
        placeholder: '例: 2px',
        default: '',
      } as TextField,
      {
        type: 'text',
        id: 'radiusButton',
        label: 'Radius Button',
        requirement: 'optional',
        placeholder: '例: 12px',
        default: '',
      } as TextField,
      {
        type: 'text',
        id: 'radiusCard',
        label: 'Radius Card',
        requirement: 'optional',
        placeholder: '例: 16px',
        default: '',
      } as TextField,
      {
        type: 'text',
        id: 'radiusSection',
        label: 'Radius Section',
        requirement: 'optional',
        placeholder: '例: 24px',
        default: '',
      } as TextField,
      {
        type: 'text',
        id: 'radiusLarge',
        label: 'Radius Large / Pill',
        requirement: 'optional',
        placeholder: '例: 32px / 980px',
        default: '',
      } as TextField,
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
    label: '🌫️ Depth',
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
        label: 'Ambient / 補助シャドウ',
        requirement: 'optional',
        placeholder: '例: rgba(15,48,106,0.05) 0px 0px 20px',
        default: '',
      } as TextField,
    ],
  },
  {
    id: 'guidelines',
    label: "✅ Do's and Don'ts",
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
        label: "Don't（避けるべき・1行1項目）",
        requirement: 'optional',
        placeholder: '例:\nポジティブレタースペーシングをスキップする\n重いシャドウを使う',
        default: '',
        rows: 6,
      } as TextareaField,
    ],
  },
  {
    id: 'responsive',
    label: '📱 Responsive Behavior',
    icon: '📱',
    description: 'ブレークポイント戦略',
    enabled: true,
    fields: [
      {
        type: 'number',
        id: 'minBreakpoint',
        label: '最小ブレークポイント（px）',
        requirement: 'optional',
        default: 425,
        min: 320,
        max: 1024,
        step: 1,
      } as NumberField,
      {
        type: 'number',
        id: 'maxBreakpoint',
        label: '最大ブレークポイント（px）',
        requirement: 'optional',
        default: 1664,
        min: 768,
        max: 2560,
        step: 1,
      } as NumberField,
      {
        type: 'number',
        id: 'breakpointCount',
        label: 'ブレークポイントの総数',
        requirement: 'optional',
        default: 23,
        min: 1,
        max: 50,
        step: 1,
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
    id: 'agentGuide',
    label: '🤖 Agent Prompt Guide',
    icon: '🤖',
    description: 'AI/エージェント向けの簡易カラーリファレンス',
    enabled: true,
    fields: [
      {
        type: 'text',
        id: 'agentTextColor',
        label: 'Text',
        requirement: 'optional',
        placeholder: '例: Deep Navy (#181d26)',
        default: '',
      } as TextField,
      {
        type: 'text',
        id: 'agentCtaColor',
        label: 'CTA',
        requirement: 'optional',
        placeholder: '例: Airtable Blue (#1b61c9)',
        default: '',
      } as TextField,
      {
        type: 'text',
        id: 'agentBgColor',
        label: 'Background',
        requirement: 'optional',
        placeholder: '例: White (#ffffff)',
        default: '',
      } as TextField,
      {
        type: 'text',
        id: 'agentBorderColor',
        label: 'Border',
        requirement: 'optional',
        placeholder: '例: #e0e2e6',
        default: '',
      } as TextField,
      {
        type: 'textarea',
        id: 'agentExamples',
        label: 'プロンプト例 / 追加指針（任意）',
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
