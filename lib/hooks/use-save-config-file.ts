'use client'

import { useState, useEffect, useCallback } from 'react'
import { createConfigFile, getConfigFiles } from '@/app/dashboard/actions'
import { ERROR_MESSAGES } from '@/lib/constants'

const MAX_FILES = 10

export function useSaveConfigFile(defaultFileName = 'DESIGN.md') {
  const [fileName, setFileName] = useState(defaultFileName)
  const [isSaving, setIsSaving] = useState(false)
  const [fileCount, setFileCount] = useState<number | null>(null)

  const fetchCount = useCallback(async () => {
    try {
      const files = await getConfigFiles()
      setFileCount(files.length)
    } catch {
      // 未ログイン時はカウント不可能
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    getConfigFiles()
      .then((files) => { if (!cancelled) setFileCount(files.length) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  const save = async (content: string) => {
    if (!fileName.trim()) {
      alert(ERROR_MESSAGES.FILE_NAME_REQUIRED)
      return
    }
    if (fileCount !== null && fileCount >= MAX_FILES) {
      alert(ERROR_MESSAGES.SAVE_LIMIT_REACHED)
      return
    }
    setIsSaving(true)
    try {
      await createConfigFile(fileName, content)
      alert(ERROR_MESSAGES.SAVE_SUCCESS)
      setFileName(defaultFileName)
      await fetchCount()
    } catch (error) {
      console.error('Save error:', error)
      alert(ERROR_MESSAGES.SAVE_FAILED)
    } finally {
      setIsSaving(false)
    }
  }

  return { fileName, setFileName, isSaving, save, fileCount, maxFiles: MAX_FILES }
}
