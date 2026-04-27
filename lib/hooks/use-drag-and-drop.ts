import { useRef, useState } from 'react'

export function useDragAndDrop(onReorder: (from: number, to: number) => void) {
  const dragIndexRef = useRef<number | null>(null)
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const onDragStart = (i: number) => {
    dragIndexRef.current = i
    setDraggingIndex(i)
  }
  const onDragOver = (e: React.DragEvent, i: number) => {
    e.preventDefault()
    setDragOverIndex(i)
  }
  const onDrop = (e: React.DragEvent, i: number) => {
    e.preventDefault()
    const from = dragIndexRef.current
    if (from !== null && from !== i) onReorder(from, i)
    dragIndexRef.current = null
    setDraggingIndex(null)
    setDragOverIndex(null)
  }
  const onDragEnd = () => {
    dragIndexRef.current = null
    setDraggingIndex(null)
    setDragOverIndex(null)
  }

  return { draggingIndex, dragOverIndex, onDragStart, onDragOver, onDrop, onDragEnd }
}
