import { DesignConfig, designTemplate } from './design-template'
import { SPACING_SCALES, CATEGORY_LABELS, DEFAULT_TEXT_STYLES, TEXT_STYLE_WEIGHTS } from './constants'

type SectionCfg = Record<string, unknown>

function str(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function parseTextStyle(style: string): { fontSize: string; weight: string; lineHeight: string } {
  const match = style.match(/^(\d+)([BN])-(\d+)$/)
  if (!match) return { fontSize: '', weight: '', lineHeight: '' }
  const [, fontSize, weight, lineHeight] = match
  return {
    fontSize: `${fontSize}px`,
    weight: weight === 'B' ? 'Bold' : 'Normal',
    lineHeight: `${lineHeight}%`,
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

    if (!themeName && !isCustomTheme && section.id === 'typography') continue

    const content = generateSectionContent(section.id, sectionCfg)
    if (!content.trim()) continue

    index += 1
    const heading = SECTION_TITLES[section.id] || section.label
    markdown += `## ${index}. ${heading}\n\n`
    markdown += content.endsWith('\n') ? content : `${content}\n`
    if (!markdown.endsWith('\n\n')) markdown += '\n'
  }

  return markdown
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
    for (const weight of weights) {
      const weightLabel = weight === 'B' ? 'Bold' : 'Normal'
      const styles = DEFAULT_TEXT_STYLES[catKey]?.[weight as keyof typeof DEFAULT_TEXT_STYLES[keyof typeof DEFAULT_TEXT_STYLES]] || []
      const filteredStyles = selectedStyles.length > 0 ? styles.filter(s => selectedStyles.includes(s)) : styles
      if (filteredStyles.length > 0) {
        text += `**${weightLabel}:**\n`
        for (const style of filteredStyles) {
          const parsed = parseTextStyle(style)
          text += `- ${parsed.fontSize} | ${parsed.weight} | ${parsed.lineHeight}\n`
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

  const base = str(cfg.spacingBase).trim()
  if (base) {
    bullets.push(`- Base Unit: ${base}`)
  }
  if (base && SPACING_SCALES[base]) {
    bullets.push(`- Spacing Scale: ${SPACING_SCALES[base].join(', ')}`)
  }
  if (cfg.useCircleRadius) {
    bullets.push(`- Radius: 50% (circles)`)
  }

  if (bullets.length === 0) return ''
  return `${bullets.join('\n')}\n\n`
}
