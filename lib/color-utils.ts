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
  HEX: ' 1b61c9',
  rgb: ' 27, 97, 201',
  rgba: ' 27, 97, 201, 0.8',
  oklch: ' 55% 0.2 264',
  hsl: ' 220, 70%, 45%',
  hsla: ' 220, 70%, 45%, 0.8',
}

export function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return [0, 0, Math.round(l * 100)]
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h = 0
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
  else if (max === g) h = ((b - r) / d + 2) / 6
  else h = ((r - g) / d + 4) / 6
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}

export function hslToHex(h: number, s: number, l: number): string {
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }
  const sn = s / 100
  const ln = l / 100
  let r, g, b
  if (sn === 0) {
    r = g = b = ln
  } else {
    const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn
    const p = 2 * ln - q
    r = hue2rgb(p, q, h / 360 + 1 / 3)
    g = hue2rgb(p, q, h / 360)
    b = hue2rgb(p, q, h / 360 - 1 / 3)
  }
  const hex = (x: number) => Math.round(x * 255).toString(16).padStart(2, '0')
  return `#${hex(r)}${hex(g)}${hex(b)}`
}

export function getLuminance(hex: string): number {
  const ch = [hex.slice(1, 3), hex.slice(3, 5), hex.slice(5, 7)]
    .map((c) => parseInt(c, 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2]
}

export function getContrastRatio(hex1: string, hex2: string): number {
  const l1 = getLuminance(hex1)
  const l2 = getLuminance(hex2)
  const [light, dark] = l1 > l2 ? [l1, l2] : [l2, l1]
  return Math.round(((light + 0.05) / (dark + 0.05)) * 10) / 10
}

type ContrastLevel = 'aa' | 'aa-ui' | 'fail'

export function getContrastLevel(key: string, ratio: number): ContrastLevel {
  if (key === 'primary') return ratio >= 4.5 ? 'aa' : 'fail'
  return ratio >= 4.5 ? 'aa' : ratio >= 3 ? 'aa-ui' : 'fail'
}
