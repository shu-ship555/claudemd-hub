'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { deleteConfigFile } from './actions'
import type { ConfigFile } from './actions'

export default function ConfigList({ configs }: { configs: ConfigFile[] }) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('このファイルを削除してもよろしいですか？')) return

    setIsDeleting(id)
    try {
      await deleteConfigFile(id)
    } catch (error) {
      console.error('Delete error:', error)
      alert('削除に失敗しました')
    } finally {
      setIsDeleting(null)
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
                  disabled={isDeleting === config.id}
                  onClick={() => handleDelete(config.id)}
                >
                  {isDeleting === config.id ? '削除中...' : '削除'}
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
  )
}
