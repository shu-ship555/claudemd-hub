export function hasValue(value: unknown): boolean {
  return typeof value === 'string' && value.trim() !== ''
}

export function toLines(raw: unknown): string[] {
  if (typeof raw !== 'string') return []
  return raw.split('\n').map((l) => l.trim()).filter(Boolean)
}

export function renderList(raw: unknown): string {
  return toLines(raw)
    .map((l) => (l.startsWith('-') ? l : `- ${l}`))
    .join('\n')
}
