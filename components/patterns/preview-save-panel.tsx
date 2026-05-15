'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { downloadTextFile } from '@/lib/download'

interface PreviewSavePanelProps {
  fileNameInputId: string
  defaultFileName: string
  fileName: string
  setFileName: (name: string) => void
  fileCount: number | null
  maxFiles: number
  preview: string
  disabled?: boolean
  textareaRef?: React.Ref<HTMLTextAreaElement>
}

export function PreviewSavePanel({
  fileNameInputId,
  defaultFileName,
  fileName,
  setFileName,
  fileCount,
  maxFiles,
  preview,
  disabled,
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
          />
        </div>

        <Textarea ref={textareaRef} value={preview} readOnly className="h-[calc(100vh-400px)] min-h-64 font-mono text-xs" />

        <Button variant="outline" onClick={() => downloadTextFile(fileName || defaultFileName, preview)} disabled={disabled} className="w-full">
          ダウンロード
        </Button>
      </div>
    </div>
  )
}
