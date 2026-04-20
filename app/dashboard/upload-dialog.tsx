'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { createConfigFile } from './actions'
import { useFormState } from '@/lib/hooks/use-form-state'
import { FormField } from '@/components/ui/form-field'
import { LoadingButton } from '@/components/ui/loading-button'

export default function UploadDialog() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const { isLoading, setIsLoading } = useFormState()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!name.trim()) {
      alert('ファイル名を入力してください')
      return
    }

    setIsLoading(true)
    try {
      await createConfigFile(name, content)
      setName('')
      setContent('')
      setOpen(false)
    } catch (error) {
      console.error('Create error:', error)
      alert('ファイルの作成に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button>設定ファイルをアップロード</Button>} />
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>新しい設定ファイル</DialogTitle>
          <DialogDescription>
            Claude Codeの設定ファイルをアップロードまたは作成してください
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            id="name"
            label="ファイル名"
            placeholder="例: claude.md, .agentic.md"
            value={name}
            onChange={setName}
            disabled={isLoading}
          />
          <div className="space-y-2">
            <Label htmlFor="content">ファイル内容</Label>
            <textarea
              id="content"
              placeholder="設定ファイルの内容を貼り付けてください..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isLoading}
              className="w-full h-48 rounded-md border border-input bg-background px-3 py-2 font-mono text-sm"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              キャンセル
            </Button>
            <LoadingButton type="submit" isLoading={isLoading} loadingText="保存中...">
              保存
            </LoadingButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
