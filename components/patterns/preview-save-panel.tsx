'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { downloadTextFile } from '@/lib/download'
import type { SaveFeedback } from '@/lib/hooks/use-save-config-file'

interface PreviewSavePanelProps {
  fileNameInputId: string
  defaultFileName: string
  fileName: string
  setFileName: (name: string) => void
  fileCount: number | null
  maxFiles: number
  isSaving: boolean
  isLoggedIn: boolean
  isAuthLoading: boolean
  preview: string
  onSave: () => void
  feedback: SaveFeedback
  textareaRef?: React.Ref<HTMLTextAreaElement>
}

export function PreviewSavePanel({
  fileNameInputId,
  defaultFileName,
  fileName,
  setFileName,
  fileCount,
  maxFiles,
  isSaving,
  isLoggedIn,
  isAuthLoading,
  preview,
  onSave,
  feedback,
  textareaRef,
}: PreviewSavePanelProps) {
  return (
    <div className="space-y-5">
      <div className="lg:sticky lg:top-20 space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor={fileNameInputId}>ファイル名</Label>
            {fileCount !== null && (
              <span className={`text-xs font-mono ${fileCount >= maxFiles ? 'text-destructive' : 'text-muted-foreground'}`}>
                {fileCount} / {maxFiles}
              </span>
            )}
          </div>
          <Input
            id={fileNameInputId}
            placeholder={defaultFileName}
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            disabled={isSaving}
          />
        </div>

        <Textarea ref={textareaRef} value={preview} readOnly className="h-[calc(100vh-400px)] min-h-64 font-mono text-xs" />

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => downloadTextFile(fileName || defaultFileName, preview)} className="flex-1">
            ダウンロード
          </Button>
          {!isAuthLoading &&
            (isLoggedIn ? (
              <Button onClick={onSave} disabled={isSaving} className="flex-1">
                {isSaving ? '保存中...' : '保存'}
              </Button>
            ) : (
              <a href="/auth/login" className={cn(buttonVariants({ variant: 'default' }), 'flex-1 justify-center')}>
                ログインして保存
              </a>
            ))}
        </div>
        {feedback && (
          <p className={`text-xs leading-[160%] tracking-[0.04em] ${feedback.type === 'success' ? 'text-success' : 'text-destructive'}`}>
            {feedback.message}
          </p>
        )}
      </div>
    </div>
  )
}
