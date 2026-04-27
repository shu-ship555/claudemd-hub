'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { LoadingButton } from '@/components/custom/loading-button'
import { deleteConfigFile } from '@/app/actions'
import type { ConfigFile } from '@/app/actions'

export default function ConfigList({ configs }: { configs: ConfigFile[] }) {
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return
    setIsDeleting(true)
    try {
      await deleteConfigFile(deleteTargetId)
    } catch (error) {
      console.error('Delete error:', error)
    } finally {
      setIsDeleting(false)
      setDeleteTargetId(null)
    }
  }

  if (configs.length === 0) {
    return (
      <div className="text-muted-foreground">
        設定ファイルがまだありません。新しいファイルをアップロードしてください。
      </div>
    )
  }

  return (
    <>
      <div className="space-y-3">
        {configs.map((config) => (
          <Card key={config.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-base">{config.name}</CardTitle>
                  <CardDescription className="mt-1">
                    更新: {new Date(config.updated_at).toLocaleString('ja-JP')}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteTargetId(config.id)}
                  >
                    削除
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md bg-muted p-3 font-mono text-xs max-h-32 overflow-auto text-muted-foreground">
                {config.content}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={deleteTargetId !== null} onOpenChange={(open) => { if (!open) setDeleteTargetId(null) }}>
        <DialogContent className="pt-5.5 px-6 pb-6">
          <DialogHeader>
            <DialogTitle>ファイルを削除しますか？</DialogTitle>
            <DialogDescription>
              この操作は取り消せません。削除したファイルは復元できません。
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteTargetId(null)} disabled={isDeleting}>
              キャンセル
            </Button>
            <LoadingButton
              variant="ghost"
              className="text-destructive hover:text-destructive"
              onClick={handleConfirmDelete}
              isLoading={isDeleting}
              loadingText="削除中..."
            >
              削除する
            </LoadingButton>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
