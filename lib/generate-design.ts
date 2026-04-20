import { DesignConfig, designTemplate } from './design-template'
import { SPACING_SCALES, CATEGORY_LABELS, DEFAULT_TEXT_STYLES, TEXT_STYLE_WEIGHTS } from './constants'

type SectionCfg = Record<string, unknown>

function str(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function parseTextStyle(style: string): { fontSize: string; weight: string; lineHeight: string; letterSpacing: string } {
  const match = style.match(/^(\d+)(Th|N|B|Bk)-(\d+)-(-?\d+)$/)
  if (!match) return { fontSize: '', weight: '', lineHeight: '', letterSpacing: '' }
  const [, fontSize, weight, lineHeight, letterSpacingValue] = match
  const letterSpacingNum = parseInt(letterSpacingValue)
  const weightMap: Record<string, string> = { 'Th': 'Thin', 'N': 'Normal', 'B': 'Bold', 'Bk': 'Black' }
  return {
    fontSize: `${fontSize}px`,
    weight: weightMap[weight] || weight,
    lineHeight: `${lineHeight}%`,
    letterSpacing: `${(letterSpacingNum * 0.01).toFixed(2)}em`,
  }
}

const SECTION_TITLES: Record<string, string> = {
  visualTheme: 'Visual Theme & Atmosphere',
  colorPalette: 'Color Palette & Roles',
  typography: 'Typography Rules',
  layout: 'Layout',
}

export function generateDesignMarkdown(config: DesignConfig): string {
  const themeName = str(config.visualTheme?.themeName).trim()
  const title = themeName
    ? `# Design System Inspired by ${themeName}`
    : '# Design System Guidelines'

  let markdown = `${title}\n\n`

  const isCustomTheme = config.visualTheme?.isCustomTheme as boolean

  let index = 0
  for (const section of designTemplate) {
    const sectionCfg = config[section.id]
    if (!sectionCfg || !sectionCfg.enabled) continue

    if (!themeName && !isCustomTheme && (section.id === 'typography' || section.id === 'layout')) continue

    const content = generateSectionContent(section.id, sectionCfg)
    if (!content.trim()) continue

    index += 1
    const heading = SECTION_TITLES[section.id] || section.label
    markdown += `## ${index}. ${heading}\n\n`
    markdown += content.trim() + '\n\n'
  }

  return markdown.trim() + '\n'
}

function generateSectionContent(sectionId: string, cfg: SectionCfg): string {
  switch (sectionId) {
    case 'visualTheme':
      return renderVisualTheme(cfg)
    case 'colorPalette':
      return renderColorPalette(cfg)
    case 'typography':
      return renderTypography(cfg)
    case 'layout':
      return renderLayout(cfg)
    default:
      return ''
  }
}

function hasValue(value: unknown): boolean {
  return typeof value === 'string' && value.trim() !== ''
}

function toLines(raw: unknown): string[] {
  if (typeof raw !== 'string') return []
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

function parseNameValue(raw: unknown): { name: string; value: string } {
  const input = str(raw).trim()
  if (!input) return { name: '', value: '' }

  if (/^(#[0-9a-f]+|(?:rgba?|hsla?|var)\s*\([^)]*\))$/i.test(input)) {
    return { value: input, name: '' }
  }

  const colorThenName = input.match(
    /^((?:#[0-9a-f]+|(?:rgba?|hsla?|var)\s*\([^)]*\)))\s*[（(](.+?)[）)]\s*$/i
  )
  if (colorThenName) {
    return { value: colorThenName[1].trim(), name: colorThenName[2].trim() }
  }

  const nameThenColor = input.match(
    /^(.+?)\s*[（(]((?:#[0-9a-f]+|(?:rgba?|hsla?|var)\s*\([^)]*\)))[）)]\s*$/i
  )
  if (nameThenColor) {
    return { value: nameThenColor[2].trim(), name: nameThenColor[1].trim() }
  }

  const generic = input.match(/^(.+?)\s*[（(]([^()（）]+)[）)]\s*$/)
  if (generic) {
    return { value: generic[1].trim(), name: generic[2].trim() }
  }

  return { value: input, name: '' }
}

function renderVisualTheme(cfg: SectionCfg): string {
  let text = ''
  if (hasValue(cfg.atmosphere)) text += `${str(cfg.atmosphere).trim()}\n\n`

  const chars = toLines(cfg.keyCharacteristics)
  if (chars.length > 0) {
    text += `**Key Characteristics:**\n`
    for (const line of chars) text += `- ${line}\n`
    text += '\n'
  }
  return text
}

function renderColorGroup(heading: string, items: Array<[string, unknown]>): string {
  const rows = items.filter(([, v]) => hasValue(v))
  if (rows.length === 0) return ''
  let text = `### ${heading}\n`
  for (const [description, value] of rows) {
    const parsed = parseNameValue(value)
    if (parsed.name) {
      text += `- **${parsed.name}** (\`${parsed.value}\`): ${description}\n`
    } else {
      text += `- **${description}** (\`${parsed.value}\`)\n`
    }
  }
  return `${text}\n`
}

function renderNotes(raw: unknown): string {
  const lines = toLines(raw)
  if (lines.length === 0) return ''
  return lines.map((l) => (l.startsWith('-') ? l : `- ${l}`)).join('\n') + '\n'
}

function renderColorPalette(cfg: SectionCfg): string {
  let text = ''
  const primaryItems: Array<[string, unknown]> = [
    ['Primary', cfg.primaryCtaColor],
    ['Secondary', cfg.secondaryCtaColor],
    ['Tertiary', cfg.tertiaryCtaColor],
    ['Primary surface', cfg.primarySurfaceColor],
  ]
  const customKeyColors = (cfg.customKeyColors as Array<{ name: string; color: string }>) || []
  for (const item of customKeyColors) {
    primaryItems.push([item.name, item.color])
  }
  text += renderColorGroup('KeyColor', primaryItems)
  const keyNotes = renderNotes(cfg.keyColorNotes)
  if (keyNotes) text += `#### キーカラーの使い方\n${keyNotes}\n`

  const additionalSets = (cfg.additionalKeyColorSets as Array<{ primaryColor: string; secondaryColor: string; tertiaryColor: string; bgColor: string; notes: string }>) || []
  for (let i = 0; i < additionalSets.length; i++) {
    const set = additionalSets[i]
    text += renderColorGroup(`KeyColor (Set ${i + 2})`, [
      ['Primary', set.primaryColor],
      ['Secondary', set.secondaryColor],
      ['Tertiary', set.tertiaryColor],
      ['Primary surface', set.bgColor],
    ])
    const setNotes = renderNotes(set.notes)
    if (setNotes) text += `#### セット ${i + 2} の使い方\n${setNotes}\n`
  }
  text += renderColorGroup('Grayscale', [
    ['White', cfg.white],
    ['Gray 1', cfg.gray1],
    ['Gray 2', cfg.gray2],
    ['Gray 3', cfg.gray3],
    ['Gray 4', cfg.gray4],
    ['Gray 5', cfg.gray5],
    ['Gray 6', cfg.gray6],
    ['Gray 7', cfg.gray7],
    ['Gray 8', cfg.gray8],
    ['Gray 9', cfg.gray9],
    ['Gray 10', cfg.gray10],
    ['Gray 11', cfg.gray11],
    ['Gray 12', cfg.gray12],
    ['Black', cfg.black],
  ])
  const commonNotes = renderNotes(cfg.commonColorNotes)
  if (commonNotes) text += `#### グレースケールの使い方\n${commonNotes}\n`
  if ((cfg.useSemanticColors as boolean) ?? true) {
    text += renderColorGroup('Semantic', [
      ['Success', cfg.successColor],
      ['Error', cfg.errorColor],
      ['Warning', cfg.warningColor],
      ['Weak text', cfg.weakTextColor],
    ])
    const semanticNotes = renderNotes(cfg.semanticColorNotes)
    if (semanticNotes) text += `#### セマンティックカラーの使い方\n${semanticNotes}\n`
  }
  return text
}

function renderTypography(cfg: SectionCfg): string {
  const latinFont = str(cfg.latinFont).trim()
  const latinCustom = str(cfg.latinFontCustom).trim()
  const latin = latinFont === 'custom' ? latinCustom : latinFont

  const japaneseFont = str(cfg.japaneseFont).trim()
  const japaneseCustom = str(cfg.japaneseFontCustom).trim()
  const japanese = japaneseFont === 'custom' ? japaneseCustom : japaneseFont

  let text = ''
  if (latin || japanese) {
    text += `### Font Families\n`
    if (latin) text += `- **Latin**: \`${latin}\`\n`
    if (japanese) text += `- **Japanese**: \`${japanese}\`\n`
    text += '\n'
  }

  const categories = ['dsp', 'std', 'dns', 'oln', 'mono'] as const

  text += `### Text Styles\n\n`
  for (const cat of categories) {
    const catCapitalized = cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase()
    const catKey = catCapitalized as keyof typeof DEFAULT_TEXT_STYLES
    const catLabel = CATEGORY_LABELS[catCapitalized] || cat.toUpperCase()

    text += `#### ${catLabel}\n\n`

    const selectedStylesField = `${cat}SelectedStyles`
    const selectedStylesStr = str(cfg[selectedStylesField as keyof SectionCfg]).trim()
    const selectedStyles = selectedStylesStr ? selectedStylesStr.split(',').map(s => s.trim()) : []

    const weights = TEXT_STYLE_WEIGHTS as readonly string[]
    const weightLabels: Record<string, string> = { 'Th': 'Thin', 'N': 'Normal', 'B': 'Bold', 'Bk': 'Black' }
    for (const weight of weights) {
      const weightLabel = weightLabels[weight] || weight
      const styles = DEFAULT_TEXT_STYLES[catKey]?.[weight as keyof typeof DEFAULT_TEXT_STYLES[keyof typeof DEFAULT_TEXT_STYLES]] || []
      const filteredStyles = selectedStyles.length > 0 ? styles.filter(s => selectedStyles.includes(s)) : styles
      if (filteredStyles.length > 0) {
        text += `**${weightLabel}:**\n`
        for (const style of filteredStyles) {
          const parsed = parseTextStyle(style)
          text += `- ${parsed.fontSize} | ${parsed.weight} | ${parsed.lineHeight} | ${parsed.letterSpacing}\n`
        }
        text += '\n'
      }
    }

    const notes = str(cfg[`${cat}Notes` as keyof SectionCfg]).trim()
    if (notes) {
      text += `**使い方:**\n`
      const noteLines = notes.split('\n').filter(l => l.trim())
      for (const line of noteLines) {
        text += `${line.trim().startsWith('-') ? line.trim() : `- ${line.trim()}`}\n`
      }
      text += '\n'
    }
    text += '\n'
  }

  return text.trim() ? `${text}\n` : ''
}

function renderLayout(cfg: SectionCfg): string {
  const bullets: string[] = []

  const layoutType = str(cfg.layoutType).trim()
  if (layoutType) {
    const layoutLabel = layoutType === 'liquid' ? 'リキッド（流動的）' : 'ソリッド（固定幅）'
    bullets.push(`- Layout Type: ${layoutLabel}`)
  }

  const base = str(cfg.spacingBase).trim()
  if (base) {
    bullets.push(`- Base Unit: ${base}`)
  }
  if (base && SPACING_SCALES[base]) {
    bullets.push(`- Spacing Scale: ${SPACING_SCALES[base].join(', ')}`)
  }

  const breakpoints: string[] = []
  const bpConfigs = [
    { enabled: cfg.smBreakpointEnabled as boolean, value: cfg.smBreakpointValue as number, name: 'sm' },
    { enabled: cfg.mdBreakpointEnabled as boolean, value: cfg.mdBreakpointValue as number, name: 'md' },
    { enabled: cfg.lgBreakpointEnabled as boolean, value: cfg.lgBreakpointValue as number, name: 'lg' },
    { enabled: cfg['2xlBreakpointEnabled'] as boolean, value: cfg['2xlBreakpointValue'] as number, name: '2xl' },
  ]
  for (const bp of bpConfigs) {
    if (bp.enabled && bp.value) {
      breakpoints.push(`${bp.name}: ${bp.value}px`)
    }
  }
  if (breakpoints.length > 0) {
    bullets.push(`- Breakpoints: ${breakpoints.join(', ')}`)
  }

  if (bullets.length === 0) return ''
  let text = `${bullets.join('\n')}\n\n`

  if (cfg.ergonomicsGuidance as boolean) {
    text += `### 人間工学に基づく指示

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

`
  }

  return text
}
