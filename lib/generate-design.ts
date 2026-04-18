import { DesignConfig, designTemplate } from './design-template'

type SectionCfg = Record<string, unknown>

function str(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

const SECTION_TITLES: Record<string, string> = {
  visualTheme: 'Visual Theme & Atmosphere',
  colorPalette: 'Color Palette & Roles',
  typography: 'Typography Rules',
  components: 'Component Stylings',
  layout: 'Layout',
  depth: 'Depth',
  guidelines: "Do's and Don'ts",
  responsive: 'Responsive Behavior',
  agentGuide: 'Agent Prompt Guide',
  misc: 'Additional Notes',
}

export function generateDesignMarkdown(config: DesignConfig): string {
  const themeName = str(config.visualTheme?.themeName).trim()
  const title = themeName
    ? `# Design System Inspired by ${themeName}`
    : '# Design System Guidelines'

  let markdown = `${title}\n\n`

  let index = 0
  for (const section of designTemplate) {
    const sectionCfg = config[section.id]
    if (!sectionCfg || !sectionCfg.enabled) continue

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
    case 'components':
      return renderComponents(cfg)
    case 'layout':
      return renderLayout(cfg)
    case 'depth':
      return renderDepth(cfg)
    case 'guidelines':
      return renderGuidelines(cfg)
    case 'responsive':
      return renderResponsive(cfg)
    case 'agentGuide':
      return renderAgentGuide(cfg)
    case 'misc':
      return renderMisc(cfg)
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

function renderShadowGroup(heading: string, items: Array<[string, unknown]>): string {
  const rows = items.filter(([, v]) => hasValue(v))
  if (rows.length === 0) return ''
  let text = `### ${heading}\n`
  for (const [name, value] of rows) {
    text += `- **${name}** (\`${String(value).trim()}\`)\n`
  }
  return `${text}\n`
}

function renderColorPalette(cfg: SectionCfg): string {
  let text = ''
  text += renderColorGroup('Primary', [
    ['CTA buttons, links', cfg.primaryCtaColor],
    ['Primary text', cfg.primaryTextColor],
    ['Primary surface', cfg.primarySurfaceColor],
    ['Spotlight', cfg.spotlightColor],
  ])
  text += renderColorGroup('Semantic', [
    ['Semantic / Accent', cfg.semanticColor],
    ['Success', cfg.successColor],
    ['Error', cfg.errorColor],
    ['Warning', cfg.warningColor],
    ['Weak text', cfg.weakTextColor],
  ])
  text += renderColorGroup('Neutral', [
    ['Secondary text', cfg.secondaryTextColor],
    ['Card borders', cfg.borderColor],
    ['Subtle surface', cfg.subtleSurfaceColor],
  ])
  text += renderShadowGroup('Shadows', [
    ['Elevated', cfg.shadowElevated],
    ['Soft', cfg.shadowSoft],
  ])
  return text
}

function splitFontFamily(raw: string): { head: string; fallbacks: string[] } {
  const parts = raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  const [head = '', ...fallbacks] = parts
  return { head, fallbacks }
}

function renderTypography(cfg: SectionCfg): string {
  let text = ''

  const primary = str(cfg.primaryFont).trim()
  const display = str(cfg.displayFont).trim()
  if (primary || display) {
    text += `### Font Families\n`
    if (primary) {
      const { head, fallbacks } = splitFontFamily(primary)
      if (fallbacks.length > 0) {
        const label = fallbacks.length > 1 ? 'fallbacks' : 'fallback'
        text += `- **Primary**: \`${head}\`, ${label}: \`${fallbacks.join(', ')}\`\n`
      } else {
        text += `- **Primary**: \`${head}\`\n`
      }
    }
    if (display) {
      const { head, fallbacks } = splitFontFamily(display)
      if (fallbacks.length > 0) {
        const label = fallbacks.length > 1 ? 'fallbacks' : 'fallback'
        text += `- **Display**: \`${head}\`, ${label}: \`${fallbacks.join(', ')}\`\n`
      } else {
        text += `- **Display**: \`${head}\`\n`
      }
    }
    text += '\n'
  }

  const primaryHead = splitFontFamily(primary).head
  const displayHead = splitFontFamily(display).head || primaryHead

  const rows: Array<[string, unknown, 'primary' | 'display']> = [
    ['Display Hero', cfg.displayHero, 'primary'],
    ['Display Bold', cfg.displayBold, 'display'],
    ['Section Heading', cfg.sectionHeading, 'primary'],
    ['Sub-heading', cfg.subHeading, 'primary'],
    ['Card Title', cfg.cardTitle, 'primary'],
    ['Feature', cfg.featureText, 'primary'],
    ['Body', cfg.bodyText, 'primary'],
    ['Body Medium', cfg.bodyMedium, 'primary'],
    ['Button', cfg.buttonText, 'primary'],
    ['Caption', cfg.captionText, 'primary'],
  ]
  const valid = rows.filter(([, v]) => hasValue(v))
  if (valid.length > 0) {
    text += `### Hierarchy\n\n`
    text += `| Role | Font | Size | Weight | Line Height | Letter Spacing |\n`
    text += `| ---- | ---- | ---- | ------ | ----------- | -------------- |\n`
    for (const [name, value, fontKey] of valid) {
      const parts = String(value)
        .split('/')
        .map((s) => s.trim())
      const [size = '', weight = '', lineHeight = '', letterSpacing = ''] = parts
      const font = fontKey === 'display' ? displayHead : primaryHead
      text += `| ${name} | ${font} | ${size} | ${weight} | ${lineHeight} | ${letterSpacing} |\n`
    }
    text += '\n'
  }

  return text
}

function renderComponents(cfg: SectionCfg): string {
  let text = ''

  const btnLines: string[] = []

  const primaryParts: string[] = []
  if (hasValue(cfg.primaryBtnBg)) primaryParts.push(`\`${str(cfg.primaryBtnBg).trim()}\``)
  if (hasValue(cfg.primaryBtnText)) primaryParts.push(`\`${str(cfg.primaryBtnText).trim()}\` text`)
  if (hasValue(cfg.primaryBtnPadding))
    primaryParts.push(`${str(cfg.primaryBtnPadding).trim()} padding`)
  if (hasValue(cfg.primaryBtnRadius))
    primaryParts.push(`${str(cfg.primaryBtnRadius).trim()} radius`)
  if (primaryParts.length > 0) {
    btnLines.push(`- **Primary**: ${primaryParts.join(', ')}`)
  }

  if (hasValue(cfg.secondaryBtnStyle)) {
    btnLines.push(`- **Secondary**: ${str(cfg.secondaryBtnStyle).trim()}`)
  }

  for (const line of toLines(cfg.otherButtons)) {
    const colonMatch = line.match(/^(.+?):\s*(.+)$/)
    if (colonMatch) {
      btnLines.push(`- **${colonMatch[1].trim()}**: ${colonMatch[2].trim()}`)
    } else {
      btnLines.push(`- ${line}`)
    }
  }

  if (btnLines.length > 0) {
    text += `### Buttons\n${btnLines.join('\n')}\n\n`
  }

  const cardParts: string[] = []
  if (hasValue(cfg.cardBorder)) cardParts.push(`\`${str(cfg.cardBorder).trim()}\``)
  if (hasValue(cfg.cardRadius)) cardParts.push(`${str(cfg.cardRadius).trim()} radius`)
  if (cardParts.length > 0) {
    text += `### Cards: ${cardParts.join(', ')}\n`
  }

  if (hasValue(cfg.inputStyle)) {
    text += `### Inputs: ${str(cfg.inputStyle).trim()}\n`
  }

  if (cardParts.length > 0 || hasValue(cfg.inputStyle)) text += '\n'

  return text
}

function renderLayout(cfg: SectionCfg): string {
  const bullets: string[] = []

  const range = str(cfg.spacingRange).trim()
  const base = str(cfg.spacingBase).trim()
  if (range && base) {
    bullets.push(`- Spacing: ${range} (${base} base)`)
  } else if (range) {
    bullets.push(`- Spacing: ${range}`)
  }

  const radii: Array<[string, unknown]> = [
    ['small', cfg.radiusSmall],
    ['buttons', cfg.radiusButton],
    ['cards', cfg.radiusCard],
    ['sections', cfg.radiusSection],
    ['large', cfg.radiusLarge],
  ]
  const validRadii = radii.filter(([, v]) => hasValue(v))
  if (validRadii.length > 0 || cfg.useCircleRadius) {
    const parts = validRadii.map(([label, value]) => `${String(value).trim()} (${label})`)
    if (cfg.useCircleRadius) parts.push('50% (circles)')
    bullets.push(`- Radius: ${parts.join(', ')}`)
  }

  if (bullets.length === 0) return ''
  return `${bullets.join('\n')}\n\n`
}

function renderDepth(cfg: SectionCfg): string {
  const bullets: string[] = []
  if (hasValue(cfg.shadowPhilosophy)) {
    bullets.push(`- ${str(cfg.shadowPhilosophy).trim()}`)
  }
  if (hasValue(cfg.ambientShadow)) {
    bullets.push(`- Soft ambient: \`${str(cfg.ambientShadow).trim()}\``)
  }
  if (bullets.length === 0) return ''
  return `${bullets.join('\n')}\n\n`
}

function renderGuidelines(cfg: SectionCfg): string {
  let text = ''
  const dos = toLines(cfg.dos)
  const donts = toLines(cfg.donts)
  if (dos.length > 0) {
    text += `### Do: ${dos.join(', ')}\n`
  }
  if (donts.length > 0) {
    text += `### Don't: ${donts.join(', ')}\n`
  }
  if (text) text += '\n'
  return text
}

function renderResponsive(cfg: SectionCfg): string {
  let text = ''
  const selected = Array.isArray(cfg.breakpoints) ? (cfg.breakpoints as string[]) : []
  const customList = str(cfg.customBreakpoints)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  const allBps = [...selected, ...customList]

  if (allBps.length > 0) {
    text += `Breakpoints: ${allBps.join(', ')}\n\n`
  }

  if (hasValue(cfg.responsiveNotes)) {
    text += `${str(cfg.responsiveNotes).trim()}\n\n`
  }
  return text
}

function renderAgentGuide(cfg: SectionCfg): string {
  let text = ''
  const items: Array<[string, unknown]> = [
    ['Text', cfg.agentTextColor],
    ['CTA', cfg.agentCtaColor],
    ['Background', cfg.agentBgColor],
    ['Border', cfg.agentBorderColor],
  ]
  for (const [name, value] of items) {
    if (!hasValue(value)) continue
    const parsed = parseNameValue(value)
    if (parsed.name) {
      text += `- ${name}: ${parsed.name} (\`${parsed.value}\`)\n`
    } else {
      text += `- ${name}: \`${parsed.value}\`\n`
    }
  }
  if (text) text += '\n'
  if (hasValue(cfg.agentExamples)) {
    text += `${str(cfg.agentExamples).trim()}\n\n`
  }
  return text
}

function renderMisc(cfg: SectionCfg): string {
  const content = typeof cfg.miscContent === 'string' ? cfg.miscContent.trim() : ''
  if (!content) return ''
  return `${content}\n\n`
}
