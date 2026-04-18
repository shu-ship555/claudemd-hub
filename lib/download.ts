export function downloadTextFile(
  filename: string,
  content: string,
  mimeType = 'text/markdown',
): void {
  const element = document.createElement('a')
  const file = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(file)
  element.href = url
  element.download = filename
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
  URL.revokeObjectURL(url)
}
