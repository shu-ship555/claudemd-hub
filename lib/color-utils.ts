export const COLOR_FORMATS = ['HEX', 'rgb', 'rgba', 'oklch', 'hsl', 'hsla']

export function getColorFormat(v: string): string {
  if (!v || v.startsWith('#')) return 'HEX'
  for (const f of ['rgba', 'rgb', 'oklch', 'hsla', 'hsl']) {
    if (v.startsWith(`${f}(`)) return f
  }
  return 'HEX'
}

export function getRawColor(v: string, fmt: string): string {
  if (!v) return ''
  if (fmt === 'HEX') return v.replace(/^#/, '')
  const m = v.match(/\(([^)]*)\)/)
  return m ? m[1] : ''
}

export function assembleColor(fmt: string, raw: string): string {
  if (!raw) return ''
  return fmt === 'HEX' ? `#${raw}` : `${fmt}(${raw})`
}

export const COLOR_PLACEHOLDERS: Record<string, string> = {
  HEX: '例: 1b61c9',
  rgb: '例: 27, 97, 201',
  rgba: '例: 27, 97, 201, 0.8',
  oklch: '例: 55% 0.2 264',
  hsl: '例: 220, 70%, 45%',
  hsla: '例: 220, 70%, 45%, 0.8',
}
