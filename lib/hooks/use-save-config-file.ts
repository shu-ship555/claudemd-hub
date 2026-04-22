'use client'

import { useState, useEffect, useCallback } from 'react'
import { createConfigFile, getConfigFiles } from '@/app/dashboard/actions'
import { useAuth } from '@/lib/hooks/use-auth'
import { ERROR_MESSAGES } from '@/lib/constants'

const MAX_FILES = 10

export type SaveFeedback = { message: string; type: 'success' | 'error' } | null

export function useSaveConfigFile(defaultFileName = 'DESIGN.md') {
  const [fileName, setFileName] = useState(defaultFileName)
  const [isSaving, setIsSaving] = useState(false)
  const [fileCount, setFileCount] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<SaveFeedback>(null)
  const { isLoggedIn } = useAuth()

  const fetchCount = useCallback(async () => {
    if (!isLoggedIn) return
    try {
      const files = await getConfigFiles()
      setFileCount(files.length)
    } catch {
      // ignore
    }
  }, [isLoggedIn])

  useEffect(() => {
    if (!isLoggedIn) return
    let cancelled = false
    getConfigFiles()
      .then((files) => { if (!cancelled) setFileCount(files.length) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [isLoggedIn])

  useEffect(() => {
    if (!feedback) return
    const timer = setTimeout(() => setFeedback(null), 4000)
    return () => clearTimeout(timer)
  }, [feedback])

  const save = async (content: string) => {
    if (!fileName.trim()) {
      setFeedback({ message: ERROR_MESSAGES.FILE_NAME_REQUIRED, type: 'error' })
      return
    }
    if (fileCount !== null && fileCount >= MAX_FILES) {
      setFeedback({ message: ERROR_MESSAGES.SAVE_LIMIT_REACHED, type: 'error' })
      return
    }
    setIsSaving(true)
    try {
      await createConfigFile(fileName, content)
      setFeedback({ message: ERROR_MESSAGES.SAVE_SUCCESS, type: 'success' })
      setFileName(defaultFileName)
      await fetchCount()
    } catch (error) {
      console.error('Save error:', error)
      setFeedback({ message: ERROR_MESSAGES.SAVE_FAILED, type: 'error' })
    } finally {
      setIsSaving(false)
    }
  }

  return { fileName, setFileName, isSaving, save, fileCount, maxFiles: MAX_FILES, feedback }
}
