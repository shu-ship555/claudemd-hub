'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createConfigFile } from './actions'

export default function UploadDialog() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState('')
  const [content, setContent] = useState('')

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
          <div className="space-y-2">
            <Label htmlFor="name">ファイル名</Label>
            <Input
              id="name"
              placeholder="例: claude.md, .agentic.md"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>
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
            <Button type="submit" disabled={isLoading}>
              {isLoading ? '保存中...' : '保存'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
