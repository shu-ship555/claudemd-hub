'use client'

import { useState } from 'react'
import { createConfigFile } from '@/app/dashboard/actions'

export function useSaveConfig() {
  const [isSaving, setIsSaving] = useState(false)

  const save = async (fileName: string, content: string): Promise<boolean> => {
    if (!fileName.trim()) {
      alert('ファイル名を入力してください')
      return false
    }
    setIsSaving(true)
    try {
      await createConfigFile(fileName, content)
      alert('DESIGN.md を保存しました')
      return true
    } catch {
      alert('保存に失敗しました')
      return false
    } finally {
      setIsSaving(false)
    }
  }

  return { isSaving, save }
}
