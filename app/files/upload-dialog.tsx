'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createConfigFile } from '@/app/actions'
import { useFormState } from '@/lib/hooks/use-form-state'
import { FormField } from '@/components/custom/form-field'
import { LoadingButton } from '@/components/custom/loading-button'

export default function UploadDialog() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const { error, isLoading, setError, setIsLoading } = useFormState()

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!name.trim()) {
      setError('ファイル名を入力してください')
      return
    }

    setError('')
    setIsLoading(true)
    try {
      await createConfigFile(name, content)
      setName('')
      setContent('')
      setOpen(false)
    } catch (err) {
      console.error('Create error:', err)
      setError('ファイルの作成に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>設定ファイルをアップロード</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl pt-5.5 px-6 pb-6">
        <DialogHeader>
          <DialogTitle>新しい設定ファイル</DialogTitle>
          <DialogDescription>
            Claude Codeの設定ファイルをアップロードまたは作成してください
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
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
            <Textarea
              id="content"
              placeholder="設定ファイルの内容を貼り付けてください..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isLoading}
              className="h-48 font-mono text-sm"
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
