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
  white: '#ffffff',
  gray1: '#f0f0f0', gray2: '#e0e0e0', gray3: '#d0d0d0', gray4: '#c0c0c0', gray5: '#b0b0b0',
  gray6: '#808080', gray7: '#606060', gray8: '#404040', gray9: '#202020', gray10: '#101010',
  gray11: '#050505', gray12: '#010101',
  black: '#000000',
}

export const TEXT_STYLE_CATEGORIES = ['Dsp', 'Std', 'Dns', 'Oln', 'Mono'] as const
export const TEXT_STYLE_WEIGHTS = ['B', 'N'] as const

export const DEFAULT_TEXT_STYLES: Record<string, Record<string, string[]>> = {
  Dsp: {
    B: ['64B-140', '57B-140', '48B-140'],
    N: ['64N-140', '57N-140', '48N-140'],
  },
  Std: {
    B: ['45B-140', '36B-140', '32B-150', '28B-150', '26B-150', '24B-150', '22B-150', '20B-150', '18B-160', '17B-170', '16B-170', '16B-175'],
    N: ['45N-140', '36N-140', '32N-150', '28N-150', '26N-150', '24N-150', '22N-150', '20N-150', '18N-160', '17N-170', '16N-170', '16N-175'],
  },
  Dns: {
    B: ['17B-130', '17B-120', '16B-130', '16B-120', '14B-130', '14B-120'],
    N: ['17N-130', '17N-120', '16N-130', '16N-120', '14N-130', '14N-120'],
  },
  Oln: {
    B: ['17B-100', '16B-100', '14B-100'],
    N: ['17N-100', '16N-100', '14N-100'],
  },
  Mono: {
    B: ['17B-150', '16B-150', '14B-150'],
    N: ['17N-150', '16N-150', '14N-150'],
  },
}
