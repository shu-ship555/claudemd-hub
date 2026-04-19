export const LATIN_FONTS = ['Helvetica', 'Arial', 'San Francisco', 'Roboto', 'Inter']

export const JAPANESE_FONTS = ['Yu Gothic', 'Meiryo', 'Noto Sans JP']

export const SPACING_BASE_OPTIONS = ['4px', '6px', '8px', '16px']

export const SPACING_SCALES: Record<string, number[]> = {
  '4px': [
    1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 24, // 共通
    28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96, 112, 128, 160, 240, 320, 480, 640, 960, 1920
  ],
  '6px': [
    1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 24, // 共通
    30, 36, 42, 48, 54, 60, 72, 90, 120, 144, 180, 240, 320, 480, 640, 960, 1920
  ],
  '8px': [
    1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 24, // 共通
    32, 40, 48, 56, 64, 80, 128, 160, 240, 320, 480, 640, 960, 1920
  ],
  '16px': [
    1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 24, // 共通
    32, 48, 64, 96, 128, 160, 320, 480, 640, 960, 1920
  ],
}

export const ERROR_MESSAGES = {
  FILE_NAME_REQUIRED: 'ファイル名を入力してください',
  SAVE_SUCCESS: 'DESIGN.md を保存しました',
  SAVE_FAILED: '保存に失敗しました',
}

export const LIGHT_COLORS = {
  bg: '#ebf1ff', surface: '#ffffff', border: '#d1daf5', primary: '#1a4fd6',
  secondary: '#3b65ce', tertiary: '#0d38a5',
  text: '#0f1e3d', muted: '#5a6a9a', success: '#16a34a', warning: '#d97706',
  danger: '#dc2626', orange: '#ea580c', info: '#0284c7',
  gray0: '#ffffff', gray1: '#e3e3e3', gray2: '#c7c7c7', gray3: '#ababab', gray4: '#8f8f8f',
  gray5: '#737373', gray6: '#575757', gray7: '#3b3b3b', gray8: '#1f1f1f', gray9: '#000000',
}
