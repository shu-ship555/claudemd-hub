'use client'

import { useState } from 'react'
import { createConfigFile } from '@/app/dashboard/actions'

export function useSaveConfigFile(defaultFileName = 'DESIGN.md') {
  const [fileName, setFileName] = useState(defaultFileName)
  const [isSaving, setIsSaving] = useState(false)

  const save = async (content: string) => {
    if (!fileName.trim()) {
      alert('ファイル名を入力してください')
      return
    }
    setIsSaving(true)
    try {
      await createConfigFile(fileName, content)
      alert('DESIGN.md を保存しました')
      setFileName(defaultFileName)
    } catch (error) {
      console.error('Save error:', error)
      alert('保存に失敗しました')
    } finally {
      setIsSaving(false)
    }
  }

  return { fileName, setFileName, isSaving, save }
}
