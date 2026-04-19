'use client'

import { useState } from 'react'
import { createConfigFile } from '@/app/dashboard/actions'
import { ERROR_MESSAGES } from '@/lib/constants'

export function useSaveConfigFile(defaultFileName = 'DESIGN.md') {
  const [fileName, setFileName] = useState(defaultFileName)
  const [isSaving, setIsSaving] = useState(false)

  const save = async (content: string) => {
    if (!fileName.trim()) {
      alert(ERROR_MESSAGES.FILE_NAME_REQUIRED)
      return
    }
    setIsSaving(true)
    try {
      await createConfigFile(fileName, content)
      alert(ERROR_MESSAGES.SAVE_SUCCESS)
      setFileName(defaultFileName)
    } catch (error) {
      console.error('Save error:', error)
      alert(ERROR_MESSAGES.SAVE_FAILED)
    } finally {
      setIsSaving(false)
    }
  }

  return { fileName, setFileName, isSaving, save }
}
